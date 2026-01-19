/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_3858085117")

  // add field
  collection.fields.addAt(13, new Field({
    "hidden": false,
    "id": "date60179772",
    "max": "",
    "min": "",
    "name": "openedAt",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "date"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_3858085117")

  // remove field
  collection.fields.removeById("date60179772")

  return app.save(collection)
})
