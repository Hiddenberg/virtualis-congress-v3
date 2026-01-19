/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_4139004309")

  // update collection data
  unmarshal({
    "indexes": [
      "CREATE UNIQUE INDEX `idx_1mfTdCC1Jv` ON `congress__registrations` (\n  `organization`,\n  `userRegistered`,\n  `congress`\n)"
    ],
    "name": "congress__registrations"
  }, collection)

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_4139004309")

  // update collection data
  unmarshal({
    "indexes": [
      "CREATE UNIQUE INDEX `idx_1mfTdCC1Jv` ON `congress_registrations` (\n  `organization`,\n  `userRegistered`,\n  `congress`\n)"
    ],
    "name": "congress_registrations"
  }, collection)

  return app.save(collection)
})
