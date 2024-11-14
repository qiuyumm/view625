
var chart = echarts.init(document.getElementById('mapChart'), null, { renderer: 'canvas' });

var COLORS = ['#070093', '#1c3fbf', '#1482e5', '#70b4eb', '#b4e0f3', '#ffffff'];

var gridWidth = 0.021708; // 经度上2km的差值
var gridHeight = 0.017986; // 纬度上2km的差值

chart.setOption({
    bmap: {
        center: [113.58239, 34.68757],
        zoom: 7,
        roam: true,
        mapStyle: {
            styleJson: [
                // 自定义地图样式
            ]
        }
    },
    tooltip: {
        trigger: 'item',
        formatter: function (params) {
            return `PM2.5: ${params.value[2]}`;
        }
    },
    visualMap: {
        type: 'piecewise',
        inverse: true,
        top: 10,
        left: 10,
        pieces: [
            { min: 500, label: '爆表' },    
            { min: 250, max: 500, label: '严重污染' },  
            { min: 150, max: 250, label: '重度污染' },  
            { min: 115, max: 150, label: '中度污染' },  
            { min: 75, max: 115, label: '轻度污染' },  
            { min: 35, max: 75, label: '良' },  
            { min: 0, max: 35, label: '优' },  
        ],
        borderColor: '#ccc',
        borderWidth: 2,
        backgroundColor: '#eee',
        dimension: 2,
        inRange: {
            color: ['#74c01f', '#d4cf18', '#fa8718', '#d12b2b', '#fa8718', '#691888', '#000000'],
            opacity: 0.7
        }
    },
    series: [{
        type: 'custom',
        coordinateSystem: 'bmap',
        renderItem: function (params, api) {
            var lng = api.value(0);
            var lat = api.value(1);
            var value = api.value(2);
            var point = api.coord([lng, lat]);

            var gridLeftTop = api.coord([lng, lat + gridHeight]);
            var gridRightBottom = api.coord([lng + gridWidth, lat]);

            return {
                type: 'rect',
                shape: {
                    x: gridLeftTop[0],
                    y: gridLeftTop[1],
                    width: gridRightBottom[0] - gridLeftTop[0],
                    height: gridRightBottom[1] - gridLeftTop[1]
                },
                style: api.style({
                    stroke: 'rgba(0,0,0,0.1)'
                }),
                styleEmphasis: api.styleEmphasis()
            };
        },
        data: [],
        encode: {
            x: 0,
            y: 1,
            value: 2,
        }
    }]
});

function aggregateData(data, gridWidth, gridHeight) {
    const aggregatedData = {};

    data.forEach(point => {
        const lng = point[0];
        const lat = point[1];
        const value = point[2];

        const gridX = Math.floor(lng / gridWidth);
        const gridY = Math.floor(lat / gridHeight);
        const gridKey = `${gridX},${gridY}`;

        if (!aggregatedData[gridKey]) {
            aggregatedData[gridKey] = {
                longitude: gridX * gridWidth,
                latitude: gridY * gridHeight,
                totalValue: 0,
                count: 0
            };
        }

        aggregatedData[gridKey].totalValue += value;
        aggregatedData[gridKey].count += 1;
    });

    return Object.values(aggregatedData).map(grid => {
        return [
            grid.longitude + gridWidth / 2,
            grid.latitude + gridHeight / 2,
            grid.totalValue / grid.count
        ];
    });
}

function filterDataByView(data, bmap) {
    const bounds = bmap.getBounds();
    const sw = bounds.getSouthWest(); // 西南角
    const ne = bounds.getNorthEast(); // 东北角

    return data.filter(point => {
        const lng = point[0];
        const lat = point[1];
        return lng >= sw.lng && lng <= ne.lng && lat >= sw.lat && lat <= ne.lat;
    });
}

function updateData() {
    const timestamp = new Date().toISOString();
    fetch('/queryData', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ timestamp: timestamp }),
    })
    .then(response => response.json())
    .then(data => {
        var bmap = chart.getModel().getComponent('bmap').getBMap();

        const gridWidth = 0.021708;
        const gridHeight = 0.017986;
        const aggregatedData = aggregateData(data.coordinates, gridWidth, gridHeight);

        const filteredData = filterDataByView(aggregatedData, bmap);

        chart.setOption({
            series: [{
                data: filteredData,
            }]
        });

        console.log('Aggregated and Filtered data:', filteredData.length);
    })
    .catch(error => console.error('Error:', error));
}

updateData();
setInterval(updateData, 600000 * 3);