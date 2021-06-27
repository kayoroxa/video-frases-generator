const joinVideos = require('./joinVideos')

async function main() {
  await joinVideos({
    pathVideos: 'videos',
    exportPath: 'videos-prontos',
    filenameExport: 'output.mp4',
  })
}
main()
