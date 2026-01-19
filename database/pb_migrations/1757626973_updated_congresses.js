/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_3334691818")

  // add field
  collection.fields.addAt(6, new Field({
    "hidden": false,
    "id": "select813271232",
    "maxSelect": 1,
    "name": "modality",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "select",
    "values": [
      "online",
      "hybrid"
    ]
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_3334691818")

  // remove field
  collection.fields.removeById("select813271232")

  return app.save(collection)
})
