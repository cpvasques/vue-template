<template>
  <div class="structure">
    <!-- sidebar components -->
    <Sidebar
      v-if="isWeb"
      :is-open="openWebSidebar"
      @handleWebSidebar="handleWebSidebar"
    />
    <MobileSidebar
      v-else
      :is-open="openWebSidebar"
      @handleMobileSidebar="handleMobileSidebar"
    />

    <!-- content -->
    <div class="structure__page">
      <Header v-if="isWeb" @handleWebSidebar="handleWebSidebar" />
      <MobileHeader
        v-else
        :is-open="openWebSidebar"
        @handleMobileSidebar="handleMobileSidebar"
      />

      <!-- mobile menu overlay -->
      <div v-if="!isWeb && openWebSidebar" class="structure__overlay"></div>

      <div
        id="structure__holder"
        class="structure__holder"
        :class="[{ 'extra-padding': openWebSidebar }]"
      >
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>

<script>
// web structure
import Sidebar from "@/components/shared/Sidebar/Sidebar.vue";
import Header from "@/components/shared/Header/Header.vue";

// mobile strucutre
import MobileSidebar from "@/components/shared/MobileSidebar/MobileSidebar.vue";
import MobileHeader from "@/components/shared/MobileHeader/MobileHeader.vue";

import isWebMixin from "@/mixins/isWebMixin";

export default {
  name: "Structure",
  components: { Sidebar, Header, MobileSidebar, MobileHeader },
  mixins: [isWebMixin],
  data: () => ({
    openWebSidebar: true,
  }),
  watch: {
    $route: {
      handler() {
        this.handleWebSidebar(true);
      },
      deep: true,
      immediate: true,
    },
  },
  methods: {
    handleMobileSidebar(handleStatus) {
      this.openWebSidebar = handleStatus;
    },
    handleWebSidebar(byRoute) {
      if (byRoute) {
        return (this.openWebSidebar = false);
      }

      this.openWebSidebar = !this.openWebSidebar;
    },
  },
};
</script>
<style lang="scss">
@import "Structure.scss";
</style>
