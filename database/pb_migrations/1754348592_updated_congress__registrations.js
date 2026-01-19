/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_4139004309")

  // add field
  collection.fields.addAt(9, new Field({
    "cascadeDelete": false,
    "collectionId": "pbc_1813587489",
    "hidden": false,
    "id": "relation18313717892",
    "maxSelect": 1,
    "minSelect": 0,
    "name": "payment",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "relation"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_4139004309")

  // remove field
  collection.fields.removeById("relation18313717892")

  return app.save(collection)
})
