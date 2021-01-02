<template>
  <div class="com-container">
    <div class="com-echart" ref="sellerRef"></div>
  </div>
</template>

<script>
export default {
  name: "Seller",
  data() {
    return {
      chartInstance: null,
      // 服务器返回的数据
      chartData: null,
      // 当前显示页面
      currentPage: 1,
      // 总共的页面
      totalPages: 0,
      // 定时器
      timeInter: null
    };
  },
  methods: {
    //初始化echarts实例对象
    initChart() {
      this.chartInstance = this.$echarts.init(this.$refs.sellerRef, "chalk");
      // 对图表初始化配置
      const initOptions = {
        title: {
          text: "商家销售数据统计图",
          textStyle: {
            fontSize: 30
          },
          top: 20,
          left: 20
        },
        grid: {
          left: "10%",
          top: "10%",
          right: "10%",
          bottom: "10%"
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "line",
            z: 0,
            lineStyle: {
              width: 50,
              color: "#2D3443"
            }
          }
        },
        xAxis: { type: "value" },
        yAxis: { type: "category" },
        series: [
          {
            type: "bar",
            barWidth: 50,
            label: { show: true, position: "right", color: "white" },
            itemStyle: {
              barBorderRadius: [0, 30, 30, 0]
            }
          }
        ]
      };
      this.chartInstance.setOption(initOptions);
      this.chartInstance.on("mouseover", () => {
        clearInterval(this.timeInter);
      });
      this.chartInstance.on("mouseout", () => {
        this.startInterval();
      });
    },
    // 获取服务器数据
    async getData() {
      const { data } = await this.axios.get("seller");
      this.chartData = data;
      // 对数据排序
      this.chartData.sort((a, b) => a.value - b.value);
      // 每5个显示一页
      this.totalPages =
        this.chartData.length % 5 === 0
          ? this.chartData.length / 5
          : (this.chartData.length % 5) + 1;
      this.upDateChart();
      // 启动定时器
      this.startInterval();
    },
    // 更新图表
    upDateChart() {
      const start = (this.currentPage - 1) * 5;
      const end = this.currentPage * 5;
      const showData = this.chartData.slice(start, end);
      const sellerName = showData.map(item => item.name);
      const sellerValue = showData.map(item => item.value);
      const dataOptions = {
        yAxis: { data: sellerName },
        series: [
          {
            data: sellerValue
          }
        ]
      };
      this.chartInstance.setOption(dataOptions);
    },
    // 开启定时器
    startInterval() {
      this.timeInter = setInterval(() => {
        this.currentPage++;
        if (this.currentPage > this.totalPages) {
          this.currentPage = 1;
        }
        this.upDateChart();
      }, 3000);
    },
    // 屏幕适配
    screenAdapter() {
      const w = this.$refs.sellerRef.offsetWidth;
      const titleFontSize = (w / 100) * 3.5;
      const screenOptions = {
        title: {
          textStyle: {
            fontSize: titleFontSize
          }
        },
        tooltip: {
          axisPointer: {
            lineStyle: {
              width: titleFontSize
            }
          }
        },
        series: [
          {
            barWidth: titleFontSize,
            itemStyle: {
              barBorderRadius: [0, titleFontSize / 2, titleFontSize / 2, 0]
            }
          }
        ]
      };
      this.chartInstance.setOption(screenOptions);
      this.chartInstance.resize();
    }
  },
  mounted() {
    this.initChart();
    this.getData();
    window.addEventListener("resize", this.screenAdapter);
    this.screenAdapter();
  },
  destroyed() {
    clearInterval(this.timeInter);
  }
};
</script>
