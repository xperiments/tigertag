---
sidebar_position: 2
---

# Features

## Overview

TigerTag is a hybrid NFC/RFID chip designed to simplify and automate 3D printing filament management. It provides both offline and online functionality, enabling 3D printers and mobile devices to instantly recognize and configure filament spools. Built as an open standard, TigerTag encourages innovation from manufacturers, developers, and makers alike.

## Core Features

### 1. Local Storage

- **Description:**  
  Essential filament data is stored directly on the chip, allowing for reliable, long-term "cold" storage without continuous network connectivity.
- **Use Case:**  
  3D printers can read necessary data directly from the chip even in offline environments.
- **Benefits:**
  - Reliable data access
  - Independence from network availability

### 2. Online Connectivity

- **Description:**  
  TigerTag connects to a cloud service via a free REST API to provide enhanced information such as product images, detailed printing profiles, SKU, EAN codes, and multimedia content.
- **Use Case:**  
  When connected, 3D printers and mobile applications can access up-to-date filament configurations and additional resources.
- **Benefits:**
  - Always up-to-date data
  - Enhanced user experience with richer media and settings

### 3. TigerTag Maker

- **Description:**  
  This feature allows users to create their own Tiger Tags at home using standard NFC chips (e.g., NTAG213).
- **Use Case:**  
  Makers and DIY enthusiasts can convert any filament spool into a Tiger Tag-compatible unit, enabling personalized projects.
- **Benefits:**
  - Customization and personalization
  - Encourages experimentation and innovation

### 4. Custom Data

- **Description:**  
  TigerTag allocates memory for custom data storage:

  - Both **Standard TigerTag** and **TigerTag Pro** provide **32 bytes** for community add-on functions or custom usage.

- **Use Case:**  
  Enables users to store additional, application-specific data on each tag, such as serial numbers, purchase dates, or notes.

- **Benefits:**
  - Flexible data storage options
  - Supports extended functionalities tailored to specific needs

### 5. Security

- **Description:**  
  Each TigerTag includes a unique signature that serves as proof of origin. This signature verifies the authenticity of the filament spool.
- **Use Case:**  
  Manufacturers and resellers can confirm the legitimacy of their products, reducing the risk of counterfeiting.
- **Benefits:**
  - Enhanced trust and reliability
  - Improved protection against counterfeit products

## Developer Resources & Integration

### API & Documentation

- **API Access:**  
  TigerTag provides a free REST API for accessing extended filament information, making real-time data retrieval straightforward for both 3D printers and mobile apps.
- **Documentation:**  
  Comprehensive technical documentation is available, covering integration guidelines, API usage, and best practices. This documentation is open to manufacturers, makers, and developers.
- **Open Standard:**  
  By embracing an open standard, TigerTag supports third-party innovation, allowing developers to create new applications and enhance existing workflows.

### Compatibility

- **3D Printers:**  
  Any NFC-enabled 3D printer can read TigerTag data. Integration is flexible, supporting both offline and online modes as per manufacturer choice.  
  For embedded systems, **XSpool** (based on Arduino + RC522) provides ready-to-use TigerTag integration.

- **Mobile Devices:**  
  TigerTag can be scanned with both Apple and Android smartphones.  
  A **native app** is required on both iOS and Android for full functionality and data interaction.

## Use Cases

### For Filament Manufacturers

- **Increased Visibility:**  
  Unique spool identifiers boost product visibility.
- **Simplified Stock Management:**  
  Automated recognition reduces manual entry errors and streamlines inventory control.
- **Enhanced Customer Loyalty:**  
  Seamless integration with NFC-enabled printers improves user satisfaction.

### For 3D Printer Manufacturers

- **Improved User Experience:**  
  Automatic filament detection reduces setup time and configuration errors.
- **Easy Integration:**  
  Comprehensive API and documentation facilitate quick integration of TigerTag technology.
- **Flexible Functionality:**  
  Support for both online and offline modes caters to varied manufacturing needs.

### For Makers & DIY Enthusiasts

- **Custom Projects:**  
  The TigerTag Maker allows for the creation of custom tags to suit individual project needs.
- **Experimentation:**  
  The open API and documentation foster innovation, making it possible to explore new applications beyond 3D printing (e.g., smart keychains, object tracking).
