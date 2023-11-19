// ignore no-console on this file
/* eslint-disable no-console */
import { parse } from '../src'

console.log(parse('ldap://host.com:6666/o=3DDC%20Associates,c=3DUS??(cn=3DJohn%20Smith)'))
console.log(parse('ldap://[2001:db8::7]/c=GB?objectClass?one'))
console.log(parse('MAILTO:jsmith@host1.com'))
console.log(parse('ftp://ftp.example.com/file'))
console.log(parse('file:///path/to/file'))
console.log(parse('data:text/plain;base64,SGVsbG8sIFdvcmxkIQ=='))
console.log(parse('tel:+1-816-555-1212'))
console.log(parse('cid:QmbWqxBEKC3P8tqsKc98xmWNzrzDtRLMiMPL8wBuTGsMnR'))
console.log(parse('cid:1234567890abcdef@example.com'))
