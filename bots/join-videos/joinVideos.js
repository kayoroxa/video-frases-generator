const exec = require('child_process').exec
const fs = require('fs')
const glob = require('glob')

async function generateTempFile(
  pathRoot,
  downloadFolder,
  customVideoSequence,
  customTemp
) {
  const filesList = await glob
    .sync('*.mp4', {
      cwd: `${pathRoot}/${downloadFolder}/`,
    })
    .sort(function (a, b) {
      return (
        fs.statSync(`${pathRoot}/${downloadFolder}/` + a).mtime.getTime() -
        fs.statSync(`${pathRoot}/${downloadFolder}/` + b).mtime.getTime()
      )
    })
  const listVideos = customVideoSequence || filesList

  const stringPraEscrever = listVideos
    .map(fileName => {
      return (
        customTemp({ pathRoot, fileName, downloadFolder }) ||
        `file '${pathRoot}${downloadFolder}/${fileName}'`
      )
    })
    .join('\n')

  fs.writeFile(
    `${pathRoot}/tempVidList.txt`,
    stringPraEscrever,
    function (erro) {
      if (erro) {
        throw 'erro ao salvar'
      }
      console.log('[BOT JOIN_VIDEOS] Creating TEMP my list file to join...')
    }
  )
}

async function execAsync(parameter) {
  return new Promise(resolve => {
    exec(parameter, (error, stdout, stderr) => {
      if (error) {
        console.error('[BOT JOIN_VIDEOS] Erro na compilação', stderr)
        // reject()
        throw 'erro na compilação'
      }
      console.log('[BOT JOIN_VIDEOS] Compilado', stdout)
      resolve()
    })
  })
}

async function joinVideosInTempFile(pathRoot, filePathOutput) {
  const filePathOutputWithoutMp4 = filePathOutput.replace('.mp4', '')
  const relativePathOutput = `${pathRoot}/${filePathOutputWithoutMp4}.mp4`
  await execAsync(
    `ffmpeg -y -f concat -safe 0 -i "tempVidList.txt" -c copy "${relativePathOutput}"`
  )
  fs.unlinkSync(`tempVidList.txt`, () => {
    console.log('[BOT JOIN_VIDEOS] TEMP mylist deleted')
  })
}

async function joinVideos({
  pathVideos,
  filePathOutput,
  rootPath,
  customVideoSequence,
  customTemp = () => false,
}) {
  await generateTempFile(
    rootPath || './',
    pathVideos,
    customVideoSequence,
    customTemp
  )
  await joinVideosInTempFile(rootPath || './', filePathOutput)
}
module.exports = joinVideos
