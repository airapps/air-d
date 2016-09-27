/**
 * Created by buhe on 16/9/27.
 */

let JsonFile = require('@exponent/json-file');

import targz from 'tar.gz';
import download from 'download';
import existsAsync from 'exists-async';
import fs from 'fs';
import mkdirp from 'mkdirp';
import UserSettings from './UserSettings';


const START_KIT_URL = "http://oe5m8zjml.bkt.clouddn.com/air-startkit.zip";
const APK_URL = "";
const IPA_URL = "";


export async function _extractWindowsAsync(archive, starterAppName, dir) {
  let dotExponentHomeDirectory = UserSettings.dotExponentHomeDirectory();
  let tmpDir = path.join(dotExponentHomeDirectory, 'starter-app-cache', 'tmp');
  let tmpFile = path.join(tmpDir, `${starterAppName}.tar`);
  let binary = path.join(Binaries.getBinariesPath(), '7z1602-extra', '7za');
  try {
    await spawnAsync(binary, ['x', archive, '-aoa', `-o${tmpDir}`]);
    await spawnAsync(binary, ['x', tmpFile, '-aoa', `-o${dir}`]);
  } catch (e) {
    console.error(e.message);
    console.error(e.stderr);
    throw e;
  }
}

export async function _extractAsync(archive, starterAppName, dir) {
  try {
    if (process.platform === 'win32') {
      await _extractWindowsAsync(archive, starterAppName, dir);
    } else {
      await spawnAsync('tar', ['-xvf', archive, '-C', dir], {
        stdio: 'inherit',
        cwd: __dirname,
      });
    }
  } catch (e) {
    // tar.gz node module doesn't work consistently with big files, so only
    // use it as a backup.
    console.error(e.message);
    await targz().extract(archive, dir);
  }
}

export function _starterAppCacheDirectory() {
  let dotExponentHomeDirectory = UserSettings.dotExponentHomeDirectory();
  let dir = path.join(dotExponentHomeDirectory, 'starter-app-cache');
  mkdirp.sync(dir);
  return dir;
}

export async function _downloadStarterAppAsync(name) {
  //let versions = await Api.versionsAsync();
  //let starterAppVersion = versions.starterApps[name].version;
  //let starterAppName = `${name}-${starterAppVersion}`;
  //let filename = `${starterAppName}.tar.gz`;
  let filename = 'air-startkit.zip';
  let starterAppPath = path.join(_starterAppCacheDirectory(), filename);

  if (await existsAsync(starterAppPath)) {
    return {
      starterAppPath,
      starterAppName,
    };
  }

  //let url = `https://s3.amazonaws.com/exp-starter-apps/${filename}`;
  await new download().get(START_KIT_URL).dest(_starterAppCacheDirectory()).promise.run();
  return {
    starterAppPath,
    starterAppName,
  };
}

export async function newProject(selectedDir, name) {

  let root = path.join(selectedDir, name);
  let fileExists = true;
  try {
    // If file doesn't exist it will throw an error.
    // Don't want to continue unless there is nothing there.
    fs.statSync(root);
  } catch (e) {
    fileExists = false;
  }

  if (fileExists) {
    throw new Error(`That directory already exists. Please choose a different parent directory or project name. (${root})`);
  }

  // Download files
  await mkdirp.promise(root);

  let { starterAppPath, starterAppName } = await _downloadStarterAppAsync('default');

  // Extract files
  await _extractAsync(starterAppPath, starterAppName, root);

  // Update files

  let packageJsonFile = new JsonFile(path.join(root, 'package.json'));
  let packageJson = await packageJsonFile.readAsync();
  packageJson = Object.assign(packageJson);

  let data = Object.assign(packageJson, {
    name,
    version: '0.0.0',
    description: "Hello Air Apps!",
    author,
  });

  await packageJsonFile.writeAsync(data);

  // Custom code for replacing __NAME__ in main.js
  let mainJs = await fs.readFile.promise(path.join(root, 'main.js'), 'utf8');
  let customMainJs = mainJs.replace(/__NAME__/g, data.name);
  await fs.writeFile.promise(path.join(root, 'main.js'), customMainJs, 'utf8');

  return root;
}
//Start project
export async function startProject(selectedDir){

}