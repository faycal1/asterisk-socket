function saveOptions(e) {

    e.preventDefault();

    var server = document.querySelector("#server").value;
    var port = document.querySelector("#port").value;    
    var context = document.querySelector("#context").value;   
    var url = document.querySelector("#url").value;
    var autoopen = getCheckBoxIsChecked();

    browser.storage.local.set({
        asteriskCs: {
            server: server,
            port: port,            
            context: context,
            url:url,
            autoopen: autoopen
        }
    }).then(reloadRuntime, onError);

    function onError(error) {
        console.log(`Error: ${error}`);
    }

    function reloadRuntime() {
        browser.runtime.reload()
    }

    console.log('Ok AM Submiting to save', document.querySelector("#autoopen").checked);    

}

function getCheckBoxIsChecked() {
    return document.querySelector("#autoopen").checked ? true : false;
}

function restoreOptions() {

    function setCurrentChoice(result) {

        console.log('setCurrentChoice ' + result.asteriskCs.server);
        document.querySelector("#server").value = result.asteriskCs.server || "0.0.0.0";
        document.querySelector("#port").value = result.asteriskCs.port || "3000";      
        document.querySelector("#context").value = result.asteriskCs.context || "default";
        document.querySelector("#url").value = result.asteriskCs.url || "http://0.0.0.0/";
        document.querySelector("#autoopen").checked = result.asteriskCs.autoopen  || false ;
        
    }

    function onError(error) {
        console.log(`Error: ${error}`);
    }

    var getting = browser.storage.local.get("asteriskCs");
    getting.then(setCurrentChoice, onError);
}



document.addEventListener("DOMContentLoaded", restoreOptions);

document.querySelector("form").addEventListener("submit", saveOptions);


// function handleMessage(request, sender, sendResponse) {
//     console.log("Message from the content script 33 Options : " + request.greeting);
//     sendResponse({
//         response: "Response from background script"
//     });
// }

// browser.runtime.onMessage.addListener(handleMessage);