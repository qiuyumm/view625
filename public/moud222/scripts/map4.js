var chart = echarts.init(document.getElementById('mapChart'), null, { renderer: 'canvas' });

var gridWidth = 0.010854; // 1km 经度差
var gridHeight = 0.008993; // 1km 纬度差
const timeRange = generateTimeRange(8);

// 初始化图表配置
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
            return `PM2.5: ${params.value[2]?.toFixed(2)}`;
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
    timeline: {
        axisType: 'time',
        autoPlay: false,
        playInterval: 3000,
        currentIndex: 0,
        loop: false,
        data: timeRange, // 生成过去8小时的时间轴数据
        label: {
            formatter: '{HH}:{mm}'
        },
        controlStyle: {
            showNextBtn: true,
            showPrevBtn: true
        }
    },
    series: [{
        type: 'custom',
        coordinateSystem: 'bmap',
        renderItem: function (params, api) {
            var lng = api.value(0); // 经度
            var lat = api.value(1); // 纬度
            var value = api.value(2); // 数据值
            var point = api.coord([lng, lat]); // 将经纬度转换为屏幕坐标

            var color = api.visual('color'); // 根据 visualMap 获取颜色

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
        animation: false,
        data: [],
        encode: {
            x: 0,
            y: 1,
            value: 2,
        }
    }]
});

// 数据聚合函数
function aggregateData(data, gridWidth, gridHeight) {
    const aggregatedData = {};
    data.forEach(item => {
        const lng = item[0];
        const lat = item[1];
        const value = item[2];

        const gridLng = Math.floor(lng / gridWidth) * gridWidth;
        const gridLat = Math.floor(lat / gridHeight) * gridHeight;

        const gridKey = `${gridLng},${gridLat}`;

        if (!aggregatedData[gridKey]) {
            aggregatedData[gridKey] = { lng: gridLng, lat: gridLat, value: 0, count: 0 };
        }

        aggregatedData[gridKey].value += value;
        aggregatedData[gridKey].count += 1;
    });

    return Object.values(aggregatedData).map(grid => [
        grid.lng,
        grid.lat,
        grid.value / grid.count
    ]);
}

// 获取当前整点时间
function getCurrentHour() {
    const now = new Date();
    now.setMinutes(0, 0, 0);
    const localISOTime = new Date(now.getTime() - (now.getTimezoneOffset() * 60000)).toISOString();

    // console.log(localISOTime)
    return localISOTime;
}

// 请求数据并聚合
function updateData() {
    const timestamp = getCurrentHour(); // 获取整点时间
    console.log('时间戳'+timestamp)
    fetch('/queryData', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ timestamp: timestamp }),
    })
    .then(response => response.json())
    .then(data => {
        const mapdata = data.coordinates;

        // 聚合不同粒度的数据
        const aggregated1km = aggregateData(mapdata, 0.010854, 0.008993);
        const aggregated2km = aggregateData(mapdata, 0.021708, 0.017986);
        const aggregated5km = aggregateData(mapdata, 0.054270, 0.044965);
        const aggregated10km = aggregateData(mapdata, 0.108540, 0.089930);

        window.aggregatedData = {
            '1km': { data: aggregated1km, gridWidth: 0.010854, gridHeight: 0.008993 },
            '2km': { data: aggregated2km, gridWidth: 0.021708, gridHeight: 0.017986 },
            '5km': { data: aggregated5km, gridWidth: 0.054270, gridHeight: 0.044965 },
            '10km': { data: aggregated10km, gridWidth: 0.108540, gridHeight: 0.089930 }
        };

        renderDataByZoom();
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

// 获取地图可见区域的边界
function getVisibleBounds() {
    const bmapComponent = chart.getModel().getComponent('bmap');
    const bmap = bmapComponent.getBMap();
    const bounds = bmap.getBounds();
    const sw = bounds.getSouthWest();
    const ne = bounds.getNorthEast();
    return {
        minLng: sw.lng,
        minLat: sw.lat,
        maxLng: ne.lng,
        maxLat: ne.lat
    };
}

// 过滤可见区域内的数据
function filterDataByBounds(data, bounds) {
    return data.filter(item => {
        const lng = item[0];
        const lat = item[1];
        return lng >= bounds.minLng && lng <= bounds.maxLng && lat >= bounds.minLat && lat <= bounds.maxLat;
    });
}


// 根据缩放级别渲染合适的数据
// 根据缩放级别渲染数据
function renderDataByZoom() {
    const bmapComponent = chart.getModel().getComponent('bmap');
    const bmap = bmapComponent.getBMap();
    const zoom = bmap.getZoom();
    const center = bmap.getCenter();
    const bounds = getVisibleBounds(); // 获取当前可视区域

    let selectedData, gridSize;
    if (zoom >= 13) {
        selectedData = window.aggregatedData['1km'].data;
        gridWidth = window.aggregatedData['1km'].gridWidth;
        gridHeight = window.aggregatedData['1km'].gridHeight;
    } else if (zoom >= 11) {
        selectedData = window.aggregatedData['2km'].data;
        gridWidth = window.aggregatedData['2km'].gridWidth;
        gridHeight = window.aggregatedData['2km'].gridHeight;
    } else if (zoom >= 9) {
        selectedData = window.aggregatedData['5km'].data;
        gridWidth = window.aggregatedData['5km'].gridWidth;
        gridHeight = window.aggregatedData['5km'].gridHeight;
    } else {
        selectedData = window.aggregatedData['10km'].data;
        gridWidth = window.aggregatedData['10km'].gridWidth;
        gridHeight = window.aggregatedData['10km'].gridHeight;
    }

    // 过滤出当前可见区域内的数据
    const visibleData = filterDataByBounds(selectedData, bounds);

    chart.setOption({
        series: [{
            data: visibleData, // 只渲染当前可见区域的数据
        }],
        bmap: {
            center: [center.lng, center.lat],
            zoom: zoom
        }
    });
}

// 监听地图的缩放和拖动事件
const bmapComponent = chart.getModel().getComponent('bmap');
const bmap = bmapComponent.getBMap();
bmap.addEventListener('zoomend', renderDataByZoom); // 监听缩放事件
bmap.addEventListener('dragend', renderDataByZoom); // 监听拖动事件
bmap.addControl(new BMap.MapTypeControl(
    {mapTypes: [BMAP_NORMAL_MAP,BMAP_SATELLITE_MAP,BMAP_HYBRID_MAP ]}
    )); //添加地图类型控件
// 初次加载数据
updateData();

// 定时更新数据
setInterval(updateData, 600000 * 3);


//时间轴
// 生成过去8小时的时间范围
function generateTimeRange(hours) {
    const times = [];
    const now = new Date();
    
    // 将当前时间取整到小时
    now.setMinutes(0, 0, 0);

    for (let i = 0; i <= hours; i++) {
        const time = new Date(now.getTime() - i * 3600 * 1000);
        times.unshift(time.toISOString()); // ISO 格式
    }
    return times;
}



// 监听时间轴变化事件
chart.on('timelinechanged', function(event) {
    const selectedTime = timeRange[event.currentIndex];
    console.log("时间轴",selectedTime);
    updateDataForTime(selectedTime);
});


// 更新数据并按指定时间渲染
function updateDataForTime(time) {
    console.log('时间戳'+time)
    fetch('/queryData', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ timestamp: time }),
    })
    .then(response => response.json())
    .then(data => {
        const mapdata = data.coordinates;

        // 聚合不同粒度的数据
        const aggregated1km = aggregateData(mapdata, 0.010854, 0.008993);
        const aggregated2km = aggregateData(mapdata, 0.021708, 0.017986);
        const aggregated5km = aggregateData(mapdata, 0.054270, 0.044965);
        const aggregated10km = aggregateData(mapdata, 0.108540, 0.089930);

        window.aggregatedData = {
            '1km': { data: aggregated1km, gridWidth: 0.010854, gridHeight: 0.008993 },
            '2km': { data: aggregated2km, gridWidth: 0.021708, gridHeight: 0.017986 },
            '5km': { data: aggregated5km, gridWidth: 0.054270, gridHeight: 0.044965 },
            '10km': { data: aggregated10km, gridWidth: 0.108540, gridHeight: 0.089930 }
        };

        renderDataByZoom();
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

    

// 初次页面加载时获取最新时间的数据
// updateDataForTime(timeRange[timeRange.length - 1]);


// // 每小时更新一次时间轴
// setInterval(() => {
//     const newTime = new Date();
//     newTime.setMinutes(0, 0, 0); // 取整到小时

//     // 检查时间轴是否已包含最新时间点
//     const newTimeISO = newTime.toISOString();
//     if (!timeRange.includes(newTimeISO)) {
//         timeRange.push(newTimeISO);

//         // 保持时间范围为最近 8 小时
//         if (timeRange.length > 9) {
//             timeRange.shift();
//         }

//         // 更新时间轴配置
//         chart.setOption({
//             baseOption: {
//                 timeline: {
//                     data: timeRange,
//                     currentIndex: timeRange.length - 1
//                 }
//             }
//         });

//         // 请求最新时间的数据
//         updateDataForTime(newTimeISO);
//     }
// }, 60 * 60 * 1000); // 每小时执行一次

