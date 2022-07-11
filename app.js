const express = require('express');

const app = express();
app.use(express.json())
app.get('', (re, res) => {
    res.json('Welcome to TPSS')
})
app.post('/split-payments/compute', (req, res) => {
    const { ID, Crrency, CustomerEmail, SplitInfo,Amount } = req.body;
    let currentAmount = Number(Amount);
    let flatSplits = [];
    let percentSplit = [];
    let ratioSplit = [];

    let flatDetails = [];
    let percentDetails = [];
    let ratioDetails = []
    //1. Separate the splitInfo accordingg to their splittypes
    SplitInfo.forEach(split => {
        if (split.SplitType === 'FLAT') {
            flatSplits.push(split)
        }
        else if (split.SplitType === 'PERCENTAGE') {
            percentSplit.push(split)
        }
        else ratioSplit.push(split)
    });

    //2. Compute each group of splitInfo
    // FLAT
    flatSplits.forEach(split => {
        currentAmount = currentAmount-Number(split.SplitValue)
        const flatDetail = {
            "SplitType": split.SplitType,
            "SplitValue": split.SplitValue,
            "SplitEntityId": split.SplitEntityId,
        }
        flatDetails.push(flatDetail)
    })
    // PERCENTAGE
    percentSplit.forEach(split => {
        splitValue = (Number(split.SplitValue)/100)*currentAmount
        currentAmount = currentAmount - splitValue
        const percentDetail = {
            "SplitType": split.SplitType,
            "SplitValue": splitValue,
            "SplitEntityId": split.SplitEntityId,
        }
        percentDetails.push(percentDetail)
    })
    
    
    //RATIO
    //first compute the total of all the ratio
    let ratioTotal=0
    for(let i=0;i<ratioSplit.length;i++){
        ratioTotal += Number(ratioSplit[i].SplitValue)
    }
console.log(currentAmount);
const ratioAmount = currentAmount
    ratioSplit.forEach(split => {
        splitValue = (Number(split.SplitValue)/ratioTotal)*ratioAmount
        currentAmount = currentAmount - splitValue
        const ratioDetail = {
            "SplitType": split.SplitType,
            "SplitValue": splitValue,
            "SplitEntityId": split.SplitEntityId,
        }
        ratioDetails.push(ratioDetail)
    })



console.log(ratioTotal);
console.log(ratioDetails);
    res.status(200).json({currentAmount, percentDetails, flatDetails})

 })


app.listen(9000, () => {
    console.log('listening on http://localhost:9000');
})