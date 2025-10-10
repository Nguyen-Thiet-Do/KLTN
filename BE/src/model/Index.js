const Account = require('./Account');
const Reader = require('./Reader');
const Librarian = require('./Librarian');

// Account has one Reader
Account.hasOne(Reader, {
  foreignKey: 'accountId',
  as: 'reader'
});

Reader.belongsTo(Account, {
  foreignKey: 'accountId',
  as: 'account'
});

// Account has one Librarian
Account.hasOne(Librarian, {
  foreignKey: 'accountId',
  as: 'librarian'
});

Librarian.belongsTo(Account, {
  foreignKey: 'accountId',
  as: 'account'
});

module.exports = {
  Account,
  Reader,
  Librarian
};