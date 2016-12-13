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

    static _cjkUnifiedIdeographs = '\u{4E00}-\u{9FFF}';
    static _cjkSymbolsAndPunctuation = '\u{3000}-\u{303F}';
    static _halfwidthAndFullwidthForms = '\u{FF00}-\u{FFEF}';
    static _basicLatin = '\u{0000}-\u{001F}\u{0021}-\u{007F}'; // exclude 'SPACE' (U+0020)
    static _hiragana = '\u{3040}-\u{309F}';
    static _zenkakuKatakana = '\u{30A0}-\u{30FF}';
    static _multiByte = `${NeologdNormalizer._cjkUnifiedIdeographs}${NeologdNormalizer._hiragana}${NeologdNormalizer._zenkakuKatakana}${NeologdNormalizer._cjkSymbolsAndPunctuation}${NeologdNormalizer._halfwidthAndFullwidthForms}`;

    static _spacesBetweenMultiByteAndMultiByteRe = new RegExp(`([${NeologdNormalizer._multiByte}]+)[ ]+([${NeologdNormalizer._multiByte}]+)[ ]*`, 'g');
    static _removeSpacesBetweenMultibyteAndMultibyte(str) {
        return this._removeBetweenSpaces(this._spacesBetweenMultiByteAndMultiByteRe , str);
    }

    static _spacesBetweenLatinAndMultiByteRe = new RegExp(`([${NeologdNormalizer._basicLatin}]+)[ ]+([${NeologdNormalizer._multiByte}]+)[ ]*`, 'g');
    static _removeSpacesBetweenLatinAndMultibyte(str) {
        return this._removeBetweenSpaces(this._spacesBetweenLatinAndMultiByteRe , str);
    }

    static _spacesBetweenMultiByteAndLatinRe = new RegExp(`([${NeologdNormalizer._multiByte}]+)[ ]+([${NeologdNormalizer._basicLatin}]+)`, 'g');
    static _removeSpacesBetweenMultibyteAndLatin(str) {
        return this._removeBetweenSpaces(this._spacesBetweenMultiByteAndLatinRe , str); // Don't eat trailing spaces
    }

    static _removeBetweenSpaces(re, str) {
        // init (RegExp has state so there is possibility that it remembers previous lastIndex; thus reset)
        re.lastIndex = 0;

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

