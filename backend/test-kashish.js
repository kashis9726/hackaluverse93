const crypto = require('crypto');
const password = 'password123';
const stored = 'pbkdf2$120000$Jj3/uJjD06M6nTjpl4twbA==$Vq6L+ww5IlT0c835HtW3GSxVFTexoIgiNTEd8oRzw+E=';

const [algo, iterRaw, saltB64, hashB64] = stored.split('$');
const iterations = Number(iterRaw);
const salt = Buffer.from(saltB64, 'base64');
const expected = Buffer.from(hashB64, 'base64');
const actual = crypto.pbkdf2Sync(password, salt, iterations, expected.length, 'sha256');

console.log('Match:', crypto.timingSafeEqual(expected, actual));
