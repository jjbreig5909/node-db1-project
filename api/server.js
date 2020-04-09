const express = require("express");

const db = require("../data/dbConfig.js");

const server = express();

server.use(express.json());

server.get('/', (req,res) =>{
    db('accounts')
    .then(accounts=>{
        res.json(accounts);
    })
    .catch(err=>{
        res.status(500).json({message:"error retreiving posts", err});
    });
});

server.get('/:id', (req,res) =>{
    const { id } = req.params;
    db.select('*').from('accounts').where({id})
        .first()
        .then(account=>{
            if (account) {
                res.status(200).json(account);
            } else{
                res.status(400).json({message:"Account not found"})
            }
        })
        .catch(error =>{
            res.status(500).json({message: "There was an error!", error})
        });
});

server.post('/', (req,res)=>{
    const accountData = req.body;

    db.insert(accountData).into('accounts')
        .then(account =>{
            res.status(201).json(account);
        })
        .catch(err=>{
            res.status(500).json({message: "DB Issue", error: err})
        });
});

server.put('/:id', (req, res)=>{
    const{id}=req.params;
    const changes=req.body;

    db('accounts').where({id}).update(changes)
    .then(count=>{
        if(count){
            res.status(200).json({updated: count});
        } else{
            res.status(404).json({message: "DB Issue"});
        }
    })
    .catch(err=>{
        res.status(500).json({message: "DB Issue"})
    });
});




module.exports = server;
