<template>
  <q-card style="max-width: 80vw; width: 350px">
    <q-card-section class="row items-center">
      <q-icon class="cursor-pointer q-pr-sm" name="close" size="2em" v-close-popup />
      <h1 class="title-font">Leaderboard</h1>
    </q-card-section>
    <q-separator />
    <q-card-section>
      <div class="q-pa-sm">
        <template v-for="(record, r) in leaderboard" :key="r">
          <div class="row">
            <div class="col-1">{{ r + 1 }}</div>
            <div class="col">{{ record.name }}</div>
            <div class="col-2">{{ record.score }}</div>
          </div>
        </template>
      </div>
    </q-card-section>
  </q-card>
</template>

<script setup>
import { useMathStore } from 'src/stores/math_question'
import { computed } from 'vue'

const questionStore = useMathStore()
const leaderboard = computed(() => questionStore.historyScore)
</script>
