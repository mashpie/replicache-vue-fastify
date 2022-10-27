import { readFileSync } from 'fs'
import desm from 'desm'
import { dirname, filename, join } from 'desm'

/**
 * like const { name } = require('./package.json')
 */
const json = (metaUrl, file) => JSON.parse(readFileSync(join(metaUrl, file)))

/**
 * like if (!module.parent)
 */
const isMain = (metaUrl) => filename(metaUrl) === process.argv[1]

export { dirname, filename, join, json, isMain }
export default desm
