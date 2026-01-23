/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_4007561746")

  // update field
  collection.fields.addAt(3, new Field({
    "hidden": false,
    "id": "select1136344659",
    "maxSelect": 1,
    "name": "colorScheme",
    "presentable": false,
    "required": true,
    "system": false,
    "type": "select",
    "values": [
      "green",
      "blue",
      "purple"
    ]
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_4007561746")

  // update field
  collection.fields.addAt(3, new Field({
    "hidden": false,
    "id": "select1136344659",
    "maxSelect": 1,
    "name": "colorScheme",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "select",
    "values": [
      "green",
      "blue",
      "purple"
    ]
  }))

  return app.save(collection)
})
