<template>
  <div id="spinner"></div>
</template>

<style scoped>
@reference "tailwindcss";

#spinner {
  @apply fixed inset-0 z-[99999] h-screen w-screen bg-black/10;
  &::after {
    content: '';
    @apply absolute inset-0 z-40 m-auto size-14 animate-spin rounded-full border-8 border-black/10 border-l-[#315ca7];
  }
}
</style>
