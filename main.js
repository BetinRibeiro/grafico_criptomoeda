var criptomoeda ="SN"
var somaTotal=0
var precoAtual=0
var precoantigo=0
var media=0
var listaBackgroundColor = []
var listaDatas = []
var ctx = document.getElementById('myChart');
var mediaMovel = []

const calcularPercentual = (valor) => {
    const percentual = (valor).toFixed(1); // Multiplica por 100 para obter o percentual e fixa uma casa decimal
    return `${percentual}X`;
};

const obterTopoHistoricoCriptomoeda = (criptomoeda) => {
    const urlBase = "https://api.binance.com/api/v3/klines";
    const params = new URLSearchParams({
        symbol: `${criptomoeda}USDT`,
        interval: "1d",
        limit: 3*365,
    });

    return fetch(`${urlBase}?${params}`)
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error(`Erro ao buscar dados para ${criptomoeda}`);
            }
        })
        .then(dados => {
            const precos = dados.map(candle => parseFloat(candle[4]));
            const topoHistorico = Math.max(...precos);
            return topoHistorico;
        })
        .catch(error => {
            console.error("Erro:", error);
            return null;
        });
};

const calcularEMA=(lista)=> {
    const alpha = 2 / (8 + 1); // Fator de suavização para 8 semanas (neste caso)
    let ema = [];
    let somaInicial = 0;
    for (let i = 0; i < 8; i++) {
      
    somaInicial += parseFloat(lista[i][2]);
    }
    ultimo_valor=0
    ema.push(somaInicial / 8);
    for (let i = 8; i < lista.length; i++) {
      let valorEMA = (lista[i][2] - ema[i - 8]) * alpha + ema[i - 8];
      ema.push(valorEMA);
      ultimo_valor=(valorEMA);      
    }
    mediaMovel = ema
    return ultimo_valor;
  }
  
const isValidFields = () => {
    // Define uma função chamada isValidFields
    return document.getElementById('pesquisa').reportValidity();
}

const zerarinformacoes= (criptomoeda) =>{
}
const formataValorDolar=(valor)=>{
    valor =parseFloat(valor).toLocaleString('pt-br',{style: 'currency', currency: 'USD'});
    return String(valor)
}
const converterData=(timestamp)=> {
    let data = new Date(timestamp);
    let dia = data.getDate();
    let mes = data.getMonth() + 1; // O mês começa do zero, então adicionamos 1 para obter o número do mês correto
    return `${dia < 10 ? '0' + dia : dia}/${mes < 10 ? '0' + mes : mes}`;
}
const renderizaGrafico = (dados) => {
    // Chama a função zerarGrafico para limpar o gráfico existente antes de renderizar um novo
    zerarGrafico();
    // Obtém o elemento do gráfico pelo ID 'myChart' e armazena em ctx
    const ctx = document.getElementById('myChart');
    
    // Cria um novo gráfico usando a biblioteca Chart.js
    var myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: listaDatas.slice(-130),
            datasets: [{
                label: criptomoeda,
                data: dados.slice(-130),
                backgroundColor: 'rgba(54, 162, 235, 0.02)', // Cor de fundo dos dados
                borderColor: 'rgba(54, 162, 235, 1)', // Cor da borda dos dados
                borderWidth: 1,
                pointBackgroundColor: 'rgba(90, 252, 3, 1)', // Cor dos pontos no gráfico
                pointRadius: 1, // Tamanho dos pontos no gráfico
                pointHoverRadius: 7 // Tamanho dos pontos ao passar o mouse sobre eles
            }, {
                label: 'Média Móvel',
                data: mediaMovel.slice(-130),
                borderColor: 'red', // Cor da linha da média móvel
                pointRadius: 1, // Tamanho dos pontos no gráfico
                borderWidth: 1,
                fill: false // Não preenche a área abaixo da linha da média móvel
            }]
        },
        options: {
            responsive: true,
            legend: {
                position: 'top',
                labels: {
                    fontColor: 'black', // Cor do texto da legenda
                    fontSize: 14 // Tamanho da fonte da legenda
                }
            },
            title: {
                display: true,
                text: 'Gráfico de ' + criptomoeda, // Título do gráfico
                fontSize: 18 // Tamanho da fonte do título
            },
            animation: {
                animateScale: true,
                animateRotate: true
            },
            scales: {
                xAxes: [{
                    gridLines: {
                        display: false // Oculta as linhas de grade no eixo X
                    },
                    ticks: {
                        fontColor: 'black' // Cor do texto do eixo X
                    }
                }],
                yAxes: [{
                    gridLines: {
                        color: 'rgba(0, 0, 0, 0.1)' // Cor das linhas de grade no eixo Y
                    },
                    ticks: {
                        fontColor: 'black' // Cor do texto do eixo Y
                    }
                }]
            }
        }
    });
    
}
const gerarInformacoes = (criptomoedap) => {
    // Cria a URL para a solicitação dos dados sobre a criptomoeda especificada
    let url = `https://api.binance.com/api/v3/klines?symbol=${criptomoedap.toUpperCase()}USDT&interval=1d&limit=156`;

    // Inicializa uma requisição XMLHttpRequest
    let request = new XMLHttpRequest();

    criptomoeda = criptomoedap;
    
    try {
        // Abre uma solicitação GET síncrona para a URL especificada
        request.open("GET", url, false);
        // Envia a solicitação
        request.send();

        // Converte a resposta da solicitação para um formato legível (neste caso, um array)
        lista = JSON.parse(request.responseText);
        // Exibe a lista no console para fins de depuração
        
        // Inicializa variáveis para os cálculos
        listaValores = [];
        somaTotal = 0;
        precoAntigo = lista[0][4];
        // console.log(precoAntigo);
        precoAtual = lista[lista.length - 1][4];
        listaDatas = []
        // Itera sobre a lista para coletar valores e calcular a média
        for (item in lista) {
            listaValores.push(parseFloat(lista[item][4])); // Armazena os valores em um array separado
            listaDatas.push(converterData(lista[item][0]));
            somaTotal += parseFloat(lista[item][4]); // Soma os valores para calcular a média
            listaBackgroundColor.push('rgba(05, 192, 90, 0.2)'); // Define uma cor para os valores
        }

        // Calcula a média dos valores
        media = calcularEMA(lista);
        // console.log(media);
        // Renderiza o gráfico com os valores coletados
        renderizaGrafico(listaValores);
        
        // Preenche a tabela com as informações da criptomoeda
        preencheTabela();

        // Exibe o elemento 'informacoes' (se existir) removendo a classe 'd-none' para mostrar os dados
        document.getElementById('informacoes').classList.remove('d-none');
    } catch (e) {
        // Se ocorrer um erro, oculta o elemento 'informacoes' adicionando a classe 'd-none' e registra o erro
        document.getElementById('informacoes').classList.add('d-none');
        logMyErrors(e); // Registra o erro no manipulador de erro
    }
}
const buscar = () => {
    // Limpa as informações existentes antes de uma nova busca
    zerarinformacoes();
    // Verifica se os campos do formulário são válidos
    if (isValidFields()) {
        // Obtém o valor do campo de pesquisa e o transforma em letras maiúsculas
        criptomoeda = (document.getElementById('pesquisa').value).toUpperCase();

        // Chama a função para buscar e exibir informações da criptomoeda especificada
        gerarInformacoes(criptomoeda);
    }
}

const preencheTabela = async () => {
    // Remove as informações existentes da tabela antes de atualizar
    const rows = document.querySelectorAll('#info>ul div');
    rows.forEach(row => row.parentNode.removeChild(row));

    // console.log(precoAntigo);
    // Cria um novo elemento div para conter as informações da criptomoeda
    const newRow = document.createElement("div");
    
    // Insere as informações da criptomoeda dentro do novo elemento div

    const topoHistorico = await obterTopoHistoricoCriptomoeda(criptomoeda);
    // console.log(precoAntigo);
    newRow.innerHTML =  `
        <h1>${criptomoeda}</h1>
        <li class="list-group-item d-flex justify-content-between">
            <div>
                <h6 class="my-0">
                    <b>Valor Atual</b>
                </h6> 
                <small class="">Data de Hoje</small>
            </div> 
            <span class="">${formataValorDolar(precoAtual)}</span>
        </li>
        <li class="list-group-item d-flex justify-content-between">
            <div>
                <h6 class="my-0">
                    <b>Preco Anterior</b>
                </h6> 
                <small class="">4 Semanas Atrás</small>
            </div> 
            <span class="">${formataValorDolar(precoAntigo)}</span>
        </li>
        <li class="list-group-item d-flex justify-content-between">
            <div>
                <h6 class="my-0">
                    <b>EMA </b>
                </h6> 
                <small class="">4 Semanas</small>
            </div> 
            <span class="">${formataValorDolar(media)}</span>
        </li>
        <li class="list-group-item d-flex justify-content-between">
            <div>
                <h6 class="my-0">
                    <b>Topo Historico </b>
                </h6> 
                <small class="">1200 Dias</small>
            </div> 
            <span class="">${formataValorDolar(topoHistorico)}</span>
        </li>
        <li class="list-group-item d-flex justify-content-between">
            <div>
                <h6 class="my-0">
                    <b>Especulação </b>
                </h6> 
                <small class="">Especulação</small>
            </div> 
            <span class="">${calcularPercentual(topoHistorico/precoAtual)}</span>
        </li>
    `;

    // console.log(precoAntigo);
    // Determina o status da criptomoeda e adiciona à tabela
    if (media > precoAtual) {
        newRow.innerHTML += `
            <li class="list-group-item d-flex justify-content-between">
                <div>
                    <h6 class="my-0">
                        <b>Status</b>
                    </h6> 
                    <small class="text-danger">Não Compre</small>
                </div> 
                <span class="text-danger">Vendido</span>
            </li>
        `;
    } else {
        newRow.innerHTML += `
            <li class="list-group-item d-flex justify-content-between">
                <div>
                    <h6 class="my-0">
                        <b>Status</b>
                    </h6> 
                    <small class="text-success">pode Comprar</small>
                </div> 
                <span class="text-success">Comprado</span>
            </li>
        `;
    }

    // Adiciona as novas informações ao elemento 'ul' dentro do elemento com ID 'info'
    document.querySelector('#info>ul').appendChild(newRow);
}

// Adiciona um evento de clique ao botão com ID 'buscar' para acionar a função buscar
document.getElementById('buscar').addEventListener('click', buscar);

const zerarGrafico = () => {
    const chartElement = document.getElementById('myChart');
    if (chartElement) {
        if (chartElement.chart) {
            chartElement.chart.data.labels = []; // Limpa os rótulos do eixo x
            chartElement.chart.data.datasets.forEach((dataset) => {
                dataset.data = []; // Limpa os dados do gráfico
            });
            chartElement.chart.update(); // Atualiza o gráfico
        }
    }
}
