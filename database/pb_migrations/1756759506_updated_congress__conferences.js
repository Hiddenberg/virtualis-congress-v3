/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_399538795")

  // update field
  collection.fields.addAt(7, new Field({
    "hidden": false,
    "id": "select159719665",
    "maxSelect": 1,
    "name": "conferenceType",
    "presentable": false,
    "required": true,
    "system": false,
    "type": "select",
    "values": [
      "in-person",
      "livestream",
      "pre-recorded",
      "simulated_livestream"
    ]
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_399538795")

  // update field
  collection.fields.addAt(7, new Field({
    "hidden": false,
    "id": "select159719665",
    "maxSelect": 1,
    "name": "conferenceType",
    "presentable": false,
    "required": true,
    "system": false,
    "type": "select",
    "values": [
      "in-person",
      "livestream",
      "pre-recorded"
    ]
  }))

  return app.save(collection)
})
