module.exports = function validateInput ({searchString, html, forceRegex = false}) {
  if (
    (forceRegex && searchString.constructor !== RegExp) ||
    (!forceRegex && typeof searchString !== 'string')
  ) {
    throw new Error(`input searchString must be string/regex`);
  }
  if (typeof html !== 'string') {
    throw new Error(`input html must be string`);
  }
}