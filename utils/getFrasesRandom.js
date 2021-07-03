const fs = require('fs')
const glob = require('glob')
const _ = require('lodash')

async function getAudios(pathFolderAudiosRecord) {
  if (!pathFolderAudiosRecord) throw new Error('getAudios precisa do path')
  return await glob
    .sync('*.mp3', {
      cwd: `${pathFolderAudiosRecord}`,
    })
    .map(v => v.toLowerCase().replace('.mp3', ''))
}

const strToNameFile = str => {
  try {
    return str
      .replace(/[/\\:*?"<>.!']/g, '')
      .toLowerCase()
      .trim()
  } catch (error) {
    console.log(str)
  }
}

const formatSentence = str => _.upperFirst(str.replace(/\.|,$/g, '').trim())

async function getFrases({ txtSentencesPath }) {
  const fileFrases = await fs.readFileSync(`${txtSentencesPath}`, {
    encoding: 'utf-8',
  })
  return fileFrases.split(/\r\n|\n|\r/gm).map(str => ({
    pt: str.split('///')[1].replace('\t', '').trim(),
    en: str.split('///')[0].replace('\t', '').trim(),
  }))
  // .filter((v) => (v.length > 45 ? false : true));
}

async function getFrasesWithAudio({
  pathFolderAudiosRecord,
  txtSentencesPath,
}) {
  const frases = await getFrases({ txtSentencesPath })
  const frasesSemAcentos = frases.map(v => ({
    enFile: strToNameFile(v.en),
    ptFile: strToNameFile(v.pt),
    en: formatSentence(v.en),
    pt: formatSentence(v.pt),
  }))
  const audiosNamesFormatted = await getAudios(pathFolderAudiosRecord)
  const newFrases = frasesSemAcentos.filter(
    v =>
      audiosNamesFormatted.includes(v.enFile) &&
      audiosNamesFormatted.includes(v.ptFile)
  )
  return newFrases
}

async function getFrasesRandom({
  pathFolderAudiosRecord,
  txtSentencesPath,
  quantidade,
  all = false,
}) {
  const frasesComAudios = await getFrasesWithAudio({
    pathFolderAudiosRecord,
    txtSentencesPath,
  })
  console.log(`${frasesComAudios.length} frases encontradas`)
  const frasesRandom = all
    ? frasesComAudios
    : _.sampleSize(frasesComAudios, quantidade || 10)
  return frasesRandom
}
module.exports = getFrasesRandom
