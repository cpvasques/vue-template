export default {
  mounted(el, binding) {
    el.clickOutsideEvent = (event) => {
      const mobileHeader =
        event?.target?.parentElement?.className === "header-container__menu";

      const mobileHeaderIcon =
        event?.target?.parentElement?.className?.animVal === "mobile-sidebar";

      if (mobileHeader || mobileHeaderIcon) {
        return;
      }

      if (!(el == event.target || el.contains(event.target))) {
        binding.value(event);
      }
    };
    document.body.addEventListener("click", el.clickOutsideEvent);
  },
  unmounted(el) {
    document.body.removeEventListener("click", el.clickOutsideEvent);
  },
};
