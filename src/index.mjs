import { getContents } from './contents/index.mjs'
import { clean as cleanEpubFiles, makeEpub } from './epub.mjs'
import { sendToKindle } from './mailer/index.mjs'

import { loadState, saveState } from './state.mjs'

export async function handler() {
  const state = loadState()
  console.log('Loading state', state)
  console.info('Loading contents')
  const contents = await getContents(state)
  console.info('Making epub')
  const epubPath = await makeEpub(contents)
  console.info('Sending to kindle')
  await sendToKindle(epubPath)
  console.info('Done')
  cleanEpubFiles()
  console.info('Saving state', state)
  saveState(state)

  return {
    statusCode: 200,
    body: JSON.stringify({ message: 'Success' }),
  }
}
