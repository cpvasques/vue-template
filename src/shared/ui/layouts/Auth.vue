<script setup lang="ts">
import { ChevronLeft } from 'lucide-vue-next'

import { Button } from '@/shared/components/button'
import AppLogo from '@/shared/ui/icons/AppLogo.vue'

const router = useRouter()
const route = useRoute()

const isLoginRoute = computed(() => route.name === 'Login')
const showLogo = ref(false)
const previousRoute = ref(route.name)
const isInitialLoad = ref(true)

watch(
  () => route.name,
  (newRouteName, oldRouteName) => {
    previousRoute.value = oldRouteName

    if (oldRouteName) {
      isInitialLoad.value = false
    }

    showLogo.value = false

    if (newRouteName === 'Login') {
      nextTick(() => (showLogo.value = true))
    }
  },
  { immediate: true },
)

const logoTransitionClass = computed(() => {
  return isInitialLoad.value ? 'fade-delayed-initial' : 'fade-delayed'
})

const goBack = () => {
  router.push({ name: 'Login' })
}
</script>

<template>
  <div class="flex min-h-screen">
    <div
      class="hidden bg-cover bg-center sm:block! sm:w-1/2!"
      style="background-image: url('/auth_bg.png')"
    >
      <slot name="left-side"></slot>
    </div>

    <div
      class="bg-background flex w-full flex-col items-center justify-center p-8 sm:w-1/2!"
    >
      <div class="mb-8 w-full">
        <Transition name="fade" mode="out-in">
          <div
            v-if="!isLoginRoute"
            key="back-button"
            class="absolute top-8 sm:left-[calc(50%+32px)]"
          >
            <Button class="h-10 w-10" variant="outline" @click="goBack">
              <ChevronLeft class="h-4 w-4" />
            </Button>
          </div>
        </Transition>

        <div class="relative mb-12 h-12">
          <Transition :name="logoTransitionClass">
            <div v-if="showLogo" class="absolute inset-0 flex justify-center">
              <div class="flex items-center">
                <AppLogo />
              </div>
            </div>
          </Transition>
        </div>

        <router-view v-slot="{ Component }">
          <Transition name="page" mode="out-in">
            <component :is="Component" />
          </Transition>
        </router-view>
      </div>
    </div>
  </div>
</template>

<style scoped>
.page-enter-active,
.page-leave-active {
  transition: opacity 0.2s ease;
}

.page-enter-from,
.page-leave-to {
  opacity: 0;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.fade-delayed-enter-active {
  transition: opacity 0.3s ease;
  transition-delay: 0.3s;
}

.fade-delayed-leave-active {
  transition: opacity 0.2s ease;
}

.fade-delayed-enter-from,
.fade-delayed-leave-to {
  opacity: 0;
}

.fade-delayed-initial-enter-active {
  transition: opacity 0.3s ease;
  transition-delay: 0s;
}

.fade-delayed-initial-leave-active {
  transition: opacity 0.2s ease;
}

.fade-delayed-initial-enter-from,
.fade-delayed-initial-leave-to {
  opacity: 0;
}
</style>
