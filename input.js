const readlineSync = require('readline-sync')
const _ = require('lodash')
const glob = require('glob')

module.exports = async () => {
  const clear = readlineSync.question('Limpar? ', {
    trueValue: ['yes', 'yeah', 'yep', 'y'],
    falseValue: ['no', 'nah', 'nope', 'n'],
    defaultInput: 'yes',
    limit: ['yes', 'yeah', 'yep', 'y', 'no', 'nah', 'nope', 'n'],
    limitMessage: 'Sorry, $<lastInput> is not (y) or (n).',
  })
  const quantidadeSentences = readlineSync.question('Quantidade? ', {
    defaultInput: 100,
    limit: /\d/i,
    limitMessage: 'Sorry, $<lastInput> is not number.',
  })
  const fotoName = readlineSync.question('Nome da foto: ', {
    defaultInput: undefined,
  })
  const functionInput = readlineSync.question('Filtro: ', {
    defaultInput: undefined,
  })
  try {
    if (functionInput) eval(functionInput)('oi')
  } catch (error) {
    throw new Error('Função do filtro não tá boa')
  }
  const filesList = await glob.sync('*.jpg', {
    cwd: `./files/backgrounds`,
  })
  const configInput = {
    clear,
    quantidadeSentences: Number(quantidadeSentences),
    backgroundPath: fotoName || `./files/backgrounds/${_.sample(filesList)}`,
    filter: functionInput ? eval(functionInput) : undefined,
  }
  return configInput
}
