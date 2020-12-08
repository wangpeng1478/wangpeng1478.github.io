<template>
  <div class="word-list">
    <Card class="card-view" shadow>
      <div class="search">
        <Row type="flex" justify="center" align="middle">
          <Col style="flex: 1">
            <Form ref="formSearch" :label-width="80" inline>
              <FormItem label="单词名称">
                <Input v-model.trim="search.name" @on-keyup.enter="Search"></Input>
              </FormItem>
              <FormItem label="分类">
                <Select v-model="search.wordTypeId" filterable :remote-method="getTypeList" :loading="wordTypeLoading" @on-change="Search">
                    <Option v-for="(option, index) in typeList" :value="option._id" :key="index">{{decoding(option.name)}}</Option>
                </Select>
              </FormItem>
              <FormItem label="是否显示">
                  <Select v-model="search.show" @on-change="Search">
                    <Option value="">全部</Option>
                    <Option value="true">显示</Option>
                    <Option value="false">不显示</Option>
                </Select>
              </FormItem>
              <!-- <FormItem>
                <Button @click="Search" :loading="searchLoading" type="primary">Search</Button>
              </FormItem> -->
            </Form>
          </Col>
          <Col>
            <Button
              style="margin-left: 1em"
              @click="toWordForm(-1)"
              type="info"
              >新增</Button
            >
          </Col>
        </Row>
      </div>
      <div class="table">
        <Table border :columns="columns" :data="data" :loading="tableLoading" @on-sort-change="sortChange">
          <template slot-scope="{ row }" slot="name">
            <strong :title="decoding(row.translation)" v-html="highlight(decoding(row.name),search.name)"></strong>
          </template>
          <template slot-scope="{ row,index }" slot="explanation">
             <Button :disabled="row.explanation.length===0" @click="openExplanationModal(index)" size="small">查看</Button>
          </template>
          <template slot-scope="{ row }" slot="show">
            <Tag v-if="row.show" color="success">显示</Tag>
            <Tag v-else color="default">不显示</Tag>
          </template>
          <template slot-scope="{ index }" slot="action">
            <Button
              type="primary"
              size="small"
              @click="toWordForm(index)"
              style="margin-right: 5px"
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
        <Modal v-model="explanationModal" :title="decoding(explanationTitle)" width="400" :styles="{ top: '20px' }" footer-hide>
          <div class="explanationCard" v-for="(item,index) in explanationContent" :key="index">
              <Divider orientation="left">{{index+1}}. {{decoding(item.title)}} <span v-if="!item.show" style="color:red;font-size: 10px;">隐藏</span></Divider>
              <div class="richText" v-html="decoding(item.desc)"></div>
          </div>
        </Modal>
      </div>
    </Card>
  </div>
</template>

<script>
import { Systcb } from "@/api/data";
import { unescapes,highlightHtml } from "@/libs/tools";
export default {
  name: "word_list",
  data() {
    return {
      search:{
        page:1,
        name:"",
        wordTypeId:"",
        nameSort:"",
        sort:"",
        show:"",
      },
      columns: [
        {
          title: "单词名称",
          sortable: true,
          key: "name",
          slot: "name",
        },
        
        {
          title: "说明",
          slot: "explanation",
          width: 100,
          align: "center",
        },
        
        {
          title: "排序",
          width: 100,
          align: "center",
          sortable: true,
          key: "sort",
        },
        {
          title: "是否显示",
          align: "center",
          width: 100,
          slot: "show",
        },
        {
          title: "操作",
          slot: "action",
          width: 150,
          align: "center",
        },
      ],
      data: [],
      typeList:[],
      wordTypeLoading: false,
      tableLoading: false,
      searchLoading: false,
      explanationModal:false,
      explanationTitle:"",
      explanationContent:[],
      pager: {
        Limit: 0,
        Offset: 0,
        Total: 0,
      }
    };
  },
  mounted() {
    this.getTypeList();
    this.getList();
  },
  methods: {
    decoding(str){
      return unescapes(str)
    },
    highlight(content,key=""){
      return highlightHtml(content,key)
    },
    openExplanationModal(index){
      this.explanationContent =  this.data[index].explanation;
      this.explanationTitle =  this.data[index].name;
      this.explanationModal = true;
    },
    getTypeList(name=""){
      this.wordTypeLoading = true;
      Systcb({
        type: "wordTypeList",
        data:{name},
      }).then((res) => {
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
                  let info = JSON.parse(element);
                  elementData.push(info);
                } catch (error) {
                  console.log(error);
                }
              });
              this.typeList = elementData;
            }
          } catch (error) {
            console.error(error);
            this.$Message.error("页面发生错误");
          }
        }
      });
    },
    getList() {
      this.tableLoading = true;
      Systcb({
        type: "wordList",
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
                   let info = JSON.parse(element);
                  info.explanation = JSON.parse(info.explanation||"[]");
                  elementData.push(info);
                } catch (error) {
                  console.log(error);
                }
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
    Search(){
      this.searchLoading = true;
      this.getList();
    },
    sortChange(e){
      if(e.key==="sort"){
        this.search.sort = e.order;
        this.Search();
      }
      if(e.key==="name"){
        this.search.nameSort = e.order;
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
            type: "wordDelete",
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
    toWordForm(index){
      let route = {
        name: 'wordForm',
        query: {
          total:this.pager.Total
        },
        meta: {
          title: `新增单词`
        }
      };
      if(index>-1){
         route.meta.title="修改单词"
         route.query.id = this.data[index]._id;
      }
      console.log(route);
      this.$router.push(route)
    }
  },
};
</script>
<style lang="less">
.word-list {
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
