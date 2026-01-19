/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_3866520605")

  // update field
  collection.fields.addAt(4, new Field({
    "hidden": false,
    "id": "date1538108716",
    "max": "",
    "min": "",
    "name": "sentAt",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "date"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_3866520605")

  // update field
  collection.fields.addAt(4, new Field({
    "hidden": false,
    "id": "date1538108716",
    "max": "",
    "min": "",
    "name": "sentAt",
    "presentable": false,
    "required": true,
    "system": false,
    "type": "date"
  }))

  return app.save(collection)
})
