const process = require('process');
const { spawn } = require('child_process');
const fs = require('fs');

const util = {
  getCommand() {
    let cmd = 'npm';
    process.argv.forEach((command) => {
      if (command === '--yarn') {
        cmd = 'yarn';
      }
    });
    if (process.platform === 'win32') {
      cmd += '.cmd';
    }
    return cmd;
  },
  getFiles: (dir) => {
    const files = {};
    fs.readdirSync(dir).forEach((file) => {
      files[file] = file;
    });
    return files;
  },
  isHtml: (filename) => {
    const splitted = filename.split('.');
    return splitted[1] === 'html';
  }
};

const server = {
  process: null,
  files: [],
  start: () => {
    const cmd = util.getCommand();
    this.process = spawn(cmd, ['run', 'serve'], { stdio: 'inherit' });
    console.log('WEBPACK STARTED');
  },
  restart: () => {
    console.log('WEBPACK RESTART');
    this.process.kill();
    this.start();
  },
  watch: (dir) => {
    this.files = util.getFiles(dir);
    this.start();
    fs.watch(dir, { recursive: true }, (eventType, filename) => {
      if (filename && eventType === 'rename') {
        if (util.isHtml(filename)) {
          if (!this.files[filename]) {
            console.log('file created or deleted', filename);
            this.files = util.getFiles(dir);
            this.restart();
          }
        }
      }
    });
  }
};

server.watch('./src/html');
