<template>
  <div class="word-cog">
    <Card class="card-view" shadow>
        <h1>cog</h1>
    </Card>
  </div>
</template>

<script>
import upImg from "@/components/upload";
import { Systcb } from "@/api/data";
import { unescapes,highlightHtml } from "@/libs/tools";
export default {
  name: "word_cog",
  components: {
   upImg
  },
  data() {
    return {

    };
  },
  mounted() {
    // this.getList();
  },
  methods: {
    decoding(str){
      return unescapes(str)
    }
  },
};
</script>
<style lang="less">
.word-cog {
   min-height: 100%;
}
</style>
