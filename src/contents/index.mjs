import { env } from '../utils.mjs'
import { fetchHNArticles } from './hn.mjs'

async function getContents(state) {
  const articles = await fetchHNArticles(env('HN_COUNT', 5), state)
  return articles
}

export { getContents }
