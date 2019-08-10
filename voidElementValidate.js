const void_element_list = ["area", "base", "br", "col", "command", "embed", "hr", "img", "input", "keygen", "link", "meta", "param", "source", "track", "wbr"];

/**
 * false if tag is not self-closing tag; else return true if tag is self-closing tag and close tag char does not in search string; else throw error
 * @param tag
 * @param searchString
 * @return {boolean}
 */
function void_element_validate(tag, searchString) {
  if (void_element_list.indexOf(tag) === -1) return false;
  const close_tag_char_index = searchString.indexOf('>');
  if (close_tag_char_index !== -1) {
    throw new Error(`tag ${tag} is self-closing tag. Your input does include fully outerHTML: ${searchString.substring(0, close_tag_char_index + 1)}`);
  }
  return true;
}
module.exports = void_element_validate;
