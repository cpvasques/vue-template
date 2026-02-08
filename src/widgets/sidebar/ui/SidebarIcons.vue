<script setup lang="ts">
import { User, Users } from 'lucide-vue-next'

const props = defineProps<{ navName: string }>()

const iconsMap = {
  Users: Users,
  Profile: User,
}

const iconComponent = computed(
  () => iconsMap[props.navName as keyof typeof iconsMap] || null,
)
</script>

<template>
  <component
    v-if="iconComponent"
    :is="iconComponent"
    class="min-h-4.5 min-w-4.5"
  />
</template>
