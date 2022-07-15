<template>
  <div>
    <!--导航-->
    <Nav :navList="navList"></Nav>

    <el-card>
      <el-row
        ><el-col :span="1"><el-button type="primary">添加角色</el-button></el-col></el-row
      >
      <el-table border :data="tableData" style="width: 100%">
        <el-table-column prop="id" label="ID" width="180"> </el-table-column>
        <el-table-column prop="roleName" label="名称" width="180"> </el-table-column>
        <el-table-column prop="roleRemark" label="备注"> </el-table-column>
        <el-table-column prop="state" label="状态">
          <template slot-scope="scope">
            <el-tag type="success" v-if="scope.row.state">启用</el-tag>
            <el-tag type="warning" v-else>禁用</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            {{ scope.id }}
            <el-button type="primary" size="mini" icon="el-icon-edit"></el-button>
            <el-button type="danger" size="mini" icon="el-icon-delete"></el-button>
            <el-button type="success" size="mini" icon="el-icon-success" @click="showRoleModule(scope.row.id)"></el-button>
            <el-tooltip :enterable="false" effect="dark" content="配置权限" placement="top">
              <el-button type="info" size="mini" @click="showModule(scope.row.id)" icon="el-icon-s-tools"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-dialog title="设置" :visible.sync="moduleDialogVisible" @close="setModuleDialogClosed" width="40%">
      <el-row>
        <el-tree :default-expand-all="true" :data="moduleData" show-checkbox node-key="id" :default-checked-keys="defaultKeys" :props="treeProps" ref="treeRoleModuleRef"> </el-tree>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-button @click="moduleDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveRoleModule()">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog title="权限" :visible.sync="roleModuledialogVisible" width="50%">
      <el-row :class="['bdbottom', i === 0 ? 'bdtop' : '', 'vcenter']" v-for="(roleModule, i) in roleModuleData" :key="roleModule.id">
        <!--一级权限-->
        <el-col :span="5">
          <el-tag :disable-transitions="false" @close="deleteRoleModule(roleModule.id)" closable> {{ roleModule.name }}</el-tag>
          <i class="el-icon-caret-right"></i>
        </el-col>
        <!--二级权限和三级权限-->
        <el-col :span="19">
          <el-row :class="[j === 0 ? '' : 'bdtop', 'vcenter']" v-for="(rm, j) in roleModule.children" :key="rm.id">
            <!--二级权限-->
            <el-col :span="6">
              <el-tag :disable-transitions="false" @close="deleteRoleModule(rm.id)" closable type="success">{{ rm.name }}</el-tag>
              <i class="el-icon-caret-right"></i>
            </el-col>
            <!--三级权限-->
            <el-col :span="18">
              <el-tag :disable-transitions="false" @close="deleteRoleModule(r.id)" closable type="warning" v-for="(r, z) in rm.children" :key="r.id">{{ r.name }}</el-tag>
            </el-col>
          </el-row>
        </el-col>
      </el-row>

      <span slot="footer" class="dialog-footer">
        <el-button @click="roleModuledialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="roleModuledialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import Nav from '../nav/Nav.vue'

export default {
  name: 'Roles',
  components: {
    Nav
  },
  data() {
    return {
      navList: [{ name: '权限管理' }, { name: '角色列表' }],

      moduleDialogVisible: false,
      roleModuledialogVisible: false,
      roleModuleData: [],
      moduleData: [],
      tableData: [],
      treeProps: {
        label: 'name'
      },
      defaultKeys: [],
      roleId: ''
    }
  },
  created() {
    this.getRoles()
  },
  methods: {
    // 清空上次保存已选中的数组
    setModuleDialogClosed() {
      this.defaultKeys = []
    },
    async saveRoleModule() {
      const keys = [...this.$refs.treeRoleModuleRef.getCheckedKeys(), ...this.$refs.treeRoleModuleRef.getHalfCheckedKeys()]
      const ids = keys.join(',')
      const data = await this.$http.post('/rights/roleModule/' + this.roleId, { moduleIds: ids })
      this.$message({ type: 'success', message: '设置成功!' })
      this.moduleDialogVisible = false
    },
    async getRoles() {
      const data = await this.$http.get('/rights/roles')
      // 循环数组中的对象增加属性
      // let newArr = res.data.map(item=>{
      //   return {...item,hasChildren:true}
      //   })
      // this.tableData = (newArr)
      this.tableData = data
    },
    async showModule(id) {
      this.roleId = id
      const data = await this.$http.get('/rights/modules')

      this.moduleDialogVisible = true
      this.moduleData = data
      const result = await this.$http.get('/rights/roleModule/' + id)

      // 选中
      this.defaultKeys = result.map((item) => {
        return item.moduleId
      })
    },
    async showRoleModule(id) {
      const data = await this.$http.get('/rights/role/' + id)
      if (!data.moduleList) {
        return this.$message.error('没有数据')
      }
      this.roleModuledialogVisible = true
      this.roleModuleData = data.moduleList
      this.roleId = id
    },
    async deleteRoleModule(moduleId) {
      await this.$confirm('此操作将永久删除该权限, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          const data = await this.$http.delete('/rights/role/' + this.roleId + '/module/' + moduleId)

          this.$message({ type: 'success', message: '删除成功!' })
          this.showRoleModule(this.roleId)
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

<style lang="less" scoped>
.el-tag {
  margin: 7px;
}
.bdtop {
  border-top: 1px solid #eee;
}
.bdbottom {
  border-bottom: 1px solid #eee;
}
.vcenter {
  display: flex;
  align-items: center;
}
</style>
