// Dimensions supplied by the owner in the pepper reference screenshots.
export function pepperSpecs(p, lang) {
  if (p.cat !== 'pepper') return []
  const ar = lang === 'ar'
  const cm = ar ? 'سم' : 'cm'
  const mm = ar ? 'مم' : 'mm'
  const row = (label, value) => ({ label, value })
  if (p.variety === 'jalapeno' && p.cut === 'whole') {
    return [row(ar ? 'الطول' : 'Length', `4-8 ${cm}`)]
  }
  if (p.variety === 'cherry') {
    return [row(ar ? 'الطول' : 'Length', `25-50 ${mm}`)]
  }
  if (p.variety === 'mexican') {
    return [row(ar ? 'الطول - ميديام' : 'Length - medium', `3-6 ${cm}`), row(ar ? 'الطول - لارج' : 'Length - large', `6-10 ${cm}`)]
  }
  if (p.variety === 'jalapeno' && p.cut === 'sliced') {
    const red = p.en.includes('red')
    return [row(ar ? 'قطر الشرائح' : 'Slice diameter', `${red ? '1.5-3.5' : '1.5-3'} ${cm}`), row(ar ? 'سمك الشرائح' : 'Slice thickness', `${red ? '1' : '0.5'} ${cm}`)]
  }
  return []
}
