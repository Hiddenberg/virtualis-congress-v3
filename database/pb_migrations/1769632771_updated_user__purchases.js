/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_785628061")

  // add field
  collection.fields.addAt(6, new Field({
    "hidden": false,
    "id": "bool1693039517",
    "name": "wasCustomPrice",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "bool"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_785628061")

  // remove field
  collection.fields.removeById("bool1693039517")

  return app.save(collection)
})
