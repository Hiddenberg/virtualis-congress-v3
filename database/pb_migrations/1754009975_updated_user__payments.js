/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_1813587489")

  // add field
  collection.fields.addAt(4, new Field({
    "hidden": false,
    "id": "select2509816733",
    "maxSelect": 1,
    "name": "checkoutSessionStatus",
    "presentable": false,
    "required": true,
    "system": false,
    "type": "select",
    "values": [
      "open",
      "complete",
      "expired"
    ]
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_1813587489")

  // remove field
  collection.fields.removeById("select2509816733")

  return app.save(collection)
})
