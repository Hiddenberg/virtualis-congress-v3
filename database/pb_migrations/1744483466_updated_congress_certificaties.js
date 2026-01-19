/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_1589877031")

  // update collection data
  unmarshal({
    "name": "congress_certificates"
  }, collection)

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_1589877031")

  // update collection data
  unmarshal({
    "name": "congress_certificaties"
  }, collection)

  return app.save(collection)
})
