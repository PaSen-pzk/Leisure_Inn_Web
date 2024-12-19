<template>
  <el-card class="custom-card" v-loading="loading">
    <template #header>
      <div class="card-title">
        <img :src="icon" class="card-title-icon" />
        {{ title }}热榜
      </div>
    </template>
    <div class="cell-group-scrollable">
      <div
        v-for="item in hotSearchData"
        :key="item.hotSearchOrder"
        :class="getRankingClass(item.hotSearchOrder)"
        class="cell-wrapper"
      >
        <span class="cell-order">{{ item.hotSearchOrder }}</span>
        <span
          class="cell-title hover-effect"
          @click="openLink(item.hotSearchUrl)"
        >
          {{ item.hotSearchTitle }}
        </span>
        <span class="cell-heat">{{ formatHeat(item.hotSearchHeat) }}</span>
      </div>
    </div>
  </el-card>
</template>

<script>
import apiService from "@/config/apiService.js";
export default {
  props: {
    title: String,
    icon: String,
    type: String,
  },
  data() {
    return {
      hotSearchData: [],
      loading:false
    };
  },
  created() {
    this.fetchData(this.type);
  },
  methods: {
    fetchData(type) {
      this.loading = true
      apiService
        .get("/hotSearch/queryByType?type=" + type)
        .then((res) => {
          // 处理响应数据
          this.hotSearchData = res.data.data;
        })
        .catch((error) => {
          // 处理错误情况
          console.error(error);
        }).finally(() => {
          // 加载结束
          this.loading = false; 
        });
    },
    getRankingClass(order) {
      if (order === 1) return "top-ranking-1";
      if (order === 2) return "top-ranking-2";
      if (order === 3) return "top-ranking-3";
      return "";
    },
    formatHeat(heat) {
      // 如果 heat 已经是字符串，并且以 "万" 结尾，那么直接返回
      if (typeof heat === "string" && heat.endsWith("万")) {
        return heat;
      }
      let number = parseFloat(heat); // 确保转换为数值类型进行比较
      if (isNaN(number)) {
        return heat; // 如果无法转换为数值，则原样返回
      }

      // 如果数值小于1000，直接返回该数值
      if (number < 1000) {
        return number.toString();
      }

      // 如果数值在1000到9999之间，转换为k为单位
      if (number >= 1000 && number < 10000) {
        return (number / 1000).toFixed(1) + "k";
      }

      // 如果数值大于等于10000，转换为万为单位
      if (number >= 10000) {
        return (number / 10000).toFixed(1) + "万";
      }
    },
    openLink(url) {
      if (url) {
        // 使用window.open在新标签页中打开链接
        window.open(url, "_blank");
      }
    },
  },
};
</script>

<style scoped>
.custom-card {
  background-color: #ffffff;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
}
.custom-card:hover {
  box-shadow: 0 6px 8px rgba(0, 0, 0, 0.25);
}

>>> .el-card__header {
  padding: 10px 18px;
}
>>> .el-card__body {
  display: flex;
  padding: 10px 0px 10px 10px;
}
.card-title {
  display: flex;
  align-items: center;
  font-weight: bold;
  font-size: 16px;
}

.card-title-icon {
  fill: currentColor;
  width: 24px;
  height: 24px;
  margin-right: 8px;
}

.cell-group-scrollable {
  max-height: 350px;
  overflow-y: auto;
  padding-right: 16px; /* 恢复内容区域的内边距 */
  flex: 1;
}

.cell-wrapper {
  display: flex;
  align-items: center;
  padding: 8px 8px; /* 减小上下内边距以减少间隔 */
  border-bottom: 1px solid #e8e8e8; /* 为每个项之间添加分割线 */
}

.cell-order {
  width: 20px;
  text-align: left;
  font-size: 16px;
  font-weight: 700;
  margin-right: 8px;
  color: #7a7a7a; /* 统一非特殊序号颜色 */
}

/* 通过在cell-heat类前面添加更多的父级选择器，提高了特异性 */
.cell-heat {
  min-width: 50px;
  text-align: right;
  font-size: 12px;
  color: #7a7a7a;
}
.cell-title {
  font-size: 13px;
  color: #495060;
  line-height: 22px;
  flex-grow: 1;
  overflow: hidden;
  text-align: left; /* 左对齐 */
  text-overflow: ellipsis; /* 超出部分显示省略号 */
}
.top-ranking-1 .cell-order {
  color: #fadb14;
} /* 金色 */
.top-ranking-2 .cell-order {
  color: #a9a9a9;
} /* 银色 */
.top-ranking-3 .cell-order {
  color: #d48806;
} /* 铜色 */
/* 新增的.hover-effect类用于标题的hover状态 */
.cell-title.hover-effect {
  cursor: pointer; /* 鼠标悬停时显示指针形状 */
  transition: color 0.3s ease; /* 平滑地过渡颜色变化 */
}

/* 当鼠标悬停在带有.hover-effect类的元素上时改变颜色 */
.cell-title.hover-effect:hover {
  color: #409eff; /* 或者使用你喜欢的颜色 */
}
</style>

