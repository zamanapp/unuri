import { SCHEMES } from './uri'

import http from './schemes/http'

import https from './schemes/https'

import { handler as ws } from './schemes/ws'
import type { WSComponents } from './schemes/ws'

import wss from './schemes/wss'

import { handler as mailto } from './schemes/mailto'
import type { MailtoComponents, MailtoHeaders } from './schemes/mailto'

import { handler as urn } from './schemes/urn'
import type { URNComponents, URNOptions } from './schemes/urn'

import { handler as uuid } from './schemes/urn-uuid'
import type { UUIDComponents } from './schemes/urn-uuid'

SCHEMES.http = http
SCHEMES.https = https
SCHEMES.ws = ws
SCHEMES.wss = wss
SCHEMES.mailto = mailto
SCHEMES.urn = urn

SCHEMES.uuid = uuid

export { URNComponents, UUIDComponents, URNOptions, MailtoComponents, MailtoHeaders, WSComponents }
export * from './uri'
