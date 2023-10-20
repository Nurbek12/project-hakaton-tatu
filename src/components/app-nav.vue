<template>
    <v-navigation-drawer v-model="drawer" :rail="rail" permanent width="250" border :expand-on-hover="mobile">
      <v-list :lines="false" nav mandatory variant="flat">
        <v-list-item v-for="(item, i) in links[store.getters.role]" link :to="item.url" :key="i" :value="item" color="primary">
          <template v-slot:prepend>
            <v-icon :icon="item.icon"></v-icon>
          </template>

          <v-list-item-title>{{t('nav.'+item.title)}}</v-list-item-title>
        </v-list-item>
      </v-list>
      <v-btn position="absolute" v-if="!mobile" :icon="`mdi-chevron-${!rail ? 'left' : 'right'}`" size="x-small" @click="rail = !rail" style="right: -15px"></v-btn>
      <template v-slot:append>
        <v-list :lines="false" nav>
          <v-list-item @click="store.commit('logout')" to="/login" link>
            <template v-slot:prepend>
              <v-icon>mdi-logout-variant</v-icon>
            </template>

            <v-list-item-title>{{ t('nav.logout') }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </template>
  </v-navigation-drawer>
</template>

<script setup>
import { ref, watch, computed } from "vue"
import { useDisplay, useTheme } from "vuetify"
import { useStore } from "vuex"
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const store = useStore();
const mobile = useDisplay().mobile;

watch(mobile, () => {
  if (mobile) rail.value = true;
});
const drawer = ref(true);
const rail = ref(true);
const download = ref(false);
const links = {
  superuser: [
    { icon: 'mdi-view-grid', title: 'home', url: '/admin' },
    { icon: 'mdi-folder-multiple-image', title: 'posts', url: '/posts' },
    { icon: 'mdi-account-multiple', title: 'users', url: '/users' },
    // { icon: 'mdi-cog', title: 'settings', url: '/settings' },
  ],
  staff: [
    // { icon: 'mdi-view-grid', title: 'home', url: '/' },
    { icon: 'mdi-folder-multiple-image', title: 'posts', url: '/staff' },
    // { icon: 'mdi-account-multiple', title: 'users', url: '/users' },
    { icon: 'mdi-plus-box', title: 'create', url: '/newpost' },
  ]
}
</script>