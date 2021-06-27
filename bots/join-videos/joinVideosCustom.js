const joinVideos = require('./joinVideos')
const glob = require('glob')
const _ = require('lodash')

async function joinVideosCustom({ pathVideos, filePathOutput, rootPath }) {
  const filesList = await glob.sync('*.mp4', {
    cwd: `${rootPath}/${pathVideos}/`,
  })

  const ok = _.chunk(filesList, 2).reduce((_, c) => c.length === 2)
  if (!ok) throw new Error('não existe par nas frases')

  const separada = _.chunk(filesList, 2).map(v => ({
    en: v[0].includes('_en') ? v[0] : v[1],
    pt: v[1].includes('_pt') ? v[1] : v[0],
  }))

  const customVideoSequence = separada.reduce(
    (p, v) => [...p, v.pt, v.en, v.en, v.en],
    []
  )
  console.log(customVideoSequence)

  await joinVideos({
    pathVideos,
    filePathOutput,
    rootPath,
    customVideoSequence,
  })
}
module.exports = joinVideosCustom
