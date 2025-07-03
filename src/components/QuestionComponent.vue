<template>
  <div class="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-xs-12">
    <div class="text-left">{{ theQuestion }}</div>
    <div class="column q-px-sm">
      <template v-for="(ans, a) in props.question.option" :key="a">
        <div class="row items-center q-col-gutter-x-sm">
          <div>
            <q-btn
              dense
              round
              flat
              @click="choseAnswer(ans)"
              :class="`answer-button ${pickedClass(ans)} ${checkSubmit(ans)}`"
              no-caps
            >
              {{ String.fromCharCode(97 + a) }}
            </q-btn>
          </div>
          <div>{{ ans }}</div>
        </div>
      </template>
    </div>
    <!-- {{ userDetail }} -->
  </div>
</template>

<script setup>
import { useMathStore } from 'src/stores/math_question'
import { computed } from 'vue'

const questionStore = useMathStore()
const userDetail = computed(() => questionStore.currentUser)
const props = defineProps({
  question: {
    required: true,
  },
  questionBase: {
    required: true,
  },
  solution: {
    required: true,
  },
})

const emit = defineEmits(['selectAnswer'])

const theQuestion = computed(() => {
  let questionString = props.questionBase
  Object.entries(props.question).forEach(([key, value]) => {
    questionString = questionString.replaceAll(`{{${key}}}`, value)
  })
  return questionString
})

const questionAnswered = computed(() => {
  const answeredData = userDetail.value.answer.find((ans) => ans.tid == props.question.tid)
  if (answeredData) {
    return answeredData.answer
  } else {
    return null
  }
})

function pickedClass(ans) {
  if (questionAnswered.value == ans) {
    return 'picked'
  }
  return ''
}

function checkSubmit(ans) {
  if (userDetail.value.submitted) {
    if (questionAnswered.value == ans && ans == props.solution) {
      return 'correct'
    } else if (questionAnswered.value != ans && ans == props.solution) {
      return 'false'
    }
  }
  return ''
}

function choseAnswer(answer) {
  let savData = {
    questionTid: props.question.tid,
    answer: answer,
  }
  emit('selectAnswer', savData)
}
</script>
