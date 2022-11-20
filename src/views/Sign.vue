<template>
  <Router-link :to="{ name: 'home' }">
    <img src="../image/logo.png" alt="" class="absolute" />
  </Router-link>
  <div class="bg-secondary h-screen flex flex-col justify-center items-center">
    <!-- <div id="colors">
      <span style="background-color: black" class="black"></span>
      <span style="background-color: red" class="red"></span>
      <span style="background-color: blue" class="blue"></span>
      <span style="background-color: green" class="green"></span>
    </div> -->
    <p class="text-gray-400">在此書寫你的簽名</p>
    <canvas
      id="canvas"
      class="bg-white rounded-xl"
      width="600px"
      height="300px"
    ></canvas>
    <!-- <img class="show-img" width="250" height="150" style="border: 1px solid" /> -->
    <div class="btn-group mt-8">
      <button
        class="clear cursor-pointer w-52 h-12 mr-4 py-2 px-4 rounded-2xl border-2 border-primary bg-white text-lg text-primary"
      >
        清除
      </button>
      <button
        class="save bg-primary cursor-pointer w-52 h-12 mr-4 py-2 px-4 rounded-2xl border-0 text-lg text-white"
      >
        建立簽名
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from "@vue/reactivity";
import { onMounted } from "@vue/runtime-core";
import { useRouter } from "vue-router";

const router = useRouter();

let isPainting = ref(false);

onMounted(() => {
  drawCanvas();
});

const drawCanvas = () => {
  const canvas = document.querySelector("#canvas");
  const ctx = canvas.getContext("2d");
  const clearBtn = document.querySelector(".clear");
  const saveBtn = document.querySelector(".save");

  // 設定線條的相關數值
  ctx.lineWidth = 4;
  ctx.lineCap = "round";

  // 設置狀態來確認滑鼠 / 手指是否按下或在畫布範圍中

  // 取得滑鼠 / 手指在畫布上的位置
  function getPaintPosition(e) {
    const canvasSize = canvas.getBoundingClientRect();

    if (e.type === "mousemove") {
      return {
        x: e.clientX - canvasSize.left,
        y: e.clientY - canvasSize.top,
      };
    } else {
      return {
        x: e.touches[0].clientX - canvasSize.left,
        y: e.touches[0].clientY - canvasSize.top,
      };
    }
  }

  // 開始繪圖時，將狀態開啟
  function startPosition(e) {
    e.preventDefault();
    isPainting.value = true;
  }

  // 結束繪圖時，將狀態關閉，並產生新路徑
  function finishedPosition() {
    isPainting.value = false;
    ctx.beginPath();
  }

  // 繪圖過程
  function draw(e) {
    // 滑鼠移動過程中，若非繪圖狀態，則跳出
    if (!isPainting.value) return;

    // 取得滑鼠 / 手指在畫布上的 x, y 軸位置位置
    const paintPosition = getPaintPosition(e);

    // 移動滑鼠位置並產生圖案
    ctx.lineTo(paintPosition.x, paintPosition.y);
    ctx.stroke();
  }

  // 重新設定畫布
  function reset() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }

  // event listener 電腦板
  canvas.addEventListener("mousedown", startPosition);
  canvas.addEventListener("mouseup", finishedPosition);
  canvas.addEventListener("mouseleave", finishedPosition);
  canvas.addEventListener("mousemove", draw);

  clearBtn.addEventListener("click", reset);

  // 儲存圖片
  const showImage = document.querySelector(".show-img");

  function saveImage() {
    const newImg = canvas.toDataURL("image/png");
    // showImage.src = newImg;
    localStorage.setItem("img", newImg);

    router.push({ name: "edit" });
  }

  saveBtn.addEventListener("click", saveImage);
};
</script>

<style lang="scss" scoped></style>
