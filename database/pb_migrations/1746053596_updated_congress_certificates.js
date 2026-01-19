/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_1589877031")

  // update collection data
  unmarshal({
    "indexes": [
      "CREATE INDEX `idx_ZaOHvaky9z` ON `congress_certificates` (`user`)"
    ]
  }, collection)

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_1589877031")

  // update collection data
  unmarshal({
    "indexes": []
  }, collection)

  return app.save(collection)
})
