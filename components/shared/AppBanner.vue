<template>
  <section
    class="
      flex flex-col
      sm:justify-between
      items-center
      sm:flex-row
      mt-12
      sm:mt-10
    "
  >
    <!-- Banner left contents -->
    <div class="w-full md:w-1/3 text-left">
      <h1
        class="
          font-general-semibold
          text-3xl
          md:text-3xl
          xl:text-4xl
          text-center
          sm:text-left
          text-ternary-dark
          dark:text-primary-light
        "
      >
        Hi, I'm Ritika Tamrakar
      </h1>
      <p
        class="
          font-general-medium
          mt-2
          text-lg
          sm:text-xl
          xl:text-2xl
          text-center
          sm:text-left
          leading-none
          text-gray-400
        "
      >
        Bringing together aesthetics, functionality, and seamless user experiences as a Frontend Developer and UI/UX Designer.
      </p>
      <div class="flex justify-center sm:block">
        <NuxtLink
          to="/about"
          class="
            flex
            justify-center
            items-center
            w-36
            sm:w-48
            mt-12
            mb-6
            sm:mb-0
            text-lg
            border-2 border-gray-900
            dark:border-ternary-light
            py-1.5
            sm:py-3
            rounded-full
            bg-slate-50
            focus:ring-1 focus:ring-blue-900
            hover:bg-blue-400
            text-ternary-dark
            hover:text-white
            duration-500
          "
          aria-label="Download Resume"
        >
          <span class="text-sm sm:text-lg font-general-medium duration-100 underline underline-offset-4 ml-3 dark:text-primary-light"
          >More About Me</span>
          <i
            data-feather="arrow-right"
            class="ml-0 sm:ml-1 mr-2 sm:mr-3 w-5 sm:w-6 duration-100 dark:text-primary-light"
          ></i>
          </NuxtLink>
      </div>
    </div>

    <!-- Banner right illustration -->
    <div class="w-full md:w-2/3 text-right float-right">
      <img
        v-if="this.$colorMode.value === 'dark'"
        src="~/static/main-design.png"
        alt="Developer Dark"
      />
      <img v-else src="~/static/main-design.png" alt="Developer Light" />
    </div>
  </section>
</template>
<script>
import feather from "feather-icons";

export default {
  data: () => {
    return {
      // Todo
    };
  },

  mounted() {
    feather.replace();
  },
  updated() {
    feather.replace();
  },
};
</script>



<style lang="scss" scoped></style>
