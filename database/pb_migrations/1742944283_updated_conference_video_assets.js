/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_2668413169")

  // update field
  collection.fields.addAt(6, new Field({
    "hidden": false,
    "id": "select2602444009",
    "maxSelect": 1,
    "name": "videoType",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "select",
    "values": [
      "camera",
      "screen",
      "combined",
      "other"
    ]
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_2668413169")

  // update field
  collection.fields.addAt(6, new Field({
    "hidden": false,
    "id": "select2602444009",
    "maxSelect": 1,
    "name": "videoType",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "select",
    "values": [
      "camera",
      "screen",
      "other"
    ]
  }))

  return app.save(collection)
})
