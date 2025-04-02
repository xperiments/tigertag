---
sidebar_position: 3
---

# Online Data

Below is a single, comprehensive document explaining Tigertag’s offline (RFID) data structure, its corresponding online JSON data, and how external references (like _Bambu Lab_ and _Creality_) utilize these IDs.

---

## 1. Overview of Tigertag Data Storage

Tigertag manages filament information in two complementary ways:

1. **Offline (RFID Chip)**: Essential spool data is stored on the physical RFID chip embedded in each spool. This ensures that critical information—such as the product identifier (SKU), material codes, weight, and recommended print temperatures—is readily available even without internet access.

2. **Online Endpoint**: Tigertag provides a web-based API endpoint that can return richer and potentially _updated_ data in JSON format. By querying the endpoint (e.g., via the SKU found on the RFID chip), users or software can retrieve more detailed attributes, images, or brand references.

This dual approach delivers permanent, offline-critical data while allowing flexible and up-to-date online information.

---

## 2. Offline Data Structure (RFID Chip)

Refer to [TigerTag Data Format Documentation](/docs/format/) for more details on the data structure and usage guidelines.

### Why Store Data on the RFID Chip?

1. **Offline Accessibility**: Any reader device can scan the spool and instantly retrieve _critical_ parameters (material type, recommended temperatures, spool weight) without internet.
2. **Security & Authenticity**: The embedded ECDSA signature helps confirm the spool data hasn’t been tampered with.
3. **Minimal Footprint**: NFC chips have limited storage, so only essential fields are included.

---

## 3. Online JSON Data

By using identifiers from the RFID chip—commonly the SKU—Tigertag’s online service provides a more extensive JSON payload.

You can retrieve it from [https://api.tigertag.io/product/filament/get](https://api.tigertag.io/product/filament/get) by providing parameters `uid` and `product_id`.

Below is an example:

```json
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

### Explanation of Key Fields

- **created_at / updated_at**: ISO 8601 timestamps indicating when this spool record was created or last modified.
- **title**: A descriptive title including brand, material, color, diameter, and spool weight.
- **name**: The spool’s color or short name.
- **brand / series**: Textual identifiers for brand (e.g., “R3D”) and series/product line (e.g., “ABS”).
- **sku**: A unique string that identifies the spool. Matches the _ProductID_ in the offline data.
- **barcode**: A numeric barcode for physical scanning or retail.

**filament (Object)**

- **material**: The base filament material (e.g., “ABS”).
- **aspect1 / aspect2**: Material subtypes (e.g., “Basic”, “Matte”).
- **color**: RGBA color in hex format (e.g., “#541D09FF”).
- **diameter**: Filament diameter in mm (e.g., “1.75”).
- **grams / weight**: The net weight of the filament.
- **refill**: Indicates if this is a spool refill (without a spool holder).
- **recycled**: Whether the filament is made from recycled materials.

**nozzle (Object)**

- **temp_min / temp_max**: Recommended printing temperature range in °C.

**dryer (Object)**

- **temp / time**: Recommended drying temperature and duration in hours.

**links (Object)**

- **image**: A URL to a spool or product image.

**metadata (Object)**

- **bambuID**: A unique reference recognized by Bambu Lab’s ecosystem for spool identification and automatic print settings.
- **crealityID**: A parallel reference for Creality’s platforms.

---

## 4. Why Both Offline and Online Data?

1. **Offline Reliability**: The physical NFC chip ensures you have a _baseline_ set of spool data (material codes, weight, essential print temps) even if you are not connected to the internet.
2. **Security & Authenticity**: The spool data is digitally signed (ECDSA) to guarantee integrity.
3. **Rich, Updateable Metadata**: Many details (like brand name changes, newly recommended settings, or product images) can be kept current online without rewriting the RFID chip.
4. **Cross-Platform References**: Data like _bambuID_ or _crealityID_ can be maintained and updated online, enabling spool recognition in different 3D printer ecosystems.
