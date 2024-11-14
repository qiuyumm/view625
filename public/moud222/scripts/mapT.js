$(function(){
    init();
});



function init() {
    var map;
    var zoom = 12;
    map = new T.Map('mapChart');
    map.centerAndZoom(new T.LngLat(114.39239, 36.09757), zoom);
    var control = new T.Control.Zoom();
    map.addControl(control);
    //添加比例尺控件
    var scale = new T.Control.Scale();
    map.addControl(scale);
    //添加鹰眼控件
    var overview = new T.Control.OverviewMap();
    map.addControl(overview);
    //添加地图类型切换
    var ctrl = new T.Control.MapType();
        //添加控件
    map.addControl(ctrl);
}