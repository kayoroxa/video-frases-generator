const pathJoin = require('path').join

function testar({ numAula }) {
  const frasesAula = require(pathJoin(__dirname, `./frasesAula${numAula}.json`))
  const allSentences = frasesAula.reduce((p, v) => [...p, ...v.sentences], [])
  const allSentencesRight = allSentences.every(v => {
    const is = v.en.split(' ').length === v.pt.split(' ').length
    if (!is) console.log(v.pt, '\n', v.en)
    return is
  })
  console.log(allSentencesRight)
  return allSentencesRight
}

testar({ numAula: 18 })
