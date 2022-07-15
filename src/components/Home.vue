<template>
  <el-container class="home-container">
    <el-header style="height: 80px">
      <div>
        <img src="../assets/logo-text.png" />
      </div>
      <el-button @click="logout" type="info">退出登录</el-button>
    </el-header>
    <el-container>
      <el-aside :width="isCollapse ? '64px' : '200px'">
        <div class="toggle-button" @click="toggleCollapse">|||</div>
        <el-menu background-color="#333744" text-color="#fff" active-text-color="#ffd04b" unique-opened :collapse="isCollapse" :collapse-transition="false" :router="true" :default-active="avtivePath">
          <el-submenu :index="item.id + ''" v-for="item in menuList" :key="item.id">
            <template slot="title">
              <i :class="iconObj[item.id]"></i>
              <span>{{ item.name }}</span>
            </template>
            <!--二级菜单 -->
            <el-menu-item :index="subItem.path" v-for="subItem in item.children" :key="subItem.id" @click="saveNavState(subItem.path)">
              <template slot="title">
                <i class="el-icon-menu"></i>
                <span>{{ subItem.name }}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main>
        <keep-alive>
          <router-view></router-view>
        </keep-alive>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import { getItem } from '@/utils/storage.js'

export default {
  name: 'Home',
  data() {
    return {
      avtivePath: '',
      isCollapse: false,
      menuList: [],
      iconObj: {
        1: 'iconfont icon-shangpin',
        4: 'iconfont icon-yonghu',
        5: 'iconfont icon-quanxian',
        6: 'iconfont icon-order',
        7: 'iconfont icon-odbc-full'
      }
    }
  },
  created() {
    this.getMenuList()
    this.avtivePath = window.sessionStorage.getItem('avtivePath')
  },
  methods: {
    saveNavState(avtivePath) {
      window.sessionStorage.setItem('avtivePath', avtivePath)
      this.avtivePath = avtivePath
    },
    toggleCollapse() {
      this.isCollapse = !this.isCollapse
    },
    logout() {
      window.sessionStorage.clear()
      this.$router.push('/login')
    },
    async getMenuList() {
      const user = getItem('user')
      const data = await this.$http.get('/rights/modules/' + user.id)
      this.menuList = data
    }
  }
}
</script>
<style lang="less" scoped>
.home-container {
  height: 100%;
}
.el-header {
  background-color: #373d41;
  display: flex;
  justify-content: space-between;
  padding-left: 0;
  align-items: center;
  height: 80px;
}

.el-aside {
  background-color: #333744;
  color: #333;
}

.el-main {
  background-color: #eaedf1;
  color: #333;
  text-align: center;
}
.el-menu {
  border-right: none;
}
.iconfont {
  margin-right: 10px;
}
.toggle-button {
  background-color: #4a5064;
  font-size: 10px;
  line-height: 24px;
  color: #fff;
  text-align: center;
  letter-spacing: 0.2em;
  cursor: pointer;
}
</style>
