const {electron, app, BrowserWindow, ipcMain, dialog, Notification} = require('electron');
var exec = require('child_process').exec, child;
const log = require('electron-log'); //electron log function
const keys = require('./keys');
const fs = require('fs');
const Store = require('jfs');
const os = require('os');
const homedir = require('os').homedir();
const express = require('express');
const pty = require('node-pty');
let cmd = '';
const userDataPath = app.getPath('userData');
const configData = new Store(userDataPath + '/config/config.json');

function createWindow() {
  let win = new BrowserWindow({
    width: 700,
    height: 600,
    titleBarStyle: 'hiddenInset',
    movable: true,
    show: false
  })

  // TODO:
    // Need to create script to put gulp file in userDataPath and npm install required modules

  win.loadFile('index.html')
  // win.webContents.openDevTools()

  let splash = new BrowserWindow({
    width: 500,
    height: 500,
    transparent: true,
    frame: false,
    alwaysOnTop: true
  })

  splash.loadFile('splash.html')

  function load() {
    splash.destroy()
    win.show()
  }

  setTimeout(
    load,
    3000
  )

  function checkPath() {
    var data = fs.readFileSync(userDataPath + '/config/config.json', 'utf-8')
    var db = JSON.parse(data)
    let path = db.path;
    let token = db.token;

    if (token) {

      if(path) {
      } else {
        // var npmScript = 'npm install --save autoprefixer browser-sync cors csswring gulp gulp-cache-bust gulp-concat gulp-connect gulp-ext-replace gulp-htmlmin gulp-imagemin gulp-jsmin gulp-notify gulp-plumber gulp-postcss gulp-pug gulp-sass gulp-sass-lint gulp-wait http-proxy-middleware run-sequence yargs';
        // var cmd = 'cd ' + userDataPath + '/config && ' + npmScript;
        //        var makeGulp = 'echo "const gulp = require( \'gulp\' ),runSequence = require(\'run-sequence\'),sass = require(\'gulp-sass\'), sassLint = require(\'gulp-sass-lint\'),notify = require(\'gulp-notify\'),plumber = require(\'gulp-plumber\'),proxy = require(\'http-proxy-middleware\'),cachebust = require(\'gulp-cache-bust\'),imagemin = require(\'gulp-imagemin\'),autoprefixer = require(\'autoprefixer\'),csswring = require(\'csswring\'),browserSync = require(\'browser-sync\').create(),concat = require(\'gulp-concat\'),jsmin = require(\'gulp-jsmin\'),connect = require(\'gulp-connect\'),homedir = require(\'os\').homedir(),fs = require(\'fs\'),argv = require(\'yargs\').argv,cors = require(\'cors\'),postcss = require(\'gulp-postcss\'),htmlmin = require(\'gulp-htmlmin\'); var siteID = argv.siteID;var localsite = "http://localhost:" + siteID;var siteURL = argv.siteURL;var filePath = argv.filePath;var jsFiles = argv.jsFiles;var options = {target: siteURL,changeOrigin: true};gulp.task(\'server\', function() {connect.server({root: filePath + \'/\',port: siteID,middleware: function() {return [proxy(options)]},});});gulp.task(\'file-server\', function() {connect.server({root: filePath + \'/\',port: 3000,middleware: function() {return [cors()]},});});gulp.task(\'inject\', [\'styles\'], function() {browserSync.init({proxy: localsite,online: true});gulp.watch(filePath + \'/CSS/**/*.scss\', [\'styles\']);gulp.watch(filePath + \'/MasterPages/includes/*.inc\').on(\'change\', browserSync.reload);gulp.watch(filePath + \'/js/*.js\', [\'js\']).on(\'change\', browserSync.reload);});var onError = function(err) {notify.onError({message:  \'Error: <%= error.message %>\',sound: \'Basso\',wait: false})(err);var file = fs.createWriteStream(\'lint-logs/sass-lint.txt\');output = err.toString();file.write( output);file.end();this.emit(\'end\');};notify.on(\'click\', function(notifierObject, options) {});const processors = [csswring,autoprefixer({browsers:[\'last 2 version\']})]gulp.task(\'styles\', function() {return gulp.src(filePath + \'/CSS/master.scss\');.pipe(plumber({errorHandler: onError}));.pipe(sass().on(\'error\', sass.logError));.pipe(postcss(processors));.pipe(gulp.dest(filePath + \'/CSS/\'));.pipe(browserSync.stream());.pipe(notify({ message: \'Styles task complete\' }));});gulp.task(\'styles-local\', function() {return gulp.src(\'CSS/master.scss\');.pipe(plumber({errorHandler: onError}));.pipe(sass());.pipe(postcss(processors));.pipe(gulp.dest(\'CSS/\'));});gulp.task(\'sass-lint\', function() {var file = fs.createWriteStream(\'lint-logs/sass-lint.html\');gulp.src(filePath + \'/CSS/**/*.scss\');.pipe(sassLint({options: {configFile: \'CSS/sass-lint/sass-lint.yml\',formatter: \'html\'}}));.pipe(sassLint.format(file));stream.on(\'finish\', function() {file.end();});return stream;});gulp.task(\'minifymaster\', function() {return gulp.src(filePath + \'masterpages/*.master\');.pipe(htmlmin({collapseWhitespace: true,minifyJS:true}));.pipe(gulp.dest(filePath + \'masterpages/\'));});gulp.task(\'concat\', function() {var jsFileWithPath = [];var jsArray = JSON.parse(jsFiles);for (i = 0; i < jsArray.length; i++) {jsFileWithPath[i] = filePath + jsArray[i]} return gulp.src(jsFileWithPath);.pipe(concat(\'concat-helper.js\'));.pipe(gulp.dest(filePath + \'/js/\'));});gulp.task(\'minifyJS\', function() {gulp.src(filePath + \'/js/concat-helper.js\');.pipe(jsmin());.pipe(gulp.dest(filePath + \'/js/\'));})gulp.task(\'js\', function() {runSequence(\'concat\', \'minifyJS\');})gulp.task(\'cache-bust\', function() {return gulp.src(filePath + \'/masterpages/includes/head.inc\').pipe(cachebust({type: \'timestamp\'})).pipe(gulp.dest(filePath + \'/masterpages/includes/\'));})gulp.task(\'image-min\', function() {gulp.src(filePath + \'CSS/images/*\');.pipe(imagemin([imagemin.gifsicle({interlaced: true}),imagemin.jpegtran({progressive: true}),imagemin.optipng({optimizationLevel: 5}),imagemin.svgo({plugins: [{removeViewBox: true},{cleanupIDs: false}]})]));.pipe(gulp.dest(filePath + \'CSS/images\'))});gulp.task(\'watch\', function() {gulp.watch(\'CSS/*/*.scss\', [\'styles-local\'])})gulp.task(\'start\', function() {gulp.start(\'server\', \'file-server\', \'inject\');});" > ' + userDataPath + '/config/gulpfile.js';

      // child(makeGulp, 'GulpFile Created')
      // child(cmd, 'Npm installed')
        win.loadFile("path.html")
      }
    } else {
      logIn()
      if(path) {
      } else {
        win.loadFile("path.html")
      }

    }
  }


  checkPath()

  ipcMain.on('savePath', (event, arg) => {
    savePath(arg)
  })

  function savePath(path) {
    if(path) {
      dialog.showMessageBox({ message: "Is this the correct path? " + path,
        buttons: ["OK","Cancel"],
      }, function(response) {
        if(response == 0) {
          configData.saveSync('path', path);
          win.loadFile('index.html');
        }
      });
    } else {
      dialog.showErrorBox("Path Save Error", "Must have '/' at the end and beginning of the path");
    }
  }

}




function killProcess() {
  let cmd = "pkill gulp"
  exec(cmd);
}

ipcMain.on('getData', function() {
  return app.getPath('userData');
})



function logIn() {

  const keys = require('./keys');
  const electronOauth = require('electron-oauth');
  const oauthConfig = require(userDataPath + '/config/config.json').oauth;

  const windowParams = {
    alwaysOnTop: true,
    autoHideMenuBar: true,
    webPreferences: {
      nodeIntegration: false
    }
  };

  var config = {
    clientId: keys.buddy.clientID,
    clientSecret: keys.buddy.clientSecret,
    authorizationUrl: 'https://api.buddy.works/oauth2/authorize',
    tokenUrl: 'https://api.buddy.works/oauth2/token',
    useBasicAuthorizationHeader: false,
    redirectUri: 'http://localhost'
  };

  const options = {
    scope: ['REPOSITORY_READ', 'REPOSITORY_WRITE', 'USER_INFO'],
  };

  const buddyOauth = electronOauth(config, windowParams);

  buddyOauth.getAccessToken(options)
    .then(token => {
      // use your token.access_token
      configData.saveSync('token', token);

      buddyOauth.refreshToken(token.refresh_token)
        .then(newToken => {
          //use your new token
        });
    });
}

function getProjectJsonData(projectConfigFilePath) {
  let projectData;
  try {
    projectData = fs.readFileSync(projectConfigFilePath, "utf-8");//reads project config.json file
    let newData = JSON.parse(projectData);

    let siteID = newData.siteID; 
    configData.saveSync('siteID', siteID);

    let siteURL = newData.siteURL;
    configData.saveSync('siteURL', siteURL);

    let siteTitle = newData.siteTitle;
    configData.saveSync('siteTitle', siteTitle);

    let jsFiles = newData.jsFiles;
    configData.saveSync('jsFiles', JSON.stringify(jsFiles))
  } catch(err) {
    dialog.showErrorBox('Invalid Project', 'Project Folder does not contain a "config.json" file. Please add this and try again.');
  }
}

ipcMain.on('setPath', (event, args) => {

  let dir = args[1]
  let file = args[0]
  configData.saveSync('dir', dir)
  var data = fs.readFileSync(userDataPath + '/config/config.json', 'utf-8')
  var db = JSON.parse(data)

  let path = db.path

  file = path + dir;
  configData.saveSync('filePath', file)

  let projectConfig = file + "/config.json";
  try {
    getProjectJsonData(projectConfig, dir); 
    addSiteList(file, dir); 
    event.returnValue = "task-screen.html";
  } catch(err) {
    console.log(err);
    event.returnValue = "index.html";
  }
})
function addSiteList(file, dir) {
  const fileData = fs.readFileSync(file + "/config.json", 'utf-8');
  const newDb = JSON.parse(fileData);
  var data = fs.readFileSync(userDataPath + '/config/config.json', 'utf-8')
  var db = JSON.parse(data)
  const configData = new Store(userDataPath + '/config/config.json');

    configData.saveSync("currentSiteFileName", newDb.dir);
    configData.saveSync("currentSiteSiteTitle", newDb.siteTitle);
  }

function child(cmd, cmdTitle) {
  exec(cmd, function(err, stdout, stderr) {
    if (err) {
      if(err.toString().includes('gulp start')) {
      } else {
        let notification = new Notification({title: 'ERROR', body: cmd});
        notification.show();
      }
    } else {
      let notification = new Notification({title: 'Success', body: cmd});
      notification.show();
    }
  });
}

ipcMain.on('kill', function(event, arg) {
  if(arg) {
    // cmd = "pkill gulp";
    // exec(cmd);
    event.returnValue = "\003"
    console.log('Gulp Processes Ended')
    let notification = new Notification({
      title: 'Success',
      body: 'Process Ended'
    })
    notification.show();
  }
})

ipcMain.on('start', function(event, arg) {
  var data = fs.readFileSync(userDataPath + '/config/config.json', 'utf-8')
  var db = JSON.parse(data)
  if (arg) {
    cmd = "gulp start --siteID=" + db.siteID + " --siteURL=" + db.siteURL + " --filePath=" + db.filePath + " --jsFiles='" + db.jsFiles + "' \r";
  }
  event.returnValue = cmd;
})

ipcMain.on('cache', function(event, arg) {
  var data = fs.readFileSync(userDataPath + '/config/config.json', 'utf-8')
  var db = JSON.parse(data)
  if(arg) {
    cmd = "gulp cache-bust --filePath=" + db.filePath;
    child(cmd, 'Cache-Bust');
  }
})

ipcMain.on('push', function(event, arg) {
  if(arg) {
    var data = fs.readFileSync(userDataPath + '/config/config.json', 'utf-8')
    var db = JSON.parse(data)
    cmd = 'cd ' + db.filePath + '/ && git add . && git commit -a -m "' + arg + '" && git push origin master';
    child(cmd, 'Git Push');
  }
})

ipcMain.on('pull', function(event, arg) {
  if(arg) {
    var data = fs.readFileSync(userDataPath + '/config/config.json', 'utf-8')
    var db = JSON.parse(data)
    cmd = "cd " + db.filePath + "/ && git pull origin master";
    child(cmd, 'Git Pull');
  }
})

ipcMain.on('clone-repo', function(event, repoPath) {
  var data = fs.readFileSync(userDataPath + '/config/config.json', 'utf-8')
  var db = JSON.parse(data)
  repoPath = repoPath.toString()
  cmd = " cd " + db.path + " && git clone " + repoPath;
  child(cmd, 'Clone');
})

ipcMain.on('newPath', function(file) {
  var data = fs.readFileSync(userDataPath + '/config/config.json', 'utf-8')
  var db = JSON.parse(data)
  let path = db.path;
  let newFilePath = path + file;

  configData.saveSync('filePath', newFilePath);
  location.reload();
})

ipcMain.on('setSites', (event, arg) => {
  var data = fs.readFileSync(userDataPath + '/config/config.json', 'utf-8')
  var db = JSON.parse(data)
  if(arg) {
    let html =
      "<li class='site'><span class='dot' id='active-site'></span><a onclick='sendCommand();'>" +
      db.siteTitle +
      "</a></li>";



    let siteData =
      "<div><p>SiteID: </p>" +
      "<p>" +
      db.siteID +
      "</p></div><div><p>ProxyURL: </p>" +
      "<p>" +
      db.siteURL +
      "</p></div><div><p>Local File Path: </p>" +
      "<p>" +
      db.filePath +
      "</p></div>";

    let title = db.siteTitle;

    event.returnValue = [html, title, siteData]

  }
})

ipcMain.on('userData', (event, arg) => {
  event.returnValue = userDataPath;
})


app.on('ready', createWindow)
app.on('before-quit', killProcess)
