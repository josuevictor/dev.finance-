const Modal ={
    open(){
       document.querySelector('.modal-overlay')
       .classList
       .add('active')
    },

    close(){
        document.querySelector('.modal-overlay')
       .classList
       .remove('active')
    }
}

const Transaction = {
    all: [
        {
            description: 'Luz',
            amount: -15000,
            date: '17/01/2022'
        },
        {
            description: 'Website',
            amount: 200000,
            date: '17/01/2022'
        },
        {
            description: 'Internet',
            amount: -20000,
            date: '17/01/2022'
        },
        {
            description: 'App',
            amount: 200000,
            date: '17/01/2022'
        },
    ],

    add(transaction){
        Transaction.all.push(transaction)

        App.reload()
    },

    remove(index){
        Transaction.all.splice(index, 1)
        App.reload()
    },

    incomes(){
        let income = 0 
        Transaction.all.forEach(transaction => {
            if (transaction.amount > 0){
                income += transaction.amount
            }
        })
        return income
    },

    expenses(){
        let expense = 0
        Transaction.all.forEach(transaction =>{
            if(transaction.amount < 0){
                expense += transaction.amount
            }
        })
        return expense
    },

    total(){
        return Transaction.incomes() + Transaction.expenses()
    }
}

const DOM = {
    transactionContainer: document.querySelector('#data-table tbody'),

    addTransaction(transaction, index){
        const tr = document.createElement('tr')    
        tr.innerHTML = DOM.innerHTMLTransaction(transaction)

        DOM.transactionContainer.appendChild(tr)

    },
    innerHTMLTransaction(transaction){
        const CSSclass = transaction.amount > 0 ? "income" : "expense"

        const amount = Utils.formatCurrency(transaction.amount)

        const html = `
            <td class="description">${transaction.description}</td>
            <td class="${CSSclass}">${amount}</td>
            <td class="date">${transaction.date}</td>
            <td>
                <img src="./assets/minus.svg" alt="Remover Transação">
            </td>
        `
        return html
    },
    
    updateBalance(){
        document
            .querySelector('#incomeDisplay')
            .innerHTML = Utils.formatCurrency(Transaction.incomes())
        document
            .querySelector('#expenseDisplay')
            .innerHTML = Utils.formatCurrency(Transaction.expenses())
        document
            .querySelector('#totalDisplay')
            .innerHTML = Utils.formatCurrency(Transaction.total())
    },

    clearTransactions(){
        DOM.transactionContainer.innerHTML = ""
    }
    
}


const Utils = {
    formatAmount(value){
        value = Number(value) * 100
        
        return value
    },


    formatDate(date){
        const splittedDate =  date.split("-")
        return `${splittedDate[2]}/${splittedDate[1]}/${splittedDate[0]}`
    },


    formatCurrency(value){
        const signal = Number(value) < 0 ? "-" : ""

        value = String(value).replace(/\D/g, "")

        value = Number(value) / 100

        value = value.toLocaleString("pr-BR",{
            style: "currency",
            currency: "BRL"
        })

        return signal + value
    }
}

const Form = {
    description: document.querySelector('input#description'),
    amount: document.querySelector('input#amount'),
    date: document.querySelector('input#date'),

    getValues(){
        return{
            description: Form.description.value,
            amount: Form.amount.value,
            date: Form.date.value
        }
    },
    
    validateFields(){
        const {description, amount, date} = Form.getValues()
        
        if( description.trim() === "" ||
            amount.trim() === "" ||
            date.trim() === "" ) {
            //.trim() Limpeza dos espaços vazios
            throw new Error('pro favor, preencha todos os campos.')            
        }
    },

    formateValues(){
        let {description, amount, date} = Form.getValues()

        amount = Utils.formatAmount(amount)

        date = Utils.formatDate(date)

        console.log(date)

    },

    submit(event){
        event.preventDefault()

        try {
            //verificar se todas as informações foram preenchidas
            //Form.validateFields()   
            //formatar os dados para salvar
            Form.formateValues()
            //salvar
            //apagar os dados do formulário
            //modal fecha
            //atualizar a aplicação   
        } catch (error) {
            alert(error.message)
        }

    }
}

const App = {
    init(){

        Transaction.all.forEach(transaction => {
            DOM.addTransaction(transaction)
        })
        
        DOM.updateBalance()
        
    },
    reload(){
        DOM.clearTransactions()
        App.init()
    },
    
}

App.init()