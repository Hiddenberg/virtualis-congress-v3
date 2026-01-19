/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_4139004309")

  // add field
  collection.fields.addAt(10, new Field({
    "hidden": false,
    "id": "bool2866098839",
    "name": "hasAccessToRecordings",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "bool"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_4139004309")

  // remove field
  collection.fields.removeById("bool2866098839")

  return app.save(collection)
})
