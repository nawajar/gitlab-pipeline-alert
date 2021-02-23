chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
    listenChange(message)
});

function listenChange(params) {
    var matchStatus = {pass: " passed" , fail: " failed"};
    var audio = new Audio(params.soundFile);
    var tempStatus = '';
    var alertStatus = matchStatus[params.alertStatus];
    setInterval(() => {
        var status = document.getElementsByClassName('table-mobile-content')[0].innerText;
        var predicate = (status ==  alertStatus);
        if(predicate && tempStatus !== status) {
            tempStatus = status;
            audio.play();
        }
    }, params.intevalMillisec);
}

