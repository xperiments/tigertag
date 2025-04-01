---
sidebar_position: 3
---

# TigerTag

This document describes the layout and purpose of each field in the `TigerTagSpoolData` structure. The structure includes identifiers, material specifications, physical properties, and a digital signature for validation.

### Tag Structure

```cpp
/**
 * @brief Represents the TigerTag Spool Data stored in Sector 4 on an NTAG213.
 *
 * This structure encapsulates various pieces of data related to a TigerTag spool,
 * including product and material details, physical properties, and a security signature.
 * It is used to read from or write to sector 4 on an NTAG213.
 */
struct TigerTagSpoolData
{
    /**
     * @brief TigerTag version signature.
     *
     * This 4-byte field acts as a header that identifies the version and type of the TigerTag.
     * It corresponds to a known ID provided by the Tiger API at `/version/get/all`, which includes
     * metadata such as version name, tag label, and the associated public key for signature verification.
     *
     * Examples include:
     * - `1816240865` → TigerTag Init V1.0
     * - `1542820452` → TigerTag Maker V1.0
     * - `3155151767` → TigerTag Pro V1.0
     * - `0`          → TigerTag Uninitialized
     *
     * This ID is essential to determine the correct public key for validating the tag's signature
     * and to ensure compatibility with the reader’s parser.
     */
    uint32_t TigerTagID;

    /**
     * @brief Product SKU Identifier.
     *
     * A 4-byte numeric SKU that uniquely identifies the specific product or spool variant.
     * This SKU can be looked up using the Tiger API at `/product/filament/get` to retrieve
     * details such as material type, brand, color, and compatible print settings.
     *
     * This field is fixed in purpose and will always represent the product's SKU.
     */
    uint8_t ProductID[4];

    /**
     * @brief Material Type Identifier.
     *
     * A 2-byte numeric code that identifies the base material type of the spool,
     * such as PLA, ABS, PETG, etc. Each material type has a unique ID defined
     * in the Tiger API at `/material/filament/get`.
     *
     * Multiple product SKUs may reference the same MaterialID if they share
     * the same base material.
     */
    uint16_t MaterialID;

    /**
     * @brief Primary Material Aspect Identifier.
     *
     * A 1-byte code representing a specific property or additive in the material,
     * such as silk finish, matte texture, glow-in-the-dark, or carbon fiber.
     * The list of available aspects is defined in the Tiger API at `/material/filament/get`.
     *
     * This field is mutually exclusive with `Aspect2ID`, meaning only one aspect
     * (either `Aspect1ID` or `Aspect2ID`) should be non-zero at a time.
     */
    uint8_t Aspect1ID;

    /**
     * @brief Secondary Material Aspect Identifier.
     *
     * Functions the same as `Aspect1ID`, providing an alternative slot for mutually exclusive
     * material aspect encoding. Only one of the two fields should be set at a time.
     *
     * Like `Aspect1ID`, valid values are defined in the Tiger API at `/material/filament/get`.
     */
    uint8_t Aspect2ID;

    /**
     * @brief Product Type Identifier.
     *
     * A 1-byte numeric value representing the general type of product, such as
     * filament, resin, or other printable materials. This type categorization
     * helps distinguish processing profiles and machine compatibility.
     *
     * Valid values are retrieved from the Tiger API at `/type/get/all`.
     */
    uint8_t TypeID;

    /**
     * @brief Filament Diameter Identifier.
     *
     * A 1-byte numeric code that indicates the diameter of the filament.
     * Common values include:
     * - `56`  → 1.75 mm
     * - `221` → 2.85 mm
     *
     * The full list of valid diameters and their IDs can be retrieved from
     * the Tiger API at `/diameter/get/all`.
     */
    uint8_t DiameterID;

    /**
     * @brief Brand Identifier.
     *
     * A 2-byte numeric code that represents the manufacturer or brand of the material,
     * such as eSUN, Polymaker, or Anycubic. This value helps associate spools with
     * vendor-specific quality and print profiles.
     *
     * All valid brand IDs are available through the Tiger API at `/brand/get/all`.
     * Multiple products may reference the same BrandID.
     */
    uint16_t BrandID;

    /**
     * @brief Color (RGBA).
     *
     * A 4-byte value representing the spool’s color in RGBA format:
     * - Red:   Byte 0 (0–255)
     * - Green: Byte 1 (0–255)
     * - Blue:  Byte 2 (0–255)
     * - Alpha: Byte 3 (0–255), used to express transparency (0 = fully transparent, 255 = fully opaque)
     *
     * This field is not linked to any predefined color palette or API.
     * It allows flexible color encoding for both display and filtering purposes.
     */
    uint32_t Color;

    /**
     * @brief Spool Weight.
     *
     * A 4-byte field representing the total weight of the spool, split as follows:
     * - **Bytes 0–2**: A 24-bit unsigned integer storing the numeric weight value.
     * - **Byte 3**: A unit code (e.g., grams, kilograms), retrieved from the Tiger API at `/measure_unit/get/all`.
     *
     * This format supports weights up to `16,777,215` in the chosen unit.
     * All 3 numeric bytes are stored as raw binary (not encoded or compressed).
     */
    uint32_t Weight;

    /**
     * @brief Minimum Print Temperature (°C).
     *
     * A 16-bit unsigned integer specifying the lowest recommended printing temperature
     * for the material, in degrees Celsius.
     */
    uint16_t TempMin;

    /**
     * @brief Maximum Print Temperature (°C).
     *
     * A 16-bit unsigned integer specifying the highest recommended printing temperature
     * for the material, in degrees Celsius.
     */
    uint16_t TempMax;

    /**
     * @brief Drying Temperature (°C).
     *
     * A 1-byte value specifying the recommended drying temperature for the material,
     * expressed in degrees Celsius.
     */
    uint8_t DryTemp;

    /**
     * @brief Drying Time (hours).
     *
     * A 1-byte value specifying the recommended drying duration for the material,
     * expressed in hours.
     */
    uint8_t DryTime;

    /**
     * @brief Reserved Bytes (Block 11).
     *
     * A 2-byte field reserved for future use. Currently unused and should be set to zero.
     */
    uint16_t ReservedBlock11;

    /**
     * @brief Data Timestamp.
     *
     * A 4-byte value representing the time the data was written to the tag,
     * expressed as the number of seconds since `2000-01-01 00:00:00 UTC`.
     *
     * This timestamp can be used to track freshness, validate expiration policies,
     * or determine when the spool was last programmed.
     */
    uint32_t TimeStamp;

    /**
     * @brief Reserved Bytes (Block 13).
     *
     * A 4-byte field reserved for future use. Must be initialized to zero.
     */
    uint32_t ReservedBlock13;

    /**
     * @brief Reserved Bytes (Block 14).
     *
     * A 4-byte field reserved for future use. Must be initialized to zero.
     */
    uint32_t ReservedBlock14;

    /**
     * @brief Reserved Bytes (Block 15).
     *
     * A 4-byte field reserved for future use. Must be initialized to zero.
     */
    uint32_t ReservedBlock15;

    /**
     * @brief Free Metadata Area.
     *
     * A 32-byte user-defined region reserved for additional data or future extensions.
     * This area can store custom spool-specific values, flags, or temporary markers.
     *
     * Currently, it is not used by the TigerTag system itself.
     * If not fully utilized, the remaining bytes should be zero-padded.
     */
    uint8_t Metadata[32];

    /**
     * @brief TigerTag Security Signature (ECDSA).
     *
     * A 64-byte ECDSA signature used to ensure the authenticity and integrity of the tag’s data.
     * The signature is verified using a public key associated with the `TigerTagID`, retrieved
     * via the Tiger API (e.g., from `/version/get/all`).
     *
     * The specific signing algorithm and covered data range will be defined later.
     */
    uint8_t TTSignature[64];
};

```
