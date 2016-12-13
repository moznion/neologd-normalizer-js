import Benchmark from "benchmark";
import NeologdNormalizer from "../index.es";

let suite = new Benchmark.Suite;
suite.add('Bench', () => {
    NeologdNormalizer.normalize("０１２３４５６７８９");
    NeologdNormalizer.normalize("ＡＢＣＤＥＦＧＨＩＪＫＬＭＮＯＰＱＲＳＴＵＶＷＸＹＺ");
    NeologdNormalizer.normalize("ａｂｃｄｅｆｇｈｉｊｋｌｍｎｏｐｑｒｓｔｕｖｗｘｙｚ");
    NeologdNormalizer.normalize("！”＃＄％＆’（）＊＋，－．／：；＜＞？＠［￥］＾＿｀｛｜｝");
    NeologdNormalizer.normalize("＝。、・「」");
    NeologdNormalizer.normalize("ﾊﾝｶｸ");
    NeologdNormalizer.normalize("o₋o");
    NeologdNormalizer.normalize("majika━_");
    NeologdNormalizer.normalize("わ〰い");
    NeologdNormalizer.normalize("スーパーーーー");
    NeologdNormalizer.normalize("!#");
    NeologdNormalizer.normalize("ゼンカク　スペース");
    NeologdNormalizer.normalize("お             お");
    NeologdNormalizer.normalize("      おお");
    NeologdNormalizer.normalize("おお      ");
    NeologdNormalizer.normalize("検索 エンジン 自作 入門 を 買い ました!!!");
    NeologdNormalizer.normalize("アルゴリズム C");
    NeologdNormalizer.normalize("　　　ＰＲＭＬ　　副　読　本　　　");
    NeologdNormalizer.normalize("Coding the Matrix");
    NeologdNormalizer.normalize("南アルプスの　天然水　Ｓｐａｒｋｉｎｇ　Ｌｅｍｏｎ　レモン一絞り");
    NeologdNormalizer.normalize("南アルプスの　天然水-　Ｓｐａｒｋｉｎｇ*　Ｌｅｍｏｎ+　レモン一絞り");
})
.on('cycle', function(event) {
  console.log(String(event.target));
})
.run();

