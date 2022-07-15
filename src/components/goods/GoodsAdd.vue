<template>
  <div>
    <!--导航-->
    <Nav :navList="navList"></Nav>

    <el-card>
      <el-row>
        <el-col :span="24">
          <el-alert title="增加商品信息" type="info" center show-icon> </el-alert>
        </el-col>
        <el-col :span="24" style="text-align: left; margin-top: 10px">
          <el-steps :space="200" :active="activeIndex - 0" finish-status="success" align-center>
            <el-step title="基本信息"></el-step>
            <el-step title="参数属性"></el-step>
            <el-step title="商品图片"></el-step>
            <el-step title="商品内容"></el-step>
            <el-step title="完成"></el-step>
          </el-steps>
        </el-col>
        <el-col :span="24">
          <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="80px">
            <el-tabs tab-position="left" style="height: 500px" v-model="activeIndex" @tab-click="handleClick">
              <el-tab-pane label="基本信息" name="0">
                <el-form-item label="标题" prop="name">
                  <el-input v-model="addForm.name" maxlength="30" show-word-limit style="width: 600px; float: left"></el-input>
                </el-form-item>
                <el-form-item label="价格" prop="price">
                  <el-input-number v-model="addForm.price" :precision="2" :step="0.1" :min="0" :max="999999999.99" style="width: 600px; float: left"></el-input-number>
                </el-form-item>
                <el-form-item label="数量" prop="amount">
                  <el-input-number v-model="addForm.amount" :precision="0" :step="0" :min="0" :max="999999999" style="width: 600px; float: left"></el-input-number>
                </el-form-item>
              </el-tab-pane>
              <el-tab-pane label="参数属性" name="1">
                <el-form-item label="分类" prop="categoryId">
                  <el-cascader
                    size="medium"
                    :clearable="true"
                    v-model="addForm.categoryId"
                    :props="categoryProps"
                    :options="categoryData"
                    filterable
                    style="width: 400px; float: left"
                    @change="handleChange"
                  >
                  </el-cascader>
                </el-form-item>

                <el-form-item :label="value.name" :key="value.name" v-for="value in addForm.attributeValues">
                  <el-checkbox-group @change="handleCheckedAttributeChange" v-model="addForm.attributeIds">
                    <el-checkbox border style="float: left" v-for="v in value.attributeValue" :label="v.id" :key="v.id">{{ v.value }}</el-checkbox>
                  </el-checkbox-group>
                </el-form-item>
              </el-tab-pane>
              <el-tab-pane label="商品图片" name="2" style="float: left; text-align: left">
                <el-form-item label="上传" prop="images">
                  <el-upload
                    ref="upload"
                    :multiple="false"
                    style="float: left"
                    :limit="3"
                    :file-list="fileList"
                    accept=".jpg,.png,.gif"
                    :action="uploadUrl"
                    list-type="picture"
                    :on-preview="handleUploadPreview"
                    :on-success="handleUploadSuccess"
                    :on-remove="handleUploadRemove"
                    :on-exceed="handleUploadExceed"
                  >
                    <el-button slot="trigger" size="small" type="primary" style="">选取文件</el-button>
                    <div slot="tip" class="el-upload__tip">最多选择3个图片，只能上传jpg/png文件，且不超过500kb</div>
                  </el-upload>
                </el-form-item>
              </el-tab-pane>
              <el-tab-pane label="商品内容" name="3">
                <el-form-item label="内容" prop="content">
                  <quill-editor ref="myTextEditor" v-model="addForm.content"></quill-editor>
                </el-form-item>
                <!--增加按钮-->

                <el-button type="primary" @click="submitForm()" style="margin-top: 15px">增加商品</el-button>
              </el-tab-pane>
            </el-tabs>
          </el-form>

          <el-dialog title="图片预览" :visible.sync="previewVisible" width="50%">
            <img :src="previewPath" />
          </el-dialog>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script>
import Nav from '../nav/Nav.vue'

import _ from 'lodash'

export default {
  name: 'GoodsAdd',

  components: {
    Nav
  },
  data() {
    return {
      navList: [{ name: '商品管理' }, { name: '商品增加' }],

      previewVisible: false,
      previewPath: '',
      fileList: [], // upload多文件数组
      uploadUrl: process.env.VUE_APP_BASE_API + 'goods/upload',
      categoryProps: {
        checkStrictly: false,
        value: 'id',
        label: 'name',
        children: 'children'
      },
      activeIndex: '0',
      addForm: {
        name: '',
        price: '',
        amount: '',
        categoryId: '',
        attributeValues: [],
        attributeIds: [],
        images: [],
        content: ''
      },
      categoryData: [],
      addFormRules: {
        name: [
          {
            required: true,
            message: '请填写标题',
            trigger: 'blur'
          }
        ],
        price: [
          {
            required: true,
            message: '请填写价格',
            trigger: 'blur'
          },
          { type: 'number', message: '价格必须为数字值' }
        ],
        amount: [
          {
            required: true,
            message: '请填写数量',
            trigger: 'blur'
          },
          { type: 'number', message: '数量必须为数字值' }
        ],
        categoryId: [
          {
            type: 'array',
            required: true,
            message: '请选择类别',
            trigger: 'change'
          }
        ],
        content: [
          {
            required: true,
            message: '请填写内容',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  methods: {
    async submitForm() {
      this.$refs.addFormRef.validate((valid) => {
        if (!valid) {
          return this.$message.error('请填写必要的字段')
        }
      })
      // 增加
      const form = _.cloneDeep(this.addForm)
      form.images = this.addForm.images.join(',')
      form.categoryId = this.addForm.categoryId[this.addForm.categoryId.length - 1]
      const data = await this.$http.post('/goods', form)
      this.$message.success('商品增加成功!')
      this.$router.push('/goods')
    },
    handleUploadPreview(file) {
      this.previewPath = file.url
      this.previewVisible = true
    },
    handleUploadSuccess(res, file) {
      console.log(res)
      if (res.code !== 200) {
        return this.$message.error(res.message)
      }
      this.fileList.push(file)
      this.addForm.images.push(res.data)
      console.log(this.fileList)
    },

    handleUploadRemove(file) {
      const filePath = file.response.data
      const uid = file.uid
      this.fileList.splice(
        this.fileList.findIndex((item) => item.uid === uid),
        1
      )
      this.addForm.images.splice(
        this.addForm.images.findIndex((item) => item === filePath),
        1
      )
      console.log(this.addForm.images)
      // this.fileList.map((item) => {
      //   if (item.uid === uid) {
      //     this.fileList.splice(item, 1)
      //   }
      // })
      // this.fileList.splice(this.fileList.indexOf(),1);
    },

    handleUploadExceed(files, fileList) {
      this.$message.warning(`当前限制选择 3 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`)
    },
    handleClick(tab, event) {
      console.log(tab, event)
    },

    async showAddCategoryDialog() {
      this.addCategoryDialogVisible = true
      const data = await this.$http.get('/category', {
        pageNum: 1,
        pageSize: 9999999
      })
      this.categoryData = data.list
    },
    handleChange(value) {
      if (this.addForm.categoryId.length > 0) {
        this.getAttributeData(this.addForm.categoryId)
      }
    },
    handleCheckedAttributeChange() {
      console.log(this.addForm.attributeIds)
    },
    async getAttributeData(value) {
      const id = value[value.length - 1]
      const data = await this.$http.get('/category/attribute/' + id, {
        type: 'dynamic'
      })
      this.addForm.attributeValues = data
    }
  },

  created() {
    this.showAddCategoryDialog()
  }
}
</script>

<style lang="less" scoped>
.el-checkbox {
  margin: 5px;
}
</style>
