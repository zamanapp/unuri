import { describe, expect, it } from 'vitest'
import { equal, normalize, parse, serialize } from '../src'

const IRI_OPTION = { iri: true, unicodeSupport: true }

describe('specs for IRI', () => {
  it('should parse properly', () => {
    const components = parse('uri://us\xA0er:pa\uD7FFss@example.com:123/o\uF900ne/t\uFDCFwo.t\uFDF0hree?q1=a1\uF8FF\uE000&q2=a2#bo\uFFEFdy', IRI_OPTION)
    expect(components).toStrictEqual({
      //   error: undefined,
      scheme: 'uri',
      //   authority: 'us\xA0er:pa\uD7FFss@example.com:123',
      userinfo: 'us\xA0er:pa\uD7FFss',
      host: 'example.com',
      port: 123,
      path: '/o\uF900ne/t\uFDCFwo.t\uFDF0hree',
      query: 'q1=a1\uF8FF\uE000&q2=a2',
      fragment: 'bo\uFFEFdy',
      reference: 'uri',
    })
  })

  it('should serialize properly', () => {
    const components = {
      scheme: 'uri',
      userinfo: 'us\xA0er:pa\uD7FFss',
      host: 'example.com',
      port: 123,
      path: '/o\uF900ne/t\uFDCFwo.t\uFDF0hree',
      query: 'q1=a1\uF8FF\uE000&q2=a2',
      fragment: 'bo\uFFEFdy\uE001',
    }
    expect(serialize(components, IRI_OPTION)).toBe('uri://us\xA0er:pa\uD7FFss@example.com:123/o\uF900ne/t\uFDCFwo.t\uFDF0hree?q1=a1\uF8FF\uE000&q2=a2#bo\uFFEFdy%EE%80%81')
  })

  it('should normalize properly', () => {
    expect(normalize('uri://www.example.org/red%09ros\xE9#red', IRI_OPTION)).toBe('uri://www.example.org/red%09ros\xE9#red')
  })

  it('should equal properly', () => {
    // example from RFC 3987
    expect(equal('example://a/b/c/%7Bfoo%7D/ros\xE9', 'eXAMPLE://a/./b/../b/%63/%7bfoo%7d/ros%C3%A9', IRI_OPTION)).toBeTruthy()
  })

  it('should convert iri to uri properly', () => {
    // example from RFC 3987
    expect(serialize(parse('uri://www.example.org/red%09ros\xE9#red', IRI_OPTION))).toBe('uri://www.example.org/red%09ros%C3%A9#red')
    // Internationalized Domain Name conversion via punycode example from RFC 3987
    expect(serialize(parse('uri://r\xE9sum\xE9.example.org', { iri: true, domainHost: true }))).toBe('uri://xn--rsum-bpad.example.org')
  })

  it('should convert uri to iri properly', () => {
    // examples from RFC 3987
    expect(serialize(parse('uri://www.example.org/D%C3%BCrst'), IRI_OPTION)).toBe('uri://www.example.org/D\xFCrst')
    expect(serialize(parse('uri://www.example.org/D%FCrst'), IRI_OPTION)).toBe('uri://www.example.org/D%FCrst')
    expect(serialize(parse('uri://xn--99zt52a.example.org/%e2%80%ae'), IRI_OPTION)).toBe('uri://xn--99zt52a.example.org/%E2%80%AE') // or uri://\u7D0D\u8C46.example.org/%E2%80%AE
    // Internationalized Domain Name conversion via punycode example from RFC 3987
    expect(serialize(parse('uri://xn--rsum-bpad.example.org', { domainHost: true }), { iri: true, domainHost: true })).toBe('uri://r\xE9sum\xE9.example.org')
  })
})
