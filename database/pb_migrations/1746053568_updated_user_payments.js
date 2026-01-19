/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_1818968643")

  // update collection data
  unmarshal({
    "indexes": [
      "CREATE INDEX `idx_Tny7sfGDK6` ON `user_payments` (`user`)"
    ]
  }, collection)

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_1818968643")

  // update collection data
  unmarshal({
    "indexes": []
  }, collection)

  return app.save(collection)
})
