/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_1589877031")

  // update field
  collection.fields.addAt(5, new Field({
    "hidden": false,
    "id": "select3385206240",
    "maxSelect": 1,
    "name": "certificateType",
    "presentable": false,
    "required": true,
    "system": false,
    "type": "select",
    "values": [
      "attendee",
      "speaker",
      "coordinator"
    ]
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_1589877031")

  // update field
  collection.fields.addAt(5, new Field({
    "hidden": false,
    "id": "select3385206240",
    "maxSelect": 1,
    "name": "certificateType",
    "presentable": false,
    "required": true,
    "system": false,
    "type": "select",
    "values": [
      "attendee",
      "speaker",
      "acp_member"
    ]
  }))

  return app.save(collection)
})
