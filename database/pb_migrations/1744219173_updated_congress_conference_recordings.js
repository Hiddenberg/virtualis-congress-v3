/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_3858085117")

  // add field
  collection.fields.addAt(20, new Field({
    "hidden": false,
    "id": "bool2851771845",
    "name": "durationUpdated",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "bool"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_3858085117")

  // remove field
  collection.fields.removeById("bool2851771845")

  return app.save(collection)
})
