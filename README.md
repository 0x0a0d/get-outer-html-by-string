# getOuterHTMLByString

This help me get a little html on full page source code. I can use sth likes jsDom to 
get it but very slow because they must make virtual dom. That is not necessary because we just 
need the Text 

```js
const getOuterHtmlByString = require('../index');

const html = '<div> this is a text <span>trap tag<a>a trap in span</a><span>another span</span></span></div>';
const outer = getOuterHtmlByString('<span>a', html);

console.log(outer); // <span>another span</span>
```

##Method

```
getOuterHtmlByString(searchString, html);
+ searchString: where the string begin
+ html: full page html need to parse

In the case html have multiple match searchString, you should add more text after tag.
Look in my example.
If searchString === '<span>'
    + you will get '<span>trap tag<a>a trap in span</a><span>another span</span></span>'
If searchString === '<span>a' // a is first char in word 'another'
    + you get '<span>another span</span>'
```


###Have fun
0x0a0d