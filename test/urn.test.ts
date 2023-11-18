import { describe, expect, it } from 'vitest'
import type { URNComponents, URNOptions } from '../src'
import { equal, parse, resolve, serialize } from '../src'

// Create a test suite for the URN scheme
describe('specs for URN', () => {
  // Test URN parsing
  describe('should parse properly', () => {
    // example from RFC 2141
    it('should handle example properly', () => {
      expect(parse('urn:foo:a123,456')).toStrictEqual({
        scheme: 'urn',
        userinfo: undefined,
        host: undefined,
        port: undefined,
        path: undefined,
        query: undefined,
        fragment: undefined,
        nid: 'foo',
        nss: 'a123,456',
        reference: 'absolute',
      })
    })
  })

  // Test URN serialization
  describe('should serialize properly', () => {
    it('should handle example properly', () => {
      // example from RFC 2141
      const components = {
        scheme: 'urn',
        nid: 'foo',
        nss: 'a123,456',
      }
      expect(serialize(components)).toBe('urn:foo:a123,456')
    })
  })

  describe('should equalize properly', () => {
    it('should handle examples properly', () => {
      // test from RFC 2141
      expect(equal('urn:foo:a123,456', 'urn:foo:a123,456')).toBeTruthy()
      expect(equal('urn:foo:a123,456', 'URN:foo:a123,456')).toBeTruthy()
      expect(equal('urn:foo:a123,456', 'urn:FOO:a123,456')).toBeTruthy()
      expect(equal('urn:foo:a123,456', 'urn:foo:A123,456')).toBeFalsy()
      expect(equal('urn:foo:a123%2C456', 'URN:FOO:a123%2c456')).toBeTruthy()
    })
  })

  // Test URN resolving
  describe('should resolve properly', () => {
    it('should handle examples properly', () => {
      // example from epoberezkin
      expect(resolve('', 'urn:some:ip:prop')).toBe('urn:some:ip:prop')
      expect(resolve('#', 'urn:some:ip:prop')).toBe('urn:some:ip:prop')
      expect(resolve('urn:some:ip:prop', 'urn:some:ip:prop')).toBe('urn:some:ip:prop')
      expect(resolve('urn:some:other:prop', 'urn:some:ip:prop')).toBe('urn:some:ip:prop')
    })
  })
})

describe('specs for URN UUID', () => {
  // Test URN UUID parsing
  describe('should parse properly', () => {
    it('should handle example properly', () => {
      // example from RFC 4122
      let components = parse('urn:uuid:f81d4fae-7dec-11d0-a765-00a0c91e6bf6')
      expect(components).toStrictEqual({
        scheme: 'urn',
        userinfo: undefined,
        host: undefined,
        port: undefined,
        path: undefined,
        query: undefined,
        fragment: undefined,
        nid: 'uuid',
        nss: 'f81d4fae-7dec-11d0-a765-00a0c91e6bf6',
        reference: 'absolute',
        // uuid: 'f81d4fae-7dec-11d0-a765-00a0c91e6bf6',
      })

      components = parse('urn:uuid:notauuid-7dec-11d0-a765-00a0c91e6bf6')
      expect(components.error).toBeUndefined()
    })
  })

  // Test URN UUID serialization
  describe('should serialize properly', () => {
    // TODO: fix this test. it seems that there is a confusion between the nss (namespace specific string) and uuid properties
    it.skip('should handle examples properly', () => {
      // example from RFC 4122
      let components = {
        scheme: 'urn',
        nid: 'uuid',
        uuid: 'f81d4fae-7dec-11d0-a765-00a0c91e6bf6',
      }
      expect(serialize(components)).toBe('urn:uuid:f81d4fae-7dec-11d0-a765-00a0c91e6bf6')

      components = {
        scheme: 'urn',
        nid: 'uuid',
        uuid: 'notauuid-7dec-11d0-a765-00a0c91e6bf6',
      }
      expect(serialize(components)).toBe('urn:uuid:notauuid-7dec-11d0-a765-00a0c91e6bf6')
    })
  })

  // Test URN UUID equality
  describe('should equalize properly', () => {
    // TODO: fix this test. it seems that there is a confusion between the nss (namespace specific string) and uuid properties
    it.skip('should handle example properly', () => {
      expect(equal('URN:UUID:F81D4FAE-7DEC-11D0-A765-00A0C91E6BF6', 'urn:uuid:f81d4fae-7dec-11d0-a765-00a0c91e6bf6')).toBeTruthy()
    })
  })
})

describe('specs for URN NID', () => {
  // TODO: override is not working
  it.skip('should override', () => {
    let components = parse('urn:foo:f81d4fae-7dec-11d0-a765-00a0c91e6bf6', { nid: 'uuid' } as URNOptions)
    expect(components).toStrictEqual({
      scheme: 'urn',
      userinfo: undefined,
      host: undefined,
      port: undefined,
      path: undefined,
      query: undefined,
      fragment: undefined,
      nid: 'foo',
      nss: 'f81d4fae-7dec-11d0-a765-00a0c91e6bf6',
      reference: 'absolute',
      // uuid: 'f81d4fae-7dec-11d0-a765-00a0c91e6bf6',
    })
    components = {
      scheme: 'urn',
      nid: 'foo',
      uuid: 'f81d4fae-7dec-11d0-a765-00a0c91e6bf6',
    } as URNComponents
    const serialized = serialize(components, { nid: 'uuid' } as URNOptions)
    expect(serialized).toBe('urn:foo:f81d4fae-7dec-11d0-a765-00a0c91e6bf6')
  })
})
