// const NID$ = '(?:[0-9A-Za-z][0-9A-Za-z\\-]{1,31})'
// const PCT_ENCODED$ = '(?:\\%[0-9A-Fa-f]{2})'
// const TRANS$$ = '[0-9A-Za-z\\(\\)\\+\\,\\-\\.\\:\\=\\@\\;\\$\\_\\!\\*\\\'\\/\\?\\#]'
// const NSS$ = `(?:(?:${PCT_ENCODED$}|${TRANS$$})+)`

// const URN_SCHEME = new RegExp(`^urn\\:(${NID$})$`)
// const URN_PATH = new RegExp(`^(${NID$})\\:(${NSS$})$`)
export const URN_PARSE = /^([^\:]+)\:(.*)/
// // eslint-disable-next-line no-control-regex
// const URN_EXCLUDED = /[\x00-\x20\\\"\&\<\>\[\]\^\`\{\|\}\~\x7F-\xFF]/g
