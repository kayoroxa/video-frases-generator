const palavrasAprendidas = require('./palavras-aprendidas.json')

const pathJoin = require('path').join
const frases = require(pathJoin(__dirname, './assets/frases.json'))
const rootMakeWordsObj = require('./bots/makeWordObj')
const getScoreFraseArray = require('./bots/getScoreFraseArray')

const fs = require('fs')

const palavrasEn = fs
  .readFileSync(pathJoin(__dirname, './assets/palavrasBase.txt'), {
    encoding: 'utf-8',
  })
  .split('\r\n')

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

async function getBestsWords({ frasesLen, wordsLen }) {
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
    frasesLen,
    wordsLen,
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

const save = require('./bots/save')

async function run() {
  const { objJson, words } = await getBestsWords({ frasesLen: 6, wordsLen: 7 })
  save({ folder: __dirname, palavrasAprendidas, words, objJson })
}
run()
