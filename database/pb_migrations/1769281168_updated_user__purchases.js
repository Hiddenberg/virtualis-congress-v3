/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_785628061")

  // remove field
  collection.fields.removeById("select2175317490")

  // add field
  collection.fields.addAt(4, new Field({
    "cascadeDelete": false,
    "collectionId": "pbc_1782959257",
    "hidden": false,
    "id": "relation3544843437",
    "maxSelect": 1,
    "minSelect": 0,
    "name": "product",
    "presentable": false,
    "required": true,
    "system": false,
    "type": "relation"
  }))

  // add field
  collection.fields.addAt(5, new Field({
    "cascadeDelete": false,
    "collectionId": "pbc_4045216800",
    "hidden": false,
    "id": "relation3402113753",
    "maxSelect": 1,
    "minSelect": 0,
    "name": "price",
    "presentable": false,
    "required": true,
    "system": false,
    "type": "relation"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_785628061")

  // add field
  collection.fields.addAt(4, new Field({
    "hidden": false,
    "id": "select2175317490",
    "maxSelect": 1,
    "name": "productType",
    "presentable": false,
    "required": true,
    "system": false,
    "type": "select",
    "values": [
      "virtual_congress",
      "in-person_congress",
      "recordings_access"
    ]
  }))

  // remove field
  collection.fields.removeById("relation3544843437")

  // remove field
  collection.fields.removeById("relation3402113753")

  return app.save(collection)
})
