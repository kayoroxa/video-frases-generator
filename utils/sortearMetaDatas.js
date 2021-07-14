const _ = require('lodash')

const metaTag = {
  tags: [
    'aprender ingles',
    'ingles',
    'como aprender ingles',
    'curso de ingles',
    'ingles basico',
    'aprender ingles online',
    'aprender ingles basico',
    'aprender ingles rápido',
    'ingles para principiantes',
    'aprender inglês',
    'frases para aprender ingles rápido',
    'ingles gratis',
    'curso de ingles gratis',
    'frases em ingles',
    'aprender ingles sozinho',
    'inglês',
    'aprender inglês sozinho',
    'aula de inglês',
    'aula de ingles',
    'metodo para aprender ingles',
    'ingles em 6 meses',
    'frases para aprender inglês',
    'frases em inglês',
    'frases para aprender inglês',
    'melhores frases para aprender inglês',
    '100 frases para aprender inglês',
    'frases em ingles',
    'frases em ingles com tradução',
    'frases básicas em inglês',
    'frases em inglês',
    '100 frases em inglês com tradução',
    '100 frases em inglês',
    'como aprender a falar frases em inglês',
    'frases em ingles',
    'frases com tradução',
    'falar ingles sozinho',
    'como aprender a falar ingles sozinho',
    'aprender a falar ingles sozinho',
    'como falar ingles sozinho',
    'estudar inglês',
    'frases em ingles para aprender dormindo',
    'aprenda inglês dormindo',
    'aprender ingles dormindo',
    'aprender ingles dormindo funciona',
  ],
  titles: [
    'Aprenda inglês (X) frases curtas para aprender inglês rápido',
    'Aprender Inglês Dormindo (X) Frases essenciais em inglês com áudio em inglês português',
    '(X) FRASES PARA APRENDER INGLÊS| ÁUDIO: PORTUGUÊS & INGLÊS',
    '(X) Min de frases em inglês para treinar listening |Com áudio 1x PORTUGUÊS e 2x INGLÊS ',
    '(X) Frases em inglês|COM ÁUDIO em PORTUGUÊS e INGLÊS',
    'Frase básicas pra usar no dia a dia |INGLÊS PARA INICIANTES',
    '(X) Frases em inglês FÁCEIS E CURTAS para melhorar seu vocabulário',
    '(X) Min de frases fáceis em Inglês',
  ],
  descriptions: [
    'Ouça repetidamente a pronúncia, e isso melhorará bastante seu nível de compreensão em inglês. O áudio será tocado (X) vezes em inglês pra você conseguir absorver a frase.',
    'Apenas toque este vídeo enquanto você está dormindo para aprender inglês dormindo. E deixe a sua mente trabalhar para você, com isso aumentar a retenção de vocabulário das palavras em inglês. Memorize vocabulário com mais facilidade ouvindo este vídeo todas as noites e aprenda inglês dormindo.',
    'Quer se tornar capaz de falar inglês fluentemente sozinho? Se sim, tente acompanhar o áudio lendo alto. Se você praticar repetidas vezes, as expressões nesse vídeo, as frases que você lembrar ao longo do tempo irá sair da sua boca naturalmente.',
    'O melhor jeito de aprender inglês é a familiarização com a língua, e sabendo disso preparei nesse vídeo as frases mais úteis pra você treinar com os áudios e a tradução. Nesse vídeo foram eu separei (X) frases de estrutura e vocabulários simples e fácil para você aprender inglês de forma simples. Apenas frases simples com tradução pra você aprender sozinho no conforto do seu lar e no seu ritmo.',
    'Você quer aprender inglês de forma simples e pratica? Este vídeo tem (X) frases úteis e práticas em inglês. Após rever esse vídeo várias vezes você deve saber como usar essas frases. Deve ser muito útil para todos e especialmente para iniciantes.',
  ],
}

function sortearMetaDatas() {
  const metaTagRandom = {
    title: _.sample(metaTag.titles),
    descriptions:
      _.sample(metaTag.descriptions) + '\n Curta e se inscreva no canal',
    tags: _.sampleSize(metaTag.tags, 10).join(', '),
  }
  console.log(metaTagRandom)
}
sortearMetaDatas()
module.exports = sortearMetaDatas
