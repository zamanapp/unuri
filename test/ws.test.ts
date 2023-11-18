import { describe, expect, it } from 'vitest'
import type { WSComponents } from '../src'
import { equal, normalize, parse, serialize } from '../src'

describe('specs for WS(S) schema', () => {
  describe('should parse properly', () => {
    it('should parse ws', () => {
      let components = parse('ws://example.com/chat') as WSComponents
      expect(components.scheme).toBe('ws')
      expect(components.host).toBe('example.com')
      expect(components.resourceName).toBe('/chat')
      expect(components.secure).toBe(false)

      components = parse('ws://example.com/foo?bar=baz') as WSComponents
      expect(components.scheme).toBe('ws')
      expect(components.host).toBe('example.com')
      expect(components.resourceName).toBe('/foo?bar=baz')
      expect(components.secure).toBe(false)

      components = parse('ws://example.com/?bar=baz') as WSComponents
      expect(components.scheme).toBe('ws')
      expect(components.host).toBe('example.com')
      expect(components.resourceName).toBe('/?bar=baz')
      expect(components.secure).toBe(false)
    })

    it('should parse wss', () => {
      let components = parse('wss://example.com/chat') as WSComponents
      expect(components.scheme).toBe('wss')
      expect(components.host).toBe('example.com')
      expect(components.resourceName).toBe('/chat')
      expect(components.secure).toBe(true)

      components = parse('wss://example.com/foo?bar=baz') as WSComponents
      expect(components.scheme).toBe('wss')
      expect(components.host).toBe('example.com')
      expect(components.resourceName).toBe('/foo?bar=baz')
      expect(components.secure).toBe(true)

      components = parse('wss://example.com/?bar=baz') as WSComponents
      expect(components.scheme).toBe('wss')
      expect(components.host).toBe('example.com')
      expect(components.resourceName).toBe('/?bar=baz')
      expect(components.secure).toBe(true)
    })
  })

  describe('should serialize properly', () => {
    it('should serialize ws', () => {
      expect(serialize({ scheme: 'ws' })).toBe('ws:')
      expect(serialize({ scheme: 'ws', host: 'example.com' })).toBe('ws://example.com')
      expect(serialize({ scheme: 'ws', resourceName: '/' } as WSComponents)).toBe('ws:')
      expect(serialize({ scheme: 'ws', resourceName: '/foo' } as WSComponents)).toBe('ws:/foo')
      expect(serialize({ scheme: 'ws', resourceName: '/foo?bar' } as WSComponents)).toBe('ws:/foo?bar')
      expect(serialize({ scheme: 'ws', secure: false } as WSComponents)).toBe('ws:')
      expect(serialize({ scheme: 'ws', secure: true } as WSComponents)).toBe('wss:')
      expect(serialize({ scheme: 'ws', host: 'example.com', resourceName: '/foo' } as WSComponents)).toBe('ws://example.com/foo')
      expect(serialize({ scheme: 'ws', host: 'example.com', resourceName: '/foo?bar' } as WSComponents)).toBe('ws://example.com/foo?bar')
    })

    it('should serialize wss', () => {
      expect(serialize({ scheme: 'wss' })).toBe('wss:')
      expect(serialize({ scheme: 'wss', host: 'example.com' })).toBe('wss://example.com')
      expect(serialize({ scheme: 'wss', resourceName: '/' } as WSComponents)).toBe('wss:')
      expect(serialize({ scheme: 'wss', resourceName: '/foo' } as WSComponents)).toBe('wss:/foo')
      expect(serialize({ scheme: 'wss', resourceName: '/foo?bar' } as WSComponents)).toBe('wss:/foo?bar')
      expect(serialize({ scheme: 'wss', secure: false } as WSComponents)).toBe('ws:')
      expect(serialize({ scheme: 'wss', secure: true } as WSComponents)).toBe('wss:')
      expect(serialize({ scheme: 'wss', host: 'example.com', resourceName: '/foo' } as WSComponents)).toBe('wss://example.com/foo')
      expect(serialize({ scheme: 'wss', host: 'example.com', resourceName: '/foo?bar' } as WSComponents)).toBe('wss://example.com/foo?bar')
      expect(serialize({ scheme: 'wss', host: 'example.com', secure: false } as WSComponents)).toBe('ws://example.com')
      expect(serialize({ scheme: 'wss', host: 'example.com', secure: true } as WSComponents)).toBe('wss://example.com')
      expect(serialize({ scheme: 'wss', host: 'example.com', resourceName: '/foo?bar', secure: false } as WSComponents)).toBe('ws://example.com/foo?bar')
      expect(serialize({ scheme: 'wss', host: 'example.com', resourceName: '/foo?bar', secure: true } as WSComponents)).toBe('wss://example.com/foo?bar')
    })
  })

  describe('should equate properly', () => {
    it('should equate ws', () => {
      expect(equal('WS://ABC.COM:80/chat#one', 'ws://abc.com/chat')).toBe(true)
    })

    it('should equate wss', () => {
      expect(equal('WSS://ABC.COM:443/chat#one', 'wss://abc.com/chat')).toBe(true)
    })
  })

  describe('should normalize properly', () => {
    it('should normalize ws', () => {
      expect(normalize('ws://example.com:80/foo#hash')).toBe('ws://example.com/foo')
    })

    it('should normalize wss', () => {
      expect(normalize('wss://example.com:443/foo#hash')).toBe('wss://example.com/foo')
    })
  })
})
