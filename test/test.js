import assert from "assert";
import normalizer from "../index";

describe("Normalize", function () {
    let n = new normalizer();
    it("Should return correct normalized string", function () {
        assert.equal(n.normalize("０１２３４５６７８９"), "0123456789");
        assert.equal(n.normalize("ＡＢＣＤＥＦＧＨＩＪＫＬＭＮＯＰＱＲＳＴＵＶＷＸＹＺ"), "ABCDEFGHIJKLMNOPQRSTUVWXYZ");
        assert.equal(n.normalize("ａｂｃｄｅｆｇｈｉｊｋｌｍｎｏｐｑｒｓｔｕｖｗｘｙｚ"), "abcdefghijklmnopqrstuvwxyz");
        assert.equal(n.normalize("！”＃＄％＆’（）＊＋，－．／：；＜＞？＠［￥］＾＿｀｛｜｝"), "!\"#$%&'()*+,-./:;<>?@[¥]^_`{|}");
        assert.equal(n.normalize("＝。、・「」"), "=｡､･｢｣");
        assert.equal(n.normalize("ﾊﾝｶｸ"), "ハンカク");
        assert.equal(n.normalize("o₋o"), "o-o");
        assert.equal(n.normalize("majika━"), "majikaー");
        assert.equal(n.normalize("わ〰い"), "わい");
        assert.equal(n.normalize("スーパーーーー"), "スーパー");
        assert.equal(n.normalize("!#"), "!#");
        assert.equal(n.normalize("ゼンカク　スペース"), "ゼンカクスペース");
        assert.equal(n.normalize("お             お"), "おお");
        assert.equal(n.normalize("      おお"), "おお");
        assert.equal(n.normalize("おお      "), "おお");
        assert.equal(n.normalize("検索 エンジン 自作 入門 を 買い ました!!!"), "検索エンジン自作入門を買いました!!!");
        assert.equal(n.normalize("アルゴリズム C"), "アルゴリズムC");
        assert.equal(n.normalize("　　　ＰＲＭＬ　　副　読　本　　　"), "PRML副読本");
        assert.equal(n.normalize("Coding the Matrix"), "Coding the Matrix");
        assert.equal(n.normalize("南アルプスの　天然水　Ｓｐａｒｋｉｎｇ　Ｌｅｍｏｎ　レモン一絞り"), "南アルプスの天然水Sparking Lemonレモン一絞り");
        assert.equal(n.normalize("南アルプスの　天然水-　Ｓｐａｒｋｉｎｇ*　Ｌｅｍｏｎ+　レモン一絞り"), "南アルプスの天然水-Sparking*Lemon+レモン一絞り");
    });
});
