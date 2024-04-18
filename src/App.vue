<template>
  <div id="app">
    <h1>Circle Draw</h1>
    <main>
      <CircleComponent></CircleComponent>
    </main>
  </div>
</template>

<script>
import CircleComponent from './components/CircleComponent.vue'

export default {
  name: 'App',
  components: {
    CircleComponent
  }
}
</script>

<style>
header h1 {
  margin: 0;
  font-size: 2em;
}

main {
  flex: 1;
  margin: 50px auto 200px auto; 
  display: flex;
  flex-direction: column;
  align-items: center; 
  justify-content: center; 
  text-align: center;
}

#app {
  display: flex;
  flex-direction: column;
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  justify-content: center;
  color: #2c3e50;
  background-image: url('./assets/background.jpg');
  background-size: cover; 
}
</style>
