const joinVideos = require('./joinVideos')
const glob = require('glob')
const _ = require('lodash')
const fs = require('fs')

function addItemEvery(array, item, starting, frequency) {
  const newArray = []
  for (let [index, value] of array.entries()) {
    if (index === starting) newArray.push(item)
    else if ((index - starting) % frequency === 0) {
      newArray.push(item)
    }
    newArray.push(value)
  }
  return newArray
}

async function joinVideosCustom({
  pathVideos,
  filePathOutput,
  rootPath,
  sequenceLanguage,
}) {
  sequenceLanguage = sequenceLanguage || ['pt', 'en', 'en', 'en']
  const filesList = await glob
    .sync('*.mp4', {
      cwd: `${rootPath}/${pathVideos}/`,
    })
    .sort(function (a, b) {
      return (
        fs.statSync(`${rootPath}/${pathVideos}/` + a).mtime.getTime() -
        fs.statSync(`${rootPath}/${pathVideos}/` + b).mtime.getTime()
      )
    })
  console.log(filesList.slice(0, 30).join('\n'))
  // .filter(v => v.includes('('))

  // console.log('oi', filesList.join('\n'))

  const ok = _.chunk(filesList, 2).reduce((_, c) => c.length === 2)
  if (!ok) throw new Error('não existe par nas frases')

  const separada = _.chunk(filesList, 2).map(v => ({
    en: v[0].includes('_en') ? v[0] : v[1],
    pt: v[1].includes('_pt') ? v[1] : v[0],
  }))

  const acada = 100
  const acadaMaiorQTotal = acada >= separada.length - 2

  const enPtJuntoCtaSeparado = addItemEvery(
    separada,
    '500 palavras.mp4',
    20,
    acadaMaiorQTotal ? null : acada
  )

  if (acadaMaiorQTotal) enPtJuntoCtaSeparado.push('500 palavras.mp4')

  const customVideoSequence = enPtJuntoCtaSeparado.reduce(
    (p, v) =>
      typeof v === 'object'
        ? [...p, ...sequenceLanguage.map(s => v[s])]
        : [...p, v],
    []
  )

  // console.log(customVideoSequence)

  await joinVideos({
    pathVideos,
    filePathOutput,
    rootPath,
    customVideoSequence,
    customTemp: ({ pathRoot, downloadFolder, fileName }) => {
      if (!fileName.includes('(')) {
        // console.log('é cta')
        return `file '${pathRoot}./files/cta/${fileName}'`
      }
      return `file '${pathRoot}${downloadFolder}/${fileName}'`
    },
  })
}
module.exports = joinVideosCustom
