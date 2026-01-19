/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_1801945844")

  // update collection data
  unmarshal({
    "createRule": "@request.auth.role = \"super_admin\"",
    "deleteRule": "@request.auth.role = \"super_admin\"",
    "listRule": "@request.auth.role = \"super_admin\"",
    "updateRule": "@request.auth.role = \"super_admin\"",
    "viewRule": "@request.auth.role = \"super_admin\""
  }, collection)

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_1801945844")

  // update collection data
  unmarshal({
    "createRule": null,
    "deleteRule": null,
    "listRule": null,
    "updateRule": null,
    "viewRule": null
  }, collection)

  return app.save(collection)
})
