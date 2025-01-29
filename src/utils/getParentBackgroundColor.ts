import type { Ref } from 'vue'

export function getParentBackgroundColor(ref: Ref) {
  const inputElement = ref?.value
  if (!inputElement?.parentElement) return ''

  let currentElement = inputElement.parentElement
  let colorFound

  while (currentElement) {
    const style = getComputedStyle(currentElement)
    colorFound = style.backgroundColor

    if (colorFound && colorFound !== 'rgba(0, 0, 0, 0)') {
      break
    }

    currentElement = currentElement.parentElement
  }

  if (!currentElement) return ''

  return getComputedStyle(currentElement)?.backgroundColor
}
