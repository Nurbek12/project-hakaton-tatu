import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as labs from 'vuetify/labs/components'
import * as directives from 'vuetify/directives'
import 'vuetify/dist/vuetify.min.css'

export default createVuetify({
  ssr: true,
  directives,
  components: {
    ...components,
    ...labs
  },
  display: {
    mobileBreakpoint: 'md'
  },
  theme: {
    defaultTheme: localStorage.getItem('theme') || 'dark',
    themes: {
      light: {
        dark: false,
        colors: {
          background: '#f5f5f5',
          surface: '#ffffff',
          primary: '#7B1FA2',
        },
      },
      dark: {
        dark: true,
        colors: {
          background: '#272727',
          surface: '#212121',
          primary: '#01b075'
        },
      },
    }
  }
})