/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_2754935733")

  // update field
  collection.fields.addAt(4, new Field({
    "cascadeDelete": true,
    "collectionId": "_pb_users_auth_",
    "hidden": true,
    "id": "relation2375276105",
    "maxSelect": 1,
    "minSelect": 0,
    "name": "user_old",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "relation"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_2754935733")

  // update field
  collection.fields.addAt(4, new Field({
    "cascadeDelete": true,
    "collectionId": "_pb_users_auth_",
    "hidden": true,
    "id": "relation2375276105",
    "maxSelect": 1,
    "minSelect": 0,
    "name": "user_old",
    "presentable": false,
    "required": true,
    "system": false,
    "type": "relation"
  }))

  return app.save(collection)
})
