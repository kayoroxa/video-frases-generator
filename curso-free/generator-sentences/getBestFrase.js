// const requireJSON5 = require('require-json5')
const _ = require('lodash')
const palavrasAprendidas = require('./palavras-aprendidas.json')
const readlineSync = require('readline-sync')

const frases = require('./frases.json')

const fs = require('fs')
const pathJoin = require('path').join

const palavrasEn = fs
  .readFileSync(pathJoin(__dirname, './palavrasBase.txt'), {
    encoding: 'utf-8',
  })
  .split('\r\n')
// const palavrasPt = fs
//   .readFileSync(pathJoin(__dirname, './translation.txt'), { encoding: 'utf-8' })
//   .split('\r\n')
const pronunciations = fs
  .readFileSync(pathJoin(__dirname, './pronunciations.txt'), {
    encoding: 'utf-8',
  })
  .split('\r\n')
const translation = fs
  .readFileSync(pathJoin(__dirname, './translationWord.txt'), {
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

const pintarFrase = (frase, arrayWordDid, colorNumber) => {
  const palavrasDaFrase = splitWordInFrase(frase)
  let frasePintada = frase
  palavrasDaFrase.forEach(palavra => {
    if (arrayWordDid.includes(palavra.toLowerCase())) {
      const re = new RegExp('\\b(' + palavra + ')\\b', 'ig')
      frasePintada = frasePintada.replace(
        re,
        `\x1b[${colorNumber}m${palavra}\x1b[0m`
      )
    }
  })
  return frasePintada
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

// const exec = newsPalavras => {
//   const palavrasAprendidasArray = Object.values(palavrasAprendidas)
//   const dictScore = getScore(
//     newsPalavras
//       ? [...palavrasAprendidasArray, newsPalavras]
//       : palavrasAprendidasArray
//   )
//   const sortedDictScore = sortAllScores(dictScore)

//   sortedDictScore.forEach((element, index) => {
//     if (index < 200) {
//       let frasePintada = pintarFrase(element.frase, element.wordsDid, 32)
//       frasePintada = pintarFrase(frasePintada, element.wordsLearning, 33)
//       console.log(`${frasePintada} \x1b[34m(${element.score})\x1b[0m`)
//     } else return
//   })
// }

async function getBestsWords() {
  const dictScore = getScore()
  const sortedDictScore = sortAllScores(dictScore)
  const allTopsWordsNotUsed = sortedDictScore
    .filter(v => {
      return v.othersWords.length === 1
    })
    .slice(0, 100)
    .reduce((p, v) => {
      return _.uniq([...p, ...v.othersWords])
    }, [])

  // eslint-disable-next-line no-constant-condition
  const news = allTopsWordsNotUsed.reduce((p, word) => {
    // console.log(word)
    const frases = sortedDictScore
      .filter(
        v =>
          v.othersWords.includes(word) &&
          v.othersWords.length === 1 &&
          !v.frase.includes('-') &&
          !v.frase.includes('...') &&
          !v.frase.includes('oh') &&
          !v.frase.includes('?')
      )
      .slice(0, 5)
      .map(v => v.frase)
    if (p.length >= 6) return p
    if (_.concat(...Object.values(palavrasAprendidas)).includes(word)) return p
    if (frases.length > 4) {
      frases.forEach(v => console.log(v.replace(/[?.,!]/g, '')))
      console.log('')
    }
    return frases.length > 4
      ? [
          ...p,
          {
            word,
            translation: translation[palavrasEn.findIndex(v => v === word)],
            pronunciation:
              pronunciations[palavrasEn.findIndex(v => v === word)],
            sentences: frases.map(en => ({
              en: en.replace(/[?.,!]/g, ''),
              pt: '',
            })),
          },
        ]
      : p
  }, [])
  readlineSync.question('tecle enter qnd traduzir')

  const translator = fs
    .readFileSync(pathJoin(__dirname, './translateText.txt'), 'utf8')
    .split(/\r\n\r\n/)
    .map(v => v.split('\r\n').filter(v => v !== ''))

  console.log(news.map(v => v.word))
  return news.map((wordObj, iw) => ({
    ...wordObj,
    sentences: wordObj.sentences.map((s, i) => ({
      ...s,
      pt: translator[iw][i].replace(/[?.,!]/g, ''),
    })),
  }))
}

// function translate(en) {
//   const palavras = en.match(/[a-zA-Z][’'a-zA-Z]*/gi)
//   const translation = palavras
//     .map(en =>
//       palavrasPt[palavrasEn.findIndex(v => v === en)]?.replace(/\s/g, '_')
//     )
//     .join(' ')
//     .replace(/\s\s/g, ' ')
//     .toLowerCase()
//   return translation
// }

async function run() {
  const bestsWords = await getBestsWords()
  fs.writeFileSync(
    pathJoin(
      __dirname,
      `./frasesAula${Object.values(palavrasAprendidas).length + 1}.json`
    ),
    JSON.stringify(bestsWords, null, 2)
  )
}
run()
