/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_382459631")

  // update field
  collection.fields.addAt(4, new Field({
    "autogeneratePattern": "",
    "hidden": false,
    "id": "text3202338561",
    "max": 0,
    "min": 0,
    "name": "recorderName",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": false,
    "system": false,
    "type": "text"
  }))

  // update field
  collection.fields.addAt(5, new Field({
    "exceptDomains": [],
    "hidden": false,
    "id": "email2031490406",
    "name": "recorderEmail",
    "onlyDomains": [],
    "presentable": false,
    "required": false,
    "system": false,
    "type": "email"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_382459631")

  // update field
  collection.fields.addAt(4, new Field({
    "autogeneratePattern": "",
    "hidden": false,
    "id": "text3202338561",
    "max": 0,
    "min": 0,
    "name": "recorderName",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": true,
    "system": false,
    "type": "text"
  }))

  // update field
  collection.fields.addAt(5, new Field({
    "exceptDomains": [],
    "hidden": false,
    "id": "email2031490406",
    "name": "recorderEmail",
    "onlyDomains": [],
    "presentable": false,
    "required": true,
    "system": false,
    "type": "email"
  }))

  return app.save(collection)
})
