/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_2358739010")

  // update collection data
  unmarshal({
    "indexes": [
      "CREATE UNIQUE INDEX `idx_PG8JAjtPLv` ON `attendants__additional_data` (\n  `organization`,\n  `user`\n)"
    ],
    "name": "attendants__additional_data"
  }, collection)

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_2358739010")

  // update collection data
  unmarshal({
    "indexes": [
      "CREATE UNIQUE INDEX `idx_PG8JAjtPLv` ON `attendants_data` (\n  `organization`,\n  `user`\n)"
    ],
    "name": "attendants_data"
  }, collection)

  return app.save(collection)
})
