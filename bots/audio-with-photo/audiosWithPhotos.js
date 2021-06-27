const audioWithPhoto = require('./audioWithPhoto')

async function audiosWithPhotos(frasesRandom) {
  for (const [index, frase] of frasesRandom.entries()) {
    console.log(frase.en, index)
    await audioWithPhoto({
      pathFileAudio: `./files/audios/${frase.enFile}.mp3`,
      pathFilePhoto: `./files/images/${frase.enFile}.png`,
      pathExportFile: `./files/videos/(${index}_en) ${frase.enFile}.mp4`,
    })
    console.log(frase.pt, index)
    await audioWithPhoto({
      pathFileAudio: `./files/audios/${frase.ptFile}.mp3`,
      pathFilePhoto: `./files/images/${frase.enFile}.png`,
      pathExportFile: `./files/videos/(${index}_pt) ${frase.ptFile}.mp4`,
    })
  }
}
module.exports = audiosWithPhotos
