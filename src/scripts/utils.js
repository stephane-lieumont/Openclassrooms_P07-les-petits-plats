export function formatString (string) {
  let formatString = string.toLowerCase()
  formatString = formatString.replace(/[éèêë]/g, 'e')
  formatString = formatString.replace(/[àâ]/g, 'a')
  formatString = formatString.replace(/[ùû]/g, 'u')
  formatString = formatString.replace(/[îï]/g, 'i')
  formatString = formatString.replace(/[ç]/g, 'c')

  return formatString
}
