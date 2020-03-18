document.addEventListener('DOMContentLoaded', () => {
    Highcharts.chart('loadingTimeRange', {
        chart: {
            type: 'columnrange',
            inverted: true
        },
        accessibility: {
            description: "A loading speed chart that displays the average time each loading task takes"
        },
        title: {
            text: 'Average Loading Time by Connection Tasks'
        },
        subtitle: {
            text: 'Observed in the websited of user'
        },
        xAxis: {
            categories: 
            ['before fetch', 'unload event', 'App cache', 'DNS', 'TCP',
             'Request', 'Response', 'DOM Processing', 'onload event']
        },
        yAxis: {
            title: {
                text: 'Milliseconds ( ms )'
            }
        },
        tooltip: {
            valueSuffix: 'ms'
        },
        plotOptions: {
            columnrange: {
                dataLabels: {
                    enabled: true,
                    format: '{y}ms'
                }
            }
        },
        legend: {
            enabled: false
        },
        series: [{
            name: 'Temperatures',
            data: [
                [0, 10],        // before fetch:    navigationStart, fetch start
                [707, 707],     // unload:          unloadEventStart, unloadEventEnd
                [10,  10],      // app cache:       fetchStart, domainLookupStart
                [10,  10],      // DNS:             domainLookupStart, domainLookupEnd
                [10,  10],      // TCP:             connectStart, connectEnd
                [18,  697],    // Request:         requestStart, responseStart
                [697, 699],    // Response:        responseStart, responseEnd
                [715, 1496],    // Processing:      domLoading, domComplete
                [1953, 1953],    // onload:          loadEventStart, loadEventEnd
            ]
        }]
    });
},  true);

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
        let speedData = Object.assign({}, oneCollect.loading, oneCollect.events);

        speedData['sessionID'] = col;

        let ordered_data = {};
        let column_order = 
        ['sessionID',
        'time-taken', 'unloading-diff'];
        column_order.forEach((key) => {
            if (key == 'time-taken'){
                ordered_data['Load-Time'] = speedData[key];
            }
            else if (key == 'unloading-diff'){
                ordered_data['Unload-Time'] = speedData[key];
            }

            else{
                ordered_data[key] = speedData[key];
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