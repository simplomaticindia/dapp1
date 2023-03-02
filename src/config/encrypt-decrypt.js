 //const Crypto = require('crypto');
 
// const algorithm = 'aes-256-cbc';
 
// //const key = crypto.randomBytes(32);
 
// const iv = crypto.randomBytes(16);
 
// function encrypt(text) {
//     let cipher = crypto.createCipheriv(algorithm, Buffer.from(key), iv);
//     let encrypted = cipher.update(text);
//     encrypted = Buffer.concat([encrypted, cipher.final()]);
//     return { iv: iv.toString('hex'),
//     encryptedData: encrypted.toString('hex') };
// }
 
// //var encrypted = encrypt("Hello World!");
// //console.log(encrypted);
 
// function decrypt(text) {
//     let iv = Buffer.from(text.iv, 'hex');
//     let encryptedText = Buffer.from(text.encryptedData, 'hex');
 
//     let decipher = crypto.createDecipheriv(algorithm, Buffer.from(key), iv);
 
//     let decrypted = decipher.update(encryptedText);
//     decrypted = Buffer.concat([decrypted, decipher.final()]);
 
//     return decrypted.toString();
// }
var Crypto = require('crypto');
var secret_key = 'fd85b494-aaaa';
var secret_iv = 'smslt';
var encryptionMethod = 'AES-256-CBC';
var secret = Crypto.createHash('sha512').update(secret_key, 'utf-8').digest('hex').substr(0, 32);
var iv = Crypto.createHash('sha512').update(secret_iv, 'utf-8').digest('hex').substr(0, 16);
//var encryptedMessage = encrypt("hellomukesh");
//console.log(encryptedMessage);
 // output : L2dOZjlDVmxoSDNWdmpVMkNGd0JEdz09
 //var decrptMessage = decrypt(encryptedMessage);
 //console.log(decrptMessage);  //output : hello
 function encrypt(plain_text) {
  var encryptor = Crypto.createCipheriv(encryptionMethod, secret, iv);
  var aes_encrypted = encryptor.update(plain_text, 'utf8', 'base64') + encryptor.final('base64');
  return Buffer.from(aes_encrypted).toString('base64');
};function decrypt(encryptedMessage) {
  const buff = Buffer.from(encryptedMessage, 'base64');
  encryptedMessage = buff.toString('utf-8');
  var decryptor = Crypto.createDecipheriv(encryptionMethod, secret, iv);
  return decryptor.update(encryptedMessage, 'base64', 'utf8') + decryptor.final('utf8');
};
module.exports =  {
   encrypt:encrypt,
   decrypt:decrypt
};
//const decrypted = decrypt(encrypted)
//console.log("Decrypted Text: " + decrypted);