const crypto = require('crypto')
const fs = require('fs')

const keyPair = () => {
    // Generates an object where the keys are stored in properties `privateKey` and `publicKey`
    const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
        modulusLength: 4096, // bits - standard for RSA keys
        publicKeyEncoding: {
            type: 'pkcs1', // "Public Key Cryptography Standards 1"
            format: 'pem', // Most common formatting choice
        },
        privateKeyEncoding: {
            type: 'pkcs1', // "Public Key Cryptography Standards 1"
            format: 'pem', // Most common formatting choice
        },
    })

    fs.writeFileSync(__dirname + '/id_rsa_pub.pem', publicKey)
    fs.writeFileSync(__dirname + '/id_rsa_prv.pem', privateKey)
}

keyPair()