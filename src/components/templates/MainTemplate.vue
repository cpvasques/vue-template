<template>
  <div class="flex min-h-screen flex-col">
    <Header @hamburger-click="toggleExpand" />
    <div class="flex min-h-0 flex-grow">
      <Sidebar ref="sidebar" />
      <main class="flex-grow px-8 py-4">
        <router-view></router-view>
      </main>
    </div>
  </div>
</template>

<script>
import Header from "@/components/organisms/Common/Header.vue";
import Sidebar from "@/components/organisms/Common/Sidebar.vue";

export default {
  name: "MainTemplate",
  components: {
    Header,
    Sidebar,
  },
  methods: {
    toggleExpand() {
      this.$refs.sidebar.toggleExpand();
    },
  },
};
</script>
