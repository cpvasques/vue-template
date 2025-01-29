<script setup lang="ts">
import LoginForm from '@/components/views/LoginView/LoginForm/index.vue'
import AuthTemplate from '@/layouts/Auth.vue'
</script>

<template>
  <AuthTemplate>
    <Card class="w-full md:w-1/2 h-screen md:min-h-[26rem] md:h-auto bg-white">
      <CardHeader>
        <CardTitle class="text-2xl font-semibold text-black text-center">
          Nome da Plataforma
        </CardTitle>
        <CardDescription class="text-center mt-5"> Descrição da Plataforma </CardDescription>
      </CardHeader>

      <CardContent class="space-y-4">
        <LoginForm />
      </CardContent>
    </Card>
  </AuthTemplate>
</template>
