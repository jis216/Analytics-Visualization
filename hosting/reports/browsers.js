// default in-place chart
Highcharts.chart('browser-pie-chart', {
    chart: {
        plotBackgroundColor: null,
        plotBorderWidth: null,
        plotShadow: false,
        type: 'pie'
    },
    title: {
        text: 'Browser market shares in January, 2018'
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
    }]
});

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
var browserCol = {};
getCollections().then(async (databaseAll) => {
    for (const id of databaseAll) {
        const oneCollect = await getCollection(id);

        let browserData = oneCollect.static;
        browserData['sessionID'] = id;

        let ordered_data = {};
        let column_order = 
            ['sessionID',
            'screen-width', 'screen-height',
            'user-language', 'my-user-agent'];

        column_order.forEach((key) => {
            if(key == 'my-user-agent'){
                parser.setUA(browserData[key]);
                let browserName = parser.getBrowser().name
                ordered_data['browser'] = browserName;
                if(browserCol[browserName]){
                    browserCol[browserName] += 1;
                }
                else{
                    browserCol[browserName] = 1;
                }
                
            }
            else{
                ordered_data[key] = browserData[key];
            }
            
        });

        collections.push(ordered_data); 
    }
    
    let zgRef = document.querySelector('zing-grid');

    zgRef.setData(collections);

    var browserArr = [];
    
    Object.keys(browserCol).forEach((k) => {
        browserArr.push( {
            name: k,
            y: parseFloat((browserCol[k] * 100 / databaseAll.length).toFixed(2))
        });
    });
    
    Highcharts.chart('browser-pie-chart', {
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
            name: 'Products',
            colorByPoint: true,
            data: browserArr
        }],
    });
});



