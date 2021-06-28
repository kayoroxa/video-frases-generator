const htmlPhoto = require('./bots/html-photo/htmlPhoto')
const audiosWithPhotos = require('./bots/audio-with-photo/audiosWithPhotos')
const joinVideosCustom = require('./bots/join-videos/joinVideosCustom')
const getFrasesRandom = require('./utils/getFrasesRandom')
const clearFolders = require('./utils/clearFolders')

async function main() {
  await clearFolders('./files/videos', './files/images')

  const frasesRandom = await getFrasesRandom({
    pathFolderAudiosRecord: './files/audios',
    txtSentencesPath: './files/frases Regex.txt',
    quantidade: 100,
  })

  console.log(`Got ${frasesRandom.length} random`)
  await htmlPhoto({
    pathFileHtml: './files/index.html',
    pathFolderExport: `./files/images`,
    backgroundPath: './files/backgrounds/52905.jpg',
    contents: frasesRandom,
  })

  await audiosWithPhotos(frasesRandom)

  await joinVideosCustom({
    pathVideos: './files/videos',
    rootPath: __dirname,
    filePathOutput: 'files/output/videoCompleto',
  })
  await clearFolders('./files/videos', './files/images')
}
main()
