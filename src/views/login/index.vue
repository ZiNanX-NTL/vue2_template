<template>
  <div class="login-container">
    <el-form
      ref="loginForm"
      :model="loginForm"
      :rules="loginRules"
      class="login-form"
      auto-complete="on"
      label-position="left"
    >
      <div class="title-container">
        <h1 class="title">
          <!-- <img src="@/assets/common/login-logo.png" alt=""> -->
          "掌上植保" 后台管理
        </h1>
      </div>

      <el-form-item prop="userName">
        <span class="svg-container">
          <svg-icon icon-class="user" />
        </span>
        <el-input
          ref="userName"
          v-model="loginForm.userName"
          placeholder="用户名"
          name="userName"
          type="text"
          tabindex="1"
          auto-complete="on"
        />
      </el-form-item>

      <el-form-item prop="passWord">
        <span class="svg-container">
          <svg-icon icon-class="password" />
        </span>
        <el-input
          :key="passwordType"
          ref="password"
          v-model="loginForm.passWord"
          :type="passwordType"
          placeholder="密码"
          name="passWord"
          tabindex="2"
          auto-complete="on"
          @keyup.enter.native="handleLogin"
        />
        <span class="show-pwd" @click="showPwd">
          <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
        </span>
      </el-form-item>

      <el-button
        style="width:100%;margin-bottom:30px;"
        :loading="loading"
        type="success"
        class="loginBtn"
        @click.native.prevent="handleLogin"
      >
        登录
      </el-button>

      <!-- <div class="tips">
        <span style="margin-right:20px;">账号: 230200</span>
        <span> 密码: 230200zbz123456</span>
      </div> -->
    </el-form>

    <!-- <div class="footer">
      <p style="height:50%;line-height:32px">建设单位: 黑龙江省植检植保站</p>
      <p>技术支持单位: 哈尔滨简农信息技术有限公司</p>
    </div> -->
  </div>
</template>

<script>
// import { validMobile } from '@/utils/validate'
import { mapActions } from 'vuex' // 引入vuex的辅助函数

export default {
  name: 'Login',
  data() {
    // const validateMobile = (rule, value, callback) => {
    //   // if (!validateMobile(value)) {
    //   //   callback(new Error('Please enter the correct user name'))
    //   // } else {
    //   //   callback()
    //   // }
    //   validMobile(value) ? callback() : callback(new Error('手机号格式不正确'))
    // }
    // const validatePassword = (rule, value, callback) => {
    //   if (value.length < 6) {
    //     callback(new Error('The password can not be less than 6 digits'))
    //   } else {
    //     callback()
    //   }
    // }
    return {
      loginForm: {
        userName: 'admin',
        passWord: '230000zbz123456'
      },
      loginRules: {
        userName: [{ required: true, trigger: 'blur', message: '请输入正确账号' }],
        passWord: [{ required: true, trigger: 'blur', message: '请输入正确密码' }]
      },
      loading: false,
      passwordType: 'password',
      redirect: undefined
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        this.redirect = route.query && route.query.redirect
      },
      immediate: true
    }
  },
  methods: {
    ...mapActions(['user/login']),
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
      this.$nextTick(() => {
        this.$refs.password.focus()
      })
    },
    handleLogin() {
      this.$refs.loginForm.validate(async valid => {
        if (valid) {
          try {
            this.loading = true
            // 只有校验通过了 我们才去调用action
            await this['user/login'](this.loginForm)
            // 应该登录成功之后
            // async标记的函数实际上一个promise对象
            // await下面的代码 都是成功执行的代码
            this.$router.push('/')
          } catch (error) {
            console.log(error)
          } finally {
            //  不论执行try 还是catch  都去关闭转圈
            this.loading = false
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }
  }
}
</script>

<style lang="scss">
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

$input_bg: #fff;
$input_text_color: #181a1b;
$cursor: #181a1b;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container .el-input input {
    color: $cursor;
  }
}

/* reset element-ui css */
.login-container {
  background-image: url('~@/assets/common/bac.jpg'); // 设置背景图片
  background-position: center; // 将图片位置设置为充满整个屏幕
  background-size: cover;
  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;

    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: $input_text_color;
      height: 47px;
      caret-color: $cursor;

      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px $input_bg inset !important;
        -webkit-text-fill-color: $input_text_color !important;
      }
    }
  }

  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: $input_bg; // 输入登录表单的背景色
    border-radius: 5px;
    color: $input_text_color;
  }
  .el-form-item__error {
    color: #fff;
  }
}
</style>

<style lang="scss" scoped>
$bg: #2d3a4b;
$dark_gray: #889aa4;
$light_gray: #eee;

.login-container {
  min-height: 100%;
  width: 100%;
  background-color: $bg;
  overflow: hidden;

  .login-form {
    position: relative;
    width: 520px;
    max-width: 100%;
    padding: 160px 35px 0;
    margin: 0 auto;
    overflow: hidden;
  }

  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;

    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }

  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }

  .title-container {
    position: relative;

    .title {
      font-size: 50px;
      color: $light_gray;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }

  .loginBtn {
    background: #2ebc4f;
    height: 64px;
    line-height: 32px;
    font-size: 24px;
    &:hover {
      background: #278e3f;
    }
  }

  .footer {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 50px;
    background-color: #404950;
  }
  .footer p {
    margin: 0;
    text-align: center;
  }
}
</style>
