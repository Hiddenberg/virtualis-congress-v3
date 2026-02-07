/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_1380377198")

  // add field
  collection.fields.addAt(9, new Field({
    "hidden": false,
    "id": "number83710494",
    "max": null,
    "min": null,
    "name": "nameWidthPercentage",
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
  collection.fields.removeById("number83710494")

  return app.save(collection)
})
