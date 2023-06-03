const form = document.querySelector('.user-form');

form.addEventListener('submit', (event) => {
  event.preventDefault();

  const firstName = form['firstName'].value;
  const lastName = form['lastName'].value;
  const email = form['email'].value;
  const cpf = form['cpf'].value;

  const formData = {
    firstName,
    lastName,
    email,
    cpf
  };

  axios.post('/cadastro', formData)
    .then((response) => {
      console.log('Formulário enviado com sucesso!');
      alert('Dados enviados! Clique em OK para ir para a simulação.')
      window.location.href = '/simulador';
    })
    .catch((error) => {
      console.error('Erro ao enviar o formulário:', error);
    });
});

  const simulatorForm = document.querySelector('.simulator-form');

  simulatorForm.addEventListener('submit', function(event) {
    event.preventDefault();

    const prazo = simulatorForm.elements.prazo.value;
    const valor = simulatorForm.elements.valor.value;
    const parcela = simulatorForm.elements.resultado.value;

    const simulData = {
      prazo,
      valor,
      parcela
    };

    axios.post('/simulacao', simulData)
      .then(function(response) {
        console.log('Formulário enviado com sucesso!');
        alert('Dados enviados! Clique em OK para ir para a simulação.')
        window.location.href = '/send';
      })
      .catch(function(error) {
        console.log(error);
      });
  });







