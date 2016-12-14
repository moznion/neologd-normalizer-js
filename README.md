neologd-normalizer-js [![Build Status](https://travis-ci.org/moznion/neologd-normalizer-js.svg?branch=master)](https://travis-ci.org/moznion/neologd-normalizer-js)
==

A normalizer of neologd for JavaScript.

Rule
--

[https://github.com/neologd/mecab-ipadic-neologd/wiki/Regexp.ja](https://github.com/neologd/mecab-ipadic-neologd/wiki/Regexp.ja)

Synopsis
--

```js
import NeologdNormalizer from "neologd-normalizer";

NeologdNormalizer.normalize("　　　ＰＲＭＬ　　副　読　本　　　"); // => "PRML副読本"
NeologdNormalizer.normalize("南アルプスの　天然水-　Ｓｐａｒｋｉｎｇ*　Ｌｅｍｏｎ+　レモン一絞り"); // => 南アルプスの天然水-Sparking*Lemon+レモン一絞り
```

How to build
--

```bash
$ npm run build
```

How to run test
--

```bash
$ npm test
```

Benchmark
--

### Run benchmark scirpt

```bash
$ npm run bench
```

### Result

Benchmark script is [here](/author/bench.es).

```
$ npm run bench
Bench x 6,247 ops/sec ±1.03% (85 runs sampled)
```

(Node: v6.9.2, Machine: MacBook Pro Retina, 15-inch, Early 2013 2.7 GHz Intel Core i7)

License
--

Copyright 2016 moznion (<moznion@gmail.com>)

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

