/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_102036695")

  // add field
  collection.fields.addAt(8, new Field({
    "cascadeDelete": true,
    "collectionId": "pbc_399538795",
    "hidden": false,
    "id": "relation24340858322",
    "maxSelect": 1,
    "minSelect": 0,
    "name": "conference",
    "presentable": false,
    "required": true,
    "system": false,
    "type": "relation"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_102036695")

  // remove field
  collection.fields.removeById("relation24340858322")

  return app.save(collection)
})
