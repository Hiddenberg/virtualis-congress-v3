/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_349178817")

  // update collection data
  unmarshal({
    "indexes": [
      "CREATE UNIQUE INDEX `idx_4XscgKnRSL` ON `congress_conferences_old` (`startTime`)",
      "CREATE UNIQUE INDEX `idx_DDyZhrzVhF` ON `congress_conferences_old` (`endTime`)"
    ],
    "name": "congress_conferences_old"
  }, collection)

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_349178817")

  // update collection data
  unmarshal({
    "indexes": [
      "CREATE UNIQUE INDEX `idx_4XscgKnRSL` ON `congress_conferences` (`startTime`)",
      "CREATE UNIQUE INDEX `idx_DDyZhrzVhF` ON `congress_conferences` (`endTime`)"
    ],
    "name": "congress_conferences"
  }, collection)

  return app.save(collection)
})
