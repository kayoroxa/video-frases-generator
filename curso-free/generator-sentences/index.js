const palavrasAprendidas = require('./palavras-aprendidas.json')

const pathJoin = require('path').join
const frases = require(pathJoin(__dirname, './assets/frases.json'))

const fs = require('fs')

const palavrasEn = fs
  .readFileSync(pathJoin(__dirname, './assets/palavrasBase.txt'), {
    encoding: 'utf-8',
  })
  .split('\r\n')
// const palavrasPt = fs
//   .readFileSync(pathJoin(__dirname, './assets/translation.txt'), { encoding: 'utf-8' })
//   .split('\r\n')
const pronunciations = fs
  .readFileSync(pathJoin(__dirname, './assets/pronunciations.txt'), {
    encoding: 'utf-8',
  })
  .split('\r\n')
const translation = fs
  .readFileSync(pathJoin(__dirname, './assets/translationWord.txt'), {
    encoding: 'utf-8',
  })
  .split('\r\n')

function compare(a, b) {
  if (a.score > b.score) return -1
  if (a.score < b.score) return 1
  return 0
}

const splitWordInFrase = frase => {
  const fraseLower = frase.toLowerCase()
  return fraseLower.match(/[a-zA-Z][’'a-zA-Z]*/gi)
}

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

const fraseNoRepeat = fraseArray => {
  const filtered = {}
  fraseArray.forEach(word => {
    filtered[word] = 1
  })
  return Object.keys(filtered)
}

const sortAllScores = dictScore => {
  const sortable = dictScore.sort(compare)
  return sortable
}

const getScore = (wordsLearned = Object.values(palavrasAprendidas)) => {
  return frases.map(frase => {
    const fraseSplit = splitWordInFrase(frase)
    const fraseFilter = fraseNoRepeat(fraseSplit)
    const [fraseScore, wordsDid, wordsLearning] = getScoreFraseArray(
      fraseFilter,
      wordsLearned
    )
    return {
      frase: frase.toLowerCase(),
      score: fraseScore,
      wordsDid: wordsDid,
      wordsLearning: wordsLearning,
      othersWords: frase
        .match(/[a-zA-Z][’'a-zA-Z]*/gi)
        .filter(v => !wordsDid.includes(v) && !wordsLearning.includes(v)),
    }
  })
}

async function getBestsWords() {
  const makeWordsObj = rootMakeWordsObj({
    palavrasEn,
    translation,
    palavrasAprendidas,
    pronunciations,
  })
  const dictScore = getScore()
  const sortedDictScore = sortAllScores(dictScore)

  const wordsObj = makeWordsObj({
    sortedDictScore,
    frasesLen: 4,
    wordsLen: 6,
  })

  console.log(wordsObj.map(v => v.word))
  return {
    words: wordsObj.map(v => v.word),
    objJson: wordsObj.map(wordObj => ({
      ...wordObj,
      sentences: wordObj.sentences.map(s => ({
        ...s,
        pt: '',
      })),
    })),
  }
}

const stringify = require('json-stringify-pretty-compact')
const rootMakeWordsObj = require('./bots/makeWordObj')

async function run() {
  const { objJson, words } = await getBestsWords()
  const palavrasAprendidasArray = Object.values(palavrasAprendidas)
  const numberAula = palavrasAprendidasArray.length + 1
  fs.writeFileSync(
    pathJoin(__dirname, `./frasesAula${numberAula}.json`),
    JSON.stringify(objJson, null, 2)
  )

  const newPalavrasAprendidas = {
    ...palavrasAprendidas,
    [numberAula]: words,
  }
  fs.writeFileSync(
    pathJoin(__dirname, `./palavras-aprendidas.json`),
    stringify(newPalavrasAprendidas)
  )
}
run()
