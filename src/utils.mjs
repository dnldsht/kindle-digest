import fs from 'node:fs'
import { Readability } from '@mozilla/readability'
import { JSDOM } from 'jsdom'

const $fetch = url => fetch(url).then(response => response.json())

async function getCleanHtml(url, options = {}) {
  const dom = await JSDOM.fromURL(url, { pretendToBeVisual: true })
  return new Readability(dom.window.document).parse(options)
}

async function readFileAsBase64(path) {
  return new Promise((resolve, reject) => {
    fs.readFile(path, { encoding: 'base64' }, (err, data) => {
      if (err) {
        return reject(err)
      }
      return resolve(data)
    })
  })
}

function env(name, defaultValue) {
  const value = process.env[name] ?? defaultValue
  if (typeof defaultValue === 'boolean') {
    return value === 'true'
  }
  if (typeof defaultValue === 'number') {
    return Number(value)
  }
  return value
}

function outputDir() {
  return env('OUTPUT_DIR', './output/')
}
function statePath() {
  return `${outputDir()}state.json`
}

export {
  $fetch,
  env,
  getCleanHtml,
  outputDir,
  readFileAsBase64,
  statePath,
}
