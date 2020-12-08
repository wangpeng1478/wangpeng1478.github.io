<template>
  <div class="editor-wrapper">
    <div :id="editorId"></div>
    <Spin size="large" fix v-if="loading"></Spin>
  </div>
</template>

<script>
// https://highlightjs.org/static/demo/
// http://www.wangeditor.com/
import Editor from "wangeditor";
import hljs from 'highlight.js';
import COS from "cos-js-sdk-v5";
import { oneOf, parseTime } from "@/libs/tools";
export default {
  name: "Editor",
  props: {
    value: {
      type: String,
      default: "",
    },
    height: {
      type: Number,
      default:300,
    },
    menus: {
      type: Array,
      default(){
        return ["head","bold","fontSize","italic","underline","strikeThrough","indent","lineHeight","foreColor","backColor","list","justify","quote","emoticon","image","table","code","splitLine","undo","redo"]
      },
    },
    /**
     * 绑定的值的类型, enum: ['html', 'text']
     */
    valueType: {
      type: String,
      default: "html",
      validator: (val) => {
        return oneOf(val, ["html", "text"]);
      },
    },
    /**
     * @description 设置change事件触发时间间隔
     */
    changeInterval: {
      type: Number,
      default: 200,
    },
  },
  computed: {
    editorId() {
      return `editor${this._uid}`;
    },
  },
  data() {
    return {
      time: new Date().toLocaleString(),
      cos:null,
      loading:false,
      codeModalShow:false,
      code:"",
      Bucket: "wxword-1254176432",
      Region: "ap-shanghai",
      SecretId: "AKIDZx60f4A2cz83nLlkcHiusc9SXNzOmXEj",
      SecretKey: "PegU4Zv4zg8NOCl5AznNindGfsrb8RWN",
    };
  },
  methods: {
    initCos() {
      const vm = this;
      this.cos = new COS({
        SecretId: vm.SecretId,
        SecretKey: vm.SecretKey,
        Protocol: "https:",
      });
    },
    setHtml(val) {
      this.editor.txt.html(val);
    },
    getHtml(){
      return this.editor.txt.html();
    }
  },
  mounted() {
    const vm = this;
    this.initCos();
    this.editor = new Editor(`#${this.editorId}`);
    this.editor.config.menus = this.menus;
    this.editor.config.customUploadImg = function (resultFiles, insertImgFn) {
      const file = resultFiles[0];
        if (!file.type || file.type.indexOf("image") === -1) {
          vm.$Message.warning('请上传图片');
          return;
        } else {
          vm.loading = true;
          const now = parseTime(new Date(), "{y}-{m}-{d}");
          vm.cos.putObject(
            {
              Bucket: vm.Bucket,
              Region: vm.Region,
              Key: `editor/${now}/${name}`,
              Body: file,
            },
            (err, data) => {
              vm.loading = false;
              if (!err && data.Location) {
                insertImgFn("https://" + data.Location);
              } else {
                 this.$Notice.error({ title: "上传失败", desc: err.error });
              }
            }
          );
        }
    };
    this.editor.config.onchange = (html) => {
      let text = this.editor.txt.text();
      this.$emit("input", this.valueType === "html" ? html : text);
      this.$emit("on-change", html, text);
    };
    this.editor.config.onchangeTimeout = this.changeInterval;
    this.editor.config.uploadImgMaxLength = 1;
    this.editor.config.zIndex = 1;
    this.editor.highlight = hljs;
    this.editor.config.height = this.height;
    this.editor.config.colors = [
        '#f8f9fa',
        '#343a40',
        '#007bff',
        '#2db7f5',
        '#19be6b',
        '#f90',
        '#ed4014',
    ];
    // this.editor.config.showFullScreen = false;
    this.editor.create();
    let html = this.value;
    if (html) this.editor.txt.html(html);
  },
};
</script>

<style lang="less">
.editor-wrapper {
  position: relative;
}
</style>