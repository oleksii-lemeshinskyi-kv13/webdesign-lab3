<template>
  <div class="d-flex flex-column justify-content-center align-items-center text-center">
    <h1 class="display-1 fw-bold">404</h1>
    <p class="h4">Page not found</p>
    <p class="lead">
      The page you're looking for doesn't seem to exist. 
      Here are some suggestions:
    </p>
    <ul class="list-group list-group-flush">
      <li class="list-group-item">
        <router-link to="/">Go back to Home</router-link>
      </li>
      <li class="list-group-item">
        <router-link to="/about">Learn more about us</router-link>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'NotFoundView',
};
</script>

<style scoped>
body {
  background-color: #f8f9fa;
}
</style>
