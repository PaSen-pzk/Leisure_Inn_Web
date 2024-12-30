<template>
  <div class="layout">
    <el-row class="header">
      <!-- 头部：搜索栏 -->
      <el-autocomplete
        class="search-input"
        v-model="searchQuery"
        :fetch-suggestions="fetchByQuery"
        :loading="loading"
        placeholder="努力上班，从不摸鱼！"
        popper-class="autocomplete-option-popper"
        @select="handleSelect"
        suffix-icon="el-icon-search"
      >
        <template slot-scope="{ item }">
          <div style="display: flex; justify-content: space-between">
            <span
              style="
                max-width: 280px;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
              "
            >
              {{ item.label }}
            </span>
            <span
              style="
                max-width: 80px;
                color: #8492a6;
                font-size: 13px;
                white-space: nowrap;
              "
            >
              <img
                :src="getResourceInfo(item.resource).icon"
                style="width: 16px; height: 16px; vertical-align: middle"
              />
              {{ getResourceInfo(item.resource).title }}
            </span>
          </div>
        </template>
      </el-autocomplete>
    </el-row>

    <el-row class="content">
      <!-- 主体内容：热榜列表 -->
      <hot-search-board
        v-for="board in filteredHotBoards"
        :key="board.type"
        :title="board.title"
        :icon="board.icon"
        :hot-search-data="boardsData[board.type]"
        :fetch-url="board.type"
        v-show="activeBoard === board.type"
      />
    </el-row>
    <!-- 底部导航 -->
    <el-row type="flex" class="footer-row footer" justify="space-around">
      <el-col :span="4" v-for="board in filteredHotBoards" :key="board.icon">
        <div
          class="footer-item"
          :class="{ active: activeIcon === board.icon }"
          @click="handleFooterClick(board.type, board.icon)"
        >
          <img :src="board.icon" class="footer-icon" />
          <div class="icon-title">{{ board.title }}</div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import HotSearchBoard from "@/components/HotSearchBoard.vue";
import apiService from "@/config/apiService.js";

export default {
  name: "IndexVue",
  components: {
    HotSearchBoard,
  },
  data() {
    return {
      activeBoard: "",
      activeIcon: "",
      boardsData: {},
      searchQuery: "",
      lastSearchQuery: "",
      suggestions: [],
      loading: false,
      currentPage: 1,
      pageSize: 20,
      selectedValue: [],
      hotBoards: [
        {
          title: "百度",
          icon: require("@/assets/icons/baidu-icon.svg"),
          type: "baidu",
          show: true,
        },
        {
          title: "头条",
          icon: require("@/assets/icons/toutiao-icon.svg"),
          type: "toutiao",
          show: true,
        },
        {
          title: "搜狗",
          icon: require("@/assets/icons/sougou-icon.svg"),
          type: "sougou",
          show: true,
        },
        {
          title: "腾讯",
          icon: require("@/assets/icons/tencent-icon.svg"),
          type: "tencent",
          show: false,
        },
        {
          title: "微博",
          icon: require("@/assets/icons/weibo-icon.svg"),
          type: "weibo",
          show: true,
        },
        {
          title: "B站",
          icon: require("@/assets/icons/bilibili-icon.svg"),
          type: "bilibili",
          show: true,
        },
        {
          title: "抖音",
          icon: require("@/assets/icons/douyin-icon.svg"),
          type: "douyin",
          show: true,
        },
        {
          title: "知乎",
          icon: require("@/assets/icons/zhihu-icon.svg"),
          type: "zhihu",
          show: true,
        },
        {
          title: "贴吧",
          icon: require("@/assets/icons/tieba-icon.svg"),
          type: "tieba",
          show: true,
        },
        {
          title: "虎扑",
          icon: require("@/assets/icons/hupu-icon.svg"),
          type: "hupu",
          show: true,
        },
      ],
    };
  },
  created() {
    if (this.hotBoards.length > 0) {
      this.activeBoard = this.hotBoards[0].type;
      this.activeIcon = this.hotBoards[0].icon;
      this.handleFooterClick(this.activeBoard, this.activeIcon);
    }
  },
  computed: {
    filteredHotBoards() {
      return this.hotBoards.filter((board) => board.show);
    },
  },
  methods: {
    getResourceInfo(resourceType) {
      const resource = this.hotBoards.find(
        (board) => board.type === resourceType.toLowerCase()
      );
      return resource || { icon: "", title: "" };
    },
    handleSelect(item) {
      if (item && item.url) {
        window.open(item.url, "_blank");
      }
      // 防止替换搜索框中的内容
      this.$nextTick(() => {
        this.searchQuery = this.lastSearchQuery;
      });
    },
    fetchByQuery(query, callback) {
      if (query !== "") {
        this.loading = true;
        // 构建带有搜索关键词的 URL
        const fetchUrl = `/hotSearch/pageQueryHotSearchByTitle?title=${encodeURIComponent(
          query
        )}&pageNum=${this.currentPage}&pageSize=${this.pageSize}`;
        // 利用 axios 或者你的 HTTP 库来发送请求
        apiService
          .get(fetchUrl)
          .then((response) => {
            if (response.data && response.data.success) {
              this.suggestions = response.data.data.value.map((item) => {
                return {
                  value: item.hotSearchId,
                  label: item.hotSearchTitle,
                  url: item.hotSearchUrl,
                  resource: item.hotSearchResource,
                };
              });
              this.lastSearchQuery = query;
              callback(this.suggestions);
              // 如果需要处理分页，可以在这里调整 currentPage 和 pageSize
            } else {
              // 处理错误情况
              this.suggestions = [];
              console.error("Failed to fetch search results:", response);
            }
          })
          .catch((error) => {
            // 处理请求错误
            this.suggestions = [];
            console.error("Error during fetch search results:", error);
          })
          .finally(() => {
            this.loading = false;
          });
      } else {
        // 如果没有查询内容，则清空选项
        this.suggestions = [];
      }
    },
    handleFooterClick(type, iconUrl) {
      this.activeBoard = type;
      this.activeIcon = iconUrl;
      apiService
        .get("/hotSearch/queryByType?type=" + type)
        .then((res) => {
          this.$set(this.boardsData, type, res.data.data.hotSearchDTOList);
        })
        .catch((error) => {
          // 处理错误情况
          console.error(error);
        });
    },
  },
};
</script>

<style scoped>
.layout {
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: hidden;
}
.header {
  position: fixed; /* 让头部固定在顶部 */
  top: 0; /* 从视窗的顶部开始 */
  left: 0; /* 从视窗的左边开始 */
  right: 0; /* 从视窗的右边开始 */
  z-index: 1000; /* 确保头部在其他内容之上 */
  background-color: #fff; /* 设置背景颜色，以免与下方内容重叠时不透明 */
  display: flex;
  justify-content: center; /* 居中搜索框 */
  align-items: center;
  padding: 10px 15px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  box-sizing: border-box; /* 防止 padding 影响宽度计算 */
}

.search-wrapper {
  width: 100%;
  margin: 0 auto;
}

.search-input {
  border-radius: 22px;
  width: 100%;
}

.content {
  flex: 1;
  overflow-y: auto;
  margin-top: 60px;
  margin-bottom: 45px;
  text-align: left;
}
.el-card {
  padding: 0%;
  border: none;
}
>>> .el-card__body {
  padding: 0px 10px 10px 10px;
}
.footer {
  background-color: #fbfbfb;
  box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.1);
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 65px;
  padding: 10px;
}

.footer-row {
  align-items: center;
}

.footer-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  height: 100%;
  transition: transform 0.3s ease;
}

.footer-item:hover,
.footer-item.active {
  transform: translateY(-5px);
}

.footer-icon {
  width: 24px;
  height: 24px;
  transition: all 0.3s ease;
}

.icon-title {
  margin-top: 5px;
  font-size: 10px;
  color: #666;
}

.active.footer-icon,
.active.icon-title {
  color: #409eff;
  font-weight: bold;
}
</style>