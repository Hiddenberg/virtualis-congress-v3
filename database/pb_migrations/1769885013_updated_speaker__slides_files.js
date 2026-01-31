/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_3120602714")

  // remove field
  collection.fields.removeById("text920546311")

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_3120602714")

  // add field
  collection.fields.addAt(5, new Field({
    "autogeneratePattern": "",
    "hidden": false,
    "id": "text920546311",
    "max": 0,
    "min": 0,
    "name": "fileSizeInMb",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": true,
    "system": false,
    "type": "text"
  }))

  return app.save(collection)
})
