<template>
  <div class="navbar">
    <div class="app-breadcrumb">
      <div class="logo">
        <router-link class="sidebar-logo-link" to="/">
          <img v-if="showNavbarLogo" src="@/assets/common/节气5.png" class="sidebar-logo" />
          <!-- <h1 class="navbar-title">"掌上植保" 后台管理</h1> -->
        </router-link>
      </div>
      <!-- <span class="breadBtn">测试版</span> -->
    </div>

    <hamburger
      v-if="!ishorizontal"
      :is-active="sidebar.opened"
      class="hamburger-container"
      @toggleClick="toggleSideBar"
    />

    <breadcrumb class="breadcrumb-container" />

    <div class="right-menu">
      <el-dropdown class="avatar-container" trigger="click">
        <div class="avatar-wrapper">
          <img v-imageerror="defaultImg" :src="headUrl" class="user-avatar" />
          <span class="name">{{ name }}</span>
          <i class="el-icon-caret-bottom" style="color: rgb(0, 0, 0)" />
        </div>
        <el-dropdown-menu slot="dropdown" class="user-dropdown">
          <router-link to="/home">
            <el-dropdown-item> 首页 </el-dropdown-item>
          </router-link>
          <el-dropdown-item divided @click.native="openEditPwdDialog">
            <span style="display: block">修改密码</span>
          </el-dropdown-item>
          <el-dropdown-item @click.native="logout">
            <span style="display: block">退出登录</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>

    <slot />

    <!-- 修改密码弹框 -->
    <el-dialog
      title="修改密码"
      :visible.sync="editPwdDialogVisable"
      width="30%"
      :close-on-click-modal="false"
      :modal-append-to-body="false"
    >
      <el-form id="editPwdForm" ref="editForm" :model="editPwdForm" status-icon :rules="rules">
        <el-form-item
          label="新密码"
          :label-width="formLabelWidth"
          auto-complete="new-password"
          prop="newPwd"
        >
          <el-input
            v-model="editPwdForm.newPwd"
            type="password"
            placeholder="请输入新密码"
            :clearable="true"
          />
        </el-form-item>
        <el-form-item
          label="确认密码"
          auto-complete="new-password"
          :label-width="formLabelWidth"
          prop="confirmPwd"
        >
          <el-input
            v-model="editPwdForm.confirmPwd"
            type="password"
            placeholder="请再次输入新密码"
            :clearable="true"
          />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editPwdDialogVisable = false">取 消</el-button>
        <el-button type="primary" @click="editPwd">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'
import { updatePassword, loginOut } from '@/api/user.js'

export default {
  components: {
    Breadcrumb,
    Hamburger
  },
  data() {
    const checkNewPwd = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('新密码不能为空！'))
      } else if (
        this.editPwdForm.confirmPwd &&
        this.editPwdForm.newPwd !== this.editPwdForm.confirmPwd
      ) {
        return callback(new Error('两次输入的密码不一致！'))
      } else {
        callback()
      }
    }
    const checkConfirmPwd = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('确认密码不能为空！'))
      } else if (this.editPwdForm.newPwd !== this.editPwdForm.confirmPwd) {
        return callback(new Error('两次输入的密码不一致！'))
      } else {
        callback()
      }
    }
    return {
      defaultImg: require('@/assets/common/img.jpeg'),

      editPwdDialogVisable: false, // 修改密码弹框的显隐状态
      editPwdForm: {
        pwd: '', // 原始密码
        newPwd: '', // 新密码
        confirmPwd: '' // 确认密码
      }, // 修改密码的表单数据
      formLabelWidth: '90px',
      rules: {
        newPwd: [{ validator: checkNewPwd, trigger: 'blur' }],
        confirmPwd: [{ validator: checkConfirmPwd, trigger: 'blur' }]
      }
    }
  },
  computed: {
    ...mapGetters(['sidebar', 'name', 'headUrl', 'userId']),
    ishorizontal() {
      const isHorizontal = this.$store.state.settings.pageLayout === 'horizontalLayout'
      if (isHorizontal) {
        this.$store.dispatch('app/openSideBar')
      }
      return isHorizontal
    },
    showNavbarLogo() {
      const layout = this.$store.state.settings.pageLayout
      return layout === 'layout1' || layout === 'horizontalLayout'
        ? this.$store.state.settings.navbarLogo
        : false
    }
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar')
    },
    async logout() {
      await loginOut()
      await this.$store.dispatch('user/logout') // 这里不论写不写 await 登出方法都是同步的
      this.$router.push(`/login`) // 跳到登录
    },

    // 打开修改密码弹框
    openEditPwdDialog() {
      this.editPwdDialogVisable = true // 显示弹框
      this.editPwdForm = {} // 清空表单数据
    },
    // 修改密码
    editPwd() {
      this.$refs.editForm.validate((boolean) => {
        if (boolean) {
          updatePassword({
            id: this.userId,
            Password: this.editPwdForm.newPwd
          }).then((res) => {
            this.$message({
              type: 'success',
              message: '修改成功，请使用新密码登录！'
            })
            this.logout()
          })
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  background: rgb(255, 255, 255);
  // background-image: -webkit-linear-gradient(left, #55458c, #5f4f94);
  // box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.3);

  .app-breadcrumb {
    float: left;
    font-size: 30px;
    line-height: 50px;
    margin-left: 10px;
    color: black;
    cursor: text;
    .breadBtn {
      background: #cda8e5;
      font-size: 14px;
      padding: 0 10px;
      display: inline-block;
      height: 30px;
      line-height: 40px;
      border-radius: 10px;
      margin-left: 15px;
    }
  }

  // 图标,标题
  .logo {
    height: 50px;
    box-sizing: border-box;
    .sidebar-logo-link {
      display: flex;
      height: 100%;
      .sidebar-logo {
        height: 100%;
        padding: 5px;
        margin-right: 15px;
      }
    }
    .navbar-title {
      display: inline-block;
      margin: 0;
      color: rgb(0, 0, 0);
      font-weight: 600;
      line-height: 50px;
      font-size: 20px;
      font-family: Avenir, Helvetica Neue, Arial, Helvetica, sans-serif;
      vertical-align: middle;
    }
  }

  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background 0.3s;
    -webkit-tap-highlight-color: transparent;

    &:hover {
      background: rgba(0, 0, 0, 0.025);
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .right-menu {
    float: right;
    height: 100%;
    line-height: 50px;

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background 0.3s;

        &:hover {
          background: rgba(0, 0, 0, 0.025);
        }
      }
    }

    .avatar-container {
      margin-right: 30px;

      .avatar-wrapper {
        position: relative;

        .user-avatar {
          cursor: pointer;
          width: 30px;
          height: 30px;
          border-radius: 15px;
          vertical-align: middle;
        }
        .name {
          color: rgb(0, 0, 0);
          vertical-align: middle;
          margin-left: 5px;
        }
        .user-dropdown {
          color: #fff;
        }

        .el-icon-caret-bottom {
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: 20px;
          font-size: 12px;
        }
      }
    }
  }
}
</style>
