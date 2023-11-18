import { SCHEMES } from './uri'

import http from './schemes/http'

import https from './schemes/https'

import ws from './schemes/ws'

import wss from './schemes/wss'

import mailto from './schemes/mailto'

import urn from './schemes/urn'

import uuid from './schemes/urn-uuid'

SCHEMES.http = http
SCHEMES.https = https
SCHEMES.ws = ws
SCHEMES.wss = wss
SCHEMES.mailto = mailto
SCHEMES.urn = urn

SCHEMES.uuid = uuid

export * from './uri'
