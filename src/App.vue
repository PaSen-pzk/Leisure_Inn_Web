<template>
  <div v-if="!isSmallScreen">
    <pc-app />
  </div>
  <div v-else>
    <mp-app />
  </div>
</template>
<script>
import PcApp from "@/PCApp.vue";
import MpApp from "@/MpApp.vue";
export default {
  components: { PcApp, MpApp },
  data() {
    return {
      // 用于标识是否为小屏幕
      isSmallScreen: false,
    };
  },
  created() {
    // 根据初始屏幕宽度设置isSmallScreen的值
    this.checkScreenSize();
  },
  methods: {
    checkScreenSize() {
      const screenWidth = window.innerWidth;
      this.isSmallScreen = screenWidth < 768;
    },
  },
  mounted() {
    // 监听窗口大小变化事件
    window.addEventListener("resize", this.checkScreenSize);
  },
  beforeDestroy() {
    // 移除窗口大小变化事件监听器
    window.removeEventListener("resize", this.checkScreenSize);
  },
};
</script>
<style scope></style>
