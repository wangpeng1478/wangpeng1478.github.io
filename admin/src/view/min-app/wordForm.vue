<template>
  <div class="word-form">
    <Card class="card-view" shadow>
      <!-- <pre>{{ form }}</pre>
      <pre>{{ formModal }}</pre> -->
      <Form ref="form" :label-width="80">
        <FormItem label="单词名称" class="ivu-form-item-required">
          <Input
            v-model="form.name"
            :maxlength="200"
            placeholder="请输入单词名称"
          ></Input>
        </FormItem>
        <FormItem label="单词翻译" class="ivu-form-item-required">
          <Input
            v-model="form.translation"
            type="textarea"
            :autosize="{ minRows: 2, maxRows: 5 }"
            :maxlength="200"
            placeholder="请输入单词翻译"
          ></Input>
        </FormItem>
        <FormItem label="单词分类" class="ivu-form-item-required">
          <Select
            ref="wordType"
            v-model="form.wordTypeId"
            filterable
            :remote-method="getTypeList"
            :loading="wordTypeLoading"
            :default-label="defaultLabel"
          >
            <Option
              v-for="(option, index) in typeList"
              :value="option._id"
              :key="index"
              >{{ decoding(option.name) }}</Option
            >
          </Select>
        </FormItem>
        <FormItem label="排序" class="ivu-form-item-required">
          <InputNumber v-model="form.sort" :precision="0"></InputNumber>
        </FormItem>
        <FormItem label="说明">
          <Card class="explanationCard" v-for="(item,index) in form.explanation" :key="index" :padding="10" style="width:500px">
              <p slot="title">{{decoding(item.title)}}  <span v-if="!item.show" style="color:red;font-size: 10px;">隐藏</span></p>
              <a href="#" @click.prevent="openDescModal(index)" slot="extra" title="编辑">
                <Icon type="md-create" />
              </a>
              <Poptip slot="extra" confirm title="确定删除？" @on-ok="form.explanation.splice(index,1)">
                  <a href="#" @click.prevent title="删除">
                    <Icon type="md-trash" color="red" />
                  </a>
              </Poptip>
              <div class="richText" v-html="decoding(item.desc)"></div>
          </Card>
          <Button @click="openDescModal(-1)" type="primary" size="small">添加</Button>
        </FormItem>
        <FormItem label="是否显示">
          <i-switch v-model="form.show" size="large">
            <span slot="open">On</span>
            <span slot="close">Off</span>
          </i-switch>
        </FormItem>
        <FormItem>
          <Button :loading="submitLoading" @click="Submit" type="primary"
            >提交</Button
          >
        </FormItem>
      </Form>
      <Spin size="large" fix v-if="loading"></Spin>
      <Modal
          title="说明"
          v-model="descModalShow"
          :transfer="false"
          :width="700"
          :styles="{ top: '20px' }"
        >
          <Form ref="formModal" :label-width="80">
            <FormItem label="标题" class="ivu-form-item-required">
               <Input
                v-model="formModal.title"
                :maxlength="200"
                placeholder="请输入标题"
              ></Input>
            </FormItem>
            <FormItem label="说明" class="ivu-form-item-required">
              <editor ref="editor" :height="200" @on-change="handleChange"/>
            </FormItem>
            <FormItem label="是否显示">
               <i-switch v-model="formModal.show" size="large">
                <span slot="open">On</span>
                <span slot="close">Off</span>
              </i-switch>
            </FormItem>
          </Form>
          <div slot="footer">
            <Button @click="descModalShow=false" style="margin-right: 5px" type="text">取消</Button>
            <Button @click="define" type="primary">确定</Button>
          </div>
        </Modal>

    </Card>
  </div>
</template>

<script>
import Editor from '_c/editor';
import { mapMutations } from "vuex";
import { Systcb } from "@/api/data";
import { unescapes } from "@/libs/tools";
export default {
  name: "word_form",
  components: {
    Editor
  },
  data() {
    return {
      id: this.$route.query.id,
      typeList: [],
      wordTypeLoading: false,
      loading: false,
      submitLoading: false,
      descModalShow: false,
      descModalIndex:-1,
      defaultLabel:"",
      formModal:{
        title:"",
        desc:"",
        show:true,
      },
      form: {
        name: "",
        translation:"",
        explanation:[],
        wordTypeId: "",
        sort:1,
        show: true,
      },
    };
  },
  mounted() {
    if (this.id) {
       this.getInfo(this.id);
    } else {
       this.form.sort = (Number(this.$route.query.total)||0)+1;
       this.getTypeList();
    }
  },
  methods: {
    ...mapMutations(["closeTag"]),
    handleCloseTag() {
      console.log('closeTag');
      this.closeTag({
        name: "wordForm",
      });
    },
    decoding(str) {
      return unescapes(str);
    },
    handleChange (html, text) {
      this.formModal.desc = escape(html);
    },
    openDescModal(index){
      this.descModalIndex = index;
      if (index === -1){
        this.$refs.editor.setHtml('');
        this.formModal = {
          title:"",
          desc:"",
          show:true,
        }
      }else{
        let info = this.form.explanation[index];
        info.title =  this.decoding(info.title);
        info.desc =  this.decoding(info.desc);
        this.$refs.editor.setHtml(info.desc);
        this.formModal = info;
      }
      this.descModalShow = true;
    },
    define(){
      const { title,desc} = this.formModal;
      if(!desc||!title){
        this.$Message.warning("信息不完整");
        return;
      }
      this.formModal.title=escape(this.formModal.title);
      if(this.descModalIndex==-1){
        this.form.explanation.push(this.formModal);
      }else{
        this.form.explanation[this.descModalIndex]=this.formModal;
      }
      this.descModalShow = false;
    },
    getInfo(id){
      this.loading = true;
      Systcb({
        type: "wordInfo",
        data: { id },
      }).then((res) => {
        if (res.status === 200) {
          try {
            let result = res.data;
            this.defaultLabel = result.wordTypeName;
            result.name = this.decoding(result.name);
            result.translation = this.decoding(result.translation);
            result.explanation = JSON.parse(result.explanation);
            // this.$refs.editor.setHtml(result.explanation)
            this.getTypeList(result.wordTypeName);
            delete result.wordTypeName;
            this.form = result;
          } catch (error) {
            this.handleCloseTag();
            this.$Message.error("页面发生错误");
            console.error(error);
          }
        }
      });
    },
    getTypeList(name = "",t) {
      this.wordTypeLoading = true;
      Systcb({
        type: "wordTypeList",
        data: { name },
      }).then((res) => {
        this.loading = false;
        this.wordTypeLoading = false;
        if (res.status === 200) {
          try {
            const result = res.data;
            if (result) {
              const elementData = [];
              const list = result.data || [];
              const pager = result.pager;
              list.forEach((element) => {
                try {
                  elementData.push(JSON.parse(element));
                } catch (error) {}
              });
              this.typeList = elementData;
            }
          } catch (error) {
            this.$Message.error("页面发生错误");
            console.error(error);
          }
        }
      });
    },
    Submit() {
      const { name, wordTypeId, sort,translation } = this.form;
      if (!name || !wordTypeId || !sort || !translation) {
        this.$Message.warning("信息不完整");
        return;
      }
      this.submitLoading = true;
      Systcb({
        type: "wordForm",
        data: this.form,
      }).then((res) => {
        this.submitLoading = false;
        if (res.status === 200) {
          try {
            this.$Message.success(`${this.id?'修改':'新增'}成功`);
            if(this.id){
              this.handleCloseTag();
            }else{
              this.form = {
                  name: "",
                  translation:"",
                  explanation:[],
                  sort: this.form.sort+1,
                  show: true,
              }
            }
          } catch (error) {
            this.$Message.error("页面发生错误");
            console.error(error);
          }
        }
      });
    },
  },
  
};


</script>
<style lang="less">
.word-form {
  min-height: 100%;
  .ivu-input-wrapper,
  .editor-wrapper,
  .explanationCard,
  .ivu-select {
    max-width: 500px;
  }
  .explanationCard{
    margin-bottom: 1em;
    .ivu-card-head{
      padding: 8px 63px 8px 8px;
    }
    .ivu-card-extra{
      position: absolute;
      right: 16px;
      top: 2px;
      &>a{
        margin-right: 1em;
      }
    }
  }
}
</style>
