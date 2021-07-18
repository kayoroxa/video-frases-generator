const fs = require('fs')
const pathJoin = require('path').join
const stringify = require('json-stringify-pretty-compact')

function save({ folder, palavrasAprendidas, words, objJson }) {
  const palavrasAprendidasArray = Object.values(palavrasAprendidas)
  const numberAula = palavrasAprendidasArray.length + 1
  fs.writeFileSync(
    pathJoin(folder, `../frasesAula${numberAula}.json`),
    JSON.stringify(objJson, null, 2)
  )

  const newPalavrasAprendidas = {
    ...palavrasAprendidas,
    [numberAula]: words,
  }
  fs.writeFileSync(
    pathJoin(folder, `./palavras-aprendidas.json`),
    stringify(newPalavrasAprendidas)
  )
}

module.exports = save
