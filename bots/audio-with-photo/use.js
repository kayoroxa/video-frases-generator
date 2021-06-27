const audioWithPhoto = require('./audioWithPhoto')

async function main() {
  await audioWithPhoto({
    pathFileAudio: "files/YOU'RE SUCH AN INSPIRATION.mp3",
    pathFilePhoto: "files/YOU'RE SUCH AN INSPIRATION.png",
    pathExportFile: "files/YOU'RE SUCH AN INSPIRATION.mp4",
  })
}
main()
