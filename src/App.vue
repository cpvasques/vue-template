<template>
  <div id="app">
    <RouterView />
  </div>
</template>

<script>
export default {
  name: "App",
  mounted() {
    console.log("New Deploy!");
  },
};
</script>
