const nodeHtmlToImage = require('node-html-to-image')
const sanitize = require('sanitize-filename')
const pathJoin = require('path').join
const _ = require('lodash')
const fs = require('fs')

async function main(pathFolderExport, contents) {
  const html = await fs.readFileSync('./files/html/word-test.html', {
    encoding: 'utf-8',
  })
  const image = await fs.readFileSync(
    pathJoin(__dirname, './files/html/background-no-circle.jpg')
  )
  const base64Image = new Buffer.from(image).toString('base64')
  const dataURI = 'data:image/jpeg;base64,' + base64Image

  const getIndex = word =>
    _.findIndex(_.uniqBy(contents, 'word'), { word: word })

  contents = _.uniqBy(contents, 'word').reduce(
    (p, v) => [...p, { ...v, translation: '' }, v],
    []
  )
  console.log(
    fs.existsSync(pathJoin(__dirname, './files/html/background-no-circle.jpg'))
  )
  await nodeHtmlToImage({
    html: html,
    content: contents.map((content, index) => ({
      ...content,
      image: dataURI,
      'index-word': getIndex(content.word) + 1,
      output: pathJoin(
        pathFolderExport,
        sanitize(
          `6 ${getIndex(content.word)} ${content.word} ${String(
            index + 2
          )} .png`
        )
      ),
    })),
  })
}

module.exports = main
