const pathJoin = require('path').join
const _ = require('lodash')

const testTranslation = require(pathJoin(
  __dirname,
  './assets/testTranslations.json'
))

function printArray(array) {
  const tem = element =>
    _.intersectionBy(testTranslation, [element], item =>
      JSON.stringify(item.map(v => v?.toLowerCase()))
    ).length > 0

  array = _.sortBy(array, v => tem(v))
  array.forEach(element => {
    console.log(element, tem(element) ? '✅' : '❌')
  })
}

function testar({ numAula }) {
  const frasesAula = require(pathJoin(__dirname, `./frasesAula${numAula}.json`))
  const allSentences = frasesAula.reduce((p, v) => [...p, ...v.sentences], [])
  const allSentencesRight = allSentences.every(v => {
    const is = v.en.split(' ').length === v.pt.split(' ').length
    if (!is) console.log(v.pt, '\n', v.en)
    return is
  })
  if (allSentencesRight) {
    const allWordWithTranslation = _.uniqBy(
      allSentences.reduce((p, v) => {
        return [
          ...p,
          ...v.en.split(' ').map((en, i) => [en, v.pt.split(' ')[i]]),
        ]
      }, []),
      item => JSON.stringify(item)
    )
    printArray(allWordWithTranslation)
  }
  console.log(allSentencesRight ? 'Size Cool ✅' : 'Size not Cool ❌')
  return allSentencesRight
}

testar({ numAula: 11 })
