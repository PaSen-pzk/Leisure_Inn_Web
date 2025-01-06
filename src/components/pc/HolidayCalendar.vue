<template>
  <el-card class="card-calendar">
    <el-calendar v-model="currentDate">
      <template #dateCell="{ date }">
        <el-tooltip
          v-if="isHoliday(date) || isHolidayRecess(date)"
          :content="getHolidayName(date)"
          placement="top"
          effect="dark"
        >
          <div class="date-cell">
            <span>{{ new Date(date).getDate() }}</span>
            <span v-if="isHoliday(date)" class="holiday-mark holiday"></span>
            <span
              v-if="isHolidayRecess(date)"
              class="holiday-mark holiday-recess"
            ></span>
          </div>
        </el-tooltip>
        <!-- 如果不是假日，仍要展示日期，但不包含在 Tooltip 内 -->
        <div v-else class="date-cell">
          <span>{{ new Date(date).getDate() }}</span>
        </div>
      </template>
    </el-calendar>
  </el-card>
</template>
<script>
import apiService from "@/config/apiService.js";
export default {
  props: {},
  data() {
    return {
      currentDate: new Date(),
      currentMonthHolidays: [],
    };
  },
  watch: {
    currentDate(date) {
      const month = this.formatMonth(date);
      this.fetchHolidayData(month);
    },
  },
  created() {
    //初始化获取日期
    const year = new Date().getFullYear();
    const month = (new Date().getMonth() + 1).toString().padStart(2, "0");
    this.fetchHolidayData(year + month);
  },
  methods: {
    fetchHolidayData(month) {
      apiService
        .get(`/welcome/queryHoliday?month=${month}`)
        .then((res) => {
          // 处理响应数据
          this.currentMonthHolidays = res.data.data;
        })
        .catch((error) => {
          // 处理错误情况
          console.error(error);
        });
    },
    isHoliday(date) {
      // formatDate方法应该保证格式和接口一致，如 "20240401"
      const formattedDate = this.formatDate(date);
      // 找到是否是普通节假日
      const holiday = this.currentMonthHolidays.find(
        (d) => d.date === formattedDate && !d.holidayRecess
      );
      return holiday !== undefined;
    },
    isHolidayRecess(date) {
      // formatDate方法应该保证格式和接口一致，如 "20240401"
      const formattedDate = this.formatDate(date);
      // 找到是否是假期节假日
      const holidayRecess = this.currentMonthHolidays.find(
        (d) => d.date === formattedDate && d.holidayRecess
      );
      return holidayRecess !== undefined;
    },
    formatDate(date) {
      const year = date.getFullYear();
      const month = (date.getMonth() + 1).toString().padStart(2, "0");
      const day = date.getDate().toString().padStart(2, "0");
      return year.toString() + month.toString() + day.toString(); // 返回年月日格式字符串
    },
    formatMonth(date) {
      const year = date.getFullYear();
      const month = (date.getMonth() + 1).toString().padStart(2, "0"); // 添加前导零
      return `${year}${month}`; // 返回年月格式字符串
    },
    getHolidayName(date) {
      const formattedDate = this.formatDate(date);
      const holiday = this.currentMonthHolidays.find(
        (d) => d.date === formattedDate
      );
      let msg = holiday ? holiday.holiday : "";
      if (holiday.holidayRecess) {
        msg += "(放假)";
      }
      return msg; // 假定 'name' 是存储节日名称的属性
    },
    handleDateChange(date) {
      this.selectedDate = date;
      // 选中日期改变时的处理代码，例如：弹窗显示该日期的事件
      const formattedDate = this.formatDate(date);
      if (this.events[formattedDate]) {
        this.$Modal.info({
          title: "事件",
          content: `选中的日期 ${formattedDate} 是：${this.events[formattedDate]}`,
        });
      }
    },
  },
};
</script>
<style scoped>
.card-calendar {
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  width: 100%;
  height: 100%;
}
.card-calendar:hover {
  box-shadow: 0 6px 8px rgba(0, 0, 0, 0.25);
}
>>> .el-card__header {
  padding: 0%;
}
>>> .el-card__body {
  display: flex;
  padding: 5px !important;
}
>>> .el-calendar__header {
  padding: 0%;
  margin-top: 5px;
  font-size: 12px;
}
>>> .el-calendar__body {
  padding: 4px;
  font-size: 12px;
}
>>> .el-calendar-table .el-calendar-day {
  box-sizing: border-box;
  height: 32px;
  text-align: center;
  position: relative; /* 使得可以相对于单元格定位小标记 */
}
>>> .el-calendar__title {
  margin-bottom: 3px;
}
>>> .el-calendar__button-group {
  margin-bottom: 3px;
}
.holiday-mark {
  display: inline-block;
  width: 6px;
  height: 6px;
  background-color: rgb(102, 239, 122);
  border-radius: 50%;
  position: absolute;
  bottom: 5px;
  right: 5px;
}

.holiday {
  background-color: #ffeb3b; /* 节假日为黄色 */
}

.holiday-recess {
  background-color: #4caf50; /* 假期节假日为绿色 */
}
</style>
