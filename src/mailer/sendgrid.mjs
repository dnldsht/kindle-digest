import sgMail from '@sendgrid/mail'
import { env, readFileAsBase64 } from '../utils.mjs'

async function send(path) {
  const content = await readFileAsBase64(path)

  sgMail.setApiKey(env('SENDGRID_API_KEY'))
  const msg = {
    to: env('MAILTO'),
    from: env('MAILFROM'),
    subject: 'Kindle Digest',
    text: 'Please find the .epub file attached.',
    attachments: [{
      content,
      filename: 'digest.epub',
      type: 'application/epub+zip',
      disposition: 'attachment',
      contentId: 'digest.epub',
    }],
  }
  sgMail.send(msg)
}

export {
  send,
}
