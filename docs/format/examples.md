---
sidebar_position: 4
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Code Samples

### Construct Tag Data

This examples shows how to construct and write the memory layout of a TigerTag
onto an NTAG213-compatible RFID tag.

⚠️ Note: All tag values in this example are hardcoded for demonstration.
In a real implementation, you must retrieve the required values from the
TigerTag REST API (e.g., /product/filament/get, /material/filament/get, etc.)
and map them into the appropriate TigerTag memory layout before writing.

  <Tabs>
    <TabItem value="A" label="Python rc522" default="true">
```python

# Python example to construct and write a TigerTag to NTAG213 using RC522
# Requires: pi-rc522 or similar library (SPI-based MFRC522)

from pirc522 import RFID
import RPi.GPIO as GPIO
import struct
import time

# Simulated tag data
TAG_ID = 0x6C223431
PRODUCT_ID = [0x12, 0x34, 0x56, 0x78]
MATERIAL_ID = 0x1665
ASPECT1 = 21
ASPECT2 = 0
TYPE_ID = 142
DIAMETER_ID = 56
BRAND_ID = 1120
COLOR = 0x541D09FF
WEIGHT = 1000
UNIT_ID = 1
TEMP_MIN = 240
TEMP_MAX = 280
DRY_TEMP = 70
DRY_TIME = 8
TIMESTAMP = int(time.time()) - 946684800

# Prepare 144-byte memory (pages 4-39)
tag_data = bytearray(144)

def write(offset, data):
    tag_data[offset:offset + len(data)] = data

write(0, struct.pack('<I', TAG_ID))
write(4, bytes(PRODUCT_ID))
write(8, struct.pack('<HBB', MATERIAL_ID, ASPECT1, ASPECT2))
write(12, struct.pack('<BBH', TYPE_ID, DIAMETER_ID, BRAND_ID))
write(16, struct.pack('<I', COLOR))
write(20, struct.pack('<I', WEIGHT | (UNIT_ID << 24)))
write(24, struct.pack('<HH', TEMP_MIN, TEMP_MAX))
write(28, struct.pack('<BBH', DRY_TEMP, DRY_TIME, 0))
write(32, struct.pack('<I', TIMESTAMP))
# Pages 13-15 (reserved) and metadata + signature are already zero

# Initialize RC522 reader
rdr = RFID()
rdr.wait_for_tag()

print("Waiting for tag...")
while True:
    rdr.wait_for_tag()
    (error, tag_type) = rdr.request()
    if not error:
        (error, uid) = rdr.anticoll()
        if not error:
            print("Tag detected UID: {}".format(uid))
            rdr.select_tag(uid)
            for page in range(4, 40):
                offset = (page - 4) * 4
                block = list(tag_data[offset:offset+4])
                err = rdr.write(page, block)
                if err:
                    print(f"Failed to write page {page}")
                    break
            print("TigerTag written successfully!")
            rdr.stop_crypto()
            break

GPIO.cleanup()
```
</TabItem>
<TabItem value="B" label="Python pn532">
```python
# Python example to construct and write TigerTag to NTAG213 using PN532 (I2C)
# Requires: Adafruit_CircuitPython_PN532

import board
import busio
import time
import struct
import adafruit_pn532.i2c

# Setup I2C and PN532
i2c = busio.I2C(board.SCL, board.SDA)
pn532 = adafruit_pn532.i2c.PN532_I2C(i2c, debug=False)
pn532.SAM_configuration()

# Simulated tag data
TAG_ID = 0x6C223431
PRODUCT_ID = [0x12, 0x34, 0x56, 0x78]
MATERIAL_ID = 0x1665
ASPECT1 = 21
ASPECT2 = 0
TYPE_ID = 142
DIAMETER_ID = 56
BRAND_ID = 1120
COLOR = 0x541D09FF
WEIGHT = 1000
UNIT_ID = 1
TEMP_MIN = 240
TEMP_MAX = 280
DRY_TEMP = 70
DRY_TIME = 8
TIMESTAMP = int(time.time()) - 946684800

# Construct tag memory (36 pages * 4 bytes = 144 bytes)
tag_data = bytearray(144)

def write(offset, data):
    tag_data[offset:offset+len(data)] = data

write(0, struct.pack('<I', TAG_ID))
write(4, bytes(PRODUCT_ID))
write(8, struct.pack('<HBB', MATERIAL_ID, ASPECT1, ASPECT2))
write(12, struct.pack('<BBH', TYPE_ID, DIAMETER_ID, BRAND_ID))
write(16, struct.pack('<I', COLOR))
write(20, struct.pack('<I', WEIGHT | (UNIT_ID << 24)))
write(24, struct.pack('<HH', TEMP_MIN, TEMP_MAX))
write(28, struct.pack('<BBH', DRY_TEMP, DRY_TIME, 0))
write(32, struct.pack('<I', TIMESTAMP))
# Pages 13–15 (reserved) and metadata + signature are left as 0

print("Waiting for an NFC tag...")
while True:
    uid = pn532.read_passive_target(timeout=0.5)
    if uid is None:
        continue

    print("Tag detected UID:", [hex(i) for i in uid])

    for page in range(4, 40):
        offset = (page - 4) * 4
        chunk = bytes(tag_data[offset:offset + 4])
        try:
            pn532.ntag2xx_write_block(page, chunk)
        except Exception as e:
            print(f"Failed to write page {page}: {e}")
            break
    else:
        print("TigerTag written successfully!")
        break


````
</TabItem>
<TabItem value="C" label="Arduino rc522" >
```jsx

#include <SPI.h>
#include <MFRC522.h> // The MFRC522 library
#include <mbedtls/ecdsa.h>
#include <mbedtls/ecp.h>
#include <mbedtls/sha256.h>
#include <mbedtls/asn1write.h>
#include <mbedtls/pk.h>
#include <mbedtls/x509_crt.h>
#include <mbedtls/bignum.h>

// Adjust as needed for your Arduino
#define SS_PIN 5
#define RST_PIN 15

MFRC522 mfrc522(SS_PIN, RST_PIN);

// ------------------ PUBLIC KEY ------------------
// Curent PUBLIC KEY for TIGER_TAG_PRO_V1.0
// Replace with the actual ECDSA public key you can find at
// https://api.tigertag.io/api:tigertag#/version/get_version_get_all

static const char *public_key_pem = R"(
-----BEGIN PUBLIC KEY-----
MFkwEwYHKoZIzj0CAQYIKoZIzj0DAQcDQgAEwtX8JRYMoAXTbkU7EXJYKX7g4Mf0
Z3WUuuGzlfyiEiS5UseXT6l1t1ZbMgzsg5IVA0TB7+/w6eyTlgnz/HXONw==
-----END PUBLIC KEY-----
)";

// ------------------ HELPERS ------------------

// Read exactly 4 bytes from one Ultralight page:
bool readUltralightPage(byte page, byte *buffer4)
{
  // The MFRC522's MIFARE_Read() tends to read 16 bytes at once for MIFARE Classic,
  // but for Ultralight tags, it's also used. We'll just copy the first 4.
  byte readBuf[18];
  byte len = sizeof(readBuf);
  MFRC522::StatusCode status = mfrc522.MIFARE_Read(page, readBuf, &len);
  if (status != MFRC522::STATUS_OK)
  {
    Serial.print(F("MIFARE_Read() failed for page "));
    Serial.println(page);
    return false;
  }
  // Copy first 4 bytes out of the 16 read
  memcpy(buffer4, readBuf, 4);
  return true;
}

// Convert raw (r||s) => DER for mbedTLS:
bool encodeSignatureDER(const uint8_t *r_raw, const uint8_t *s_raw,
                        uint8_t *sig_der, size_t *sig_len)
{
  mbedtls_mpi R, S;
  mbedtls_mpi_init(&R);
  mbedtls_mpi_init(&S);

  if (mbedtls_mpi_read_binary(&R, r_raw, 32) != 0)
  {
    Serial.println("Error: reading R into MPI");
    mbedtls_mpi_free(&R);
    mbedtls_mpi_free(&S);
    return false;
  }
  if (mbedtls_mpi_read_binary(&S, s_raw, 32) != 0)
  {
    Serial.println("Error: reading S into MPI");
    mbedtls_mpi_free(&R);
    mbedtls_mpi_free(&S);
    return false;
  }

  uint8_t tmp[80];
  uint8_t *p = tmp + sizeof(tmp);
  int ret = 0;

  // Write S then R
  ret = mbedtls_asn1_write_mpi(&p, tmp, &S);
  if (ret < 0)
  {
    Serial.printf("asn1_write_mpi(S) failed: %d\n", ret);
    mbedtls_mpi_free(&R);
    mbedtls_mpi_free(&S);
    return false;
  }
  ret = mbedtls_asn1_write_mpi(&p, tmp, &R);
  if (ret < 0)
  {
    Serial.printf("asn1_write_mpi(R) failed: %d\n", ret);
    mbedtls_mpi_free(&R);
    mbedtls_mpi_free(&S);
    return false;
  }

  size_t len = (tmp + sizeof(tmp)) - p;
  ret = mbedtls_asn1_write_len(&p, tmp, len);
  if (ret < 0)
  {
    Serial.printf("asn1_write_len() failed: %d\n", ret);
    mbedtls_mpi_free(&R);
    mbedtls_mpi_free(&S);
    return false;
  }
  ret = mbedtls_asn1_write_tag(&p, tmp, MBEDTLS_ASN1_CONSTRUCTED | MBEDTLS_ASN1_SEQUENCE);
  if (ret < 0)
  {
    Serial.printf("asn1_write_tag() failed: %d\n", ret);
    mbedtls_mpi_free(&R);
    mbedtls_mpi_free(&S);
    return false;
  }

  *sig_len = (tmp + sizeof(tmp)) - p;
  memcpy(sig_der, p, *sig_len);

  mbedtls_mpi_free(&R);
  mbedtls_mpi_free(&S);
  return true;
}

// ------------------ SIGNATURE VERIFY ------------------
// Reads pages 24..39 => first 64 bytes as signature, (r||s).
// Then verifies with the public_key_pem that:
//   SHA256( [UID + block4 + block5] ) matches that signature.
bool verifyNtagSignature()
{
  // 1) Get the UID
  //    mfrc522.uid.uidByte[] holds up to 10 bytes, with length = mfrc522.uid.size
  if (mfrc522.uid.size < 7)
  {
    // We expect at least 7 or 8 bytes for NTAG, but it can vary.
    Serial.println("UID seems too short, or not NTAG?");
    return false;
  }

  // For demonstration, we treat the entire UID as is. If your system specifically needs 8 bytes,
  // ensure the tag actually has an 8-byte UID. Some are 7 bytes, some 4, etc.
  Serial.print("UID: ");
  for (byte i = 0; i < mfrc522.uid.size; i++)
  {
    Serial.printf("%02X ", mfrc522.uid.uidByte[i]);
  }
  Serial.println();

  // 2) Read block4 => page4, block5 => page5
  //    Each page is 4 bytes, let's store them:
  uint8_t block4[4];
  uint8_t block5[4];
  if (!readUltralightPage(4, block4))
  {
    return false;
  }
  if (!readUltralightPage(5, block5))
  {
    return false;
  }

  // 3) Read the 64-byte signature from pages 24..39
  //    That's 16 pages, each 4 bytes => 64 bytes total
  uint8_t signature_raw[64];
  memset(signature_raw, 0, 64);
  {
    byte sigOffset = 0;
    for (byte page = 24; page <= 39; page++)
    {
      uint8_t tmp[4];
      if (!readUltralightPage(page, tmp))
      {
        return false;
      }
      // copy 4 bytes
      memcpy(signature_raw + sigOffset, tmp, 4);
      sigOffset += 4;
    }
  }

  // Now we have: UID, block4, block5, and signature_raw (64 bytes).
  // 4) Construct the final message for hashing:
  //    [UID + block4 + block5].
  //    Let’s call the total length = uidLen + 8
  //    (since block4 & block5 are each 4 bytes).
  //    We do not specifically require 8 bytes of UID, we just take however many
  //    the library gave us (mfrc522.uid.size). If you must fix exactly 8, adapt accordingly.
  size_t uidLen = mfrc522.uid.size;
  uint8_t message[32]; // Enough to hold typical max UID (10) + 8 bytes
  memset(message, 0, sizeof(message));
  // Copy UID
  memcpy(message, mfrc522.uid.uidByte, uidLen);
  // Then block4
  memcpy(message + uidLen, block4, 4);
  // Then block5
  memcpy(message + uidLen + 4, block5, 4);

  size_t messageLen = uidLen + 8;

  // 5) Compute SHA-256
  uint8_t hash[32];
  mbedtls_sha256(message, messageLen, hash, 0);

  // 6) Convert (r||s) raw => DER
  uint8_t signature_der[80];
  size_t sig_der_len = 0;
  if (!encodeSignatureDER(signature_raw, signature_raw + 32, signature_der, &sig_der_len))
  {
    Serial.println("Error: encodeSignatureDER failed");
    return false;
  }

  // 7) Parse public key
  mbedtls_pk_context pk;
  mbedtls_pk_init(&pk);
  int ret = mbedtls_pk_parse_public_key(
      &pk,
      (const unsigned char *)public_key_pem,
      strlen(public_key_pem) + 1);
  if (ret != 0)
  {
    Serial.printf("Error: mbedtls_pk_parse_public_key returned -0x%04X\n", -ret);
    mbedtls_pk_free(&pk);
    return false;
  }

  // 8) Verify signature
  ret = mbedtls_pk_verify(&pk,
                          MBEDTLS_MD_SHA256,
                          hash, sizeof(hash),
                          signature_der, sig_der_len);
  mbedtls_pk_free(&pk);

  if (ret == 0)
  {
    // 0 => success
    Serial.println("✅ ECDSA signature is VALID!");
    return true;
  }
  else
  {
    Serial.printf("❌ ECDSA signature INVALID. mbedtls error -0x%04X\n", -ret);
    return false;
  }
}

// --------------------------------------------------------------------------
void setup()
{
  Serial.begin(115200);
  while (!Serial)
  { /* wait for Serial on native USB boards */
  }

  // Init SPI bus
  SPI.begin();
  // Init MFRC522
  
  // Some Chinese board clones may not initialize correctly here.
  // If you're using one of these clones, please refer to the board's documentation, as the solutions may vary.

  mfrc522.PCD_Init(5, 15); 
  Serial.print("✅ RFID Initialized with antenna gain: ");
  Serial.println(mfrc522.PCD_GetAntennaGain());
}

void loop()
{
  delay(10);
  // Look for a new card
  if (!mfrc522.PICC_IsNewCardPresent())
  {
    return; // no card
  }
  // Select the card
  if (!mfrc522.PICC_ReadCardSerial())
  {
    return; // read failed
  }

  // We have a card's UID in mfrc522.uid
  Serial.println("\nFound a card.");

  // Attempt to verify the signature (pages 4,5 + 24..39)
  bool ok = verifyNtagSignature();
  if (ok)
  {
    Serial.println("Signature verification succeeded.");
  }
  else
  {
    Serial.println("Signature verification failed.");
  }

  // Halt the card so we can read another
  mfrc522.PICC_HaltA();
}


````

</TabItem>

</Tabs>

### Verify signature


**TigerTag Signature Verification - Introduction for Users**

TigerTag is a smart RFID-based tagging system used for identifying and authenticating 3D printer filament spools. To ensure the authenticity of a TigerTag, each tag stores a digital signature that proves it was created by a trusted source.

This document explains the verification process in a simple way:

---

**1. What is a Signature?**
A digital signature is like a unique stamp made using a private key. Only the original tag maker knows this key, so if the stamp is valid, you can be sure the tag is genuine.

**2. What Do We Verify?**
To check if the tag is authentic, we combine three parts:
- The tag's unique ID (called UID)
- The header block (block 4)
- An extra data block (block 5)

We put these together and calculate a special code called a **SHA-256 hash**.

**3. What is Stored on the Tag?**
- The UID (read-only and unique per tag)
- Block 4 and Block 5 (standard data for identification)
- A 64-byte signature (split into two parts: r and s) stored in memory pages starting from page 24

**4. How Does Verification Work?**
1. The tag is scanned.
2. The UID, block 4, and block 5 are read.
3. The 64-byte signature (r + s) is read.
4. The software recreates the message: UID + block4 + block5.
5. This message is hashed (SHA-256).
6. The public key (freely available) is used to verify the hash against the signature.

If everything matches, the tag is declared **authentic**.

---

**Why is this Important?**
Without signature verification, anyone could clone a tag. This process protects your supply chain and ensures you're using trusted materials.

**Still Curious?**
- The private key is never shared and only used to sign tags.
- The public key is embedded in the software to verify signatures.
- The ECDSA (Elliptic Curve Digital Signature Algorithm) is the method used here.

With this system, you get **security**, **authenticity**, and **peace of mind** for every TigerTag spool.


<Tabs>
<TabItem value="A" label="Arduino">
```cpp
#include <mbedtls/ecdsa.h>
#include <mbedtls/ecp.h>
#include <mbedtls/sha256.h>
#include <mbedtls/asn1write.h>
#include <mbedtls/pk.h>
#include <mbedtls/x509_crt.h>
#include <mbedtls/bignum.h>
#include <string.h>
#include <stdio.h>

const char *uid_hex = "04AABBCCDDEE1122";
uint8_t block4[4] = {0x5B, 0xF5, 0x92, 0x64};
uint8_t block5[4] = {0x00, 0x00, 0x00, 0x00};
uint8_t signature_raw[64];
char public_key_pem[300];

bool encodeDssSignature(uint8_t *out_der, size_t *sig_len, const uint8_t *r, const uint8_t *s) {
    mbedtls_mpi mpi_r, mpi_s;
    mbedtls_mpi_init(&mpi_r);
    mbedtls_mpi_init(&mpi_s);
    mbedtls_mpi_read_binary(&mpi_r, r, 32);
    mbedtls_mpi_read_binary(&mpi_s, s, 32);

    uint8_t buf[80];
    uint8_t *p = buf + sizeof(buf);
    int ret;

    ret = mbedtls_asn1_write_mpi(&p, buf, &mpi_s);
    if (ret < 0) return false;
    ret = mbedtls_asn1_write_mpi(&p, buf, &mpi_r);
    if (ret < 0) return false;
    ret = mbedtls_asn1_write_len(&p, buf, buf + sizeof(buf) - p);
    if (ret < 0) return false;
    ret = mbedtls_asn1_write_tag(&p, buf, MBEDTLS_ASN1_CONSTRUCTED | MBEDTLS_ASN1_SEQUENCE);
    if (ret < 0) return false;

    *sig_len = buf + sizeof(buf) - p;
    memcpy(out_der, p, *sig_len);
    mbedtls_mpi_free(&mpi_r);
    mbedtls_mpi_free(&mpi_s);
    return true;
}

bool generateSignatureAndKey() {
    mbedtls_pk_context key;
    mbedtls_pk_init(&key);
    mbedtls_pk_setup(&key, mbedtls_pk_info_from_type(MBEDTLS_PK_ECKEY));
    mbedtls_ecp_gen_key(MBEDTLS_ECP_DP_SECP256R1, mbedtls_pk_ec(key), mbedtls_ctr_drbg_random, nullptr);

    uint8_t uid_bytes[16] = {0};
    for (int i = 0; i < 8; ++i)
        sscanf(uid_hex + 2 * i, "%2hhx", &uid_bytes[i]);

    uint8_t message[16] = {0};
    memcpy(message, uid_bytes, 8);
    memcpy(message + 8, block4, 4);
    memcpy(message + 12, block5, 4);

    uint8_t hash[32];
    mbedtls_sha256(message, 16, hash, 0);

    unsigned char der_signature[80];
    size_t der_len;
    mbedtls_ecdsa_write_signature(mbedtls_pk_ec(key), MBEDTLS_MD_SHA256,
        hash, sizeof(hash), der_signature, &der_len, mbedtls_ctr_drbg_random, nullptr);

    mbedtls_ecdsa_context *ecdsa = mbedtls_pk_ec(key);
    memcpy(signature_raw, ecdsa->r.p + (ecdsa->r.n - 32), 32);
    memcpy(signature_raw + 32, ecdsa->s.p + (ecdsa->s.n - 32), 32);

    mbedtls_pk_write_pubkey_pem(&key, (unsigned char *)public_key_pem, sizeof(public_key_pem));
    mbedtls_pk_free(&key);
    return true;
}

bool verifySignature() {
    uint8_t uid_bytes[16] = {0};
    for (int i = 0; i < 8; ++i)
        sscanf(uid_hex + 2 * i, "%2hhx", &uid_bytes[i]);

    uint8_t message[16];
    memcpy(message, uid_bytes, 8);
    memcpy(message + 8, block4, 4);
    memcpy(message + 12, block5, 4);

    uint8_t hash[32];
    mbedtls_sha256(message, 16, hash, 0);

    uint8_t signature_der[80];
    size_t sig_len = 0;
    if (!encodeDssSignature(signature_der, &sig_len, signature_raw, signature_raw + 32)) {
        printf("Failed to encode signature\n");
        return false;
    }

    mbedtls_pk_context pk;
    mbedtls_pk_init(&pk);
    if (mbedtls_pk_parse_public_key(&pk, (const unsigned char *)public_key_pem, strlen(public_key_pem) + 1) != 0) {
        printf("Failed to parse public key\n");
        return false;
    }

    int ret = mbedtls_pk_verify(&pk, MBEDTLS_MD_SHA256, hash, sizeof(hash), signature_der, sig_len);
    mbedtls_pk_free(&pk);

    if (ret == 0) {
        printf("✅ Signature is VALID\n");
        return true;
    } else {
        printf("❌ Signature is INVALID. Error code: %d\n", ret);
        return false;
    }
}

int main() {
    if (generateSignatureAndKey()) {
        verifySignature();
    } else {
        printf("Key/signature generation failed\n");
    }
    return 0;
}
```
</TabItem>

<TabItem value="B" label="Python">
```python
from cryptography.hazmat.primitives.asymmetric import ec
from cryptography.hazmat.primitives import hashes, serialization
from cryptography.hazmat.primitives.asymmetric.utils import encode_dss_signature, decode_dss_signature
from cryptography.exceptions import InvalidSignature
import binascii

# --- Step 1: Generate private/public key pair ---
# This simulates the signing process (in reality, only TigerTag signs data)
private_key = ec.generate_private_key(ec.SECP256R1())
public_key = private_key.public_key()

# Export PEM for display (optional, so you can embed it elsewhere)
public_pem = public_key.public_bytes(
    encoding=serialization.Encoding.PEM,
    format=serialization.PublicFormat.SubjectPublicKeyInfo
)
print("🔐 Public Key PEM:\n", public_pem.decode())

# --- Step 2: Create test UID + block4 + block5 ---
uid_hex = "04AABBCCDDEE1122"  # Sample UID in hex format
uid_bytes = binascii.unhexlify(uid_hex)
block4 = bytes([0x5B, 0xF5, 0x92, 0x64])  # Header block
block5 = bytes([0x00, 0x00, 0x00, 0x00])  # Extra data block
message = uid_bytes + block4 + block5

# --- Step 3: Hash the message ---
digest = hashes.Hash(hashes.SHA256())
digest.update(message)
hashed = digest.finalize()

# --- Step 4: Sign the message hash ---
# This simulates the signature on the TigerTag
signature_der = private_key.sign(hashed, ec.ECDSA(hashes.SHA256()))
r, s = decode_dss_signature(signature_der)
signature_raw = r.to_bytes(32, 'big') + s.to_bytes(32, 'big')  # Stored as raw r+s like on real tag

# --- Step 5: Verification using public key ---
try:
    # Rebuild DER signature from raw format
    r = int.from_bytes(signature_raw[:32], 'big')
    s = int.from_bytes(signature_raw[32:], 'big')
    rebuilt_signature_der = encode_dss_signature(r, s)

    # Verify signature using public key and hash
    public_key.verify(rebuilt_signature_der, hashed, ec.ECDSA(hashes.SHA256()))
    print("✅ Signature is VALID!")
except InvalidSignature:
    print("❌ Signature is INVALID!")
```
</TabItem>
</Tabs>
