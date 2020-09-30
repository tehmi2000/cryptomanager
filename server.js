"use strict";

// VARIABLE ASSIGNMENTS
const fs = require("fs");
const express = require("express");
const app = express();
const server = require("http").createServer(app);
const PORT = (process.env.PORT === "" || process.env.PORT === null || process.env.PORT === undefined)? 1234 : process.env.PORT;

const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const fileUpload = require("express-fileupload");
const compression = require("compression");

const {connection, genHex, log} = require("./config");

app.use("/", express.static(__dirname + "/public"));
app.use(compression({level: 9}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());
app.use(fileUpload());


// APPLICATION SETUP
server.listen(PORT, "0.0.0.0", function() {
    console.log(`Server currently running on port ${PORT}`);
});

// APPLICATION ROUTING
app.get("/", function(req, res) {
    res.sendFile(__dirname + "/public/index.html");
});

app.get("/api/transactions/getAll", (req, res) => {
    
    connection.then(client => {
        const collection = client.db('cryptoDB').collection('cryptoTransactionCollection');
        // .sort({postTime: -1});
        const mongoQuery = {};
        collection.find(mongoQuery).toArray(function(err, docs) {
            if(err) {
                log(err);
            }else{
                let content = `${JSON.stringify(docs)}`;
                fs.writeFile("./data.log", content, function(err) {
                    if(err){
                        console.log(err);
                    }
                });
                res.json(docs);
            }
        });
    });
});

app.get("/api/transactions/insertInitial", (req, res) => {
    let allTransaction = [
    {
        "transaction-id": "UZou9gjWlNE4PsNCUy",
        "transaction-capital": 0,
        "transaction-type": "TRX",
        transactions: [
            {
                "transaction-month": "Sep",
                "transaction-date": 18,
                capitalInvested: 5000,
                pivotPrice: 13.93,
                totalCrypto: 464.9924,
                rpi: 0
            },
            {
                "transaction-month": "Sep",
                "transaction-date": 20,
                capitalInvested: 1257.51,
                pivotPrice: 12.57,
                totalCrypto: 564.9924,
                rpi: 0
            },
            {
                "transaction-month": "Sep",
                "transaction-date": 21,
                capitalInvested: 1000,
                pivotPrice: 12.1,
                totalCrypto: 645.9812,
                rpi: 0
            },
            {
                "transaction-month": "Sep",
                "transaction-date": 22,
                capitalInvested: 1000,
                pivotPrice: 11.97,
                totalCrypto: 727.8598,
                rpi: 0
            },
            {
                "transaction-month": "Sep",
                "transaction-date": 24,
                capitalInvested: 3000,
                pivotPrice: 11.96,
                totalCrypto: 973,
                rpi: 0
            },
            {
                "transaction-month": "Sep",
                "transaction-date": 26,
                capitalInvested: 0,
                pivotPrice: 13.28,
                totalCrypto: 821.691,
                rpi: 1953
            }
        ]
    },
    {
        "transaction-id": "UzYMm31hoJNL122Lx4",
        "transaction-capital": 0,
        "transaction-type": "ETH",
        transactions: [
            {
                "transaction-month": "Sep",
                "transaction-date": 18,
                capitalInvested: 3000,
                pivotPrice: 178118.48,
                totalCrypto: 0.0165,
                rpi: 0
            },
            {
                "transaction-month": "Sep",
                "transaction-date": 19,
                capitalInvested: 1000,
                pivotPrice: 178621.29,
                totalCrypto: 0.022,
                rpi: 0
            },
            {
                "transaction-month": "Sep",
                "transaction-date": 20,
                capitalInvested: 2000,
                pivotPrice: 175463.43,
                totalCrypto: 0.0331,
                rpi: 0
            },
            {
                "transaction-month": "Sep",
                "transaction-date": 20,
                capitalInvested: 1500,
                pivotPrice: 172612.19793,
                totalCrypto: 0.04167,
                rpi: 0
            },
            {
                "transaction-month": "Sep",
                "transaction-date": 20,
                capitalInvested: 1000,
                pivotPrice: 172711.5717,
                totalCrypto: 0.04735,
                rpi: 0
            },
            {
                "transaction-month": "Sep",
                "transaction-date": 21,
                capitalInvested: 1500,
                pivotPrice: 168350.1683,
                totalCrypto: 0.0561,
                rpi: 0
            },
            {
                "transaction-month": "Sep",
                "transaction-date": 24,
                capitalInvested: 2000,
                pivotPrice: 155400.1554,
                totalCrypto: 0.0687,
                rpi: 0
            }
        ]
    }
];
    connection.then(client => {
        const collection = client.db('cryptoDB').collection('cryptoTransactionCollection');

        collection.insertMany(allTransaction, (err, result) => {
            if(err) {
                log(err);
            }else{
                res.json(result);
            }
        });
    });
})

app.post("/api/transactions/create/:id", (req, res) => {
    let requestLog = {
        ip: req.ip,
        url: req.url,
        data: {
            action: `Created Transaction: ${req.params.id}`,
            body: req.body
        },
        application: req.headers['user-agent']
    }

    const newTransaction = req.body;
    connection.then(client => {
        const collection = client.db('cryptoDB').collection('cryptoTransactionCollection');

        collection.insertOne(newTransaction, (err, result) => {
            if(err) {
                log(err);
            }else{
                res.json(result);
            }
        });
    });
});

app.post("/api/transactions/createSub/:id", (req, res) => {
    let requestLog = {
        ip: req.ip,
        url: req.url,
        data: {
            action: `Created a Subtransaction: ${req.params.id}`,
            body: req.body
        },
        application: req.headers['user-agent']
    }

    const newSubTransaction = req.body;
    connection.then(client => {
        const collection = client.db('cryptoDB').collection('cryptoTransactionCollection');

        collection.updateOne({"transaction-id": newSubTransaction["transaction-id"]}, {$push: {transactions: newSubTransaction.transactions[0]}}, (err, result) => {
            if(err) {
                log(err);
            }else{
                res.json(result);
            }
        });
    });
});

app.delete("/api/transactions/delete/:id", (req, res) => {
    let requestLog = {
        ip: req.ip,
        url: req.url,
        data: {
            action: `Deleted Transaction: ${req.params.id}`,
            body: req.body
        },
        application: req.headers['user-agent']
    }

    connection.then(client => {
        const collection = client.db('cryptoDB').collection('cryptoTransactionCollection');

        collection.deleteOne({'transaction-id': `${req.params.id}`}, (err, result) => {
            if(err) {
                log(err);
            }else{
                res.json(result);
            }
        });
    });
});

app.delete("/api/transactions/deleteSub/:id", (req, res) => {
    let requestLog = {
        ip: req.ip,
        url: req.url,
        data: {
            body: null,
            conditions: []
        },
        application: req.headers['user-agent']
    }

    connection.then(client => {
        const collection = client.db(itemsDB).collection(iCollection);

        const mongoQuery = (publishedFlag)? {$and: [{"published": true}, {"sellerID" : sellerID}]} : {"sellerID" : sellerID};
        collection.find(mongoQuery).sort({postTime: -1}).toArray(function(err, docs) {
            if(err) {
                log(err);
            }else{
                res.json(docs);
            }
        });
    }).catch(error => {
        log(error);
    });
});