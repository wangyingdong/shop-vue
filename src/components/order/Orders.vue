<template>
  <div>
    <!--导航-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!--搜索-->
    <el-card>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input placeholder="请输入内容" clearable class="input-with-select">
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>

        <el-col :span="4"> </el-col>
      </el-row>

      <!--表格列表-->
      <el-table :data="orderList" border stripe style="width: 100%">
        <el-table-column prop="id" label="编号" width="150"> </el-table-column>
        <el-table-column prop="name" label="商品" width="120"> </el-table-column>
        <el-table-column prop="amount" label="数量" width="50"> </el-table-column>
        <el-table-column prop="price" label="价格"> </el-table-column>
        <el-table-column prop="address" label="地址" width="250"> </el-table-column>

        <el-table-column prop="datetime" label="时间"> </el-table-column>
        <el-table-column prop="state" label="状态" width="100">
          <template slot-scope="scope">
            <el-tag type="info" v-if="scope.row.state === 1">未付款</el-tag>
            <el-tag type="success" v-else-if="scope.row.state === 2">已付款</el-tag>
            <el-tag type="warning" v-else-if="scope.row.state === 3">已发货</el-tag>
            <el-tag type="primary" v-else>已完成</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" icon="el-icon-edit" @click="showAddressBox"></el-button>
            <el-button type="success" size="mini" icon="el-icon-location" @click="showLogisticBox(scope.row)"></el-button>
          </template>
        </el-table-column>
      </el-table>

      <!--分页-->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryParams.pageNum"
        :page-sizes="[1, 2, 5, 10]"
        :page-size="queryParams.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="page.total"
      >
      </el-pagination>

      <!--分页-->

      <!--物流-->
      <el-dialog title="收货地址" :visible.sync="addressDialogVisible" width="30%">
        <el-form :model="addressForm" :rules="addressFormRules" ref="addressFormRef" label-width="100px">
          <el-form-item label="省市区" prop="province_city_area">
            <el-cascader style="float: left; width: 310px" size="large" :options="options" v-model="addressForm.province_city_area" @change="addressChange" clearable> </el-cascader>
          </el-form-item>

          <el-form-item label="地址" prop="address">
            <el-input v-model="addressForm.address"></el-input>
          </el-form-item>

          <el-form-item>
            <el-button type="primary" @click="submitForm('addressFormRef')">提交</el-button>
            <el-button @click="resetForm('addressFormRef')">重置</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>

      <!--物流-->

      <el-dialog title="物流信息" :visible.sync="logisticDialogVisible" width="30%">
        <el-timeline>
          <el-timeline-item v-for="(activity, index) in logisticList" :key="index" :timestamp="activity.datetime">
            {{ activity.content }}
          </el-timeline-item>
        </el-timeline>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
import { regionData, CodeToText } from 'element-china-area-data'

export default {
  name: 'Orders',
  data() {
    return {
      // 省市区
      options: regionData,
      // 省市区
      addressForm: {
        province_city_area: [],
        address: ''
      },
      addressFormRules: {
        province_city_area: [{ type: 'array', required: true, message: '请选择省市区', trigger: 'blur' }],
        address: [{ required: true, message: '请输入地址', trigger: 'blur' }]
      },
      addressDialogVisible: false,
      logisticDialogVisible: false,
      orderList: [],
      logisticList: [],
      page: {
        total: 0,
        hasNextPage: false
      },
      queryParams: {
        query: '',
        pageNum: 1,
        pageSize: 5
      }
    }
  },
  created() {
    this.getOrderList()
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          alert('submit!')
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },
    addressChange(arr) {
      console.log(arr)
      console.log(CodeToText[arr[0]], CodeToText[arr[1]], CodeToText[arr[2]])
    },
    // 修改地址
    showAddressBox() {
      this.addressDialogVisible = true
    },
    async showLogisticBox(row) {
      const { data: res } = await this.$http.get('/orders/' + row.id + '/logistic')
      if (res.code !== 200) {
        return this.$message.error(res.data)
      }
      this.logisticList = res.data
      this.logisticDialogVisible = true
    },
    handleSizeChange(val) {
      this.queryParams.pageSize = val
      this.getOrderList()
    },
    handleCurrentChange(val) {
      this.queryParams.pageNum = val
      this.getOrderList()
    },
    async getOrderList() {
      const { data: res } = await this.$http.get('/orders', {
        params: this.queryParams
      })
      if (res.code !== 200) {
        return this.$message.error(res.data)
      }
      this.orderList = res.data.list
      this.page = { total: res.data.total, hasNextPage: res.data.hasNextPage }
    }
  }
}
</script>

<style lang="less" scoped></style>
