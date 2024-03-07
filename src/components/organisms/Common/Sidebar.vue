<template>
  <nav
    :class="{
      'w-60': isExpanded,
      'w-16': isWeb && !isExpanded,
      'w-0': !isWeb && !isExpanded,
      'w-3/5': !isWeb && isExpanded,
    }"
    class="relative min-h-screen overflow-hidden overflow-visible bg-white shadow-xl transition-all duration-300 ease-in-out"
  >
    <div class="relative flex-grow pt-12">
      <ul>
        <li v-for="route in navItems" :key="route.menuLabel" class="group">
          <router-link
            v-show="isWeb || isExpanded"
            :to="route.path"
            class="flex h-12 items-center rounded-br rounded-tr pl-4 text-gray-800 transition-all duration-200 hover:bg-gray-200"
            :class="{
              'justify-between': isExpanded,
            }"
            exact-active-class="bg-blue-500 text-white"
          >
            <span class="text-lg">
              <SidebarIcons :nav-name="route.name" />
            </span>
            <span v-if="isExpanded" class="ml-4 flex-1">
              {{ route.menuLabel }}
            </span>
          </router-link>
        </li>
      </ul>

      <button
        v-if="isWeb"
        class="absolute -right-3 top-0 mt-2 transition-transform duration-300"
        :class="{ 'rotate-180': isExpanded }"
        @click="toggleExpand"
      >
        <SidebarArrow />
      </button>
    </div>
  </nav>
</template>

<script>
import { ref, onMounted } from "vue";
import { routes } from "@/router";
import isWebMixin from "@/mixins/isWebMixin";
import SidebarArrow from "@/components/atoms/icons/SidebarArrow.vue";
import SidebarIcons from "@/components/molecules/SidebarIcons.vue";

export default {
  components: {
    SidebarArrow,
    SidebarIcons,
  },
  mixins: [isWebMixin],
  setup() {
    const isExpanded = ref(false);
    const navItems = ref([]);

    onMounted(() => {
      navItems.value = routes[0].children;
    });

    const toggleExpand = () => {
      isExpanded.value = !isExpanded.value;
    };

    return {
      isExpanded,
      navItems,
      toggleExpand,
    };
  },
};
</script>
