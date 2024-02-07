<template>
  <div class="flex min-h-screen flex-col">
    <Header @hamburger-click="toggleExpand" />
    <div class="flex min-h-0 flex-grow">
      <Sidebar ref="sidebarRef" />
      <main class="flex-grow px-8 py-4">
        <router-view></router-view>
      </main>
    </div>
  </div>
</template>

<script>
import { ref } from "vue";
import Header from "@/components/organisms/Common/Header.vue";
import Sidebar from "@/components/organisms/Common/Sidebar.vue";

export default {
  name: "MainTemplate",
  components: {
    Header,
    Sidebar,
  },
  setup() {
    const sidebarRef = ref(null);

    const toggleExpand = () => {
      if (sidebarRef.value) {
        sidebarRef.value.toggleExpand();
      }
    };

    return {
      sidebarRef,
      toggleExpand,
    };
  },
};
</script>
