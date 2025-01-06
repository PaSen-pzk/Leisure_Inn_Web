<template>
  <el-card class="word-cloud-card">
    <wordcloud
      class="word-cloud"
      :data="words"
      nameKey="name"
      valueKey="value"
      :wordPadding="2"
      :fontSize="[10,50]"
      :showTooltip="true"
      :wordClick="wordClickHandler"
    />
  </el-card>
</template>

<script>
import wordcloud from "vue-wordcloud";
import apiService from "@/config/apiService.js";

export default {
  name: "app",
  components: {
    wordcloud,
  },
  methods: {
    wordClickHandler(name, value, vm) {
      console.log("wordClickHandler", name, value, vm);
    },
  },
  data() {
    return {
      words: [],
    };
  },
  created() {
    apiService
      .get("/hotSearch/wordCloud/queryWordCloud?topN=100")
      .then((res) => {
        this.words = res.data.data.map((item) => ({
          value: item.rate,
          name: item.word,
        }));
      })
      .catch((error) => {
        // 处理错误情况
        console.error(error);
      });
  },
};
</script>
<style scoped>
.word-cloud-card {
  padding: 0% !important;
  max-height: 300px;
  margin-top: 10px;
}
.word-cloud {
  max-height: 300px;
}
>>> .el-card__body {
  padding: 0;
}
</style>