<template>
  <div
    class="card overflow-hidden rounded-lg border border-gray-300 bg-white shadow-lg"
  >
    <div v-if="$slots.header" class="card-header">
      <slot name="header"></slot>
    </div>
    <div class="card-body">
      <slot name="body"></slot>
    </div>
    <div v-if="$slots.footer" class="card-footer">
      <slot name="footer"></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: "Card",
};
</script>

<style scoped lang="scss">
.card {
  @apply rounded-lg border border-gray-300 bg-white px-4 shadow-lg transition-all;

  min-width: 90%;
  min-height: 491px;

  @media (min-width: 1024px) {
    min-width: 440px;
  }
}
.card-header:first-child {
  @apply rounded-t-lg;
}
.card-footer:last-child {
  @apply rounded-b-lg;
}
</style>
