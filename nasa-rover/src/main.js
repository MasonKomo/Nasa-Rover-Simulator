import { createApp } from 'vue'
import App from './App.vue'
require('@/assets/styles/styles.css')

// Vuetify
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import { aliases, mdi } from 'vuetify/iconsets/mdi'


const vuetify = createVuetify({
  icons: {
    defaultSet: 'mdi',
    aliases,
    sets: {
      mdi,
    }
  },

  components,
  directives,
})

createApp(App).use(vuetify).mount('#app')
