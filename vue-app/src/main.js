import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { initializeApp } from 'firebase/app'

const firebaseConfig = {
  // your firebase config
}

initializeApp(firebaseConfig)

const app = createApp(App)

app.use(router)

app.mount('#app')
