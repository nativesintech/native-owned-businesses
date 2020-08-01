<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<style lang="scss">
@import './styles/screen.scss';
$color-primary: #151515;

html, body {
  padding: 0;
  margin: 0;
}

#app {
  font-family: 'Open Sans', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: $color-primary;

  max-width: 1024px;
  margin: 0 auto;
  padding: 0 15px;
}

#nav {
  padding: 15px 0;
  display: flex;
  flex-flow: row;
  justify-content: flex-start;

  a {
    font-weight: bold;
    text-decoration: none;
    margin-right: 20px;
    color: $color-primary;

    &.router-link-exact-active {
      border-bottom: 1px solid $color-primary;
    }
  }
}
</style>
