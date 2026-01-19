/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_581399240")

  // add field
  collection.fields.addAt(8, new Field({
    "hidden": false,
    "id": "date1314567810",
    "max": "",
    "min": "",
    "name": "redeemedAt",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "date"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_581399240")

  // remove field
  collection.fields.removeById("date1314567810")

  return app.save(collection)
})
