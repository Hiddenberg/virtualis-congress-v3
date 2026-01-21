/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_4045216800")

  // update collection data
  unmarshal({
    "name": "congress__product__prices"
  }, collection)

  // remove field
  collection.fields.removeById("select29867064")

  // add field
  collection.fields.addAt(3, new Field({
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

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_4045216800")

  // update collection data
  unmarshal({
    "name": "congress__prices"
  }, collection)

  // add field
  collection.fields.addAt(6, new Field({
    "hidden": false,
    "id": "select29867064",
    "maxSelect": 1,
    "name": "accessType",
    "presentable": false,
    "required": true,
    "system": false,
    "type": "select",
    "values": [
      "virtual",
      "in_person"
    ]
  }))

  // remove field
  collection.fields.removeById("relation3544843437")

  return app.save(collection)
})
