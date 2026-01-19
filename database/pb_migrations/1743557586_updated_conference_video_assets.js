/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_2668413169")

  // add field
  collection.fields.addAt(7, new Field({
    "hidden": false,
    "id": "select3788841698",
    "maxSelect": 1,
    "name": "muxAssetStatus",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "select",
    "values": [
      "preparing",
      "ready",
      "errored"
    ]
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_2668413169")

  // remove field
  collection.fields.removeById("select3788841698")

  return app.save(collection)
})
