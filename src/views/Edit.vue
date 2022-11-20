<template>
  <Router-link :to="{ name: 'home' }">
    <img src="../image/logo.png" alt="" class="absolute" />
  </Router-link>
  <div class="h-full bg-secondary flex items-center justify-center p-10">
    <div class="flex flex-col">
      <button
        @click="handleClick"
        class="bg-primary mt-8 cursor-pointer w-52 h-12 mr-4 py-2 px-4 rounded-2xl border-0 text-lg text-white"
      >
        匯入簽名
      </button>
      <button
        @click="handleDownload"
        class="download bg-primary mt-8 cursor-pointer w-52 h-12 mr-4 py-2 px-4 rounded-2xl border-0 text-lg text-white"
      >
        Download PDF
      </button>
    </div>

    <canvas id="canvas" width="1000px" height="1000px"></canvas>
  </div>
</template>

<script setup>
import { onMounted, ref, reactive, watchEffect } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
let canvas = null;
let signUrl = ref("");

const Base64Prefix = "data:application/pdf;base64,";
const add = document.querySelector(".add");
pdfjsLib.GlobalWorkerOptions.workerSrc =
  "https://mozilla.github.io/pdf.js/build/pdf.worker.js";

// 使用原生 FileReader 轉檔
function readBlob(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.addEventListener("load", () => resolve(reader.result));
    reader.addEventListener("error", reject);
    reader.readAsDataURL(blob);
  });
}

async function printPDF(pdfData) {
  // 將檔案處理成 base64
  // pdfData = await readBlob(pdfData);

  // 將 base64 中的前綴刪去，並進行解碼
  const data = atob(pdfData.substring(Base64Prefix.length));

  // 利用解碼的檔案，載入 PDF 檔及第一頁
  const pdfDoc = await pdfjsLib.getDocument({ data }).promise;
  const pdfPage = await pdfDoc.getPage(1);

  // 設定尺寸及產生 canvas
  const viewport = pdfPage.getViewport({ scale: window.devicePixelRatio });
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");

  // 設定 PDF 所要顯示的寬高及渲染
  canvas.height = viewport.height;
  canvas.width = viewport.width;
  const renderContext = {
    canvasContext: context,
    viewport,
  };
  const renderTask = pdfPage.render(renderContext);

  // 回傳做好的 PDF canvas
  return renderTask.promise.then(() => canvas);
}

async function pdfToImage(pdfData) {
  // 設定 PDF 轉為圖片時的比例
  const scale = 1 / window.devicePixelRatio;

  // 回傳圖片
  return new fabric.Image(pdfData, {
    id: "renderPDF",
    scaleX: scale,
    scaleY: scale,
  });
}

onMounted(() => {
  // 此處 canvas 套用 fabric.js
  canvas = new fabric.Canvas("canvas");
  const sign = document.querySelector(".sign");

  // 若 localStorage 有資料才放入
  if (localStorage.getItem("img")) {
    // sign.src = localStorage.getItem("img");
    signUrl.value = localStorage.getItem("img");
  }
  if (localStorage.getItem("pdf")) {
    renderPDF();
  }
});

const renderPDF = async () => {
  canvas.requestRenderAll();
  const pdfData = await printPDF(localStorage.getItem("pdf"));

  const pdfImage = await pdfToImage(pdfData);

  // 透過比例設定 canvas 尺寸
  canvas.setWidth(pdfImage.width / window.devicePixelRatio);
  canvas.setHeight(pdfImage.height / window.devicePixelRatio);

  // 將 PDF 畫面設定為背景
  canvas.setBackgroundImage(pdfImage, canvas.renderAll.bind(canvas));
};

const handleClick = () => {
  fabric.Image.fromURL(signUrl.value, (img, err) => {
    if (!err) {
      img.set({
        left: 0, // 左上角位置
        top: 0, // 左上角位置
      });
      img.scaleX = 0.5;
      img.scaleY = 0.5;

      canvas.add(img);
    }
  });
};

const handleDownload = () => {
  // 引入套件所提供的物件
  const pdf = new jsPDF();

  const download = document.querySelector(".download");

  const image = canvas.toDataURL("image/png");

  // 設定背景在 PDF 中的位置及大小
  const width = pdf.internal.pageSize.width;
  const height = pdf.internal.pageSize.height;
  pdf.addImage(image, "png", 0, 0, width, height);

  // 將檔案取名並下載
  pdf.save("download.pdf");
  // router.push({ name: "home" });
};
</script>

<style lang="scss" scoped></style>
