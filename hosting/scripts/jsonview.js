//import JSONFormatter from 'json-formatter-js'
const endpoint = "https://us-central1-js-cse135-pa3.cloudfunctions.net/";
var collections = {};

async function getCollections(){
    let url = endpoint + "collect/all";

    let res = await fetch(url, {
        method: 'GET',
        mode: 'cors',
        credentials: 'include',
        headers: {
            'Content-Type': 'text/plain',
            'Accept': 'application/json'
    }});
    return await res.json();
}

async function getCollection(collection_id){
    let url = endpoint + "collect/collection";

    let res = await fetch(url, {
        method: 'POST',
        mode: 'cors', 
        credentials: 'include',
        headers: {
            'Content-Type': 'text/plain',
            'Accept': 'application/json'
        },
        body: collection_id
    });
    return await res.json();
}

config = {
    hoverPreviewEnabled: false,
    hoverPreviewArrayCount: 100,
    hoverPreviewFieldCount: 5,
    theme: '',
    animateOpen: true,
    animateClose: true,
    useToJSON: true
};

getCollections().then((databaseAll) => {
    databaseAll.forEach( (col) => {
        getCollection(col).then((resCollection) => {
            collections[col] = resCollection; 

            let section = document.createElement("div");

            const formatter = new JSONFormatter(resCollection, 1, config);
            section.appendChild(formatter.render());

            let keyElem = document.createElement("span");
            keyElem.className = "json-formatter-key";
            keyElem.innerText = `${col}:`;

            let parentElem = section.querySelector('a.json-formatter-toggler-link');
            let nextElem = section.querySelector('span.json-formatter-value')
            parentElem.insertBefore(keyElem, nextElem);
            document.querySelector("body").appendChild(section);
        });
    });
});



