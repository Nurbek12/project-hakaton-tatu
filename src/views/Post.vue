<template>
<v-container fluid>
  <v-row>
    <v-col cols="12">
      <v-card :loading="loading">
        <template v-if="!!post?.id">
          <v-card-title>{{post.title}}</v-card-title>
          <v-card-subtitle>{{post.creator?.username}}</v-card-subtitle>
          <v-card-text>
            <div v-html="post.content"></div>
          </v-card-text>
        </template>
      </v-card>
    </v-col>
  </v-row>
</v-container>
</template>

<script setup>
import { ref } from 'vue'
import { get_posts_by_id } from '../request/posts'
import { useRoute } from 'vue-router'

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