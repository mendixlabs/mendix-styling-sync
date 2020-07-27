const path = require('path');
const fs = require('fs');
const stream = require('stream');
const { promisify } = require('util');

const syncFolders = require('sync-folders');
const shell = require('shelljs');
const meow = require('meow');
const got = require('got');
const gunzip = require('gunzip-maybe');
const tar = require('tar-fs');
const dirCompare = require('dir-compare');
const { cyanBright, green, greenBright, redBright } = require('ansi-colors');

require('dotenv').config();

/**
 * SYNC
 */

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

const copy = () => {
    if (!validSource()) {
        console.log(`Source folder '${sourceCopyFolder}' doesn't seem to exist`);
        return false;
    }
    cleanTargetFolder();
    copySourceToTarget();
    return true;
}

const sync = () => {
    copy() && syncAndWatch();
}

/**
 * Atlas UI
 */

const pipeline = promisify(stream.pipeline);
const localAtlasUI = path.resolve('./atlasui');
const localSourceTar = path.join(localAtlasUI, 'release.tar.gz');

const copyAtlasUI = async () => {
    if (!process.env.THEME_ATLAS_UI_VERSION) {
        console.log(`Please define your AtlasUI version in .env as THEME_ATLAS_UI_VERSION="x.x.x". You can find this in the manifest.json file in your project root`);
        return;
    }

    // TS since 2.5.5

    if (shell.test('-d', localAtlasUI)) {
        shell.rm('-r',localAtlasUI);
    }
    shell.mkdir('-p', localAtlasUI);

    const version = (process.env.THEME_ATLAS_UI_VERSION || "").trim();
    const releaseSource = `https://github.com/mendix/Atlas-UI-Framework/archive/${version}.tar.gz`;
    const extractFolder = `Atlas-UI-Framework-${version}`

    try {
        await pipeline(
            got.stream(releaseSource),
            fs.createWriteStream(localSourceTar)
        );

        await fs.createReadStream(localSourceTar)
            .pipe(gunzip())
            .pipe(tar.extract(localAtlasUI, {
                map: (header) => {
                    header.name = header.name.replace(`${extractFolder}/`, '');
                    return header;
                }
            }));

        shell.rm(localSourceTar);

    } catch (error) {
        console.error(error);
        return;
    }
}

/**
 * Compare
 */

const compare = async () => {
    console.log('Diff viewer not ready yet!');

    if (!shell.test('-d', localCopy)) {
        console.log(`You will first need to copy the source folder. Please run the 'copy' command`);
    }
    if (!shell.test('-d', localAtlasUI)) {
        console.log(`You will first need to download the Atlas UI framework. Please run the 'atlasui' command`);
    }

    try {
        const compared = await dirCompare.compare(localAtlasUI, localCopy, {
            compareDate: false,
            excludeFilter: '.DS_Store,.gitignore,.prettierrc,.stylelintrc'
        });

        if (compared.diffSet) {
            compared.diffSet.forEach(diff => {
                if (diff.state !== 'equal') {
                    console.log(diff);
                }
            })
        }
    } catch (error) {
        console.log('We have an error1', error);
    }
}


/**
 * MAIN
 */

(() => {
    const cli = meow(`
        Usage
        $ node sync.js <command>

        Commands
        start : Start the sync
        copy : Copy source folder
        atlasui : Download Atlas UI source
        compare: Compare theme to atlas
    `, {

    });

    const command = (cli.input[0] || "").trim();

    if (command === 'start') {
        return sync();
    }
    if (command === 'copy') {
        return copy();
    }
    if (command === 'atlasui') {
        return copyAtlasUI();
    }
    if (command === 'compare') {
        return compare();
    }

    console.log(cli.help);
})();
