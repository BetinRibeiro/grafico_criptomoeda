Descrição do Projeto

O projeto consiste em uma aplicação para obter informações e visualizar dados históricos de criptomoedas, utilizando a API da Binance para acessar informações em tempo real.
Variáveis Utilizadas

    criptomoeda: Variável para armazenar o código da criptomoeda.
    somaTotal: Variável para armazenar a soma total de valores da criptomoeda.
    precoAtual: Variável para armazenar o preço atual da criptomoeda.
    precoAntigo: Variável para armazenar o preço anterior da criptomoeda.
    media: Variável para armazenar o valor da média móvel da criptomoeda.
    listaBackgroundColor: Lista para armazenar cores de fundo.
    listaDatas: Lista para armazenar datas.
    ctx: Variável para armazenar o contexto do gráfico.
    mediaMovel: Lista para armazenar valores da média móvel.

Funções
calcularPercentual(valor)

Esta função recebe um valor e retorna o valor multiplicado por 100 com uma casa decimal e um símbolo de percentual.
obterTopoHistoricoCriptomoeda(criptomoeda)

Função que realiza uma requisição para a API da Binance e retorna o valor do topo histórico de uma criptomoeda.
calcularEMA(lista)

Função para calcular a Média Móvel Exponencial de uma lista de valores.
isValidFields()

Função para verificar a validade dos campos de formulário.
zerarinformacoes(criptomoeda)

Função para zerar informações.
formataValorDolar(valor)

Função para formatar um valor para o formato de moeda em dólar.
converterData(timestamp)

Função para converter um timestamp para o formato de data dia/mês.
renderizaGrafico(dados)

Função para renderizar um gráfico utilizando a biblioteca Chart.js.
gerarInformacoes(criptomoedap)

Função para obter informações sobre uma criptomoeda a partir da API.
preencheTabela()

Função assíncrona para preencher uma tabela com informações sobre a criptomoeda.
zerarGrafico()

Função para limpar o gráfico existente.



[Acessar](https://betinribeiro.github.io/grafico_criptomoeda)
