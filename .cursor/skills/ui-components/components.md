# Componentes UI do Projeto

Catálogo de componentes disponíveis em `src/shared/components/` para referência da IA. Baseados em **shadcn-vue** e **Reka UI**.

## 📋 Objetivo deste Documento

Este documento serve como **referência** dos componentes UI do projeto. A IA deve usar este documento para:

1. **Saber quais componentes estão disponíveis** antes de criar componentes custom
2. **Escolher o componente correto** para cada necessidade
3. **Entender padrões** de uso e importação

---

## 📚 Documentação Oficial

- **shadcn-vue:** https://www.shadcn-vue.com/docs/components
- **Reka UI:** https://reka-ui.com/

---

## 📦 Componentes Disponíveis

### Formulários
- `Button` - `@/shared/components/button`
- `Input` - `@/shared/components/input`
- `InputPassword` - `@/shared/components/input-password`
- `Textarea` - `@/shared/components/textarea`
- `Checkbox` - `@/shared/components/checkbox`
- `RadioGroup` - `@/shared/components/radio-group`
- `Switch` - `@/shared/components/switch`
- `Select` + subcomponentes - `@/shared/components/select`
- `Form` (FormField, FormItem, FormLabel, FormControl, FormMessage) - `@/shared/components/form`
- `PinInput` + `PinInputInput` - `@/shared/components/pin-input`
- `NumberField` - `@/shared/components/number-field`
- `TagsInput` - `@/shared/components/tags-input`
- `DatePicker` - `@/shared/components/date-picker`
- `RangeDatePicker` - `@/shared/components/range-date-picker`
- `MonthPicker` - `@/shared/components/month-picker`
- `FileInput` / `InputFile` - `@/shared/components/input-file` ou `@/shared/components/file-input`

### Interface
- `Badge` - `@/shared/components/badge`
- `Avatar` - `@/shared/components/avatar`
- `Card` - `@/shared/components/card`
- `Alert` - `@/shared/components/alert`
- `Skeleton` - `@/shared/components/skeleton`
- `DataTable` - `@/shared/components/data-table`
- `Pagination` - `@/shared/components/pagination`
- `Progress` - `@/shared/components/progress`
- `Separator` - `@/shared/components/separator`
- `ThemeToggle` - `@/shared/components/theme-toggle`

### Overlays e Modais
- `Dialog` - `@/shared/components/dialog`
- `AlertDialog` - `@/shared/components/alert-dialog`
- `Sheet` - `@/shared/components/sheet`
- `Drawer` - `@/shared/components/drawer`
- `Popover` - `@/shared/components/popover`
- `Tooltip` - `@/shared/components/tooltip`
- `HoverCard` - `@/shared/components/hover-card`

### Menu e Navegação
- `DropdownMenu` - `@/shared/components/dropdown-menu`
- `ContextMenu` - `@/shared/components/context-menu`
- `Menubar` - `@/shared/components/menubar`
- `NavigationMenu` - `@/shared/components/navigation-menu`
- `Breadcrumb` - `@/shared/components/breadcrumb`
- `Command` - `@/shared/components/command`
- `Combobox` / `Autocomplete` - `@/shared/components/autocomplete` ou `@/shared/components/command`
- `MultiSelect` - `@/shared/components/multi-select`

### Layout e Estrutura
- `Accordion` - `@/shared/components/accordion`
- `Collapsible` - `@/shared/components/collapsible`
- `Tabs` - `@/shared/components/tabs`
- `ScrollArea` - `@/shared/components/scroll-area`
- `Resizable` - `@/shared/components/resizable`
- `Carousel` - `@/shared/components/carousel`
- `Sidebar` - `@/shared/components/collapsible-sidebar`
- `Stepper` - `@/shared/components/stepper`

### Notificações
- `Toast` / `Sonner` - `@/shared/components/sonner` ou `@/shared/components/toast`

### Outros
- `Calendar` - `@/shared/components/calendar`
- `RangeCalendar` - `@/shared/components/range-calendar`
- `Slider` - `@/shared/components/slider`
- `Toggle` / `ToggleGroup` - `@/shared/components/toggle` ou `@/shared/components/toggle-group`

---

## 📝 Padrão de Importação

```typescript
// Form (FormField vem do vee-validate via form/index.ts)
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/shared/components/form'

// Inputs e Button
import { Button } from '@/shared/components/button'
import { Input } from '@/shared/components/input'
import { InputPassword } from '@/shared/components/input-password'
```

---

## 🔧 Exemplo com FormField e VeeValidate

```vue
<FormField v-slot="{ componentField, errors }" name="email">
  <FormItem>
    <FormLabel>Email</FormLabel>
    <FormControl>
      <Input
        placeholder="m@example.com"
        v-bind="componentField"
        :has-error="!!errors.length"
      />
    </FormControl>
    <FormMessage />
  </FormItem>
</FormField>
```

---

## ✅ Checklist para IA

Ao precisar de um componente:

- [ ] Verificar se está listado neste documento ou na [documentação shadcn-vue](https://www.shadcn-vue.com/docs/components)
- [ ] Importar de `@/shared/components/[nome-componente]`
- [ ] Se não existir, verificar Reka UI para primitivos ou criar custom
- [ ] Usar `componentField` com VeeValidate quando aplicável
- [ ] Passar `:has-error` para feedback visual em inputs
