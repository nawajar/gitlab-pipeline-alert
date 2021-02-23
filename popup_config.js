document.addEventListener('DOMContentLoaded', documentEvents  , false);
let intervalapi;
function watchActon(params) { 
    let cb = function(res){ intervalweb = res;};
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.executeScript(tabs[0].id, {
            file: "content.js"
        }, function(){
            chrome.tabs.sendMessage(tabs[0].id,{
                intevalMillisec: params.intevalMillisec,
                soundFile: params.soundFile,
                alertStatus: params.alertStatus,
                command : 'listenChange'
            });
        });
    });
}

function stopInterval(){
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.executeScript(tabs[0].id, {
            file: "content.js"
        }, function(){
            chrome.tabs.sendMessage(tabs[0].id,{
                command : 'stopInterval'
            });
        });
    });
}

async function audioToBase64(audioFile) {
    return new Promise((resolve, reject) => {
      let reader = new FileReader();
      reader.onerror = reject;
      reader.onload = (e) => resolve(e.target.result);
      reader.readAsDataURL(audioFile);
    });
  }

function setAlertType(type){
  localStorage['alert_type'] = type;
}

function setConfigApiDisable(disabledvalue){
  document.getElementById('giturl').disabled = disabledvalue;
  document.getElementById('projectId').disabled = disabledvalue;
  document.getElementById('tokengit').disabled = disabledvalue;
}

function setConfigDefaultData(){
  localStorage['pipelineId'] = 0;
  var localAlertType = localStorage['alert_type'] || 'web';
  var localGiturl = localStorage['giturl'] || '';
  var localProjectId = localStorage['projectId'] || '';
  var localTokengit = localStorage['tokengit'] || '';
  var localInteval = localStorage['inteval_input'] || 5000;
  var localStatus = localStorage['status_input'] || 'fail';
  if(localAlertType == 'api'){
    document.getElementById('alertTypeApi').checked = true;
    document.getElementById('giturl').value = localGiturl;
    document.getElementById('projectId').value = localProjectId;
    document.getElementById('tokengit').value = localTokengit;
    setConfigApiDisable(false);
  }
  else{
    document.getElementById('alertTypeWeb').checked = true;
    document.getElementById('giturl').value = '';
    document.getElementById('projectId').value = '';
    document.getElementById('tokengit').value = '';
    setConfigApiDisable(true);
  }
  document.getElementById('inteval_input').value = localInteval;
  document.getElementById('status_input').value = localStatus;
}

async function callApiGit(){
  let res = await fetch(`${localStorage['giturl']}/api/v4/projects/${localStorage['projectId']}/pipelines`,{
    headers: {
      "Content-Type":"application/json;charset=UTF-8",
      "PRIVATE-TOKEN":"MPR6J5a_MriVft7MbnKz"
    },  
  });
  const response = await res.json();
  let statusgit = localStorage['status_input'] == 'pass'?'success':'failed';
  if(response[0].status == statusgit && localStorage['pipelineId'] != response[0].id){
    localStorage['pipelineId'] = response[0].id;
    var soundFile = document.getElementById('sound_file').files[0];
    audioToBase64(soundFile).then((res) => {
        var audio = new Audio(res);
        audio.play();
    });
  }
}

//EventListener
function documentEvents() { 
  setConfigDefaultData();
 
  document.getElementById('watch_btn').addEventListener('click',() => {
    var soundFile = document.getElementById('sound_file').files[0];
    var intevalMillisec = document.getElementById('inteval_input').value;
    var alertStatus = document.getElementById('status_input').value;
    document.getElementById('watch_btn').disabled = true;
    document.getElementById('stop_btn').disabled = false;
    if(localStorage['alert_type'] == 'web'){
      audioToBase64(soundFile).then((res) => {
        watchActon({
            intevalMillisec: intevalMillisec,
            soundFile: res,
            alertStatus: alertStatus
        });
      });
    }
    else{
       intervalapi = setInterval(async () => {
          await callApiGit();
       },intevalMillisec);
    }
  });

  document.getElementById('stop_btn').addEventListener('click', () => {
    document.getElementById('watch_btn').disabled = false;
    document.getElementById('stop_btn').disabled = true;
    stopInterval();
    intervalapi > 0 ? clearInterval(intervalapi):'';
  });

  document.getElementById('alertTypeWeb').addEventListener('click', () => {
    setAlertType('web');
    setConfigDefaultData();
  });

  document.getElementById('alertTypeApi').addEventListener('click', () => {
    setAlertType('api');
    setConfigDefaultData();
  });

  document.getElementById('giturl').addEventListener('input', () => {
    localStorage['giturl'] = document.getElementById('giturl').value;
  });

  document.getElementById('projectId').addEventListener('input', () => {
    localStorage['projectId'] = document.getElementById('projectId').value;
  });

  document.getElementById('tokengit').addEventListener('input', () => {
    localStorage['tokengit'] = document.getElementById('tokengit').value;
  });

  document.getElementById('inteval_input').addEventListener('input', () => {
    localStorage['inteval_input'] = document.getElementById('inteval_input').value;
  });

  document.getElementById('status_input').addEventListener('change', () => {
    localStorage['status_input'] = document.getElementById('status_input').value;
  });

  document.getElementById('sound_file').addEventListener('change', () => {
    localStorage['sound_file'] = document.getElementById('sound_file').value;
  });
  
}