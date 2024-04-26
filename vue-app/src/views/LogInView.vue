<template>
  <main class="container m-auto">
    <form @submit.prevent="signIn">
      <h1 class="h3 mb-3 fw-normal">Please sign in</h1>

      <div class="form-floating">
        <input
          v-model="email"
          type="email"
          class="form-control"
          id="floatingInput"
          placeholder="name@example.com"
        />
        <label for="floatingInput">Email address</label>
      </div>
      <div class="form-floating">
        <input
          v-model="password"
          type="password"
          class="form-control"
          id="floatingPassword"
          placeholder="Password"
        />
        <label for="floatingPassword">Password</label>
      </div>

      <button class="btn btn-primary w-100 py-2" type="submit">Sign in</button>
    </form>
  </main>
</template>

<script>
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth'

export default {
  data() {
    return {
      email: '',
      password: ''
    }
  },
  computed: {
    isEmailValid() {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      return emailRegex.test(this.email)
    },
    isPasswordValid() {
      return this.password.length >= 6
    }
  },
  methods: {
    async signIn() {
      if (!this.isEmailValid || !this.isPasswordValid) {
        if (!this.isEmailValid) {
          alert('Please enter a valid email address')
        } else if (!this.isPasswordValid) {
          alert('Password must be at least 6 characters long')
        }
        return
      }

      try {
        await signInWithEmailAndPassword(getAuth(), this.email, this.password)

        this.$router.push('/')
      } catch (error) {
        console.error('Error registering user:', error)
        alert('An error occurred while registering.', error.message)
      }
    }
  }
}
</script>
