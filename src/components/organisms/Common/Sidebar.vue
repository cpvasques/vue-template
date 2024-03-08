<template>
  <nav :class="sidebarClasses">
    <div class="relative flex-grow pt-12">
      <ul>
        <NavItem
          v-for="route in navItems"
          :key="route.menuLabel"
          :route="route"
          :is-expanded="isExpanded"
          :show-nav="isExpanded || isWebStore.isWeb"
        />
      </ul>

      <ToggleButton
        v-if="isWebStore.isWeb"
        :is-expanded="isExpanded"
        @click="toggleExpand"
      >
        <SidebarArrow />
      </ToggleButton>
    </div>
  </nav>
</template>

<script>
import { ref, computed, onMounted, onUnmounted } from "vue";
import { routes } from "@/router";
import { useIsWebStore } from "@/stores/isWeb";
import SidebarArrow from "@/components/atoms/icons/SidebarArrow.vue";
import NavItem from "@/components/molecules/common/NavItem.vue";
import ToggleButton from "@/components/atoms/inputs/ToggleButton.vue";

export default {
  name: "Sidebar",
  components: {
    SidebarArrow,
    NavItem,
    ToggleButton,
  },
  setup() {
    // DATA
    const isExpanded = ref(false);
    const navItems = ref([]);
    const isWebStore = useIsWebStore();

    // METHODS
    const toggleExpand = () => {
      isExpanded.value = !isExpanded.value;
    };

    // LIFE CYCLE
    onMounted(() => {
      isWebStore.initialize();
      navItems.value = routes[0].children;
    });

    onUnmounted(() => {
      isWebStore.destroy();
    });

    // COMPUTED
    const sidebarClasses = computed(() => ({
      "w-60": isExpanded.value,
      "w-16": isWebStore.isWeb && !isExpanded.value,
      "w-0": !isWebStore.isWeb && !isExpanded.value,
      "w-3/5": !isWebStore.isWeb && isExpanded.value,
      "relative min-h-screen overflow-hidden overflow-visible bg-white shadow-xl transition-all duration-300 ease-in-out": true,
    }));

    return {
      isExpanded,
      navItems,
      toggleExpand,
      sidebarClasses,
      isWebStore,
    };
  },
};
</script>
