/**
 * Sincroniza variables de .env.local hacia un proyecto Vercel.
 * No imprime valores — solo nombres de variables.
 *
 * Uso:
 *   node scripts/sync-vercel-env.mjs --project landingcdr --env-file .env.local
 *   node scripts/sync-vercel-env.mjs --project stock-cdu-sanfer --env-file ../CDU/stock_cdu_Sanfer/.env.local
 */
import { readFileSync, existsSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'
import { execSync } from 'child_process'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = resolve(__dirname, '..')

function parseEnvFile(filePath) {
  const abs = resolve(root, filePath)
  if (!existsSync(abs)) {
    console.error(`No existe: ${abs}`)
    process.exit(1)
  }
  const vars = []
  for (const line of readFileSync(abs, 'utf8').split('\n')) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue
    const eq = trimmed.indexOf('=')
    if (eq === -1) continue
    const key = trimmed.slice(0, eq).trim()
    let val = trimmed.slice(eq + 1).trim()
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1)
    }
    if (key && val) vars.push({ key, val })
  }
  return vars
}

function parseArgs() {
  const args = process.argv.slice(2)
  const out = { project: 'landingcdr', envFile: '.env.local', cwd: root }
  for (let i = 0; i < args.length; i += 2) {
    const key = args[i]?.replace(/^--/, '')
    const val = args[i + 1]
    if (key === 'project') out.project = val
    if (key === 'env-file') out.envFile = val
    if (key === 'cwd') out.cwd = resolve(val)
  }
  return out
}

const { project, envFile, cwd } = parseArgs()
const vars = parseEnvFile(envFile)

console.log(`Proyecto Vercel: ${project}`)
console.log(`Archivo origen: ${envFile}`)
console.log(`Variables a sincronizar: ${vars.length}\n`)

execSync(`npx vercel link --yes --project ${project}`, { cwd, stdio: 'inherit' })

const ENVS = ['production', 'preview', 'development']
const SKIP = new Set(['VERCEL', 'VERCEL_ENV', 'VERCEL_URL'])

for (const { key, val } of vars) {
  if (SKIP.has(key) || key.startsWith('VERCEL_')) continue

  for (const env of ENVS) {
    try {
      execSync(`npx vercel env rm ${key} ${env} -y`, { cwd, stdio: 'pipe' })
    } catch {
      /* no existía */
    }
  }

  const sensitive = !key.startsWith('NEXT_PUBLIC_')
  const flag = sensitive ? ' --sensitive' : ''
  try {
    execSync(
      `npx vercel env add ${key} ${ENVS.join(' ')}${flag}`,
      { cwd, input: val, stdio: ['pipe', 'inherit', 'inherit'] },
    )
    console.log(`+ ${key} → ${ENVS.join(', ')}`)
  } catch (err) {
    console.error(`✗ ${key} (error al subir)`)
  }
}

console.log('\nVerifica con: npx vercel env ls')
console.log('Redeploy recomendado tras cambiar SSO_SECRET.')
