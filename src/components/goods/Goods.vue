<template>
  <div>
    <!--导航-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!--卡片视图区域-->
    <el-card>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input v-model="queryParams.query" placeholder="请输入内容">
            <el-button @click="getGoodsData()" slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="goAddGood">增加商品</el-button>
        </el-col>
      </el-row>

      <!--表格-->
      <el-table :data="goodData" border style="width: 100%">
        <el-table-column prop="id" label="编号" width="50"> </el-table-column>
        <el-table-column prop="name" label="名称" width="300"> </el-table-column>
        <el-table-column prop="price" label="价格"> </el-table-column>
        <el-table-column prop="amount" label="数量" width="180"> </el-table-column>

        <el-table-column label="缩列图" width="180">
          <template slot-scope="scope">
            <div class="demo-image__preview">
              <el-image style="width: 100px; height: 100px" :src="getFirstImage(scope.row.images)" :preview-src-list="getImagesArray(scope.row.images)"> </el-image>
            </div>
          </template>
        </el-table-column>

        <el-table-column prop="datetime" width="200" label="日期"> </el-table-column>

        <el-table-column width="120" label="操作">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" icon="el-icon-edit"></el-button>
            <el-button size="mini" type="danger" icon="el-icon-delete" @click="deleteGood(scope.row)"></el-button>
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
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'Goods',
  data() {
    return {
      goodData: [],
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
    this.getGoodsData()
  },
  methods: {
    getFirstImage(images) {
      if (images) {
        return images.split(',')[0]
      }
    },
    getImagesArray(images) {
      if (images) {
        return images.split(',')
      }
    },
    async getGoodsData() {
      const { data: res } = await this.$http.get('/goods', {
        params: this.queryParams
      })
      if (res.code !== 200) {
        return this.$message.error(res.data)
      }
      this.goodData = res.data.list
      this.page = { total: res.data.total, hasNextPage: res.data.hasNextPage }
    },
    handleSizeChange(val) {
      this.queryParams.pageSize = val
      this.getGoodsData()
    },
    handleCurrentChange(val) {
      this.queryParams.pageNum = val
      this.getGoodsData()
    },
    goAddGood() {
      this.$router.push('/goods/add')
    },
    async deleteGood(row) {
      await this.$confirm('此操作将永久删除该商品, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          const { data: res } = await this.$http.delete('/goods/' + row.id)
          if (res.code !== 200) {
            return this.$message.error(res.data)
          }
          this.$message({ type: 'success', message: '删除成功!' })
          this.goodData.splice(
            this.goodData.findIndex((item) => item.id === row.id),
            1
          )
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    }
  }
}
</script>

<style></style>
