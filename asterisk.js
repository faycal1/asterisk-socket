window.asteriskServer = null;
window.asteriskPort = null;
window.asteriskContext = null;
window.asteriskUrl = null;
window.asteriskAutoOpen = null;
window.CallerIDName = "null";
window.CallerIDNum = "null";
window.DestAccountCode = null;

var getting = browser.storage.local.get("asteriskCs");

getting.then(getOptions, onError).then(function(){
    socketInit();
});

function getOptions(result) {

    asteriskServer = result.asteriskCs.server || "localhost";
    asteriskPort = result.asteriskCs.port || "8088";
    asteriskContext = result.asteriskCs.context || "default";     
    asteriskUrl = result.asteriskCs.url || "default";
    asteriskAutoOpen = result.asteriskCs.autoopen || false;
}

function socketInit() {

    var socket = io.connect('http://' + asteriskServer + ':' + asteriskPort);

    socket.on('AgentCalled', function (data) {
        CallerIDName =  data.CallerIDName;
        CallerIDNum = data.CallerIDNum;
        proccessData();
        console.log(data);
    });

    socket.on('BridgeEnter', function (data) {
       
         DestAccountCode = data.DestAccountCode;
         CallerIDName = data.CallerIDName;
         CallerIDNum = data.CallerIDNum;
         proccessData();
        console.log(data);
    });

    socket.on('PeerStatus', function (data) {       
       // 
       
         proccessData();
    });

    function proccessData() {
        browser.notifications.create({
            "type": "basic",
            "iconUrl": browser.extension.getURL("icons/asterisk-48.png"),
            "title": "Nouvelle appel de " + (CallerIDName.length > 0 ? CallerIDName : CallerIDNum),
            "message": "Appel de " + CallerIDNum
        });

        if (asteriskAutoOpen) {
            browser.tabs.create({
                url: asteriskUrl + "?callerid=" + CallerIDNum
            });
        }
    }

    // socket.on('AgentConnect', function (data) {
    //     console.log(data);
    // });

    // socket.on('DialBegin', function (data) {
    //     CallerIDName = data.CallerIDName,
    //     CallerIDNum = data.CallerIDNum,
    //     console.log(data);
    // });

    
}

browser.notifications.onClicked.addListener(callback);

function callback(params) {

    browser.tabs.create({
        url: asteriskUrl + "?callerid=" + CallerIDNum
    });

    console.log('That Very Good', params, asteriskUrl, asteriskAutoOpen, asteriskContext, CallerIDNum, CallerIDName);
}

function onError(error) {
    console.log(`Error: ${error}`);
}

