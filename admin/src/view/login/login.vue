<style lang="less">
@import "./login.less";
</style>

<template>
  <div class="login" :style="`background-image:url(https://wallpaper.infinitynewtab.com/wallpaper/${num}.jpg)`">
    <div class="login-con">
      <Card icon="log-in" title="欢迎登录" :bordered="false">
        <div class="form-con">
          <login-form @on-success-valid="handleSubmit"></login-form>
        </div>
      </Card>
    </div>
  </div>
</template>

<script>
import LoginForm from "_c/login-form";
import { mapActions } from "vuex";
import { initRouter } from "@/libs/router-util";
export default {
  components: {
    LoginForm,
  },
  data() {
    return {
      num: Math.floor(Math.random() * (1 - 1000) + 1000),
    };
  },
  mounted() {},
  methods: {
    ...mapActions(["handleLogin", "getUserInfo"]),
    handleSubmit({ userName, password }) {
      this.handleLogin({ userName, password }).then((res) => {
        this.$Spin.hide();
        if (res.status === 200 && res.data) {
          this.$Message.success("登录成功");
          this.getUserInfo().then((res) => {
            initRouter();
            this.$router.push({
              name: this.$config.homeName,
            });
          });
        }
      });
    },
  },
};
</script>

<style>
</style>
