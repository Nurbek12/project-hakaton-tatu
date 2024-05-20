<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12">
        <v-sheet elevation="1" color="surface"
          width="100%" class="pa-2 py-4" rounded>
          <v-row justify="space-between" align="center">
            <v-col class="py-1" cols="12" sm="4">
              <v-text-field :label="t('search')" prepend-inner-icon="mdi-magnify" v-model="search" variant="outlined" color="primary" density="compact" hide-details />
            </v-col>
            <v-col class="py-1" cols="12" sm="4" md="3">
              <v-btn block height="42" color="primary" @click="dialog = true" variant="flat">{{ t('form.create_new_user') }}</v-btn>
            </v-col>
          </v-row>
        </v-sheet>
      </v-col>
      <v-col cols="12">
        <v-sheet elevation="1"
          color="surface" width="100%"
          class="pa-2" rounded>
          <div class="responsive-datatable">
            <v-data-table
              :search="search"
              :headers="localizedHeaders"
              :items="items"
              :loading="loading"
              items-per-page-text
              item-value="name"
            >
              <template #no-data>{{ t('nodata') }}</template>
              <template #loading>{{ t('loaditems') }}</template>
              <template v-slot:item.actions="{ index, item }">
                <td :data-label="t('form.delete')">
                  <div class="d-flex justify-end">
                    <v-btn variant="flat" color="red" @click="deleteItem(item._id, index)">
                      <v-icon>mdi-delete</v-icon>
                    </v-btn>
                  </div>
                </td>
              </template>

              <template #item.name="{ index, item }">
                <td :data-label="t('form.name')">{{ index + 1 }}. {{ item.name }}</td>
              </template>
              <template #item.login="{ item }">
                <td :data-label="t('login.login')">{{ item.login }}</td>
              </template>
              <template #item.role="{ item }">
                <td :data-label="t('form.role')">{{ item.role }}</td>
              </template>
            </v-data-table>
          </div>
        </v-sheet>
      </v-col>
    </v-row>
    <v-dialog v-model="dialog" max-width="550px">
      <v-card>
        <v-card-title class="mt-2 ml-2 mb-0">
          <span class="text-h5">{{t('form.create_new_user')}}</span>
        </v-card-title>

        <v-card-text class="px-2 pt-0">
          <v-container>
            <v-form ref="form">
              <v-row>
                <v-col cols="12">
                  <v-text-field
                    v-model="editedItem.username"
                    :label="t('form.name')"
                    hide-details :rules="rules"
                    color="primary"
                    variant="outlined"
                  ></v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-text-field
                    v-model="editedItem.email"
                    :label="t('login.login')"
                    hide-details :rules="rules"
                    color="primary"
                    variant="outlined"
                  ></v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-text-field
                    v-model="editedItem.password"
                    :label="t('login.password')"
                    hide-details :rules="rules"
                    color="primary"
                    variant="outlined"
                  ></v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-btn variant="flat" color="primary" block @click="validate" height="45">
                    {{ t('form.save') }}
                  </v-btn>
                </v-col>
              </v-row>
            </v-form>
          </v-container>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup>
import { ref, computed, nextTick, watch } from "vue"
import { get_users, delete_user, create_user } from "../../request/users"
import { useI18n } from 'vue-i18n'
// import axios from '../../request'

const { t } = useI18n()
const rules = [(v) => !!v || "Required"]
const headers = [
  { title: "form.name", key: "name", sortable: true },
  { title: "login.login", key: "login", sortable: false },
  { title: "form.role", key: "role", sortable: false },
  { title: "form.delete", align: "start", key: "actions", sortable: false },
]
const localizedHeaders = computed(() => headers.map(h => ({...h, title: t(h.title)})) )

const search = ref("")
const dialog = ref(false)
const form = ref(null)

const editedItem = ref({
  username: "",
  email: "",
  password: "",
  role: "user",
})
const defaultItem = {
  username: "",
  email: "",
  password: "",
  role: "user",
}

const items = ref([])
const loading = ref(true)

watch(dialog, (v) => v || close())

const  validate = async () => {
  const { valid } = await form.value.validate()
  if (valid) save()
}

const close = () => {
  dialog.value = false
  nextTick(() => {
    editedItem.value = Object.assign({}, defaultItem)
    form.value?.reset()
  });
}

const save = async () => {
  const { data } = await create_user(editedItem.value);
  if(data){
    items.value.push(data);
    close()
  }else{
    editedItem.value.login = ''
  }
}

const deleteItem = async (id, i) => {
  if(!confirm('Вы хотите удалить этот пользователь?')) return
  items.value.splice(i, 1)
  await delete_user(id)
}
  
const init =  async () => {
  loading.value = true
  const { data } = await get_users(`page=1&limit=1000`)
  items.value = data.result
  loading.value = false
}

init()
</script>