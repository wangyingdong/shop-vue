<template>
  <div>
    <!--导航-->
    <Nav :navList="navList"></Nav>

    <!--搜索-->
    <el-card>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input placeholder="请输入内容" clearable v-model="queryParams.query" class="input-with-select" @clear="getUserList">
            <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
          </el-input>
        </el-col>

        <el-col :span="4">
          <el-button type="primary" @click="addDialogVisible = true">增加用户</el-button>
        </el-col>
      </el-row>

      <!--表格列表-->
      <el-table :data="userList" border stripe style="width: 100%">
        <el-table-column prop="id" label="编号" width="50"> </el-table-column>
        <el-table-column prop="username" label="用户名" width="120"> </el-table-column>
        <el-table-column prop="address" label="地址" width="250"> </el-table-column>
        <el-table-column prop="email" label="邮箱"> </el-table-column>
        <el-table-column prop="mobile" label="手机"> </el-table-column>

        <el-table-column label="角色">
          <template slot-scope="scope">
            {{ getUserRole(scope.row) }}
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="100">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.state" @change="userStateChanged(scope.row)"> </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            {{ scope.id }}
            <el-button type="primary" size="mini" icon="el-icon-edit" @click="showEditDialog(scope.row.id)"></el-button>
            <el-button type="danger" size="mini" icon="el-icon-delete" @click="deleteUserInfoDialog(scope.row.id)"></el-button>
            <el-tooltip :enterable="false" effect="dark" content="配置权限" placement="top">
              <el-button type="info" size="mini" icon="el-icon-s-tools" @click="setRoleDiglog(scope.row)"></el-button>
            </el-tooltip>
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

    <!-- 增加用户-->
    <el-dialog title="增加用户" :visible.sync="addDialogVisible" width="50%" @close="addDialogClosed">
      <el-form :model="addUserForm" :rules="addUserFormRules" ref="addUserFormRef" label-width="70px">
        <el-form-item prop="username" label="用户名">
          <el-input v-model="addUserForm.username" minlength="3" maxlength="20"></el-input>
        </el-form-item>
        <el-form-item prop="password" label="密码">
          <el-input v-model="addUserForm.password" minlength="6" maxlength="15"></el-input>
        </el-form-item>
        <el-form-item prop="mobile" label="手机号">
          <el-input v-model.number="addUserForm.mobile" minlength="11" maxlength="11"></el-input>
        </el-form-item>
        <el-form-item prop="email" label="邮箱">
          <el-input v-model="addUserForm.email" minlength="5" maxlength="50"></el-input>
        </el-form-item>
        <el-form-item prop="address" label="所在地">
          <el-input v-model="addUserForm.address" minlength="3" maxlength="50"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUserSubmit">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改用户-->
    <el-dialog title="修改用户" :visible.sync="editDialogVisible" width="50%" @close="editDialogClosed">
      <el-form :model="editUserForm" :rules="editUserFormRules" ref="editUserFormRef" label-width="70px">
        <el-form-item label="用户名">
          <el-input disabled v-model="editUserForm.username" readonly=""></el-input>
        </el-form-item>
        <!--
                     <el-form-item prop="password" label="密码">
                        <el-input v-model="editUserForm.password" minlength="6" maxlength="15"></el-input>
                    </el-form-item>
                    -->
        <el-form-item prop="mobile" label="手机号">
          <el-input v-model.number="editUserForm.mobile" minlength="11" maxlength="11"></el-input>
        </el-form-item>
        <el-form-item prop="email" label="邮箱">
          <el-input v-model="editUserForm.email" minlength="5" maxlength="50"></el-input>
        </el-form-item>
        <el-form-item prop="address" label="所在地">
          <el-input v-model="editUserForm.address" minlength="3" maxlength="50"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUserSubmit" :loading="loading">确 定</el-button>
      </span>
    </el-dialog>

    <!--设置权限-->
    <el-dialog title="设置角色" :visible.sync="roleDialogVisible" width="30%" @close="roleDialogClosed">
      <el-form ref="setRoleFormRef" :model="setRoleForm" label-width="80px">
        <el-form-item label="用户">
          <div style="float: left; margin-left: 10px">{{ userInfo.username }}</div>
        </el-form-item>

        <el-form-item label="角色">
          <div style="float: left; margin-left: 10px">
            <el-checkbox-group v-model="roleRoleIds">
              <el-checkbox v-for="role in roleList" :label="role.id" :key="role.id">{{ role.roleName }}</el-checkbox>
            </el-checkbox-group>
          </div>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="roleDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="setRoleSubmit(userInfo)">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import Nav from '../nav/Nav.vue'

export default {
  name: 'Users',
  components: {
    Nav
  },
  data() {
    var checkMobile = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('手机号码不能为空'))
      }
      setTimeout(() => {
        const reg = /^1[2|3|4|5|6|7|8|9][0-9]\d{8}$/
        if (!reg.test(value)) {
          callback(new Error('请输入正确的手机号'))
        } else {
          callback()
        }
      }, 1000)
    }

    var checkEmail = (rule, value, callback) => {
      if (value == undefined || value == '') {
        return callback()
      }
      setTimeout(() => {
        const reg = /^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/
        if (!reg.test(value)) {
          callback(new Error('请输入正确的邮箱地址'))
        } else {
          callback()
        }
      }, 1000)
    }
    // 参数列表对象
    return {
      navList: [{ name: '用户管理' }, { name: '用户列表' }],

      loading: false,

      roleRoleIds: [],
      addUserForm: {
        username: '',
        password: '',
        mobile: '',
        email: '',
        address: ''
      },
      editUserForm: {
        mobile: '',
        email: '',
        address: ''
      },
      userInfo: {},
      roleList: {},
      setRoleForm: {},
      setRoleFormRules: {},
      addUserFormRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          {
            min: 3,
            max: 20,
            message: '长度在 3 到 20 个字符',
            trigger: 'blur'
          }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          {
            min: 6,
            max: 15,
            message: '长度在 6 到 15 个字符',
            trigger: 'blur'
          }
        ],
        mobile: [
          { required: true, message: '请输入手机号码', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }
        ],
        email: [
          { required: false, trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }
        ],
        address: [
          { required: true, message: '请输入地址', trigger: 'blur' },
          {
            min: 3,
            max: 50,
            message: '长度在 3 到 50 个字符',
            trigger: 'blur'
          }
        ]
      },
      editUserFormRules: {
        mobile: [
          { required: true, message: '请输入手机号码', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }
        ],
        email: [
          { required: false, trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }
        ],
        address: [
          { required: true, message: '请输入地址', trigger: 'blur' },
          {
            min: 3,
            max: 50,
            message: '长度在 3 到 50 个字符',
            trigger: 'blur'
          }
        ]
      },
      addDialogVisible: false,
      editDialogVisible: false,
      roleDialogVisible: false,
      search: '',
      userList: [],
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
    this.getUserList()
  },
  methods: {
    async setRoleSubmit(userInfo) {
      this.$refs.setRoleFormRef.validate(async (valid) => {
        if (valid) {
          const data = await this.$http.put('/users/' + userInfo.id + '/role', {
            roleRoleIds: this.roleRoleIds
          })

          this.$message({ type: 'success', message: '权限设置成功!' })
          this.roleDialogVisible = false
          this.getUserList()
        }
      })
    },
    async deleteUserInfoDialog(id) {
      // const confirmResult = await this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
      //     confirmButtonText: '确定',
      //     cancelButtonText: '取消',
      //     type: 'warning'
      //     }
      // ).catch(err => err);
      // //如果确认删除,返回confirm,取消删除cancel
      //     if(confirmResult !== "confirm"){
      //         return this.$message.info('已取消删除')
      //     }else{
      //     }
      // },

      this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          const data = await this.$http.delete('/users/' + id)

          this.$message({ type: 'success', message: '删除成功!' })
          this.getUserList()
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    async showEditDialog(id) {
      this.editDialogVisible = true
      const data = await this.$http.get('/users/' + id)
      this.editUserForm = data
    },
    addUserSubmit() {
      this.$refs.addUserFormRef.validate(async (valid) => {
        if (valid) {
          const data = await this.$http.post('/users/save', this.addUserForm)
          this.$message.success('用户增加成功')
          this.addDialogVisible = false
          this.getUserList()
        }
      })
    },
    editUserSubmit() {
      this.loading = true
      this.$refs.editUserFormRef.validate(async (valid) => {
        if (valid) {
          const data = await this.$http.post('/users/update', {
            id: this.editUserForm.id,
            address: this.editUserForm.address,
            email: this.editUserForm.email,
            mobile: this.editUserForm.mobile
          })

          this.$message.success('用户修改成功')
          this.editDialogVisible = false
          this.getUserList()
        }
      })
    },
    addDialogClosed() {
      this.$refs.addUserFormRef.resetFields()
    },
    editDialogClosed() {
      this.$refs.editUserFormRef.resetFields()
    },
    roleDialogClosed() {
      this.$refs.setRoleFormRef.resetFields()
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          alert('submit!')
        } else {
          return false
        }
      })
    },
    async userStateChanged(userInfo) {
      const data = await this.$http.put(`/users/${userInfo.id}/state/${userInfo.state}`, userInfo)
      return this.$message.success('用户状态更新成功')
    },
    handleSizeChange(val) {
      this.queryParams.pageSize = val
      this.getUserList()
    },
    handleCurrentChange(val) {
      this.queryParams.pageNum = val
      this.getUserList()
    },
    async getUserList() {
      const data = await this.$http.get('/users', this.queryParams)
      this.userList = data.list
      this.page = { total: data.total, hasNextPage: data.hasNextPage }
    },
    getUserRole(user) {
      if (user.userRoleList) {
        return user.userRoleList.map((role) => role.roleName).join()
      }
    },
    async setRoleDiglog(userInfo) {
      this.userInfo = userInfo
      this.roleDialogVisible = true
      const data = await this.$http.get('/rights/roles/')
      this.roleList = data
      if (userInfo.userRoleList) {
        this.roleRoleIds = userInfo.userRoleList.map((role) => role.roleId)
      }
    }
  }
}
</script>

<style lang="less" scoped></style>
