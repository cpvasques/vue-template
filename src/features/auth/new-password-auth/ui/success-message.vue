<script setup lang="ts">
import { Button } from '@/shared/components/button'
import { CircleCheckBig } from 'lucide-vue-next'
import { useRouter } from 'vue-router'

const router = useRouter()

const goBack = () => {
  router.push({ name: 'Login' })
}
</script>

<template>
  <div class="w-full sm:px-36 lg:px-60 xl:px-96">
    <CircleCheckBig class="mb-5 text-emerald-500" />
    <h1 class="mb-1 text-left text-2xl font-semibold text-zinc-950">
      Senha alterada com sucesso!
    </h1>
    <p class="mb-6 text-left text-sm text-zinc-500">
      Sua senha foi redefinida. Agora você pode acessar sua conta com a nova
      senha.
    </p>

    <Button class="w-full" type="button" @click="goBack">
      Acessar minha conta
    </Button>
  </div>
</template>
