/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_1503474209")

  // add field
  collection.fields.addAt(4, new Field({
    "hidden": false,
    "id": "bool2664025650",
    "name": "fixed",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "bool"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_1503474209")

  // remove field
  collection.fields.removeById("bool2664025650")

  return app.save(collection)
})
