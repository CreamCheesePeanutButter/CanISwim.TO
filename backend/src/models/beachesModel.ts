import { BeachDTO } from "../DTOs/beachDTO";
const PACKAGE_ID = "e36df4b9-f772-49ab-a87b-f90b869b7a44";
const BASE_URL = "https://ckan0.cf.opendata.inter.prod-toronto.ca/api/3/action";

interface CkanResource {
  id: string;
  datastore_active: boolean;
  name?: string;
}

interface CkanPackageResponse {
  success: boolean;
  result: {
    resources: CkanResource[];
  };
}

interface CkanDatastoreResponse {
  success: boolean;
  result: {
    records: BeachDTO[];
  };
}

// 2. Helper functions using modern async/await + fetch
async function fetchPackageResources(
  packageId: string,
): Promise<CkanResource[]> {
  const response = await fetch(`${BASE_URL}/package_show?id=${packageId}`);

  if (!response.ok) {
    throw new Error(
      `Failed to fetch package metadata: ${response.status} ${response.statusText}`,
    );
  }

  const data = (await response.json()) as CkanPackageResponse;
  return data.result.resources;
}

async function fetchDatastoreRecords(resourceId: string): Promise<BeachDTO[]> {
  const response = await fetch(`${BASE_URL}/datastore_search?id=${resourceId}`);

  if (!response.ok) {
    throw new Error(
      `Failed to fetch datastore records: ${response.status} ${response.statusText}`,
    );
  }

  const data = (await response.json()) as CkanDatastoreResponse;
  return data.result.records;
}

// 3. Cache the promise to avoid race conditions and redundant API calls
let cachedBeachesPromise: Promise<BeachDTO[]> | null = null;

async function loadBeachesData(): Promise<BeachDTO[]> {
  const resources = await fetchPackageResources(PACKAGE_ID);
  const datastoreResources = resources.filter((r) => r.datastore_active);

  if (datastoreResources.length === 0) {
    throw new Error(
      "No active datastore resources found for Toronto beaches package.",
    );
  }

  return fetchDatastoreRecords(datastoreResources[0].id);
}

// 4. Exported model function
export async function getBeachesResource(): Promise<BeachDTO[]> {
  if (!cachedBeachesPromise) {
    cachedBeachesPromise = loadBeachesData().catch((error) => {
      // Reset cache on failure so future requests can retry
      cachedBeachesPromise = null;
      throw error;
    });
  }

  return cachedBeachesPromise;
}
