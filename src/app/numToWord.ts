const AND = 'and';
const NIL = 'zero';
const NUMBERS = [' ', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];
const TENS = [' ', ' ', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];
const UNITS = [' ', ' ', 'hundred', 'thousand', 'million', 'billion', 'trillion', 'quadrillion', 'quintillion', 'sextillion', 'septillion', 'octillion', 'nonillion', 'decillion', 'undecillion', 'duodecillion', 'tredecillion', 'quattuordecillion', 'quindecillion', 'sedecillion', 'septendecillion', 'octodecillion', 'novendecillion', 'vigintillion', 'unvigintillion', 'duovigintillion', 'tresvigintillion', 'quattuor­vigint­illion', 'quinvigintillion', 'sesvigintillion', 'septemvigintillion', 'octovigintillion', 'novemvigintillion', 'trigintillion', 'untrigintillion', 'duotrigintillion', 'trestrigintillion', 'quattuor­trigint­illion', 'quintrigintillion', 'sestrigintillion', 'septentrigintillion', 'octotrigintillion', 'noventrigintillion', 'quadragintillion', 'quinquagintillion', 'sexagintillion', 'septuagintillion', 'octogintillion', 'nonagintillion', 'centillion', 'uncentillion', 'decicentillion', 'undecicentillion', 'viginticentillion', 'unviginticentillion', 'trigintacentillion', 'quadra­gintacent­illion', 'quinqua­gintacent­illion', 'sexagintacentillion', 'septuagintacentillion', 'octogintacentillion', 'nonagintacentillion', 'ducentillion', 'trecentillion', 'quadringentillion', 'quingentillion', 'sescentillion', 'septingentillion', 'octingentillion', 'nongentillion', 'millinillion'];
const ZEROS = [0, 1, 2, 3, 6, 9, 12, 15, 18, 21, 24, 27, 30, 33, 36, 39, 42, 45, 48, 51, 54, 57, 60, 63, 66, 69, 72, 75, 78, 81, 84, 87, 90, 93, 96, 99, 102, 105, 108, 111, 114, 117, 120, 123, 153, 183, 213, 243, 273, 303, 306, 333, 336, 363, 366, 393, 423, 453, 483, 513, 543, 573, 603, 903, 1203, 1503, 1803, 2103, 2403, 2703, 3003];

const mark = (w, index) => index > 2 ? ` ${w} ` : w;

export default function toWords(n) {
    n = n.toString().replace(/[^0-9]/g, ' ').replace(/^0+/, ' ');

    if (!n.length || n.length > ZEROS.at(-1)) return '';
    if (!Number(n)) return NIL;

    if (n < 20) return NUMBERS[n];
    if (n < 100) return TENS[Math.floor(n / 10)] + NUMBERS[n % 10];

    const length = n.length;
    const index = ZEROS.findIndex(n => n > length - 1) - 1;

    const [ major, minor ] = [ n.substring(0, length - ZEROS[index]), n.substring(length - ZEROS[index]) ].map(toWords);

    return major + ' ' + mark(UNITS[index], index) + (index === 2 && minor ? ` ${AND} ` : '') + (minor=="zero"?"":minor || '');
}
