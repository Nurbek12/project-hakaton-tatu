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
                                    <v-text-field :rules="rules" v-model="newpost.title_uz" density="comfortable" variant="outlined" :label="t('form.title') + ' UZ'" hide-details></v-text-field>
                                </v-col>
                                <v-col cols="12">
                                    <v-text-field :rules="rules" v-model="newpost.title_ru" density="comfortable" variant="outlined" :label="t('form.title') + ' RU'" hide-details></v-text-field>
                                </v-col>
                                <v-col cols="12">
                                    <v-text-field :rules="rules" v-model="newpost.title_en" density="comfortable" variant="outlined" :label="t('form.title') + ' EN'" hide-details></v-text-field>
                                </v-col>

                                <v-col cols="12">
                                    <v-textarea :rules="rules" v-model="newpost.description_uz" density="comfortable" variant="outlined" :label="t('form.description') + ' UZ'" hide-details />
                                </v-col>
                                <v-col cols="12">
                                    <v-textarea :rules="rules" v-model="newpost.description_ru" density="comfortable" variant="outlined" :label="t('form.description') + ' RU'" hide-details />
                                </v-col>
                                <v-col cols="12">
                                    <v-textarea :rules="rules" v-model="newpost.description_en" density="comfortable" variant="outlined" :label="t('form.description') + ' EN'" hide-details />
                                </v-col>

                                <v-col cols="12" class="pb-10">
                                    <quill-editor v-model:content="newpost.content_uz" contentType="html" placeholder="Content UZ" toolbar="full"  />
                                </v-col>
                                <!-- <v-col></v-col>
                                <v-col cols="12" class="pb-10">
                                    <quill-editor v-model:content="newpost.content_ru" contentType="html" placeholder="Content RU" toolbar="full"  />
                                </v-col>
                                <v-col></v-col>
                                <v-col cols="12" class="pb-10">
                                    <quill-editor v-model:content="newpost.content_en" contentType="html" placeholder="Content EN" toolbar="full"  />
                                </v-col> -->
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
import { ref, reactive } from 'vue'
import { QuillEditor } from '@vueup/vue-quill'
import { useStore } from 'vuex'
import { create_post, create_post_telegram } from '../../request/posts'
import '@vueup/vue-quill/dist/vue-quill.snow.css'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const { getters } = useStore()
const newpost = reactive({
    title_uz: '',
    title_ru: '',
    title_en: '',
    
    description_uz: '',
    description_ru: '',
    description_en: '',

    content_uz: '',
    content_ru: '',
    content_en: '',

    cover: '',
    public: false,
    creator: getters.user?._id,

    date: '',
})
const title = ref('')
const content = ref('')
const form = ref(null)
const loading = ref(false)

// const creator = getters.userid
const rules = [(v) => !!v || "Required"]


const  validate = async () => {
  const { valid } = await form.value.validate()
  if (valid) save()
}

const save = async () => {
    loading.value = true
    await create_post(newpost)
    await create_post_telegram({ text: newpost.content_uz, title: newpost.title_uz })
    const qlEditor = document.querySelector(".ql-editor")
    qlEditor.innerHTML = ""
    form.value?.reset()
    loading.value = false

    alert(t('form.success_created_post'))
}
</script>