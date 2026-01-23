/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_4007561746")

  // update collection data
  unmarshal({
    "indexes": [
      "CREATE UNIQUE INDEX `idx_BPANLeMRLg` ON `congress__landing_configurations` (\n  `organization`,\n  `congress`\n)"
    ]
  }, collection)

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_4007561746")

  // update collection data
  unmarshal({
    "indexes": []
  }, collection)

  return app.save(collection)
})
