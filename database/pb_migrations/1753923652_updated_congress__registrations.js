/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_4139004309")

  // add field
  collection.fields.addAt(8, new Field({
    "hidden": false,
    "id": "select3129009641",
    "maxSelect": 1,
    "name": "attendanceModality",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "select",
    "values": [
      "in-person",
      "virtual"
    ]
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_4139004309")

  // remove field
  collection.fields.removeById("select3129009641")

  return app.save(collection)
})
