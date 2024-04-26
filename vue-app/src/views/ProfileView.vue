<template>
  <div class="container mt-5">
    <h2>User Profile</h2>
    <div v-if="loading" class="text-center">
      <div class="spinner-border" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>
    <div v-else>
      <table v-if="profile" class="table table-bordered">
        <thead class="thead-light">
          <tr>
            <th>Field</th>
            <th>Information</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Name</td>
            <td>{{ profile.username }}</td>
          </tr>
          <tr>
            <td>Email</td>
            <td>{{ profile.email }}</td>
          </tr>
          <tr>
            <td>Gender</td>
            <td>{{ profile.gender }}</td>
          </tr>
          <tr>
            <td>Date of Birth</td>
            <td>{{ profile.dob }}</td>
          </tr>
        </tbody>
      </table>
      <div v-else>
        <p>No profile data available.</p>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  data() {
    return {
      profile: null,
      loading: true
    }
  },
  mounted() {
    this.fetchProfileData()
  },
  methods: {
    async fetchProfileData() {
      try {
        var userId = localStorage.getItem('userId')
        if (userId == null) {
          return
        }

        const response = await axios.post('/api/getUser', { userId })
        this.profile = response.data.userData
        this.loading = false
      } catch (error) {
        console.error('Error fetching profile data:', error)
        this.loading = false
      }
    }
  }
}
</script>
