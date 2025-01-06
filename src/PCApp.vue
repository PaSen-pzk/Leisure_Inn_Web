<template>
  <div id="app">
    <el-container>
      <el-header class="Header">
        <div class="header-container">
          <el-form class="search-form" inline @submit.native.prevent="onSearch">
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
          </el-form>
        </div>
      </el-header>
      <el-main>
        <el-row :gutter="10">
          <el-col :sm="24" :md="20" :lg="20" :xl="20">
            <el-row :gutter="10">
              <el-col
                v-for="(board, index) in hotBoards"
                :key="index"
                :xs="24"
                :sm="10"
                :md="8"
                :lg="6"
                :xl="6"
              >
                <hot-search-board
                  :title="board.title"
                  :icon="board.icon"
                  :fetch-url="board.fetchUrl"
                  :type="board.type"
                /> </el-col
            ></el-row>
          </el-col>

          <el-col :xs="0" :sm="4" :md="4" :lg="4" :xl="4">
            <visitor-log />
            <holiday-calendar />
            <word-cloud />
            <poetry />
            <camera-player />
          </el-col>
        </el-row>
      </el-main>
      <el-footer class="layout-footer-center">
        {{ sentence }} @Semu
        <div class="icp-info">
          <a
            href="http://www.beian.gov.cn/portal/registerSystemInfo?recordcode=2024105673"
            target="_blank"
            rel="noopener noreferrer"
          >
            浙ICP备2024105673号
          </a>
        </div>
      </el-footer>
    </el-container>
  </div>
</template>

<script>
import HotSearchBoard from "@/components/pc/HotSearchBoard.vue";
import VisitorLog from "@/components/pc/VisitorLog.vue";
import HolidayCalendar from "@/components/pc/HolidayCalendar.vue";
import Poetry from "@/components/pc/Poetry.vue";
import CameraPlayer from "@/components/pc/CameraPlayer.vue";
import WordCloud from "@/components/pc/WordCloud.vue";
import apiService from "@/config/apiService.js";
export default {
  name: "App",
  components: {
    HotSearchBoard,
    VisitorLog,
    HolidayCalendar,
    Poetry,
    CameraPlayer,
    WordCloud,
  },
  data() {
    return {
      searchQuery: "",
      lastSearchQuery: "",
      suggestions: [],
      loading: false,
      currentPage: 1,
      pageSize: 20,
      selectedValue: [],
      sentence: "",
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
        {
          title: "知乎",
          icon: require("@/assets/icons/zhihu-icon.svg"),
          type: "zhihu",
        },
        {
          title: "B站",
          icon: require("@/assets/icons/bilibili-icon.svg"),
          type: "bilibili",
        },
        {
          title: "搜狗",
          icon: require("@/assets/icons/sougou-icon.svg"),
          type: "sougou",
        },
        {
          title: "虎扑",
          icon: require("@/assets/icons/hupu-icon.svg"),
          type: "hupu",
        },
        {
          title: "头条",
          icon: require("@/assets/icons/toutiao-icon.svg"),
          type: "toutiao",
        },
        {
          title: "微博",
          icon: require("@/assets/icons/weibo-icon.svg"),
          type: "weibo",
        },
        {
          title: "腾讯",
          icon: require("@/assets/icons/tencent-icon.svg"),
          type: "tencent",
        },
        {
          title: "贴吧",
          icon: require("@/assets/icons/tieba-icon.svg"),
          type: "tieba",
        },
        {
          title: "CSDN",
          icon: require("@/assets/icons/csdn-icon.svg"),
          type: "csdn",
        },
        {
          title: "掘金",
          icon: require("@/assets/icons/juejin-icon.svg"),
          type: "juejin",
        },
      ],
    };
  },
  created() {
    //查询心语
    this.fetchSentence();
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
    fetchSentence() {
      apiService
        .get("/welcome/querySentence")
        .then((res) => {
          // 处理响应数据
          this.sentence = res.data.data.sentence;
        })
        .catch((error) => {
          // 处理错误情况
          console.error(error);
        });
    },
    fetchByQuery(query, callback) {
      if (query !== "") {
        this.loading = true;
        // 构建带有搜索关键词的URL
        const fetchUrl = `/hotSearch/pageQueryHotSearchByTitle?title=${encodeURIComponent(
          query
        )}&pageNum=${this.currentPage}&pageSize=${this.pageSize}`;
        // 利用axios或者你的HTTP库来发送请求
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
              this.options = [];
              console.error("Failed to fetch search results:", response);
            }
          })
          .catch((error) => {
            // 处理请求错误
            this.options = [];
            console.error("Error during fetch search results:", error);
          })
          .finally(() => {
            this.loading = false;
          });
      } else {
        // 如果没有查询内容，则清空选项
        this.options = [];
      }
    },
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
  background: #f8f9fa;
  min-height: 100vh;
  padding: 0;
}

.Header {
  background-color: #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 20px;
  height: 60px;
}

.header-container {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  max-width: 400px;
}

.search-form {
  flex: 1;
  width: 100%;
}

.el-autocomplete {
  width: 100%;
}

.el-autocomplete-suggestion__wrap {
  width: 100%;
  min-width: 400px;
}

/* 设置 el-main 的内边距为 10px */
.el-main {
  padding: 10px !important;
}

.layout-footer-center {
  color: #666;
  background: #f8f9fa;
  border-top: 1px solid #ebedf0;
  height: auto;
  line-height: 1.5;
  padding: 20px 0;
  text-align: center;
}

.icp-info {
  color: #999;
  font-size: 12px;
  display: block;
  margin-top: 10px;
}

.icp-info a {
  color: #999;
  text-decoration: none;
}

.icp-info a:hover {
  color: #666;
}
</style>
