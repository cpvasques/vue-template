# Padrões de Uso dos Componentes UI

Padrões e práticas recomendadas para usar os componentes do projeto (shadcn-vue + Reka UI).

## Padrão de Uso em Formulários

**Referência principal:** `.cursor/skills/vue3-forms-validation/form-patterns.md`

Estrutura: `FormField` → `FormItem` → `FormLabel` → `FormControl` → `Input`/`InputPassword`/`Select` → `FormMessage`. Sempre usar `v-bind="componentField"` e `:has-error="!!errors.length"`.

## Importação Padrão

```typescript
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/shared/components/form'
import { Button } from '@/shared/components/button'
import { Input } from '@/shared/components/input'
import { InputPassword } from '@/shared/components/input-password'
```

## Padrão: Formulário em Dialog

```vue
<template>
  <Dialog v-model:open="isDialogOpen">
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Título</DialogTitle>
      </DialogHeader>

      <form @submit.prevent="submitForm">
        <FormField v-slot="{ componentField, errors }" name="field">
          <FormItem>
            <FormLabel>Campo</FormLabel>
            <FormControl>
              <Input v-bind="componentField" :has-error="!!errors.length" />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>

        <DialogFooter>
          <Button variant="outline" @click="handleCloseDialog">Cancelar</Button>
          <Button type="submit">Salvar</Button>
        </DialogFooter>
      </form>
    </DialogContent>
  </Dialog>
</template>
```

## Padrão: Tabela com Ações

```vue
<template>
  <DataTable :columns="columns" :data="data">
    <template #status="{ item }">
      <Badge :variant="item.status === 'active' ? 'success' : 'destructive'">
        {{ item.status === 'active' ? 'Ativo' : 'Inativo' }}
      </Badge>
    </template>

    <template #actions="{ item }">
      <div class="flex items-center justify-end gap-2">
        <Button variant="ghost" @click="handleEdit(item)">Editar</Button>
        <Button variant="destructive" @click="handleDelete(item)">Excluir</Button>
      </div>
    </template>
  </DataTable>
</template>
```

## Variantes de Button

- `default` - Ação principal
- `outline` - Ação secundária
- `ghost` - Ação terciária ou ícone
- `destructive` - Ação destrutiva (excluir, remover)

## Variantes de Badge

- `success` - Status positivo (ativo, aprovado)
- `destructive` - Status negativo (inativo, rejeitado)
- `default` - Status neutro

## Documentação Oficial

- [shadcn-vue Components](https://www.shadcn-vue.com/docs/components) - Props e exemplos
- [Reka UI](https://reka-ui.com/) - Comportamento dos primitivos
