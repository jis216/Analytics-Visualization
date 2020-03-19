const endpoint = "https://js-cse135-pa4.web.app/";
//const endpoint = "https://us-central1-js-cse135-pa4.cloudfunctions.net/";
var sessionID;
var idleTime = 0;
let localSession = {};
localSession['static'] = {}
localSession['loading'] = {}
localSession['events'] = {}

function localSetItem(doc, name, value){
    (localSession[doc])[name] = value;
    if (name != "idle-time"){
        report_table.querySelector(`#${name} td.val`).innerHTML = value;
    }
};

function localPlaceItem(doc, name){
    if(localSession[doc]){
        if ((localSession[doc])[name] !== undefined){
            report_table.querySelector(`#${name} td.val`).innerText = (localSession[doc])[name];
        }
        else{
            report_table.querySelector(`#${name} td.val`).innerText = '';
        }
        return true
    }
    else{
        return false
    }
};

function localSetBatch(doc, pairs){
    for(var name in pairs) {
        localSetItem(doc, name, pairs[name]);
    }
};

function localPlaceBatch(doc, array){
    array.forEach((item, _) =>{
        localPlaceItem(doc, item);
    });
};

async function initSession(){
    let url = endpoint + "sessionize";
    let res = await fetch(url, {
        method: 'GET',
        mode: 'cors',
        credentials: 'include',
        redirect: 'follow'
    });
    return await res.text();
};

function sendDocument(docuNm, dataDict){
    let inputData = dataDict;
    inputData.doc = docuNm;
    inputData.operation = 'setData';

    let url = endpoint + "collect/document";
    navigator.sendBeacon(url, JSON.stringify(inputData));
};

function getDocument(docName){
    let url = endpoint + "collect/document";
    let inputData = {};
    inputData.doc = docName;
    inputData.operation = 'getData';
    fetch(url, {
        method: 'POST',
        mode: 'cors',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
        body: JSON.stringify(inputData)
    }).then((response) => {
        return response.json();
    }).then((resultJson) => {
        localSession[docName] = resultJson;
    });
};

async function getCollection(){
    let url = endpoint + "collect/collection";

    let res = await fetch(url, {
        method: 'GET',
        mode: 'cors',
        credentials: 'include',
        headers: {
            'Content-Type': 'text/plain',
            'Accept': 'application/json'
    }});
    return await res.json();
};

function newRow(ID, content){
    let template = report_table.querySelector('#reportrow');
    let tbody = report_table.querySelector("tbody");
    
    let clone = template.content.cloneNode(true);
    clone.querySelector("tr").id = ID;

    let td = clone.querySelectorAll("td");
    td[0].textContent = content;

    tbody.appendChild(clone);
};

report_table = document.createElement("div");
report_table.innerHTML =
`
<div id="floating-report">
    <table id="reporttable">
    <colgroup>
        <col span="1" id="weekdays">
        <col span="1" id="weekends">
    </colgroup
    <thead class="colored">
        <tr>
            <th scope="col">Name</th>
            <th scope="col">Value</th>
        </tr>
    </thead>
    <tbody>
        <!-- existing data could optionally be included here -->
    </tbody>
    </table>
    <template id="reportrow">
        <tr>
            <td></td>
            <td class="val"></td>
        </tr>
    </template>
</div>`;
document.querySelector("body").appendChild(report_table);

newRow("my-user-agent","user-agent");
newRow("user-language","user language");
newRow("cookie-on","cookies on");
newRow("images-on", "images on");
newRow("javascript-on", "javascript being on");
newRow("css-on", "css being on");
newRow("screen-height", "screen height");
newRow("screen-width", "screen width");
newRow("window-height", "window height");
newRow("window-width", "window width");
newRow("effective-connection-type", "effective connection type");

newRow("navig-start", "navigation start");
newRow("load-end", "load event end");
newRow("time-taken", "time in between");

newRow("mouse-buttons", "Mouse Buttons Pressed: MouseEvent.buttons");
newRow("mouse-meta", "Mouse + Meta Key Pressed?");
newRow("mouse-ctrl", "Mouse + Ctrl Key Pressed?");
newRow("mouse-alt", "Mouse + Alt Key Pressed?");
newRow("mouse-shift","Mouse + Shift Key Pressed?");
newRow("client-x","Local DOM x coord");
newRow("client-y","Local DOM y coord");
newRow("screen-x","Global Screen x coord>");
newRow("screen-y","Global Screen y coord");
newRow("movement-x","Movement x coord");
newRow("movement-y","Movement y coord");

newRow("keyboard-key", "Pressed Key Name");
newRow("keyboard-code", "Key Code Value");
newRow("keyboard-ctrlKey", ">2 Keys Down: Ctrl Key Active?");
newRow("keyboard-shiftKey", ">2 Keys Down: Shift Key Pressed?");
newRow("keyboard-altKey", ">2 Keys Down: Alt Key Active?");
newRow("keyboard-metaKey", ">2 Keys Down: Meta/Command Key Active?");

newRow("scroll-x", "Window Scroll X");
newRow("scroll-y", "Window Scroll Y");
newRow("unloading-start", "last unloadEventStart");
newRow("unloading-end", "last unloadEventEnd");
newRow("unloading-diff", "last (unloadEnd - unloadStart)");
newRow("idle-time", "idle time over 2s");


// Static Data
function setStatic(){
    var img = document.createElement("img");
    img.onload = function() {
        localSetItem("static", "images-on", true);
    };
    img.onerror = function() {
        localSetItem("static", "images-on", false);
    };
    img.src = "https://js-cse135-pa4.web.app/moon_icon.png";

    const color = getComputedStyle( document.querySelector("body") ).backgroundColor;
    const cssOn = (color == "rgb(240, 121, 65)");

    const static_Dict = {
        "my-user-agent": navigator.userAgent,
        "user-language": navigator.language,
        "cookie-on": navigator.cookieEnabled,
        "javascript-on": true,
        "css-on": `${cssOn}`,
        "screen-height": window.screen.height,
        "screen-width": window.screen.width,
        "window-height": window.innerHeight, 
        "window-width": window.innerWidth,
        "effective-connection-type": navigator.connection.effectiveType
    }
    localSetBatch("static", static_Dict);
    sendDocument("static", localSession['static']);
};

function placeUnload(){
    const unload_places = [
        'unloading-start','unloading-end','unloading-diff'
    ]
    localPlaceBatch("events", unload_places);  
};


function handler(evt) {
    if(idleTime > 2){
        localSetItem("events","idle-time", idleTime);
    }
    else{
        localSetItem("events","idle-time", "below 2s");
    }
    idleButtonHandler();
    
    if (evt.type == "beforeunload") {
        unloadAnalytics(evt);
        sendDocument("events", localSession['events']);
        //delete evt['returnValue'];
        delete evt['returnValue'];
        return;
    }  
    else{
        mouseAnalytics(evt);
        mouseAnalytics(evt);
        keystrokeAnalytics(evt);
        scrollAnalytics(evt);
    }
    idleTime = 0;
    
};

function idleButtonHandler(){
    localPlaceItem("events", "idle-time");
};

function setLoadingData(){
    let t = performance.timing;
    let pageLoadTime = (t.loadEventEnd - t.navigationStart);

    const loadingPairs = {
        "navig-start": t.navigationStart,
        "load-end": t.loadEventEnd,
        "time-taken": pageLoadTime
    };

    localSetBatch("loading", loadingPairs);
    sendDocument("loading", localSession['loading']);
};

document.onreadystatechange = (e) =>
{
    if (document.readyState === 'complete')
    {
        initSession().then((sessionRes) => {
            if( sessionRes != 'false'){
                sessionID = sessionRes;
            }
            else{
                getCollection().then((collectionRes) => {
                    localSession = collectionRes;
                    placeUnload();
                });
            }
            setStatic();
            setLoadingData();
            return
        });
    }
};

window.addEventListener('load', () => {
    setInterval(() =>{
        idleTime += 1; 
        if(idleTime > 2){
            localSetItem("events", "idle-time", idleTime);
        }
        else{
            localSetItem("events", "idle-time", "below 2s");
        }
        idleButtonHandler();
    ;}, 1000); // interval = 1 second

    ['click', 'mousemove', 'keypress'].forEach( (eventName) => {
        document.addEventListener(eventName, (e) => {handler(e);});
    });

    ['scroll', 'beforeunload'].forEach( (eventName) => {
        window.addEventListener(eventName, (e) => {handler(e);});
    });

    document.addEventListener("visibilitychange", function() {
        if (document.visibilityState !== 'visible') {
            sendDocument("events", localSession['events']);
        }
    });
});


function mouseAnalytics(mouseEvent){
    const mouseSet = 
    {
        "mouse-buttons": mouseEvent.buttons,
        "mouse-meta": mouseEvent.metaKey,
        "mouse-ctrl": mouseEvent.ctrlKey,
        "mouse-shift": mouseEvent.shiftKey,
        "mouse-alt": mouseEvent.altKey,
        "client-x": mouseEvent.screenX,
        "client-y": mouseEvent.screenY,
        "screen-x": mouseEvent.clientX,
        "screen-y": mouseEvent.clientY,
        "movement-x": mouseEvent.movementX,
        "movement-y": mouseEvent.movementY
    };

    localSetBatch("events", mouseSet);
};

function keystrokeAnalytics(e){

    const keySet = {
        "keyboard-key": e.key,
        "keyboard-code": e.code,
        "keyboard-ctrlKey": e.ctrlKey,
        "keyboard-shiftKey": e.shiftKey,
        "keyboard-altKey": e.altKey,
        "keyboard-metaKey": e.metaKey
    };

    localSetBatch("events", keySet);
    
};

function scrollAnalytics(e){
    const scrollSet = {
        "scroll-x": window.scrollX,
        "scroll-y": window.scrollY
    };
    
    localSetBatch("events", scrollSet);
};

function unloadAnalytics(e){
    const timingP = performance.timing;

    const unloadSet = {
        'unloading-start': timingP.unloadEventStart,
        'unloading-end': timingP.unloadEventEnd,
        'unloading-diff': timingP.unloadEventEnd - timingP.unloadEventStart
    };

    localSetBatch("events", unloadSet);
};