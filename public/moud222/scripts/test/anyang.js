$(function(){


    init();
  
  })

  function init(){
    // 基于准备好的dom，初始化echarts实例
    // var myChart = echarts.init(document.getElementById('amap'));
    // function showProvince() {
    //         myChart.setOption(option = {
    //             // backgroundColor: '#ffffff',
    //             visualMap: {
    //                 show: false,
    //                 min: 0,
    //                 max: 100,
    //                 left: 'left',
    //                 top: 'bottom',
    //                 text: ['高', '低'], // 文本，默认为数值文本
    //                 calculable: true,
    //                 inRange: {
    //                     color: ['yellow', 'lightskyblue', 'orangered']
    //                 }
    //             },
    //             tooltip: {
    //                 trigger: 'item',
    //                 formatter: '{b}<br/>{c} (万人)'
    //             },
    //             series: [{
    //                 type: 'map',
    //                 mapType: 'anyang',
    //                 roam: true,
                    
    //                 label: {
    //                     normal: {
    //                         show: true
    //                     },
    //                     emphasis: {
    //                         textStyle: {
    //                             color: '#fff'
    //                         }
    //                     }
    //                 },
    //                 itemStyle: {
    //                     normal: {
    //                         borderColor: '#389BB7',
    //                         areaColor: '#fff',
    //                     },
    //                     emphasis: {
    //                         areaColor: '#389BB7',
    //                         borderWidth: 0
    //                     }
    //                 },
    //                 animation: false,
    //                 data: [ { name: '文峰区', value: 579101 },
    //                 { name: '北关区', value: 327762 },
    //                 { name: '殷都区', value: 219780 },
    //                 { name: '龙安区', value: 272224 },
    //                 { name: '安阳县', value: 821530 },
    //                 { name: '汤阴县', value: 455136 },
    //                 { name: '滑县', value: 1169072 },
    //                 { name: '内黄县', value: 682070 },
    //                 { name: '林州市', value: 950939 }]
    //             }]
    //         });
    // }
// --------------------------人口图2
   // var dom = document.getElementById('pieChart1');
    var dom = document.getElementById('amap');
    var Chart1 = echarts.init(dom);
    // var app = {};
    // var ROOT_PATH = 'https://echarts.apache.org/examples';
     var option;

     Chart1.showLoading();
  
     Chart1.hideLoading();
    
     Chart1.setOption(
    (option = {
      
      tooltip: {
        trigger: 'item',
        formatter: '{b}<br/>{c} (万人)'
      },
      
      visualMap: {
        show:false,
        min: 200000,
        max: 1200000,
        text: ['High', 'Low'],
        realtime: false,
        calculable: true,
        inRange: {
          color: ['lightskyblue', 'yellow', 'orangered']
        }
      },
      series: [
        {
          name: '安阳人口图',
          type: 'map',
          map: 'anyang',
          label: {
            show: true
          },
          data: [
            { name: '文峰区', value: 579101 },
            { name: '北关区', value: 327762 },
            { name: '殷都区', value: 219780 },
            { name: '龙安区', value: 272224 },
            { name: '安阳县', value: 821530 },
            { name: '汤阴县', value: 455136 },
            { name: '滑县', value: 1169072 },
            { name: '内黄县', value: 682070 },
            { name: '林州市', value: 950939 }
          ]
        }
      ]
    })
  );

//--------------------------------------------------

// var histogramChart = echarts.init(document.getElementById('histogramChart'));
//     histogramChart.setOption({

//       color:["#87cefa","#ff7f50","#32cd32","#da70d6",],
//       legend: {
//           y : '250',
//           x : 'center',
//           data:['2017年', '2018年','2019年','2020年'],
//           textStyle : {
//               color : '#ffffff',

//           }
//       },

//       calculable :false,


//       grid:{
//               left: '5%',
//               right: '5%',
//               bottom: '20%',
//               containLabel: true
//       },

//       tooltip : {
//           trigger: 'axis',
//           axisPointer : {
//               type : 'shadow'
//           }
//       },

//       xAxis : [
//           {
//               type : 'value',
//               axisLabel: {
//                   show: true,
//                   textStyle: {
//                       color: '#fff'
//                   }
//               },
//               splitLine:{
//                   lineStyle:{
//                       color:['#f2f2f2'],
//                       width:0,
//                       type:'solid'
//                   }
//               }

//           }
//       ],

//       yAxis : [
//           {
//               type : 'category',
//               data:['门诊人数(人)', '住院人次(人)','人均费用(元)'],
//               axisLabel: {
//                   show: true,
//                   textStyle: {
//                       color: '#fff'
//                   }
//               },
//               splitLine:{
//                   lineStyle:{
//                       width:0,
//                       type:'solid'
//                   }
//               }
//           }
//       ],

//       series : [
//           {
//               name:'2017年',
//               type:'bar',
//               stack: '总量',
//               itemStyle : { normal: {label : {show: true, position: 'insideRight'}}},
//               data:[320, 302, 301]
//           },
//           {
//               name:'2018年',
//               type:'bar',
//               stack: '总量',
//               itemStyle : { normal: {label : {show: true, position: 'insideRight'}}},
//               data:[120, 132, 101]
//           },
//           {
//               name:'2019年',
//               type:'bar',
//               stack: '总量',
//               itemStyle : { normal: {label : {show: true, position: 'insideRight'}}},
//               data:[220, 182, 191]
//           },
//           {
//               name:'2020年',
//               type:'bar',
//               stack: '总量',
//               itemStyle : { normal: {label : {show: true, position: 'insideRight'}}},
//               data:[150, 212, 201]
//           }

//       ]
//    });

    var lineChart = echarts.init(document.getElementById('lineChart'));
    lineChart.setOption({

      color:["#87cefa","#ff7f50","#32cd32","#da70d6",],
      legend: {
          y : '260',
          x : 'center',
          textStyle : {
              color : '#ffffff',

          },
           data : ['2017年','2018年','2019年','2020年','2021年'],
      },
      calculable : false,
      tooltip : {
          trigger: 'item',
          formatter: "{a}<br/>{b}<br/>{c}%"
      },
      yAxis: [
            {
                type: 'value',
                axisLine : {onZero: false},
                axisLine:{
                    lineStyle:{
                        color: '#034c6a'
                    },
                },

                axisLabel: {
                    textStyle: {
                        color: '#fff'
                    },
                    formatter: function (value) {
                        return value + "%"
                    },
                },
                splitLine:{
                    lineStyle:{
                        width:0,
                        type:'solid'
                    }
                }
            }
        ],
        xAxis: [
            {
                type: 'category',
                data : ['1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月'],
                axisLine:{
                    lineStyle:{
                        color: '#034c6a'
                    },
                },
                splitLine: {
                    "show": false
                },
                axisLabel: {
                    textStyle: {
                        color: '#fff'
                    },
                    formatter: function (value) {
                        return value + ""
                    },
                },
                splitLine:{
                    lineStyle:{
                        width:0,
                        type:'solid'
                    }
                },
            }
        ],
        grid:{
                left: '5%',
                right: '5%',
                bottom: '20%',
                containLabel: true
        },
        series : [
          {
              name:'2017年',
              type:'line',
              smooth:true,
              itemStyle: {
                  normal: {
                      lineStyle: {
                          shadowColor : 'rgba(0,0,0,0.4)'
                      }
                  }
              },
              data:[33.3,27.8,38.9,27.8,	27.8,	27.8,	38.9,38.9,38.9,27.8,33.3,38.9,44.4
              ]
          },
          {
              name:'2018年',
              type:'line',
              smooth:true,
              itemStyle: {
                  normal: {
                      lineStyle: {
                          shadowColor : 'rgba(0,0,0,0.4)'
                      }
                  }
              },
              data:[20.8,20.8,20.0,36.0,24.0,52.0,40.0,20.0,19.0,33.3,38.1,33.3,32.0
              ]
          },
          {
              name:'2019年',
              type:'line',
              smooth:true,
              itemStyle: {
                  normal: {
                      lineStyle: {
                          shadowColor : 'rgba(0,0,0,0.4)'
                      }
                  }
              },
              data:[40.9,50.0,45.5,36.4,36.4,27.3,22.7,22.7,36.4,31.8,54.5,59.1,36.4
              ]
          },
          {
              name:'2020年',
              type:'line',
              smooth:true,
              itemStyle: {
                  normal: {
                      lineStyle: {
                          shadowColor : 'rgba(0,0,0,0.4)'
                      }
                  }
              },
              data:[47.8,69.6,	65.2,	69.6,	43.5,47.8,47.8,47.8,34.8,52.2,47.8,73.9,65.2
              ]
          }
          
          
      ]
    });



    
    var currentIdx = 0;
    // showProvince();




    // 使用刚指定的配置项和数据显示图表。
    window.addEventListener("resize", function () {
        myChart.resize();
    });
}