/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_3120602714")

  // add field
  collection.fields.addAt(5, new Field({
    "hidden": false,
    "id": "number920546311",
    "max": null,
    "min": null,
    "name": "fileSizeInMb",
    "onlyInt": false,
    "presentable": false,
    "required": false,
    "system": false,
    "type": "number"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_3120602714")

  // remove field
  collection.fields.removeById("number920546311")

  return app.save(collection)
})
