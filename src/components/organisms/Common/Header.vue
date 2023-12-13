<template>
  <header class="flex justify-between items-center p-4 bg-white shadow-md">
    <!-- Logo -->
    <div class="flex items-center">
      <button class="sm:hidden mr-4" @click="emitHamburgerClick">
        <!-- Ícone do menu hamburguer -->
        <span class="block w-6 h-0.5 bg-gray-800 mb-1"></span>
        <span class="block w-6 h-0.5 bg-gray-800 mb-1"></span>
        <span class="block w-6 h-0.5 bg-gray-800"></span>
      </button>
      <span class="hidden sm:flex text-xl font-bold sm:text-center w-full">
        LOGO
      </span>
    </div>

    <!-- Foto de perfil -->
    <div class="hidden sm:flex items-center space-x-2">
      <img
        src="@/assets/images/empty_avatar.png"
        alt="Perfil"
        class="rounded-full w-10 h-10"
      />
      <div class="hidden sm:flex flex-col items-start">
        <span class="text-sm font-semibold">Usuário</span>
        <span class="text-xs text-gray-600">ADM</span>
      </div>
    </div>
  </header>
</template>

<script>
export default {
  name: "Header",
  emits: ["hamburger-click"],
  methods: {
    emitHamburgerClick() {
      this.$emit("hamburger-click");
    },
  },
};
</script>
