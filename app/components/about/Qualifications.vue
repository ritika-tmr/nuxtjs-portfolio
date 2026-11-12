<template>
  <!-- About my qualifications section -->
  <section class="container mx-auto mt-10 sm:mt-20 mb-10 sm:mb-20">
    <p
      class="
        font-general-medium
        text-2xl text-center
        sm:text-3xl
        text-primary-dark
        dark:text-primary-light
        mb-10
      "
    >
      Qualifications
    </p>

    <!-- Education -->
    <p
      class="
        font-general-medium
        text-xl
        text-primary-dark
        dark:text-primary-light
        mb-5
      "
    >
      Education
    </p>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
      <div
        v-for="qualification in qualifications"
        :key="qualification.id"
        class="
          flex
          gap-4
          p-6
          rounded-xl
          shadow-sm
          bg-primary-light
          dark:bg-ternary-dark
        "
      >
        <i
          data-feather="book-open"
          class="w-6 h-6 flex-shrink-0 mt-1 text-blue-500 dark:text-blue-400"
        ></i>
        <div class="text-left">
          <p
            class="
              font-general-medium
              text-lg
              text-primary-dark
              dark:text-primary-light
            "
          >
            {{ qualification.course }}
          </p>
          <p
            class="font-general-regular text-ternary-dark dark:text-ternary-light"
          >
            Major: {{ qualification.major }}
          </p>
          <p
            class="
              font-general-regular
              mt-2
              text-sm
              text-ternary-dark
              dark:text-ternary-light
            "
          >
            {{ qualification.institution }} · {{ qualification.location }}
          </p>
        </div>
      </div>
    </div>

    <!-- Awards -->
    <p
      class="
        font-general-medium
        text-xl
        text-primary-dark
        dark:text-primary-light
        mb-5
      "
    >
      Awards
    </p>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div
        v-for="award in awards"
        :key="award.id"
        class="
          flex
          gap-4
          p-6
          rounded-xl
          shadow-sm
          bg-primary-light
          dark:bg-ternary-dark
        "
      >
        <i
          data-feather="award"
          class="w-6 h-6 flex-shrink-0 mt-1 text-blue-500 dark:text-blue-400"
        ></i>
        <div class="text-left">
          <p
            class="
              font-general-medium
              text-lg
              text-primary-dark
              dark:text-primary-light
            "
          >
            {{ award.title }}
          </p>
          <p
            class="font-general-regular text-ternary-dark dark:text-ternary-light"
          >
            {{ award.description }}
          </p>
          <p
            class="
              font-general-regular
              mt-2
              text-sm
              text-ternary-dark
              dark:text-ternary-light
            "
          >
            {{ award.institution }}<template v-if="award.date"> · {{ award.date }}</template>
          </p>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import { useApp } from "~/composables/useApp";

export default {
  setup() {
    const { get } = useApp();
    const qualifications = get("qualifications");
    const awards = get("awards");
    return { qualifications, awards };
  },
};
</script>
