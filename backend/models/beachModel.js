// models/beachModel.js
const https = require("https"),
  packageId = "e36df4b9-f772-49ab-a87b-f90b869b7a44";

// Helper to fetch JSON from any HTTPS URL (follows redirects if needed)
// promise to retrieve the package
const getPackage = new Promise((resolve, reject) => {
  https.get(
    `https://ckan0.cf.opendata.inter.prod-toronto.ca/api/3/action/package_show?id=${packageId}`,
    (response) => {
      let dataChunks = [];
      response
        .on("data", (chunk) => {
          dataChunks.push(chunk);
        })
        .on("end", () => {
          let data = Buffer.concat(dataChunks);
          resolve(JSON.parse(data.toString())["result"]);
        })
        .on("error", (error) => {
          reject(error);
        });
    },
  );
});
const getDatastoreResource = (resource) =>
  new Promise((resolve, reject) => {
    https.get(
      `https://ckan0.cf.opendata.inter.prod-toronto.ca/api/3/action/datastore_search?id=${resource["id"]}`,
      (response) => {
        let dataChunks = [];
        response
          .on("data", (chunk) => {
            dataChunks.push(chunk);
          })
          .on("end", () => {
            let data = Buffer.concat(dataChunks);
            resolve(JSON.parse(data.toString())["result"]["records"]);
          })
          .on("error", (error) => {
            reject(error);
          });
      },
    );
  });

let beachResource;
getPackage
  .then((package) => {
    // get the datastore resources for the package
    let datastoreResources = package["resources"].filter(
      (r) => r.datastore_active,
    );

    // retrieve the first datastore resource as an example
    getDatastoreResource(datastoreResources[0])
      .then((resource) => {
        // this is the actual data of the resource
        beachResource = resource;
      })
      .catch((error) => {
        console.error(error);
      });
  })
  .catch((error) => {
    console.error(error);
  });

function getBeachesResource() {
  return new Promise((resolve, reject) => {
    if (beachResource) {
      resolve(beachResource);
    } else {
      reject(new Error("Beach resource not available yet."));
    }
  });
}

module.exports = {
  getBeachesResource,
};
