class Despesa {
    constructor(ano, mes, dia, tipo, descricao, valor ){
        this.ano = ano
        this.mes = mes 
        this.dia = dia
        this.tipo = tipo
        this.descricao = descricao
        this.valor = valor 
    }

    validarDado(){
        for(let i in this ){
            if(this[i] == undefined || this[i] == '' || this[i] == null){
                return false
            }
        }

        return true

    }

}

class Bd {

    constructor (){
        let id = localStorage.getItem('id')

        if(id === null){
            localStorage.setItem('id', 0)
        }

    }
        getProximoId(){
            let proximoId = localStorage.getItem('id')//null
             return parseInt(proximoId) + 1
        }
        gravar(d){

        let id = this.getProximoId()

        localStorage.setItem(id, JSON.stringify(d))

        localStorage.setItem('id', id)
    }

    recuperarTodosRegistros() {

        //array de depesas
        let despesas = Array()

        let id = localStorage.getItem('id')

        //recupera todas as dispesas cadastradas em localstorage
        for (let i = 1; i <= id; i++){

            //recupera  a despesa
            let despesa = JSON.parse(localStorage.getItem(i))

            //existe a possibilidade  de haver indice que foram pulado
            //neste cassos vamos pular esses indices

            if(despesa === null){
                continue
            }
            despesa.id = i
            despesas.push(despesa)
        }

        return despesas
    }

    pesquisa(despesa){

        let despesasFiltradas = Array()
        
        despesasFiltradas = this.recuperarTodosRegistros()

        console.log(despesa)
        console.log(despesasFiltradas)
        //ano 
        if(despesa.ano != '' ){
            console.log('filtro ano')
            despesasFiltradas = despesasFiltradas.filter(d => d.ano == despesa.ano)
        }
        //mes
        if(despesa.mes != '' ){
            console.log('filtro mes')
            despesasFiltradas = despesasFiltradas.filter(d => d.mes == despesa.mes)
        }        
        //dia
        if(despesa.dia != '' ){
            console.log('filtro dia')
            despesasFiltradas = despesasFiltradas.filter(d => d.dia == despesa.dia)
        }
        //tipo
        if(despesa.tipo != '' ){
            console.log('filtro tipo')
            despesasFiltradas = despesasFiltradas.filter(d => d.tipo == despesa.tipo)
        }        
        //descriçao
        if(despesa.descricao != '' ){
            console.log('filtro descricao')
            despesasFiltradas = despesasFiltradas.filter(d => d.descricao == despesa.descricao)
        }
        //valor
        if(despesa.valor != '' ){
            console.log('filtro valor')
            despesasFiltradas = despesasFiltradas.filter(d => d.valor == despesa.valor)
        }
        return despesasFiltradas 
    }

    remover(id){
        localStorage.removeItem(id)
    }

}

let bd = new Bd()
 

function cadastrarDespesa(){
    /*let dt = new Date()
    let ano = dt.getFullYear()
    let mes = dt.getMonth()
    let dia = dt.getDay()*/
    let ano = document.getElementById('ano')
    let mes = document.getElementById('mes')
    let dia = document.getElementById('dia')
    let tipo = document.getElementById('tipo')
    let descricao = document.getElementById('descricao')
    let valor = document.getElementById('valor')

    console.log(ano, mes, dia, tipo, descricao,valor)

    let despesa = new Despesa(
        ano.value,
        mes.value,
        dia.value,
        tipo.value,
        descricao.value,
        valor.value

    )
        if (despesa.validarDado()){
            bd.gravar(despesa)
            //bd.gravar(despesa)
            document.getElementById('Modaltitulo').innerHTML = 'Registro inserido com sucesso'
            document.getElementById('modal_titulo_div').className = 'modal-header text-success'
            document.getElementById('modal_conteudo').innerHTML = 'Despesa cadastrada'
            document.getElementById('modal_botao').innerHTML = 'Voltar'  
            document.getElementById('modal_botao').className = 'btn btn-success' 
            $('#modalRegistroDespesas').modal('show')

            ano.value = ''
            mes.value = ''
            dia.value = ''
            tipo.value = ''
            descricao.value = ''
            valor.value = ''
        }else{
            //dialog de erro
            document.getElementById('Modaltitulo').innerHTML = 'Erro ao inserir o registro'
            document.getElementById('modal_titulo_div').className = 'modal-header text-danger'
            document.getElementById('modal_conteudo').innerHTML = 'Erro gravação'
            document.getElementById('modal_botao').innerHTML = 'Voltar e corrigir'   
            document.getElementById('modal_botao').className = 'btn btn-danger'
            $('#modalRegistroDespesas').modal('show')

        }

}


function carregaListaDispesas(despesas = Array(), filtro = false){

    if(despesas.length == 0 && filtro == false){
        despesas = bd.recuperarTodosRegistros()
    }
    //selecionando elemento tbody da tabela
    let listaDespesas = document.getElementById('listasDespesas')
    listaDespesas.innerHTML = ''

    /*<tr>
    <td>15/03/2018</td>
    <td>Alimentação</td>
    <td>Compra dos mes</td>
    <td>440.50</td>
  </tr>*/

  //percorrer o array despesas, listando cada despesa de forma dinamica
  despesas.forEach(function(d){

        //console.log(d)

        //criando a linha (tr)
        let linha = listaDespesas.insertRow()

        //Criar as colunas (td)
        linha.insertCell(0).innerHTML = `${d.dia}/${d.mes}/${d.ano}`
        
        //ajustas o tipo 
        switch(d.tipo){
            case '1': d.tipo = 'Alimentação'
                break 
            case '2': d.tipo = 'Educação'
                break     
            case '3': d.tipo = 'Lazer'
                break
            case '4': d.tipo = 'Saúde'
                break
            case '5': d.tipo = 'Transporte'
                break            
        }   

        linha.insertCell(1).innerHTML = d.tipo
        linha.insertCell(2).innerHTML = d.descricao
        linha.insertCell(3).innerHTML = d.valor

        //botão exclusão 
        let btn = document.createElement("button")
        btn.className = 'btn btn-danger'
        btn.innerHTML = '<i class ="fas fa-times"></i>'
        btn.id = `id_despesa_${d.id}`
        btn.onclick = function(){
            //remover despesa
            
            let id = this.id.replace('id_despesa_', '')

            bd.remover(id)

            window.location.reload()
        }
        linha.insertCell(4).append(btn)

        console.log(d)
  })

}   


function pesquisarDespesas(){
    let ano = document.getElementById('ano').value
    let mes = document.getElementById('mes').value
    let dia = document.getElementById('dia').value
    let tipo = document.getElementById('tipo').value
    let descricao = document.getElementById('descricao').value
    let valor = document.getElementById('valor').value

    let despesa = new Despesa(ano, mes, dia, tipo, descricao, valor)

    let despesas = bd.pesquisa(despesa)

    this.carregaListaDispesas(despesas, true)
}


$(document).ready(function(){
    $('#valor').mask('#.###,##0,00')
});