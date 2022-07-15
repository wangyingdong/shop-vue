<template>
  <div>
    <!--导航-->
    <Nav :navList="navList"></Nav>

    <!--卡片视图区域-->
    <el-card>
      <el-row>
        <el-col :span="1"><el-button type="primary" @click="showAddCategoryDialog">增加分类</el-button></el-col>
      </el-row>

      <!--分类对话框-->
      <el-dialog title="增加分类" width="50%" :visible.sync="addCategoryDialogVisible" @close="addCategoryDialogClosed()">
        <el-form :model="addCategoryForm" ref="addCategoryFormRef" label-width="100px">
          <el-form-item label="分类名称" prop="name" :rules="[{ required: true, message: '请输入分类名称', trigger: 'blur' }]">
            <el-input v-model="addCategoryForm.name"></el-input>
          </el-form-item>

          <el-form-item label="父级分类">
            <el-row>
              <el-col :span="1">
                <el-cascader size="medium" :clearable="true" v-model="selectedKeys" :props="categoryProps" :options="categoryData" @change="handleCategoryChange" style="width: 400px"> </el-cascader>
              </el-col>
            </el-row>
          </el-form-item>

          <el-form-item
            label="排序"
            prop="sort"
            :rules="[
              { required: true, message: '请输入排序', trigger: 'blur' },
              { type: 'number', message: '必须是数字' }
            ]"
          >
            <el-input v-model.number="addCategoryForm.sort" style="width: 200px; float: left"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="addCategoryDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addCategoryDialogSubmit()">确 定</el-button>
        </div>
      </el-dialog>

      <!--表格-->
      <tree-table :selection-type="false" :expand-type="false" :data="tableData" :columns="columns" :border="true">
        <template slot="state" slot-scope="scope">
          <el-tag type="success" v-if="scope.row.state">启用</el-tag>
          <el-tag type="warning" v-else>禁用</el-tag>
        </template>

        <template slot="level" slot-scope="scope">
          <el-tag type="" v-if="scope.row.level === 1">一级类别</el-tag>
          <el-tag type="success" v-else-if="scope.row.level === 2">二级类别</el-tag>
          <el-tag type="info" v-else>三级类别</el-tag>
        </template>

        <template slot="sort" slot-scope="scope">
          {{ scope.row.sort }}
        </template>

        <template slot="operation">
          <el-button type="primary" size="mini" icon="el-icon-edit"></el-button>
          <el-button type="danger" size="mini" icon="el-icon-delete"></el-button>
        </template>
      </tree-table>

      <!--分页-->

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
import Nav from '../nav/Nav.vue'

export default {
  name: 'Categories',

  components: {
    Nav
  },
  data() {
    return {
      navList: [{ name: '商品管理' }, { name: '商品分类' }],

      addCategoryForm: {
        name: '',
        parentId: 0,
        level: 1,
        state: 1,
        sort: ''
      },
      categoryProps: {
        checkStrictly: true,
        value: 'id',
        label: 'name',
        children: 'children'
      },
      // 选中的父级的Id数组
      selectedKeys: [],
      addCategoryDialogVisible: false,
      tableData: [{}],
      categoryData: [],
      page: {
        total: 0,
        hasNextPage: false
      },
      queryParams: {
        query: '',
        pageNum: 1,
        pageSize: 10
      },
      columns: [
        {
          label: '编号',
          prop: 'id',
          width: '180px'
        },
        {
          label: '名称',
          prop: 'name',
          width: '180px'
        },
        {
          label: '状态',
          prop: 'state',
          width: '180px',
          // 模板列
          type: 'template',
          template: 'state'
        },
        {
          label: '级别',
          prop: 'level',
          // 模板列
          type: 'template',
          template: 'level'
        },
        {
          label: '排序',
          prop: 'sort',
          // 模板列
          type: 'template',
          template: 'sort'
        },
        {
          label: '操作',
          // 模板列
          type: 'template',
          template: 'operation'
        }
      ]
    }
  },
  created() {
    this.getCategoryList()
  },
  methods: {
    async addCategoryDialogSubmit() {
      this.$refs.addCategoryFormRef.validate(async (valid) => {
        if (valid) {
          console.log(this.addCategoryForm)
          const data = await this.$http.post('/category', this.addCategoryForm)

          this.$message({ type: 'success', message: '类别增加成功!' })
          this.addCategoryDialogVisible = false
          this.getCategoryList()
        }
      })
    },
    addCategoryDialogClosed() {
      this.$refs.addCategoryFormRef.resetFields()
      this.addCategoryForm.level = 1
      this.addCategoryForm.state = 1
      this.addCategoryForm.parentId = ''
      this.selectedKeys = []
    },
    handleCategoryChange(value) {
      if (this.selectedKeys.length > 0) {
        this.addCategoryForm.parentId = this.selectedKeys[this.selectedKeys.length - 1]
        this.addCategoryForm.level = this.selectedKeys.length + 1
      } else {
        this.addCategoryForm.parentId = 0
        this.addCategoryForm.level = 1
      }
    },
    async showAddCategoryDialog() {
      this.addCategoryDialogVisible = true
      const data = await this.$http.get('/categories', {
        pageNum: 1,
        pageSize: 9999999
      })

      this.categoryData = data.list
    },
    handleSizeChange(val) {
      this.queryParams.pageSize = val
      this.getCategoryList()
    },
    handleCurrentChange(val) {
      this.queryParams.pageNum = val
      this.getCategoryList()
    },
    async getCategoryList() {
      const data = await this.$http.get('/categories', this.queryParams)
      this.tableData = data.list
      this.page = { total: data.total, hasNextPage: data.hasNextPage }
    }
  }
}
</script>

<style lang="less" scoped>
.zk-table {
  font-size: 16px;
  margin-top: 10px;
}
</style>
