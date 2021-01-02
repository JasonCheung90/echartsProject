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
      this.chartInstance = this.$echarts.init(this.$refs.sellerRef);
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
      const options = {
        xAxis: { type: "value" },
        yAxis: { type: "category", data: sellerName },
        series: [{ type: "bar", data: sellerValue }]
      };
      this.chartInstance.setOption(options);
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
    }
  },
  mounted() {
    this.initChart();
    this.getData();
  },
  destroyed() {
    clearInterval(this.timeInter);
  }
};
</script>
