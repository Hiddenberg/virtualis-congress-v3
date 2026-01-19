/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_4139004309")

  // update field
  collection.fields.addAt(6, new Field({
    "hidden": false,
    "id": "select3842352347",
    "maxSelect": 1,
    "name": "registrationType",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "select",
    "values": [
      "regular",
      "courtesy"
    ]
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_4139004309")

  // update field
  collection.fields.addAt(6, new Field({
    "hidden": false,
    "id": "select3842352347",
    "maxSelect": 1,
    "name": "registrationType",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "select",
    "values": [
      "regular",
      "courtesy_guest"
    ]
  }))

  return app.save(collection)
})
