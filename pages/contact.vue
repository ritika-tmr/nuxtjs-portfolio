<template>
  <div
    class="
      container
      mx-auto
      flex flex-col-reverse
      md:flex-row md:py-10 md:mt-20
    "
  >
    <!-- Contact form -->
<!--    <ContactForm />-->

    <!-- Contact details -->
    <ContactDetails :contacts="contacts" />
  </div>
</template>
<script>
import feather from "feather-icons";

export default {
  scrollToTop: true,
  data: () => {
    return {
      contacts: [
        {
          id: 1,
          name: "Sydney, NSW, Australia",
          icon: "map-pin",
        },
        {
          id: 2,
          name: "ritika.tamrakar@outlook.com",
          icon: "mail",
        },
        {
          id: 3,
          name: "https://www.linkedin.com/in/ritika-tamrakar/",
          icon: "linkedin",
        }
      ],
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


