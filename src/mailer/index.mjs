import { env } from '../utils.mjs'

async function sendToKindle(path) {
  const providerName = env('MAIL_PROVIDER', 'ses')
  const provider = await import(`./${providerName}.mjs`)
  return provider.send(path)
}

export {
  sendToKindle,
}
