<template>
  <ControlPanel v-if="navName == 'Home'" class="min-h-4.5 min-w-4.5" />
</template>

<script>
import ControlPanel from "@/components/atoms/icons/sidebar/ControlPanel.vue";

export default {
  name: "SidebarIcons",
  components: {
    ControlPanel,
  },
  props: {
    navName: {
      type: String,
      default: null,
    },
    isActive: {
      type: String,
      default: null,
    },
  },
};
</script>
