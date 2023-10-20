<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12">
        <v-sheet border
          color="surface" width="100%"  rounded>
          <div class="responsive-datatable py-4">
            <v-data-table-server
              v-model:items-per-page="perpage"
              v-model:page="page"
              :headers="localizedHeaders"
              :items-length="totalItems"
              :items="serverItems"
              :loading="loading" items-per-page-text
              item-value="name" @update:options="loadItems">
              <template #top>
                <div class="px-4 text-h5">{{ t('posts.posts') }}</div>
              </template>
              <template #no-data>{{ t('nodata') }}</template>
              <template #loading>{{ t('loaditems') }}</template>
              <template v-slot:item.actions="{ index, item }">
                <td :data-label="t('form.delete')">
                  <div class="d-flex justify-end">
                    <v-btn variant="flat" size="35" flat class="ml-1" color="blue" :to="`/post/${item.id}`">
                      <v-icon>mdi-eye</v-icon>
                    </v-btn>
                    <v-btn variant="flat" size="35" flat class="ml-1" color="red" @click="deleteItem(item.id, index)">
                      <v-icon>mdi-delete</v-icon>
                    </v-btn>
                  </div>
                </td>
              </template>

              <template #item.title="{ index, item }">
                <td :data-label="t('posts.title')">{{ index + 1 }}. {{ item.title }}</td>
              </template>
              <template #item.creator="{ item }">
                <td :data-label="t('posts.creator')">{{ item.creator?.username }}</td>
              </template>
              <template #item.date="{ item }">
                <td :data-label="t('posts.date')">{{ new Date(item.publish_date).toLocaleString() }}</td>
              </template>
              <template #item.status="{ index, item }">
                <td :data-label="t('posts.status')">
                  <v-chip @click="togglePublish(item.id, index, item.is_published)" link variant="flat" label :color="item.is_published?'green':'orange'" class="text-white">{{ t(item.is_published?"posts.published":"posts.not_published") }}</v-chip>
                </td>
              </template>
              <template #bottom>
                <v-row align="center" justify="space-between" class="px-3">
                  <v-col cols="12" sm="5" md="3">
                    <v-select v-model="perpage" flat density="compact" :items="[10, 20, 50, 100]" hide-details variant="outlined"></v-select>
                  </v-col>
                  <v-col cols="12" sm="7" md="5">
                    <v-pagination total-visible="4" density="comfortable" variant="flat" active-color="primary" :length="Math.ceil(totalItems/perpage)" v-model="page"></v-pagination>
                  </v-col>
                </v-row>
              </template>
            </v-data-table-server>
          </div>
        </v-sheet>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, computed, nextTick } from "vue"
import { get_posts, delete_post, toggle_posts } from '../../request/posts'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const headers = [
  { title: "posts.creator", key: "creator", sortable: false },
  { title: "posts.title", key: "title", sortable: true },
  { title: "posts.date", key: "date", sortable: false },
  { title: "posts.status", key: "status", sortable: false },
  { title: "form.delete", align: "start", key: "actions", sortable: false },
]
const localizedHeaders = computed(() => headers.map(h => ({...h, title: t(h.title)})) )

const perpage = ref(10)
const page = ref(1)
const serverItems = ref([])
const loading = ref(true)
const totalItems = ref(0)

const  validate = async () => {
  const { valid } = await form.value.validate()
  if (valid) save()
}

const togglePublish = async (id, i, p) => {
  if(!confirm(t('form.toggle_comfirm'))) return
  
  await toggle_posts(id, !p)
  serverItems.value[i].is_published = !p
}

const deleteItem = async (id, i) => {
  if(!confirm(t('form.delete_comfirm'))) return
  serverItems.value.splice(i, 1)
  await delete_post(id)
}
  
const loadItems =  async ({page, itemsPerPage }) => {
  loading.value = true
  const { data } = await get_posts(`limit=${itemsPerPage}&offset=${(page - 1) * parseInt(itemsPerPage)}`)
  serverItems.value = data.results
  totalItems.value = data.count
  loading.value = false
}
</script>