module.exports = function validateInput ({searchString, html, forceRegex = false}) {
  if (
    (forceRegex && searchString.constructor !== RegExp) ||
    (!forceRegex && typeof searchString !== 'string') ||
    typeof html !== 'string'
  ) {
    throw new Error(`input searchString or html must be string`);
  }
}