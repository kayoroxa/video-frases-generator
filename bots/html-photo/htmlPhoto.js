const nodeHtmlToImage = require('node-html-to-image')
const fs = require('fs')

async function htmlPhoto({
  backgroundPath,
  contents,
  pathFileHtml,
  pathFolderExport,
}) {
  // console.log(contents)
  const image = await fs.readFileSync(backgroundPath)
  const base64Image = new Buffer.from(image).toString('base64')
  const dataURI = 'data:image/jpeg;base64,' + base64Image
  const html = await fs.readFileSync(pathFileHtml, {
    encoding: 'utf-8',
  })
  console.log('[HtmlToImage] Creating Images...')
  await nodeHtmlToImage({
    // output: pathFileExport.replace(/\.\w+$/g, '') + '.png',
    html: html,
    content: contents.map((content, index) => ({
      ...content,
      image: dataURI,
      percentage: ((index + 1) * 100) / contents.length,
      count: `${index + 1}/${contents.length}`,
      output: `${pathFolderExport}/${content.enFile}.png`,
    })),
  })
  console.log('[HtmlToImage] The image was created successfully!')
  return
}
module.exports = htmlPhoto
