module.exports = function getOuterHtmlByTagName (tagName, html, i) {
  let outerHtml = '';
  let counter = 0;
  const strOpenTag1 = `<${tagName} `;
  const strOpenTag2 = `<${tagName}>`;
  const strCloseTag1 = `</${tagName}>`;
  const strCloseTag2 = `</${tagName} `;

  const strOpenTag_length = strOpenTag1.length;
  const strCloseTag_length = strCloseTag1.length;

  const qs = {
    in: false,
    last: null
  };
  let inComment = 0;
  let innerScriptTag = false;
  while (i < html.length) {
    const char = html[i];
    if (inComment > 0) {
      if (html.substr(i, 3) !== '-->') {
        outerHtml += char;
        i ++;
      } else {
        inComment --;
        outerHtml += '-->';
        i += 3;
      }
      continue
    }
    if (char === '"' || char === "'" || char === '`') {
      let escapeString = 0;
      while (html[i - escapeString - 1] === '\\') {
        escapeString ++;
      }
      if (escapeString % 2 === 0) {
        if (qs.in && qs.last === char) {
          qs.in = false;
          qs.last = null;
        } else if (qs.in === false) {
          qs.in = true;
          qs.last = char;
        }
      }
      outerHtml += char;
      i ++;
      continue
    } else if (char === '<') {
      {
        const str = html.substr(i, 8);
        if (str === '<script>' || str === '<script ') {
          innerScriptTag = true;
          counter ++;
          outerHtml += str;
          i+= 8;
          continue;
        }
      }
      {
        const str = html.substr(i, 9);
        if (str === '</script>' || str === '</script ') {
          innerScriptTag = false;
          counter --;
          outerHtml += str;
          i+= 9;
          if (counter === 0) {
            break;
          }
          continue;
        }
      }
      if (!innerScriptTag) {
        {
          const testOpenStr = html.substr(i, strOpenTag_length);
          if (testOpenStr === strOpenTag1 || testOpenStr === strOpenTag2) {
            counter ++;
            outerHtml += testOpenStr;
            i+= strOpenTag_length;
            continue;
          }
        }
        {
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
      }
    }
    outerHtml += char;
    i ++;
  }
  return {
    tagName,
    outerHtml,
    lastIndex: i
  }
}