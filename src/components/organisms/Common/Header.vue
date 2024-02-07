<template>
  <header class="flex items-center justify-between bg-white p-4 shadow-md">
    <!-- Logo -->
    <div class="flex items-center">
      <button class="mr-4 sm:hidden" @click="emitHamburgerClick">
        <!-- Ícone do menu hamburguer -->
        <span class="mb-1 block h-0.5 w-6 bg-gray-800"></span>
        <span class="mb-1 block h-0.5 w-6 bg-gray-800"></span>
        <span class="block h-0.5 w-6 bg-gray-800"></span>
      </button>
      <span class="hidden w-full text-xl font-bold sm:flex sm:text-center">
        LOGO
      </span>
    </div>

    <!-- Foto de perfil -->
    <div class="hidden items-center space-x-2 sm:flex">
      <img
        src="@/assets/images/empty_avatar.png"
        alt="Perfil"
        class="h-10 w-10 rounded-full"
      />
      <div class="hidden flex-col items-start sm:flex">
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
  setup(props, { emit }) {
    const emitHamburgerClick = () => {
      emit("hamburger-click");
    };

    return {
      emitHamburgerClick,
    };
  },
};
</script>
