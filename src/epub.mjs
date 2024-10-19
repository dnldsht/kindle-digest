import fs from 'node:fs'
import Epub from 'epub-gen'
import { env, outputDir } from './utils.mjs'

const today = new Date().toISOString().substring(0, 10)

async function makeEpub(contents) {
  const outDir = outputDir()
  const tempDir = env('TEMP_DIR', '/tmp/')
  const filename = `DIGEST-${today}.epub`

  const epubContents = contents.map(item => ({
    title: item.title,
    data: item.content,
  }))

  const style = contents.map(item => item.style).filter(Boolean).join('\n')

  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir)
  }

  const html = `<style>${style}</style>${epubContents.map(item => item.data).join('\n\n')}`
  fs.writeFileSync(`${outDir + filename}.html`, html)

  await new Epub({
    title: `Kindle Digest: ${today}`,
    author: 'Various Authors',
    cover: './res/cover.png',
    tocTitle: 'Contents',
    content: epubContents,
    css: style,
    tempDir,
  }, `${outDir}${filename}`).promise

  return `${outDir}${filename}`
}

function clean() {
  if (!env('CLEANUP', true)) {
    return
  }

  const dir = outputDir()
  console.log('Cleaning up', dir)
  const files = fs.readdirSync(dir)
  for (const file of files) {
    if (file.endsWith('.html') || file.endsWith('.epub')) {
      console.log('Removing', file)
      fs.unlinkSync(`${dir}/${file}`)
    }
  }
}

export {
  clean,
  makeEpub,
}
