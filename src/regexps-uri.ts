import type { URIRegExps } from './uri'
import { merge, subExp } from './util'

export function buildExps(isIRI: boolean): URIRegExps {
  const
    ALPHA$$ = '[A-Za-z]'
  const CR$ = '[\\x0D]'
  const DIGIT$$ = '[0-9]'
  const DQUOTE$$ = '[\\x22]'
  const HEXDIG$$ = merge(DIGIT$$, '[A-Fa-f]') // case-insensitive
  const LF$$ = '[\\x0A]'
  const SP$$ = '[\\x20]'
  const PCT_ENCODED$ = subExp(`${subExp(`%[EFef]${HEXDIG$$}%${HEXDIG$$}${HEXDIG$$}%${HEXDIG$$}${HEXDIG$$}`)}|${subExp(`%[89A-Fa-f]${HEXDIG$$}%${HEXDIG$$}${HEXDIG$$}`)}|${subExp(`%${HEXDIG$$}${HEXDIG$$}`)}`) // expanded
  const GEN_DELIMS$$ = '[\\:\\/\\?\\#\\[\\]\\@]'
  const SUB_DELIMS$$ = '[\\!\\$\\&\\\'\\(\\)\\*\\+\\,\\;\\=]'
  const RESERVED$$ = merge(GEN_DELIMS$$, SUB_DELIMS$$)
  const UCSCHAR$$ = isIRI ? '[\\xA0-\\u200D\\u2010-\\u2029\\u202F-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFEF]' : '[]' // subset, excludes bidi control characters
  const IPRIVATE$$ = isIRI ? '[\\uE000-\\uF8FF]' : '[]' // subset
  const UNRESERVED$$ = merge(ALPHA$$, DIGIT$$, '[\\-\\.\\_\\~]', UCSCHAR$$)
  const SCHEME$ = subExp(`${ALPHA$$ + merge(ALPHA$$, DIGIT$$, '[\\+\\-\\.]')}*`)
  const USERINFO$ = subExp(`${subExp(`${PCT_ENCODED$}|${merge(UNRESERVED$$, SUB_DELIMS$$, '[\\:]')}`)}*`)
  const DEC_OCTET$ = subExp(`${subExp('25[0-5]')}|${subExp(`2[0-4]${DIGIT$$}`)}|${subExp(`1${DIGIT$$}${DIGIT$$}`)}|${subExp(`[1-9]${DIGIT$$}`)}|${DIGIT$$}`)
  const DEC_OCTET_RELAXED$ = subExp(`${subExp('25[0-5]')}|${subExp(`2[0-4]${DIGIT$$}`)}|${subExp(`1${DIGIT$$}${DIGIT$$}`)}|${subExp(`0?[1-9]${DIGIT$$}`)}|0?0?${DIGIT$$}`) // relaxed parsing rules
  const IPV4ADDRESS$ = subExp(`${DEC_OCTET_RELAXED$}\\.${DEC_OCTET_RELAXED$}\\.${DEC_OCTET_RELAXED$}\\.${DEC_OCTET_RELAXED$}`)
  const H16$ = subExp(`${HEXDIG$$}{1,4}`)
  const LS32$ = subExp(`${subExp(`${H16$}\\:${H16$}`)}|${IPV4ADDRESS$}`)
  const IPV6ADDRESS1$ = subExp(`${subExp(`${H16$}\\:`)}{6}${LS32$}`) //                           6( h16 ":" ) ls32
  const IPV6ADDRESS2$ = subExp(`\\:\\:${subExp(`${H16$}\\:`)}{5}${LS32$}`) //                      "::" 5( h16 ":" ) ls32
  const IPV6ADDRESS3$ = subExp(`${subExp(H16$)}?\\:\\:${subExp(`${H16$}\\:`)}{4}${LS32$}`) // [               h16 ] "::" 4( h16 ":" ) ls32
  const IPV6ADDRESS4$ = subExp(`${subExp(`${subExp(`${H16$}\\:`)}{0,1}${H16$}`)}?\\:\\:${subExp(`${H16$}\\:`)}{3}${LS32$}`) // [ *1( h16 ":" ) h16 ] "::" 3( h16 ":" ) ls32
  const IPV6ADDRESS5$ = subExp(`${subExp(`${subExp(`${H16$}\\:`)}{0,2}${H16$}`)}?\\:\\:${subExp(`${H16$}\\:`)}{2}${LS32$}`) // [ *2( h16 ":" ) h16 ] "::" 2( h16 ":" ) ls32
  const IPV6ADDRESS6$ = subExp(`${subExp(`${subExp(`${H16$}\\:`)}{0,3}${H16$}`)}?\\:\\:${H16$}\\:${LS32$}`) // [ *3( h16 ":" ) h16 ] "::"    h16 ":"   ls32
  const IPV6ADDRESS7$ = subExp(`${subExp(`${subExp(`${H16$}\\:`)}{0,4}${H16$}`)}?\\:\\:${LS32$}`) // [ *4( h16 ":" ) h16 ] "::"              ls32
  const IPV6ADDRESS8$ = subExp(`${subExp(`${subExp(`${H16$}\\:`)}{0,5}${H16$}`)}?\\:\\:${H16$}`) // [ *5( h16 ":" ) h16 ] "::"              h16
  const IPV6ADDRESS9$ = subExp(`${subExp(`${subExp(`${H16$}\\:`)}{0,6}${H16$}`)}?\\:\\:`) // [ *6( h16 ":" ) h16 ] "::"
  const IPV6ADDRESS$ = subExp([IPV6ADDRESS1$, IPV6ADDRESS2$, IPV6ADDRESS3$, IPV6ADDRESS4$, IPV6ADDRESS5$, IPV6ADDRESS6$, IPV6ADDRESS7$, IPV6ADDRESS8$, IPV6ADDRESS9$].join('|'))
  const ZONEID$ = subExp(`${subExp(`${UNRESERVED$$}|${PCT_ENCODED$}`)}+`) // RFC 6874
  const IPV6ADDRZ$ = subExp(`${IPV6ADDRESS$}\\%25${ZONEID$}`) // RFC 6874
  const IPV6ADDRZ_RELAXED$ = subExp(IPV6ADDRESS$ + subExp(`\\%25|\\%(?!${HEXDIG$$}{2})`) + ZONEID$) // RFC 6874, with relaxed parsing rules
  const IPVFUTURE$ = subExp(`[vV]${HEXDIG$$}+\\.${merge(UNRESERVED$$, SUB_DELIMS$$, '[\\:]')}+`)
  const IP_LITERAL$ = subExp(`\\[${subExp(`${IPV6ADDRZ_RELAXED$}|${IPV6ADDRESS$}|${IPVFUTURE$}`)}\\]`) // RFC 6874
  const REG_NAME$ = subExp(`${subExp(`${PCT_ENCODED$}|${merge(UNRESERVED$$, SUB_DELIMS$$)}`)}*`)
  const HOST$ = subExp(`${IP_LITERAL$}|${IPV4ADDRESS$}(?!${REG_NAME$})` + `|${REG_NAME$}`)
  const PORT$ = subExp(`${DIGIT$$}*`)
  const AUTHORITY$ = subExp(`${subExp(`${USERINFO$}@`)}?${HOST$}${subExp(`\\:${PORT$}`)}?`)
  const PCHAR$ = subExp(`${PCT_ENCODED$}|${merge(UNRESERVED$$, SUB_DELIMS$$, '[\\:\\@]')}`)
  const SEGMENT$ = subExp(`${PCHAR$}*`)
  const SEGMENT_NZ$ = subExp(`${PCHAR$}+`)
  const SEGMENT_NZ_NC$ = subExp(`${subExp(`${PCT_ENCODED$}|${merge(UNRESERVED$$, SUB_DELIMS$$, '[\\@]')}`)}+`)
  const PATH_ABEMPTY$ = subExp(`${subExp(`\\/${SEGMENT$}`)}*`)
  const PATH_ABSOLUTE$ = subExp(`\\/${subExp(SEGMENT_NZ$ + PATH_ABEMPTY$)}?`) // simplified
  const PATH_NOSCHEME$ = subExp(SEGMENT_NZ_NC$ + PATH_ABEMPTY$) // simplified
  const PATH_ROOTLESS$ = subExp(SEGMENT_NZ$ + PATH_ABEMPTY$) // simplified
  const PATH_EMPTY$ = `(?!${PCHAR$})`
  const PATH$ = subExp(`${PATH_ABEMPTY$}|${PATH_ABSOLUTE$}|${PATH_NOSCHEME$}|${PATH_ROOTLESS$}|${PATH_EMPTY$}`)
  const QUERY$ = subExp(`${subExp(`${PCHAR$}|${merge('[\\/\\?]', IPRIVATE$$)}`)}*`)
  const FRAGMENT$ = subExp(`${subExp(`${PCHAR$}|[\\/\\?]`)}*`)
  const HIER_PART$ = subExp(`${subExp(`\\/\\/${AUTHORITY$}${PATH_ABEMPTY$}`)}|${PATH_ABSOLUTE$}|${PATH_ROOTLESS$}|${PATH_EMPTY$}`)
  const URI$ = subExp(`${SCHEME$}\\:${HIER_PART$}${subExp(`\\?${QUERY$}`)}?${subExp(`\\#${FRAGMENT$}`)}?`)
  const RELATIVE_PART$ = subExp(`${subExp(`\\/\\/${AUTHORITY$}${PATH_ABEMPTY$}`)}|${PATH_ABSOLUTE$}|${PATH_NOSCHEME$}|${PATH_EMPTY$}`)
  const RELATIVE$ = subExp(`${RELATIVE_PART$ + subExp(`\\?${QUERY$}`)}?${subExp(`\\#${FRAGMENT$}`)}?`)
  const URI_REFERENCE$ = subExp(`${URI$}|${RELATIVE$}`)
  const ABSOLUTE_URI$ = subExp(`${SCHEME$}\\:${HIER_PART$}${subExp(`\\?${QUERY$}`)}?`)

  const GENERIC_REF$ = `^(${SCHEME$})\\:${subExp(`${subExp(`\\/\\/(${subExp(`(${USERINFO$})@`)}?(${HOST$})${subExp(`\\:(${PORT$})`)}?)`)}?(${PATH_ABEMPTY$}|${PATH_ABSOLUTE$}|${PATH_ROOTLESS$}|${PATH_EMPTY$})`)}${subExp(`\\?(${QUERY$})`)}?${subExp(`\\#(${FRAGMENT$})`)}?$`
  const RELATIVE_REF$ = `^(){0}${subExp(`${subExp(`\\/\\/(${subExp(`(${USERINFO$})@`)}?(${HOST$})${subExp(`\\:(${PORT$})`)}?)`)}?(${PATH_ABEMPTY$}|${PATH_ABSOLUTE$}|${PATH_NOSCHEME$}|${PATH_EMPTY$})`)}${subExp(`\\?(${QUERY$})`)}?${subExp(`\\#(${FRAGMENT$})`)}?$`
  const ABSOLUTE_REF$ = `^(${SCHEME$})\\:${subExp(`${subExp(`\\/\\/(${subExp(`(${USERINFO$})@`)}?(${HOST$})${subExp(`\\:(${PORT$})`)}?)`)}?(${PATH_ABEMPTY$}|${PATH_ABSOLUTE$}|${PATH_ROOTLESS$}|${PATH_EMPTY$})`)}${subExp(`\\?(${QUERY$})`)}?$`
  const SAMEDOC_REF$ = `^${subExp(`\\#(${FRAGMENT$})`)}?$`
  const AUTHORITY_REF$ = `^${subExp(`(${USERINFO$})@`)}?(${HOST$})${subExp(`\\:(${PORT$})`)}?$`

  return {
    NOT_SCHEME: new RegExp(merge('[^]', ALPHA$$, DIGIT$$, '[\\+\\-\\.]'), 'g'),
    NOT_USERINFO: new RegExp(merge('[^\\%\\:]', UNRESERVED$$, SUB_DELIMS$$), 'g'),
    NOT_HOST: new RegExp(merge('[^\\%\\[\\]\\:]', UNRESERVED$$, SUB_DELIMS$$), 'g'),
    NOT_PATH: new RegExp(merge('[^\\%\\/\\:\\@]', UNRESERVED$$, SUB_DELIMS$$), 'g'),
    NOT_PATH_NOSCHEME: new RegExp(merge('[^\\%\\/\\@]', UNRESERVED$$, SUB_DELIMS$$), 'g'),
    NOT_QUERY: new RegExp(merge('[^\\%]', UNRESERVED$$, SUB_DELIMS$$, '[\\:\\@\\/\\?]', IPRIVATE$$), 'g'),
    NOT_FRAGMENT: new RegExp(merge('[^\\%]', UNRESERVED$$, SUB_DELIMS$$, '[\\:\\@\\/\\?]'), 'g'),
    ESCAPE: new RegExp(merge('[^]', UNRESERVED$$, SUB_DELIMS$$), 'g'),
    UNRESERVED: new RegExp(UNRESERVED$$, 'g'),
    OTHER_CHARS: new RegExp(merge('[^\\%]', UNRESERVED$$, RESERVED$$), 'g'),
    PCT_ENCODED: new RegExp(PCT_ENCODED$, 'g'),
    IPV4ADDRESS: new RegExp(`^(${IPV4ADDRESS$})$`),
    IPV6ADDRESS: new RegExp(`^\\[?(${IPV6ADDRESS$})${subExp(`${subExp(`\\%25|\\%(?!${HEXDIG$$}{2})`)}(${ZONEID$})`)}?\\]?$`), // RFC 6874, with relaxed parsing rules
  }
}

export default buildExps(false)
