const fs = require('fs');
const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ExtractTextWebpackPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const root = path.resolve(__dirname, '../client');
const dist = path.resolve(__dirname, '../../manageiq/public/ui/service');
const nodeModules = path.resolve(__dirname, '../node_modules');
const host = process.env.PROXY_HOST || process.env.MOCK_API_HOST || '[::1]:3000'
const hasSkinImages = fs.existsSync(`${root}/skin/images`);
console.log("Backend proxied on "+host);

module.exports = {
  context: root,
  entry: {
    app: './app.js',
  },

  output: {
    chunkFilename: 'js/[name]-[hash].chunk.js',
    filename: 'js/[name]-[hash].js',
    path: dist,
  },

  devServer: {
    contentBase: root,
    historyApiFallback: true,
    port: 3001,
    proxy: {
      '/api': {
        target: `http://${host}`,
      },
      '/pictures': {
        target: `http://${host}`,
      },
      '/ws': {
        target: `ws://${host}`,
        ws: true,
      },
    },
  },

  // Output source maps suitable for development
  devtool: 'cheap-module-inline-source-map',

  module: {

    // The rules teach webpack how to resolve different files that are
    // required/imported. Files are resolved by matching their filenames against
    // the test regexes and applying the loaders listed in reverse order. See
    // each loaders README for information on their options.
    rules: [

      // html loaders: populate angular's templateCache
      {
        test: /\.html$/,
        use: [
          `ngtemplate-loader?module=app.core&relativeTo=${root}/`,
          `html-loader?attrs=false&minimize=true`,
        ],
      },

      // js loaders: transpile based on browserslist from package.json
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: [
          'ng-annotate-loader',
          'babel-loader?presets[]=env',
          'eslint-loader',
        ],
      },

      // font/images loaders: if smaller than limit embed as data uri
      {
        test: /\.(png|jpg|gif|svg|woff|ttf|eot)/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 20480,
              name: 'styles/[hash].[ext]',

              // Determine publicPath dynamically because in production, assets
              // must be relative to `/ui/service/`
              publicPath: url => {
                const path = process.env.NODE_ENV === 'production' ? '/ui/service/' : '/';
                return path + url;
              },
            },
          },
        ],
      },

      // css loaders: extract styles to a separate bundle
      {
        test: /\.(css|s(a|c)ss)$/,
        use: ExtractTextWebpackPlugin.extract({
          fallbackLoader: 'style-loader',
          allChunks: true,
          loader: [
            'css-loader?importLoaders=2&sourceMap=true',
            'postcss-loader',
            {
              loader: 'sass-loader',
              options: {
                sourceMap: true,
                includePaths: [
                  `${nodeModules}/bootstrap-sass/assets/stylesheets`,
                  `${nodeModules}/patternfly-sass/assets/stylesheets`,
                  `${nodeModules}/font-awesome/scss`,
                ],
              },
            },
          ],
        }),
      },
    ],
  },

  plugins: [

    // Extract 'styles.css' after being processed by loaders into a single bundle
    new ExtractTextWebpackPlugin('styles/[name]-[hash].css'),

    // Copy all public assets to webpack's processing context
    new CopyWebpackPlugin([
      {from: `${root}/assets`},
      {from: `${root}/gettext`, to: 'gettext'},
      {from: `${nodeModules}/no-vnc`, to: 'vendor/no-vnc'},
      {from: `${nodeModules}/spice-html5-bower`, to: 'vendor/spice-html5-bower'},

      // Override images with skin replacements if they exist
      {from: hasSkinImages ? `${root}/skin/images` : '', to: 'images', force: true},
    ]),

    // Generate index.html from template with script/link tags for bundles
    new HtmlWebpackPlugin({
      base: '/',
      template: '../client/index.ejs',
    }),
  ],

  // Disables noisy performance warnings. While the warnings are important, it
  // is not feasible to satisfy the recommendations until we start code splitting
  performance: {
    hints: false,
  },
};
