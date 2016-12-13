import moji from 'moji';

// ref: https://github.com/neologd/mecab-ipadic-neologd/wiki/Regexp
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

    static _CJK_UNIFIED_IDEOGRAPHS = '\u{4E00}-\u{9FFF}';
    static _CJK_SYMBOLS_AND_PUNCTUATION = '\u{3000}-\u{303F}';
    static _HALFWIDTH_AND_FULLWIDTH_FORMS = '\u{FF00}-\u{FFEF}';
    static _BASIC_LATIN = '\u{0000}-\u{001F}\u{0021}-\u{007F}'; // exclude 'SPACE' (U+0020)
    static _HIRAGANA = '\u{3040}-\u{309F}';
    static _ZENKAKU_KATAKANA = '\u{30A0}-\u{30FF}';
    static _MULTI_BYTE = `${NeologdNormalizer._CJK_UNIFIED_IDEOGRAPHS}${NeologdNormalizer._HIRAGANA}${NeologdNormalizer._ZENKAKU_KATAKANA}${NeologdNormalizer._CJK_SYMBOLS_AND_PUNCTUATION}${NeologdNormalizer._HALFWIDTH_AND_FULLWIDTH_FORMS}`;

    static _SPACES_BETWEEN_MULTI_BYTE_AND_MULTI_BYTE_RE = new RegExp(`([${NeologdNormalizer._MULTI_BYTE}]+)[ ]+([${NeologdNormalizer._MULTI_BYTE}]+)[ ]*`, 'g');
    static _removeSpacesBetweenMultibyteAndMultibyte(str) {
        return this._removeBetweenSpaces(this._SPACES_BETWEEN_MULTI_BYTE_AND_MULTI_BYTE_RE , str);
    }

    static _SPACES_BETWEEN_LATIN_AND_MULTI_BYTE_RE = new RegExp(`([${NeologdNormalizer._BASIC_LATIN}]+)[ ]+([${NeologdNormalizer._MULTI_BYTE}]+)[ ]*`, 'g');
    static _removeSpacesBetweenLatinAndMultibyte(str) {
        return this._removeBetweenSpaces(this._SPACES_BETWEEN_LATIN_AND_MULTI_BYTE_RE , str);
    }

    static _SPACES_BETWEEN_MULTI_BYTE_AND_LATIN_RE = new RegExp(`([${NeologdNormalizer._MULTI_BYTE}]+)[ ]+([${NeologdNormalizer._BASIC_LATIN}]+)`, 'g');
    static _removeSpacesBetweenMultibyteAndLatin(str) {
        return this._removeBetweenSpaces(this._SPACES_BETWEEN_MULTI_BYTE_AND_LATIN_RE , str); // Don't eat trailing spaces
    }

    static _removeBetweenSpaces(re, str) {
        let m = re.exec(str);
        if (m === null) {
            return str;
        }

        let norm = '';
        const firstIndex = m.index;
        if (firstIndex > 0) {
            norm = str.slice(0, firstIndex);
        }

        let lastIndex;

        while (true) {
            norm += m[1] + m[2];

            lastIndex = re.lastIndex;

            if ((m = re.exec(str)) === null) {
                break;
            }

            norm += str.slice(lastIndex, m.index);
        }

        return norm + str.slice(lastIndex);
    }
}

