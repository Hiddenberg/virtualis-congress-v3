/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_4045216800")

  // update field
  collection.fields.addAt(5, new Field({
    "hidden": false,
    "id": "select1767278655",
    "maxSelect": 1,
    "name": "currency",
    "presentable": false,
    "required": true,
    "system": false,
    "type": "select",
    "values": [
      "mxn",
      "usd"
    ]
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_4045216800")

  // update field
  collection.fields.addAt(5, new Field({
    "hidden": false,
    "id": "select1767278655",
    "maxSelect": 1,
    "name": "currency",
    "presentable": false,
    "required": true,
    "system": false,
    "type": "select",
    "values": [
      "MXN",
      "USD"
    ]
  }))

  return app.save(collection)
})
