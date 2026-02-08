<script setup lang="ts">
import { Button } from '@/shared/components/button'
import { useRouter } from 'vue-router'

import ProfileEdit from '@/features/profile/update-profile/index.vue'
import ProfileHeader from '@/features/profile/update-profile/ui/profile-header/index.vue'
import ProfileInfo from '@/features/profile/update-profile/ui/profile-info/index.vue'
import ProfilePhoto from '@/features/profile/update-profile/ui/profile-photo/index.vue'

const router = useRouter()
const profileChangePhotoRef = ref<InstanceType<typeof ProfilePhoto> | null>(
  null,
)
const profileEditRef = ref<InstanceType<typeof ProfileEdit> | null>(null)

const handleChangePhoto = () => {
  profileChangePhotoRef.value?.handleOpenDialog()
}

const handleSubmitForm = () => {
  console.log('submit form')
  profileEditRef.value?.submitForm()
}

const handleChangePassword = () => {
  router.push('/auth/new-password')
}
</script>

<template>
  <section
    class="bg-background flex max-w-[100vw] flex-col items-start justify-start overflow-auto px-4 py-6 sm:px-6 md:px-8 lg:px-10"
  >
    <ProfileHeader name="Ana de Armas" @submitForm="handleSubmitForm">
      <template #leading>
        <ProfileInfo
          name="Ana de Armas"
          email="ana.de.armas@gunstores.com"
          avatar="https://placehold.co/100x100"
          @change-photo="handleChangePhoto"
        />
      </template>
      <template #actions>
        <Button variant="outline" size="sm" @click="handleChangePassword">
          Trocar senha
        </Button>
        <Button size="sm" @click="handleSubmitForm"> Editar perfil </Button>
      </template>
    </ProfileHeader>

    <div class="mt-8 w-full">
      <ProfileEdit ref="profileEditRef" />
    </div>

    <ProfilePhoto ref="profileChangePhotoRef" />
  </section>
</template>
