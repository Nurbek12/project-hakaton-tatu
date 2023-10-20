<template>
    <v-container fluid>
        <v-row>
            <v-col cols="12">
                <v-card flat border>
                    <v-form ref="form">
                        <v-card-title>{{ t("form.create_new_post") }}</v-card-title>
                        <v-card-text>
                            <v-row>
                                <v-col cols="12">
                                    <v-text-field :rules="rules" v-model="title" density="comfortable" variant="outlined" :label="t('form.title')" hide-details></v-text-field>
                                </v-col>
                                <v-col cols="12" class="pb-10">
                                    <quill-editor v-model:content="content" contentType="html" toolbar="full"  />
                                </v-col>
                            </v-row>
                        </v-card-text>
                        <v-card-text class="mt-5">
                            <v-spacer></v-spacer>
                            <v-btn :loading="loading" @click="validate" color="primary" flat>{{ t("form.create") }}</v-btn>
                        </v-card-text>
                    </v-form>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>

<script setup>
import { ref } from 'vue'
import { QuillEditor } from '@vueup/vue-quill'
import { useStore } from 'vuex'
import { create_post } from '../../request/posts'
import '@vueup/vue-quill/dist/vue-quill.snow.css'
import { useI18n } from 'vue-i18n'
import axios from 'axios'

const { t } = useI18n()
const { getters } = useStore()
const title = ref('')
const content = ref('')
const form = ref(null)
const loading = ref(false)

const creator = getters.userid
const rules = [(v) => !!v || "Required"]


const  validate = async () => {
  const { valid } = await form.value.validate()
  if (valid) save()
}

const save = async () => {
    loading.value = true
    await create_post({
        title: title.value,
        content: content.value,
        description: "Descirption",
        creator: 3
    })
    await axios.post(import.meta.env.VITE_BOT_URL+'/send', { text: content.value, title: title.value })
    const qlEditor = document.querySelector(".ql-editor");
    qlEditor.innerHTML = ""
    form.value?.reset()
    loading.value = false

    alert(t('form.success_created_post'))
}
</script>