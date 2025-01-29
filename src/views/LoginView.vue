<script setup lang="ts">
import LoginForm from '@/components/views/LoginView/LoginForm/index.vue'
import AuthTemplate from '@/layouts/Auth.vue'
</script>

<template>
  <AuthTemplate>
    <Card class="h-screen w-full bg-white md:h-auto md:min-h-[26rem] md:w-1/2">
      <CardHeader>
        <CardTitle class="text-center text-2xl font-semibold text-black">
          Nome da Plataforma
        </CardTitle>
        <CardDescription class="mt-5 text-center"> Descrição da Plataforma </CardDescription>
      </CardHeader>

      <CardContent class="space-y-4">
        <LoginForm />
      </CardContent>
    </Card>
  </AuthTemplate>
</template>
