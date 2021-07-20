const _ = require('lodash')
const notTeach = require('../notTeach.json')
const rootMakeWordsObj =
  root =>
  ({ sortedDictScore, frasesLen, wordsLen }) => {
    const allTopsWordsNotUsed = sortedDictScore
      .filter(v => v.othersWords.length === 1)
      .reduce((p, v) => _.uniq([...p, ...v.othersWords]), [])
      .filter(v => !notTeach.includes(v))

    const retornar = allTopsWordsNotUsed.reduce((prev, word) => {
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
        .slice(0, frasesLen)
        .map(v => v.frase)
      if (prev.length >= wordsLen) return prev

      const palavrasAprendidasHasWord = _.concat(
        ...Object.values(root.palavrasAprendidas)
      ).includes(word)

      if (palavrasAprendidasHasWord || frases.length < frasesLen) return prev

      return [
        ...prev,
        {
          word,
          translation:
            root.translation[root.palavrasEn.findIndex(v => v === word)],
          pronunciation:
            root.pronunciations[root.palavrasEn.findIndex(v => v === word)],
          sentences: frases.map(en => ({
            en: en.replace(/[?.,!]/g, ''),
            pt: '',
          })),
        },
      ]
    }, [])
    return retornar
  }

module.exports = rootMakeWordsObj
