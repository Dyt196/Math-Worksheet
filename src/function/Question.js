import axios from 'axios'
import { useMathStore } from 'src/stores/math_question'

const questionStore = useMathStore()

export async function extractLeaderBoard() {
  try {
    const resp = await axios.get(process.env.BE_LINK + `score-history`)
    questionStore.historyScore = resp.data
    return {
      res: 0,
      msg: 'success',
    }
  } catch (err) {
    return {
      res: 2,
      msg: `Device Error: ${err}`,
    }
  }
}

export async function sendScore(name, score) {
  let savData = {
    name: name,
    score: score,
  }
  try {
    const resp = await axios.post(process.env.BE_LINK + `register-score`, savData)
    return resp.data
  } catch (err) {
    return {
      res: 2,
      msg: `Device Error: ${err}`,
    }
  }
}
