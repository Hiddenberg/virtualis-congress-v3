/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_382459631")

  // add field
  collection.fields.addAt(8, new Field({
    "hidden": false,
    "id": "select208246217",
    "maxSelect": 1,
    "name": "recordingType",
    "presentable": false,
    "required": true,
    "system": false,
    "type": "select",
    "values": [
      "only_camera",
      "camera_and_presentation"
    ]
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_382459631")

  // remove field
  collection.fields.removeById("select208246217")

  return app.save(collection)
})
