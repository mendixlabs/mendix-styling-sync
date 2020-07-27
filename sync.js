const syncFolders = require('sync-folders');
const shell = require('shelljs');
const path = require('path');
const { cyanBright, green, greenBright, redBright } = require('ansi-colors');

require('dotenv').config();

const sourceThemeFolder = 'theme';
const sourceFolder = process.env.THEME_PATH;

const sourceCopyFolder = path.join(sourceFolder, sourceThemeFolder);
const localCopy = path.resolve('./theme');

const validSource = () => {
    const res = shell.test('-d', sourceCopyFolder);
    return res;
}

const cleanTargetFolder = () => {
    console.log('Cleaning target folder');
    if (!shell.test('-d', localCopy)) {
        return;
    }
    shell.rm('-r',localCopy);
}

const copySourceToTarget = () => {
    console.log(`Copy files from ${sourceCopyFolder}`)
    shell.cp('-r', sourceCopyFolder, localCopy);
}


const syncAndWatch = () => {
    console.log(`Starting sync between ${sourceCopyFolder} and ${localCopy}`)
    syncFolders(localCopy, sourceFolder, {
        watch: true,
        ignore: [
            /node_modules/,
            /.svn/
        ],
        verbose: true,
        bail: true,
        type: 'copy',
        onSync: ({ type, relativePath }) => {
            console.log(`Sync '${cyanBright(type)}' --- ${green(relativePath)}`);
        },
        onUpdate: ({ type, path }) => {
            switch (type) {
                case 'add':
                  console.log(`${greenBright.bold('Added')} - ${green(path)}`);
                  break;
                case 'change':
                  console.log(`${cyanBright.bold('Updated')} - ${green(path)}`);
                  break;
                case 'unlink':
                  console.log(`${redBright.bold('Removed')} - ${green(path)}`);
                  break;
                case 'unlinkDir':
                  console.log(`${redBright.bold('Removed directory')} - ${green(path)}`);
                  break;
              }
        },
    })
}

(async () =>  {
    if (!validSource()) {
        console.log(`Source folder '${sourceCopyFolder}' doesn't seem to exist`);
        return;
    }
    cleanTargetFolder();
    copySourceToTarget();
    syncAndWatch();
})()
