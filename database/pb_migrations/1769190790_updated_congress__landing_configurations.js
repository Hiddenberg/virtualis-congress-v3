/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_4007561746")

  // add field
  collection.fields.addAt(4, new Field({
    "hidden": false,
    "id": "json2122912756",
    "maxSize": 0,
    "name": "additionalIconURLS",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "json"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_4007561746")

  // remove field
  collection.fields.removeById("json2122912756")

  return app.save(collection)
})
