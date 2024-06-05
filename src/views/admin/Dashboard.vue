<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12" md="6" v-for="({ title, color, icon, value }, i) in carts" :key="i">
        <v-card flat border class="mx-auto" style="overflow: unset;">
          <v-sheet style="position: absolute; top: -10px; left: 10px" :color="color" height="75" width="75" 
            rounded border class="d-flex align-center justify-center">
            <v-icon size="x-large" color="white">
              {{ icon }}
            </v-icon>
          </v-sheet>
          <v-card-text style="text-align: right">
            <div>{{t('dashboard.'+title)}}</div>
            <p class="text-h4 text--primary">
              {{ counts[value] }}
            </p>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12">
        <v-card flat border class="mx-auto" style="overflow: unset;">
          <v-sheet style="position: absolute; top: -10px; left: 10px" color="amber" height="75" width="75" 
            rounded border class="d-flex align-center justify-center">
            <v-icon size="x-large" color="white">mdi-chart-box-outline</v-icon>
          </v-sheet>
          <v-card-text style="text-align: right">
            <div>{{t('dashboard.chart_title')}}</div>
            <v-row class="mt-8">
              <v-col cols="12">
                <BarChart :chartData="line_data" />
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { computed, ref, watch, } from 'vue'
import { BarChart } from 'vue-chart-3'
import { Chart, registerables } from "chart.js"
import { useI18n } from 'vue-i18n'
import { by_month_posts, get_posts_count, get_posts_pub_count } from '../../request/posts'
import { get_users_counts } from '../../request/users'

const { locale, t } = useI18n()
const chart = ref([])
const carts = [
  // { icon: 'mdi-account-group', title: 'card_1', value: 'users', color: 'red-accent-3' },
  { icon: 'mdi-comment-multiple', title: 'card_2', value: 'posts', color: 'light-blue-accent-3' },
  { icon: 'mdi-comment-eye', title: 'card_3', value: 'pub_posts', color: 'green-accent-3' },
]

const counts = ref({
  users: 0,
  posts: 0,
  pub_posts: 0
})

Chart.register(...registerables);

const line_data = computed(() => {
  const currentMonthDays = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate()
  return {
    labels: new Array(currentMonthDays).fill(0).map((_, i) => i + 1),
    datasets: [
      {
        label: new Date().toLocaleString(locale.value, { month: 'long', }),
        backgroundColor: '#0091EA',
        data: chart.value.map(c => c.count),
      },
    ],
  }
})

const init = async () => {
  const [count_by_month, pc, ppc, uss] = await Promise.all([by_month_posts(''), get_posts_count(), get_posts_pub_count(), get_users_counts() ])

  chart.value = count_by_month.data
  counts.value.posts = pc.data
  counts.value.pub_posts = ppc.data
  counts.value.users = uss.data
  // console.log(count_by_month);
}

init()
</script>