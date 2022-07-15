<template>
  <div>
    <!--导航-->
    <Nav :navList="navList"></Nav>

    <el-card>
      <el-alert show-icon :title="tipsTitle" :type="tipsType" :closable="false" style="margin: 0px 0px 10px 0px"> </el-alert>

      <!--级联-->
      <el-cascader-panel ref="cascaderRef" @change="handleChange" v-model="selectedKeys" style="text-align: left" :props="categoryProps" :options="categoryData"></el-cascader-panel>

      <el-tabs v-model="activeName" @tab-click="handleTabClick">
        <el-tab-pane label="动态参数" name="dynamic">
          <el-button type="primary" @click="addDialogVisible = true" :disabled="disabled" style="margin: 0px 0px 10px 0px">增加参数</el-button>

          <el-table :data="dynamicTableData" border stripe>
            <el-table-column type="expand">
              <template slot-scope="scope">
                <el-tag v-for="tag in scope.row.attributeValue" :key="tag.id" closable :disable-transitions="false" @close="handleTagClose(tag, scope.row)" style="margin: 10px; float: left">
                  {{ tag.value }}
                </el-tag>

                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                >
                </el-input>
                <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
              </template>
            </el-table-column>
            <el-table-column label="编号" prop="id"></el-table-column>
            <el-table-column label="名称" prop="name"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button type="primary" size="mini" icon="el-icon-edit" @click="showEditDialog(scope.row)"></el-button>
                <el-button type="info" size="mini" icon="el-icon-delete" @click="showDeleteDialog(scope.row)"></el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="静态属性" name="static">
          <el-button type="primary" @click="addDialogVisible = true" :disabled="disabled" style="margin: 0px 0px 10px 0px">添加属性</el-button>

          <el-table :data="staticTableData" border stripe>
            <el-table-column type="expand">
              <template slot-scope="scope">
                <el-tag v-for="tag in scope.row.attributeValue" :key="tag.id" closable :disable-transitions="false" @close="handleTagClose(tag, scope.row)" style="margin: 10px; float: left">
                  {{ tag.value }}
                </el-tag>

                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                >
                </el-input>
                <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
              </template>
            </el-table-column>

            <el-table-column label="编号" prop="id"></el-table-column>
            <el-table-column label="名称" prop="name"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button type="primary" size="mini" icon="el-icon-edit" @click="showEditDialog(scope.row)"></el-button>
                <el-button type="info" size="mini" icon="el-icon-delete" @click="showDeleteDialog(scope.row)"></el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>

    <el-dialog :title="'添加' + getDialogTitle" :visible.sync="addDialogVisible" width="40%">
      <el-form :model="addAttributeForm" ref="addAttributeForm" label-width="100px">
        <el-form-item label="名称" prop="name" :rules="[{ required: true, message: '名称不能为空' }]">
          <el-input type="name" v-model="addAttributeForm.name"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button @click="addSubmitForm()" type="primary">提交</el-button>
          <el-button @click="resetForm('addAttributeForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <!-- 修改 -->

    <el-dialog :title="'修改' + getDialogTitle" :visible.sync="editDialogVisible" width="40%">
      <el-form :model="editAttributeForm" ref="editAttributeForm" label-width="100px">
        <el-form-item label="名称" prop="name" :rules="[{ required: true, message: '名称不能为空' }]">
          <el-input type="name" v-model="editAttributeForm.name"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button @click="editSubmitForm()" type="primary">修改</el-button>
          <el-button @click="resetForm('editAttributeForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import Nav from '../nav/Nav.vue'

export default {
  name: 'Params',
  components: {
    Nav
  },
  data() {
    return {
      navList: [{ name: '商品管理' }, { name: '商品参数' }],

      attribute: {},
      addAttributeForm: {
        name: ''
      },
      addDialogVisible: false,
      editAttributeForm: {
        name: '',
        id: ''
      },
      editDialogVisible: false,
      dynamicTableData: [{}],
      staticTableData: [{}],
      tipsTitle: '注意：请选择第三级类别',
      tipsType: 'warning',
      disabled: true,
      activeName: 'dynamic',
      selectedKeys: [],
      categoryData: [],
      categoryProps: {
        value: 'id',
        label: 'name',
        children: 'children'
      }
    }
  },
  created() {
    this.getCategoryData()
  },
  methods: {
    showInput(row) {
      row.inputVisible = true
      // 聚焦
      // nextTick 页面上元素别重新渲染之后，才会指定回调的代码
      this.$nextTick((_) => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },
    async handleInputConfirm(row) {
      const inputValue = row.inputValue
      if (inputValue) {
        console.log(row.id)
        const obj = {
          value: inputValue,
          attributeId: row.id
        }
        const data = await this.$http.post('/categories/attribute/value', obj)

        this.$message({ type: 'success', message: '增加成功!' })
        if (!row.attributeValue) {
          row.attributeValue = []
        }
        row.attributeValue.push(data)
        console.log(row.attributeValue)
      }
      row.inputVisible = false
      row.inputValue = ''
    },
    async handleTagClose(tag, row) {
      const data = await this.$http.delete('/categories/attribute/value/' + tag.id)

      this.$message({ type: 'success', message: '删除成功!' })
      row.attributeValue = row.attributeValue.filter((obj) => obj.id !== tag.id)
      console.log(row.attributeValue)
    },
    async showDeleteDialog(row) {
      await this.$confirm('此操作将永久删除该参数, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          const data = await this.$http.delete('/categories/attribute/' + row.id)

          this.$message({ type: 'success', message: '删除成功!' })
          this.handleTabClick()
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    showEditDialog(row) {
      this.editDialogVisible = true
      this.editAttributeForm.name = row.name
      this.editAttributeForm.id = row.id
    },
    async editSubmitForm() {
      this.$refs.editAttributeForm.validate(async (valid) => {
        if (valid) {
          const data = await this.$http.put('/categories/attribute/' + this.editAttributeForm.id + '/name/' + this.editAttributeForm.name)

          this.$message({ type: 'success', message: '修改成功!' })
          this.editDialogVisible = false
          this.resetForm('editAttributeForm')
          this.handleTabClick()
        }
      })
    },

    async addSubmitForm() {
      this.$refs.addAttributeForm.validate(async (valid) => {
        if (valid) {
          const data = await this.$http.post('/categories/attribute', {
            categoryId: this.selectedKeys[this.selectedKeys.length - 1],
            name: this.addAttributeForm.name,
            type: this.activeName
          })

          this.$message({ type: 'success', message: '增加成功!' })
          this.addDialogVisible = false
          this.resetForm('addAttributeForm')
          this.handleTabClick()
        }
      })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },
    async handleTabClick() {
      if (this.selectedKeys.length == 0) {
        return this.$message.error('请先选择类别')
      }
      this.getAttributeData(this.selectedKeys)
    },
    async handleChange(value) {
      this.getAttributeData(value)
    },
    async getAttributeData(value) {
      this.selectedKeys = value
      this.disabled = false
      this.tipsTitle = '您当前选择的是：' + this.$refs.cascaderRef.getCheckedNodes()[0].pathLabels.join('-')
      this.tipsType = 'success'
      const id = this.selectedKeys[this.selectedKeys.length - 1]
      const data = await this.$http.get('/categories/attribute/' + id + '/type/' + this.activeName)

      // 在获取每行数据时，对每行数据进行循环并添加属性inputVisible和inputValue
      data.forEach((item) => {
        // 控制文本框的显示与隐藏
        item.inputVisible = false
        // 文本框中输入的值
        item.inputValue = ''
      })
      if (this.activeName === 'dynamic') {
        // 动态
        this.dynamicTableData = data
      } else {
        this.staticTableData = data
      }
    },
    async getCategoryData() {
      const data = await this.$http.get('/categories', {
        pageNum: 1,
        pageSize: 9999999
      })

      this.categoryData = data.list
    }
  },
  computed: {
    getDialogTitle() {
      if (this.activeName === 'dynamic') {
        return '动态参数'
      } else {
        return '静态属性'
      }
    }
  }
}
</script>

<style lang="less" scoped>
.el-button {
  float: left;
}

.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
  margin: 10px;
}
.input-new-tag {
  width: 90px;
  margin-left: 10px;
  margin: 10px;

  //vertical-align: bottom;
}
</style>
