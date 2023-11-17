import { useIsWebStore } from "../stores/isWeb";

export default {
  created() {
    const store = useIsWebStore();
    store.initialize();
  },
  beforeDestroy() {
    const store = useIsWebStore();
    store.destroy();
  },
  computed: {
    isWeb() {
      const store = useIsWebStore();
      return store.isWeb;
    },
  },
};
