---
sidebar_position: 3
---

# Signature Verification

**ECDSA (Elliptic Curve Digital Signature Algorithm)** is a cryptographic method used to verify that some data was created by a trusted source and has not been modified.

#### 🔐 What Is a Signature?

A **digital signature** is like a stamp of authenticity. It is created using a **private key** and can be verified using the matching **public key**. If the data changes, even a single bit, the signature becomes invalid.

---

### ✅ Verification Process (General Steps)

1. **Get the Signature**

   - You must have the digital signature that was created with a private key.
   - An ECDSA signature is made of two numbers: `r` and `s`.
   - Sometimes these are provided as two separate values, or as a single encoded byte array.

2. **Get the Public Key**

   - The public key is used to check the signature.
   - It must match the private key that was used to sign the original data.

3. **Reconstruct the Signed Message**

   - You must know _exactly_ what data was signed.
   - This could be a combination of fields like:
     - A unique ID (UID)
     - Some configuration or memory bytes
     - Timestamps or metadata
   - The data should be in the same **order and format** as when it was originally signed.

4. **Hash the Message**

   - Apply a cryptographic hash function like **SHA-256** to the message.
   - Hashing converts any size of data into a fixed-length digest.
   - This hash is what the signature actually covers.

5. **Verify the Signature**
   - Use the public key to check if the signature is valid **for that hash**.
   - If the signature matches, the data is trusted.
   - If not, the data may be modified or not signed by the expected authority.

---

### 🧠 Why This Is Useful

- **Authenticity:** Ensures data comes from a trusted source (e.g., a manufacturer).
- **Integrity:** Ensures data has not been changed or tampered with.
- **Security:** Private key stays hidden; only the public key is shared for verification.

---

### 📦 Typical Use Case Example

For example, to verify data on an NFC tag:

1. Read the tag’s unique ID (UID)
2. Read custom memory values
3. Combine them into a message
4. Hash the message with SHA-256
5. Verify the stored signature using the public key

---

### ⚠️ Important Notes

- **Order matters:** The signed message must be exactly the same as the original.
- **Signature format:** ECDSA signatures may be raw (`r || s`) or encoded (like DER).
- **Key pair:** The public key must match the private key that created the signature.
- **Hash function:** The same algorithm (e.g., SHA-256) must be used for both signing and verification.

---

> 💡 You can use ECDSA in almost any programming language. Libraries exist for Arduino, Python, JavaScript, Rust, Go, etc. Just follow the same steps: reconstruct the message → hash it → verify the signature.
