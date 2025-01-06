<template>
  <el-card :style="currentStyle" class="poetry-excerpt-card">
    <div v-if="poetryData" class="poetry-content">
      <p class="poetry-excerpt">{{ poetryData.excerpt }}</p>
      <p class="poetry-meta">《{{ poetryData.title }}》</p>
      <p class="poetry-meta">
        {{ poetryData.dynasty }} - {{ poetryData.author }}
      </p>
    </div>
    <div v-else class="poetry-excerpt-loading">摘要加载中...</div>
    <el-button
      class="refresh-button"
      icon="el-icon-refresh"
      circle
      @click="refreshContent"
    ></el-button>
  </el-card>
</template>
<script>
import apiService from "@/config/apiService.js";
export default {
  name:"PoetryVue",
  props: {},
  data() {
    return {
      poetryData: null,
      styles: [
        {
          backgroundImage:
            'url("https://gw.alicdn.com/imgextra/i4/O1CN010j0bB41y6nGDUSfFO_!!6000000006530-2-tps-302-228.png")',
          color: "rgb(250 203 199)",
        },
        {
          backgroundImage:
            'url("https://gw.alicdn.com/imgextra/i3/O1CN01tASkC11g245Bn84rt_!!6000000004083-2-tps-333-177.png")',
          color: "#fff7b5",
        },
        {
          backgroundImage:
            'url("https://gw.alicdn.com/imgextra/i3/O1CN01y5JCG81Rszcb3Jeuz_!!6000000002168-2-tps-340-190.png")',
          color: "#FFFFFF",
        },
      ],
    };
  },
  created() {
    //获取诗词数据
    this.fetchPoetryData();
    this.randomizeStyle();
  },
  methods: {
    fetchPoetryData() {
      apiService
        .get("/welcome/queryPoetry")
        .then((res) => {
          // 处理响应数据
          this.poetryData = res.data.data;
        })
        .catch((error) => {
          // 处理错误情况
          console.error(error);
        });
    },
    refreshContent() {
      this.fetchPoetryData();
      this.randomizeStyle();
    },
    randomizeStyle() {
      const randomIndex = Math.floor(Math.random() * this.styles.length);
      this.currentStyle = this.styles[randomIndex];
    },
  },
};
</script>

<style scoped>

.poetry-excerpt-card {
  background-size: cover;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 100%;
  height: auto;
  margin-top: 10px;
  font-size: 14px;
  font-weight: bold;
  position: relative;
  text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.6);
}
.refresh-button {
  position: absolute;
  right: 10px;
  top: 10px;
  z-index: 2;
}

.poetry-content,
.poetry-excerpt,
.poetry-meta {
  color: inherit;
  text-shadow: inherit;
}
>>> .el-button.is-circle{
  border-radius: 50%;
  padding: 5px;
}
.refresh-button {
  position: absolute;
  right: 10px;
  top: 10px;
  z-index: 2;
  font-size: 12px; /* 缩小图标 */
  padding: 5px; /* 减少内边距 */
  border: 1px solid rgba(255, 255, 255, 0.7); /* 边框颜色和透明度 */
  background-color: rgba(255, 255, 255, 0.3); /* 背景颜色和透明度 */
  color: rgb(81, 66, 66); /* 图标颜色 */
}
</style>
