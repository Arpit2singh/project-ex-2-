// Import CryptoJS library in the HTML file with:
// <script src="https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.1.1/crypto-js.min.js"></script>

// Tab Switching Functionality
document.addEventListener("DOMContentLoaded", function () {
  const encryptTab = document.querySelector(".encrypt-tab");
  const decryptTab = document.querySelector(".decrypt-tab");
  const encryptCard = document.querySelector(".card:nth-child(1)");
  const decryptCard = document.querySelector(".card:nth-child(2)");

  // Initially hide decrypt card
  decryptCard.style.display = "none";
  encryptTab.classList.add("active");

  encryptTab.addEventListener("click", function () {
    encryptCard.style.display = "block";
    decryptCard.style.display = "none";
    encryptTab.classList.add("active");
    decryptTab.classList.remove("active");
  });

  decryptTab.addEventListener("click", function () {
    encryptCard.style.display = "none";
    decryptCard.style.display = "block";
    decryptTab.classList.add("active");
    encryptTab.classList.remove("active");
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
