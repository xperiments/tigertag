---
sidebar_position: 8
---

# API Reference

Welcome to the **TigerTag API**!  
Our API is fully documented and described using the **OpenAPI (Swagger)** specification, which ensures it's:

- **Machine-readable** and human-friendly
- **Easy to explore**, test, and validate
- **Ready for auto-generated client/server code**

You can find the OpenAPI definition at:  
**[https://api.tigertag.io/api:tigertag](https://api.tigertag.io/api:tigertag)**  
This file provides a complete blueprint of all endpoints, request/response formats, authentication, and available operations within the TigerTag platform.

---

### Why Swagger / OpenAPI?

We use **Swagger (OpenAPI)** for several key reasons:

- **Standardization**: It's the most widely adopted specification for REST APIs.
- **Developer Experience**: Devs can use tools like Swagger UI or Postman to easily interact with the API.
- **Code Generation**: Auto-generate client libraries in many languages to save time and avoid manual boilerplate code.
- **Documentation Sync**: API docs always reflect the actual backend logic — no outdated docs.

---

### ⚙️ Client Code Generators

Using the [OpenAPI Generator](https://openapi-generator.tech/), you can generate ready-to-use client code for many languages. Below are some popular options:

#### 1. **JavaScript / TypeScript (Axios)**

Generate a TypeScript client that uses **Axios** under the hood:

```bash
openapi-generator-cli generate -i https://api.tigertag.io/api:tigertag -g typescript-axios -o ./tigertag-axios-client
```

🔗 Docs: [TypeScript Axios Generator](https://openapi-generator.tech/docs/generators/typescript-axios)

---

#### 2. **C++**

For native integration in C++ projects:

```bash
openapi-generator-cli generate -i https://api.tigertag.io/api:tigertag -g cpp-restsdk -o ./tigertag-cpp-client
```

🔗 Docs: [C++ REST SDK Generator](https://openapi-generator.tech/docs/generators/cpp-restsdk)

---

#### 3. **Python**

To use the API in Python projects:

```bash
openapi-generator-cli generate -i https://api.tigertag.io/api:tigertag -g python -o ./tigertag-python-client
```

🔗 Docs: [Python Generator](https://openapi-generator.tech/docs/generators/python)

---

### 🚀 Getting Started

To use any of the above, install the OpenAPI generator CLI tool:

```bash
npm install @openapitools/openapi-generator-cli -g
```

Or follow the official installation guide:  
📘 [Install OpenAPI Generator](https://openapi-generator.tech/docs/installation/)
