document.addEventListener('DOMContentLoaded', documentEvents  , false);
function watchActon(params) { 
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.executeScript(tabs[0].id, {
            file: "content.js"
        }, function(){
            chrome.tabs.sendMessage(tabs[0].id,{
                intevalMillisec: params.intevalMillisec,
                soundFile: params.soundFile,
                alertStatus: params.alertStatus
            });
        });
    });
}

function documentEvents() {    
  document.getElementById('watch_btn').addEventListener('click', () => {
    var soundFile = document.getElementById('sound_file').files[0];
    var intevalMillisec = document.getElementById('inteval_input').value;
    var alertStatus = document.getElementById('status_input').value;
    audioToBase64(soundFile).then((res) => {
        watchActon({
            intevalMillisec: intevalMillisec,
            soundFile: res,
            alertStatus: alertStatus
        });
    });
  });

  async function audioToBase64(audioFile) {
    return new Promise((resolve, reject) => {
      let reader = new FileReader();
      reader.onerror = reject;
      reader.onload = (e) => resolve(e.target.result);
      reader.readAsDataURL(audioFile);
    });
  }
}