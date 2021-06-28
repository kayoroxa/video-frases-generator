const fs = require('fs')
const path = require('path')

async function clearFolder(...folders) {
  for (let folder of folders) {
    console.log(`[BOT ClearFolder] Clean folder ${folder}...`)
    const files = await fs.readdirSync(folder)

    for (const file of files) {
      await fs.unlinkSync(path.join(folder, file))
    }
  }
  console.log('[BOT ClearFolder] Finished')
}
module.exports = clearFolder
