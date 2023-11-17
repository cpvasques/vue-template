import { defineStore } from "pinia";

export const useIsWebStore = defineStore({
  id: "isWebStore",
  state: () => ({
    windowWidth: window.innerWidth,
  }),
  getters: {
    isWeb: (state) => {
      return state.windowWidth > 992;
    },
  },
  actions: {
    setWindowWidth(width) {
      this.windowWidth = width;
    },
    initialize() {
      window.addEventListener("resize", this.updateWindowWidth);
    },
    updateWindowWidth() {
      this.setWindowWidth(window.innerWidth);
    },
    destroy() {
      window.removeEventListener("resize", this.updateWindowWidth);
    },
  },
});
