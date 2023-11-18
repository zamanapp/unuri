import { describe, expect, it } from 'vitest'
import { equal } from '../src'

describe('http schema specs', () => {
  describe('should equate properly', () => {
    it('should equate http', () => {
      // test from RFC 2616
      expect(equal('http://abc.com:80/~smith/home.html', 'http://abc.com/~smith/home.html')).toBeTruthy()
      expect(equal('http://ABC.com/%7Esmith/home.html', 'http://abc.com/~smith/home.html')).toBeTruthy()
      expect(equal('http://ABC.com:/%7esmith/home.html', 'http://abc.com/~smith/home.html')).toBeTruthy()
      expect(equal('HTTP://ABC.COM', 'http://abc.com/')).toBeTruthy()
      // test from RFC 3986
      expect(equal('http://example.com', 'http://example.com:80/')).toBeTruthy()
    })

    it('should equate https', () => {
      expect(equal('https://example.com', 'https://example.com:443/')).toBeTruthy()
      expect(equal('https://example.com:/', 'https://example.com:443/')).toBeTruthy()
    })
  })
})
