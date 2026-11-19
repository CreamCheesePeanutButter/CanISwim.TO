getPackage
  .then((pkg) => {
    // this is the metadata of the package
    // console.log(pkg);
  })
  .catch((error) => {
    console.error(error);
  });
// since this package has resources in the datastore, one can get the data rather than just the metadata of the resources
// promise to retrieve data of a datastore resource

// get the package information again
