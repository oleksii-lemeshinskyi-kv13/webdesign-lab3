<template>
  <div class="container mt-4">
    <h2>Shorten Your URL</h2>
    <div v-if="!isLoggedIn" class="alert alert-warning">
      <strong>Note:</strong> You need to be logged in to save your shortened URLs permanently. URLs
      shortened without logging in will only be active for 30 days.
    </div>
    <form id="urlShortenForm" @submit.prevent="addUrl">
      <div class="mb-3">
        <label for="originalUrl" class="form-label">Enter URL to shorten</label>
        <input type="url" class="form-control" id="originalUrl" v-model="newUrl" required />
      </div>
      <button type="submit" class="btn btn-primary">Shorten URL</button>
    </form>
  </div>

  <div class="container mt-5">
    <h3>Your Shortened URLs</h3>
    <div v-if="loading" class="text-center">
      <div class="spinner-border" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>
    <table class="table" v-if="!loading">
      <thead>
        <tr>
          <th scope="col">#</th>
          <th scope="col">Original URL</th>
          <th scope="col">Shortened URL key</th>
          <th scope="col">Actions</th>
        </tr>
      </thead>
      <tbody id="urlList">
        <ItemColumn
          v-for="(item, index) in items"
          :key="item.key"
          :index="index"
          :url="item.url"
          :urlKey="item.key"
          @delete="handleDelete"
        ></ItemColumn>
      </tbody>
    </table>
  </div>
</template>

<script>
import ItemColumn from '@/components/ItemColumn.vue'
import Item from '@/model/Item'
import axios from 'axios'

export default {
  components: {
    ItemColumn
  },

  data() {
    return {
      items: [],
      newUrl: '',
      isLoggedIn: false,
      loading: false
    }
  },

  mounted() {
    this.fetchUserUrls()

    const storedUserId = localStorage.getItem('userId')
    if (storedUserId !== null) {
      this.isLoggedIn = true
    }
  },

  methods: {
    async fetchUserUrls() {
      try {
        const userId = this.getUserId()
        if (userId == null) {
          return
        }

        this.loading = true

        const response = await axios.post(
          '/api/getUserUrls',
          {
            userId: userId
          },
          {
            headers: {
              'Content-Type': 'application/json'
            }
          }
        )

        this.loading = false

        if (!response.data.userUrls.isEmpty) {
          this.items = response.data.userUrls.map((urlData) => new Item(urlData.key, urlData.url))
        }
      } catch (error) {
        this.loading = false
        console.error('Error fetching user URLs:', error.response?.data || error.message)
        alert('Failed to fetch user URLs. Please try again.')
      }
    },

    getUserId() {
      return localStorage.getItem('userId')
    },

    async addUrl() {
      if (!this.newUrl) {
        alert('Please enter a URL to shorten.')
        return
      }

      try {
        const response = await axios.post(
          '/api/add',
          {
            url: this.newUrl,
            userId: this.getUserId()
          },
          {
            headers: {
              'Content-Type': 'application/json'
            }
          }
        )

        const { key, url } = response.data
        this.items.push(new Item(key, url))
        this.newUrl = ''
        console.log('URL added successfully:', key)
      } catch (error) {
        console.error('Error adding URL:', error.response?.data || error.message)
        alert('Failed to add URL. Please try again.')
      }
    },

    async handleDelete(key) {
      try {
        await axios.delete('/api/delete', {
          data: {
            key: key,
            userId: this.getUserId()
          },
          headers: {
            'Content-Type': 'application/json'
          }
        })

        this.items = this.items.filter((item) => item.key !== key)
        console.log('Deleted item with key:', key)
      } catch (error) {
        console.error('Error adding URL:', error.response?.data || error.message)
        alert('Failed to add URL. Please try again.')
      }
    }
  }
}
</script>
