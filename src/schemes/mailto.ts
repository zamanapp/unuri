/* eslint-disable unicorn/prefer-node-protocol */
/* eslint-disable node/no-deprecated-api */
import punycode from 'punycode'
import { pctDecChars, pctEncChar, unescapeComponent } from '../uri'
import type { URIComponents, URIOptions, URISchemeHandler } from '../uri'
import { toArray, toUpperCase } from '../util'
import { NOT_HFNAME, NOT_HFVALUE, NOT_LOCAL_PART, PCT_ENCODED, UNRESERVED } from './constants/mailto'

export interface MailtoHeaders {
  [hfname: string]: string
}

export interface MailtoComponents extends URIComponents {
  to: Array<string>
  headers?: MailtoHeaders
  subject?: string
  body?: string
}

const O: MailtoHeaders = {}

function decodeUnreserved(str: string): string {
  const decStr = pctDecChars(str)
  return (!decStr.match(UNRESERVED) ? str : decStr)
}

export const handler: URISchemeHandler<MailtoComponents> = {
  scheme: 'mailto',

  parse(components: URIComponents, options: URIOptions): MailtoComponents {
    const mailtoComponents = components as MailtoComponents
    const to = mailtoComponents.to = (mailtoComponents.path ? mailtoComponents.path.split(',') : [])
    mailtoComponents.path = undefined

    if (mailtoComponents.query) {
      let unknownHeaders = false
      const headers: MailtoHeaders = {}
      const hfields = mailtoComponents.query.split('&')

      for (let x = 0, xl = hfields.length; x < xl; ++x) {
        const hfield = hfields[x].split('=')

        switch (hfield[0]) {
          case 'to':
            {
              const toAddrs = hfield[1].split(',')
              for (let x = 0, xl = toAddrs.length; x < xl; ++x)
                to.push(toAddrs[x])
            }
            break
          case 'subject':
            mailtoComponents.subject = unescapeComponent(hfield[1], options)
            break
          case 'body':
            mailtoComponents.body = unescapeComponent(hfield[1], options)
            break
          default:
            unknownHeaders = true
            headers[unescapeComponent(hfield[0], options)] = unescapeComponent(hfield[1], options)
            break
        }
      }

      if (unknownHeaders)
        mailtoComponents.headers = headers
    }

    mailtoComponents.query = undefined

    for (let x = 0, xl = to.length; x < xl; ++x) {
      const addr = to[x].split('@')

      addr[0] = unescapeComponent(addr[0])

      if (!options.unicodeSupport) {
        // convert Unicode IDN -> ASCII IDN
        try {
          addr[1] = punycode.toASCII(unescapeComponent(addr[1], options).toLowerCase())
        }
        catch (e) {
          mailtoComponents.error = mailtoComponents.error || `Email address's domain name can not be converted to ASCII via punycode: ${e}`
        }
      }
      else {
        addr[1] = unescapeComponent(addr[1], options).toLowerCase()
      }

      to[x] = addr.join('@')
    }

    return mailtoComponents
  },

  serialize(mailtoComponents: MailtoComponents, options: URIOptions): URIComponents {
    const components = mailtoComponents as URIComponents
    const to = toArray(mailtoComponents.to)
    if (to) {
      for (let x = 0, xl = to.length; x < xl; ++x) {
        const toAddr = String(to[x])
        const atIdx = toAddr.lastIndexOf('@')
        const localPart = (toAddr.slice(0, atIdx)).replace(PCT_ENCODED, decodeUnreserved).replace(PCT_ENCODED, toUpperCase).replace(NOT_LOCAL_PART, pctEncChar)
        let domain = toAddr.slice(atIdx + 1)

        // convert IDN via punycode
        try {
          domain = (!options.iri ? punycode.toASCII(unescapeComponent(domain, options).toLowerCase()) : punycode.toUnicode(domain))
        }
        catch (e) {
          components.error = components.error || `Email address's domain name can not be converted to ${!options.iri ? 'ASCII' : 'Unicode'} via punycode: ${e}`
        }

        to[x] = `${localPart}@${domain}`
      }

      components.path = to.join(',')
    }

    const headers = mailtoComponents.headers = mailtoComponents.headers || {}

    if (mailtoComponents.subject)
      headers.subject = mailtoComponents.subject
    if (mailtoComponents.body)
      headers.body = mailtoComponents.body

    const fields = []
    for (const name in headers) {
      if (headers[name] !== O[name])
        fields.push(`${name.replace(PCT_ENCODED, decodeUnreserved).replace(PCT_ENCODED, toUpperCase).replace(NOT_HFNAME, pctEncChar)}=${headers[name].replace(PCT_ENCODED, decodeUnreserved).replace(PCT_ENCODED, toUpperCase).replace(NOT_HFVALUE, pctEncChar)}`)
    }
    if (fields.length)
      components.query = fields.join('&')

    return components
  },
}
