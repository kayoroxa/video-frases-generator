const readlineSync = require('readline-sync')

module.exports = () => {
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
    defaultInput: 'back (1)',
  })
  const functionInput = readlineSync.question('Filtro: ', {
    defaultInput: undefined,
  })
  try {
    if (functionInput) eval(functionInput)('oi')
  } catch (error) {
    throw new Error('Função do filtro não tá boa')
  }
  const configInput = {
    clear,
    quantidadeSentences: Number(quantidadeSentences),
    backgroundPath: `./files/backgrounds/${fotoName}.jpg`,
    filter: functionInput ? eval(functionInput) : undefined,
  }
  return configInput
}
