<template>
  <q-page class="flex flex-center column main-background">
    <question-sheet />
  </q-page>
</template>

<script setup>
import QuestionSheet from 'src/components/QuestionSheet.vue'
import { extractLeaderBoard } from 'src/function/Question'
import { onMounted } from 'vue'

onMounted(() => {
  extractLeaderBoard()
})
</script>
