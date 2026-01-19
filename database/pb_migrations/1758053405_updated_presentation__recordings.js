/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_2337034013")

  // add field
  collection.fields.addAt(5, new Field({
    "hidden": false,
    "id": "json316226298",
    "maxSize": 0,
    "name": "drawingEvents",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "json"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_2337034013")

  // remove field
  collection.fields.removeById("json316226298")

  return app.save(collection)
})
