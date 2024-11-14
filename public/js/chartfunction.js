
      let jsonData = null;
      let chartType = "bar";

      function handleFile() {
        let input = document.getElementById("input");
        let reader = new FileReader();
        reader.onload = function (e) {
          let data = e.target.result;
          let workbook = XLSX.read(data, { type: "binary" });
          let sheet_name_list = workbook.SheetNames;
          let worksheet = workbook.Sheets[sheet_name_list[0]];
          jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
          console.log(jsonData);
        };
        reader.readAsBinaryString(input.files[0]);
      }

      function createBarChart() {
        chartType = "bar";
        createChart();
      }

      function createLineChart() {
        chartType = "line";
        createChart();
      }

      function createChart() {
        if (jsonData === null) {
          alert("请选择文件");
          return;
        }

      

        let labels = jsonData[0].slice(1);
        let datasets = [];
        for (let i = 1; i < jsonData.length; i++) {
          let data = jsonData[i].slice(1);
          let backgroundColor = "rgba(54, 162, 235, 0.2)";
          let borderColor = "rgba(54, 162, 235, 1)";
          let borderWidth = 1;
          let dataset = {
            label: jsonData[i][0],
            data: data,
            backgroundColor: backgroundColor,
            borderColor: borderColor,
            borderWidth: borderWidth,
          };
          datasets.push(dataset);
        }
        let ctx = document.getElementById("myChart").getContext("2d");
        //清空之前生成的图表
        let existingChart = Chart.getChart(ctx);
        if (existingChart) {
            existingChart.destroy();
         }
        let chart = new Chart(ctx, {
          type: chartType,
          data: {
            labels: labels,
            datasets: datasets,
          },
          options: {
            scales: {
              y: {
                beginAtZero: true,
              },
            },
          },
        });
      }