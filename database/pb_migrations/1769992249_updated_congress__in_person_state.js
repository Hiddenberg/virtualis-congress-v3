/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_1503732481")

  // add field
  collection.fields.addAt(5, new Field({
    "cascadeDelete": false,
    "collectionId": "pbc_399538795",
    "hidden": false,
    "id": "relation3417015022",
    "maxSelect": 1,
    "minSelect": 0,
    "name": "selectedConference",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "relation"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_1503732481")

  // remove field
  collection.fields.removeById("relation3417015022")

  return app.save(collection)
})
