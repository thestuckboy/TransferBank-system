const mongoose = require('mongoose'),
Schema = mongoose.Schema,
bcrypt = require('bcrypt');

const accountSchema = new Schema({
    fullname: String,
    password: String,
    bankKey: String,
    balance: Number,
    age: Number,
    agreeterms: Boolean,
    contacts: [],
    transactions: [],
    lastLoginDate: String,
    knownKey: Boolean
});

accountSchema.methods.encryptPassword = (password) => {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10));
};

accountSchema.methods.comparePassword = function (password) {
    return bcrypt.compareSync(password, this.password);
}

module.exports = mongoose.model('accounts', accountSchema);