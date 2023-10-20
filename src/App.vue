<template>
<v-app>
  <app-nav v-if="getters.logged" />
  <app-bar />
  <v-main>
    <router-view></router-view>
  </v-main>
</v-app>
</template>

<script setup>
import AppBar from './components/app-bar.vue'
import AppNav from './components/app-nav.vue'
import { useStore } from 'vuex'
const { getters } = useStore()
</script>

<style>
*{
  font-family: 'Open Sans', sans-serif !important; 
}

.responsive-datatable {
  overflow-x: hidden;
}

.responsive-datatable [data-label]::before {
  font-weight: lighter !important;
}

@media (max-width: 600px) {
  .responsive-datatable .v-data-table thead {
    display: none;
  }

  .responsive-datatable .v-data-table tbody tr {
    display: flex;
    flex-direction: column;
    margin-bottom: 10px;
    border-bottom: 1px solid rgba(0, 0, 0, 0.12);
  }

  .responsive-datatable .v-data-table tbody tr:last-child {
    border-bottom: none;
  }

  .responsive-datatable .v-data-table td,
  .responsive-datatable .v-data-table th {
    display: block;
    text-align: left;
    padding-left: 0;
    padding-right: 0;
  }

  .responsive-datatable .v-data-table td:before {
    content: attr(data-label);
    font-weight: bold;
    margin-right: 10px;
  }

  .responsive-datatable .v-data-table [data-label] {
    margin: -25px 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .responsive-datatable .v-data-table__td{
    line-height: 2;
  }
}
</style>