var criptomoeda =""
var somaTotal=0
var precoAtual=0
var precoantigo=0
var media=0
var listaBackgroundColor = []
var ctx = document.getElementById('myChart');

const isValidFields = () => {
    return document.getElementById('pesquisa').reportValidity()
}

const zerarinformacoes= (criptomoeda) =>{
    // console.log("entraemzerar mais não faz nada");
    // document.getElementById('informacoes').classList.add('d-none')
}
const formataValorDolar=(valor)=>{
    valor =parseFloat(valor).toLocaleString('pt-br',{style: 'currency', currency: 'USD'});
    return String(valor)
}
const renderizaGrafico=(dados)=>{
    zerarGrafico()
    ctx = document.getElementById('myChart');
    var myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: dados,
            datasets: [{
                label: criptomoeda,
                data: dados,
                backgroundColor: listaBackgroundColor,
                // borderColor : listaBackgroundColor,
                borderWidth: 1
            }]
        },
        options: {
        //   layout: {
        //       padding: 20
        //   },
          responsive: true,
          legend: {
            position: 'top',
          },
          title: {
            display: false,
            text: '###'
          },
          animation: {
            animateScale: true,
            animateRotate: true
          }
        }
    });
}
const gerarInformacaoes= (criptomoeda) =>{
    zerarinformacoes()
    let url = `https://api.binance.com/api/v3/klines?symbol=${criptomoeda.toUpperCase()}USDT&interval=1d&limit=156`
    let request = new XMLHttpRequest()
    try{
        request.open("GET",url,false)
        request.send()
        // Vem assim [ 1641340800000, "1.31000000", "1.35300000", 
        // "1.19300000", "1.23000000", "158740088.20000000", 
        // 1641427199999, "203778648.55900000", 365590, 
        // "76050733.20000000", … ]
        lista = JSON.parse(request.responseText)
        console.log(lista);
        listaValores =[]
        somaTotal=0
        precoantigo = lista[0][4]
        precoAtual= lista[lista.length-1][4]
        for (item in lista){
            listaValores.push(parseFloat(lista[item][4]))
            somaTotal += parseFloat(lista[item][4])
            listaBackgroundColor.push('rgba(05, 192, 90, 0.2)')
        }
        media = somaTotal/lista.length
        renderizaGrafico(listaValores);
        preencheTabela()
        document.getElementById('informacoes').classList.remove('d-none')
    }catch (e) {
        document.getElementById('informacoes').classList.add('d-none')
        logMyErrors(e); // passa o objeto de exceção para o manipulador de erro
     }
}
const buscar =() =>{

    if (isValidFields()) {
        criptomoeda = (document.getElementById('pesquisa').value).toUpperCase()
        gerarInformacaoes(criptomoeda)
    }
}

const preencheTabela = () =>{
    const rows = document.querySelectorAll('#info>ul div')
    rows.forEach(row => row.parentNode.removeChild(row))
    // rows = document.querySelectorAll('#myChart')
    // rows.forEach(row => row.parentNode.removeChild(row))
    const newRow = document.createElement("div")
    
    newRow.innerHTML = `
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
        <span class="">${formataValorDolar(precoantigo)}</span>
    </li>
    <li class="list-group-item d-flex justify-content-between">
        <div>
            <h6 class="my-0">
            <b>Média Preco</b>
            </h6> 
            <small class="">4 Semanas</small>
        </div> 
        <span class="">${formataValorDolar(media)}</span>
    </li>
    `
    if (media>precoAtual) {
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
    `
    }else{
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
    `
    }
    document.querySelector('#info>ul').appendChild(newRow)
}
document.getElementById('buscar')
.addEventListener('click', buscar)

const zerarGrafico=()=>{
   
}