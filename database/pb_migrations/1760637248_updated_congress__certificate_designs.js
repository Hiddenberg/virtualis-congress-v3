/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_1380377198")

  // add field
  collection.fields.addAt(6, new Field({
    "autogeneratePattern": "",
    "hidden": false,
    "id": "text3171208577",
    "max": 0,
    "min": 0,
    "name": "nameColor",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": false,
    "system": false,
    "type": "text"
  }))

  // add field
  collection.fields.addAt(7, new Field({
    "hidden": false,
    "id": "number2954933722",
    "max": null,
    "min": null,
    "name": "nameFontSizeMultiplier",
    "onlyInt": false,
    "presentable": false,
    "required": false,
    "system": false,
    "type": "number"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_1380377198")

  // remove field
  collection.fields.removeById("text3171208577")

  // remove field
  collection.fields.removeById("number2954933722")

  return app.save(collection)
})
