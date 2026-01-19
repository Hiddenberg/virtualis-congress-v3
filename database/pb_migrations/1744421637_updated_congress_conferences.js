/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_349178817")

  // update field
  collection.fields.addAt(9, new Field({
    "hidden": false,
    "id": "select159719665",
    "maxSelect": 1,
    "name": "conferenceType",
    "presentable": false,
    "required": true,
    "system": false,
    "type": "select",
    "values": [
      "individual",
      "group",
      "live",
      "closing_conference"
    ]
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_349178817")

  // update field
  collection.fields.addAt(9, new Field({
    "hidden": false,
    "id": "select159719665",
    "maxSelect": 1,
    "name": "conferenceType",
    "presentable": false,
    "required": true,
    "system": false,
    "type": "select",
    "values": [
      "individual",
      "group",
      "live"
    ]
  }))

  return app.save(collection)
})
