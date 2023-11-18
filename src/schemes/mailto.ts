/* eslint-disable unicorn/prefer-node-protocol */
/* eslint-disable node/no-deprecated-api */
import punycode from 'punycode'
import { pctDecChars, pctEncChar, unescapeComponent } from '../uri'
import type { URIComponents, URIOptions, URISchemeHandler } from '../uri'
import { merge, subExp, toArray, toUpperCase } from '../util'

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
const isIRI = true

// RFC 3986
const UNRESERVED$$ = `[A-Za-z0-9\\-\\.\\_\\~${isIRI ? '\\xA0-\\u200D\\u2010-\\u2029\\u202F-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFEF' : ''}]`
const HEXDIG$$ = '[0-9A-Fa-f]' // case-insensitive
const PCT_ENCODED$ = subExp(`${subExp(`%[EFef]${HEXDIG$$}%${HEXDIG$$}${HEXDIG$$}%${HEXDIG$$}${HEXDIG$$}`)}|${subExp(`%[89A-Fa-f]${HEXDIG$$}%${HEXDIG$$}${HEXDIG$$}`)}|${subExp(`%${HEXDIG$$}${HEXDIG$$}`)}`) // expanded

// RFC 5322, except these symbols as per RFC 6068: @ : / ? # [ ] & ; =
// const ATEXT$$ = "[A-Za-z0-9\\!\\#\\$\\%\\&\\'\\*\\+\\-\\/\\=\\?\\^\\_\\`\\{\\|\\}\\~]";
// const WSP$$ = "[\\x20\\x09]";
// const OBS_QTEXT$$ = "[\\x01-\\x08\\x0B\\x0C\\x0E-\\x1F\\x7F]";  //(%d1-8 / %d11-12 / %d14-31 / %d127)
// const QTEXT$$ = merge("[\\x21\\x23-\\x5B\\x5D-\\x7E]", OBS_QTEXT$$);  //%d33 / %d35-91 / %d93-126 / obs-qtext
// const VCHAR$$ = "[\\x21-\\x7E]";
// const WSP$$ = "[\\x20\\x09]";
// const OBS_QP$ = subExp("\\\\" + merge("[\\x00\\x0D\\x0A]", OBS_QTEXT$$));  //%d0 / CR / LF / obs-qtext
// const FWS$ = subExp(subExp(WSP$$ + "*" + "\\x0D\\x0A") + "?" + WSP$$ + "+");
// const QUOTED_PAIR$ = subExp(subExp("\\\\" + subExp(VCHAR$$ + "|" + WSP$$)) + "|" + OBS_QP$);
// const QUOTED_STRING$ = subExp('\\"' + subExp(FWS$ + "?" + QCONTENT$) + "*" + FWS$ + "?" + '\\"');
const ATEXT$$ = '[A-Za-z0-9\\!\\$\\%\\\'\\*\\+\\-\\^\\_\\`\\{\\|\\}\\~]'
const QTEXT$$ = '[\\!\\$\\%\\\'\\(\\)\\*\\+\\,\\-\\.0-9\\<\\>A-Z\\x5E-\\x7E]'
const VCHAR$$ = merge(QTEXT$$, '[\\"\\\\]')
const DOT_ATOM_TEXT$ = subExp(`${ATEXT$$}+${subExp(`\\.${ATEXT$$}+`)}*`)
const QUOTED_PAIR$ = subExp(`\\\\${VCHAR$$}`)
const QCONTENT$ = subExp(`${QTEXT$$}|${QUOTED_PAIR$}`)
const QUOTED_STRING$ = subExp(`\\"${QCONTENT$}*` + `\\"`)

// RFC 6068
const DTEXT_NO_OBS$$ = '[\\x21-\\x5A\\x5E-\\x7E]' // %d33-90 / %d94-126
const SOME_DELIMS$$ = '[\\!\\$\\\'\\(\\)\\*\\+\\,\\;\\:\\@]'
const QCHAR$ = subExp(`${UNRESERVED$$}|${PCT_ENCODED$}|${SOME_DELIMS$$}`)
const DOMAIN$ = subExp(`${DOT_ATOM_TEXT$}|` + `\\[${DTEXT_NO_OBS$$}*` + `\\]`)
const LOCAL_PART$ = subExp(`${DOT_ATOM_TEXT$}|${QUOTED_STRING$}`)
const ADDR_SPEC$ = subExp(`${LOCAL_PART$}\\@${DOMAIN$}`)
const TO$ = subExp(`${ADDR_SPEC$ + subExp(`\\,${ADDR_SPEC$}`)}*`)
const HFNAME$ = subExp(`${QCHAR$}*`)
const HFVALUE$ = HFNAME$
const HFIELD$ = subExp(`${HFNAME$}\\=${HFVALUE$}`)
const HFIELDS2$ = subExp(`${HFIELD$ + subExp(`\\&${HFIELD$}`)}*`)
const HFIELDS$ = subExp(`\\?${HFIELDS2$}`)
const MAILTO_URI = new RegExp(`^mailto\\:${TO$}?${HFIELDS$}?$`)

const UNRESERVED = new RegExp(UNRESERVED$$, 'g')
const PCT_ENCODED = new RegExp(PCT_ENCODED$, 'g')
const NOT_LOCAL_PART = new RegExp(merge('[^]', ATEXT$$, '[\\.]', '[\\"]', VCHAR$$), 'g')
const NOT_DOMAIN = new RegExp(merge('[^]', ATEXT$$, '[\\.]', '[\\[]', DTEXT_NO_OBS$$, '[\\]]'), 'g')
const NOT_HFNAME = new RegExp(merge('[^]', UNRESERVED$$, SOME_DELIMS$$), 'g')
const NOT_HFVALUE = NOT_HFNAME
const TO = new RegExp(`^${TO$}$`)
const HFIELDS = new RegExp(`^${HFIELDS2$}$`)

function decodeUnreserved(str: string): string {
  const decStr = pctDecChars(str)
  return (!decStr.match(UNRESERVED) ? str : decStr)
}

const handler: URISchemeHandler<MailtoComponents> = {
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
            const toAddrs = hfield[1].split(',')
            for (let x = 0, xl = toAddrs.length; x < xl; ++x)
              to.push(toAddrs[x])

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
      if (headers[name] !== O[name]) {
        fields.push(
          `${name.replace(PCT_ENCODED, decodeUnreserved).replace(PCT_ENCODED, toUpperCase).replace(NOT_HFNAME, pctEncChar)
					 }=${
					 headers[name].replace(PCT_ENCODED, decodeUnreserved).replace(PCT_ENCODED, toUpperCase).replace(NOT_HFVALUE, pctEncChar)}`,
        )
      }
    }
    if (fields.length)
      components.query = fields.join('&')

    return components
  },
}

export default handler
