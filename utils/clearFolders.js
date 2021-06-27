const fs = require('fs')

async function clearFolder(...folders) {
  for (let folder of folders) {
    console.log(`[BOT ClearFolder] Clean folder ${folder}`)
    await fs.unlinkSync(folder)
    await fs.promises.mkdir(folder, { recursive: true })
  }
}
module.exports = clearFolder
