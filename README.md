# uri-ts

[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]
[![bundle][bundle-src]][bundle-href]
[![JSDocs][jsdocs-src]][jsdocs-href]
[![License][license-src]][license-href]

An [RFC 3986](https://datatracker.ietf.org/doc/html/rfc3986) compliant, scheme extendable URI parsing, validating and resolving library for both node and the browser.

## Features

- Compliant with the following RFCs:
  - [RFC 3986](https://datatracker.ietf.org/doc/html/rfc3986) `Uniform Resource Identifier (URI): Generic Syntax`
  - [RFC 3987](https://datatracker.ietf.org/doc/html/rfc3987) `Internationalized Resource Identifiers (IRIs)`
  - [RFC 5890](https://datatracker.ietf.org/doc/html/rfc5890) `Internationalized Domain Names for Applications (IDNA): Definitions and Document Framework`
  - [RFC 5952](https://datatracker.ietf.org/doc/html/rfc5952) `A Recommendation for IPv6 Address Text Representation`
  - [RFC 6874](https://datatracker.ietf.org/doc/html/rfc6874) `Representing IPv6 Zone Identifiers in Address Literals and Uniform Resource Identifiers (URIs)`
- Supports the following schemes:
  - `http` [RFC 2616](https://datatracker.ietf.org/doc/html/rfc2616)
  - `https` [RFC 2818](https://datatracker.ietf.org/doc/html/rfc2818)
  - `ws` [RFC 6455](https://datatracker.ietf.org/doc/html/rfc6455)
  - `wss` [RFC 6455](https://datatracker.ietf.org/doc/html/rfc6455)
  - `mailto` [RFC 6068](https://datatracker.ietf.org/doc/html/rfc6068)
  - `urn` [RFC 2141](https://datatracker.ietf.org/doc/html/rfc2141)
  - `urn:uuid` [RFC 4122](https://datatracker.ietf.org/doc/html/rfc4122)
- Scheme extendable
- Resolve
- Parse
- Serialize
- Normalize

## Install

```bash
npm install uri-ts
```
# Usage

## Import

```typescript
import * URI from 'uri-ts';
import { parse, serialize, resolve, resolveComponents, normalize, equal, removeDotSegments, pctEncChar, pctDecChars, escapeComponent, unescapeComponent } from "uri-js";
```

## Parse

```typescript
const uri = URI.parse('http://www.example.com:8080/path/to/resource?key=value#fragment');
```

## Resolve

```typescript
const uri = URI.resolve('http://www.example.com:8080/path/to/resource?key=value#fragment');
```

## Serialize

```typescript
const uri = URI.parse('http://www.example.com:8080/path/to/resource?key=value#fragment');
const serialized = uri.serialize();
```

## Normalize

```typescript
const uri = URI.parse('http://www.example.com:8080/path/to/resource?key=value#fragment');
const normalized = uri.normalize();
```

## Extend

TODO


## Possibly needed features

The following schemas are not supported yet, but may be needed in the future. Any help is appreciated.

- [ ] Add support for `ftp` scheme
- [ ] Add support for `file` scheme
- [ ] Add support for `data` scheme
- [ ] Add support for `tel` scheme

the following feature might be added
- [ ] add validation function 

## License

## Original Work License

[The original work](https://github.com/garycourt/uri-js) in this project is licensed under the following license:

```text
Copyright 2011 Gary Court. All rights reserved.

Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met:

1.	Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.

2.	Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.

THIS SOFTWARE IS PROVIDED BY GARY COURT "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL GARY COURT OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

The views and conclusions contained in the software and documentation are those of the authors and should not be interpreted as representing official policies, either expressed or implied, of Gary Court.
``` 

## Modifications License

The modifications made to this project are licensed under the MIT License, as follows:
  
```text
Modifications Copyright Notice and MIT License

Copyright (c) (2023) WhiteRock. All rights reserved. <https://github.com/whiterocktech>

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

**When using or redistributing this project, you may choose to follow either the BSD License for the original work or the MIT License for the subsequent modifications, in compliance with the terms set forth in each license.**

<!-- Badges -->

[npm-version-src]: https://img.shields.io/npm/v/uri-ts?style=flat&colorA=080f12&colorB=1fa669
[npm-version-href]: https://npmjs.com/package/uri-ts
[npm-downloads-src]: https://img.shields.io/npm/dm/uri-ts?style=flat&colorA=080f12&colorB=1fa669
[npm-downloads-href]: https://npmjs.com/package/uri-ts
[bundle-src]: https://img.shields.io/bundlephobia/minzip/uri-ts?style=flat&colorA=080f12&colorB=1fa669&label=minzip
[bundle-href]: https://bundlephobia.com/result?p=uri-ts
[license-src]: https://img.shields.io/github/license/whiterocktech/uri-ts.svg?style=flat&colorA=080f12&colorB=1fa669
[license-href]: https://github.com/whiterocktech/uri-ts/blob/main/LICENSE
[jsdocs-src]: https://img.shields.io/badge/jsdocs-reference-080f12?style=flat&colorA=080f12&colorB=1fa669
[jsdocs-href]: https://www.jsdocs.io/package/uri-ts
