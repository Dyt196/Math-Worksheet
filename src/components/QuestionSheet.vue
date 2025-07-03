<template>
  <div class="main-sheet col column q-pa-sm" style="height: 100vh">
    <q-card class="title-card flex flex-center q-mx-xl" flat>
      <h1 class="title-font">{{ questionDetail.questionTitle }}</h1>
    </q-card>
    <div class="row q-py-xs q-col-gutter-x-sm">
      <div class="col-xl-8 col-lg-8 col-md-8 col-sm-8 col-xs-12 row items-center">
        <div class="label-text">Name:</div>
        <div class="col q-px-xs">
          <q-input
            v-model="currentName"
            :class="`outer-input q-px-sm ${currentNameCheck.hasError ? 'error' : ''}`"
            input-class="inner-input"
            borderless
            dense
            @update:model-value="updateName()"
          />
        </div>
      </div>
      <div class="col-xl-4 col-lg-4 col-md-4 col-sm-4 col-xs-12 row items-center">
        <div class="label-text">Score:</div>
        <div v-if="userDetail.submitted" class="col flex flex-center score-text submitted row">
          <div class="col flex flex-center">
            {{ userDetail.score ? userDetail.score : 'Error' }}
          </div>
          <div>
            <q-btn
              dense
              no-caps
              round
              flat
              icon="leaderboard"
              size="sm"
              @click="leaderDialog = true"
            >
              <q-tooltip>Leaderboard</q-tooltip>
            </q-btn>
            <q-btn dense no-caps round flat icon="replay" size="sm" @click="goReset()">
              <q-tooltip>Reset All</q-tooltip>
            </q-btn>
          </div>
        </div>
        <div v-else class="col flex flex-center q-px-sm">
          <q-btn
            outline
            label="Submit"
            dense
            no-caps
            class="submit-button"
            @click="submitAnswer()"
          />
        </div>
      </div>
    </div>
    <div class="flex flex-center caption-text">
      Circle the correct answers. (Click on same answer to reset)
    </div>
    <q-scroll-area class="col" style="border: 1px solid black">
      <div class="q-pa-xs row q-col-gutter-xs items-center">
        <template v-for="(question, q) in questionDetail.listQuestion" :key="q">
          <question-component
            :question="question"
            :question-base="questionDetail.questionBase"
            :solution="questionDetail.solutionLogic(question.number, question.base)"
            @select-answer="choosingAnswer"
          />
        </template>
      </div>
    </q-scroll-area>
    <div class="flex flex-center caption-text row q-col-gutter-x-sm">
      <q-space />
      <div>Copyright:</div>
      <div>
        <a href="https://www.mathinenglish.com" target="_blank">www.mathinenglish.com</a>
      </div>
      <q-space />
    </div>
  </div>
  <q-dialog v-model="leaderDialog">
    <leaderboard-card />
  </q-dialog>
</template>

<script setup>
import { Notify } from 'quasar'
import LeaderboardCard from './LeaderboardCard.vue'
import QuestionComponent from './QuestionComponent.vue'
import { useMathStore } from 'src/stores/math_question'
import { computed, ref } from 'vue'
import { extractLeaderBoard, sendScore } from 'src/function/Question'

const questionStore = useMathStore()
const questionDetail = computed(() => questionStore.theQuestion)
const userDetail = computed(() => questionStore.currentUser)
const leaderDialog = ref(false)
const currentName = ref(userDetail.value.name)
const currentNameCheck = ref({
  hasError: false,
  message: '',
})

function updateName() {
  questionStore.currentUser.name = currentName.value
  currentNameCheck.value = {
    hasError: false,
    message: '',
  }
}

function choosingAnswer(val) {
  questionStore.pickAnswer(val.questionTid, val.answer)
}

function goReset() {
  questionStore.resetAll()
  currentName.value = null
}

function submitAnswer() {
  if (currentName.value) {
    const answerMe = questionStore.evaluateAnswer()
    sendScore(currentName.value, answerMe.score).then((resp) => {
      if (resp.res == 0) {
        Notify.create({
          type: 'positive',
          message: 'Score Saved',
        })
        extractLeaderBoard()
      } else {
        Notify.create({
          type: 'negative',
          message: resp.msg,
        })
      }
    })
  } else {
    Notify.create({
      type: 'negative',
      message: 'Please fill in name',
    })
  }
}
</script>
