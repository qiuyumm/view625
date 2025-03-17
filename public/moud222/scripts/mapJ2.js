var chart = echarts.init(document.getElementById('mapChart'), null, { renderer: 'canvas' });

var gridWidth = 0.010854; // 1km 经度差
var gridHeight = 0.008993; // 1km 纬度差

// 初始化图表配置
chart.setOption({
    bmap: {
        center: [113.58239, 34.68757],
        zoom: 7,
        roam: true,
        mapStyle: {
            styleJson: [] // 自定义地图样式
        }
    },
    tooltip: {
        trigger: 'item',
        formatter: function (params) {
            return `风险: ${params.value[2]?.toFixed(2)}`;
        }
    },
    visualMap: {
        min: 0,
        max: 38880, 
        calculable: true,
        left: 10,
        bottom: 10,
        inRange: {
            color: ['#74c01f', '#d4cf18', '#fa8718', '#d12b2b', '#fa8718', '#691888', '#000000'],
            opacity: 0.7
        }
    },
    series: [{
        type: 'heatmap',
        coordinateSystem: 'bmap',
        data: [], // 初始数据为空
        pointSize: 5,
        blurSize: 6
    }]
});

// **数据聚合**
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

// **获取整点时间**
function getCurrentHour() {
    const now = new Date();
    now.setMinutes(0, 0, 0);
    return new Date(now.getTime() - (now.getTimezoneOffset() * 60000)).toISOString();
}



const riskLevels = [
    { min: 48, label: '极度风险' },
    { min: 24, max: 48, label: '重度风险' },
    { min: 14, max: 24, label: '中度风险' },
    { min: 11, max: 14, label: '轻度风险' },
    { min: 7, max: 11, label: '良' },
    { min: 3, max: 7, label: '优' },
    { min: 0, max: 3, label: '无风险' }
];

// 根据风险等级区间对数据进行分类
function classifyRiskLevel(data) {
    const riskCounts = {
        '极度风险': 0,
        '重度风险': 0,
        '中度风险': 0,
        '轻度风险': 0,
        '良': 0,
        '优': 0,
        '无风险': 0
    };

    data.forEach(item => {
        const value = item[2]; // 获取值 (例如 PM2.5)
        for (let level of riskLevels) {
            if ((level.min === undefined || value >= level.min) && (level.max === undefined || value < level.max)) {
                riskCounts[level.label]++;
                break;
            }
        }
    });

    return Object.keys(riskCounts).map(label => ({
        name: label,
        value: riskCounts[label]
    }));
}

// 更新饼图
function updatePieChart(riskData) {
    chart.setOption({
        series: [{
            type: 'pie',
            radius: '50%',
            center: ['50%', '50%'],
            data: riskData,
            label: {
                formatter: '{b}: {d}%',
                fontSize: 14
            }
        }]
    });
}

// **请求数据**
function updateData() {
    const timestamp = getCurrentHour();
    fetch('/queryJkData', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ timestamp: timestamp }),
    })
    .then(response => response.json())
    .then(data => {
        const mapdata = data.coordinates;
         // 计算风险等级分布
         const riskData = classifyRiskLevel(mapdata);

         // 更新饼图
         updatePieChart(riskData);

        // 生成不同网格分辨率的数据
        window.aggregatedData = {
            '1km': { data: aggregateData(mapdata, 0.010854, 0.008993) },
            '2km': { data: aggregateData(mapdata, 0.021708, 0.017986) },
            '5km': { data: aggregateData(mapdata, 0.054270, 0.044965) },
            '10km': { data: aggregateData(mapdata, 0.108540, 0.089930) }
        };

        renderDataByZoom();
    })
    .catch(error => console.error('Error:', error));
}

// **获取地图可见区域边界**
function getVisibleBounds() {
    const bmapComponent = chart.getModel().getComponent('bmap');
    const bmap = bmapComponent.getBMap();
    const bounds = bmap.getBounds();
    const sw = bounds.getSouthWest();
    const ne = bounds.getNorthEast();
    return { minLng: sw.lng, minLat: sw.lat, maxLng: ne.lng, maxLat: ne.lat };
}

// **过滤可见区域内的数据**
function filterDataByBounds(data, bounds) {
    return data.filter(item => {
        const lng = item[0];
        const lat = item[1];
        return lng >= bounds.minLng && lng <= bounds.maxLng && lat >= bounds.minLat && lat <= bounds.maxLat;
    });
}

// **动态调整热力图点大小**
function getHeatmapConfig(zoom) {
    if (zoom >= 13) return { pointSize: 6, blurSize: 12 };
    if (zoom >= 11) return { pointSize: 8, blurSize: 15 };
    if (zoom >= 9) return { pointSize: 10, blurSize: 20 };
    return { pointSize: 12, blurSize: 25 };
}

// **根据缩放级别渲染数据**
function renderDataByZoom() {
    const bmapComponent = chart.getModel().getComponent('bmap');
    const bmap = bmapComponent.getBMap();
    const zoom = bmap.getZoom();
    const bounds = getVisibleBounds();

    let selectedData;
    if (zoom >= 13) {
        selectedData = window.aggregatedData['1km'].data;
    } else if (zoom >= 11) {
        selectedData = window.aggregatedData['2km'].data;
    } else if (zoom >= 9) {
        selectedData = window.aggregatedData['5km'].data;
    } else {
        selectedData = window.aggregatedData['10km'].data;
    }

    const visibleData = filterDataByBounds(selectedData, bounds);
    const heatmapConfig = getHeatmapConfig(zoom);

    chart.setOption({
        series: [{
            type: 'heatmap',
            coordinateSystem: 'bmap',
            data: visibleData,
            pointSize: heatmapConfig.pointSize,
            blurSize: heatmapConfig.blurSize
        }]
    });
}

// **防止频繁触发渲染**
function debounce(func, wait) {
    let timeout;
    return function (...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
    };
}
const debouncedRenderDataByZoom = debounce(renderDataByZoom, 200);

// **监听地图的缩放和拖动**
const bmapComponent = chart.getModel().getComponent('bmap');
const bmap = bmapComponent.getBMap();
bmap.addEventListener('zoomend', debouncedRenderDataByZoom);
bmap.addEventListener('dragend', debouncedRenderDataByZoom);

// **初次加载数据**
updateData();

// **定时更新数据**
setInterval(updateData, 600000 * 3);
