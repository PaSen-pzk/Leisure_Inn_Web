<template>
  <div class="float-box">
    <div
      class="button-box"
      @mousedown="mousedown"
      @mousemove="mousemove"
      @touchmove="mousemove"
      @mouseup="mouseup"
      @touchstart="mousedown"
      @touchend="mouseup"
      @click="onClick"
      ref="flbutton"
    >
      <span class="title">{{ title }}</span>
    </div>
    <!-- <div
      :style="{ left: left + 'px', top: top + 'px' }"
      v-if="menuFlag"
      :class="menuPosition === 'right' ? 'menu-item-right':'menu-item-left'"
    >
      <div :class="tabBackImg(index)" class="box-title-box-item" v-for="(item,index) in circleList"
           @click="circleClick(item,index)" :key="index">
        <span :class="'text'+index">{{ item }}</span>
      </div>
    </div> -->
  </div>
</template>

<script>
export default {
  name: "FloatButton",
  props: {
    circleList: {
      type: Array,
      default: () => []
    },
  },
  data() {
    return {
      title: '',
      left: 0,
      top: 40,
      menuFlag: false,//菜单显隐
      mouseDownflag: false, // 鼠标点击状态
      position: {
        x: 0,
        y: 0,
      },
      nx: "",
      ny: "",
      dx: "",
      dy: "",
      xPum: "",
      yPum: "",
      movb: 1,//区分拖拽还是点击
      menuPosition: 'right',
    };
  },
  mounted() {
    this.left = this.$refs.flbutton.offsetLeft + 20;
    this.top = this.$refs.flbutton.offsetTop;
    this.title = this.circleList[0];
  },
  computed: {
    tabBackImg() {
      return (index) => {
        if (index === 0) {
          return 'tab-item-1'
        } else if (index === 1) {
          return 'tab-item-2'
        } else if (index === 2) {
          return 'tab-item-3'
        } else if (index === 3) {
          return 'tab-item-4'
        }
      }
    }
  },
  methods: {
    circleClick(item, index) {
      this.title = item
      this.$emit('circleClick', item, index)
    },
    //鼠标摁下
    mousedown() {
      this.mouseDownflag = true;
      /*此处判断pc 或移动端得到event 事件*/
      var touch;
      if (event.touches) {
        touch = event.touches[0];
      } else {
        touch = event;
      }
      //鼠标点击面向页面的x坐标y坐标
      this.position.x = touch.clientX;
      this.position.y = touch.clientY;
      //鼠标x坐标－拖拽按钮x坐标得到鼠标距离拖拽按钮的间距
      this.dx = this.$refs.flbutton.offsetLeft;
      //鼠标y坐标－拖拽按钮y坐标得到鼠标距离拖拽按钮的间距
      this.dy = this.$refs.flbutton.offsetTop;
    },
    //鼠标拖拽移动
    mousemove() {
      if (this.mouseDownflag) {
        this.movb = 2;
        this.menuFlag = false;
        /*此处判断得到event事件*/
        var touch;
        if (event.touches) {
          touch = event.touches[0];
        } else {
          touch = event;
        }
        //鼠标坐标－鼠标与拖拽按钮的间距坐标得到拖拽按钮的左上角x轴y轴坐标
        this.nx = touch.clientX - this.position.x;
        this.ny = touch.clientY - this.position.y;

        this.xPum = this.dx + this.nx;
        this.yPum = this.dy + this.ny;
        let width = window.innerWidth - this.$refs.flbutton.offsetWidth; //屏幕宽度减去自身控件宽度
        let height = window.innerHeight - this.$refs.flbutton.offsetHeight; //屏幕高度减去自身控件高度
        /* 此处判断
          拖拽按钮 如果超出屏幕宽高或者小于
          设置屏幕最大 x=全局容器x y=全局容器y
          否则 设置 为 x=0 y=0
        */
        this.xPum < 0 && (this.xPum = 0);
        this.yPum < 0 && (this.yPum = 0);
        this.xPum > width && (this.xPum = width);
        this.yPum > height && (this.yPum = height);
        if (this.xPum > 900) {
          this.menuPosition = 'left'
        } else {
          this.menuPosition = 'right'
        }
        // 计算后坐标  设置 按钮位置
        this.$refs.flbutton.style.left = this.xPum + "px";
        this.$refs.flbutton.style.top = this.yPum + "px";
        this.left = this.xPum + 20;
        this.top = this.yPum;

        //阻止页面的滑动默认事件
        document.addEventListener("touchmove", function () {
          event.preventDefault();
        }, false);
      }
    },
    //鼠标抬起
    mouseup() {
      this.mouseDownflag = false;
      this.checkEdge();
    },
    onClick() {
      if (this.movb === 2) {
        this.movb = 1;
      } else {
        this.menuFlag = !this.menuFlag;
      }
    },
    //实现悬浮球自动吸附到边框的逻辑
    checkEdge() {
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      const ballWidth = 110; // 悬浮球的宽度
      const ballHeight = 110; // 悬浮球的高度
      
      console.log("left:" + this.left);
      // 检查悬浮球是否需要吸附到左边缘
      if (this.left < ballWidth / 2) {
        this.left = 0;
      }
      // 检查悬浮球是否需要吸附到右边缘
      else if (this.left > viewportWidth - ballWidth / 2) {
        this.left = viewportWidth - ballWidth;
      }
      // 检查悬浮球是否需要吸附到上边缘
      if (this.top < ballHeight / 2) {
        this.top = 0;
      }
      // 检查悬浮球是否需要吸附到下边缘
      else if (this.top > viewportHeight - ballHeight / 2) {
        this.top = viewportHeight - ballHeight;
      }
    }

  },
};
</script>
<style scoped>
.float-box {
  position: relative;

  .button-box {
    width: 110px;
    height: 110px;
    position: fixed;
    top: 100px;
    left: 500px;
    touch-action: none;
    text-align: center;
    color: white;
    background-image: url("~@/assets/image/screen/floatCat.png");
    background-repeat: no-repeat;
    background-size: 100% 100%;
    line-height: 100px;
    font-size: 14px;
    cursor: pointer;
    z-index: 99;

    .title {
      background: linear-gradient(rgba(255, 255, 255, 1) 25%, rgba(69, 177, 254, 1) 100%);;
      -webkit-background-clip: text;
      color: transparent;
      font-weight: bolder;
    }
  }

  .menu-item-left {
    position: absolute;
    z-index: 99;

    .box-title-box-item {
      color: #FFFFFF;
      cursor: pointer;
      font-size: 13px;
      cursor: pointer;
      display: flex;
      justify-content: center;
      align-items: center;
    }

    /* .tab-item-1 {
      height: 53px;
      width: 43px;
      position: absolute;
      top: -8px;
      left: -42px;
      background: url("~@/assets/images/screen/float-button/button-l1.png") no-repeat;
      background-size: 100% 100%;
      line-height: 43px;
      padding-top: 10px;
    }

    .tab-item-2 {
      height: 53px;
      width: 44px;
      background: url("~@/assets/images/screen/float-button/button-l2.png") no-repeat;
      background-size: 100% 100%;
      position: absolute;
      top: 46px;
      left: -42px;
      line-height: 43px;
    } */

    /* .tab-item-3 {
      height: 43px;
      width: 53px;
      background: url("~@/assets/images/screen/float-button/button-r3.png") no-repeat;
      background-size: 100% 100%;
      position: absolute;
      top: 80px;
      left: 37px;
      line-height: 43px;
    }

    .tab-item-4 {
      height: 43px;
      width: 53px;
      background: url("~@/assets/images/screen/float-button/button-r4.png") no-repeat;
      background-size: 100% 100%;
      position: absolute;
      top: 80px;
      left: -17px;
      line-height: 40px;
    } */

    .tab-item-1:hover, .tab-item-2:hover, .tab-item-3:hover, .tab-item-4:hover {
      transform: scale(1.2);
    }

    .text0, .text1, .text2, .text3 {
      display: inline-block;
    }

    .text0 {
      writing-mode: vertical-rl;
      letter-spacing: 1px;
      transform: rotate(17deg);
    }

    .text1 {
      writing-mode: vertical-rl;
      letter-spacing: 1px;
      transform: rotate(335deg);
    }

    .text2 {
      transform: rotate(340deg);
    }

    .text3 {
      transform: rotate(20deg);
    }
  }

  .menu-item-right {
    position: absolute;
    z-index: 99;

    .box-title-box-item {
      color: #FFFFFF;
      cursor: pointer;
      font-size: 13px;
      cursor: pointer;
      display: flex;
      justify-content: center;
      align-items: center;
    }

    /* .tab-item-1 {
      height: 53px;
      width: 43px;
      position: absolute;
      top: -10px;
      left: 67px;
      background: url("~@/assets/images/screen/float-button/button-r1.png") no-repeat;
      background-size: 100% 100%;
      line-height: 43px;
      padding-top: 10px;
    }

    .tab-item-2 {
      height: 53px;
      width: 43px;
      background: url("~@/assets/images/screen/float-button/button-r2.png") no-repeat;
      background-size: 100% 100%;
      position: absolute;
      top: 45px;
      left: 69px;
      line-height: 43px;
    }

    .tab-item-3 {
      height: 43px;
      width: 53px;
      background: url("~@/assets/images/screen/float-button/button-r3.png") no-repeat;
      background-size: 100% 100%;
      position: absolute;
      top: 80px;
      left: 35px;
      line-height: 43px;
    }

    .tab-item-4 {
      height: 43px;
      width: 53px;
      background: url("~@/assets/images/screen/float-button/button-r4.png") no-repeat;
      background-size: 100% 100%;
      position: absolute;
      top: 80px;
      left: -20px;
      line-height: 40px;
    } */

    .tab-item-1:hover, .tab-item-2:hover, .tab-item-3:hover, .tab-item-4:hover {
      transform: scale(1.2);
    }

    .text0, .text1, .text2, .text3 {
      display: inline-block;
    }

    .text0 {
      writing-mode: vertical-rl;
      letter-spacing: 1px;
      transform: rotate(345deg);
    }

    .text1 {
      writing-mode: vertical-rl;
      letter-spacing: 1px;
      transform: rotate(21deg);
      margin-bottom: 5px;
    }

    .text2 {
      transform: rotate(337deg);
      margin-right: 10px;
    }

    .text3 {
      transform: rotate(20deg);
      margin-left: 5px;
    }
  }
}
</style>

