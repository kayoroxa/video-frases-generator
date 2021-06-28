const audioWithPhoto = require('./audioWithPhoto')

async function audiosWithPhotos(frasesRandom) {
  for (const [index, frase] of frasesRandom.entries()) {
    const percentage = ((index + 1) * 100) / frasesRandom.length
    console.log('[Audio With Photo]', `${percentage}%`, frase.en, index)
    await audioWithPhoto({
      pathFileAudio: `./files/audios/${frase.enFile}.mp3`,
      pathFilePhoto: `./files/images/${frase.enFile}.png`,
      pathExportFile: `./files/videos/(${index}_en) ${frase.enFile}.mp4`,
    })
    await audioWithPhoto({
      pathFileAudio: `./files/audios/${frase.ptFile}.mp3`,
      pathFilePhoto: `./files/images/${frase.enFile}.png`,
      pathExportFile: `./files/videos/(${index}_pt) ${frase.ptFile}.mp4`,
    })
    console.log('[Audio With Photo]', `${percentage}%`, frase.pt, index)
  }
}
module.exports = audiosWithPhotos
