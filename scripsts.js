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

const Storage = {
    get(){//pegar
        return JSON.parse(localStorage.getItem("dev.finances:transactions")) ||
        []
    },
    set(transactions){//guardar/configuarar 
        localStorage.setItem("dev.finances:transactions", JSON.
        stringify(transactions))

    }
}

const Transaction = {
    all: Storage.get(),

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
        tr.innerHTML = DOM.innerHTMLTransaction(transaction, index)
        tr.dataset.index = index

        DOM.transactionContainer.appendChild(tr)

    },
    innerHTMLTransaction(transaction, index){
        const CSSclass = transaction.amount > 0 ? "income" : "expense"

        const amount = Utils.formatCurrency(transaction.amount)

        const html = `
            <td class="description">${transaction.description}</td>
            <td class="${CSSclass}">${amount}</td>
            <td class="date">${transaction.date}</td>
            <td>
                <img onclick="Transaction.remove(${index})" src="./assets/minus.svg" alt="Remover Transa????o">
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
            //.trim() Limpeza dos espa??os vazios
            throw new Error('pro favor, preencha todos os campos.')            
        }
    },

    formateValues(){
        let {description, amount, date} = Form.getValues()

        amount = Utils.formatAmount(amount)

        date = Utils.formatDate(date)

        return { 
            description,
            amount,
            date
        }

    },

    clearFields(){
        Form.description.value = ""
        Form.amount.value = ""
        Form.date.value = ""
    },

    submit(event){
        event.preventDefault()

        try {
            //verificar se todas as informa????es foram preenchidas
            Form.validateFields()   
            //formatar os dados para salvar
            const transaction =  Form.formateValues()
            //salvar
            Transaction.add(transaction)
            //apagar os dados do formul??rio
            Form.clearFields()
            //modal fecha
            Modal.close()
        } catch (error) {
            alert(error.message)
        }

    }
}


const App = {
    init(){

        Transaction.all.forEach(DOM.addTransaction)
        
        DOM.updateBalance()

        Storage.set(Transaction.all)
        
    },
    reload(){
        DOM.clearTransactions()
        App.init()
    },
    
}

App.init()