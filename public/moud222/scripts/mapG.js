$(function(){
    init();
});


  

  


function init(){
    const map=new AMap.Map('mapChart',{
        viewMode: '2D', 
        zoom:12,
        center: [114.39239, 36.09757]
    });
    var wms  = new AMap.TileLayer.WMS({
        url: 'https://localhost:8086/geoserver/anyangdemo/wms', // wms服务的url地址
        blend: false, // 地图级别切换时，不同级别的图片是否进行混合
        tileSize: 512, // 加载WMS图层服务时，图片的分片大小
        params: {
          'LAYERS': 'anyang:tijian',
          VERSION:'1.1.0'
        } // OGC标准的WMS地图服务的GetMap接口的参数
      });
      map.add(wms);
}