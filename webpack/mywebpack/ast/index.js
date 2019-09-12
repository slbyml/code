const parseAst = require('@babel/parser')
const traverse = require('@babel/traverse').default
const t = require('@babel/types')
const generator = require('@babel/generator').default

const code = 'const a = (b) => 123 + b'
const ast = parseAst.parse(code)

traverse(ast, {
  VariableDeclaration(p) {
    if (p.node.kind === 'const') {
      p.node.kind = 'var'
    }
  },
  ArrowFunctionExpression(p) {
    const node = p.node
    const returnB = t.returnStatement(node.body)
    var block = t.blockStatement([returnB])
    p.replaceWith(t.functionExpression(null, node.params, block, false, false))
  }
})

console.log(generator(ast).code);
