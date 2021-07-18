const blocks = require('./blocks')
const wordLearn = require('./word-learn')
const intro = require('./intro')
const wordTest = require('./word-test')
const requireJSON5 = require('require-json5')
const pathJoin = require('path').join
const clearFolders = require('../utils/clearFolders')

const lenPalavrasAprendidas = Object.values(
  require('./generator-sentences/palavras-aprendidas.json')
).length

console.log(lenPalavrasAprendidas)
const numAula = lenPalavrasAprendidas
const clean = true

async function main() {
  console.log(pathJoin(__dirname, './files/slides'))
  clean &&
    (await clearFolders({
      folders: pathJoin(__dirname, './files/slides'),
      notFiles: [
        '1.png',
        '1b.png',
        '3.png',
        '4.png',
        '5.png',
        '7.png',
        '8.png',
      ],
    }))
  const pathContent = pathJoin(__dirname, `./frasesAula${numAula}.json`)
  const pathOutputImgs = pathJoin(__dirname, './files/slides')

  const contents = requireJSON5(pathContent)
  intro(pathOutputImgs, { numberAula: numAula })
  blocks({ contentName: 'frasesAula' + numAula })
  wordLearn(pathOutputImgs, contents)
  wordTest(pathOutputImgs, contents)
}

main()
