import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import { statePath } from './utils.mjs'

const DEFAULT_STATE = {
  hn: {
    already_sent: [],
  },
}
export function loadState() {
  const path = statePath()
  if (!existsSync(path)) {
    return DEFAULT_STATE
  }
  const a = readFileSync(path)
  return JSON.parse(a)
}

export function saveState(state) {
  const path = statePath()
  writeFileSync(path, JSON.stringify(state))
}
