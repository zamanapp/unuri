import { describe, expect, it } from 'vitest'
import type { MailtoComponents } from '../src'
import { equal, parse, serialize } from '../src'

describe('specs for Mailto', () => {
  describe('should parse properly', () => {
    it('should handle examples properly', () => {
      // tests from RFC 6068
      let components = parse('mailto:chris@example.com') as MailtoComponents
      expect(components.to).toStrictEqual(['chris@example.com'])

      components = parse('mailto:infobot@example.com?subject=current-issue') as MailtoComponents
      expect(components.to).toStrictEqual(['infobot@example.com'])
      expect(components.subject).toBe('current-issue')

      components = parse('mailto:infobot@example.com?body=send%20current-issue') as MailtoComponents
      expect(components.to).toStrictEqual(['infobot@example.com'])
      expect(components.body).toBe('send current-issue')

      components = parse('mailto:infobot@example.com?body=send%20current-issue%0D%0Asend%20index') as MailtoComponents
      expect(components.to).toStrictEqual(['infobot@example.com'])
      expect(components.body).toBe('send current-issue\x0D\x0Asend index')

      components = parse('mailto:list@example.org?In-Reply-To=%3C3469A91.D10AF4C@example.com%3E') as MailtoComponents
      expect(components.to).toStrictEqual(['list@example.org'])
      expect(components.headers).toStrictEqual({ 'In-Reply-To': '<3469A91.D10AF4C@example.com>' })

      components = parse('mailto:majordomo@example.com?body=subscribe%20bamboo-l') as MailtoComponents
      expect(components.to).toStrictEqual(['majordomo@example.com'])
      expect(components.body).toBe('subscribe bamboo-l')

      components = parse('mailto:joe@example.com?cc=bob@example.com&body=hello') as MailtoComponents
      expect(components.to).toStrictEqual(['joe@example.com'])
      expect(components.body).toBe('hello')
      expect(components.headers).toStrictEqual({ cc: 'bob@example.com' })

      // TODO: fix this. seems like errors are not being sent down the chain
      //   components = parse('mailto:joe@example.com?cc=bob@example.com?body=hello') as MailtoComponents
      //   expect(components.error).toBe(true)

      components = parse('mailto:gorby%25kremvax@example.com') as MailtoComponents
      expect(components.to).toStrictEqual(['gorby%kremvax@example.com'])

      components = parse('mailto:unlikely%3Faddress@example.com?blat=foop') as MailtoComponents
      expect(components.to).toStrictEqual(['unlikely?address@example.com'])
      expect(components.headers).toStrictEqual({ blat: 'foop' })

      components = parse('mailto:Mike%26family@example.org') as MailtoComponents
      expect(components.to).toStrictEqual(['Mike&family@example.org'])

      components = parse('mailto:%22not%40me%22@example.org') as MailtoComponents
      expect(components.to).toStrictEqual(['"not@me"@example.org'])

      components = parse('mailto:%22oh%5C%5Cno%22@example.org') as MailtoComponents
      expect(components.to).toStrictEqual(['"oh\\\\no"@example.org'])

      components = parse('mailto:%22%5C%5C%5C%22it\'s%5C%20ugly%5C%5C%5C%22%22@example.org') as MailtoComponents
      expect(components.to).toStrictEqual(['"\\\\\\"it\'s\\ ugly\\\\\\""@example.org'])

      components = parse('mailto:user@example.org?subject=caf%C3%A9') as MailtoComponents
      expect(components.to).toStrictEqual(['user@example.org'])
      expect(components.subject).toBe('caf\xE9')

      components = parse('mailto:user@example.org?subject=%3D%3Futf-8%3FQ%3Fcaf%3DC3%3DA9%3F%3D') as MailtoComponents
      expect(components.to).toStrictEqual(['user@example.org'])
      expect(components.subject).toBe('=?utf-8?Q?caf=C3=A9?=')

      components = parse('mailto:user@example.org?subject=%3D%3Fiso-8859-1%3FQ%3Fcaf%3DE9%3F%3D') as MailtoComponents
      expect(components.to).toStrictEqual(['user@example.org'])
      expect(components.subject).toBe('=?iso-8859-1?Q?caf=E9?=')

      components = parse('mailto:user@example.org?subject=caf%C3%A9&body=caf%C3%A9') as MailtoComponents
      expect(components.to).toStrictEqual(['user@example.org'])
      expect(components.subject).toBe('caf\xE9')
      expect(components.body).toBe('caf\xE9')

      components = parse('mailto:user@%E7%B4%8D%E8%B1%86.example.org?subject=Test&body=NATTO') as MailtoComponents
      expect(components.to).toStrictEqual(['user@xn--99zt52a.example.org'])
      expect(components.subject).toBe('Test')
      expect(components.body).toBe('NATTO')
    })
  })

  describe('should serialize properly', () => {
    it('should serialize mailto:chris@example.com', () => {
      let uri = serialize({ scheme: 'mailto', to: ['chris@example.com'] } as MailtoComponents)
      expect(uri).toBe('mailto:chris@example.com')

      uri = serialize({ scheme: 'mailto', to: ['infobot@example.com'], body: 'current-issue' } as MailtoComponents)
      expect(uri).toBe('mailto:infobot@example.com?body=current-issue')

      uri = serialize({ scheme: 'mailto', to: ['infobot@example.com'], body: 'send current-issue' } as MailtoComponents)
      expect(uri).toBe('mailto:infobot@example.com?body=send%20current-issue')

      uri = serialize({ scheme: 'mailto', to: ['infobot@example.com'], body: 'send current-issue\x0D\x0Asend index' } as MailtoComponents)
      expect(uri).toBe('mailto:infobot@example.com?body=send%20current-issue%0D%0Asend%20index')

      uri = serialize({ scheme: 'mailto', to: ['list@example.org'], headers: { 'In-Reply-To': '<3469A91.D10AF4C@example.com>' } } as MailtoComponents)
      expect(uri).toBe('mailto:list@example.org?In-Reply-To=%3C3469A91.D10AF4C@example.com%3E')

      uri = serialize({ scheme: 'mailto', to: ['majordomo@example.com'], body: 'subscribe bamboo-l' } as MailtoComponents)
      expect(uri).toBe('mailto:majordomo@example.com?body=subscribe%20bamboo-l')

      uri = serialize({ scheme: 'mailto', to: ['joe@example.com'], headers: { cc: 'bob@example.com' }, body: 'hello' } as MailtoComponents)
      expect(uri).toBe('mailto:joe@example.com?cc=bob@example.com&body=hello')

      uri = serialize({ scheme: 'mailto', to: ['gorby%25kremvax@example.com'] } as MailtoComponents)
      expect(uri).toBe('mailto:gorby%25kremvax@example.com')

      uri = serialize({ scheme: 'mailto', to: ['unlikely%3Faddress@example.com'], headers: { blat: 'foop' } } as MailtoComponents)
      expect(uri).toBe('mailto:unlikely%3Faddress@example.com?blat=foop')

      uri = serialize({ scheme: 'mailto', to: ['Mike&family@example.org'] } as MailtoComponents)
      expect(uri).toBe('mailto:Mike%26family@example.org')

      uri = serialize({ scheme: 'mailto', to: ['"not@me"@example.org'] } as MailtoComponents)
      expect(uri).toBe('mailto:%22not%40me%22@example.org')

      uri = serialize({ scheme: 'mailto', to: ['"oh\\\\no"@example.org'] } as MailtoComponents)
      expect(uri).toBe('mailto:%22oh%5C%5Cno%22@example.org')

      uri = serialize({ scheme: 'mailto', to: ['"\\\\\\"it\'s\\ ugly\\\\\\""@example.org'] } as MailtoComponents)
      expect(uri).toBe('mailto:%22%5C%5C%5C%22it\'s%5C%20ugly%5C%5C%5C%22%22@example.org')

      uri = serialize({ scheme: 'mailto', to: ['user@example.org'], subject: 'caf\xE9' } as MailtoComponents)
      expect(uri).toBe('mailto:user@example.org?subject=caf%C3%A9')

      uri = serialize({ scheme: 'mailto', to: ['user@example.org'], subject: '=?utf-8?Q?caf=C3=A9?=' } as MailtoComponents)
      expect(uri).toBe('mailto:user@example.org?subject=%3D%3Futf-8%3FQ%3Fcaf%3DC3%3DA9%3F%3D')

      uri = serialize({ scheme: 'mailto', to: ['user@example.org'], subject: '=?iso-8859-1?Q?caf=E9?=' } as MailtoComponents)
      expect(uri).toBe('mailto:user@example.org?subject=%3D%3Fiso-8859-1%3FQ%3Fcaf%3DE9%3F%3D')

      uri = serialize({ scheme: 'mailto', to: ['user@example.org'], subject: 'caf\xE9', body: 'caf\xE9' } as MailtoComponents)
      expect(uri).toBe('mailto:user@example.org?subject=caf%C3%A9&body=caf%C3%A9')

      uri = serialize({ scheme: 'mailto', to: ['us\xE9r@\u7D0D\u8C46.example.org'], subject: 'Test', body: 'NATTO' } as MailtoComponents)
      expect(uri).toBe('mailto:us%C3%A9r@xn--99zt52a.example.org?subject=Test&body=NATTO')
    })
  })

  describe('should equalize properly', () => {
    it('handle examples properly', () => {
      let result = equal('mailto:addr1@an.example,addr2@an.example', 'mailto:?to=addr1@an.example,addr2@an.example')
      expect(result).toBe(true)

      result = equal('mailto:?to=addr1@an.example,addr2@an.example', 'mailto:addr1@an.example?to=addr2@an.example')
      expect(result).toBe(true)
    })
  })
})
