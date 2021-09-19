const router = require('express').Router();
const passport = require('passport');
const noUser = {user: null}
const Account = require('../models/models');

router.get('/', (req,res)=>{
    res.render('index', noUser);
});

//Login system

router.get('/create-wallet', (req,res)=>{
    if (!req.isAuthenticated()){
        res.render('createwallet', noUser);
    }else {
        res.redirect('/dashboard');
    }
});

router.post('/create-wallet', passport.authenticate('register', {
    successRedirect: '/key',
    failureRedirect: '/create-wallet',
    passReqToCallback: true
}));

router.get('/login', (req,res)=>{
    if (!req.isAuthenticated()){
        res.render('login', noUser);
    }else{
        res.redirect('/dashboard');
    }
});

router.post('/login', passport.authenticate('login', {
    successRedirect: '/dashboard',
    failureRedirect: '/login',
    passReqToCallback: true
}));

router.get('/logout', async (req, res)=>{
    let currentDate = new Date;
    req.user.lastLoginDate = `${currentDate.getDay()}/${currentDate.getMonth()}/${currentDate.getFullYear()} | ${currentDate.getHours()}:${currentDate.getMinutes()}:${currentDate.getMilliseconds()}`
    await req.user.save();
    req.logout();
    res.redirect('/');
});

//Account routes

router.get('/dashboard', (req, res)=>{
    if (req.isAuthenticated()){
        res.render('dashboard', {user: req.user});
    }else {
        res.redirect('/login');
    }
});

router.get('/transfer', (req, res)=>{
    if (req.isAuthenticated()){
        res.render('transfer', {user: req.user});
    }else {
        res.redirect('/login');
    }
});

router.get('/key', async (req, res)=>{
    if (req.isAuthenticated() && req.user.knownKey == false){
        res.render('key', {key: req.user.bankKey, user: req.user});
        req.user.knownKey = true;
        await req.user.save();
    }else{
        res.redirect('/login');
    }
});

function includesThisContact(bankKey, req){
    for(i = 0; i < req.user.contacts.length; i++){
        if (req.user.contacts[i].bankKey == bankKey){
            return true;
        }
    }
    return false;
}

router.post('/search', async (req,res)=>{
    let result = await Account.findOne({bankKey: req.body.bankKey});

    if(result){
        let contactObject = {
            bankKey: result.bankKey,
            fullname: result.fullname
        }
        if (includesThisContact(contactObject.bankKey, req)){
            res.send('0');
        }else{
            req.user.contacts.push(contactObject);
            await req.user.save();
            res.send('1');
        }
    }else{
        res.send('2');
    }

    // 0 stands for: the contact it's already on user's contacts array
    // 1 stands for: user saved correctly
    // 2 stands for: user with that key not found
});

router.post('/confirm', async (req, res)=>{
    let result = await Account.findOne({fullname: req.body.fullname});
    if(result){
        res.json({bankKey: result.bankKey});
    }else{
        res.send('2');
    }
});

router.post('/transfer', async (req, res)=>{
    let operationData = {
        target: await Account.findOne({bankKey: req.body.target}),
        amount: parseFloat(req.body.amount)
    }

    if (req.user.balance >= operationData.amount){
        let currentDate = new Date;
        req.user.balance = req.user.balance - operationData.amount;
        operationData.target.balance = operationData.target.balance + operationData.amount;

        req.user.transactions.push({
            target: operationData.target.fullname,
            amount: `-${operationData.amount}$`,
            date: `${currentDate.getDay()}/${currentDate.getMonth()}/${currentDate.getFullYear()} | ${currentDate.getHours()}:${currentDate.getMinutes()}:${currentDate.getMilliseconds()}`
        })

        operationData.target.transactions.push({
            target: req.user.fullname,
            amount: `+${operationData.amount}$`,
            date: `${currentDate.getDay()}/${currentDate.getMonth()}/${currentDate.getFullYear()} | ${currentDate.getHours()}:${currentDate.getMinutes()}:${currentDate.getMilliseconds()}`
        });

        await req.user.save()
        await operationData.target.save();
        res.send('1');
    }else{
        res.send('0');
    }

    // 1 stands for: Operation done correctly
    // 2 stands for: Not enough money
});

module.exports = router;