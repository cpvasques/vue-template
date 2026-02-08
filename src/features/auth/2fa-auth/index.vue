<script setup lang="ts">
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/shared/components/form'
import { Button } from '@/shared/components/button'
import { PinInput, PinInputInput } from '@/shared/components/pin-input'
import { MailWarning } from 'lucide-vue-next'
import { useForm } from 'vee-validate'
import { useRouter } from 'vue-router'
import { toast } from 'vue-sonner'

import { twoFactorSchema } from '@/features/auth/2fa-auth/model/twoFactorSchema'
import { use2FA } from '@/features/auth/2fa-auth/model/use2FA'
import type { Payload as ResendPayload } from '@/shared/api/auth-api/types/postResendCode.types'
import type { Payload as TwoFactorPayload } from '@/shared/api/auth-api/types/postTwoFactor.types'

const router = useRouter()
const { postTwoFactorAuth, postResendCode } = use2FA()
const { mutate: postTwoFactorMutate, isPending: isLoadingTwoFactor } =
  postTwoFactorAuth()

const { mutate: resendCodeMutate, isPending: isLoadingResend } =
  postResendCode()

const pinValue = ref<string[]>(Array(6).fill(''))
const resendTimer = ref(0)
const timerInterval = ref<number | null>(null)

const { handleSubmit, validate, setFieldValue } = useForm({
  validationSchema: twoFactorSchema,
  validateOnMount: false,
})

const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins.toString().padStart(1, '0')}:${secs.toString().padStart(2, '0')}`
}

const startTimer = () => {
  resendTimer.value = 60

  if (timerInterval.value) {
    clearInterval(timerInterval.value)
  }

  timerInterval.value = setInterval(() => {
    if (resendTimer.value > 0) {
      resendTimer.value--
    } else {
      if (timerInterval.value) {
        clearInterval(timerInterval.value)
        timerInterval.value = null
      }
    }
  }, 1000) as unknown as number
}

const handleResendCode = () => {
  const resendPayload: ResendPayload = {
    // Exemplo: pode ser necessário passar o email ou token atual
    // email: 'example@email.com'
  }
  startTimer()

  resendCodeMutate(resendPayload, {
    onSuccess: (res) => {
      if (!res) return
      toast.success('Código reenviado com sucesso!')
    },
  })
}

const handleComplete = (value: string[]) => {
  const token = value.join('')
  setFieldValue('token', token)
}

const onSubmit = async (values: TwoFactorPayload) => {
  const { valid } = await validate()
  if (!valid) return toast.error('Preencha os campos corretamente')

  const recoverPayload: TwoFactorPayload = {
    token: values.token || '',
  }

  postTwoFactorMutate(recoverPayload, {
    onSuccess(res) {
      if (!res) return
      router.push({ name: 'Users' })
    },
  })
}

onUnmounted(() => {
  if (timerInterval.value) {
    clearInterval(timerInterval.value)
    timerInterval.value = null
  }
})

const submitForm = handleSubmit(onSubmit)
</script>

<template>
  <div class="w-full sm:px-36 lg:px-60 xl:px-96">
    <MailWarning class="mb-5" />
    <h1 class="text-foreground mb-1 text-left text-2xl font-semibold">
      Código de verificação
    </h1>
    <p class="text-muted-foreground mb-6 text-left text-sm">
      Digite o código abaixo para criar uma nova senha.
    </p>

    <form @submit.prevent="submitForm" class="space-y-4">
      <FormField v-slot="{ errors }" name="token">
        <FormItem>
          <FormControl>
            <PinInput
              id="pin1"
              v-model="pinValue"
              class="mt-1 flex items-center gap-2"
              @complete="handleComplete"
            >
              <PinInputInput
                v-for="(_, index) in 6"
                :key="index"
                :index="index"
                :name="`pin-${index}`"
                class="bg-background text-foreground outline-foreground h-10 w-10 rounded-lg border text-center"
                :has-error="!!errors.length"
              />
            </PinInput>
          </FormControl>
          <FormMessage />
        </FormItem>
      </FormField>

      <div class="mt-6! flex gap-8">
        <Button
          class="w-full"
          variant="outline"
          type="button"
          :disabled="resendTimer > 0 || isLoadingResend"
          :is-loading="isLoadingResend"
          @click="handleResendCode"
        >
          {{ resendTimer > 0 ? formatTime(resendTimer) : 'Reenviar código' }}
        </Button>

        <Button class="w-full" type="submit" :is-loading="isLoadingTwoFactor">
          Verificar
        </Button>
      </div>
    </form>
  </div>
</template>
