/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_2358739010")

  // add field
  collection.fields.addAt(5, new Field({
    "hidden": false,
    "id": "select1554886047",
    "maxSelect": 1,
    "name": "attendantType",
    "presentable": false,
    "required": true,
    "system": false,
    "type": "select",
    "values": [
      "regular",
      "courtesy_guest"
    ]
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_2358739010")

  // remove field
  collection.fields.removeById("select1554886047")

  return app.save(collection)
})
