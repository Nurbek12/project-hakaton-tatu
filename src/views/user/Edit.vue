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
                                    <quill-editor v-model:content="content" contentType="text" toolbar="full"  />
                                </v-col>
                            </v-row>
                        </v-card-text>
                        <v-card-text class="mt-5">
                            <v-spacer></v-spacer>
                            <v-btn @click="validate" color="primary" flat>{{ t("form.edit") }}</v-btn>
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

const creator = getters.userid
const rules = [(v) => !!v || "Required"]


const  validate = async () => {
  const { valid } = await form.value.validate()
  if (valid) save()
}

function convertHtmlToMarkdown(htmlString) {
  // Replace <b>text</b> with **text**
  htmlString = htmlString.replace(/<b>(.*?)<\/b>/g, '**$1**');

  // Replace <em>text</em> with __text__
  htmlString = htmlString.replace(/<em>(.*?)<\/em>/g, '__$1__');

  // Replace <code>text</code> with ```text```
  htmlString = htmlString.replace(/<code>(.*?)<\/code>/g, '```$1```');

  // Replace <a href="link">text</a> with [text](link)
  htmlString = htmlString.replace(/<a\s+href="([^"]+)"[^>]*>(.*?)<\/a>/g, '[$2]($1)');

  return htmlString;
}

function convertHtmlToText(htmlString) {
    htmlString = htmlString.replace(/<b>(.*?)<\/b>/g, '**$1**');

    htmlString = htmlString.replace(/<em>(.*?)<\/em>/g, '__$1__');

    htmlString = htmlString.replace(/<code>(.*?)<\/code>/g, '```$1```');

    htmlString = htmlString.replace(/<a\s+href="([^"]+)"[^>]*>(.*?)<\/a>/g, '[$2]($1)');

    var plainText = htmlString
    //.replace(/<[^>]+>/g, '');
    console.log(htmlString);
    // Decode HTML entities
    var decodedText = decodeEntities(plainText);

    return decodedText;
}

function decodeEntities(text) {
    var entities = [
        ['amp', '&'],
        ['apos', "'"],
        ['lt', '<'],
        ['gt', '>'],
        ['quot', '"']
    ];

    for (var i = 0; i < entities.length; i++) {
        var entity = entities[i];
        var regex = new RegExp('&' + entity[0] + ';', 'g');
        text = text.replace(regex, entity[1]);
    }

    return text;
}

const save = async () => {
    // console.log(convertHtmlToText(content.value));
    await create_post({
        title: title.value,
        content: content.value,
        description: "Descirption",
        creator: 3
    })
    await axios.post('http://localhost:5004/send', { text: convertHtmlToText(content.value) })
    content.value = ''
    form.value?.reset()
}
</script>