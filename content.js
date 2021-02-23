chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
    if(message.command == 'listenChange'){
        listenChange(message)
    }
    else if(message.command == 'stopInterval'){
        stopInterval();
    }
    
});
let Id = 0;
function listenChange(params) {
    console.log('start');
    var matchStatus = {pass: " passed" , fail: " failed"};
    var audio = new Audio(params.soundFile);
    var tempStatus = '';
    var alertStatus = matchStatus[params.alertStatus];
    
    this.Id = setInterval(() => {
        console.log('web interval');
        var status = document.getElementsByClassName('table-mobile-content')[0].innerText;
        var predicate = (status ==  alertStatus);
        if(predicate && tempStatus !== status) {
            tempStatus = status;
            audio.play();
        }
     }, params.intevalMillisec);
}
function stopInterval(){
    console.log('stopInterval');
    if(this.Id > 0){
        clearInterval(this.Id)
    }
}
