const fs = require('fs');
const https = require('https');
const path = require('path');

class DownloadNoVNCPlugin {
  constructor(options = {}) {
    const novncVersion = require('@novnc/novnc/package.json')?.version;
    
    this.targetFile = 'vnc_lite.html';
    this.url = options.url || `https://raw.githubusercontent.com/novnc/noVNC/v${novncVersion}/${this.targetFile}`;
    this.outputPath = options.outputPath || `vendor/noVNC/${this.targetFile}`;
    this.downloaded = false;
  }

  apply(compiler) {
    // Use 'afterEmit' hook to download AFTER webpack has written all files
    // This ensures CleanWebpackPlugin doesn't delete our file
    compiler.hooks.afterEmit.tapAsync('DownloadNoVNCPlugin', (compilation, callback) => {
      // Only download once per build (prevents duplicate downloads if hook fires multiple times during HMR)
      if (this.downloaded) {
        console.log(`\n✓ ${this.targetFile} already downloaded in this build session`);
        callback();
        return;
      }

      const fullOutputPath = path.join(compiler.options.output.path, this.outputPath);
      
      // Skip download if file already exists (e.g., from previous build or when switching between yarn build/start)
      if (fs.existsSync(fullOutputPath)) {
        console.log(`\n✓ ${this.targetFile} already exists, skipping download`);
        this.downloaded = true;
        callback();
        return;
      }
      
      console.log(`\n⬇ Downloading ${this.targetFile} from:`, this.url);
      
      // Create directory if it doesn't exist
      fs.mkdirSync(path.dirname(fullOutputPath), { recursive: true });
      console.log('Creating write stream to:', fullOutputPath);
      const file = fs.createWriteStream(fullOutputPath);
      
      https.get(this.url, (response) => {
        if (response.statusCode !== 200) {
          const error = new Error(`Failed to download: HTTP ${response.statusCode}`);
          console.error('✗', error.message);
          callback(error);
          return;
        }
    
        response.pipe(file);
        
        file.on('finish', () => {
          file.close();
          this.downloaded = true;
          callback();
        });
        
        file.on('error', (err) => {
          console.error('✗ File write error:', err.message);
          fs.unlink(fullOutputPath, () => {});
          callback(err);
        });
      }).on('error', (err) => {
        console.error('✗ HTTPS request error:', err.message);
        fs.unlink(fullOutputPath, () => {});
        callback(err);
      });
    });
  }
}

module.exports = DownloadNoVNCPlugin;
