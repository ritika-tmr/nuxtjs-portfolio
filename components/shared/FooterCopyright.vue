<script>
import { mapState } from "vuex";

export default {
  data: () => {
    return {
      projectName: "Nuxt.js & Tailwind CSS Portfolio",
      author: "Ritika",
    };
  },
  computed: {
    ...mapState(["copyrightDate"]),
  },
};
</script>

<template>
  <div class="flex justify-center items-center text-center">
    <div
      class="
        font-general-regular
        text-lg text-ternary-dark
        dark:text-ternary-light
      "
    >
      &copy; {{ copyrightDate }}.
<!--      <a-->
<!--        href="https://github.com/realstoman/nuxtjs-tailwindcss-portfolio"-->
<!--        target="__blank"-->
<!--        class="-->
<!--          font-general-medium-->
<!--          hover:underline hover:text-blue-600-->
<!--          dark:hover:text-blue-300-->
<!--          duration-500-->
<!--        "-->
<!--        >{{ projectName }}</a-->
<!--      >-->
      Developed by
      <a
        class="
          font-general-medium
          text-secondary-dark
          dark:text-secondary-light
          hover:underline hover:text-blue-600
          dark:hover:text-blue-300
          duration-500
        "
        >{{ author }}</a
      >
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
