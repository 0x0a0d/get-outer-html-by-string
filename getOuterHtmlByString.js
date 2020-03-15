const voidElementValidate = require('./voidElementValidate');
const getOuterHtmlByTagName = require('./getOuterHtmlByTagName');
const validateInput = require('./validateInput');

/**
 * @param searchString
 * @returns {string|null}
 */
function getTagBySearchString(searchString) {
  const re = /<([a-z]+)(?: |$|>)/i;
  const m = searchString.match(re);
  return m == null ? null : m[1];
}

/**
 * get outerHtml by provide
 * @param {string} searchString - begin of tag to match
 * @param {string} html - full html search in
 * @param {number} [lastIndex=0] - start search from
 * @returns {null|{outerHtml: string, lastIndex: number}}
 */
function getOuterHtmlByString(searchString, html, lastIndex = 0) {
  validateInput({ searchString, html });
  const tagName = getTagBySearchString(searchString);
  if (tagName == null) {
    throw new Error(`could not parse tagName by regex /<([a-z]+)(?: |$|>)/i. If you wanna search multiple tags, you should try getOuterHtmlByStringUnsafe`);
  }
  let i = html.indexOf(searchString, lastIndex);
  if (i === -1) return {
    outerHtml: null,
    lastIndex: -1
  };

  const is_self_closing_tag = voidElementValidate(tagName, searchString);

  if (is_self_closing_tag !== false) {
    if (is_self_closing_tag !== -1) {
      throw new Error(`tag ${tagName} is self-closing tag. Your input includes full outerHTML: ${searchString.substring(0, is_self_closing_tag + 1)}`);
    }
    lastIndex = html.indexOf('>', i + searchString.length + 1);
    if (lastIndex === -1) {
      return {
        lastIndex: html.length,
        outerHtml: html.substring(i)
      }
    } else {
      return {
        lastIndex: lastIndex + 1,
        outerHtml: html.substring(i, lastIndex + 1)
      }
    }
  }
  return getOuterHtmlByTagName(tagName, html, i);
}

module.exports = getOuterHtmlByString;
