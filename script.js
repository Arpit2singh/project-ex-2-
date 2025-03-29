// Import CryptoJS library in the HTML file with:
// <script src="https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.1.1/crypto-js.min.js"></script>
// <script src="https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js"></script>

// Tab Switching Functionality
document.addEventListener("DOMContentLoaded", function () {
  const encryptTab = document.querySelector(".encrypt-tab");
  const decryptTab = document.querySelector(".decrypt-tab");
  const qrcodeTab = document.querySelector(".qrcode-tab");
  const encryptCard = document.querySelector(".card:nth-child(1)");
  const decryptCard = document.querySelector(".card:nth-child(2)");
  const qrcodeCard = document.querySelector(".card:nth-child(3)");

  // Initially hide decrypt and qrcode cards
  decryptCard.style.display = "none";
  qrcodeCard.style.display = "none";
  encryptTab.classList.add("active");

  encryptTab.addEventListener("click", function () {
    encryptCard.style.display = "block";
    decryptCard.style.display = "none";
    qrcodeCard.style.display = "none";
    encryptTab.classList.add("active");
    decryptTab.classList.remove("active");
    qrcodeTab.classList.remove("active");
  });

  decryptTab.addEventListener("click", function () {
    encryptCard.style.display = "none";
    decryptCard.style.display = "block";
    qrcodeCard.style.display = "none";
    decryptTab.classList.add("active");
    encryptTab.classList.remove("active");
    qrcodeTab.classList.remove("active");
  });

  qrcodeTab.addEventListener("click", function () {
    encryptCard.style.display = "none";
    decryptCard.style.display = "none";
    qrcodeCard.style.display = "block";
    qrcodeTab.classList.add("active");
    encryptTab.classList.remove("active");
    decryptTab.classList.remove("active");
  });

  // Initialize QR code container
  new QRCode(document.getElementById("qrcode"), {
    text: "https://enced.example.com",
    width: 200,
    height: 200,
    colorDark: "#000000",
    colorLight: "#ffffff",
    correctLevel: QRCode.CorrectLevel.H,
  });
});

// Password Strength Meter
function checkPasswordStrength(password) {
  const strengthMeter = document.getElementById("strengthMeter");
  const strengthText = document.getElementById("strengthText");

  // Check strength
  let strength = 0;
  if (password.length >= 8) strength += 1;
  if (password.match(/[A-Z]/)) strength += 1;
  if (password.match(/[a-z]/)) strength += 1;
  if (password.match(/[0-9]/)) strength += 1;
  if (password.match(/[^A-Za-z0-9]/)) strength += 1;

  // Update UI
  strengthMeter.value = strength;

  switch (strength) {
    case 0:
    case 1:
      strengthText.textContent = "Weak";
      strengthText.style.color = "#ff4d4d";
      break;
    case 2:
    case 3:
      strengthText.textContent = "Medium";
      strengthText.style.color = "#ffaa00";
      break;
    case 4:
    case 5:
      strengthText.textContent = "Strong";
      strengthText.style.color = "#00cc44";
      break;
  }
}

// Copy to Clipboard function
function copyToClipboard(elementId) {
  const element = document.getElementById(elementId);
  element.select();
  document.execCommand("copy");

  // Show tooltip/notification
  const notification = document.getElementById("copyNotification");
  notification.textContent = "Copied to clipboard!";
  notification.style.opacity = "1";

  setTimeout(function () {
    notification.style.opacity = "0";
  }, 2000);
}

// Actual Encryption Function with AES
function encryptText() {
  const text = document.getElementById("textInput").value;
  const key = document.getElementById("encryptKey").value;

  if (!text || !key) {
    showError("Please enter both text and key");
    return;
  }

  try {
    // Use AES encryption from CryptoJS
    const encrypted = CryptoJS.AES.encrypt(text, key).toString();
    document.getElementById("encryptedOutput").value = encrypted;

    // Add to history
    addToHistory("encrypt", text, encrypted);
  } catch (error) {
    showError("Encryption failed: " + error.message);
  }
}

// Actual Decryption Function with AES
function decryptText() {
  const encryptedText = document.getElementById("decryptInput").value;
  const key = document.getElementById("decryptKey").value;

  if (!encryptedText || !key) {
    showError("Please enter both encrypted text and key");
    return;
  }

  try {
    // Use AES decryption from CryptoJS
    const decrypted = CryptoJS.AES.decrypt(encryptedText, key).toString(
      CryptoJS.enc.Utf8
    );

    if (!decrypted) {
      throw new Error("Incorrect key or invalid encrypted text");
    }

    document.getElementById("decryptedOutput").value = decrypted;

    // Add to history
    addToHistory("decrypt", encryptedText, decrypted);
  } catch (error) {
    showError("Decryption failed: " + error.message);
  }
}

// Error message display
function showError(message) {
  const errorBox = document.getElementById("errorBox");
  errorBox.textContent = message;
  errorBox.style.opacity = "1";

  setTimeout(function () {
    errorBox.style.opacity = "0";
  }, 3000);
}

// Encryption/Decryption History
function addToHistory(type, input, output) {
  const historyList = document.getElementById("historyList");
  const timestamp = new Date().toLocaleTimeString();

  const historyItem = document.createElement("div");
  historyItem.className = "history-item";
  historyItem.innerHTML = `
        <div class="history-time">${timestamp}</div>
        <div class="history-type">${
          type === "encrypt" ? "Encryption" : "Decryption"
        }</div>
        <div class="history-content">
            <div class="history-input">${input.substring(0, 20)}${
    input.length > 20 ? "..." : ""
  }</div>
            <div class="history-output">${output.substring(0, 20)}${
    output.length > 20 ? "..." : ""
  }</div>
        </div>
        <button class="history-reuse" onclick="reuseHistoryItem('${type}', '${input.replace(
    /'/g,
    "\\'"
  )}', '${output.replace(/'/g, "\\'")}')">Reuse</button>
    `;

  historyList.prepend(historyItem);

  // Limit history to 10 items
  if (historyList.children.length > 10) {
    historyList.removeChild(historyList.lastChild);
  }
}

// Reuse history item
function reuseHistoryItem(type, input, output) {
  if (type === "encrypt") {
    document.querySelector(".encrypt-tab").click();
    document.getElementById("textInput").value = input;
    document.getElementById("encryptedOutput").value = output;
  } else {
    document.querySelector(".decrypt-tab").click();
    document.getElementById("decryptInput").value = input;
    document.getElementById("decryptedOutput").value = output;
  }
}

// File Upload for Encryption/Decryption
function handleFileUpload(event, isEncrypt) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();

  reader.onload = function (e) {
    const content = e.target.result;

    if (isEncrypt) {
      document.getElementById("textInput").value = content;
    } else {
      document.getElementById("decryptInput").value = content;
    }
  };

  reader.readAsText(file);
}

// Download Result as File
function downloadResult(isEncrypt) {
  const content = isEncrypt
    ? document.getElementById("encryptedOutput").value
    : document.getElementById("decryptedOutput").value;

  if (!content) {
    showError("No content to download");
    return;
  }

  const filename = isEncrypt ? "encrypted_text.txt" : "decrypted_text.txt";
  const blob = new Blob([content], { type: "text/plain" });
  const a = document.createElement("a");

  a.href = URL.createObjectURL(blob);
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

// Dark/Light Mode Toggle
function toggleDarkMode() {
  const body = document.body;
  body.classList.toggle("dark-mode");

  // Save preference
  const isDarkMode = body.classList.contains("dark-mode");
  localStorage.setItem("darkMode", isDarkMode);

  // Update toggle button text
  const toggleBtn = document.getElementById("darkModeToggle");
  toggleBtn.textContent = isDarkMode ? "☀️ Light Mode" : "🌙 Dark Mode";
}

// Load saved dark mode preference on page load
document.addEventListener("DOMContentLoaded", function () {
  const savedDarkMode = localStorage.getItem("darkMode") === "true";
  if (savedDarkMode) {
    document.body.classList.add("dark-mode");
    document.getElementById("darkModeToggle").textContent = "☀️ Light Mode";
  }
});

// Initialize particles.js
particlesJS("particles-js", {
  particles: {
    number: {
      value: 80,
      density: {
        enable: true,
        value_area: 800,
      },
    },
    color: {
      value: ["#ff5733", "#33ff57", "#3357ff"],
    },
    shape: {
      type: "circle",
    },
    opacity: {
      value: 0.6,
      random: false,
    },
    size: {
      value: 3,
      random: true,
    },
    move: {
      enable: true,
      speed: 2,
      direction: "none",
      random: false,
    },
  },
  interactivity: {
    events: {
      onhover: {
        enable: true,
        mode: "repulse",
      },
      onclick: {
        enable: true,
        mode: "push",
      },
    },
    modes: {
      repulse: {
        distance: 100,
        duration: 0.4,
      },
      push: {
        particles_nb: 4,
      },
    },
  },
});

// QR Code Generator
function generateQRCode() {
  const qrInput = document.getElementById("qrInput").value;

  if (!qrInput) {
    showError("Please enter text for the QR code");
    return;
  }

  // Clear previous QR code
  document.getElementById("qrcode").innerHTML = "";

  // Generate new QR code
  const size = document.getElementById("qrSizeSlider").value;

  new QRCode(document.getElementById("qrcode"), {
    text: qrInput,
    width: parseInt(size),
    height: parseInt(size),
    colorDark: "#000000",
    colorLight: "#ffffff",
    correctLevel: QRCode.CorrectLevel.H,
  });

  // Add to history
  addToHistory("qrcode", qrInput, "QR Code Generated");
}

// Update QR Size
function updateQRSize(size) {
  document.getElementById("qrSizeValue").textContent = `${size} x ${size}`;
}

// Download QR Code
function downloadQRCode() {
  const qrCanvas = document.querySelector("#qrcode canvas");

  if (!qrCanvas) {
    showError("No QR code to download");
    return;
  }

  const a = document.createElement("a");
  a.href = qrCanvas.toDataURL("image/png");
  a.download = "qrcode.png";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

// Generate QR from encrypted output
function generateQRFromEncrypted() {
  const encryptedText = document.getElementById("encryptedOutput").value;

  if (!encryptedText) {
    showError("No encrypted text to generate QR code");
    return;
  }

  // Switch to QR code tab
  document.querySelector(".qrcode-tab").click();

  // Fill input and generate QR
  document.getElementById("qrInput").value = encryptedText;
  generateQRCode();
}

// Password Generator Modal
function togglePasswordGenerator() {
  const modal = document.getElementById("passwordGeneratorModal");
  modal.style.display = modal.style.display === "block" ? "none" : "block";

  // Generate a new password when opening
  if (modal.style.display === "block") {
    generatePassword();
  }
}

// Close modal when clicking outside
window.onclick = function (event) {
  const modal = document.getElementById("passwordGeneratorModal");
  if (event.target === modal) {
    modal.style.display = "none";
  }
};

// Update password length display
function updatePasswordLength(length) {
  document.getElementById("passwordLengthValue").textContent = length;
}

// Generate random password
function generatePassword() {
  const length = parseInt(document.getElementById("passwordLength").value);
  const includeUppercase = document.getElementById("includeUppercase").checked;
  const includeLowercase = document.getElementById("includeLowercase").checked;
  const includeNumbers = document.getElementById("includeNumbers").checked;
  const includeSymbols = document.getElementById("includeSymbols").checked;

  if (
    !includeUppercase &&
    !includeLowercase &&
    !includeNumbers &&
    !includeSymbols
  ) {
    showError("Please select at least one character type");
    return;
  }

  let charset = "";
  if (includeUppercase) charset += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  if (includeLowercase) charset += "abcdefghijklmnopqrstuvwxyz";
  if (includeNumbers) charset += "0123456789";
  if (includeSymbols) charset += "!@#$%^&*()_+-=[]{}|;:,.<>?";

  let password = "";
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    password += charset[randomIndex];
  }

  document.getElementById("generatedPassword").value = password;

  // Check password strength
  checkPasswordStrength(password);
}

// Use generated password for encryption
function useGeneratedPassword() {
  const password = document.getElementById("generatedPassword").value;

  if (!password) {
    showError("No password generated");
    return;
  }

  document.getElementById("encryptKey").value = password;
  checkPasswordStrength(password);
  togglePasswordGenerator();

  // Switch to encrypt tab if not active
  document.querySelector(".encrypt-tab").click();
}

// Fill encryption key with generated password
function fillEncryptKey() {
  togglePasswordGenerator();
}
