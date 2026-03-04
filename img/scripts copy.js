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

const numero1 = 100
const numero2 = 300
const numeroTotal = numero1 + numero2


let abacate1 = 10

abacate1 = 20

console.log(numeroTotal);

const abacate = "Oi, Sou um Abacate!"
const pera = "Oi, Sou um Pera!"

console.log(abacate);
console.log(pera);

function soma(){
    const somatoria = numero1 + numero2
    console.log(somatoria)
}

soma()


function cliqueiNoBotao() {
    alert("Você Clicou no Botão !!!")

}
