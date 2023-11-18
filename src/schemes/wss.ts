import type { URISchemeHandler } from '../uri'
import { handler as ws } from './ws'

const handler: URISchemeHandler = {
  scheme: 'wss',
  domainHost: ws.domainHost,
  parse: ws.parse,
  serialize: ws.serialize,
}

export default handler
