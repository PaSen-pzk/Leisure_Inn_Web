<template>
  <div id="app">
    <el-row :gutter="10">
      <el-col :span="6" v-for="(board, index) in hotBoards" :key="index">
        <hot-search-board
          :title="board.title"
          :icon="board.icon"
          :fetch-url="board.fetchUrl"
          :type="board.type"
        />
      </el-col>
    </el-row>
  </div>
</template>

<script>
import HotSearchBoard from "@/components/HotSearchBoard.vue";
export default {
  name: "App",
  components: {
    HotSearchBoard,
  },
  data() {
    return {
      hotBoards: [
        {
          title: "百度",
          icon: require("@/assets/icons/baidu-icon.svg"),
          type: "baidu",
        },
        {
          title: "抖音",
          icon: require("@/assets/icons/douyin-icon.svg"),
          type: "douyin",
        },
      ],
    };
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
  background: #f8f9fa; /* 提供一个柔和的背景色 */
  min-height: 100vh; /* 使用视口高度确保填满整个屏幕 */
  padding: 0; /* 保持整体布局紧凑，无额外内边距 */
}
</style>

