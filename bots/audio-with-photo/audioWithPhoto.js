const ffmpeg = require('fluent-ffmpeg')

async function audioWithPhoto({
  pathFileAudio,
  pathFilePhoto,
  pathExportFile,
}) {
  function ffmpegSync() {
    return new Promise(resolve => {
      ffmpeg()
        .mergeAdd(pathFilePhoto)
        .inputOptions('-loop 1')
        .mergeAdd(pathFileAudio)
        // .fps(25)
        .outputOptions('-shortest')
        .on('end', () => {
          resolve()
        })
        .save(pathExportFile)
    })
  }
  await ffmpegSync()

  // .run()

  // await exec(
  // ` ffmpeg -loop 1 -y -i "${pathFilePhoto}" -i "${pathFileAudio}" -i "${pathFileAudio}" -shortest "${pathExportFile}"`,
  // `ffmpeg -r 1 -loop 1 -i "${pathFilePhoto}" -i "${pathFileAudio}" -acodec copy -r 1 -shortest "${pathExportFile}"`,
  // `ffmpeg -i "${pathFilePhoto}" -i "${pathFileAudio}" "${pathExportFile}"`,
  // `ffmpeg -i "${pathFilePhoto}" -i "${pathFileAudio}" "${pathExportFile}"`,
  // (error, stdout, stderr) => {
  //   if (error) {
  //     console.error('[BOT JOIN_VIDEOS] Erro na compilação', stderr)
  //     throw 'erro na compilação'
  //   }
  // }
  // )
}
module.exports = audioWithPhoto
