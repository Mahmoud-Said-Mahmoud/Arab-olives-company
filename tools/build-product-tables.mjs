import { readFileSync, writeFileSync } from 'node:fs'

const records = JSON.parse(readFileSync('docs/reference-extracted.json', 'utf8'))
const sources = {
  'green-whole-manzanillo': 13, 'green-whole-picual': 14,
  'green-sliced-picual': 15, 'green-sliced-manzanillo': 17,
  'green-pitted-picual': 19, 'green-pitted-manzanillo': 20,
  'black-whole-picual': 29, 'black-whole-dolce': 30,
  'black-whole-cerignola': 31, 'black-whole-kalamata': 32,
  'black-whole-manzanillo': 33, 'black-whole-oxidised': 34,
  'black-sliced-picual': 24, 'black-sliced-cerignola': 25,
  'black-sliced-kalamata': 26, 'black-sliced-manzanillo': 27,
  'black-sliced-oxidised': 28,
  'black-pitted-picual': 35, 'black-pitted-cerignola': 36,
  'black-pitted-manzanillo': 37, 'black-pitted-kalamata': 38,
  'black-pitted-oxidised': 39,
}
const tables = {}
for (const [key, index] of Object.entries(sources)) {
  const rows = records[index].rows
  if (rows.length < 2) throw new Error(`Missing source table: ${key}`)
  const width = rows[0].length - 1
  tables[key] = { kind: 'olive', rows: rows.slice(1).map(row => row.slice(-width)) }
}
tables['pickle-whole-cucumber'] = { kind: 'cucumber', rows: records[87].rows.slice(1).map(row => row.slice(-3)) }
writeFileSync('src/data/productTables.json', JSON.stringify(tables, null, 2))
console.log(`Generated ${Object.keys(tables).length} exact-match specification tables`)
