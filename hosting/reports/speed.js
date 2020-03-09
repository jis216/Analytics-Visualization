document.addEventListener('DOMContentLoaded', function () {
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
});