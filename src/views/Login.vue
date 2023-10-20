<template>
  <v-container fluid class="bg-img py-0 h-100">
    <v-row class="h-100" justify="center" align="center">
      <v-card border max-width="400px" flat width="100%" class="px-1 py-4">
        <v-form ref="form">
          <v-card-text>
            <v-row>
              <v-col cols="12" class="py-2">
                <v-text-field density="comfortable"
                  v-model="user.login"
                  :placeholder="t('login.login')"
                  hide-details color="primary"
                  :rules="rules"
                  variant="outlined"
                />
              </v-col>
              <v-col cols="12" class="py-2">
                <v-text-field density="comfortable"
                  v-model="user.password"
                  :placeholder="t('login.password')"
                  hide-details autocomplete="off"
                  :rules="rules" color="primary"
                  variant="outlined"
                  :append-inner-icon="show ? 'mdi-eye' : 'mdi-eye-off'"
                  :type="show ? 'text' : 'password'"
                  @click:append-inner="show = !show"
                />
              </v-col>
            </v-row>
          </v-card-text>
          <v-card-actions class="px-4 py-1">
            <v-btn :loading="loading" color="primary" type="button" flat height="45" variant="elevated" block @click="validate">{{ t("login.submit") }}</v-btn>
          </v-card-actions>
        </v-form>
      </v-card>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref } from "vue";
import { login, get_me } from "../request/users";
import { useStore } from "vuex";
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { checkToken } from "../request";

const { t } = useI18n()
const store = useStore();
const router = useRouter()
const show = ref(false);
const rules = [(v) => !!v || "Required"];
const form = ref(null);
const error = ref(false);
const loading = ref(false);

const user = ref({
  login: "",
  password: "",
});
const lgn = async () => {
  try {
    loading.value=true
    const { data } = await login({
      username: user.value.login,
      password: user.value.password,
    });

    const userdata = await get_me(data.access)
    store.commit("setUser", userdata.data);
    store.commit("setToken", data.access);

    checkToken()
    router.push(userdata.data.role==="staff"?'/staff':'/admin')
    loading.value=false

  } catch (err) {
    Object.assign(user.value, {
        login: "",
        password: "",
      })
      error.value = true
      loading.value=false
  }
};
const validate = async () => {
  const { valid } = await form.value.validate();
  if (valid) lgn();
};
</script>