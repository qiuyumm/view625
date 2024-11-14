$(function(){


    init();
  
  })
  
  function init(){
    // 加载本地JSON文件数据
   
        
                // 初始化ECharts实例
                var myChart = echarts.init(document.getElementById('map2Chart'));

                // 配置ECharts选项
                var option = {
                    bmap: {
                        center: [113.58239, 34.68757],
                        zoom: 7,
                        roam: true,
                    },
                    series: [{
                        name: '行政区域',
                        type: 'map',
                        map: 'henan',
                        roam: false,
                        itemStyle: {
                            normal: {
                                areaColor: '#F0F0F0',
                                borderColor: '#444'
                            },
                            emphasis: {
                                areaColor: '#F4A460'
                            }
                        },                      
                    }]
                };

                // 使用配置项生成图表
                myChart.setOption(option);
                

            showProvince();
    // 使用刚指定的配置项和数据显示图表。
    window.addEventListener("resize", function () {
        myChart.resize();
    });
    }

    

  
 
 
 
 
