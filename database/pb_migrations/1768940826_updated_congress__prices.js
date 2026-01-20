/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_4045216800")

  // add field
  collection.fields.addAt(3, new Field({
    "autogeneratePattern": "",
    "hidden": false,
    "id": "text1579384326",
    "max": 0,
    "min": 0,
    "name": "name",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": true,
    "system": false,
    "type": "text"
  }))

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

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_4045216800")

  // remove field
  collection.fields.removeById("text1579384326")

  // remove field
  collection.fields.removeById("select29867064")

  return app.save(collection)
})
