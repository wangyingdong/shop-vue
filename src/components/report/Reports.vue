<template>
  <div>
    <!--导航-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>数据报表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <template>
        <div class="Echarts">
          <div id="main" style="width: 800px; height: 600px"></div>
        </div>
      </template>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'Reports',
  data() {
    return {
      dataName: [],
      dataValue: []
    }
  },
  methods: {
    initCharts() {
      var myChart = this.$echarts.init(document.getElementById('main'))
      // 配置图表
      var option = {
        title: {
          text: '产品销售报表'
        },
        tooltip: {},
        legend: {
          data: ['销量']
        },
        xAxis: {
          data: this.dataName
        },
        yAxis: {},
        series: [
          {
            name: '销量',
            type: 'bar',
            data: this.dataValue
          }
        ]
      }
      myChart.setOption(option)
    }
  },
  async mounted() {
    const { data: res } = await this.$http.get('/orders/report')
    if (res.code !== 200) {
      return this.$message.error(res.data)
    }
    res.data.forEach((element) => {
      this.dataName.push(element.name)
      this.dataValue.push(element.amount)
    })
    this.initCharts()
  }
}
</script>

<style></style>
