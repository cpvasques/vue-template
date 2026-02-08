import { defineStore } from 'pinia'
import { useRoute } from 'vue-router'

export const useThemeStore = defineStore(
  'theme',
  () => {
    const route = useRoute()
    const storedTheme =
      localStorage.getItem('vueuse-color-scheme') ||
      sessionStorage.getItem('vueuse-color-scheme')

    const isDarkMode = ref(
      document.documentElement.classList.contains('dark') ||
        storedTheme === 'dark',
    )

    const getTheme = () => isDarkMode.value

    const toggleTheme = () => {
      const newMode = !isDarkMode.value
      document.documentElement.classList.toggle('dark', newMode)
      isDarkMode.value = newMode
    }

    const initDarkMode = () => {
      isDarkMode.value = document.documentElement.classList.contains('dark')

      const observer = new MutationObserver(() => {
        isDarkMode.value = document.documentElement.classList.contains('dark')
      })

      observer.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ['class'],
      })

      watch(
        () => route.name,
        (routeName) => {
          if (routeName === 'Login') {
            document.documentElement.classList.remove('dark')
            isDarkMode.value = false
          }
        },
        { immediate: true },
      )
    }

    onMounted(() => {
      initDarkMode()
    })

    return { isDarkMode, getTheme, toggleTheme, initDarkMode }
  },
  {
    persist: {
      storage: sessionStorage,
    },
  },
)
