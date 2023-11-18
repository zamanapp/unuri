// ignore no-console on this file
/* eslint-disable no-console */
import { parse } from '../src'

console.log(parse('ldap://host.com:6666/o=3DDC%20Associates,c=3DUS??(cn=3DJohn%20Smith)'))
