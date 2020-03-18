
var collections = []
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

var parser = new UAParser();
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
            else if(key == 'my-user-agent'){
                parser.setUA(browserData[key]);
                ordered_data['browser'] = parser.getBrowser().name;
            }
            else if(key == 'effective-connection-type'){
                ordered_data['connection-type'] = browserData[key];
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

document.addEventListener('DOMContentLoaded', () => {
    Highcharts.chart('browser-chart-container', {
        chart: {
            plotBackgroundColor: null,
            plotBorderWidth: null,
            plotShadow: false,
            type: 'pie'
        },
        title: {
            text: 'User Browser Choices'
        },
        tooltip: {
            pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
        },
        accessibility: {
            point: {
                valueSuffix: '%'
            }
        },
        plotOptions: {
            pie: {
                allowPointSelect: true,
                cursor: 'pointer',
                dataLabels: {
                    enabled: false
                },
                showInLegend: true
            }
        },
        series: [{
            name: 'Brands',
            colorByPoint: true,
            data: [{
                name: 'Chrome',
                y: 61.41,
                sliced: true,
                selected: true
            }, {
                name: 'Internet Explorer',
                y: 11.84
            }, {
                name: 'Firefox',
                y: 10.85
            }, {
                name: 'Edge',
                y: 4.67
            }, {
                name: 'Safari',
                y: 4.18
            }, {
                name: 'Other',
                y: 7.05
            }]
        }],
    });
},  true);



