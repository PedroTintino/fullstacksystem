
document.addEventListener("DOMContentLoaded", function() {
  function validarCPF(cpf) {
    cpf = cpf.replace(/\D/g, ""); // Remove caracteres não numéricos

    if (cpf.length !== 11 || !cpf.match(/^\d+$/g)) {
      return false;
    }

    // Verifica se todos os dígitos são iguais, o que não é permitido
    if (/^(\d)\1{10}$/.test(cpf)) {
      return false;
    }

    // Calcula o primeiro dígito verificador
    let soma = 0;
    for (let i = 0; i < 9; i++) {
      soma += parseInt(cpf.charAt(i)) * (10 - i);
    }
    let digito1 = 11 - (soma % 11);
    if (digito1 > 9) {
      digito1 = 0;
    }

    // Calcula o segundo dígito verificador
    soma = 0;
    for (let i = 0; i < 10; i++) {
      soma += parseInt(cpf.charAt(i)) * (11 - i);
    }
    let digito2 = 11 - (soma % 11);
    if (digito2 > 9) {
      digito2 = 0;
    }

    // Verifica se os dígitos calculados são iguais aos dígitos informados
    if (digito1 === parseInt(cpf.charAt(9)) && digito2 === parseInt(cpf.charAt(10))) {
      return true;
    }

    return false;
  }

  function verificarCPF() {
    let cpfInput = document.getElementById("cpfInput");
    let cpf = cpfInput.value;
    if (validarCPF(cpf)) {
      cpfInput.setCustomValidity(""); // CPF válido, remove a mensagem de erro
    } else {
      cpfInput.setCustomValidity("CPF inválido"); // CPF inválido, exibe mensagem de erro
    }
  }

  let cpfInput = document.getElementById("cpfInput");
  if (cpfInput) {
    cpfInput.addEventListener("input", verificarCPF);
  }
});
