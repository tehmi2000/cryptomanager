const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const colors = ["#1d0d17", "#514020", "#164840", "#cf2d50", "#3facc3", "#2b9f0e", "#5b1b4a", "#5b1d0a", "#049f34", "#b2221c", "#bb3105", "#060a43", "#272f3e", "#10499c"]
const currentPrice = {
    eth: 163999.00,
    trx: 12.99
};

const globals = {
    data: []
};


document.addEventListener("DOMContentLoaded", function() {
    // debugger;
    loadHandlers();
    loadItems();

    try{
        dateElement.textContent = new Date().toUTCString();
    }catch(err){
        console.error(err);
    }
});

const loadItems = function(){
    let apiUrl = `/api/transactions/getAll`;
    fetch(apiUrl).then(async response => {
        try {
            let itemsList = await response.json();
            console.log(itemsList);
            itemsList.forEach(item => {
                item.transactions.forEach(subTransaction => {
                    subTransaction.ecv = function (){
                        return this.pivotPrice * this.totalCrypto;
                    };

                    subTransaction.pecv = function () {
                        return this.currentPivotPrice * this.totalCrypto;
                    };

                    subTransaction.currentPivotPrice = currentPrice[`${item['transaction-type'].toLowerCase()}`];
                });
            });

            globals.data = itemsList;
            itemsList.forEach(item => {
                createTransaction(item);
            });

        } catch (tryerr) {
            console.error(tryerr);
        }
    }).catch(catchError => {
        console.error(catchError);
    });
};

const loadHandlers = function(){
    let editorForm = document.querySelector("#editor");
    let deletorForm = document.querySelector("#deletor");
    editorForm.addEventListener("submit", handleTransactionUpdate);
    deletorForm.addEventListener("submit", handleTransactionDelete);
    document.querySelectorAll(`form .toggle-minimize`).forEach(element => {
        element.addEventListener("click", handleFormMinimize);
    });

    headerAnimation(new Date().toUTCString());
};

const calculateCapital = function (transactionData){
    let totalCapitalInvested = transactionData.transactions.reduce((total, nextCapital) => {
        return total + parseFloat(nextCapital.capitalInvested);
    }, 0);
    return totalCapitalInvested;
}

const calculateProfit = function (capital, lastTransaction, id = null ) {
    let roi = (lastTransaction.ecv() - (0.02 * lastTransaction.ecv())) + lastTransaction.rpi;
    let proi = (lastTransaction.pecv() - (0.02 * lastTransaction.pecv())) + lastTransaction.rpi;
    let profit = roi - capital;
    let proposedProfit = proi - capital; 

    if(id !== null && id !== ''){
        let profitDisplayElement = document.querySelector(`#${id} .profit-foot h2`);
        profitDisplayElement.textContent = `Net profit: ${formatAsMoney(profit)} | Net Proposed Profit: ${formatAsMoney(proposedProfit)}`
    }

    return {
        profit,
        proposedProfit
    }
};


const createTransaction = function (data) {
    data['transaction-capital'] = calculateCapital(data);
    // Calculate profits and other value before creating element..
    let lastTransaction = data.transactions[data.transactions.length - 1]
    let capital = data["transaction-capital"];
    let id = data["transaction-id"];
    let { profit, proposedProfit } = calculateProfit(capital, lastTransaction);

    // Get element that would be used as a container for elements created...
    let container = document.querySelector("#item-pane");

    // Create and append elements with their respective values and classes...
    let div0 = createComponent("DIV", null, ["cols", "page-section"]);
    let div1 = createComponent("DIV", null, ["head", "rows"]);
    let div2 = createComponent("DIV", null, ["cols", "lg-20", "date"]);
    const div3 = createComponent("DIV", `${data.transactions[0]["transaction-month"]}`);
    const h0 = createComponent("H2", `${data.transactions[0]["transaction-date"]}`);
    let div4 = createComponent("DIV", null, ["lg-80"]);
    const div5 = createComponent("DIV", `TRANSACTION ID: ${id}`);
    const h1 = createComponent("H2", `${formatAsMoney(data["transaction-capital"])}`);
    const div6 = createComponent("DIV", `1 ${data["transaction-type"]} costs ${formatAsMoney(data.transactions[0].pivotPrice)}`);
    let subTransactionContainer = createComponent("DIV", null, ["cols", "content"]);
    
    // We get the subtransactions from the data and assin to a variable...
    let subTransactionData = data.transactions;

    // if the length is 0, therefore only one transaction has been made, then...
    if(subTransactionData.length === 0){
        // ...Create a dummy placeholder
        let div8 = createComponent("DIV", "No transaction record", ["rows", "item", "null"]);
        subTransactionContainer.appendChild(div8);
    }else{
        // Else, display the subtransactions in the DOM 
        subTransactionData.forEach((item, index) => {
            let subTransaction = null;
            if(item.isExpense && item.isExpense === true){
                subTransaction = createSubExpense(item, index + 1, id, data["transaction-type"]);
            }else{
                subTransaction = createSubTransactions(item, index + 1, id, data["transaction-type"]);
            }

            subTransactionContainer.appendChild(subTransaction);
        });
    }

    subTransactionContainer.scrollTop = subTransactionContainer.scrollHeight;

    let div92 = createComponent("DIV", null, ["rows", "profit-foot"]);
    const h3 = createComponent("h2", `Net profit: ${formatAsMoney(profit)} | Net Proposed Profit: ${formatAsMoney(proposedProfit)}`);

    div1.style.backgroundColor = colors[Math.round(Math.random() * colors.length)];
    div5.style.textTransform = "initial";

    div0.id = data["transaction-id"];
    div3.id = `transaction-month_${data["transaction-id"]}`;
    h0.id = `transaction-date_${data["transaction-id"]}`;
    div5.id = `transaction-id_${data["transaction-id"]}`;
    h1.id = `transaction-capital_${data["transaction-id"]}`;

    // Append elements to one another...
    div92 = joinComponent(div92, h3);
    div2 = joinComponent(div2, div3, h0);
    div4 = joinComponent(div4, div5, h1, div6);
    div1 = joinComponent(div1, div2, div4);
    div0 = joinComponent(div0, div1, subTransactionContainer, div92);

    container.appendChild(div0);
}

const createSubTransactions = function (item, serialNumber, id, type) {
    // let container = createComponent("DIV", null, ["cols", "content"]);

    let transactionDate = `${months[new Date().getMonth()]} ${item["transaction-date"]}, ${new Date().getFullYear()}`;
    
    let div8 = createComponent("DIV", null, ["item"]);
    const div9 = createComponent("DIV", transactionDate);
    const div90 = createComponent("DIV", `1 ${type} costs ${formatAsMoney(item.pivotPrice)}`);
    // <div id="capital-invested" class="capital-invested">Capital: NGN 165,000.00</div>
    let div91 = createComponent("DIV", `Capital: ${formatAsMoney(item.capitalInvested)}`, ["capital-invested"]);
    const div92 = createComponent("DIV");

    div92.innerHTML = `<strong>ECV: ${formatAsMoney(item.pecv())}</strong> <strong>//</strong> <strong>RPI: ${formatAsMoney(item.rpi)}</strong>`;
    div92.id = `current-summary_${id}_${serialNumber}`;
    div91.id = `capital-invested_${id}_${serialNumber}`;
    div90.id = `pivot-price_${id}_${serialNumber}`;
    div9.id = `date-string_${id}_${serialNumber}`;

    div8 = joinComponent(div8, div9, div90, div91, div92);

    return div8;
}

const createSubExpense = function (item, serialNumber, id, type) {
    // let container = createComponent("DIV", null, ["cols", "content"]);

    let transactionDate = `${months[new Date().getMonth()]} ${item["transaction-date"]}, ${new Date().getFullYear()}`;
    
    let div8 = createComponent("DIV", null, ["item", "expense"]);
    const div9 = createComponent("DIV", transactionDate);
    const div90 = createComponent("DIV", `1 ${type} costs ${formatAsMoney(item.pivotPrice)}`);
    let div91 = createComponent("DIV", `Capital: ${formatAsMoney(item.capitalInvested)}`, ["capital-invested"]);
    const div92 = createComponent("DIV");

    div92.innerHTML = `<strong>ECV: ${formatAsMoney(item.pecv())}</strong> <strong>//</strong> <strong>RPI: ${formatAsMoney(item.rpi)}</strong>`;
    div92.id = `current-summary_${id}_${serialNumber}`;
    div91.id = `capital-invested_${id}_${serialNumber}`;
    div90.id = `pivot-price_${id}_${serialNumber}`;
    div9.id = `date-string_${id}_${serialNumber}`;

    div8 = joinComponent(div8, div9, div90, div91, div92);

    return div8;
}

const addTransactionToDatabase = function (data) {
    let apiUrl = `/api/transactions/create/${data['transaction-id']}`;
    fetch(apiUrl, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
            "Content-Type": "application/json;charset=utf-8"
        }
    }).then(async response => {
        try {
            let result = await response.json();
            window.location.reload();

        } catch (tryerr) {
            console.error(tryerr);
        }
    }).catch(catchError => {
        console.error(catchError);
    });
}

const addSubtransactionToDatabase = function (data) {
    let apiUrl = `/api/transactions/createSub/${data['transaction-id']}`;
    fetch(apiUrl, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
            "Content-Type": "application/json;charset=utf-8"
        }
    }).then(async response => {
        try {
            let result = await response.json();
            console.log(result);
            window.location.reload();

        } catch (tryerr) {
            console.error(tryerr);
        }
    }).catch(catchError => {
        console.error(catchError);
    });
}

const updateTransaction = function (data) {

    let capital = parseFloat(data["transaction-capital"]);
    let id = data["transaction-id"];
    let [requiredTransaction] = data.transactions;
    let selectedTransaction = globals.data.find((item) => {
        return item['transaction-id'] === id;
    });
    let numberOfSubtransactions = selectedTransaction.transactions.length;
    // let { profit, proposedProfit } = calculateProfit(capital, requiredTransaction);

    // If you are trying to create a new subtransaction...
    if(data.serialNumber > numberOfSubtransactions){
        // let subTransaction = createSubTransactions(requiredTransaction, numberOfSubtransactions + 1, id, data["transaction-type"]);
        // let subTransactionContainer = document.querySelector(`#${id} .content`);

        // // Add the new subtransaction to the subtransaction container
        // subTransactionContainer.appendChild(subTransaction);
        // calculateProfit(capital, requiredTransaction, id);
        addSubtransactionToDatabase(data);

    }else{
        let dateString = `${months[new Date().getMonth()]} ${data["transaction-date"]}, ${new Date().getFullYear()}`;
        
        let strongElement = document.querySelector(`#current-summary_${id}_${data.serialNumber}`);
        let fullDateElement = document.querySelector(`#date-string_${id}_${data.serialNumber}`);
        let pivotPriceElement = document.querySelector(`#pivot-price_${id}_${data.serialNumber}`);
    }
}

const handleTransactionDelete = function (ev) {
    ev.preventDefault()
    const inputEl = document.querySelector("#transactionDeleteInput");
    const id = inputEl.value;
    const apiUrl = `/api/transactions/delete/${id}`;

    if(id === '' || id.length < 16){
        return false;
    }else{
        fetch(apiUrl, {
            method: 'DELETE'
        }).then(async response => {
            try {
                let result = await response.json();
                window.location.reload();
            } catch (tryerr) {
                console.error(tryerr);
            }
        }).catch(catchError => {
            console.error(catchError);
        });
    }
}

const handleTransactionUpdate = function(ev){
    // Prevents the page from refreshing after the 'Apply'(submit) button is clicked
    ev.preventDefault();

    // Checks if the provided value is to be used to update existing transactions or not...
    const checkForETag = function (data) {
        // debugger;
        // Makes sure the transaction ID inputted is not empty. If it is, give it a dummy string 'noid'
        let id = (data['transaction-id'] === '')? "noid" : data['transaction-id'];
        // Then we select a DOM element with the ID. Returns null if it doesnt exist
        const transactionExist = document.querySelector(`#${id}`);
        
        if(!transactionExist){
            // Add a unique transaction id to the data
            data['transaction-id'] = genHex();
            // Create a new transaction with the data
            addTransactionToDatabase(data);

        }else{
            updateTransaction(data);
        }
        return (transactionExist)? `Update Transaction ${data['transaction-id']} ` : `Create new transaction with id: ${genHex()}`;
    };
    
    // We get our input element from the DOM so we can use their values
    let transIDInput = document.querySelector("#transIDInput");
    let serialNumberInput = document.querySelector("#serialNumberInput");
    let pivotPriceInput = document.querySelector("#pivotPriceInput");
    let RPIInput = document.querySelector("#RPIInput");
    let capitalInput = document.querySelector("#capitalInput");
    let dateInput = document.querySelector("#dateInput");
    let cryptoTypeInput = document.querySelector("#cryptoTypeInput");
    let totalCryptoInput = document.querySelector("#totalCryptoInput");
    // let isExpense = document.querySelector("#isExpense");

    // We create a template datablock that we use to update or create the transaction
    let updateTransactionData = {
        "transaction-id": transIDInput.value.trim(),
        "transaction-capital": 0,
        "transaction-type": cryptoTypeInput.value,
        serialNumber: parseInt(serialNumberInput.value),
        transactions: [
            {
                "transaction-month": months[new Date().getMonth()].slice(0, 3),
                "transaction-date": parseInt(dateInput.value.split('-')[2]) || new Date().getDate(),
                capitalInvested: parseFloat(capitalInput.value.trim()),
                pivotPrice: parseFloat(pivotPriceInput.value),
                totalCrypto: parseFloat(totalCryptoInput.value),
                rpi: parseInt(RPIInput.value)
            }
        ]
    };

    // if(isExpense.checked === true){
    //     updateTransactionData.transactions[0].isExpense = true;
    // }

    // Then we crossreference the datablock values with the global transaction data for changes to be made
    checkForETag(updateTransactionData);
};

const handleFormMinimize = function (ev) {
    const ids = ev.currentTarget.id.split('_');
    const idOfParentForm = ids[1];
    const elementId = ids.join('_');

    console.log(ids);

    document.querySelector(`#${idOfParentForm} .form-content`).classList.toggle("hidden");
}