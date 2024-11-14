var chart = echarts.init(document.getElementById('mapChart'), null, { renderer: 'canvas' });

var Pdata = [
    [
        116.01078662655334,
        36.19521067581114,
        11.893005668318246
    ],
    [
        116.02164090002081,
        36.19521067581114,
        15.232237919856502
    ],
    [
        116.03249517348829,
        36.19521067581114,
        15.363416161964851
    ],
    [
        116.04334944695576,
        36.19521067581114,
        14.708181487605424
    ],
    [
        116.05420372042323,
        36.19521067581114,
        8.112526810040308
    ],
    [
        116.0650579938907,
        36.19521067581114,
        8.235403095062113
    ]

];

var COLORS = ['#070093', '#1c3fbf', '#1482e5', '#70b4eb', '#b4e0f3', '#ffffff'];


// 获取最小值和最大值用于色标映射
var minValue = Math.min(...Pdata.map(item => item[2]));
var maxValue = Math.max(...Pdata.map(item => item[2]));

var gridWidth = 0.010854; // 经度上1km的差值约等于 0.010854
var gridHeight = 0.008993; // 定义每个网格的高度

        // 生成 custom 图表配置
chart.setOption({
            bmap: {
                center: [113.58239, 34.68757],
                zoom: 7,
                roam: true,
                mapStyle: {
                    styleJson: [
                      {
                        featureType: 'water',
                        elementType: 'all',
                        stylers: {
                          color: '#d1d1d1'
                        }
                      },
                      {
                        featureType: 'land',
                        elementType: 'all',
                        stylers: {
                          color: '#f3f3f3'
                        }
                      },
                      {
                        featureType: 'railway',
                        elementType: 'all',
                        stylers: {
                          visibility: 'off'
                        }
                      },
                      {
                        featureType: 'highway',
                        elementType: 'all',
                        stylers: {
                          color: '#fdfdfd'
                        }
                      },
                      {
                        featureType: 'highway',
                        elementType: 'labels',
                        stylers: {
                          visibility: 'off'
                        }
                      },
                      {
                        featureType: 'arterial',
                        elementType: 'geometry',
                        stylers: {
                          color: '#fefefe'
                        }
                      },
                      {
                        featureType: 'arterial',
                        elementType: 'geometry.fill',
                        stylers: {
                          color: '#fefefe'
                        }
                      },
                      {
                        featureType: 'poi',
                        elementType: 'all',
                        stylers: {
                          visibility: 'off'
                        }
                      },
                      {
                        featureType: 'green',
                        elementType: 'all',
                        stylers: {
                          visibility: 'off'
                        }
                      },
                      {
                        featureType: 'subway',
                        elementType: 'all',
                        stylers: {
                          visibility: 'off'
                        }
                      },
                      {
                        featureType: 'manmade',
                        elementType: 'all',
                        stylers: {
                          color: '#d1d1d1'
                        }
                      },
                      {
                        featureType: 'local',
                        elementType: 'all',
                        stylers: {
                          color: '#d1d1d1'
                        }
                      },
                      {
                        featureType: 'arterial',
                        elementType: 'labels',
                        stylers: {
                          visibility: 'off'
                        }
                      },
                      {
                        featureType: 'boundary',
                        elementType: 'all',
                        stylers: {
                          color: '#fefefe'
                        }
                      },
                      {
                        featureType: 'building',
                        elementType: 'all',
                        stylers: {
                          color: '#d1d1d1'
                        }
                      },
                      {
                        featureType: 'label',
                        elementType: 'labels.text.fill',
                        stylers: {
                          color: '#999999'
                        }
                      }
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
                    { min: 500, label:'爆表' },    // Rank 7
                    { min: 250, max: 500,label:'严重污染' },  // Rank 6
                    { min: 150, max: 250, label:'重度污染' },  // Rank 5
                    { min: 115, max: 150, label:'中度污染' },  // Rank 4
                    { min: 75, max: 115, label:'轻度污染' },  // Rank 3
                    { min: 35, max: 75, label:'良' },  // Rank 2
                    { min: 0, max: 35, label:'优' },  // Rank 1
                    // { max: 0, lable:'',color: '#cccccc' }  // 默认颜色
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
                    var lng = api.value(0); // 经度
                    var lat = api.value(1); // 纬度
                    var value = api.value(2); // 数据值
                    var point = api.coord([lng, lat]); // 将经纬度转换为屏幕坐标

                    var color = api.visual('color'); // 根据 visualMap 获取颜色

                    // 计算网格的左上角和右下角坐标，确保网格紧靠相邻
                    var gridLeftTop = api.coord([lng, lat + gridHeight]);
                    var gridRightBottom = api.coord([lng + gridWidth, lat]);

                    // 绘制每个不重叠的矩形网格
                    return {
                        type: 'rect',
                        shape: {
                            x: gridLeftTop[0], // 矩形左上角X
                            y: gridLeftTop[1], // 矩形左上角Y
                            width: gridRightBottom[0] - gridLeftTop[0], // 矩形宽度
                            height: gridRightBottom[1] - gridLeftTop[1]  // 矩形高度
                        },
                        style: api.style({
                            stroke: 'rgba(0,0,0,0.1)'
                          }),
                          styleEmphasis: api.styleEmphasis()
                    };
                },
                animation: false,
                
                data: Pdata,
                emphasis: {
                    itemStyle: {
                      color: '#1482e5'
                    }
                  },
                encode: {
                    x: 0,
                    y: 1,
                    value: 2,
                }
            }]
        });


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
                const mapdata = data.coordinates
                // console.log(mapdata)
                chart.setOption({
                    series: [{   
                        data: mapdata,
                    }]

                })

                //console.log('Received data:', data);
            })
            .catch(error => {
                console.error('Error:', error);
            });


}

        

 // 首次页面加载时获取一次数据
updateData();

// 设置定时器，每10分钟(600,000毫秒)获取一次数据
setInterval(updateData, 600000*3);

chart.getModel().getComponent('bmap').getBMap();