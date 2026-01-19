const crypto = require('crypto');
const iterations = 120000;
const salt = crypto.randomBytes(16);
const password = 'password123';
const derivedKey = crypto.pbkdf2Sync(password, salt, iterations, 32, 'sha256');
const stored = `pbkdf2$${iterations}$${salt.toString('base64')}$${derivedKey.toString('base64')}`;
console.log('Stored:', stored);

const [algo, iterRaw, saltB64, hashB64] = stored.split('$');
const saltBuf = Buffer.from(saltB64, 'base64');
const expected = Buffer.from(hashB64, 'base64');
const actual = crypto.pbkdf2Sync(password, saltBuf, iterations, expected.length, 'sha256');
console.log('Match:', crypto.timingSafeEqual(expected, actual));
