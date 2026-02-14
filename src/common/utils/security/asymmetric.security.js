import crypto from "node:crypto";


export const { publicKey, privateKey } = crypto.generateKeyPairSync("rsa", {
  modulusLength: 2048,
});


export const encryptWithPublicKey = (data) => {
  return crypto.publicEncrypt(publicKey, Buffer.from(data)).toString("base64");
};


export const decryptWithPrivateKey = (encryptedData) => {
  return crypto.privateDecrypt(
    privateKey,
    Buffer.from(encryptedData, "base64")
  ).toString();
};
