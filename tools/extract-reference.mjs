import { readFileSync, writeFileSync } from 'node:fs'
import { parse } from '@babel/parser'

const ast = parse(readFileSync('tools/mr-olive-reference.js', 'utf8'))
const prop = (node, key) => node?.properties?.find(p => p.key?.name === key)?.value
function text(node) {
  if (!node) return ''
  if (node.type === 'StringLiteral' || node.type === 'NumericLiteral') return String(node.value)
  if (node.type === 'ArrayExpression') return node.elements.map(text).join(' ')
  if (node.type === 'CallExpression') return text(prop(node.arguments[1], 'children'))
  return ''
}
function rows(node, output = []) {
  if (!node) return output
  if (node.type === 'CallExpression' && node.arguments[0]?.value === 'tr') {
    const children = prop(node.arguments[1], 'children')
    const cells = children?.type === 'ArrayExpression' ? children.elements : [children]
    output.push(cells.map(cell => text(cell).trim()))
    return output
  }
  for (const [key, value] of Object.entries(node)) {
    if (key === 'loc') continue
    if (Array.isArray(value)) {
      for (const child of value) if (child?.type) rows(child, output)
    } else if (value?.type) rows(value, output)
  }
  return output
}
const records = []
function walk(node) {
  if (!node || typeof node !== 'object') return
  if (node.type === 'ObjectExpression' && prop(node, 'id') && (prop(node, 'text') || prop(node, 'table'))) {
    records.push({ id: text(prop(node, 'id')), description: text(prop(node, 'text')), rows: rows(prop(node, 'table')) })
  }
  for (const [key, value] of Object.entries(node)) {
    if (key === 'loc') continue
    if (Array.isArray(value)) value.forEach(walk)
    else if (value?.type) walk(value)
  }
}
walk(ast)
writeFileSync('docs/reference-extracted.json', JSON.stringify(records, null, 2))
console.log(`Extracted ${records.length} product records`)
