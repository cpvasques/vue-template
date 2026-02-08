<script setup lang="ts">
import { Check, ChevronDown, X } from 'lucide-vue-next'
import {
  ListboxContent,
  ListboxFilter,
  ListboxItem,
  ListboxItemIndicator,
  ListboxRoot,
  ListboxVirtualizer,
  PopoverAnchor,
  PopoverArrow,
  PopoverClose,
  PopoverContent,
  PopoverPortal,
  PopoverRoot,
  PopoverTrigger,
  TagsInputInput,
  TagsInputItem,
  TagsInputItemDelete,
  TagsInputItemText,
  TagsInputRoot,
} from 'reka-ui'
import type { HTMLAttributes } from 'vue'

import { cn } from '@/lib/utils'

interface Props<T extends Record<string, any>> {
  class?: HTMLAttributes['class']
  items: T[]
  defaultValue?: T[]
  modelValue?: T[]
  placeholder?: string
  disabled?: boolean
  hasError?: boolean
  itemLabel?: (item: T) => string
  itemKey?: (item: T) => number | string
}

const props = withDefaults(defineProps<Props<any>>(), {
  modelValue: () => [],
  placeholder: 'Selecione itens...',
  itemLabel: (item: any) => item?.name ?? String(item),
  itemKey: (item: any) => item?.id ?? String(item),
})

const emits = defineEmits(['update:modelValue', 'select'])

const modelValue = useVModel(props, 'modelValue', emits, {
  passive: true,
  defaultValue: props.defaultValue,
})

const searchTerm = ref('')
const isOpen = ref(false)

/**
 * Filtra a listagem com base no searchTerm
 */
const filteredItems = computed(() => {
  if (!searchTerm.value) {
    return props.items
  }
  return props.items.filter((item) =>
    props
      .itemLabel(item)
      .toLowerCase()
      .includes(searchTerm.value.toLowerCase()),
  )
})

/**
 * Função para remover uma tag (item) da v-model.
 */
function removeTag(item: any) {
  const index = modelValue.value.findIndex(
    (i: any) => props.itemKey(i) === props.itemKey(item),
  )
  if (index !== -1) {
    modelValue.value.splice(index, 1)
  }
}

/**
 * Sempre que searchTerm mudar, abre o Popover
 */
watch(searchTerm, (term) => {
  if (term) {
    isOpen.value = true
  }
})

/**
 * Após fechar a lista, limpa a busca.
 */
watch(isOpen, () => {
  if (!isOpen.value) {
    searchTerm.value = ''
  }
})
</script>

<template>
  <PopoverRoot v-model:open="isOpen">
    <ListboxRoot
      :class="
        cn(
          props.class,
          props.disabled && 'pointer-events-none cursor-not-allowed opacity-50',
        )
      "
      v-model="modelValue"
      multiple
    >
      <PopoverAnchor
        class="inline-flex w-full items-center justify-between gap-[5px] rounded-lg border bg-background p-2 text-[13px] leading-none text-primary outline-none data-placeholder:text-primary"
        :class="cn(props.class, props.hasError && 'border-red-700')"
      >
        <PopoverTrigger class="order-last" tabindex="-1">
          <ChevronDown class="h-4 w-4 text-primary" />
        </PopoverTrigger>

        <TagsInputRoot
          v-slot="{ modelValue: tags }"
          v-model="modelValue"
          delimiter=""
          class="flex w-full flex-wrap items-center gap-2 rounded-lg"
        >
          <TagsInputItem
            v-for="item in tags"
            :key="itemKey(item)"
            :value="item"
            class="flex items-center justify-center gap-2 rounded border bg-background p-1 text-primary"
          >
            <template v-if="$slots.customTag">
              <slot
                name="customTag"
                :item="item"
                :itemLabel="itemLabel"
                :onDelete="() => removeTag(item)"
              />
            </template>
            <template v-else>
              <TagsInputItemText class="pl-1 text-sm">
                {{ itemLabel(item) }}
              </TagsInputItemText>
              <TagsInputItemDelete
                class="rounded bg-transparent p-0.5 hover:bg-secondary"
              >
                <X />
              </TagsInputItemDelete>
            </template>
          </TagsInputItem>

          <ListboxFilter v-model="searchTerm" as-child>
            <TagsInputInput
              :placeholder="placeholder"
              class="placeholder:text-mauve10 flex-1 rounded bg-background! px-1 focus:outline-none"
              @keydown.enter.prevent
            />
          </ListboxFilter>
        </TagsInputRoot>
      </PopoverAnchor>

      <PopoverPortal>
        <PopoverContent
          @openAutoFocus.prevent
          side="bottom"
          :side-offset="5"
          class="data-[state=open]:data-[side=top]:animate-slideDownAndFade data-[state=open]:data-[side=right]:animate-slideLeftAndFade data-[state=open]:data-[side=bottom]:animate-slideUpAndFade data-[state=open]:data-[side=left]:animate-slideRightAndFade w-(--reka-popper-anchor-width) rounded border bg-background p-5 pr-8 will-change-[transform,opacity]"
        >
          <ListboxContent class="h-64 w-full overflow-auto">
            <ListboxVirtualizer
              v-slot="{ option }"
              :options="filteredItems"
              :text-content="(opt) => itemLabel(opt)"
            >
              <ListboxItem
                :value="option"
                :key="itemKey(option)"
                class="relative flex h-[25px] w-full select-none items-center rounded px-[25px] text-[13px] leading-none text-primary outline-none hover:bg-secondary data-[state=checked]:bg-secondary data-[state=checked]:text-primary data-disabled:opacity-50"
              >
                <template v-if="$slots.customList">
                  <slot
                    name="customList"
                    :option="option"
                    :itemLabel="itemLabel"
                    :itemKey="itemKey"
                  />
                </template>
                <template v-else>
                  <ListboxItemIndicator
                    class="absolute left-0 inline-flex w-[25px] items-center justify-center"
                  >
                    <Check />
                  </ListboxItemIndicator>
                  <span>{{ itemLabel(option) }}</span>
                </template>
              </ListboxItem>
            </ListboxVirtualizer>
          </ListboxContent>

          <PopoverClose
            class="absolute right-[5px] top-[5px] inline-flex h-[25px] w-[25px] cursor-pointer items-center justify-center text-primary outline-none hover:bg-secondary"
            aria-label="Close"
          >
            <X />
          </PopoverClose>
          <PopoverArrow class="fill-primary" />
        </PopoverContent>
      </PopoverPortal>
    </ListboxRoot>
  </PopoverRoot>
</template>
