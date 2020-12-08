<template>
  <div class="word-type">
    <Card class="card-view" shadow>
      <div class="search">
        <Row type="flex" justify="center" align="middle">
          <Col style="flex: 1">
            <Form ref="formSearch" :label-width="80" inline>
              <FormItem label="分类名称">
                <Input v-model.trim="search.name" @on-keyup.enter="Search"></Input>
              </FormItem>
              <!-- <FormItem>
                <Button @click="Search" :loading="searchLoading" type="primary">Search</Button>
              </FormItem> -->
            </Form>
          </Col>
          <Col>
            <Button
              @click="openModal(-1)"
              style="margin-left: 1em"
              type="info"
              >新增</Button
            >
          </Col>
        </Row>
      </div>
      <div class="table">
        <Table border :columns="columns" :data="data" :loading="tableLoading" @on-sort-change="sortChange">
          <template slot-scope="{ row }" slot="name">
            <strong :title="decoding(row.desc)" v-html="highlight(decoding(row.name),search.name)"></strong>
          </template>
          <template slot-scope="{ row }" slot="icon">
            <div class="image" style="margin:10px auto;width:80px;height:80px;">
                <viewer v-if="row.icon" :images="[]">
                  <img :src="row.icon" :alt="row.name" />
                </viewer>
                <Icon v-else type="ios-images"></Icon>
            </div>
          </template>
          <template slot-scope="{ index }" slot="action">
            <Button
              type="primary"
              size="small"
              style="margin-right: 5px"
             @click="openModal(index)"
              >编辑</Button
            >
            <Button type="error" size="small" @click="remove(index)"
              >删除</Button
            >
          </template>
        </Table>
        <div class="page">
          <Page :total="pager.Total" @on-change="pageChange" show-elevator show-total></Page>
        </div>
        <Modal
          :title="`${form._id?'修改['+decoding(form.name)+']':'新增'}`"
          v-model="operatingModalShow"
          :transfer="false"
          :styles="{ top: '20px' }"
        >
          <Form
            ref="formValidate"
            :model="form"
            :rules="ruleValidate"
            :label-width="80"
          >
            <FormItem label="分类名称" prop="name">
              <Input
                v-model.trim="form.name"
                placeholder="请输入分类名称"
                :maxlength="50"
              ></Input>
            </FormItem>
            <FormItem label="排序">
              <InputNumber v-model="form.sort" :precision="0"></InputNumber>
            </FormItem>
            <FormItem label="图标">
              <upImg ref="upImgIcon" path="type" @on-result="upImgResult"></upImg>
              <div class="image">
                <viewer v-if="form.icon" :images="[]">
                  <img :src="form.icon" />
                </viewer>
                <Icon v-else type="ios-images"></Icon>
              </div>
            </FormItem>
            <FormItem label="说明">
              <Input
                v-model.trim="form.desc"
                type="textarea"
                placeholder="请输入说明"
                :autosize="{ minRows: 2, maxRows: 5 }"
                :maxlength="200"
                show-word-limit
              ></Input>
            </FormItem>
          </Form>
          <div slot="footer">
            <Button @click="operatingModalShow=false" style="margin-right: 5px" type="text">取消</Button>
            <Button @click="handleSubmit('formValidate')" type="primary" :loading="formLoading">
              {{form._id?'修改':'新增'}}
            </Button>
          </div>
        </Modal>
      </div>
    </Card>
  </div>
</template>

<script>
import upImg from "@/components/upload";
import { Systcb } from "@/api/data";
import { unescapes,highlightHtml } from "@/libs/tools";
export default {
  name: "word_type",
  components: {
   upImg
  },
  data() {
    return {
      search: {
        page:1,
        name: "",
        sort:""
      },
      columns: [
        {
          title: "分类名称",
          slot: "name",
        },
        {
          title: "图标",
          align: "center",
          width: 180,
          slot: "icon",
        },
        {
          title: "排序",
          width: 100,
          align: "center",
          sortable: true,
          key: "sort",
        },
        {
          title: "操作",
          slot: "action",
          width: 150,
          align: "center",
        },
      ],
      data: [],
      operatingModalShow: false,
      tableLoading: false,
      formLoading: false,
      searchLoading: false,
      form: {
        _id:"",
        name: "",
        icon: "",
        desc: "",
        sort: 1,
      },
      pager: {
        Limit: 0,
        Offset: 0,
        Total: 0,
      },
      ruleValidate: {
        name: [
          {
            required: true,
            message: "分类名称不能为空",
            trigger: "blur",
          },
        ],
      },
    };
  },
  mounted() {
    this.getList();
  },
  methods: {
    decoding(str){
      return unescapes(str)
    },
    highlight(content,key=""){
      return highlightHtml(content,key)
    },
    getList() {
      this.tableLoading = true;
      Systcb({
        type: "wordTypeList",
        data: this.search,
      }).then((res) => {
        this.tableLoading = false;
        this.searchLoading = false;
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
              this.data = elementData;
              this.pager = pager;
            }
          } catch (error) {
            console.error(error);
            this.$Message.error("页面发生错误");
          }
        }
      });
    },
    upImgResult(res){
      if(!res.error){
        this.form.icon=res;
      }
    },
    handleSubmit(name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          this.formLoading = true;
          const form = this.form;
          Systcb({
            type: "wordTypeAdd",
            data: form,
          }).then((res) => {
            this.formLoading = false;
            if (res.status === 200) {
              this.$Message.success(`${form._id?'修改':'新增'}成功`);
              this.getList();
              this.operatingModalShow = false;
            }
          });
        }
      });
    },
    Search(){
      this.searchLoading = true;
      this.getList();
    },
    sortChange(e){
      if(e.key==="sort"){
        this.search.sort = e.order;
        this.Search();
      }
    },
    pageChange(e){
      this.search.page = e;
      this.Search();
    },
    remove(index) {
      const id = this.data[index]._id;
      const name = this.data[index].name;
      this.$Modal.confirm({
        title: "提示",
        content: `确定删除【${this.decoding(name)}】？`,
        onOk: () => {
          this.tableLoading = true;
          Systcb({
            type: "wordTypeDelete",
            data: id,
          }).then((res) => {
            this.tableLoading = false;
            if (res.status === 200) {
              this.$Message.success("删除成功");
              this.getList();
            }
          });
        },
      });
    },
    openModal(index) {
      if (index === -1) {
        this.form = {
          _id:"",
          name: "",
          icon: "",
          desc: "",
          sort: this.pager.Total + 1,
        };
      } else {
        let info = this.data[index];
        info.name=this.decoding(info.name);
        info.desc=this.decoding(info.desc);
        this.form = info;
      }
      this.operatingModalShow = true;
    },
  },
};
</script>
<style lang="less">
.word-type {
   min-height: 100%;
  .search {
    margin-bottom: 16px;
    border-bottom: 3px solid #eee;
    padding-bottom: 10px;
    .ivu-form-item {
      margin: 7px 0;
    }
  }
  .page{
    text-align: right;
    padding: 2em 0;
  }
  .highlights-text{
    color: red;
  }
  .image{
      color: #969799;
      font-size: 2.5em;
      background-color: #f7f8fa;
      display: block;
      width: 100px;
      height: 100px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 15px 0;
      border-radius: 5px;
      overflow: hidden;
      img{
          display: block;
          width: 100%;
          height: 100%;
          object-fit: contain;
          cursor: pointer;
      }
  }
}
</style>
