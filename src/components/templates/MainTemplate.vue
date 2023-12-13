<template>
  <div class="min-h-screen flex flex-col">
    <Header @hamburger-click="toggleExpand" />
    <div class="flex flex-grow min-h-0">
      <Sidebar ref="sidebar" />
      <main class="flex-grow py-4 px-8">
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
