/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_102036695")

  // remove field
  collection.fields.removeById("relation2434085832")

  // remove field
  collection.fields.removeById("relation2375276105")

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_102036695")

  // add field
  collection.fields.addAt(2, new Field({
    "cascadeDelete": true,
    "collectionId": "pbc_349178817",
    "hidden": true,
    "id": "relation2434085832",
    "maxSelect": 1,
    "minSelect": 0,
    "name": "conference_old",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "relation"
  }))

  // add field
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
})
