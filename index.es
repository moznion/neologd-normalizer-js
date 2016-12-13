import moji from 'moji';

// ref: https://github.com/neologd/mecab-ipadic-neologd/wiki/Regexp
export default class NeologdNormalizer {
    static _cjkUnifiedIdeographs = '\u{4E00}-\u{9FFF}';
    static _cjkSymbolsAndPunctuation = '\u{3000}-\u{303F}';
    static _halfwidthAndFullwidthForms = '\u{FF00}-\u{FFEF}';
    static _basicLatin = '\u{0000}-\u{001F}\u{0021}-\u{007F}'; // exclude 'SPACE' (U+0020)
    static _hiragana = '\u{3040}-\u{309F}';
    static _zenkakuKatakana = '\u{30A0}-\u{30FF}';
    static _multiByte = `${NeologdNormalizer._cjkUnifiedIdeographs}${NeologdNormalizer._hiragana}${NeologdNormalizer._zenkakuKatakana}${NeologdNormalizer._cjkSymbolsAndPunctuation}${NeologdNormalizer._halfwidthAndFullwidthForms}`;

    static _spacesBetweenRe = new RegExp(`(?:([${NeologdNormalizer._multiByte}]+)[ ]+([${NeologdNormalizer._multiByte}]+)[ ]*)|(?:([${NeologdNormalizer._basicLatin}]+)[ ]+([${NeologdNormalizer._multiByte}]+)[ ]*)|(?:([${NeologdNormalizer._multiByte}]+)[ ]+([${NeologdNormalizer._basicLatin}]+))`, 'g');

    static normalize(str = '') {
        if (str === '') {
            return str;
        }

        let norm = moji(str).convert('ZE', 'HE')
                            .convert('HK', 'ZK')
                            .convert('ZS', 'HS')
                            .toString()
                            .replace(/[˗֊‐‑‒–⁃⁻₋−]/g, '-')
                            .replace(/[﹣－ｰ—―─━ー]/g, 'ー')
                            .replace(/[~∼∾〜〰～]/g, '')
                            .replace(/ー+/g, 'ー');

        norm = this._convertSpecialCharToZenkaku(norm);

        norm = norm.replace(/ +/g, ' ')
                   .replace(/^[ ]+(.+?)$/g, "$1")
                   .replace(/^(.+?)[ ]+$/g, "$1")
                   .replace(this._spacesBetweenRe, "$1$2$3$4$5$6");

        norm = this._convertSpecialCharToHankaku(norm);

        return norm;
    }

    static _specialCharacterHankakuToZenkakuMap = {
        '!': '！',
        '"': '”',
        '#': '＃',
        '$': '＄',
        '%': '％',
        '&': '＆',
        '\'': '’',
        '(': '（',
        ')': '）',
        '*': '＊',
        '+': '＋',
        ',': '，',
        '-': '－',
        '.': '．',
        '/': '／',
        ':': '：',
        ';': '；',
        '<': '＜',
        '=': '＝',
        '>': '＞',
        '?': '？',
        '@': '＠',
        '[': '［',
        '¥': '￥',
        ']': '］',
        '^': '＾',
        '_': '＿',
        '`': '｀',
        '{': '｛',
        '|': '｜',
        '}': '｝',
        '~': '〜',
        '｡': '。',
        '､': '、',
        '･': '・',
        '｢': '「',
        '｣': '」'
    }
    static _convertSpecialCharToZenkaku(str) {
        return str.replace(
            /[!"#$%&'()*+,-./:;<=>?@[¥\]^_`{|}~｡､･｢｣]/g,
            (c) => {
                return this._specialCharacterHankakuToZenkakuMap[c];
            }
        );
    }

    static _specialCharacterZenkakuToHankakuMap = {
        '！': '!',
        '”': '"',
        '＃': '#',
        '＄': '$',
        '％': '%',
        '＆': '&',
        '’': '\'',
        '（': '(',
        '）': ')',
        '＊': '*',
        '＋': '+',
        '，': ',',
        '－': '-',
        '．': '.',
        '／': '/',
        '：': ':',
        '；': ';',
        '＜': '<',
        '＝': '=',
        '＞': '>',
        '？': '?',
        '＠': '@',
        '［': '[',
        '￥': '¥',
        '］': ']',
        '＾': '^',
        '＿': '_',
        '｀': '`',
        '｛': '{',
        '｜': '|',
        '｝': '}',
        '〜': '~',
        '。': '｡',
        '、': '､',
        '・': '･',
        '「': '｢',
        '」': '｣'
    }
    static _convertSpecialCharToHankaku(str) {
        return str.replace(
            /[！”＃＄％＆’（）＊＋，－．／：；＜＝＞？＠［￥］＾＿｀｛｜｝〜。、・「」]/g,
            (c) => {
                return this._specialCharacterZenkakuToHankakuMap[c];
            }
        );
    }
}

