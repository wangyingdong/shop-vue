<template>
  <div>
    <!--导航-->
    <Nav :navList="navList"></Nav>
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
import Nav from '../nav/Nav.vue'
export default {
  name: 'Reports',
  components: {
    Nav
  },
  data() {
    return {
      navList: [{ name: '数据管理' }, { name: '数据报表' }],
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
    const data = await this.$http.get('/orders/reports')

    data.forEach((element) => {
      this.dataName.push(element.name)
      this.dataValue.push(element.amount)
    })
    this.initCharts()
  }
}
</script>

<style></style>
