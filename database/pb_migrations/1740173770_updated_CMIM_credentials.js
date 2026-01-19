/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_162798418")

  // update collection data
  unmarshal({
    "name": "cmim_credentials"
  }, collection)

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_162798418")

  // update collection data
  unmarshal({
    "name": "CMIM_credentials"
  }, collection)

  return app.save(collection)
})
