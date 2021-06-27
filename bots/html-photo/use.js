const htmlPhoto = require('./htmlPhoto')

async function main() {
  await htmlPhoto({
    pathFileHtml: './index.html',
    pathFileExport: './image.jpg',
    backgroundPath: './photos/1.jpg',
    content: {
      pt: 'A imagem foi criada com sucesso!',
      en: 'The image was created successfully!',
    },
  })
}
main()
