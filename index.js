const htmlPhoto = require('./bots/html-photo/htmlPhoto')
const audiosWithPhotos = require('./bots/audio-with-photo/audiosWithPhotos')
const joinVideosCustom = require('./bots/join-videos/joinVideosCustom')
const getFrasesRandom = require('./utils/getFrasesRandom')
const clearFolders = require('./utils/clearFolders')
const startNodeDataBase = require('data-base-node')
const db = startNodeDataBase()
const typeCheck = require('type-check').typeCheck
const config = require('./config')

const clear = config.clear
const folderClear = config.folderClear

const Interface = `{
  clear: Boolean,
  folderClear: [String],
  quantidadeSentences: Number,
  backgroundPath: String,
  filter : Function | Undefined,
}`

async function main() {
  if (!typeCheck(Interface, config)) throw '>> Config not valid! <<'
  clear && (await clearFolders({ folders: folderClear }))
  const getRandom = await getFrasesRandom({
    pathFolderAudiosRecord: './files/audios',
    txtSentencesPath: './files/frases Regex.txt',
    quantidade: config.quantidadeSentences,
    filter: config.filter,
    // all: true,
  })
  console.log(getRandom)
  const dbFrasesRandom = db.tryLoad('frasesRandom').orStartWith(getRandom)
  clear && dbFrasesRandom.setValue(getRandom)
  dbFrasesRandom.save()
  const frasesRandom = getRandom //dbFrasesRandom.value()

  console.log(`Got ${frasesRandom.length} random`)
  await htmlPhoto({
    pathFileHtml: './files/index.html',
    pathFolderExport: `./files/images`,
    backgroundPath: config.backgroundPath,
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
  clear && (await clearFolders({ folders: folderClear }))
}
main()
