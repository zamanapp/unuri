import { describe, expect, it } from 'vitest'
import { equal, escapeComponent, normalize, parse, resolve, serialize, unescapeComponent } from '../src'

describe('specs for URI', () => {
  describe('should parse properly', () => {
    it('should detect the scheme and path', () => {
      const component = parse('uri:')
      expect(component).toStrictEqual({
        // error: undefined,
        scheme: 'uri',
        userinfo: undefined,
        host: undefined,
        port: undefined,
        path: '',
        query: undefined,
        fragment: undefined,
        reference: 'absolute',
        // authority: undefined,
      })
    })

    it('detect the userInfo', () => {
      const component = parse('//@')
      expect(component).toStrictEqual({
        // error: undefined,
        scheme: undefined,
        userinfo: '',
        host: '',
        port: undefined,
        path: '',
        query: undefined,
        fragment: undefined,
        reference: 'relative',
        // authority: undefined,
      })
    })

    it('detect the host', () => {
      const component = parse('//')
      expect(component).toStrictEqual({
        // error: undefined,
        scheme: undefined,
        userinfo: undefined,
        host: '',
        port: undefined,
        path: '',
        query: undefined,
        fragment: undefined,
        reference: 'relative',
        // authority: undefined,
      })
    })

    it('detect the port', () => {
      const component = parse('//:')
      expect(component).toStrictEqual({
        // error: undefined,
        scheme: undefined,
        userinfo: undefined,
        host: '',
        port: '',
        path: '',
        query: undefined,
        fragment: undefined,
        reference: 'relative',
        // authority: undefined,
      })
    })

    it('detect the path', () => {
      const component = parse('')
      expect(component).toStrictEqual({
        // error: undefined,
        scheme: undefined,
        userinfo: undefined,
        host: undefined,
        port: undefined,
        path: '',
        query: undefined,
        fragment: undefined,
        reference: 'same-document',
        // authority: undefined,
      })
    })

    it('detect the query', () => {
      const component = parse('?')
      expect(component).toStrictEqual({
        // error: undefined,
        scheme: undefined,
        userinfo: undefined,
        host: undefined,
        port: undefined,
        path: '',
        query: '',
        fragment: undefined,
        reference: 'relative',
        // authority: undefined,
      })
    })

    it('detect the fragment', () => {
      const component = parse('#')
      expect(component).toStrictEqual({
        // error: undefined,
        scheme: undefined,
        userinfo: undefined,
        host: undefined,
        port: undefined,
        path: '',
        query: undefined,
        fragment: '',
        reference: 'same-document',
        // authority: undefined,
      })
    })

    // fragment with character tabulation
    it('detect the fragment with character tabulation', () => {
      const component = parse('#\t')
      expect(component).toStrictEqual({
        // error: undefined,
        scheme: undefined,
        userinfo: undefined,
        host: undefined,
        port: undefined,
        path: '',
        query: undefined,
        fragment: '%09',
        reference: 'same-document',
        // authority: undefined,
      })
    })

    // fragment with line feed
    it('detect the fragment with line feed', () => {
      const component = parse('#\n')
      expect(component).toStrictEqual({
        // error: undefined,
        scheme: undefined,
        userinfo: undefined,
        host: undefined,
        port: undefined,
        path: '',
        query: undefined,
        fragment: '%0A',
        reference: 'same-document',
        // authority: undefined,
      })
    })

    // fragment with line tabulation
    it('detect the fragment with line tabulation', () => {
      const component = parse('#\v')
      expect(component).toStrictEqual({
        // error: undefined,
        scheme: undefined,
        userinfo: undefined,
        host: undefined,
        port: undefined,
        path: '',
        query: undefined,
        fragment: '%0B',
        reference: 'same-document',
        // authority: undefined,
      })
    })

    // fragment with form feed
    it('detect the fragment with form feed', () => {
      const component = parse('#\f')
      expect(component).toStrictEqual({
        // error: undefined,
        scheme: undefined,
        userinfo: undefined,
        host: undefined,
        port: undefined,
        path: '',
        query: undefined,
        fragment: '%0C',
        reference: 'same-document',
        // authority: undefined,
      })
    })

    // fragment with carriage return
    it('detect the fragment with carriage return', () => {
      const component = parse('#\r')
      expect(component).toStrictEqual({
        // error: undefined,
        scheme: undefined,
        userinfo: undefined,
        host: undefined,
        port: undefined,
        path: '',
        query: undefined,
        fragment: '%0D',
        reference: 'same-document',
        // authority: undefined,
      })
    })

    it('should parse a full URI', () => {
      const component = parse('uri://user:pass@example.com:123/one/two.three?q1=a1&q2=a2#body')
      expect(component).toStrictEqual({
        scheme: 'uri',
        userinfo: 'user:pass',
        host: 'example.com',
        port: 123,
        path: '/one/two.three',
        query: 'q1=a1&q2=a2',
        fragment: 'body',
        reference: 'uri',
      })
    })

    // IPv4address
    it('should parse an IPv4 address', () => {
      const component = parse('//10.10.10.10')
      expect(component).toStrictEqual({
        scheme: undefined,
        userinfo: undefined,
        host: '10.10.10.10',
        port: undefined,
        path: '',
        query: undefined,
        fragment: undefined,
        reference: 'relative',
      })
    })

    // IPV6address
    it('should parse an IPv6 address', () => {
      const component = parse('//[2001:db8::7]')
      expect(component).toStrictEqual({
        scheme: undefined,
        userinfo: undefined,
        host: '2001:db8::7',
        port: undefined,
        path: '',
        query: undefined,
        fragment: undefined,
        reference: 'relative',
      })
    })

    // mixed IPv4address & IPv6address
    it('should parse an mixed IPv4 and IPv6 address', () => {
      const component = parse('//[::ffff:129.144.52.38]')
      expect(component).toStrictEqual({
        scheme: undefined,
        userinfo: undefined,
        host: '::ffff:129.144.52.38',
        port: undefined,
        path: '',
        query: undefined,
        fragment: undefined,
        reference: 'relative',
      })
    })

    // mixed IPv4address & reg-name, example from terion-name (https://github.com/garycourt/uri-js/issues/4)
    it('should parse an mixed IPv4 and reg-name', () => {
      const component = parse('uri://10.10.10.10.example.com/en/process')
      expect(component).toStrictEqual({
        scheme: 'uri',
        userinfo: undefined,
        host: '10.10.10.10.example.com',
        port: undefined,
        path: '/en/process',
        query: undefined,
        fragment: undefined,
        reference: 'absolute',
      })
    })

    // IPv6address, example from bkw (https://github.com/garycourt/uri-js/pull/16)
    it('should parse an IPv6 address with a path', () => {
      const component = parse('//[2606:2800:220:1:248:1893:25c8:1946]/test')
      expect(component).toStrictEqual({
        scheme: undefined,
        userinfo: undefined,
        host: '2606:2800:220:1:248:1893:25c8:1946',
        port: undefined,
        path: '/test',
        query: undefined,
        fragment: undefined,
        reference: 'relative',
      })
    })

    // IPv6address, example from RFC 5952
    it('should parse an IPv6 address with a port', () => {
      const component = parse('//[2001:db8::1]:80')
      expect(component).toStrictEqual({
        scheme: undefined,
        userinfo: undefined,
        host: '2001:db8::1',
        port: 80,
        path: '',
        query: undefined,
        fragment: undefined,
        reference: 'relative',
      })
    })

    // IPv6address with zone identifier, RFC 6874
    it('should parse an IPv6 address with a zone identifier', () => {
      const component = parse('//[fe80::a%25en1]')
      expect(component).toStrictEqual({
        scheme: undefined,
        userinfo: undefined,
        host: 'fe80::a%en1',
        port: undefined,
        path: '',
        query: undefined,
        fragment: undefined,
        reference: 'relative',
      })
    })

    // IPv6address with an unescaped interface specifier, example from pekkanikander (https://github.com/garycourt/uri-js/pull/22)
    it('should parse an IPv6 address with an unescaped interface specifier', () => {
      const component = parse('//[2001:db8::7%en0]')
      expect(component).toStrictEqual({
        scheme: undefined,
        userinfo: undefined,
        host: '2001:db8::7%en0',
        port: undefined,
        path: '',
        query: undefined,
        fragment: undefined,
        reference: 'relative',
      })
    })
  })

  describe('should serialize properly', () => {
    it('should serialize an empty component', () => {
      const components = {
        scheme: '',
        userinfo: '',
        host: '',
        port: 0,
        path: '',
        query: '',
        fragment: '',
      }
      expect(serialize(components)).toBe('//@:0?#')
    })

    it('should serialize a full component', () => {
      const components = {
        scheme: 'uri',
        userinfo: 'foo:bar',
        host: 'example.com',
        port: 1,
        path: 'path',
        query: 'query',
        fragment: 'fragment',
      }
      expect(serialize(components)).toBe('uri://foo:bar@example.com:1/path?query#fragment')
    })

    it('should serialize a string port', () => {
      const components = {
        scheme: 'uri',
        host: 'example.com',
        port: '9000',
      }
      expect(serialize(components)).toBe('uri://example.com:9000')
    })

    it('should serialize path', () => {
      // double slash path
      expect(serialize({ path: '//path' })).toBe('/%2Fpath')
      // path with colon
      expect(serialize({ path: '/path:' })).toBe('/path%3A')
      // path with question mark
      expect(serialize({ path: '/?path' })).toBe('/%3Fpath')
    })

    // mixed IPv4address & reg-name, example from terion-name (https://github.com/garycourt/uri-js/issues/4)
    it('should serialize a mixed IPv4 and reg-name', () => {
      expect(serialize({ host: '10.10.10.10.example.com' })).toBe('//10.10.10.10.example.com')
    })

    // IPv6address
    it('should serialize an IPv6 address', () => {
      // ipv6 host
      expect(serialize({ host: '[2001:db8::7]' })).toBe('//[2001:db8::7]')
      // ipv6 mixed host
      expect(serialize({ host: '::ffff:129.144.52.38' })).toBe('//[::ffff:129.144.52.38]')
      // ipv6 full host
      expect(serialize({ host: '2606:2800:220:1:248:1893:25c8:1946' })).toBe('//[2606:2800:220:1:248:1893:25c8:1946]')
    })

    // IPv6address with zone identifier, RFC 6874
    it('should serialize an IPv6 address with a zone identifier', () => {
      expect(serialize({ host: 'fe80::a%en1' })).toBe('//[fe80::a%25en1]')
      expect(serialize({ host: 'fe80::a%25en1' })).toBe('//[fe80::a%25en1]')
    })
  })

  describe('should resolve properly', () => {
    // normal examples from RFC 3986
    const base = 'uri://a/b/c/d;p?q'
    it('should handle all examples properly', () => {
      // examples from RFC 3986
      expect(resolve(base, 'g:h')).toBe('g:h')
      expect(resolve(base, 'g')).toBe('uri://a/b/c/g')
      expect(resolve(base, './g')).toBe('uri://a/b/c/g')
      expect(resolve(base, 'g/')).toBe('uri://a/b/c/g/')
      expect(resolve(base, '/g')).toBe('uri://a/g')
      expect(resolve(base, '//g')).toBe('uri://g')
      expect(resolve(base, '?y')).toBe('uri://a/b/c/d;p?y')
      expect(resolve(base, 'g?y')).toBe('uri://a/b/c/g?y')
      expect(resolve(base, '#s')).toBe('uri://a/b/c/d;p?q#s')
      expect(resolve(base, 'g#s')).toBe('uri://a/b/c/g#s')
      expect(resolve(base, 'g?y#s')).toBe('uri://a/b/c/g?y#s')
      expect(resolve(base, ';x')).toBe('uri://a/b/c/;x')
      expect(resolve(base, 'g;x')).toBe('uri://a/b/c/g;x')
      expect(resolve(base, 'g;x?y#s')).toBe('uri://a/b/c/g;x?y#s')
      expect(resolve(base, '')).toBe('uri://a/b/c/d;p?q')
      expect(resolve(base, '.')).toBe('uri://a/b/c/')
      expect(resolve(base, './')).toBe('uri://a/b/c/')
      expect(resolve(base, '..')).toBe('uri://a/b/')
      expect(resolve(base, '../')).toBe('uri://a/b/')
      expect(resolve(base, '../g')).toBe('uri://a/b/g')
      expect(resolve(base, '../..')).toBe('uri://a/')
      expect(resolve(base, '../../')).toBe('uri://a/')
      expect(resolve(base, '../../g')).toBe('uri://a/g')

      // abnormal examples from RFC 3986
      expect(resolve(base, '../../../g')).toBe('uri://a/g')
      expect(resolve(base, '../../../../g')).toBe('uri://a/g')
      expect(resolve(base, '/./g')).toBe('uri://a/g')
      expect(resolve(base, '/../g')).toBe('uri://a/g')
      expect(resolve(base, 'g.')).toBe('uri://a/b/c/g.')
      expect(resolve(base, '.g')).toBe('uri://a/b/c/.g')
      expect(resolve(base, 'g..')).toBe('uri://a/b/c/g..')
      expect(resolve(base, '..g')).toBe('uri://a/b/c/..g')
      expect(resolve(base, './../g')).toBe('uri://a/b/g')
      expect(resolve(base, './g/.')).toBe('uri://a/b/c/g/')
      expect(resolve(base, 'g/./h')).toBe('uri://a/b/c/g/h')
      expect(resolve(base, 'g/../h')).toBe('uri://a/b/c/h')
      expect(resolve(base, 'g;x=1/./y')).toBe('uri://a/b/c/g;x=1/y')
      expect(resolve(base, 'g;x=1/../y')).toBe('uri://a/b/c/y')
      expect(resolve(base, 'g?y/./x')).toBe('uri://a/b/c/g?y/./x')
      expect(resolve(base, 'g?y/../x')).toBe('uri://a/b/c/g?y/../x')
      expect(resolve(base, 'g#s/./x')).toBe('uri://a/b/c/g#s/./x')
      expect(resolve(base, 'g#s/../x')).toBe('uri://a/b/c/g#s/../x')
      expect(resolve(base, 'uri:g')).toBe('uri:g')
      expect(resolve(base, 'uri:g', { tolerant: true })).toBe('uri://a/b/c/g')

      // examples by PAEz
      expect(resolve('//www.g.com/', '/adf\ngf')).toBe('//www.g.com/adf%0Agf')
      expect(resolve('//www.g.com/error\n/bleh/bleh', '..')).toBe('//www.g.com/error%0A/')
    })
  })

  describe('should normalize properly', () => {
    it('should handle all examples properly', () => {
      // from RFC 3987
      expect(normalize('uri://www.example.org/red%09ros\xE9#red')).toBe('uri://www.example.org/red%09ros%C3%A9#red')
      // IPv4address
      expect(normalize('//192.068.001.000')).toBe('//192.68.1.0')
      // IPv6address, example from RFC 3513
      expect(normalize('http://[1080::8:800:200C:417A]/')).toBe('http://[1080::8:800:200c:417a]/')
      // IPv6address, examples from RFC 5952
      expect(normalize('//[2001:0db8::0001]/')).toBe('//[2001:db8::1]/')
      expect(normalize('//[2001:db8::1:0000:1]/')).toBe('//[2001:db8::1:0:1]/')
      expect(normalize('//[2001:db8:0:0:0:0:2:1]/')).toBe('//[2001:db8::2:1]/')
      expect(normalize('//[2001:db8:0:1:1:1:1:1]/')).toBe('//[2001:db8:0:1:1:1:1:1]/')
      expect(normalize('//[2001:0:0:1:0:0:0:1]/')).toBe('//[2001:0:0:1::1]/')
      expect(normalize('//[2001:db8:0:0:1:0:0:1]/')).toBe('//[2001:db8::1:0:0:1]/')
      expect(normalize('//[2001:DB8::1]/')).toBe('//[2001:db8::1]/')
      expect(normalize('//[0:0:0:0:0:ffff:192.0.2.1]/')).toBe('//[::ffff:192.0.2.1]/')
      // Mixed IPv4 and IPv6 address
      expect(normalize('//[1:2:3:4:5:6:192.0.2.1]/')).toBe('//[1:2:3:4:5:6:192.0.2.1]/')
      expect(normalize('//[1:2:3:4:5:6:192.068.001.000]/')).toBe('//[1:2:3:4:5:6:192.68.1.0]/')
    })
  })

  describe('should equate properly', () => {
    it('should handle all examples properly', () => {
      // test from RFC 3986
      expect(equal('example://a/b/c/%7Bfoo%7D', 'eXAMPLE://a/./b/../b/%63/%7bfoo%7d')).toBeTruthy()
      // test from RFC 3987
      expect(equal('http://example.org/~user', 'http://example.org/%7euser')).toBeTruthy()
    })
  })

  describe('should escape component properly', () => {
    it('should handle all examples properly', () => {
      let chr
      for (let d = 0; d <= 129; ++d) {
        chr = String.fromCharCode(d)
        if (!chr.match(/[\$\&\+\,\;\=]/))
          expect(escapeComponent(chr)).toStrictEqual(encodeURIComponent(chr))

        else
          expect(escapeComponent(chr)).toBe(chr)
      }
      expect(escapeComponent('\u00C0')).toStrictEqual(encodeURIComponent('\u00C0'))
      expect(escapeComponent('\u07FF')).toStrictEqual(encodeURIComponent('\u07FF'))
      expect(escapeComponent('\u0800')).toStrictEqual(encodeURIComponent('\u0800'))
      expect(escapeComponent('\u30A2')).toStrictEqual(encodeURIComponent('\u30A2'))
    })
  })

  describe('should unescape component properly', () => {
    it('should handle all examples properly', () => {
      let chr
      for (let d = 0; d <= 129; ++d) {
        chr = String.fromCharCode(d)
        expect(unescapeComponent(encodeURIComponent(chr))).toStrictEqual(chr)
      }

      expect(unescapeComponent(encodeURIComponent('\u00C0'))).toStrictEqual('\u00C0')
      expect(unescapeComponent(encodeURIComponent('\u07FF'))).toStrictEqual('\u07FF')
      expect(unescapeComponent(encodeURIComponent('\u0800'))).toStrictEqual('\u0800')
      expect(unescapeComponent(encodeURIComponent('\u30A2'))).toStrictEqual('\u30A2')
    })
  })
})
