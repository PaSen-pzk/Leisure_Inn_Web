<template>
  <div class="stats-card-container">
    <el-card class="stats-card-main">
      <!-- 突出显示的今日 PV -->
      <div class="stats-section">
        <div class="stats-value-main">{{ statsData.todayPv }}</div>
        <div class="stats-label-main">今日 PV</div>
      </div>
      <!-- 其他统计数据，以更紧凑的形式显示 -->
      <div class="stats-section stats-others">
        <div class="stats-item">
          <div class="stats-value-small">{{ statsData.todayUv }}</div>
          <div class="stats-label-small">今日 UV</div>
        </div>
        <div class="stats-item">
          <div class="stats-value-small">{{ statsData.allPv }}</div>
          <div class="stats-label-small">总 PV</div>
        </div>
        <div class="stats-item">
          <div class="stats-value-small">{{ statsData.allUv }}</div>
          <div class="stats-label-small">总 UV</div>
        </div>
      </div>
    </el-card>
  </div>
</template>
<script>
import apiService from "@/config/apiService.js";
export default {
  name: "VisitorLog",
  data() {
    return {
      statsData: {
        todayPv: 0,
        todayUv: 0,
        allPv: 0,
        allUv: 0,
      },
    };
  },
  created() {
    this.fetchVisitorCount(); // 组件创建时立即调用一次
    this.startPolling(); // 启动定时器
  },
  beforeDestroy() {
    this.stopPolling(); // 在组件销毁前清理定时器
  },
  methods: {
    fetchVisitorCount() {
      apiService
        .get("/welcome/queryVisitorCount")
        .then((res) => {
          // 处理响应数据
          this.statsData = res.data.data;
        })
        .catch((error) => {
          // 处理错误情况
          console.error(error);
        });
    },
    startPolling() {
      // 定义一个方法来启动周期性的定时器
      this.polling = setInterval(() => {
        this.fetchVisitorCount();
      }, 1000 * 60 * 60); // 每60000毫秒（1分钟）调用一次
    },
    stopPolling() {
      // 定义一个方法来停止定时器
      clearInterval(this.polling);
    },
  },
};
</script>

<style scoped>
>>> .el-card__body{
  padding: 10px;
}
.stats-card-container {
  max-width: 400px;
  margin-bottom: 10px;
}

.stats-card-main {
  padding: 12px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.stats-section {
  text-align: center;
}

.stats-value-main {
  font-size: 24px;
  font-weight: bold;
  color: #0A74DA;
  margin-bottom: 4px;
}

.stats-label-main {
  font-size: 14px;
  color: #333;
}

.stats-others {
  display: flex;
  justify-content: space-between;
  margin-top: 12px;
}

.stats-item {
  text-align: center;
}

.stats-value-small, .stats-label-small {
  font-size: 12px; /* 减小字体尺寸以实现更紧凑的布局 */
}

.stats-value-small {
  font-weight: bold;
  color: #333;
  margin-bottom: 2px;
}

.stats-label-small {
  color: #666;
}

@media (max-width: 400px) {
  .stats-others {
    flex-direction: column;
    align-items: center;
  }

  .stats-item {
    margin-bottom: 8px;
  }
}
</style>
