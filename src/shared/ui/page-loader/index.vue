<template>
  <div class="loader-container">
    <div class="loader">
      <div class="circle"></div>
      <div class="circle"></div>
      <div class="circle"></div>
      <div class="shadow"></div>
      <div class="shadow"></div>
      <div class="shadow"></div>
    </div>
  </div>
</template>

<style scoped>
.loader-container {
  @apply bg-primary/20 fixed inset-0 z-99999 flex h-screen w-screen items-center justify-center backdrop-blur-sm;
}

.loader {
  position: relative;
  display: flex;
  height: 5rem;
  width: 8rem;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.loader span {
  @apply text-muted-foreground mt-6 text-center text-sm font-medium;
}

.circle {
  position: absolute;
  height: 1.25rem;
  width: 1.25rem;
  border-radius: 9999px;
  background-color: hsl(var(--primary));
  animation: move 0.5s linear infinite;
}

.circle:nth-child(1) {
  top: 0;
  left: 0;
  animation-delay: 0s;
}

.circle:nth-child(2) {
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  animation-delay: 0.1s;
}

.circle:nth-child(3) {
  top: 0;
  right: 0;
  animation-delay: 0.2s;
}

.shadow {
  @apply bg-primary absolute h-1 w-5 rounded-full;
  bottom: -3px;
  transform: scale(0.7);
  z-index: -1;
  filter: blur(1px);
  animation: shadow 0.5s linear infinite;
}

.shadow:nth-child(4) {
  left: 0;
  animation-delay: 0s;
}

.shadow:nth-child(5) {
  left: 50%;
  transform: translateX(-50%) scale(0.7);
  animation-delay: 0.1s;
}

.shadow:nth-child(6) {
  right: 0;
  animation-delay: 0.2s;
}

@keyframes move {
  0%,
  100% {
    top: 0;
  }
  50% {
    top: 15px;
  }
}

@keyframes shadow {
  0%,
  100% {
    transform: scale(1);
    opacity: 0.3;
  }
  50% {
    transform: scale(0.7);
    opacity: 0.7;
  }
}
</style>
