const void_element_list = ["area", "base", "br", "col", "command", "embed", "hr", "img", "input", "keygen", "link", "meta", "param", "source", "track", "wbr"];

/**
 * false if tag is not self-closing tag; else return true if tag is self-closing tag and close tag char does not in search string; else throw error
 * @param tag
 * @param searchString
 * @return {boolean|number} - false if not self-closing tag, number is indexOf closing-tag > char
 */
function void_element_validate(tag, searchString) {
  if (void_element_list.indexOf(tag) !== -1) {
    return searchString.indexOf('>');
  }
  return false;
}
module.exports = void_element_validate;
