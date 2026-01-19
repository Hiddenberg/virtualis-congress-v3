/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_382459631")

  // add field
  collection.fields.addAt(14, new Field({
    "hidden": false,
    "id": "number1085737684",
    "max": null,
    "min": null,
    "name": "durationSeconds",
    "onlyInt": false,
    "presentable": false,
    "required": false,
    "system": false,
    "type": "number"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_382459631")

  // remove field
  collection.fields.removeById("number1085737684")

  return app.save(collection)
})
