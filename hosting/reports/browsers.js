var collections = [];

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

getCollections().then(async (databaseAll) => {
    for (const col of databaseAll) {
        const oneCollect = await getCollection(col);
        let browserData = oneCollect.static;
        browserData['sessionID'] = col;

        let ordered_data = {};
        let column_order = 
        ['sessionID',
        'screen-width', 'screen-height',
        'javascript-on',
        'effective-connection-type',
        'user-language', 'my-user-agent'];
        column_order.forEach((key) => {
            if (key == 'javascript-on'){
                ordered_data['JS-is-on'] = browserData[key];
            }
            else{
                ordered_data[key] = browserData[key];
            }
            
        });

        collections.push(ordered_data); 
    }
    console.log('collection:');
    console.log(collections);
    let zgRef = document.querySelector('zing-grid');

    // target grid and assign data directly
    zgRef.setData(collections);
});





