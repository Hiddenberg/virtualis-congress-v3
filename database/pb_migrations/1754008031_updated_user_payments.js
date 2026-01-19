/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_1818968643")

  // update collection data
  unmarshal({
    "indexes": [
      "CREATE INDEX `idx_Tny7sfGDK6` ON `user_payments_old` (`user`)"
    ],
    "name": "user_payments_old"
  }, collection)

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_1818968643")

  // update collection data
  unmarshal({
    "indexes": [
      "CREATE INDEX `idx_Tny7sfGDK6` ON `user_payments` (`user`)"
    ],
    "name": "user_payments"
  }, collection)

  return app.save(collection)
})
