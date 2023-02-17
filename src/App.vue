<template>
  <div id="app">
    <img alt="Vue logo" src="./assets/logo.png" />
    <DummyTest />
  </div>
</template>

<script>
import DummyTest from "@/dummyTest.vue";
export default {
  name: "App",
  components: {
    DummyTest,
  },
};
</script>
