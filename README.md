neologd-normalizer-js
==

A normalizer of neologd for JavaScript.

Rule
--

[https://github.com/neologd/mecab-ipadic-neologd/wiki/Regexp.ja](https://github.com/neologd/mecab-ipadic-neologd/wiki/Regexp.ja)

Synopsis
--

```js
import NeologdNormalizer from "neologd-normalizer";

let normalizer = new NeologdNormalizer();
normalizer.normalize("　　　ＰＲＭＬ　　副　読　本　　　"); // => "PRML副読本"
normalizer.normalize("南アルプスの　天然水-　Ｓｐａｒｋｉｎｇ*　Ｌｅｍｏｎ+　レモン一絞り"); // => 南アルプスの天然水-Sparking*Lemon+レモン一絞り
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

