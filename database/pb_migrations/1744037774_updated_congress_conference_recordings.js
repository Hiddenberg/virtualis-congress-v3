/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_3858085117")

  // add field
  collection.fields.addAt(19, new Field({
    "hidden": false,
    "id": "date2383655349",
    "max": "",
    "min": "",
    "name": "startedRecordingAt",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "date"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_3858085117")

  // remove field
  collection.fields.removeById("date2383655349")

  return app.save(collection)
})
