/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_3858085117")

  // update field
  collection.fields.addAt(11, new Field({
    "hidden": false,
    "id": "date60179772",
    "max": "",
    "min": "",
    "name": "invitationEmailOpenedAt",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "date"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_3858085117")

  // update field
  collection.fields.addAt(11, new Field({
    "hidden": false,
    "id": "date60179772",
    "max": "",
    "min": "",
    "name": "invitationOpenedAt",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "date"
  }))

  return app.save(collection)
})
