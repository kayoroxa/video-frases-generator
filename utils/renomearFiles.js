const glob = require('glob')
const fs = require('fs')

async function getAudios(pathFolderAudiosRecord) {
  if (!pathFolderAudiosRecord) throw new Error('getAudios precisa do path')
  return await glob.sync('*.mp3', {
    cwd: `${pathFolderAudiosRecord}`,
  })
}

async function renomearFiles(path) {
  const filesList = await getAudios(path)
  for (let fileName of filesList) {
    console.log(fileName, fileName.includes("'"))
    await fs.renameSync(
      `${path}/${fileName}`,
      `${path}/${fileName.replace("'", '').toLowerCase()}`
    )
  }
}
// module.exports = renomearFiles

renomearFiles('files/audios')
