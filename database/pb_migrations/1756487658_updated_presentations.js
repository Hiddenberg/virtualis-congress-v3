/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_2611435116")

  // add field
  collection.fields.addAt(4, new Field({
    "hidden": false,
    "id": "bool3179241068",
    "name": "hasVideo",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "bool"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_2611435116")

  // remove field
  collection.fields.removeById("bool3179241068")

  return app.save(collection)
})
