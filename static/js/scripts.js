// função sugerida pelo django para adicionar camada de segurança
function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}
const csrftoken = getCookie('csrftoken');


// variável de uso global para alteração de estado
var itemAtivo = null


// função que lista as tarefas cadastradas em banco de dados
function buildList () {
    // variável que faz um apontamento para a área do HTML que contém o id list-wrapper
    var wrapper = document.querySelector('#list-wrapper')
    // estrutura que evita a apresentação duplicada quando uma nova tarefa é inserida em banco de dados
    wrapper.innerHTML = ''
    // variável para armazenar o link de url que será usado na conexão com o back-end
    var url = 'http://127.0.0.1:8000/api/task-list/'
    // função fetch que permite a conexão com o back-end para método GET
    fetch(url)
    // promessa que obtém o retorno do back-end e o transforma em objeto json
    .then((resp) => resp.json())
    // promessa que recebe informações da etapa anterior e efetua outros tratamentos
    .then(function (data) {
        console.log('Data: ', data)
        // adiciona informações obtidas em lista
        var list = data
        console.log(list)
        // loop para percorrer lista criada
        for (var elemento in list) {
            // variável que recebe uma estrutura HTML, apontando para o título contido no elemento em questão no loop
            var title = `<span class="title">${list[elemento].title}</span>`
            // condicional que verifica estado da tarefa e aplica traço na palavra quando é verdadeiro
            if (list[elemento].complete == true) {
                title = `<strike class="title">${list[elemento].title}</strike>`
            }
            // variável que cria estrutura HTML, com referências trazidas do objeto/elemento do loop
            var item = `<div id="data-row-${elemento}" class="task-wrapper flex-wrapper">
                            <div style="flex:7">
                                ${title}
                            </div>
                            <div style="flex:1">
                                <button class="btn btn-sm btn-outline-info edit">Editar</button>
                            </div>
                            <div style="flex:1">
                                <button class="btn btn-sm btn-outline-dark delete">Deletar</button>
                            </div>
                        </div>`
            // adiciona estrutura HTML criada em área apontada na criação da variável wrapper
            wrapper.innerHTML += item
        }
        // loop para percorrer lista criada
        for (var elemento in list) {
            // cria variável que aponta para classe definida na estrutura HTML acima e associa o elemento do loop a ela
            var editBtn = document.getElementsByClassName('edit')[elemento]
            // cria variável que aponta para classe definida na estrutura HTML acima e associa o elemento do loop a ela
            var deleteBtn = document.getElementsByClassName('delete')[elemento]
            // cria variável que aponta para classe definida na estrutura HTML acima e associa o elemento do loop a ela
            var title = document.getElementsByClassName('title')[elemento]
            /* 
               com o elemento associado a variável, é hora de escutar a interação do usuário com o botão de edição e na
               hipótese de click, disparar execução de função que receberá a estrutura HTML criada anteriormente e permitirá
               alteração do nome da tarefa
            */
            editBtn.addEventListener('click', (function (item) {
                // define retorno de função
                return function () {
                    // chamada de função e passagem de item criado dentro da estrutura HTML
                    editItem(item)
                }
                // traz à tona a lista com o elemento que está em evidência na iteração do loop
            })(list[elemento]))
            /* 
               com o elemento associado a variável, é hora de escutar a interação do usuário com o botão de deletar e na
               hipótese de click, disparar execução de função que receberá a estrutura HTML criada anteriormente
            */
            deleteBtn.addEventListener('click', (function (item) {
                // define retorno de função
                return function () {
                    // chamada de função e passagem de item criado dentro da estrutura HTML
                    deleteItem(item)
                }
                // traz à tona a lista com o elemento que está em evidência na iteração do loop
            })(list[elemento]))
            /* 
               com o elemento associado a variável, é hora de escutar a interação do usuário com o título da atividade e na
               hipótese de click, disparar execução de função que receberá a estrutura HTML criada anteriormente
            */
            title.addEventListener('click', (function (item) {
                // define retorno de função
                return function () {
                    // chamada de função e passagem de item criado dentro da estrutura HTML
                    strikeUnstrike(item)
                }
                // traz à tona a lista com o elemento que está em evidência na iteração do loop
            })(list[elemento]))
        }
    })
}

// execução da função
buildList ()


// faz um apontamento para a área do HTML que contém o id form-wrapper
var form = document.querySelector('#form-wrapper')
// escuta a interação do usuário com o formulário e dispara função para execução de tarefas ao identificar submissão desse formulário
form.addEventListener('submit', function (event) {
    // previne o comportamento padrão do JavaScript de reiniciar a aplicação
    event.preventDefault()
    console.log('foi submetido')
    // variável para armazenar o link de url que será usada na conexão com o back-end
    var url = 'http://127.0.0.1:8000/api/task-create/'
    // condicional que valida se o itemAtivo está ativo para efetuar a alteração
    if (itemAtivo != null) {
        // variável para armazenar o link de url que será usada na conexão com o back-end
        var url = `http://127.0.0.1:8000/api/task-update/${itemAtivo.id}/`
        // atribui valor null a variáve itemAtivo, para 
        itemAtivo = null
    }
    // obtenção de valor digitado por usuário no front-end
    var title = document.querySelector('#title').value
    // função fetch que permite a conexão com o back-end para método POST
    fetch(url,
        // objeto que contém os parâmetros da requisição
        {
            // método HTTP da requisição
            method: 'POST',
            // cabeçalho da requisição
            headers: {
                // definição do tipo de conteúdo
                'Content-type': 'application/json',
                // adição de camada de segurança sugerida pela documentação Djando e criada no início desse documento
                'X-CSRFToken': csrftoken
            },
            // corpo da requisição que deve ser transformado em string para envio ao back-end
            body: JSON.stringify({'title': title})
        })
        // promessa que administra a resposta obtida na etapa anterior
        .then(function (response) {
            // chamada de função para renderizar lista atualizada
            buildList ()
            // efetua limpeda de formulário após inserção em banco de dados
            document.querySelector('#form').reset()
        })
})


// função que altera o título da tarefa existente em banco de dados
function editItem (item) {
    console.log('Clique para edição: ', item)
    // estrutura que ativa itemAtivo
    itemAtivo = item
    // estrutura que mostra o título da tarefa no input
    document.querySelector('#title').value = itemAtivo.title
}


// funçã responsável por excluir um item do banco de dados
function deleteItem (item) {
    console.log('Clique para deletar: ', item)
    // função fetch que permite a conexão com a rota que efetua a exclusão em banco de dados
    fetch(`http://127.0.0.1:8000/api/task-delete/${item.id}/`, {
        // método HTTP da requisição
        method: 'DELETE',
        // cabeçalho da requisição
        headers: {
                // definição do tipo de conteúdo
                'Content-type': 'application/json',
                // adição de camada de segurança sugerida pela documentação Djando e criada no início desse documento
                'X-CSRFToken': csrftoken
            },
    })
    // promessa que administra a resposta obtida na execução da função, através de arrow function
    .then((resp) => {
        // chamada de função para renderizar lista atualizada
        buildList ()
    })
}


// função responsável por adicionar apontamento de referência quando o usuário clicar no título da tarefa
function strikeUnstrike (item) {
    console.log('Clique para strike: ', item)
    // estrutura que altera o estado da tarefa quando o usuário interage clicando no título dela
    item.complete = !item.complete
    // função fetch que permite a conexão com a rota que efetua a exclusão em banco de dados
    fetch(`http://127.0.0.1:8000/api/task-update/${item.id}/`, {
        // método HTTP da requisição
        method: 'POST',
        // cabeçalho da requisição
        headers: {
                // definição do tipo de conteúdo
                'Content-type': 'application/json',
                // adição de camada de segurança sugerida pela documentação Djando e criada no início desse documento
                'X-CSRFToken': csrftoken
            },
        // corpo da requisição que deve ser transformado em string para envio ao back-end
        body: JSON.stringify({'title': item.title, 'complete': item.complete})
    })
    // promessa que administra a resposta obtida na execução da função, através de arrow function
    .then((resp) => {
        // chamada de função para renderizar lista atualizada
        buildList ()
    })
}