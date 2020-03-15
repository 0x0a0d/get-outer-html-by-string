const escapeStringRegexp = require('escape-string-regexp');
const validateInput = require('./validateInput');
const voidElementValidate = require('./voidElementValidate');
const getOuterHtmlByTagName = require('./getOuterHtmlByTagName');

/**
 * get outerHtml by provide
 * @param {string} searchString - begin of tag to match
 * @param {string} html - full html search in
 * @param {forceRegex} forceRegex - searchString is RegExp, not string
 * @param {number} [lastIndex=0] - start search from
 * @returns {null|{outerHtml: string, lastIndex: number}}
 */
function getOuterHtmlByStringUnsafe({searchString, html, lastIndex = 0, forceRegex = false}) {
  validateInput({searchString, html, forceRegex});
  let searchRegex;
  if (forceRegex) {
    const regStr = searchString.toString();
    if (regStr.substr(1, 1) !== '<') {
      let flags = regStr.replace(/^.*\/([gimy]*)$/, '$1');
      const pattern = regStr.replace(/^\/(.*)\/.*$/, '$1');
      if (flags.indexOf('g') === -1) {
        flags += 'g';
      }
      if (/^[a-zA-Z]*>/.test(pattern)) {
        const suffixTagName = pattern.replace(/^([a-zA-Z]*)>.*/, '$1')
        searchRegex = new RegExp(`<\\s*([a-zA-Z]*${suffixTagName})>${pattern.replace(/^[a-zA-Z]*>(.*)$/, '$1')}`, flags);
      } else {
        searchRegex = new RegExp(`<\\s*([a-zA-Z]+)\\s[^>]*?${pattern}`, flags);
      }
    }
  } else if (/^[a-zA-Z]*>/.test(searchString)) {
    const suffixTagName = searchString.replace(/^([a-zA-Z]*)>.*/, '$1')
    searchRegex = new RegExp(`<\\s*([a-zA-Z]*${suffixTagName})>${escapeStringRegexp(searchString.replace(/^[a-zA-Z]*>(.*)$/, '$1'))}`, 'g');
  } else {
    searchRegex = new RegExp(`<\\s*([a-zA-Z]+)\\s[^>]*?${escapeStringRegexp(searchString)}`, 'g');
  }
  searchRegex.lastIndex = lastIndex;
  const m = searchRegex.exec(html);
  if (m != null) {
    const [matchString, tagName] = m;
    const is_self_closing_tag = voidElementValidate(tagName, matchString);
    if (is_self_closing_tag === false) {
      return getOuterHtmlByTagName(tagName, html, searchRegex.lastIndex - matchString.length);
    } else if (is_self_closing_tag !== -1) {
      const outerHtml = matchString.substr(0, is_self_closing_tag + 1);
      return {
        tagName,
        outerHtml,
        lastIndex: searchRegex.lastIndex - matchString.length + is_self_closing_tag + 1
      }
    } else {
      const closingTagIndex = html.indexOf('>', searchRegex.lastIndex);
      const lastIndex = closingTagIndex === -1 ? html.length : (closingTagIndex + 1);
      return {
        tagName,
        outerHtml: matchString + html.substring(searchRegex.lastIndex, lastIndex),
        lastIndex
      }
    }
  } else {
    return {
      outerHtml: null,
      lastIndex: -1
    }
  }
}

module.exports = getOuterHtmlByStringUnsafe;
