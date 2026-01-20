/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_581399240")

  // remove field
  collection.fields.removeById("relation2908488263")

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_581399240")

  // add field
  collection.fields.addAt(5, new Field({
    "cascadeDelete": false,
    "collectionId": "_pb_users_auth_",
    "hidden": false,
    "id": "relation2908488263",
    "maxSelect": 1,
    "minSelect": 0,
    "name": "userWhoRedeemed",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "relation"
  }))

  return app.save(collection)
})
