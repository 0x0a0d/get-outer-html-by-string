module.exports = function getOuterHtmlByTagName (tagName, html, i) {
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
    tagName,
    outerHtml,
    lastIndex: i
  }
}