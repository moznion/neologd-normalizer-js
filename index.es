import moji from 'moji';

// ref: https://github.com/neologd/mecab-ipadic-neologd/wiki/Regexp

const CJK_UNIFIED_IDEOGRAPHS = '\u{4E00}-\u{9FFF}';
const CJK_SYMBOLS_AND_PUNCTUATION = '\u{3000}-\u{303F}';
const HALFWIDTH_AND_FULLWIDTH_FORMS = '\u{FF00}-\u{FFEF}';
const BASIC_LATIN = '\u{0000}-\u{007F}';
const HIRAGANA = '\u{3040}-\u{309F}';
const ZENKAKU_KATAKANA = '\u{30A0}-\u{30FF}';
const MULTI_BYTE = `${CJK_UNIFIED_IDEOGRAPHS}${HIRAGANA}${ZENKAKU_KATAKANA}${CJK_SYMBOLS_AND_PUNCTUATION}${HALFWIDTH_AND_FULLWIDTH_FORMS}`;

export default class NeologdNormalizer {
    normalize(str = '') {
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
                   .replace(/^(.+?)[ ]+$/g, "$1");

        norm = this._removeBetweenSpaces(MULTI_BYTE, MULTI_BYTE, norm);
        norm = this._removeBetweenSpaces(BASIC_LATIN, MULTI_BYTE, norm);
        norm = this._removeBetweenSpaces(MULTI_BYTE, BASIC_LATIN, norm);

        norm = this._convertSpecialCharToHankaku(norm);

        return norm;
    }

    _convertSpecialCharToZenkaku(str) {
        return str.replace(
            /[!"#$%&'()*+,-./:;<=>?@[¥\]^_`{|}~｡､･｢｣]/g,
            (c) => {
                return {
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
                }[c];
            }
        );
    }

    _convertSpecialCharToHankaku(str) {
        return str.replace(
            /[！”＃＄％＆’（）＊＋，－．／：；＜＝＞？＠［￥］＾＿｀｛｜｝〜。、・「」]/g,
            (c) => {
                return {
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
                }[c];
            }
        );
    }

    _removeBetweenSpaces(headCharClass, tailCharClass, str) {
        const re = new RegExp(`([${headCharClass}]+?)[ ]+([${tailCharClass}]+?)`, 'g');

        let norm = str;
        while (norm.match(re)) {
            norm = norm.replace(re, "$1$2");
        }

        return norm;
    }
}
