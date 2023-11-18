import { SCHEMES } from './uri'

import http from './schemes/http'

import https from './schemes/https'

import ws, { WSComponents } from './schemes/ws'

import wss from './schemes/wss'

import mailto, { MailtoComponents, MailtoHeaders } from './schemes/mailto'

import urn, { URNComponents, URNOptions } from './schemes/urn'

import uuid, { UUIDComponents } from './schemes/urn-uuid'

SCHEMES.http = http
SCHEMES.https = https
SCHEMES.ws = ws
SCHEMES.wss = wss
SCHEMES.mailto = mailto
SCHEMES.urn = urn

SCHEMES.uuid = uuid

export { URNComponents, UUIDComponents, URNOptions, MailtoComponents, MailtoHeaders, WSComponents }
export * from './uri'
