// Encryption Function
function encryptText() {
    const text = document.getElementById("textInput").value;
    document.getElementById("encryptedOutput").value = btoa(text); // Base64 encryption
}

// Decryption Function
function decryptText() {
    try {
        const encryptedText = document.getElementById("decryptInput").value;
        document.getElementById("decryptedOutput").value = atob(encryptedText);
    } catch (error) {
        document.getElementById("decryptedOutput").value = "Invalid encrypted text";
    }
}
particlesJS("particles-js", {
    "particles": {
        "number": {
            "value": 80,  // Number of particles
            "density": {
                "enable": true,
                "value_area": 800  // Spread area
            }
        },
        "color": {
            "value": ["#ff5733", "#33ff57", "#3357ff"]  // Particle colors
        },
        "shape": {
            "type": "circle"
        },
        "opacity": {
            "value": 0.6,
            "random": false
        },
        "size": {
            "value": 3,
            "random": true
        },
        "move": {
            "enable": true,
            "speed": 2,  // Movement speed
            "direction": "none",
            "random": false
        }
    },
    "interactivity": {
        "events": {
            "onhover": {
                "enable": true,
                "mode": "repulse"  // Particles move away on hover
            }
        }
    }
});
