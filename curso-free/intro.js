const nodeHtmlToImage = require('node-html-to-image')
const pathJoin = require('path').join
const fs = require('fs')

async function main(pathFolderExport, contents) {
  const html = await fs.readFileSync('./files/html/intro.html', {
    encoding: 'utf-8',
  })

  console.log(fs.existsSync(pathJoin(__dirname, './files/html/background.jpg')))
  await nodeHtmlToImage({
    html: html,
    content: contents,
    output: pathJoin(pathFolderExport, '0 intro.png'),
  })
}

module.exports = main
