import type { URISchemeHandler } from '../uri'
import { UUID } from './constants/urn-uuid'
import type { URNComponents, URNOptions } from './urn'

export interface UUIDComponents extends URNComponents {
  uuid?: string
}

// RFC 4122
export const handler: URISchemeHandler<UUIDComponents, URNOptions, URNComponents> = {
  scheme: 'urn:uuid',

  parse(urnComponents: UUIDComponents, options: URNOptions): UUIDComponents {
    const uuidComponents = urnComponents as UUIDComponents
    uuidComponents.uuid = uuidComponents.nss
    uuidComponents.nss = undefined

    if (!options.tolerant && (!uuidComponents.uuid || !uuidComponents.uuid.match(UUID)))
      uuidComponents.error = uuidComponents.error || 'UUID is not valid.'

    return uuidComponents
  },

  serialize(uuidComponents: UUIDComponents, _: URNOptions): URNComponents {
    const urnComponents = uuidComponents as URNComponents
    // normalize UUID
    urnComponents.nss = (uuidComponents.uuid || '').toLowerCase()
    return urnComponents
  },
}
