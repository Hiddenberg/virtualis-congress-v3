/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_1759142762")

  // remove field
  collection.fields.removeById("number3051925876")

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_1759142762")

  // add field
  collection.fields.addAt(5, new Field({
    "hidden": false,
    "id": "number3051925876",
    "max": null,
    "min": null,
    "name": "capacity",
    "onlyInt": false,
    "presentable": false,
    "required": false,
    "system": false,
    "type": "number"
  }))

  return app.save(collection)
})
