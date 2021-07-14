const fs = require('fs')
const path = require('path')

async function clearFolder({ folders, notFiles }) {
  folders = typeof folders === 'string' ? [folders] : folders
  for (let folder of folders) {
    console.log(`[BOT ClearFolder] Clean folder ${folder}...`)
    const files = await fs.readdirSync(folder)

    for (const file of files) {
      if (!notFiles?.includes(file))
        await fs.unlinkSync(path.join(folder, file))
    }
  }
  console.log('[BOT ClearFolder] Finished')
}
module.exports = clearFolder
