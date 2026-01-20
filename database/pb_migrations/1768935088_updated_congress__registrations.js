/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_4139004309")

  // remove field
  collection.fields.removeById("relation1239404105")

  // remove field
  collection.fields.removeById("relation1831371789")

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_4139004309")

  // add field
  collection.fields.addAt(3, new Field({
    "cascadeDelete": true,
    "collectionId": "_pb_users_auth_",
    "hidden": true,
    "id": "relation1239404105",
    "maxSelect": 1,
    "minSelect": 0,
    "name": "userRegistered_old",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "relation"
  }))

  // add field
  collection.fields.addAt(6, new Field({
    "cascadeDelete": false,
    "collectionId": "pbc_1818968643",
    "hidden": true,
    "id": "relation1831371789",
    "maxSelect": 1,
    "minSelect": 0,
    "name": "payment_old",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "relation"
  }))

  return app.save(collection)
})
