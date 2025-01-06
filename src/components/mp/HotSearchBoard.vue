<template>
  <el-card class="custom-card">
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
export default {
  props: {
    title: String,
    icon: String,
    type: String,
    hotSearchData:Array
  },
  data() {
    return {};
  },
  methods: {
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
  overflow: hidden; /* 防止子元素溢出卡片范围 */
}

.custom-card:hover {
  box-shadow: 0 6px 8px rgba(0, 0, 0, 0.25);
}

.cell-group-scrollable {
  max-height: 100%; /* 设置卡片内容的最大高度 */
  overflow-y: auto;
  margin-right: -16px; /* 消除内边距对滚动条的影响 */
  padding-right: 16px; /* 恢复内容区域的内边距 */
}

.cell-wrapper {
  display: flex;
  align-items: center;
  padding: 10px 16px; /* 统一内边距 */
  border-bottom: 1px solid #e8e8e8;
}

.cell-order {
  width: 20px;
  text-align: left;
  font-size: 16px;
  font-weight: 700;
  color: #7a7a7a;
}

.cell-title {
  font-size: 14px;
  color: #495060;
  flex-grow: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  cursor: pointer;
  text-align: left;
}

.cell-heat {
  min-width: 50px;
  text-align: right;
  font-size: 14px;
  color: #7a7a7a;
}

.top-ranking-1 .cell-order {
  color: #fadb14; /* 金色 */
}

.top-ranking-2 .cell-order {
  color: #a9a9a9; /* 银色 */
}

.top-ranking-3 .cell-order {
  color: #d48806; /* 铜色 */
}

.cell-title.hover-effect {
  transition: color 0.3s ease;
}

.cell-title.hover-effect:hover {
  color: #409eff; /* 或者使用你喜欢的颜色 */
}

/* 响应式设计 */
@media (max-width: 768px) {
  .custom-card {
    border-radius: 0; /* 扁平化边框 */
    box-shadow: none; /* 移除阴影 */
    margin-bottom: 10px; /* 减小底部间隙 */
  }

  .cell-group-scrollable {
    margin-right: -12px; /* 消除内边距影响 */
    padding-right: 12px; /* 补充内容内边距 */
  }

  .cell-wrapper {
    padding: 6px 12px; /* 减小单元格内边距 */
  }

  .cell-order {
    font-size: 16px; /* 调整序号字体大小 */
  }

  .cell-title {
    font-size: 14px; /* 调整标题字体大小 */
    margin-left: 12px; /* 调整间距 */
  }

  .cell-heat {
    font-size: 12px; /* 调整热度指数字体大小 */
  }
}
</style>
