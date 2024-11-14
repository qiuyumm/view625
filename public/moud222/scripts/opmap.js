// 创建地图
var map = new ol.Map({
  //地图容器div的id 
  target: 'mapChart',           
  //地图容器中加载的图层
  layers: [
      //加载瓦片图层数据
      new ol.layer.Tile({
          title: "天地图矢量图层",
          source: new ol.source.XYZ({
              url: "http://t0.tianditu.com/DataServer?T=vec_w&x={x}&y={y}&l={z}&tk=e766c4cf3091bec7dfa65089ac61fce6",                        
              wrapX: false
          })                    
      }),
      new ol.layer.Tile({
          title: "天地图矢量图层注记",
          source: new ol.source.XYZ({
              url: "http://t0.tianditu.com/DataServer?T=cva_w&x={x}&y={y}&l={z}&tk=e766c4cf3091bec7dfa65089ac61fce6",                        
              wrapX: false
          })                    
      })
  ],
  //地图视图设置
  view: new ol.View({
      //地图初始中心点
      center: ol.proj.transform([113.58239, 34.68757], 'EPSG:4326', 'EPSG:3857'), //地图初始中心点
      //地图初始显示级别
      zoom: 6
  })
});