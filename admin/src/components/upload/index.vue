<template>
  <div class="upload">
    <input
      ref="upload"
      id="upload"
      type="file"
      @change="fileChang"
      accept="image/*"
      style="display: none"
    />
    <label class="upload-view" for="upload" ref="dz">
      <Icon type="ios-cloud-upload" size="52" style="color: #3399ff"></Icon>
      <p>单击或拖动文件以上传</p>
    </label>
  </div>
</template>
<script>
import COS from "cos-js-sdk-v5";
import { parseTime } from "@/libs/tools";
export default {
  name: "upload",
  props: {
    path: {
      path: String,
      default: "all",
    },
  },
  data() {
    return {
      time: new Date().toLocaleString(),
      Bucket: "wxword-1254176432",
      Region: "ap-shanghai",
      SecretId: "AKIDZx60f4A2cz83nLlkcHiusc9SXNzOmXEj",
      SecretKey: "PegU4Zv4zg8NOCl5AznNindGfsrb8RWN",
    };
  },
  mounted() {
    this.initdz();
    this.initCos();
  },
  methods: {
    initdz() {
      const vm = this;
      const dz = this.$refs.dz;
      dz.ondragover = function (ev) {
        ev.preventDefault();
        this.style.borderColor = "red";
      };
      dz.ondragleave = function () {
        this.style.borderColor = "#dcdee2";
      };
      dz.ondrop = function (ev) {
        this.style.borderColor = "#dcdee2";
        ev.preventDefault();
        const files = ev.dataTransfer.files;
        if (files.length > 0) {
          vm.putObject(files[0]);
        }
      };
    },
    initCos() {
      const vm = this;
      this.cos = new COS({
        SecretId: vm.SecretId,
        SecretKey: vm.SecretKey,
        Protocol: "https:",
      });
    },
    fileChang() {
      const file = this.$refs.upload.files[0];
      this.putObject(file);
    },
    putObject(file) {
      if(!file.type || file.type.indexOf('image')===-1){
        this.$Message.warning('请上传图片');
        return;
      }
      this.$Spin.show({
        render: (h) => {
          return h("div", [
            h("Icon", {
              class: "demo-spin-icon-load",
              props: {
                type: "ios-loading",
                size: 18,
              },
            }),
            h("div", "上传中"),
          ]);
        },
      });
      const vm = this;
      const name = file.name
        ? Math.random().toString(16).substring(2) + "-" + file.name
        : Math.random().toString(16).substring(2);
      const now = parseTime(new Date(), "{y}-{m}-{d}");
      this.$refs.upload.value = "";
      vm.cos.putObject(
        {
          Bucket: vm.Bucket,
          Region: vm.Region,
          Key: `${vm.path}/${now}/${name}`,
          Body: file,
        },
        (err, data) => {
          this.$Spin.hide();
          if (!err && data.Location) {
            this.$emit("on-result", `https://${data.Location}`);
          } else {
            this.$emit("on-result", err);
            this.$Notice.error({ title: "上传失败", desc: err.error });
          }
        }
      );
    },
  },
};
</script>
<style lang="less" scoped>
.upload-view {
  padding: 10px;
  display: block;
  background: #fff;
  border: 1px dashed #dcdee2;
  border-radius: 4px;
  text-align: center;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: border-color 0.2s ease;
  &:hover {
    border: 1px dashed #2d8cf0;
  }
}
</style>