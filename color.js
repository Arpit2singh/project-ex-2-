const canvas = document.getElementById("colorCanvas");
const ctx = canvas.getContext("2d");
const charMap = {};
const reverseMap = {};

function generateCharMap() {
  let code = 0;
  for (let i = 32; i < 127; i++) {
    const r = (code * 73) % 256;
    const g = (code * 151) % 256;
    const b = (code * 199) % 256;
    charMap[String.fromCharCode(i)] = [r, g, b];
    reverseMap[`${r},${g},${b}`] = String.fromCharCode(i);
    code++;
  }
}

generateCharMap();

function encrypt() {
  const text = document.getElementById("textInput").value;
  canvas.width = text.length;
  canvas.height = 1;
  const imgData = ctx.createImageData(text.length, 1);

  for (let i = 0; i < text.length; i++) {
    const [r, g, b] = charMap[text[i]] || [0, 0, 0];
    imgData.data[i * 4 + 0] = r;
    imgData.data[i * 4 + 1] = g;
    imgData.data[i * 4 + 2] = b;
    imgData.data[i * 4 + 3] = 255;
  }

  ctx.putImageData(imgData, 0, 0);
  document.getElementById("decryptedText").textContent = '';
}

function decrypt() {
  const imgData = ctx.getImageData(0, 0, canvas.width, 1);
  let result = "";

  for (let i = 0; i < canvas.width; i++) {
    const r = imgData.data[i * 4 + 0];
    const g = imgData.data[i * 4 + 1];
    const b = imgData.data[i * 4 + 2];
    const key = `${r},${g},${b}`;
    result += reverseMap[key] || '?';
  }

  document.getElementById("decryptedText").textContent = "Decrypted: " + result;
}

function downloadImage() {
  const link = document.createElement("a");
  link.download = "encrypted.png";
  link.href = canvas.toDataURL();
  link.click();
}

function loadEncryptedImage(event) {
  const file = event.target.files[0];
  const reader = new FileReader();

  reader.onload = function (e) {
    const img = new Image();
    img.onload = function () {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
    };
    img.src = e.target.result;
  };

  if (file) reader.readAsDataURL(file);
}
