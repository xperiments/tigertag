---
sidebar_position: 5
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Code Best Practices

## Best Code Practices for TigerTag

### 1. Working with Limited Resources / Offline (Embedded)

- **Optimize Memory Usage**: Minimize RAM and flash consumption in embedded systems by using compact data structures. Prevent memory leaks or overflows with careful allocation and deallocation.
- **Efficient File Handling**: Keep file operations minimal in both size and frequency. Work with files in manageable chunks and release memory once processing is complete.
- **Non-Blocking Operations**: Use asynchronous I/O or interrupts to handle RFID read/write tasks. Avoid blocking calls that can impede system responsiveness.
- **Offline Mode**: Plan for intermittent connectivity. Cache or store data locally and synchronize once the device is online, preventing disruptions in data flow.
- **Endian Considerations**: Some embedded systems use little endian. Ensure your code consistently accounts for byte ordering in data transfers and memory operations.

### 2. Limiting Database Queries

- **Scheduled Queries**: One good practice is to call all needed queries daily and store that on the developer side. This prevents unnecessary queries to the TigerTag database, reducing traffic and server load.
- **Batch Updates**: Combine database read/write operations into batches to reduce overhead. Be particularly mindful of loops and repeatedly called functions.
- **Caching**: Employ a cache for frequently accessed data. Reduce repeated calls to the database for improved performance.
- **Query Limits**: Set bounds on the number of records returned. This prevents saturating the system’s resources, which is crucial in embedded or resource-limited environments.

### 3. Use Swagger Generators for Simplicity

- **Use Our Provided TigerTag Swagger Definition**: Make use of the official TigerTag Swagger definition to expedite your API development, ensuring alignment with TigerTag’s expected schema and behavior.
- **Error Detection**: Detect mismatches between your API and database schema early. Swagger highlights inconsistencies, making it easier to maintain compatibility when the schema changes.
- **Test API Endpoints**: Take advantage of Swagger’s testing features through its web interface. Quickly verify endpoints and catch potential issues.

## Userful Code

Use this scripts to quickly gather and sort data from the TigerTag API in one step. It looks up endpoints from the Swagger definition, fetches their data (ignoring pagination endpoints), sorts the results, and saves everything into a single JSON file—complete with a date stamp—so you have a clean snapshot of all the “get all” data at once.

<Tabs>
<TabItem value="A" label="NodeJS">

```js title="Caching Database"
import fetch from "node-fetch"; // Import the 'node-fetch' library for making HTTP requests
import fs from "fs"; // Import Node.js filesystem module for reading and writing files

// API endpoint for the Swagger definition

// The URL to fetch the Swagger definition
const SWAGGER_URL = "https://api.tigertag.io/apispec:tigertag?type=json&token=";
// Output path for the generated JSON file
const OUTPUT_DB_JSON = "./tiger-bdd.json";                                      

let endpoints = {};   // In-memory storage for endpoint definitions extracted from Swagger
let endpointData = {}; // Store the actual data fetched from each endpoint

// --- Main fetching functions ---
async function fetchSwaggerDefinition() {
  try {
    // Fetch the Swagger definition from the specified URL
    const response = await fetch(SWAGGER_URL);

    // If the response isn't "OK", throw an error with the status text
    if (!response.ok) {
      throw new Error(`Error fetching Swagger definition: ${response.statusText}`);
    }

    // Parse the Swagger definition JSON
    const swaggerData = await response.json();

    // Extract paths that match certain criteria
    extractGetAllEndpoints(swaggerData);

    // Fetch the data from the discovered endpoints
    await fetchEndpointData();
  } catch (error) {
    // Log any errors if something goes wrong
    console.error("Failed to load Swagger definition:", error);
  }
}

// Extract endpoints containing "/get/all" but not "/by_page"
function extractGetAllEndpoints(swaggerData) {
  // Ensure swaggerData has a 'paths' key
  if (swaggerData.paths) {
    // Convert the paths object into an array of keys, filter to those including "/get/all" 
    // but excluding "/by_page", and rebuild into an object
    endpoints = Object.keys(swaggerData.paths)
      .filter((path) => path.includes("/get/all"))
      .filter((path) => !path.includes("/by_page"))
      .reduce((acc, path) => {
        acc[path] = swaggerData.paths[path];
        return acc;
      }, {});
    console.log("GET ALL endpoints successfully loaded into memory.");
  } else {
    // If no paths exist, log a warning
    console.warn("No paths found in Swagger definition.");
  }
}

// Fetch data from each endpoint, then generate the TypeScript file and base JSON.
async function fetchEndpointData() {
  // Get all endpoint keys from the 'endpoints' object
  const endpointKeys = Object.keys(endpoints);

  // Iterate over each endpoint path
  for (const path of endpointKeys) {
    try {
      // Build the full URL for this endpoint
      const fullUrl = `https://api.tigertag.io/api:tigertag/${path}`;

      // Fetch the data from the endpoint
      const response = await fetch(fullUrl);

      // If the response is not "OK", log a warning and skip
      if (!response.ok) {
        console.warn(`Failed to fetch data from ${path}: ${response.statusText}`);
        continue;
      }

      // Create a key name for storage in 'endpointData' based on the URL path
      let keyPath = path
        .replace("/get/all", "")               // Remove the "/get/all" substring
        .replaceAll("_", "/")                 // Replace underscores with slashes
        .split("/")                           // Split by slash to get individual parts
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1)) // Capitalize the first letter
        .join("_")                            // Rejoin with underscores
        .substring(1)                         // Remove the leading underscore
        .replace(/_/gi, "");                  // Remove remaining underscores

      // Lowercase the first letter of the resulting string
      keyPath = keyPath[0].toLowerCase() + keyPath.slice(1);

      // Parse the fetched response as JSON and store it using the derived key
      endpointData[keyPath] = await response.json();
    } catch (error) {
      // Log any error encountered during the fetch or JSON parsing
      console.error(`Error fetching data from ${path}:`, error);
    }
  }

  // --- Sort each endpoint's data by "label" (if available) or "name" ---
  for (const key in endpointData) {
    // Check if the value is a non-empty array
    if (Array.isArray(endpointData[key]) && endpointData[key].length > 0) {
      // Look at the first object in the array to see if 'label' or 'name' is present
      const sample = endpointData[key][0];
      if (sample.label !== undefined) {
        // Sort by label if it exists
        endpointData[key].sort((a, b) => a.label.localeCompare(b.label));
      } else if (sample.name !== undefined) {
        // Otherwise, sort by name if it exists
        endpointData[key].sort((a, b) => a.name.localeCompare(b.name));
      }
    }
  }

  // After sorting each list, generate the JSON file
  exportBaseJsonFile();
}

// --- JSON File Generation ---
function exportBaseJsonFile() {
  // Get current date in YYYY-MM-DD format for stamping
  const date = new Date();
  const formattedDate = date.toISOString().split("T")[0];

  // Add a 'date' property to the endpointData object
  endpointData["date"] = formattedDate;

  // Write the entire 'endpointData' object to the JSON file, formatted with two spaces
  fs.writeFileSync(OUTPUT_DB_JSON, JSON.stringify(endpointData, null, 2));

  // Log a success message once the file has been written
  console.log("Base JSON file generated successfully at:", OUTPUT_DB_JSON);
}

// Finally, kick off the data fetching process by calling the main function
fetchSwaggerDefinition();

```
</TabItem>
<TabItem value="B" label="Python">
```python

import requests
import json
from datetime import datetime

SWAGGER_URL = "https://api.tigertag.io/apispec:tigertag?type=json&token="
OUTPUT_DB_JSON = "./tiger-bdd.json"

endpoints = {}
endpointData = {}

def fetchSwaggerDefinition():
    """
    Fetch the Swagger definition from SWAGGER_URL and initiate data extraction.
    """
    try:
        response = requests.get(SWAGGER_URL)
        response.raise_for_status()
        swaggerData = response.json()
        
        extractGetAllEndpoints(swaggerData)
        fetchEndpointData()
    except requests.RequestException as err:
        print("Failed to load Swagger definition:", err)

def extractGetAllEndpoints(swaggerData):
    """
    Extract endpoints containing '/get/all' but not '/by_page',
    then store them in the global 'endpoints' dictionary.
    """
    global endpoints
    if 'paths' in swaggerData:
        all_paths = swaggerData['paths'].keys()
        
        filtered_paths = [
            path for path in all_paths 
            if "/get/all" in path and "/by_page" not in path
        ]
        
        endpoints = {path: swaggerData['paths'][path] for path in filtered_paths}
        print("GET ALL endpoints successfully loaded into memory.")
    else:
        print("No paths found in Swagger definition.")

def fetchEndpointData():
    """
    Fetch data from each endpoint in 'endpoints', store sorted results,
    and export them to JSON.
    """
    global endpointData
    for path in endpoints:
        try:
            full_url = f"https://api.tigertag.io/api:tigertag/{path}"
            response = requests.get(full_url)
            if not response.ok:
                print(f"Failed to fetch data from {path}: {response.status_code}")
                continue

            # Convert path into a clean key name
            keyPath = transform_path(path)
            endpointData[keyPath] = response.json()
        except requests.RequestException as err:
            print(f"Error fetching data from {path}:", err)
    
    # Sort each array by 'label' or 'name'
    for key, items in endpointData.items():
        if isinstance(items, list) and items:
            sample = items[0]
            if 'label' in sample:
                items.sort(key=lambda x: x['label'])
            elif 'name' in sample:
                items.sort(key=lambda x: x['name'])
    
    exportBaseJsonFile()

def transform_path(path_str):
    """
    1) Remove '/get/all'
    2) Replace underscores with slashes
    3) Split by slash
    4) Capitalize each part
    5) Join parts with underscores
    6) If the result starts with '_', remove that underscore
    7) Remove all remaining underscores
    8) Lowercase the first letter (or the entire string, as desired)
    """
    # Step 1
    path_str = path_str.replace("/get/all", "")

    # Step 2
    path_str = path_str.replace("_", "/")

    # Step 3
    parts = [p for p in path_str.split("/") if p]

    # Step 4
    capitalized_parts = [part.capitalize() for part in parts]

    # Step 5
    keyPath = "_".join(capitalized_parts)

    # Step 6: If the resulting string starts with an underscore, remove it
    if keyPath.startswith("_"):
        keyPath = keyPath[1:]

    # Step 7: Remove all remaining underscores
    keyPath = keyPath.replace("_", "")

    # Step 8: Lowercase the **first** letter (or remove the [1:] part to fully lowercase)
    if len(keyPath) > 0:
        keyPath = keyPath[0].lower() + keyPath[1:]

    return keyPath

def exportBaseJsonFile():
    """
    Include a date stamp in the endpoint data and write it to OUTPUT_DB_JSON.
    """
    endpointData["date"] = datetime.now().strftime("%Y-%m-%d")
    
    with open(OUTPUT_DB_JSON, "w", encoding="utf-8") as file:
        json.dump(endpointData, file, indent=2)
    
    print("Base JSON file generated successfully at:", OUTPUT_DB_JSON)

if __name__ == "__main__":
    fetchSwaggerDefinition()

```
</TabItem>
</Tabs>