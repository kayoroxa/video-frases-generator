// const exec = require('child_process').exec
const fs = require('fs')
const glob = require('glob')
const ffmpeg = require('fluent-ffmpeg')

async function generateTempFile(pathRoot, downloadFolder) {
  const filesList = await glob.sync('*.mp4', {
    cwd: `${pathRoot}/${downloadFolder}/`,
  })

  const stringPraEscrever = filesList
    .map(fileName => `file '${downloadFolder}/${fileName}'`)
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
async function joinVideosInTempFile(
  pathRoot,
  readyVideosFolder,
  fileNameOutput,
  downloadFolder
) {
  const filesList = await glob.sync('*.mp4', {
    cwd: `${pathRoot}/${downloadFolder}/`,
  })
  const fileNameOutputWithoutMp4 = fileNameOutput.replace('.mp4', '')
  const relativePathOutput = `${pathRoot}/${readyVideosFolder}/${fileNameOutputWithoutMp4}.mp4`

  // ffmpeg(`${pathRoot}/tempVidList.txt`)
  //   .inputOptions(['-safe 0', '-f concat'])
  //   // .on('end', () => {
  //   //   console.log('Finished processing')
  //   //   fs.unlink(`${pathRoot}/tempVidList.txt`, () => {
  //   //     console.log('[BOT JOIN_VIDEOS] TEMP mylist deleted')
  //   //   })
  //   // })
  //   .mergeToFile(relativePathOutput)

  // let ffmpegInputs = ffmpeg()
  // for (let file of filesList) {
  //   ffmpegInputs = ffmpegInputs.input(file)
  // }
  // ffmpegInputs.mergeToFile(relativePathOutput)

  ffmpeg('./videos/CM5C1VqAlVS.mp4')
    .input('./videos/CQC191GH6GZ.mp4')
    .input('./videos/CQE1_aznqLV.mp4')
    //.input(fourthFile)
    //.input(...)
    .on('end', function () {
      console.log('files have been merged succesfully')
    })
    .on('error', function (err) {
      console.log('an error happened: ' + err.message)
    })
    .mergeToFile(relativePathOutput)
}

async function joinVideos({
  pathVideos,
  exportPath,
  filenameExport,
  rootPath,
}) {
  // await generateTempFile(rootPath || '.', pathVideos)
  await joinVideosInTempFile(rootPath || '.', exportPath, filenameExport)
}
module.exports = joinVideos
