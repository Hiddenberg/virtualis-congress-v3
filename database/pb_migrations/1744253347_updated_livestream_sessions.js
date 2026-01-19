/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_3891906640")

  // add field
  collection.fields.addAt(6, new Field({
    "hidden": false,
    "id": "select2499258195",
    "maxSelect": 1,
    "name": "attendantStatus",
    "presentable": false,
    "required": true,
    "system": false,
    "type": "select",
    "values": [
      "scheduled",
      "preparing",
      "streaming",
      "paused",
      "ended",
      "canceled",
      "skipped",
      "moved_to_zoom"
    ]
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_3891906640")

  // remove field
  collection.fields.removeById("select2499258195")

  return app.save(collection)
})
