<template>
  <el-card class="camera-card" shadow="hover">
    <div slot="header" class="card-header">随机全球高清实况摄像头</div>

    <el-row :gutter="10">
      <el-col :span="24">
        <div class="camera-list">
          <div
            v-for="(camera, index) in cameras"
            :key="index"
            class="camera-item"
          >
            <i class="el-icon-video-camera camera-icon"></i>
            <el-link
              :href="camera.playUrl"
              target="_blank"
              underline
              class="camera-name"
            >
              {{ camera.placeName }}
            </el-link>
          </div>
        </div>
      </el-col>
    </el-row>
  </el-card>
</template>
<script>
import apiService from "@/config/apiService.js";
export default {
  name: "CameraPlayer",
  data() {
    return {
      cameras: [],
    };
  },
  created() {
    this.fetchCameras();
  },
  methods: {
    fetchCameras() {
      apiService
        .get(`/welcome/querySkylineWebcams`)
        .then((res) => {
          // 处理响应数据
          this.cameras = res.data.data;
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
>>> .el-card__body,
.el-main {
  padding: 10px;
}
.camera-card {
  margin: 10px 0;
}

.card-header {
  padding: 0;
  line-height: 0px;
  color: #333;
  text-align: left;
  font-weight: bold;
}

.camera-item {
  display: flex;
  align-items: center;
  padding: 10px 5px 5px 10px;
  width: 100%;
}

.camera-icon {
  flex-shrink: 0; /* 阻止图标缩小 */
  margin-right: 8px;
  font-size: 20px;
  color: #409eff; /* Element UI的主题颜色 */
}

.camera-name {
  font-size: 14px;
  text-align: left;
  white-space: nowrap; /* 确保文本在一行显示 */
  text-overflow: ellipsis; /* 使用省略号表明文本溢出 */
}
</style>
