<template>
  <div class="flex justify-between p-8">
    <Router-link :to="{ name: 'home' }">
      <img src="../image/logo.png" alt="" class="absolute" />
    </Router-link>
    <button
      class="border border-primary rounded-lg h-10 w-24 text-primary font-semibold"
    >
      歷史紀錄
    </button>
  </div>
</template>

<script setup></script>

<style lang="scss" scoped></style>
