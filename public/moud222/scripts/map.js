
    var mapChart = echarts.init(document.getElementById('mapChart'));
    mapChart.setOption({
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
            pieces: [
                { min: 500, label:'爆表',color: '#000000' },    // Rank 7
                { min: 250, max: 500,label:'严重污染',color: '#691888' },  // Rank 6
                { min: 150, max: 250, label:'重度污染',color: '#9d2124' },  // Rank 5
                { min: 115, max: 150, label:'中度污染',color: '#d12b2b' },  // Rank 4
                { min: 75, max: 115, label:'轻度污染',color: '#fa8718' },  // Rank 3
                { min: 35, max: 75, label:'良',color: '#d4cf18' },  // Rank 2
                { min: 0, max: 35, label:'优',color: '#74c01f' },  // Rank 1
                // { max: 0, lable:'',color: '#cccccc' }  // 默认颜色
            ],
            left: 'left',
            top: 'top',
            calculable: false,
            // categories: ['爆表','严重污染', '重度污染', '中度污染', '轻度污染', '良', '优'],
        },
        series: []
        
    });
    mapChart.on('click', function (params) {
        $("#el-dialog").removeClass('hide');
        $("#reportTitle").html(params.value[2]);
    });
    
    var bmap = mapChart.getModel().getComponent('bmap').getBMap()
    bmap.addControl(new BMap.MapTypeControl(
        {mapTypes: [BMAP_NORMAL_MAP,BMAP_SATELLITE_MAP,BMAP_HYBRID_MAP ]}
        ));
    bmap.addControl(new BMap.ScaleControl());
    // bmap.setMapStyle({style:'midnight'})


    bmap.addEventListener('click', function(e) {
       // alert('点击的经纬度：' + e.point.lng + ', ' + e.point.lat);
       var point = e.point;
        // 向后端发送请求
        var lng = point.lng;
        var lat = point.lat;
        fetch('/dian', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ longitude: lng, latitude: lat })
        })
        .then(response => response.json())
        .then(data => {
          // console.log('所有数据:', data);  // 打印整个响应数据
          if (data && data.PM2_5_Predicted) {
              console.log('预测值 :', data.PM2_5_Predicted);
              // 创建并添加 Label 到地图上
              var predictedValue = data.PM2_5_Predicted.toFixed(2);
            var label = new BMap.Label(`PM2.5浓度: ${predictedValue}`, {
              position: point, // 指定文本标注所在的地理位置
              offset: new BMap.Size(10, -10) // 设置文本偏移量
          });

          label.setStyle({
              color: "#fff",
              backgroundColor: "#d12b2b",
              border: "none",
              padding: "9px",
              borderRadius: "3px"
          });

          bmap.addOverlay(label); // 将 Label 添加到地图上

          // 添加一个定时器，3秒后自动移除 Label
          setTimeout(function() {
              bmap.removeOverlay(label);
          }, 5000);

          var airInfoDiv = document.getElementById('airInfo');
            if (airInfoDiv) {
                // 渲染air数据到页面中
        document.querySelector('#airInfo .tem').innerText = ` ${data.air.TEMP.toFixed(2)}`;
        document.querySelector('#airInfo .MXSPD').innerText = ` ${data.air.MXSPD.toFixed(2)}`;
        // 你可以按照相同的方式渲染其他数据项
        document.querySelector('#airInfo .VISIB').innerText = ` ${data.air.VISIB.toFixed(2)}`;
        document.querySelector('#airInfo .SLP').innerText = ` ${data.air.SLP.toFixed(2)}`;
        document.querySelector('#airInfo .PRCP').innerText = ` ${data.air.PRCP.toFixed(2)}`;
            }

          } else {
              console.error('Unexpected data format:', data);
              alert('Error: Unexpected data format');
          }
      })
      .catch(error => {
          console.error('Error:', error);
          alert('Error: ' + error.message);
      });
    })


function updateData() {
    fetch('/api/getData', {
        method: 'POST'
    })
    .then(response => response.json())
    .then(data => {
        if (Array.isArray(data)) {
            // 处理数据并转换格式
            const seriesData = data.map(item => {
                let rank = parseInt(item[3], 10); // 解析 rank 为整数
                // 规范化 rank，如果 rank 超出范围，设为 0
                if (isNaN(rank) || rank < 1 || rank > 9) {
                    rank = 0;
                }
                // console.log('Rank:', rank); // 调试输出
                return {
                    name: item[0], // ID
                    value: [parseFloat(item[2]), parseFloat(item[1]), parseFloat(item[4])], // [经度, 纬度, 值]
                    rank: rank // 规范化后的 rank
                };
            });
            // console.log(seriesData)
            // 清空之前的 series 配置，并添加新的数据
            mapChart.setOption({
                series: [{
                    type: 'effectScatter',
                    coordinateSystem: 'bmap',
                    data: seriesData,
                    symbolSize: 8, // 控制标记的大小
                    label: {
                        show: true,
                        formatter: function (params) {
                            return params.data.value[2];  // 只显示值
                        },
                        color: '#fff'
                    },
                    itemStyle: {
                        color: function (params) {
                            // 根据 rank 返回对应的颜色
                            const rankColorMap = {
                                '7': '#000000',
                                '6': '#691888',
                                '5': '#9d2124',
                                '4': '#d4cf18',
                                '3': '#f8f815',
                                '2': '#d4cf18',
                                '1': '#74c01f'
                            };
                            return rankColorMap[params.data.rank.toString()] || '#cccccc';
                        }
                    },
                    emphasis: {
                        label: {
                            show: true,
                            formatter: function (params) {
                                return params.data.value[2];  // 显示高亮值
                            },
                            color: 'red'
                        }
                    }
                }]
            });
        } else {
            console.error('Unexpected data format:', data);
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
}



// 首次页面加载时获取一次数据
updateData();

// 设置定时器，每10分钟(600,000毫秒)获取一次数据
setInterval(updateData, 600000);

