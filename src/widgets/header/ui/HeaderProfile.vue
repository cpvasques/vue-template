<script setup lang="ts">
import { Avatar } from '@/shared/components/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/shared/components/dropdown-menu'
import { ChevronDown, LogOut, Moon, Sun, User } from 'lucide-vue-next'

import router from '@/app/providers/router'
import { useAuthStore } from '@/features/auth/store/auth'
import { useThemeStore } from '@/shared/store/theme'

const authStore = useAuthStore()
const themeStore = useThemeStore()
const isDropdownOpen = ref(false)
const themeLabel = computed(() =>
  themeStore.isDarkMode ? 'Tema escuro' : 'Tema claro',
)

const handleProfileClick = () => {
  router.push({ name: 'Profile' })
}

const handleThemeToggle = (event: Event) => {
  event.preventDefault()
  themeStore.toggleTheme()
}

const logout = () => {
  authStore.clearProfile()
  authStore.clearToken()
  router.push({ name: 'Login' })
}
</script>

<template>
  <div class="hidden items-center gap-2 sm:flex">
    <DropdownMenu v-model:open="isDropdownOpen">
      <DropdownMenuTrigger as-child>
        <button
          type="button"
          class="focus-visible:ring-ring flex cursor-pointer items-center gap-2 rounded-md transition-opacity outline-none hover:opacity-90 focus-visible:ring-2 focus-visible:ring-offset-2"
        >
          <Avatar>
            <img
              src="http://placehold.co/100x100"
              alt="Perfil"
              class="h-10 w-10 rounded-full"
            />
          </Avatar>
          <div class="hidden flex-col items-start sm:flex">
            <span class="text-sm font-semibold">Usuário</span>
            <span class="text-xs text-gray-600 dark:text-gray-400">ADM</span>
          </div>
          <ChevronDown
            class="h-4 w-4 shrink-0 transition-transform duration-200"
            :class="{ 'rotate-180': isDropdownOpen }"
          />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuGroup>
          <DropdownMenuItem @click.prevent="handleProfileClick">
            <User class="mr-2 h-4 w-4 shrink-0" />
            <span>Meu perfil</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem @select="handleThemeToggle">
            <Moon v-if="themeStore.isDarkMode" class="mr-2 h-4 w-4 shrink-0" />
            <Sun v-else class="mr-2 h-4 w-4 shrink-0" />
            <span>{{ themeLabel }}</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem @click.prevent="logout">
            <LogOut class="mr-2 h-4 w-4 shrink-0" />
            <span>Logout</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  </div>
</template>
