<template>
  <nav class="navbar navbar-expand-lg">
    <div class="container">
      <router-link class="navbar-brand" to="/">CUTTER</router-link>
      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarsExample07"
        aria-controls="navbarsExample07"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarsExample07">
        <ul class="navbar-nav me-auto mb-2 mb-lg-0">
          <li class="nav-item">
            <router-link class="nav-link" :class="{ active: $route.path === '/' }" to="/"
              >Home</router-link
            >
          </li>
          <li class="nav-item">
            <router-link class="nav-link" :class="{ active: $route.path === '/about' }" to="/about"
              >About</router-link
            >
          </li>
          <li class="nav-item">
            <router-link
              class="nav-link"
              :class="{ active: $route.path === '/profile' }"
              to="/profile"
              >Profile</router-link
            >
          </li>
        </ul>
        <router-link v-if="!isLoggedIn" to="/login">
          <button type="button" class="btn btn-outline-primary me-2">Login</button>
        </router-link>
        <button v-else @click="logout" type="button" class="btn btn-outline-danger me-2">
          Logout
        </button>
        <router-link v-if="!isLoggedIn" to="/register">
          <button type="button" class="btn btn-primary">Sign-up</button>
        </router-link>
      </div>
    </div>
  </nav>
</template>

<script>
import { getAuth, signOut } from 'firebase/auth'

export default {
  name: 'AppNavbar',
  props: {
    isLoggedIn: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    async logout() {
      try {
        await signOut(getAuth())
        alert('Logged out successfully')
        window.location.reload()
      } catch (error) {
        alert('Error signing out:', error)
      }
    }
  }
}
</script>
