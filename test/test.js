import assert from "assert";
import NeologdNormalizer from "../index";

describe("NeologdNormalize", function () {
    it("Should return correct normalized string", function () {
        assert.equal(NeologdNormalizer.normalize("０１２３４５６７８９"), "0123456789");
        assert.equal(NeologdNormalizer.normalize("ＡＢＣＤＥＦＧＨＩＪＫＬＭＮＯＰＱＲＳＴＵＶＷＸＹＺ"), "ABCDEFGHIJKLMNOPQRSTUVWXYZ");
        assert.equal(NeologdNormalizer.normalize("ａｂｃｄｅｆｇｈｉｊｋｌｍｎｏｐｑｒｓｔｕｖｗｘｙｚ"), "abcdefghijklmnopqrstuvwxyz");
        assert.equal(NeologdNormalizer.normalize("！”＃＄％＆’（）＊＋，－．／：；＜＞？＠［￥］＾＿｀｛｜｝"), "!\"#$%&'()*+,-./:;<>?@[¥]^_`{|}");
        assert.equal(NeologdNormalizer.normalize("＝。、・「」"), "=｡､･｢｣");
        assert.equal(NeologdNormalizer.normalize("ﾊﾝｶｸ"), "ハンカク");
        assert.equal(NeologdNormalizer.normalize("o₋o"), "o-o");
        assert.equal(NeologdNormalizer.normalize("majika━"), "majikaー");
        assert.equal(NeologdNormalizer.normalize("わ〰い"), "わい");
        assert.equal(NeologdNormalizer.normalize("スーパーーーー"), "スーパー");
        assert.equal(NeologdNormalizer.normalize("!#"), "!#");
        assert.equal(NeologdNormalizer.normalize("ゼンカク　スペース"), "ゼンカクスペース");
        assert.equal(NeologdNormalizer.normalize("お             お"), "おお");
        assert.equal(NeologdNormalizer.normalize("      おお"), "おお");
        assert.equal(NeologdNormalizer.normalize("おお      "), "おお");
        assert.equal(NeologdNormalizer.normalize("検索 エンジン 自作 入門 を 買い ました!!!"), "検索エンジン自作入門を買いました!!!");
        assert.equal(NeologdNormalizer.normalize("アルゴリズム C"), "アルゴリズムC");
        assert.equal(NeologdNormalizer.normalize("　　　ＰＲＭＬ　　副　読　本　　　"), "PRML副読本");
        assert.equal(NeologdNormalizer.normalize("Coding the Matrix"), "Coding the Matrix");
        assert.equal(NeologdNormalizer.normalize("南アルプスの　天然水　Ｓｐａｒｋｉｎｇ　Ｌｅｍｏｎ　レモン一絞り"), "南アルプスの天然水Sparking Lemonレモン一絞り");
        assert.equal(NeologdNormalizer.normalize("南アルプスの　天然水-　Ｓｐａｒｋｉｎｇ*　Ｌｅｍｏｎ+　レモン一絞り"), "南アルプスの天然水-Sparking*Lemon+レモン一絞り");
        assert.equal(NeologdNormalizer.normalize("南アルプスの   天然水   Sparking   Lem   on   レモン一絞り"), "南アルプスの天然水Sparking Lem onレモン一絞り");
        assert.equal(NeologdNormalizer.normalize("アルゴリズム C plus plus"), "アルゴリズムC plus plus");
    });
});
