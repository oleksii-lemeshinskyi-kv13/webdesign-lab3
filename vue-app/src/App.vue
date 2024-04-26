<script setup>
import { RouterView } from 'vue-router'
import AppNavbar from '@/components/AppNavbar.vue'
import { onMounted, ref } from 'vue'
import { getAuth, onAuthStateChanged } from 'firebase/auth'

const isLoggedIn = ref(false)

onMounted(() => {
  const auth = getAuth()
  onAuthStateChanged(auth, (user) => {
    if (user) {
      isLoggedIn.value = true
      localStorage.setItem('userId', user.uid)
    } else {
      isLoggedIn.value = false
      localStorage.removeItem('userId', null)
    }
  })

  const storedUserId = localStorage.getItem('userId')
  if (storedUserId !== null) {
    isLoggedIn.value = true
  }
})
</script>

<template>
  <div class="d-flex flex-column min-vh-100">
    <AppNavbar :isLoggedIn="isLoggedIn" />

    <RouterView />

    <footer class="footer bg-light text-center text-lg-start mt-auto">
      <div class="container p-4">
        <div class="row">
          <div class="col-lg-12 col-md-12 mb-4 mb-md-0">
            <h5 class="text-uppercase">CUTTER</h5>
            <p>Address: 1234 Street Name, City Name, Country</p>
            <p>Email: contact@example.com</p>
            <p>Phone: +123 456 7890</p>
          </div>
        </div>
      </div>
      <div class="text-center p-3 footer-bottom">© 2024 CUTTER. All rights reserved.</div>
    </footer>
  </div>
</template>

<style scoped>
.footer-bottom {
  background-color: rgba(0, 0, 0, 0.2);
}
</style>
