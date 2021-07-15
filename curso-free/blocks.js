const path = require('path')
const htmlPhoto = require('./html-video-photo')
const requireJSON5 = require('require-json5')
const _ = require('lodash')

function separarAndFormat(sentence, language) {
  const splitted = sentence[language].includes('|')
    ? sentence[language].split('|').map(v => v.trim())
    : sentence[language].split(' ')
  return splitted.map(v => v.replace(/_/g, ' '))
}

async function main({ contentName }) {
  const contents = requireJSON5(path.join(__dirname, `./${contentName}.json`))
  const contentSentences = contents.reduce((p, content) => {
    return [
      ...p,
      ...content.sentences.reduce((prev, sentence, i) => {
        const createOp = arrayEn => _.shuffle(_.uniq(arrayEn))
        let palavrasEnRandom
        const obj = _.omit(content, 'sentences')
        const palavrasPt = separarAndFormat(sentence, 'pt')
        const palavrasEn = separarAndFormat(sentence, 'en')

        palavrasEnRandom = palavrasEnRandom
          ? palavrasEnRandom
          : createOp(palavrasEn)

        const wordsPtSeparada = palavrasPt.reduce(
          (p, v, i) => ({ ...p, ['pt' + i]: v }),
          {}
        )
        const wordsEnSeparada = palavrasEnRandom.reduce(
          (p, v, i) => ({ ...p, ['en-op' + i]: v }),
          {}
        )

        const wordsEnDynamically = size =>
          palavrasEn
            .slice(0, size)
            .reduce((p, v, i) => ({ ...p, ['en' + i]: v }), {})
        return [
          ...prev,
          ...new Array(palavrasPt.length + 1).fill().map((_, indexPalavra) => {
            return {
              ...obj,
              ...wordsPtSeparada,
              ...wordsEnDynamically(indexPalavra),
              ...wordsEnSeparada,
              progress: `${i + 1}/${content.sentences.length}`,
            }
          }),
        ]
      }, []),
    ]
  }, [])
  // console.log(contentSentences)
  await htmlPhoto({
    pathFileHtml: path.join(__dirname, './files/html/blocks.html'),
    pathFolderExport: path.join(__dirname, './files/slides'),
    contents: contentSentences,
  })
}
module.exports = main
