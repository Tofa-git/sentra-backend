const bcrypt = require('bcrypt');
const CryptoJS = require('crypto-js');
const saltRounds = bcrypt.genSaltSync(10);

const secretKey = 's3ntRa-h0t3L'; 

const encryptPassword = function (password) {
    return bcrypt.hashSync(password, saltRounds);
}

const comparePassword = function (password, userPassword) {
    return bcrypt.compareSync(password, userPassword);
}

const encryptData = (data) => {
  const encryptedPhone = CryptoJS.AES.encrypt(data, secretKey).toString();
  return encryptedPhone;
};

const decryptData = (encryptedData) => {
  const bytes = CryptoJS.AES.decrypt(encryptedData, secretKey);
  const decryptedData = bytes.toString(CryptoJS.enc.Utf8);
  return decryptedData;
};

module.exports = {
    encryptPassword,
    comparePassword,
    encryptData,
    decryptData
}
