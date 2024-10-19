import { SendRawEmailCommand, SESClient } from '@aws-sdk/client-ses'
import { env, readFileAsBase64 } from '../utils.mjs'

const sesClient = new SESClient({ region: env('AWS_REGION', 'us-east-1') })

async function send(path) {
  const content = await readFileAsBase64(path)
  console.log('Sending email...', path, (content.length / 1024 / 1024).toFixed(2), 'MB')

  const boundary = '----=_Part_0_123456789.123456789'
  const rawEmail = [
    `From: ${env('MAILFROM')}`,
    `To: ${env('MAILTO')}`,
    'Subject: Kindle Digest',
    'MIME-Version: 1.0',
    `Content-Type: multipart/mixed; boundary="${boundary}"`,
    '',
    `--${boundary}`,
    'Content-Type: text/plain; charset=UTF-8',
    'Content-Transfer-Encoding: 7bit',
    '',
    'Please find the .epub file attached.',
    '',
    `--${boundary}`,
    'Content-Type: application/epub+zip; name="digest.epub"',
    'Content-Disposition: attachment; filename="digest.epub"',
    'Content-Transfer-Encoding: base64',
    '',
    content,
    '',
    `--${boundary}--`,
  ].join('\n')

  const params = {
    RawMessage: {
      Data: Buffer.from(rawEmail),
    },
  }

  try {
    const command = new SendRawEmailCommand(params)
    const res = await sesClient.send(command)
    console.log('Email sent successfully', res)
  }
  catch (error) {
    console.error('Error sending email', error)
  }
}

export {
  send,
}
