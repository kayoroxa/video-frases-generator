const fs = require('fs')
const nodeHtmlToImage = require('node-html-to-image')
const pathJoin = require('path').join
const sanitize = require('sanitize-filename')
const _ = require('lodash')

async function main({ contents, pathFileHtml, pathFolderExport }) {
  const html = await fs.readFileSync(pathFileHtml, {
    encoding: 'utf-8',
  })
  const getIndex = word =>
    _.findIndex(_.uniqBy(contents, 'word'), { word: word })

  const checkIfIsLast = obj => {
    const array = Object.keys(obj)
    const pt = array.filter(v => v.includes('pt'))
    const en = array.filter(v => v.includes('en') && !v.includes('-'))
    return en.length === pt.length
  }

  await nodeHtmlToImage({
    html: html,
    content: contents.map((content, index) => ({
      ...content,
      count: `${index + 1}/${contents.length}`,
      output: pathJoin(
        pathFolderExport,
        sanitize(
          `2 ${getIndex(content.word)} ${content.word} ${String(index + 3)} ${
            checkIfIsLast(content) ? 'ultimo' : ''
          }.png`
        )
      ),
    })),
  })
}
module.exports = main
