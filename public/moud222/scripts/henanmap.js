$(function(){
    init();
});

function init(){
    //地图
    var mapChart = echarts.init(document.getElementById('mapChart'));
    mapChart.setOption({
        tooltip : {
            trigger: 'item'
        },
        geo: {
            map: 'henancity',
            label: {
                emphasis: {
                    show: true
                }
            },
            roam: true,
            zoom:1.2,
            itemStyle: {
                normal: {
                    areaColor: 'rgba(2,37,101,.5)',
                    borderColor: 'rgba(112,187,252,.5)'
                },
                emphasis: {
                    areaColor: 'rgba(2,37,101,.8)'
                }
            }
        },
        series:[
            {
                name: 'ditu',
                ttype: 'scatter',
                coordinateSystem: 'geo',
                label: {
                    normal: {
                        formatter: '{b}',
                        position: 'right',
                        show: false
                    },
                    emphasis: {
                        show: true
                    }
                },
                itemStyle: {
                    normal: {
                        color: '#ffeb7b'
                    }
                }
            }
        ]
        
        
    });
    
    // bmap.setMapStyle({style:'midnight'})
  
  
//     var tilelayer = new BMap.TileLayer();         // 创建地图层实例    
// tilelayer.getTilesUrl=function(){             // 设置图块路径     
//     return "http://localhost:8086/geoserver/anyang/wms?service=WMS&version=1.1.0&request=GetMap&layers=anyang%3Atijian&bbox=3.849334902756307E7%2C3980902.4555663727%2C3.8550695770709276E7%2C4025409.082708303&width=768&height=596&srs=EPSG%3A4526&";      
// };      
//    bmap.addTileLayer(tilelayer);      
  
  
      
  
  }