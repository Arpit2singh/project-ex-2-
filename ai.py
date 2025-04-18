import numpy as np
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Dense

# Generate synthetic data for encryption and decryption
def generate_data(samples=1000, key=42):
    np.random.seed(0)
    plaintext = np.random.randint(0, 256, size=(samples, 1))  # Random plaintext
    key_array = np.full((samples, 1), key)  # Fixed key
    ciphertext = np.bitwise_xor(plaintext, key_array)  # XOR encryption
    return plaintext, ciphertext, key_array

# Build a simple neural network model
def build_model():
    model = Sequential([
        Dense(16, input_dim=2, activation='relu'),
        Dense(16, activation='relu'),
        Dense(1, activation='linear')  # Output layer
    ])
    model.compile(optimizer='adam', loss='mse', metrics=['accuracy'])
    return model

# Train the model
def train_model(model, plaintext, ciphertext, key_array):
    inputs = np.hstack((ciphertext, key_array))  # Combine ciphertext and key as input
    model.fit(inputs, plaintext, epochs=10, batch_size=32, verbose=1)

# Encrypt and decrypt using the model
def encrypt_decrypt(model, plaintext, key):
    key_array = np.full((len(plaintext), 1), key)
    ciphertext = np.bitwise_xor(plaintext, key_array)  # XOR encryption
    inputs = np.hstack((ciphertext, key_array))
    decrypted = model.predict(inputs)
    return ciphertext, np.round(decrypted).astype(int)

# Main function
if __name__ == "__main__":
    plaintext, ciphertext, key_array = generate_data()
    model = build_model()
    train_model(model, plaintext, ciphertext, key_array)

    # Test the model
    test_plaintext = np.array([[123], [45], [67]])
    key = 42
    encrypted, decrypted = encrypt_decrypt(model, test_plaintext, key)
    print("Original:", test_plaintext.flatten())
    print("Encrypted:", encrypted.flatten())
    print("Decrypted:", decrypted.flatten())