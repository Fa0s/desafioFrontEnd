const usuarios = [];
const buscaCep = document.getElementById('cep');
const botaoCadastrar = document.getElementById('botao_cadastro');
botaoCadastrar.addEventListener("click", cadastraUsuario);
var origem;
var origemFisico = document.getElementById("fisico");
var origemDigital = document.getElementById("digital");

function cadastraUsuario(){
    const nome = document.getElementById('nome').value;
    const email = document.getElementById('email').value;
    const cep = document.getElementById('cep').value;
    const rua = document.getElementById('rua').value;
    const numero = document.getElementById('numero').value;
    const bairro = document.getElementById('bairro').value;
    const cidade = document.getElementById('cidade').value;
    const estado = document.getElementById('estado').value;
    
    const usuario = {
        nome: nome, 
        email: email,
        cep: cep,
        rua: rua,
        numero: numero,
        bairro: bairro,
        cidade: cidade,
        estado: estado,
        origem: origem,
    }
    
    if(!nome || !email || !rua || !numero || !bairro || !cidade || !estado){
        alert('preencha todos os campos')
        return;
    }
    if(origemFisico.checked){
        usuario.origem = 'fisico';
    }else if(origemDigital.checked){
        usuario.origem = 'digital'
    }else{
        alert("Selecione a origem")
        return
    }

    usuarios.push(usuario);
    alert("Usuário cadastrado com sucesso")
    limpaCampos();
}

buscaCep.addEventListener('focusout', async () => {
    try{ 
        const regex = /^[0-9]{8}$/;
        if(!regex.test(cep.value)){
            throw { erro_cep:"O cep digitado é inválido"};
        }
        const resposta = await fetch(`https://viacep.com.br/ws/${cep.value}/json/`)
        if(!resposta.ok){
            throw await resposta.json();
        }
        
        const respostaCep = await resposta.json();
        
        rua.value = respostaCep.logradouro;
        bairro.value = respostaCep.bairro; 
        cidade.value = respostaCep.localidade;
        estado.value = respostaCep.uf;
        
        if(estado.value == "undefined"){
                alert("Cep não localizado! Por favor, revise o cep digitado")
                limpaCep();
            }
        } catch (erro) {
            if(erro?.erro_cep){
                alert(" Atenção\n\n O cep deve ser composto por 8 numeros")
            }
        }

    });
    
    function limpaCep(){
        document.getElementById('cep').value =("")
        document.getElementById('rua').value =("")
        document.getElementById('bairro').value =("")
        document.getElementById('cidade').value =("")
        document.getElementById('estado').value =("")
    }
    
    function limpaCampos(){
        document.getElementById('nome').value = ("")
        document.getElementById('email').value = ("")
        document.getElementById('numero').value = ("")
        origemFisico.checked=false;
        origemDigital.checked=false;
        limpaCep();
    }

    const botaoRelatorio = document.getElementById('botao_relatorio');
    botaoRelatorio.addEventListener("click", geraRelatorio);

    document.getElementById("relatorios").addEventListener("change", function (){
        const tipo = this.value;
        document.getElementById("relatorio_origem").style.display = tipo === "origem" ? "block" : "none";
        document.getElementById("relatorio_estado").style.display = tipo === "estado" ? "block" : "none";
    });

    function geraRelatorio(){
        const tipoRelatorio = document.getElementById("relatorios").value;
        let usuariosFiltrados =[];
        if(tipoRelatorio === "estado"){
            const estado = document.getElementById("seletor_estado").value;
            usuariosFiltrados = usuarios.filter(usuario => usuario.estado.toUpperCase() === estado);
        }else if (tipoRelatorio ==="origem"){
            const origem = document.getElementById("seletor_origem").value;
            usuariosFiltrados = usuarios.filter(usuario => usuario.origem.toLowerCase() === origem);
        }else{
            usuariosFiltrados = usuarios;
        }

        geraTabela(usuariosFiltrados)
        
    }

    function geraTabela(usuariosFiltrados){
        const tabela = `<table border="1">
        <tr>
        <th>Nome</th>
        <th>E-mail</th>
        <th>Cep</th>
        <th>Rua</th>
        <th>Numero</th>
        <th>Bairro</th>
        <th>Cidade</th>
        <th>Estado</th>
        <th>Origem</th>
        
        </tr>` +
        usuariosFiltrados.map(usuario => `
            <tr>
            <td>${usuario.nome}</td>
            <td>${usuario.email}</td>
            <td>${usuario.cep}</td>
            <td>${usuario.rua}</td>
            <td>${usuario.numero}</td>
            <td>${usuario.bairro}</td>
            <td>${usuario.cidade}</td>
            <td>${usuario.estado}</td>
            <td>${usuario.origem}</td>
            </tr>`).join('') +
            `</table>`
            document.getElementById('tabela').innerHTML= tabela;
            relatorio = document.getElementById('relatorios');
        }
     
