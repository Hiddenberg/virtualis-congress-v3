/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_4045216800")

  // add field
  collection.fields.addAt(11, new Field({
    "hidden": false,
    "id": "bool1877463256",
    "name": "includesRecordings",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "bool"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_4045216800")

  // remove field
  collection.fields.removeById("bool1877463256")

  return app.save(collection)
})
