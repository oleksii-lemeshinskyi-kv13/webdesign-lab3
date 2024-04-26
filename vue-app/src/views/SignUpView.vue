<template>
  <div class="container mt-5">
    <h2>User Registration</h2>
    <form @submit.prevent="registerUser">
      <div class="form-group mb-4">
        <label for="username">Username</label>
        <input
          v-model="username"
          type="text"
          class="form-control"
          id="username"
          placeholder="Enter username"
          required
        />
      </div>
      <div class="form-group mb-4">
        <label for="email">Email address</label>
        <input
          v-model="email"
          type="email"
          class="form-control"
          id="email"
          placeholder="Enter email"
          required
        />
      </div>
      <div class="form-group mb-4">
        <label for="password">Password</label>
        <input
          v-model="password"
          type="password"
          class="form-control"
          id="password"
          placeholder="Password"
          required
        />
      </div>
      <div class="form-group mb-4">
        <label for="confirmPassword">Confirm Password</label>
        <input
          v-model="confirmPassword"
          type="password"
          class="form-control"
          id="confirmPassword"
          placeholder="Confirm Password"
          required
        />
      </div>
      <div class="row">
        <div class="col-md-6 mb-4">
          <label for="gender">Gender</label>
          <select v-model="gender" class="form-control" id="gender" required>
            <option value="">Choose...</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </div>
        <div class="col-md-6 mb-4">
          <label for="dob">Date of Birth</label>
          <input v-model="dob" type="date" class="form-control" id="dob" required />
        </div>
      </div>

      <button type="submit" class="btn btn-primary w-100">Register</button>
    </form>
  </div>
</template>

<script>
import axios from 'axios'
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth'

export default {
  data() {
    return {
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
      gender: '',
      dob: ''
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
    async registerUser() {
      if (!this.isEmailValid || !this.isPasswordValid || this.password !== this.confirmPassword) {
        if (!this.isEmailValid) {
          alert('Please enter a valid email address')
        } else if (!this.isPasswordValid) {
          alert('Password must be at least 6 characters long')
        } else {
          alert('Passwords do not match')
        }
        return
      }

      try {
        const user = await createUserWithEmailAndPassword(getAuth(), this.email, this.password)

        const response = await axios.post(
          '/api/register',
          {
            username: this.username,
            email: this.email,
            gender: this.gender,
            dob: this.dob,
            userId: user.user.uid
          },
          {
            headers: {
              'Content-Type': 'application/json'
            }
          }
        )
        alert(response.data.message)
        this.$router.push('/')
      } catch (error) {
        console.error('Error registering user:', error)
        alert('An error occurred while registering. Please try again later.')
      }
    }
  }
}
</script>
