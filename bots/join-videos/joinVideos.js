const exec = require('child_process').exec
const fs = require('fs')
const glob = require('glob')

async function generateTempFile(pathRoot, downloadFolder, customVideoSequence) {
  const filesList = await glob.sync('*.mp4', {
    cwd: `${pathRoot}/${downloadFolder}/`,
  })

  const listVideos = customVideoSequence || filesList

  const stringPraEscrever = listVideos
    .map(fileName => `file '${pathRoot}${downloadFolder}/${fileName}'`)
    .join('\n')

  console.log(`[BOT JOIN_VIDEOS] Joining ${JSON.stringify(filesList)}`)

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
}) {
  await generateTempFile(rootPath || './', pathVideos, customVideoSequence)
  await joinVideosInTempFile(rootPath || './', filePathOutput)
}
module.exports = joinVideos
