const nodeHtmlToImage = require('node-html-to-image')
const sanitize = require('sanitize-filename')
const pathJoin = require('path').join
const _ = require('lodash')
const fs = require('fs')

async function main(pathFolderExport, contents) {
  const html = await fs.readFileSync('./files/html/word-learn.html', {
    encoding: 'utf-8',
  })
  const image = await fs.readFileSync(
    pathJoin(__dirname, './files/html/background.jpg')
  )
  const base64Image = new Buffer.from(image).toString('base64')
  const dataURI = 'data:image/jpeg;base64,' + base64Image

  const getIndex = word =>
    _.findIndex(_.uniqBy(contents, 'word'), { word: word })

  contents = _.uniqBy(contents, 'word').reduce(
    (p, v) => [
      ...p,
      { ...v, word: '', pronunciation: '', wordLabel: v.word },
      { ...v, pronunciation: '' },
      // { ...v, translation: '', pronunciation: '' },
      // { ...v, translation: '' },
      v,
    ],
    []
  )
  console.log(fs.existsSync(pathJoin(__dirname, './files/html/background.jpg')))
  await nodeHtmlToImage({
    html: html,
    content: contents.map((content, index) => {
      const label = content.wordLabel || content.word
      // console.log(getIndex(label))
      return {
        ...content,
        image: dataURI,
        'index-word': getIndex(label),
        output: pathJoin(
          pathFolderExport,
          sanitize(`2 ${getIndex(label) - 1} ${label} ${String(index)} .png`)
        ),
      }
    }),
  })
}

module.exports = main
