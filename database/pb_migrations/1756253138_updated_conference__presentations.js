/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_1748391258")

  // add field
  collection.fields.addAt(2, new Field({
    "cascadeDelete": false,
    "collectionId": "pbc_3334691818",
    "hidden": false,
    "id": "relation492890661",
    "maxSelect": 1,
    "minSelect": 0,
    "name": "congress",
    "presentable": false,
    "required": true,
    "system": false,
    "type": "relation"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_1748391258")

  // remove field
  collection.fields.removeById("relation492890661")

  return app.save(collection)
})
