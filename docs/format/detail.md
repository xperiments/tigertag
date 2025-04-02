---
sidebar_position: 2
---

# Format Specs

## TigerTagID

**Type:** `uint32_t`

This 4-byte value is a version signature that identifies the type and version of the TigerTag. The ID is matched against the `/version/get/all` API to retrieve metadata like version name, tag, and public key.

[https://api.tigertag.io/api:tigertag#/version/get_version_get_all](https://api.tigertag.io/api:tigertag#/version/get_version_get_all)

```json title="/version/get/all"
{
  "id": 1816240865,
  "version": "1.0",
  "name": "TigerTag Init V1.0",
  "tag": "TIGER_TAG_INIT",
  "public_key": "-----BEGIN PUBLIC KEY-----\n...."
}
```

## ProductID

**Type:** `uint8_t[4]`

A 4-byte numeric SKU that uniquely identifies the spool's product variant. Details about the SKU can be retrieved using the `/product/filament/get` API.

[https://api.tigertag.io/api:tigertag#/product/get_product_filament_get](https://api.tigertag.io/api:tigertag#/product/get_product_filament_get)

```json title="/product/filament/get"
{
  "created_at": "2025-03-24T10:17:28+00:00",
  "updated_at": null,
  "title": "R3D - ABS - Coffee Color - 1.75 mm - 1000 kg Refill",
  "name": "Coffee Color",
  "brand": "R3D",
  "series": "ABS",
  "sku": "R3DF1EA013",
  "barcode": "6974868565855",
  "filament": {
    "material": "ABS",
    "aspect1": "Basic",
    "aspect2": null,
    "color": "#541D09FF",
    "diameter": "1.75",
    "shore": null,
    "grams": 1000,
    "weight": 1000,
    "refill": true,
    "recycled": false
  },
  "nozzle": {
    "temp_min": 240,
    "temp_max": 280
  },
  "dryer": {
    "temp": 70,
    "time": 8
  },
  "links": {
    "image": "https://sc04.alicdn.com/kf/Hd1c2dfc8ed9a44328fb7fc0d5d6e9496N/225162871/Hd1c2dfc8ed9a44328fb7fc0d5d6e9496N.jpg"
  },
  "metadata": {
    "bambuID": "GFB99",
    "crealityID": "00004"
  }
}
```

## MaterialID

**Type:** `uint16_t`

Identifies the base material (e.g., PLA, ABS) using a 2-byte code. The list of materials is available via `/material/filament/get`. Multiple products can share the same MaterialID.

[https://api.tigertag.io/api:tigertag#/material/get_material_filament_get](https://api.tigertag.io/api:tigertag#/material/get_material_filament_get)

```json title="/material/filament/get"
{
  "id": 5733,
  "label": "TPU for AMS",
  "filled": false,
  "recommended": {
    "nozzleTempMin": 200,
    "nozzleTempMax": 250,
    "dryTemp": 75,
    "dryTime": 8
  },
  "metadata": {
    "bambuID": "GFU02",
    "crealityID": "00005"
  }
}
```

## Aspect1ID & Aspect2ID

**Type:** `uint8_t`

These fields represent mutually exclusive material properties such as texture or additives (e.g., silk, glow, carbon). Values are retrieved from `/material/filament/get`. Only one of the two should be non-zero.

[https://api.tigertag.io/api:tigertag#/material/get_material_filament_get](https://api.tigertag.io/api:tigertag#/material/get_material_filament_get)

```json title="/material/filament/get"
[
  { "id": 21, "label": "Clear" },
  { "id": 24, "label": "Tricolor" },
  { "id": 64, "label": "Glitter" },
  { "id": 91, "label": "Glow in the Dark" }
]
```

## TypeID

**Type:** `uint8_t`

Represents the product category (e.g., filament, resin). Valid values are defined in `/type/get/all`.

[https://api.tigertag.io/api:tigertag#/type/get_type_get_all](https://api.tigertag.io/api:tigertag#/type/get_type_get_all)

```json title="/type/get/all"
[
  { "id": 173, "label": "Resin" },
  { "id": 142, "label": "Filament" }
]
```

## DiameterID

**Type:** `uint8_t`

Specifies filament diameter. Example values include:

- `56`: 1.75 mm
- `221`: 2.85 mm

[https://api.tigertag.io/api:tigertag#/diameter/get_diameter_filament_get_all](https://api.tigertag.io/api:tigertag#/diameter/get_diameter_filament_get_all)

```json title="/diameter/get/all"
[
  { "id": 56, "label": "1.75" },
  { "id": 221, "label": "2.85" }
]
```

## BrandID

**Type:** `uint16_t`

A unique identifier for the brand or manufacturer of the material. Shared across multiple products. Defined in `/brand/get/all`.

[https://api.tigertag.io/api:tigertag#/brand/get_brand_get_all](https://api.tigertag.io/api:tigertag#/brand/get_brand_get_all)

```json title="/brand/get/all"
[
  {
    "id": 1120,
    "name": "Proto-Pasta"
  },
  {
    "id": 2517,
    "name": "Smart Materials 3D"
  },
  {
    "id": 2833,
    "name": "Xstrand"
  }
]
```

## Color

**Type:** `uint32_t`

Represents the color in RGBA format:

- Red (byte 0)
- Green (byte 1)
- Blue (byte 2)
- Alpha (byte 3, transparency)

This field is free-form and not bound to a predefined palette.

## Weight

**Type:** `uint32_t`

Stores the spool weight as:

- Bytes 0–2: Numeric weight value (up to 16,777,215)
- Byte 3: Unit (defined in `/measure_unit/get/all`)

[https://api.tigertag.io/api:tigertag#/measure_unit/get_measure_unit_get_all](https://api.tigertag.io/api:tigertag#/measure_unit/get_measure_unit_get_all)

```json title="/measure_unit/get/all"
[
  { "id": 1, "label": "g" },
  { "id": 2, "label": "kg" }
]
```

## TempMin & TempMax

**Type:** `uint16_t`

Define the material's minimum and maximum print temperatures in degrees Celsius.

## DryTemp & DryTime

**Type:** `uint8_t`

Drying temperature and time:

- `DryTemp`: in °C
- `DryTime`: in hours

## ReservedBlock11

**Type:** `uint16_t`

Reserved for future use. Must be initialized to zero.

## TimeStamp

**Type:** `uint32_t`

Stores the time of writing as seconds since `2000-01-01 00:00:00 UTC`.

## ReservedBlock13–15

**Type:** `uint32_t` each

Three 4-byte fields reserved for future expansion. Must be zero-initialized.

## Metadata

**Type:** `uint8_t[32]`

A 32-byte area for user-defined custom data. Not currently used by the TigerTag system. Must be zero-padded if partially filled.

## TTSignature

**Type:** `uint8_t[64]`

A 64-byte ECDSA signature that validates the tag’s contents. The public key for verification is determined based on the `TigerTagID` from `/version/get/all`. Details on the signing algorithm and covered byte range are to be defined.
