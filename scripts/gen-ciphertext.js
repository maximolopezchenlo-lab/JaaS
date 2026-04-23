const crypto = require("crypto");

const publicKeyStr = `-----BEGIN PUBLIC KEY-----
MIICIjANBgkqhkiG9w0BAQEFAAOCAg8AMIICCgKCAgEAsiPf7gF6JeqHI3L/IB+O
3S7PdcgVkABmW420SdwSa48l9vkTb1VqbOisp9DFn7tWNJihRqTF8jQ/zpJT5OJ0
hzUesqWM2Culcy0sYKJRD/hm34F0EsNyyQTcNyV23P1Sj7Bsj+9VcwU/xSf5D+s3
1jMCPMkYsSfWebsNhd330u1hL5TVlfVJ5PW2bLNVwukMsJk1ycZ7A9Oz4X2RJYor
RvammaLy8ZZ8ST2tBTW/CcyIXhwPwVQqTLATjDRGMd6biePWHFildYoc+mrvX9UQ
6ZKjSArLOheOrX5bLZ6nmSo9yyQ2f/YYA8NkQm1ZXhfWT4veafVk/Y41RiZu57N8
M7FabC25gZ1gUyhQafXdVGPdKv5+rH94i1BE/DeLO+IR+2S6tAhZ9p8JHT5VEJ2Z
NB2HHdJCf9mMuWxOI6AetKHMNEHdwueBGyFrYkq5ztOcugROgnyPEnR0W77q/rJA
EVITtpA8u3Nacqlp9deegYP6MaQz4Hx0qTIfvfCm+G+yTDRCVAqCQCMt2BjexzbA
hdwB45/lx/lBo66sBqOftgDdccAX4+yCnLe38SCJq7Sw2sijlQBDsFyAZOBXpc89
4XTx5Pyg/BOmf/ujnEoyMnUocJdedCrjm7lzEgnkr91wIp3p7R09hZ/wRoCA9nD/
9njU0jdlA1HNfaGnmH0GW3kCAwEAAQ==
-----END PUBLIC KEY-----`;

const entitySecretHex = "cc906f085c45de6251da3a8314d0ce457fc8cafcf9ffe83c770aa6d9fa813a82";

function generateCiphertext() {
  const entitySecret = Buffer.from(entitySecretHex, "hex");
  if (entitySecret.length !== 32) {
    throw new Error("Entity secret must be 32 bytes");
  }

  const publicKey = crypto.createPublicKey(publicKeyStr);

  const ciphertext = crypto.publicEncrypt(
    {
      key: publicKey,
      padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
      oaepHash: "sha256",
    },
    entitySecret
  );

  console.log(ciphertext.toString("base64"));
}

generateCiphertext();
