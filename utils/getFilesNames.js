const glob = require('glob')
const fs = require('fs')

async function getFilesNames(folder, format) {
  const filesList = await glob
    .sync('*.' + format, {
      cwd: `${folder}`,
    })
    .sort(function (a, b) {
      return (
        fs.statSync(`${folder}/` + a).mtime.getTime() -
        fs.statSync(`${folder}/` + b).mtime.getTime()
      )
    })
  console.log(filesList.join('\n'))
}

getFilesNames('files/videos', 'mp4')
