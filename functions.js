const Store = require("jfs"); //json file system
const fs = require("fs");
var { ipcRenderer } = require("electron");
var exec = require("child_process").exec, child;
const remote = require('electron').remote;
const app = remote.app;
const userDataPath = app.getPath('userData');

function savePath() { 
  let path = document.getElementById("path-input").value;
  ipcRenderer.send('savePath', path);
}

ipcRenderer.on('notification', (event,arg) => {
  let note = new Notification(arg, {
    body: arg,
    icon: './CSS/images/sw-icon.png'
  })

  note.onclick = () => {
    console.log('Notification dismissed')
  }
})


function getProjectJsonData(projectConfigFilePath) {
  let projectData = fs.readFileSync(projectConfigFilePath, "utf-8");//reads project config.json file
  let newData = JSON.parse(projectData);
  const configData = new Store(userDataPath + '/config/config.json');

  let siteID = newData.siteID; 
  configData.saveSync('siteID', siteID);

  let siteURL = newData.siteURL;
  configData.saveSync('siteURL', siteURL);

  let siteTitle = newData.siteTitle;
  configData.saveSync('siteTitle', siteTitle);

  let jsFiles = newData.jsFiles;
  configData.saveSync('jsFiles', jsFiles)
}

function setPath() {
  let file = document.getElementById("file-chooser").value;
  let dir = file.slice(12);

  window.location = ipcRenderer.sendSync('setPath', [file, dir]);
  sendCommand()
}

// function killProcess() {
  // ipcRenderer.send('kill', true)
// }

function child(cmd, cmdTitle) {
  exec(cmd, function(err, stdout, stderr) {
    if (err) {
      console.log(err)
      let failure = new Notification('Failure', {
        body: cmdTitle + ' task was not succesful!!!',
        icon: './CSS/images/sw-icon.png'
      })

      failure.onclick = () => {
        console.log('Notification dismissed')
      }

    } else {
      let success = new Notification('Task Successful', {
        body: cmdTitle + ' task was succesful',
        icon: './CSS/images/sw-icon.png'
      })
      success.onclick = () => {
        console.log('Notification dismissed')
      }
    }
  });
}

function configOptions() {
  var configModal = document.getElementById('configModal');  
  var configSiteTitle = document.getElementById('siteTitleInput');
  var configSiteId = document.getElementById('siteIdInput');
  var configSiteUrl = document.getElementById('siteUrlInput');
  var configJsFiles = document.getElementById('jsFilesInput');
  var configGitMessage = document.getElementById('gitMessageInput');
  configModal.classList.add('display');
  const configData = fs.readFileSync(userDataPath + '/config/config.json');
  const db = JSON.parse(configData);
  var file = db.filePath;
  const fileData = fs.readFileSync(file + "/config.json", 'utf-8');
  const data = JSON.parse(fileData);
  configSiteTitle.value = data.siteTitle;
  configSiteId.value = data.siteID;
  configSiteUrl.value = data.siteURL;
  configJsFiles.value = data.jsFiles;
  configGitMessage.value = data.gitMessage;
}

function cancelConfig() {
  var configModal = document.getElementById('configModal');
  configModal.classList.remove('display');
      let cancelled = new Notification('Cancelled', {
        body: 'Project Config File Save Cancelled',
        icon: './CSS/images/sw-icon.png'
      })
      cancelled.onclick = () => {
        console.log('Notification dismissed')
      }
}

function saveConfig() {
  const configData = fs.readFileSync(userDataPath + '/config/config.json');
  const db = JSON.parse(configData);
  var file = db.filePath;
  const fileData = file + "/config.json";
  const data = new Store(fileData);
  var configSiteTitle = document.getElementById('siteTitleInput').value;
  var configSiteId = document.getElementById('siteIdInput').value;
  var configSiteUrl = document.getElementById('siteUrlInput').value;
  var configJsFiles = document.getElementById('jsFilesInput').value;
  var configGitMessage = document.getElementById('gitMessageInput').value;

  data.saveSync('siteTitle', configSiteTitle);
  data.saveSync('siteID', configSiteId);
  data.saveSync('siteURL', configSiteUrl);
  data.saveSync('jsFiles', configJsFiles);
  data.saveSync('gitMessage', configGitMessage);

  document.getElementById('configModal').classList.remove('display');

      let success = new Notification('Success', {
        body: 'Project Config File Saved',
        icon: './CSS/images/sw-icon.png'
      })
      success.onclick = () => {
        console.log('Notification dismissed')
      }

}


function cacheBust() {
 ipcRenderer.send('cache', true)
}

function gitPushCommit() {
  const configData = fs.readFileSync(userDataPath + '/config/config.json');
  const db = JSON.parse(configData);
  var file = db.filePath;
  const fileData = fs.readFileSync(file + "/config.json", 'utf-8');
  const data = JSON.parse(fileData);
  var gitMessage = data.gitMessage;

  ipcRenderer.send('push', gitMessage)
}

function gitPull() {
  ipcRenderer.send('pull', true)
}

function showRepoModal() {
  document.getElementById('repo-url-modal').classList.remove('hidden');
}

function cloneRepo() {
  let repoPath = document.getElementById('repo-url').value
  ipcRenderer.send('clone-repo', repoPath)
}

function back() {
  window.location.href = 'index.html';
}

function setNewPath(file) {

  ipcRenderer.send('newPath', file)
}

function setCurrentSites() {
  var data = fs.readFileSync(userDataPath + '/config/config.json', 'utf-8')
  var db = JSON.parse(data)
  var sitesArray = [db.secondSiteSiteTitle, db.thirdSiteSiteTitle, db.fourthSiteSiteTitle, db.fifthSiteSiteTitle];
  var nonEmptyArray = [];
  var siteListArray = [];
//
  for(i = 0; i < sitesArray.length; i++) {
    if(sitesArray[i] != undefined && sitesArray[i] != "" && sitesArray[i].charAt(1)) {
      nonEmptyArray[i] = sitesArray[i];
    }
  }
//
  for(i = 0; i < nonEmptyArray.length; i++) {
    if(nonEmptyArray[i]) {
//
    } else {
      nonEmptyArray.splice(i, 1);
    }
  }
//
  for(j = 0; j < nonEmptyArray.length; j++) {
    siteListArray[j] = "<li class='site'><a onclick=''>" + nonEmptyArray[j] + "</a></li>";
    console.log(siteListArray[j])
  }
//
  siteListArray = siteListArray.join('');

  let dataArray = ipcRenderer.sendSync('setSites', true)

  // document.getElementById("site-list").innerHTML = dataArray[0]; // + siteListArray;

  document.getElementById("main-title").innerHTML = dataArray[1];

  document.getElementById("info-container").innerHTML = dataArray[2];
}
