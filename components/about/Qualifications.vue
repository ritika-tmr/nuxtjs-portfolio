<template>
  <!-- About my qualifications section -->
  <div class="mt-10 sm:mt-20">
    <p
      class="
        font-general-medium
        text-2xl text-center
        sm:text-3xl
        text-primary-dark
        dark:text-primary-light
      "
    >
      Qualifications
    </p>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  data: () => {
    return {
      // @todo
    };
  },
  computed: {
    ...mapState(["clientsHeading", "clients"]),
  },
};
</script>
