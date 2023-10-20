<template>
  <v-app-bar density="compact" height="80" color="background" flat>
    <v-app-bar-title title="Payariq Med Texnikum">{{getters.user?.username || ''}}</v-app-bar-title>

    <template v-slot:append>
      <v-btn variant="flat" class="mr-1" size="40" color="primary" @click="changeTheme">
        <v-icon>{{themeIcon}}</v-icon>
      </v-btn>
      <v-menu transition="fade-transition">
        <template v-slot:activator="{props}">
          <v-btn class="mx-2" v-bind="props" flat size="40" variant="flat" elevation="1">
            <v-avatar rounded>
              <v-img cover :src="currentLang.img" />
            </v-avatar>
          </v-btn>
        </template>

        <v-list elevation="2" density="compact">
          <v-list-item v-for="(item, i) in languages" link :key="i" @click="changeLang(item.lang)">
            <template v-slot:prepend>
              <v-img :src="item.img" width="27" height="23" cover />
            </template>

            <v-list-item-title class="ml-4 text-caption" v-text="item.title"></v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </template>
  </v-app-bar>
</template>

<script setup>
import vuetify from "../plugins/vuetify"
import { computed } from "vue"
import { useStore } from 'vuex'
import { useI18n } from 'vue-i18n'

const { locale, t } = useI18n()
const { getters } = useStore()
const languages = [
  { lang: 'en', img: '/flags/us.svg', title: "English" },
  { lang: 'ru', img: '/flags/ru.svg', title: "Русский" },
  { lang: 'uz', img: '/flags/uz.svg', title: "O'zbekcha" },
]
const currentLang = computed(() => languages.find((l) => l.lang === locale.value))
const changeLang = l => {
  localStorage.setItem('dashboard-lang', l)
  locale.value = l
}

const changeTheme = () => {
  vuetify.theme.global.name.value =
  vuetify.theme.global.name.value === "dark" ? "light" : "dark";
  localStorage.setItem('theme', vuetify.theme.name.value)
}

const themeIcon = computed(() => {
  return vuetify.theme.global.name.value === "dark" ? "mdi-weather-night" : "mdi-white-balance-sunny";
})
</script>

<style>
</style>