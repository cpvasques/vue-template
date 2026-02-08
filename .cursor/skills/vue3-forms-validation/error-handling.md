# Tratamento de Erros em Formulários

Padrões específicos de formulários. **Para error handling geral (composables, APIs, toast)**, consulte a rule `.cursor/rules/error-handling.md`.

## Tipos de Erros em Formulários

### Erros de Validação (Zod) → Inline

**Exibição:** `FormMessage` + `:has-error` no input

```vue
<FormField v-slot="{ componentField, errors }" name="email">
  <FormItem>
    <FormLabel>Email</FormLabel>
    <FormControl>
      <Input
        v-bind="componentField"
        :has-error="!!errors.length"
      />
    </FormControl>
    <FormMessage /> <!-- Exibe erros de validação -->
  </FormItem>
</FormField>
```

### Erros de Submit → Toast

**Exibição:** Toast com `vue-sonner`. O tratamento de erros de API é feito nos composables (ver `error-handling.md`). No submit, apenas validação e onSuccess/onError:

```typescript
const onSubmit = async (values: FormData) => {
  const { valid } = await validate()
  if (!valid) {
    return toast.error('Preencha os campos corretamente')
  }

  mutate(payload, {
    onSuccess: () => toast.success('Formulário enviado com sucesso'),
    // onError: já tratado no composable via .catch()
  })
}
```

## Validação Antes de Submit

**Padrão obrigatório:** Sempre validar antes de submeter para evitar requisições desnecessárias.

```typescript
const onSubmit = async (values: FormData) => {
  const { valid } = await validate()
  if (!valid) return toast.error('Preencha os campos corretamente')

  const payload = { field1: values.field1 || '', field2: values.field2 || '' }
  mutate(payload, { onSuccess: () => { /* ... */ } })
}
```

## Validação em Tempo Real vs On Submit

| Modo | Config | Quando usar |
|------|--------|-------------|
| **On Submit** (padrão) | `validateOnMount: false` | Maioria dos formulários |
| **Tempo real** | `validateOnBlur: true`, `validateOnChange: true` | Formulários complexos, feedback imediato |

## Feedback Visual

- **Erro de campo:** `:has-error="!!errors.length"` + `<FormMessage />`
- **Loading:** `:is-loading="isPending"` no Button

## Recursos

- **Error handling geral:** `.cursor/rules/error-handling.md`
- [VeeValidate Error Handling](https://vee-validate.logaretm.com/v4/guide/error-handling)
