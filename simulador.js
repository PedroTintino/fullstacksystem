let resultado = document.getElementById('input-resultado');
let valor = document.getElementById('valor');
let prazoInput = document.getElementById('prazo');

valor.addEventListener('input', calculaResultado);
valor.addEventListener('input', calculaResultado);

function calculaResultado(){
    const valorTotal = parseFloat(valor.value);
    const prazo = parseFloat(prazoInput.value);
    const taxa = 0.05;
       
    const parcela = (valorTotal / prazo) + (valorTotal * taxa);

    const valorFormatado = parcela.toFixed(2);

    // Atualiza o valor da parcela no input
    resultado.value = valorFormatado;
  }
