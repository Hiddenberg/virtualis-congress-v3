/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_1801945844")

  // add field
  collection.fields.addAt(7, new Field({
    "hidden": false,
    "id": "bool2557182262",
    "name": "isBlackListed",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "bool"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_1801945844")

  // remove field
  collection.fields.removeById("bool2557182262")

  return app.save(collection)
})
