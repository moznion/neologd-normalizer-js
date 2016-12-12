import moji from 'moji';

// ref: https://github.com/neologd/mecab-ipadic-neologd/wiki/Regexp

const CJK_UNIFIED_IDEOGRAPHS = '\u{4E00}-\u{9FFF}';
const CJK_SYMBOLS_AND_PUNCTUATION = '\u{3000}-\u{303F}';
const HALFWIDTH_AND_FULLWIDTH_FORMS = '\u{FF00}-\u{FFEF}';
const BASIC_LATIN = '\u{0000}-\u{001F}\u{0021}-\u{007F}'; // exclude 'SPACE' (U+0020)
const HIRAGANA = '\u{3040}-\u{309F}';
const ZENKAKU_KATAKANA = '\u{30A0}-\u{30FF}';
const MULTI_BYTE = `${CJK_UNIFIED_IDEOGRAPHS}${HIRAGANA}${ZENKAKU_KATAKANA}${CJK_SYMBOLS_AND_PUNCTUATION}${HALFWIDTH_AND_FULLWIDTH_FORMS}`;

export default class NeologdNormalizer {
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
                   .replace(/^(.+?)[ ]+$/g, "$1");

        norm = this._removeSpacesBetweenMultibyteAndMultibyte(norm);
        norm = this._removeSpacesBetweenLatinAndMultibyte(norm);
        norm = this._removeSpacesBetweenMultibyteAndLatin(norm);

        norm = this._convertSpecialCharToHankaku(norm);

        return norm;
    }

    static _convertSpecialCharToZenkaku(str) {
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

    static _convertSpecialCharToHankaku(str) {
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

    static _removeSpacesBetweenMultibyteAndMultibyte(str) {
        return this._removeBetweenSpaces(new RegExp(`([${MULTI_BYTE}]+)[ ]+([${MULTI_BYTE}]+)[ ]*`, 'g'), str);
    }

    static _removeSpacesBetweenLatinAndMultibyte(str) {
        return this._removeBetweenSpaces(new RegExp(`([${BASIC_LATIN}]+)[ ]+([${MULTI_BYTE}]+)[ ]*`, 'g'), str);
    }

    static _removeSpacesBetweenMultibyteAndLatin(str) {
        return this._removeBetweenSpaces(new RegExp(`([${MULTI_BYTE}]+)[ ]+([${BASIC_LATIN}]+)`, 'g'), str); // Don't eat trailing spaces
    }

    static _removeBetweenSpaces(re, str) {
        let m = re.exec(str);
        if (m === null) {
            return str;
        }

        let norm = '';
        const firstIndex = m.index;
        if (firstIndex > 0) {
            norm = str.substring(0, firstIndex);
        }

        let lastIndex;

        while (true) {
            norm += m[1] + m[2];

            lastIndex = re.lastIndex;

            if ((m = re.exec(str)) === null) {
                break;
            }

            norm += str.substring(lastIndex, m.index);
        }

        return norm + str.substring(lastIndex, str.length);
    }
}

