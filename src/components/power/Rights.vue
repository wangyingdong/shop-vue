<template>
  <div>
    <!--导航-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <el-table :data="tableData" border style="width: 100%">
        <el-table-column prop="id" label="编号" width="120"> </el-table-column>
        <el-table-column prop="name" label="名称" width="180"> </el-table-column>
        <el-table-column prop="path" label="路径"> </el-table-column>
        <el-table-column prop="parentId" label="等级">
          <template slot-scope="scope">
            <el-tag type="" v-if="scope.row.level === 1">一级权限</el-tag>
            <el-tag type="success" v-else-if="scope.row.level === 2">二级权限</el-tag>
            <el-tag type="info" v-else>三级权限</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="parentId" label="父节点"> </el-table-column>
        <el-table-column prop="sort" label="排序"> </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'Rights',
  data() {
    return {
      tableData: []
    }
  },
  created() {
    this.getRightsList()
  },
  methods: {
    async getRightsList() {
      const { data: res } = await this.$http.get('/rights/list')
      if (res.code !== 200) {
        return this.$message.error(res.message)
      }
      this.tableData = res.data
    },
    async getRole(id) {
      const { data: res } = await this.$http.get('/rights/roles/' + id)
      if (res.code !== 200) {
        return this.$message.error(res.message)
      }
    }
  }
}
</script>

<style lang="less" scoped></style>
