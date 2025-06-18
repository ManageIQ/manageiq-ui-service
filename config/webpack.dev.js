/* eslint-disable no-console */

const fs = require('fs')
const path = require('path')
const webpack = require('webpack')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin')

// To download the noVNC viewer
const SaveRemoteFilePlugin = require('save-remote-file-webpack-plugin')
const execSync = require('child_process').execSync

const root = path.resolve(__dirname, '../client')
const outputPath = process.env.BUILD_OUTPUT || '../../manageiq/public/ui/service'
const dist = path.resolve(__dirname, outputPath)
const nodeModules = path.resolve(__dirname, '../node_modules')
const protocol = process.env.PROXY_PROTOCOL || 'http://'
const host = process.env.PROXY_HOST || '[::1]:3000'
const hasSkinImages = fs.existsSync(`${root}/skin/images`)
const appBasePath = process.env.NODE_ENV === 'production' ? '/ui/service/' : '/'

console.log('Backend proxied on ' + protocol + host)

module.exports = {
  mode: 'development',

  context: root,
  entry: {
    app: './app.js',
    console_webmks: './console/webmks.js'
  },

  output: {
    chunkFilename: 'js/[name]-[contenthash].chunk.js',
    filename: 'js/[name]-[contenthash].js',
    path: dist
  },

  devServer: {
    static: './',
    historyApiFallback: true,
    port: 3001,
    proxy: [
      {
        context: ['/api', '/pictures', '/webmks'],
        target: `${protocol}${host}`,
        secure: false,
      },
      {
        context: ['/ws'],
        target: `ws://${host}`,
        ws: true,
      }
    ]
  },

  // Output source maps suitable for development
  devtool: 'inline-cheap-module-source-map',

  module: {

    // The rules teach webpack how to resolve different files that are
    // required/imported. Files are resolved by matching their filenames against
    // the test regexes and applying the loaders listed in reverse order. See
    // each loaders README for information on their options.
    rules: [

      // html templates
      {
        test: /\.html$/,
        use: [
          `raw-loader`,
        ],
      },

      // js loaders: transpile based on browserslist from package.json
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: [
          'ng-annotate-loader?ngAnnotate=ng-annotate-patched',
          'babel-loader',
          'eslint-loader',
        ]
      },

      // font/images loaders: if smaller than limit embed as data uri
      {
        test: /\.(png|jpg|gif|svg|woff|ttf|eot)/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 20480,
              name: 'styles/[contenthash].[ext]',

              // Determine publicPath dynamically because in production, assets
              // must be relative to `/ui/service/`
              publicPath: (url) => {
                const path = process.env.NODE_ENV === 'production' ? '/ui/service/' : '/'

                return path + url
              }
            }
          }
        ]
      },

      // css loaders: extract styles to a separate bundle
      {
        test: /\.(css)$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader?importLoaders=1',
          'postcss-loader',
        ],
      },
      {
        test: /\.(sass|scss)$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              importLoaders: 1,
              url: (url) => {
                // manageiq/public/upload/
                if (url.match(/^\/upload\//)) {
                  return false;
                }

                // manageiq/public/ui/service/images/ from client/assets/images
                if (url.startsWith(`${appBasePath}images/`)) {
                  return false;
                }

                // try to resolve/error everything else
                return true;
              },
            },
          },
          'resolve-url-loader',
          {
            loader: 'sass-loader',
            options: {
              additionalData: `$img-base-path: '${appBasePath}'`,
              sassOptions: {
                includePaths: [
                  `${root}/assets/sass`,
                  `${nodeModules}/bootstrap-sass/assets/stylesheets`,
                  `${nodeModules}/patternfly/dist/sass/patternfly`,
                  `${nodeModules}/font-awesome/scss`,
                  `${nodeModules}/@manageiq/font-fabulous/assets/stylesheets`,
                ],
              },
            },
          },
        ],
      },
    ],
  },

  plugins: [

    // Extract 'styles.css' after being processed by loaders into a single bundle
    new MiniCssExtractPlugin({
      filename: 'styles/[name]-[contenthash].css',
    }),

    // Copy all public assets to webpack's processing context
    new CopyWebpackPlugin({
      patterns: [
        {from: `${root}/assets`},
        {from: `${root}/gettext`, to: 'gettext'},
        {from: `${nodeModules}/@novnc/novnc`, to: 'vendor/noVNC'},
        {from: `${nodeModules}/spice-html5-bower`, to: 'vendor/spice-html5-bower'},

        // Override images with skin replacements if they exist
        hasSkinImages && {from: `${root}/skin/images`, to: 'images', force: true},
      ].filter((x) => !!x),
    }),

    // noVNC doesn't package the vnc_lite viewer that we need, so we have to
    // fetch it separately.
    new SaveRemoteFilePlugin({
      // HACK: Temporarily hardcoded the version number for @novnc/novnc, because
      //       the following, which works locally, does not work for some reason
      //       in CI.  Any changes to package.json for this package will also
      //       need to be changed here.
      // url: `https://raw.githubusercontent.com/novnc/noVNC/v${execSync(`yarn info --name-only @novnc/novnc | cut -d ':' -f 2 | tr -d '\n'`, {encoding: 'utf-8'})}/vnc_lite.html`,
      url: `https://raw.githubusercontent.com/novnc/noVNC/v1.2.0/vnc_lite.html`,

      filepath: 'vendor/noVNC/vnc_lite.html',
      hash: false
    }),

    // Generate index.html from template with script/link tags for bundles
    new HtmlWebpackPlugin({
      base: '/',
      template: '../client/index.ejs',
      chunks: ['app']
    }),

    new HtmlWebpackPlugin({
      filename: 'console/webmks.html',
      template: '../client/console/common.ejs',
      chunks: ['console_webmks']
    }),

    new webpack.ContextReplacementPlugin(
      /(.+)?angular(\\|\/)core(.+)?/,
      root
    )
  ],

  resolve: {
    extensions: ['.js'],
    symlinks: false,
    alias: {
      'bootstrap-select': '@pf3/select',
      '/version.json': fs.existsSync(`${root}/version/version.json`) ? `${root}/version/version.json` : false,
    },
  },

  // Disables noisy performance warnings. While the warnings are important, it
  // is not feasible to satisfy the recommendations until we start code splitting
  performance: {
    hints: false
  },

  watchOptions: {
    ignored: ['**/.*.sw[po]'],
  },

  optimization: {
    minimize: false,
  },
}
