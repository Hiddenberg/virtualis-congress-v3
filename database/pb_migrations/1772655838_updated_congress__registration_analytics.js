/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_1102503534")

  // update collection data
  unmarshal({
    "indexes": [
      "CREATE UNIQUE INDEX `idx_PoKzuEuqns` ON `congress__registration_analytics` (\n  `organization`,\n  `congress`,\n  `user`\n)"
    ]
  }, collection)

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_1102503534")

  // update collection data
  unmarshal({
    "indexes": []
  }, collection)

  return app.save(collection)
})
