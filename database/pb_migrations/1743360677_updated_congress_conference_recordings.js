/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_3858085117")

  // add field
  collection.fields.addAt(16, new Field({
    "hidden": false,
    "id": "date2878474910",
    "max": "",
    "min": "",
    "name": "reRecordingEmailOpenedAt",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "date"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_3858085117")

  // remove field
  collection.fields.removeById("date2878474910")

  return app.save(collection)
})
