/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_3799568309")

  // update field
  collection.fields.addAt(2, new Field({
    "cascadeDelete": true,
    "collectionId": "pbc_2611435116",
    "hidden": false,
    "id": "relation2607212691",
    "maxSelect": 1,
    "minSelect": 0,
    "name": "presentation",
    "presentable": false,
    "required": true,
    "system": false,
    "type": "relation"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_3799568309")

  // update field
  collection.fields.addAt(2, new Field({
    "cascadeDelete": false,
    "collectionId": "pbc_2611435116",
    "hidden": false,
    "id": "relation2607212691",
    "maxSelect": 1,
    "minSelect": 0,
    "name": "presentation",
    "presentable": false,
    "required": true,
    "system": false,
    "type": "relation"
  }))

  return app.save(collection)
})
