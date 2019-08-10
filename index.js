const voidElementValidate = require('./voidElementValidate');

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
  if (typeof searchString !== 'string' || typeof html !== 'string') {
    throw new Error(`input searchString or html must be string`);
  }
  const tagName = getTagBySearchString(searchString);
  if (tagName == null) {
    throw new Error(`could not parse tagName by regex /<([a-z]+)(?: |$|>)/i`);
  }
  let i = html.indexOf(searchString, lastIndex);
  if (i === -1) return null;

  const is_self_closing_tag = voidElementValidate(tagName, searchString);

  if (is_self_closing_tag) {
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

  let outerHtml = '';
  let counter = 0;
  const strOpenTag1 = `<${tagName} `;
  const strOpenTag2 = `<${tagName}>`;
  const strCloseTag1 = `</${tagName}>`;
  const strCloseTag2 = `</${tagName} `;

  const strOpenTag_length = strOpenTag1.length;
  const strCloseTag_length = strCloseTag1.length;

  while (i < html.length) {
    if (html[i] === '<') {
      const testOpenStr = html.substr(i, strOpenTag_length);
      if (testOpenStr === strOpenTag1 || testOpenStr === strOpenTag2) {
        counter ++;
        outerHtml += testOpenStr;
        i+= strOpenTag_length;
        continue;
      }
      const testCloseStr = html.substr(i, strCloseTag_length);
      if (testCloseStr === strCloseTag1 || testCloseStr === strCloseTag2) {
        counter --;
        outerHtml += testCloseStr;
        i+= strCloseTag_length;
        if (counter === 0) {
          break;
        }
        continue;
      }
    }
    outerHtml += html[i];
    i++;
  }
  return {
    outerHtml,
    lastIndex: i
  };
}

module.exports = getOuterHtmlByString;
