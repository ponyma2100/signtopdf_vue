<template>
  <Navbar />
  <div>
    <div class="flex bg-gray-100 h-[600px] p-10 m-10 rounded-3xl relative">
      <div class="p-12">
        <h1 class="text-primary font-black text-5xl">小綠簽</h1>
        <p class="w-2/5">
          護樹、永續、減碳的綠色生活 響應環保無紙化電子簽署， 省時便利又環保。
        </p>
      </div>
      <div
        class="w-full flex flex-col justify-around items-center relative bg-white p-10 rounded-2xl h-2/3"
      >
        <img src="../image/home-files.png" alt="" class="w-30 h-30" />
        <input
          type="file"
          accept="application/pdf"
          @change="handleChange"
          class="file:cursor-pointer file:w-52 file:h-16 file:bg-primary file:mr-4 file:py-2 file:px-4 file:rounded-2xl file:border-0 file:text-lg file:text-white file:font-semibold"
        />
        <p class="">或拖移檔案到此處</p>
        <p class="text-primary">(限10MB 內的PDF或JPG檔)</p>
      </div>
      <img
        src="../image/home-people1.png"
        alt=""
        class="h-1/3 absolute bottom-0 left-1/3 z-10"
      />
      <img
        src="../image/home-people2.png"
        alt=""
        class="h-1/3 absolute bottom-0 left-1/2 z-10"
      />
      <img
        src="../image/home-tree1.png"
        alt=""
        class="h-1/3 absolute bottom-0 right-1/3 z-10"
      />
      <img
        src="../image/home-bag.png"
        alt=""
        class="absolute bottom-0 right-1/3 z-10"
      />
      <img
        src="../image/home-people3.png"
        alt=""
        class="h-1/3 absolute bottom-0 right-1/4 z-10"
      />
      <img
        src="../image/home-people4.png"
        alt=""
        class="h-1/3 absolute bottom-10 right-10 z-10"
      />
      <img
        src="../image/home-lawn2.png"
        alt=""
        class="absolute bottom-0 right-0"
      />
    </div>
    <!-- <canvas id="canvas" class="bg-white rounded-2xl w-full h-4/5"> </canvas> -->

    <img src="../image/home-lawn1.png" alt="" class="absolute bottom-40" />
    <img src="../image/home-leaf1.png" alt="" class="absolute bottom-0" />
  </div>
</template>

<script setup>
import { onMounted, ref } from "@vue/runtime-core";
import { useRouter } from "vue-router";
import Navbar from "../components/Navbar.vue";

const router = useRouter();

const Base64Prefix = "data:application/pdf;base64,";
pdfjsLib.GlobalWorkerOptions.workerSrc =
  "https://mozilla.github.io/pdf.js/build/pdf.worker.js";

async function savePDF(data) {
  const pdfDoc = await pdfjsLib.getDocument(data).promise;
  const pdfPage = await pdfDoc.getPage(1);
  const canvas = document.getElementById("canvas");
  const ctx = canvas.getContext("2d");
  const viewport = pdfPage.getViewport({ scale: 1 });
  canvas.width = viewport.width;
  canvas.height = viewport.height;
  pdfPage.render({
    canvasContext: ctx,
    viewport: viewport,
  });
}
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
  pdfData = await readBlob(pdfData);

  // 將 base64 中的前綴刪去，並進行解碼
  const data = atob(pdfData.substring(Base64Prefix.length));

  // 利用解碼的檔案，載入 PDF 檔及第一頁
  const pdfDoc = await pdfjsLib.getDocument({ data }).promise;
  const pdfPage = await pdfDoc.getPage(1);
}

const handleChange = async (e) => {
  if (e.target.files[0] === undefined) return;
  // 透過 input 所選取的檔案
  const file = e.target.files[0];
  const pdfData = await readBlob(file);

  localStorage.setItem("pdf", pdfData);

  router.push({ name: "sign" });
};
</script>

<style lang="scss" scoped></style>
