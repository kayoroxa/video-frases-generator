const getScoreFraseArray = (fraseArray, palavrasAprendidas) => {
  let score = 0
  let quantosTem = 0
  let lengthNewWords = 0
  const wordsDid = []
  const wordsLearning = []
  const total = palavrasAprendidas.length
  fraseArray.forEach(wordInFrase => {
    const isHave = index => {
      const resposta = palavrasAprendidas[index].findIndex(
        item => wordInFrase.toLowerCase() === item.toLowerCase()
      )
      return resposta > -1 ? true : false
    }
    const getAdicionalScore = index => {
      if (isHave(index)) return index
      return -index
    }
    palavrasAprendidas.forEach((_, index) => {
      const addScore = Number(getAdicionalScore(index))
      if (addScore > 0) {
        quantosTem += 1
        if (index + 1 < total) wordsDid.push(wordInFrase.toLowerCase())
        else wordsLearning.push(wordInFrase.toLowerCase())
      }

      score += addScore
    })
    if (isHave(total - 1)) lengthNewWords += 1
  })
  const porcentagemAchado = Math.round((quantosTem * 100) / fraseArray.length)
  const porcentagemNewWords = Math.round(
    (lengthNewWords * 100) / fraseArray.length
  )
  if (porcentagemNewWords === 0 || porcentagemAchado === 0) score -= 9000
  score += porcentagemAchado
  return [score, wordsDid, wordsLearning]
}

module.exports = getScoreFraseArray
