<template>
<v-container fluid>
  <v-row>
    <v-col cols="12">
      <v-card :loading="loading">
        <template v-if="!!post?._id">
          <v-card-title>Title: {{post.title_uz}}</v-card-title>
          <v-card-subtitle>Creator: {{post.creator?.name}}</v-card-subtitle>
          <v-card-text>Description: {{post.description_uz}}</v-card-text>
          <v-card-text>
            Content:
            <div v-html="post.content_uz"></div>
          </v-card-text>
        </template>
      </v-card>
    </v-col>
  </v-row>
</v-container>
</template>

<script setup>
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import { get_posts_by_id } from '../request/posts'

const { params } = useRoute()
const post = ref(null)
const loading = ref(false)

const init = async () => {
  loading.value = true
  const { data } = await get_posts_by_id(params.id)
  
  post.value = data
  loading.value = false
}

init()
</script>