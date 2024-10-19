import { JSDOM } from 'jsdom'
import { $fetch, getCleanHtml } from '../utils.mjs'

const HN_API = 'https://hacker-news.firebaseio.com/v0'
const HN_URL = 'https://news.ycombinator.com'

const HN_MAX_COMMENTS = 300

async function fetchStories(num, state) {
  const ids = await $fetch(`${HN_API}/beststories.json`)

  const exclude = state?.hn?.already_sent || []
  const filtered = ids.filter(id => !exclude.includes(id))
  return await Promise.all(filtered.slice(0, num).map(id => $fetch(`${HN_API}/item/${id}.json`)))
}

async function getHNCommentsAsHml(id) {
  const comments = await getCleanHtml(`${HN_URL}/item?id=${id}`, {
    charThreshold: 400,
    nbTopCandidates: 50,
  })

  const dom = new JSDOM(comments.content)
  const indents = new Set()

  let html = '<div class="page">'
  let commentCount = 0
  for (const comment of dom.window.document.querySelectorAll('table')) {
    const indent = comment.querySelector('td[indent]').getAttribute('indent')
    const nodes = comment.querySelectorAll('td')
    if (nodes.length === 0)
      continue
    indents.add(indent)
    const c = nodes[nodes.length - 1]
    const text = c.innerHTML
    html += `<div class="indent-${indent}">${text}</div>`
    if (++commentCount >= HN_MAX_COMMENTS)
      break
  }
  html += '</div>'

  html = html.replace(/<div[^>]*>(.*?)<\/div>/gs, (match) => {
    return match.replace(/<br\s*\/?>/g, '')
  })

  const style = Array.from(indents).map((indent) => {
    return `.indent-${indent} {
    border-left: 1px solid #727272;
    padding-left: 4px;
    margin-left: ${indent * 10}px;
  }`
  }).join('\n')

  return { title: `HN - ${comments.title}`, content: html, style }
}

async function fetchHNArticles(num, state) {
  const stories = await fetchStories(num, state)

  const articles = []
  for (const story of stories) {
    console.log(`Parsing ${story.title}'`)
    if (story.url) {
      try {
        const article = await getCleanHtml(story.url).catch(_ => null)
        article && articles.push(article)
        const comments = await getHNCommentsAsHml(story.id)
        articles.push(comments)
      }
      catch (e) {
        console.error(`Could not parse '${story.title}'`, e)
      }
    }
    state.hn.already_sent.push(story.id)
  }
  state.hn.already_sent = state.hn.already_sent.slice(0, 500)

  return articles
}

export {
  fetchHNArticles,
}
