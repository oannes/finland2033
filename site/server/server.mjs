// Finland 2033 — workshop game server.
// In the vein of wargame-multiplayer: in-memory games keyed by 5-char codes,
// each team on its own device, simultaneous secret submissions, polling clients.
// Resolution itself is deterministic and runs client-side (same content + same
// choices + same seed → same outcome on every screen); this server only
// synchronizes lobby, stage, role claims and submissions.

import http from 'node:http'
import crypto from 'node:crypto'
import { createReadStream, existsSync, statSync } from 'node:fs'
import { extname, join, normalize } from 'node:path'
import { fileURLToPath } from 'node:url'

const PORT = process.env.PORT || 8787
const DIST = fileURLToPath(new URL('../dist', import.meta.url))

const ACTORS = ['PM', 'AALTO', 'STARTUP', 'SAK', 'HVK', 'COUNTY', 'TI']
const STAGES = ['lobby', 'briefing', 'tension', 'decide', 'reveal', 'endstate']

const games = new Map()
const CODE_ALPHABET = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789'

function newCode() {
  for (;;) {
    let c = ''
    for (let i = 0; i < 5; i++) c += CODE_ALPHABET[crypto.randomInt(CODE_ALPHABET.length)]
    if (!games.has(c)) return c
  }
}

function newGame() {
  const game = {
    code: newCode(),
    seed: crypto.randomInt(1, 2 ** 31),
    hostToken: crypto.randomUUID(),
    createdAt: Date.now(),
    revision: 1,
    stage: 'lobby',
    phaseIdx: 0, // 0..2
    roles: Object.fromEntries(ACTORS.map((a) => [a, null])), // actor → token
    submissions: { 1: {}, 2: {}, 3: {} }, // phase number → actor → actionId
  }
  games.set(game.code, game)
  return game
}

// drop games older than 24h
setInterval(() => {
  const cutoff = Date.now() - 24 * 3600 * 1000
  for (const [code, g] of games) if (g.createdAt < cutoff) games.delete(code)
}, 3600 * 1000).unref()

const actorOf = (game, token) => ACTORS.find((a) => game.roles[a] === token) ?? null

function stateFor(game, token) {
  const you = actorOf(game, token)
  const phaseNum = game.phaseIdx + 1
  const revealed = {}
  for (const p of [1, 2, 3]) {
    if (p < phaseNum || (p === phaseNum && (game.stage === 'reveal' || game.stage === 'endstate'))) {
      revealed[p] = game.submissions[p]
    }
  }
  const claimed = ACTORS.filter((a) => game.roles[a])
  return {
    code: game.code,
    revision: game.revision,
    stage: game.stage,
    phaseIdx: game.phaseIdx,
    seed: game.seed,
    roles: Object.fromEntries(ACTORS.map((a) => [a, !!game.roles[a]])),
    you,
    isHost: token === game.hostToken,
    submitted: Object.fromEntries(claimed.map((a) => [a, game.submissions[phaseNum]?.[a] !== undefined])),
    submissions: revealed,
  }
}

function advance(game) {
  switch (game.stage) {
    case 'lobby':
      if (!ACTORS.some((a) => game.roles[a])) return 'At least one team must claim an actor first.'
      game.stage = 'briefing'
      break
    case 'briefing':
      game.stage = 'decide'
      break
    case 'tension': // legacy stage; flows now go briefing → decide directly
      game.stage = 'decide'
      break
    case 'decide':
      game.stage = 'reveal' // force: unsubmitted teams become simulated
      break
    case 'reveal':
      if (game.phaseIdx < 2) {
        game.phaseIdx += 1
        game.stage = 'decide'
      } else {
        game.stage = 'endstate'
      }
      break
    default:
      return 'Nothing to advance.'
  }
  game.revision++
  return null
}

function json(res, status, body) {
  const data = JSON.stringify(body)
  res.writeHead(status, {
    'content-type': 'application/json',
    'access-control-allow-origin': '*',
    'access-control-allow-headers': 'content-type',
    'access-control-allow-methods': 'GET,POST,OPTIONS',
  })
  res.end(data)
}

async function readBody(req) {
  let raw = ''
  for await (const chunk of req) raw += chunk
  try {
    return raw ? JSON.parse(raw) : {}
  } catch {
    return {}
  }
}

const MIME = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
}

function serveStatic(req, res, pathname) {
  if (!existsSync(DIST)) {
    json(res, 404, { error: 'No production build. In dev, use the Vite server (port 5173).' })
    return
  }
  let file = normalize(join(DIST, pathname === '/' ? 'index.html' : pathname))
  if (!file.startsWith(DIST)) return json(res, 403, { error: 'forbidden' })
  if (!existsSync(file) || statSync(file).isDirectory()) file = join(DIST, 'index.html')
  res.writeHead(200, { 'content-type': MIME[extname(file)] ?? 'application/octet-stream' })
  createReadStream(file).pipe(res)
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`)
  const path = url.pathname

  if (req.method === 'OPTIONS') return json(res, 204, {})

  if (path === '/healthz') return json(res, 200, { status: 'ok', games: games.size })

  if (!path.startsWith('/api/')) {
    if (req.method === 'GET') return serveStatic(req, res, path)
    return json(res, 404, { error: 'not found' })
  }

  // POST /api/games
  if (path === '/api/games' && req.method === 'POST') {
    const game = newGame()
    return json(res, 200, { code: game.code, token: game.hostToken, seed: game.seed })
  }

  const m = path.match(/^\/api\/games\/([A-Z0-9]{5})(?:\/(\w+))?$/)
  if (!m) return json(res, 404, { error: 'not found' })
  const game = games.get(m[1])
  if (!game) return json(res, 404, { error: `No game with code ${m[1]}. It may have expired (server restart wipes games).` })
  const sub = m[2]

  // GET /api/games/:code/state?token=X
  if (sub === 'state' && req.method === 'GET') {
    return json(res, 200, stateFor(game, url.searchParams.get('token')))
  }

  if (req.method !== 'POST') return json(res, 405, { error: 'method not allowed' })
  const body = await readBody(req)

  // POST /api/games/:code/join { actor, token? }
  if (sub === 'join') {
    const actor = body.actor
    if (!ACTORS.includes(actor)) return json(res, 400, { error: 'Unknown actor.' })
    const token = body.token || crypto.randomUUID()
    const current = actorOf(game, token)
    if (game.roles[actor] && game.roles[actor] !== token)
      return json(res, 403, { error: `${actor} is already claimed by another team.` })
    if (current && current !== actor) game.roles[current] = null // switch seats in lobby
    game.roles[actor] = token
    game.revision++
    return json(res, 200, { token, state: stateFor(game, token) })
  }

  // POST /api/games/:code/submit { token, actionId }
  if (sub === 'submit') {
    const actor = actorOf(game, body.token)
    if (!actor) return json(res, 403, { error: 'You have not claimed an actor in this game.' })
    if (game.stage !== 'decide') return json(res, 409, { error: 'Decisions are not open right now.' })
    if (typeof body.actionId !== 'string') return json(res, 400, { error: 'Missing actionId.' })
    game.submissions[game.phaseIdx + 1][actor] = body.actionId
    game.revision++
    const claimed = ACTORS.filter((a) => game.roles[a])
    const allIn = claimed.every((a) => game.submissions[game.phaseIdx + 1][a] !== undefined)
    if (allIn) {
      game.stage = 'reveal'
      game.revision++
    }
    return json(res, 200, { state: stateFor(game, body.token) })
  }

  // POST /api/games/:code/advance { token }
  if (sub === 'advance') {
    if (body.token !== game.hostToken) return json(res, 403, { error: 'Only the facilitator (game creator) can advance the game.' })
    const err = advance(game)
    if (err) return json(res, 409, { error: err })
    return json(res, 200, { state: stateFor(game, body.token) })
  }

  return json(res, 404, { error: 'not found' })
})

server.listen(PORT, '0.0.0.0', () => {
  console.log(`[finland2033] game server on http://0.0.0.0:${PORT} (stages: ${STAGES.join(' → ')})`)
})
