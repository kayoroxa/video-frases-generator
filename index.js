const htmlPhoto = require('./bots/html-photo/htmlPhoto')
const audiosWithPhotos = require('./bots/audio-with-photo/audiosWithPhotos')
const joinVideosCustom = require('./bots/join-videos/joinVideosCustom')
const getFrasesRandom = require('./utils/getFrasesRandom')
const clearFolders = require('./utils/clearFolders')
const startNodeDataBase = require('data-base-node')
const db = startNodeDataBase()

const clear = false
const folderClear = ['./files/images', './files/videos']

async function main() {
  clear && (await clearFolders(...folderClear))
  const getRandom = await getFrasesRandom({
    pathFolderAudiosRecord: './files/audios',
    txtSentencesPath: './files/frases Regex.txt',
    // quantidade: 100,
    all: true,
  })
  console.log(getRandom)
  const dbFrasesRandom = db.tryLoad('frasesRandom').orStartWith(getRandom)
  clear && dbFrasesRandom.setValue(getRandom)
  dbFrasesRandom.save()
  const frasesRandom = getRandom //|| dbFrasesRandom.value()

  console.log(`Got ${frasesRandom.length} random`)
  await htmlPhoto({
    pathFileHtml: './files/index.html',
    pathFolderExport: `./files/images`,
    backgroundPath: './files/backgrounds/1.jpg',
    contents: frasesRandom,
  })
  await audiosWithPhotos(frasesRandom)
  await joinVideosCustom({
    pathVideos: './files/videos',
    rootPath: __dirname,
    filePathOutput: `files/output/${new Date()
      .toLocaleDateString()
      .replace(/\//g, '-')}`,
  })
  clear && (await clearFolders(...folderClear))
}
main()
