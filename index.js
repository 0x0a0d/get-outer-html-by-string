/**
 * @param searchString
 * @returns {string|null}
 */
function getTagBySearchString(searchString) {
    const re = /<([a-z]+)(?: |>)/i;
    const m = searchString.match(re);
    return m == null ? null : m[1];
}

/**
 * get outerHtml by provide
 * @param searchString
 * @param html
 * @returns {string|null}
 */
function getOuterHtmlByString(searchString, html) {
    if (typeof searchString !== 'string' || typeof html !== 'string') {
        throw new Error(`input searchString or html must be string`);
    }
    const tagName = getTagBySearchString(searchString);
    if (tagName == null) {
        throw new Error(`could not parse tagName by regex /<([a-z]+)(?: |>)/i`);
    }
    let i = html.indexOf(searchString);
    if (i === -1) return null;

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
                if (counter === 0) {
                    return outerHtml;
                }
                i+= strCloseTag_length;
                continue;
            }
        }
        outerHtml += html[i];
        i++;
    }
    return outerHtml;
}

module.exports = getOuterHtmlByString;