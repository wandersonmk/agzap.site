/*
    console.log("Hello World!")
    console.log("Olá Mundo!")   
*/
/* 
    Variáveis 
        Um espaço de memória que você 
        reserva e pode guardar o que 
        quiser la dentro

        3 Jeitos de criar uma Var no JS:

        - var / jeito antigo - obsoleto - NÃO USE
        - let -> VOCÊ pode alterar o valor depois
        - const -> constante

    Funções
        Um trecho de código que é executado só quando é chamado

        function soma(){
            const somatoria = numero1 + numero2
            console.log(somatoria)
        }

*/

const form = document.querySelector(".formulario-fale-conosco")
const mascara = document.querySelector(".mascara-formulario")

// Teste para desabilitar e habilitar botão do formulario quando campos preenchidos

const nomeInput = document.getElementById('nome');
const telefoneInput = document.getElementById('telefone');
const duvidaTextarea = document.getElementById('duvida');
const submitButton = document.getElementById('submitButton');

function mostrarForm(event) {
    event.preventDefault(); // Impede a navegação para a página "fale-conosco.html"    
    form.style.left = "50%"
    form.style.transform = "translateX(-50%)"
    mascara.style.visibility = "visible"
    // form.style.transition = "0.5s ease-in-out";  
}

function esconderForm() {
    form.style.left = "-300px";
    form.style.transform = "translateX(0)"
    mascara.style.visibility = "hidden"  
    // form.style.transition = "0.5s ease-in-out";
}

// Função para verificar se todos os campos estão preenchidos
function checkFormValidity() {
    // Verifica se todos os campos têm algum valor
    if (nomeInput.value !== '' && telefoneInput.value !== '' && duvidaTextarea.value !== '') {
      submitButton.disabled = false; // Habilita o botão para ser clicado
    } else {
      submitButton.disabled = false; // Habilita o botão para ser clicado
    }
  }
  
// Adiciona event listeners para os inputs e textarea
nomeInput.addEventListener('input', checkFormValidity);
telefoneInput.addEventListener('input', checkFormValidity);
duvidaTextarea.addEventListener('input', checkFormValidity);

// Verifica a validade do formulário ao carregar a página
checkFormValidity();
