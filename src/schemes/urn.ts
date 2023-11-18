import { SCHEMES } from '../uri'
import type { URIComponents, URIOptions, URISchemeHandler } from '../uri'
import { URN_PARSE } from './constants/urn'

export interface URNComponents extends URIComponents {
  nid?: string
  nss?: string
}

export interface URNOptions extends URIOptions {
  nid?: string
}

// RFC 2141
export const handler: URISchemeHandler<URNComponents, URNOptions> = {
  scheme: 'urn',

  parse(components: URNComponents, options: URNOptions): URNComponents {
    const matches = components.path && components.path.match(URN_PARSE)
    let urnComponents = components as URNComponents

    if (matches) {
      const scheme = options.scheme || urnComponents.scheme || 'urn'
      const nid = matches[1].toLowerCase()
      const nss = matches[2]
      const urnScheme = `${scheme}:${options.nid || nid}`
      const schemeHandler = SCHEMES[urnScheme]

      urnComponents.nid = nid
      urnComponents.nss = nss
      urnComponents.path = undefined

      if (schemeHandler)
        urnComponents = schemeHandler.parse(urnComponents, options) as URNComponents
    }
    else {
      urnComponents.error = urnComponents.error || 'URN can not be parsed.'
    }

    return urnComponents
  },

  serialize(urnComponents: URNComponents, options: URNOptions): URIComponents {
    const scheme = options.scheme || urnComponents.scheme || 'urn'
    const nid = urnComponents.nid
    const urnScheme = `${scheme}:${options.nid || nid}`
    const schemeHandler = SCHEMES[urnScheme]

    if (schemeHandler)
      urnComponents = schemeHandler.serialize(urnComponents, options) as URNComponents

    const uriComponents = urnComponents as URIComponents
    const nss = urnComponents.nss
    uriComponents.path = `${nid || options.nid}:${nss}`

    return uriComponents
  },
}
