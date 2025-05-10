import { ref, watch } from 'vue'

const isDark = ref(localStorage.theme === 'dark')

watch(isDark, v => {
  document.documentElement.classList.toggle('dark', v)
  localStorage.theme = v ? 'dark' : 'light'
}, { immediate: true })

export function useTheme () {
  return { isDark }
}
