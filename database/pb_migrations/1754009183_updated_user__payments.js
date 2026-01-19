/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_1813587489")

  // add field
  collection.fields.addAt(5, new Field({
    "hidden": false,
    "id": "date2946730800",
    "max": "",
    "min": "",
    "name": "fulfilledAt",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "date"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_1813587489")

  // remove field
  collection.fields.removeById("date2946730800")

  return app.save(collection)
})
