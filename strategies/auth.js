const passport = require('passport'),
LocalStrategy = require('passport-local').Strategy,
randomKey = require('random-key');

const Account = require('../models/models');

async function notClonedKey(){
    let temporalkey = randomKey.generate(20);
    let userFound = await Account.findOne({bankKey: temporalkey});
    if (!userFound){
        return temporalkey;
    }else{
        notClonedKey();
    }
}

passport.serializeUser((user, done)=>{
    done(null, user.id);
});

passport.deserializeUser(async (id, done)=>{
    const user = await Account.findById(id);
    done(null, user);
});

passport.use('register', new LocalStrategy({
    usernameField: 'name',
    passReqToCallback: true
}, async (req, user, password, done)=>{

    const check = await Account.findOne({fullname: user});

    if(check){

        return done(null, false);

    }else{

        const newAccount = new Account();
    
        newAccount.fullname = user;
        newAccount.password = newAccount.encryptPassword(password);
        newAccount.age = req.body.age;
        newAccount.balance = 0;
        newAccount.agreeterms = true;
        newAccount.bankKey = await notClonedKey();
        newAccount.knownKey = false;
        newAccount.lastLoginDate = '00/00/00 | 00:00';
    
        await newAccount.save();
        done(null, newAccount);

    }
}));

passport.use('login', new LocalStrategy({
    usernameField: 'key',
    passReqToCallback: true
}, async (req, key, password, done)=>{

    const user = await Account.findOne({bankKey: key});

    if(!user){
        return done(null,false);
    }

    if(!user.comparePassword(password)){
        return done(null, false);
    }

    done(null, user);

}))