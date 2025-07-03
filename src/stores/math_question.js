import { defineStore, acceptHMRUpdate } from 'pinia'

export const useMathStore = defineStore('mathStore', {
  state: () => ({
    theQuestion: {
      questionTitle: 'Rounding Off to Nearest 10',
      questionBase: `{{number}} rounded off to the nearest {{base}} is.`,
      solutionLogic: (number, base) => {
        return Math.round(number / base) * base
      },
      listQuestion: [
        {
          tid: 1,
          number: 17,
          base: 10,
          option: [10, 20, 17],
        },
        {
          tid: 2,
          number: 45,
          base: 10,
          option: [50, 45, 40],
        },
        {
          tid: 3,
          number: 75,
          base: 10,
          option: [70, 80, 175],
        },
        {
          tid: 4,
          number: 19,
          base: 10,
          option: [20, 10, 19],
        },
        {
          tid: 5,
          number: 64,
          base: 10,
          option: [64, 70, 60],
        },
        {
          tid: 6,
          number: 0,
          base: 10,
          option: [10, 1, 0],
        },
        {
          tid: 7,
          number: 98,
          base: 10,
          option: [80, 100, 89],
        },
        {
          tid: 8,
          number: 199,
          base: 10,
          option: [190, 100, 200],
        },
        {
          tid: 9,
          number: 94,
          base: 10,
          option: [100, 94, 90],
        },
        {
          tid: 10,
          number: 165,
          base: 10,
          option: [160, 170, 150],
        },
        {
          tid: 11,
          number: 445,
          base: 10,
          option: [450, 440, 500],
        },
        {
          tid: 12,
          number: 999,
          base: 10,
          option: [990, 1000, 909],
        },
      ],
    },
    currentUser: {
      name: null,
      score: null,
      answer: [],
      submitted: false,
    },
    historyScore: [],
  }),
  getters: {},
  actions: {
    resetAnswer() {
      this.currentUser.answer = []
    },
    resetAll() {
      // Reset Current User
      this.currentUser = {
        name: null,
        score: null,
        answer: [],
        submitted: false,
      }
    },

    pickAnswer(questionTid, answer) {
      const currentAnswer = this.currentUser.answer.find((val) => val.tid == questionTid)
      if (currentAnswer) {
        if (currentAnswer.answer == answer) {
          // If answer already recorded and same as clicked, reset it
          this.currentUser.answer = this.currentUser.answer.filter(
            (setAnswer) => setAnswer.tid != questionTid,
          )
        } else {
          // If answer already recorded and different, change it
          this.currentUser.answer = this.currentUser.answer.map((setAnswer) => {
            if (setAnswer.tid == questionTid) {
              return { ...setAnswer, answer: answer }
            }
            return setAnswer
          })
        }
      } else {
        // If no answer recorded, push a new set
        this.currentUser.answer.push({ tid: questionTid, answer: answer })
      }
    },
    evaluateAnswer() {
      if (this.currentUser.name) {
        // Checking if all the question were answered
        if (this.currentUser.answer.length == this.theQuestion.listQuestion.length) {
          // Loop each answer to set the result by running the solution function
          this.currentUser.answer = this.currentUser.answer.map((setAnswer) => {
            const eachQuestion = this.theQuestion.listQuestion.find((q) => q.tid == setAnswer.tid)
            const solution = this.theQuestion.solutionLogic(eachQuestion.number, eachQuestion.base)
            return { ...setAnswer, answerResult: solution == setAnswer.answer }
          })
          this.currentUser.submitted = true
          this.currentUser.score = this.currentUser.answer.filter(
            (theAnswer) => theAnswer.answerResult == true,
          ).length
          // Return score
          return {
            response: 0,
            message: `Congratulation your score is ${this.currentUser.score} out of ${this.theQuestion.listQuestion.length}`,
            score: this.currentUser.answer.filter((theAnswer) => theAnswer.answerResult == true)
              .length,
          }
        } else {
          // Only evaluate when all question are answered
          return {
            response: 1,
            message: 'Please answer all question',
          }
        }
      } else {
        // Only evaluate when all field are filled
        return {
          response: 1,
          message: 'Please fill in name',
        }
      }
    },
  },
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useMathStore, import.meta.hot))
}
