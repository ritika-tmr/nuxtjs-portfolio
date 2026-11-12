<template>
  <div class="block sm:flex sm:gap-10 mt-10 sm:mt-20">
    <!-- About profile image -->
    <div class="w-full sm:w-1/4 mb-7 sm:mb-0">
      <img src="/displayPicture.jpg" class="rounded-lg w-96" alt="" />
    </div>

    <!-- About details -->
    <div class="w-full sm:w-3/4 text-left">
      <p
        v-for="bio in aboutMe"
        :key="bio.id"
        class="
          font-general-regular
          mb-4
          text-ternary-dark
          dark:text-ternary-light
          text-lg
        "
      >
        {{ bio.bio }}
      </p>
    </div>
  </div>
</template>
<script>
import { useApp } from "~/composables/useApp";
import { computed } from "vue";

export default {
  data: () => {
    return {
      // @todo
    };
  },
  setup() {
    const { get } = useApp();
    const aboutMe = computed(() => get("aboutMe").value);
    return { aboutMe };
  },
};
</script>


