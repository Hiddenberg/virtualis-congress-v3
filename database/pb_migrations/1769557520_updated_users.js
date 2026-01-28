/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_3754236674")

  // add field
  collection.fields.addAt(7, new Field({
    "exceptDomains": [],
    "hidden": false,
    "id": "email624253557",
    "name": "additionalEmail1",
    "onlyDomains": [],
    "presentable": false,
    "required": false,
    "system": false,
    "type": "email"
  }))

  // add field
  collection.fields.addAt(8, new Field({
    "exceptDomains": [],
    "hidden": false,
    "id": "email3158051791",
    "name": "additionalEmail2",
    "onlyDomains": [],
    "presentable": false,
    "required": false,
    "system": false,
    "type": "email"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_3754236674")

  // remove field
  collection.fields.removeById("email624253557")

  // remove field
  collection.fields.removeById("email3158051791")

  return app.save(collection)
})
