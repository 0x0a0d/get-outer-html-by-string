# getOuterHTMLByString

This help me get a little html on full page source code. I can use sth likes jsDom to 
get it but very slow because they must make virtual dom. That is not necessary because we just 
need the Text 

```js
const getOuterHtmlByString = require('get-outer-html-by-string');
const chai = require('chai');

const html = '<div>' +
  ' this is a text <span>trap tag<a>a trap in span</a>' +
  '<meta name="ob:cccc" value="1" />' +
  '<meta name="ob:cccc" value="2" />' +
  '<meta name="ob:cccc" value="3" />' +
  '<meta name="ob:cccc" value="4" />' +
  '<meta name="ob:cccc" value="5" />' +
  '<span>another span 1</span></span>' +
  '</div>' +
  '<div>' +
  'another div test' +
  '<span>another span 2</span>' +
  '<span>another span 3</span>' +
  '<div>trap div</div>' +
  '<span>another span 4</span>' +
  '<span>another span 5</span>' +
  '</div>';
describe('test', function() {
  it('meta', function(done) {
    const {lastIndex, outerHtml} = getOuterHtmlByString('<meta', html);
    chai.expect(outerHtml).equal('<meta name="ob:cccc" value="1" />', 'Failed meta tag test');
    done();
  });
  it('meta2', function(done) {
    let lastIndex = 0;
    for (let i = 1; i < 5; i++) {
      const match = getOuterHtmlByString('<meta', html, lastIndex);
      chai.assert.isNotNull(match);
      chai.expect(match.outerHtml).equal(`<meta name="ob:cccc" value="${i}" />`);
      lastIndex = match.lastIndex;
    }
    done();
  });
  it('span', function(done) {
    const {lastIndex, outerHtml} = getOuterHtmlByString('<span>a', html);
    chai.expect(outerHtml).equal('<span>another span 1</span>', 'Failed span tag test');
    done();
  });

  it('span-2', function(done) {
    let lastIndex = 0;
    for (let i = 1; i < 5; i++) {
      const match = getOuterHtmlByString('<span>a', html, lastIndex);
      chai.assert.isNotNull(match);
      chai.expect(match.outerHtml).equal(`<span>another span ${i}</span>`);
      lastIndex = match.lastIndex;
    }
    done();
  });
});
```

## v3 update
```js
// to get all meta tag that have [name="ob:c*] try this
let result = {
  lastIndex: 0
}
for (let i = 1; i <= 5; i ++) {
  result = getOuterHtmlByStringUnsafe({
    searchString: 'name="ob',
    html,
    lastIndex: result.lastIndex
  });
  if (i === 3) {
    // span trap
    chai.expect(result.outerHtml).equal(`<span name="ob:cccc" value="3"> span trap </span>`, `Failed span trap in meta tag test`);
  } else {
    chai.expect(result.outerHtml).equal(`<meta name="ob:cccc" value="${i}" />`, `Failed meta${i} tag test`);
  }
}
```

##Method

```
getOuterHtmlByString(searchString, html, lastIndex);
+ searchString: where the string begin
+ html: full page html need to parse
+ lastIndex: search from, often use in loop to get all 
             or get from after pharse you know it will be in html
=> return {
    lastIndex: where you should start from to find next
    outerHTML: outerHTML start from your searchString and end at its closing-tag
}
In the case html have multiple match searchString, you should add more text after tag.
Look in my example.
If searchString === '<span>'
    + you will get '<span>trap tag<a>a trap in span</a><span>another span</span></span>'
If searchString === '<span>a' // a is first char in word 'another'
    + you get '<span>another span</span>'
```

```
getOuterHtmlByStringUnsafe({searchString, html, lastIndex = 0, forceRegex = false});
+ searchString: where the string begin
+ html: full page html need to parse
+ lastIndex: search from, often use in loop to get all 
             or get from after pharse you know it will be in html
+ forceRegex (default=false): try to parse searchString as RegExp, for more details, lookup in source on GitHub
=> return {
    tagName: matched tagName or null if failed
    lastIndex: where you should start from to find next
    outerHTML: outerHTML start from your searchString and end at its closing-tag or null if failed
}
for more details. Lookup on test folder
```


###Have fun
0x0a0d
