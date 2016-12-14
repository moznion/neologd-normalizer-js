// ref: https://github.com/neologd/mecab-ipadic-neologd/wiki/Regexp
export default class NeologdNormalizer {
    static _cjkUnifiedIdeographs = '\u{4E00}-\u{9FFF}';
    static _cjkSymbolsAndPunctuation = '\u{3001}-\u{303F}'; // exclude 'IDEOGRAPHIC SPACE' (U+3000)
    static _halfwidthAndFullwidthForms = '\u{FF00}-\u{FFEF}';
    static _basicLatin = '\u{0000}-\u{001F}\u{0021}-\u{007F}'; // exclude 'SPACE' (U+0020)
    static _hiragana = '\u{3040}-\u{309F}';
    static _zenkakuKatakana = '\u{30A0}-\u{30FF}';
    static _multiByte = `${NeologdNormalizer._cjkUnifiedIdeographs}${NeologdNormalizer._hiragana}${NeologdNormalizer._zenkakuKatakana}${NeologdNormalizer._cjkSymbolsAndPunctuation}${NeologdNormalizer._halfwidthAndFullwidthForms}`;

    static _spacesBetweenRe = new RegExp(`([${NeologdNormalizer._multiByte}]+)[ ]+([${NeologdNormalizer._multiByte}]+)[ ]*|([${NeologdNormalizer._basicLatin}]+)[ ]+([${NeologdNormalizer._multiByte}]+)[ ]*|([${NeologdNormalizer._multiByte}]+)[ ]+([${NeologdNormalizer._basicLatin}]+)`, 'gu');

    static normalize(str = '') {
        if (str === '') {
            return str;
        }

        let norm = this._convertEisuuZenkakuToHankaku(str);
        norm = this._convertKatakanaHankakuToZenkaku(norm);
        norm = norm.replace(/[\u{3000} ]+/gu, ' ')
                   .replace(/[\u{02D7}\u{058A}\u{2010}\u{2011}\u{2012}\u{2013}\u{2043}\u{207B}\u{208B}\u{2212}]/gu, '-')
                   .replace(/[\u{2014}\u{2015}\u{2500}\u{2501}\u{30fc}\u{FE63}\u{FF0D}\u{FF70}]+/gu, 'ー')
                   .replace(/[~∼∾〜〰～]/gu, '');

        norm = this._convertSpecialCharToZenkaku(norm);

        norm = norm.replace(/^[ ]?(.+?)[ ]?$/gu, '$1')
                   .replace(this._spacesBetweenRe, (_, $1, $2, $3, $4, $5, $6) => {
                       if ($1 !== undefined && $2 !== undefined) {
                           return `${$1}${$2}`;
                       }

                       if ($3 !== undefined && $4 !== undefined) {
                           return `${$3}${$4}`;
                       }

                       if ($5 !== undefined && $6 !== undefined) {
                           return `${$5}${$6}`;
                       }
                   });

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
            /[！”＃＄％＆’（）＊＋，－．／：；＜＝＞？＠［￥］＾＿｀｛｜｝〜。、・「」]/gu,
            (c) => {
                return this._specialCharacterZenkakuToHankakuMap[c];
            }
        );
    }

    static _eisuuZenkakuToHankakuMap = {
        '０': '0',
        '１': '1',
        '２': '2',
        '３': '3',
        '４': '4',
        '５': '5',
        '６': '6',
        '７': '7',
        '８': '8',
        '９': '9',
        'Ａ': 'A',
        'Ｂ': 'B',
        'Ｃ': 'C',
        'Ｄ': 'D',
        'Ｅ': 'E',
        'Ｆ': 'F',
        'Ｇ': 'G',
        'Ｈ': 'H',
        'Ｉ': 'I',
        'Ｊ': 'J',
        'Ｋ': 'K',
        'Ｌ': 'L',
        'Ｍ': 'M',
        'Ｎ': 'N',
        'Ｏ': 'O',
        'Ｐ': 'P',
        'Ｑ': 'Q',
        'Ｒ': 'R',
        'Ｓ': 'S',
        'Ｔ': 'T',
        'Ｕ': 'U',
        'Ｖ': 'V',
        'Ｗ': 'W',
        'Ｘ': 'X',
        'Ｙ': 'Y',
        'Ｚ': 'Z',
        'ａ': 'a',
        'ｂ': 'b',
        'ｃ': 'c',
        'ｄ': 'd',
        'ｅ': 'e',
        'ｆ': 'f',
        'ｇ': 'g',
        'ｈ': 'h',
        'ｉ': 'i',
        'ｊ': 'j',
        'ｋ': 'k',
        'ｌ': 'l',
        'ｍ': 'm',
        'ｎ': 'n',
        'ｏ': 'o',
        'ｐ': 'p',
        'ｑ': 'q',
        'ｒ': 'r',
        'ｓ': 's',
        'ｔ': 't',
        'ｕ': 'u',
        'ｖ': 'v',
        'ｗ': 'w',
        'ｘ': 'x',
        'ｙ': 'y',
        'ｚ': 'z'
    }
    static _convertEisuuZenkakuToHankaku(str) {
        return str.replace(
            /[０-９Ａ-Ｚａ-ｚ]/gu,
            (c) => {
                return this._eisuuZenkakuToHankakuMap[c];
            }
        );
    }

    static _katakanaHankakuToZenkakuMap = {
        'ｱ': 'ア',
        'ｲ': 'イ',
        'ｳ': 'ウ',
        'ｴ': 'エ',
        'ｵ': 'オ',
        'ｶ': 'カ',
        'ｷ': 'キ',
        'ｸ': 'ク',
        'ｹ': 'ケ',
        'ｺ': 'コ',
        'ｻ': 'サ',
        'ｼ': 'シ',
        'ｽ': 'ス',
        'ｾ': 'セ',
        'ｿ': 'ソ',
        'ﾀ': 'タ',
        'ﾁ': 'チ',
        'ﾂ': 'ツ',
        'ﾃ': 'テ',
        'ﾄ': 'ト',
        'ﾅ': 'ナ',
        'ﾆ': 'ニ',
        'ﾇ': 'ヌ',
        'ﾈ': 'ネ',
        'ﾉ': 'ノ',
        'ﾊ': 'ハ',
        'ﾋ': 'ヒ',
        'ﾌ': 'フ',
        'ﾍ': 'ヘ',
        'ﾎ': 'ホ',
        'ﾏ': 'マ',
        'ﾐ': 'ミ',
        'ﾑ': 'ム',
        'ﾒ': 'メ',
        'ﾓ': 'モ',
        'ﾔ': 'ヤ',
        'ﾕ': 'ユ',
        'ﾖ': 'ヨ',
        'ﾗ': 'ラ',
        'ﾘ': 'リ',
        'ﾙ': 'ル',
        'ﾚ': 'レ',
        'ﾛ': 'ロ',
        'ﾜ': 'ワ',
        'ｦ': 'ヲ',
        'ﾝ': 'ン',
        'ｳﾞ': 'ヴ',
        'ｶﾞ': 'ガ',
        'ｷﾞ': 'ギ',
        'ｸﾞ': 'グ',
        'ｹﾞ': 'ゲ',
        'ｺﾞ': 'ゴ',
        'ｻﾞ': 'ザ',
        'ｼﾞ': 'ジ',
        'ｽﾞ': 'ズ',
        'ｾﾞ': 'ゼ',
        'ｿﾞ': 'ゾ',
        'ﾀﾞ': 'ダ',
        'ﾁﾞ': 'ヂ',
        'ﾂﾞ': 'ヅ',
        'ﾃﾞ': 'デ',
        'ﾄﾞ': 'ド',
        'ﾊﾞ': 'バ',
        'ﾋﾞ': 'ビ',
        'ﾌﾞ': 'ブ',
        'ﾍﾞ': 'ベ',
        'ﾎﾞ': 'ボ',
        'ﾊﾟ': 'パ',
        'ﾋﾟ': 'ピ',
        'ﾌﾟ': 'プ',
        'ﾍﾟ': 'ペ',
        'ﾎﾟ': 'ポ',
        'ｧ': 'ァ',
        'ｨ': 'ィ',
        'ｩ': 'ゥ',
        'ｪ': 'ェ',
        'ｫ': 'ォ',
        'ｬ': 'ャ',
        'ｭ': 'ュ',
        'ｮ': 'ョ',
        'ｯ': 'ッ'
    }
    static _convertKatakanaHankakuToZenkaku(str) {
        return str.replace(
            /[\u{FF66}-\u{FF6F}\u{FF71}-\u{FF9D}]\u{FF9E}?/gu,
            (c) => {
                return this._katakanaHankakuToZenkakuMap[c];
            }
        );
    }
}

