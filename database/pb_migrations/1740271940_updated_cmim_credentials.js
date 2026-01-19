/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_162798418")

  // add field
  collection.fields.addAt(4, new Field({
    "hidden": false,
    "id": "file2602772463",
    "maxSelect": 1,
    "maxSize": 0,
    "mimeTypes": [
      "application/pdf",
      "image/png",
      "image/jpeg"
    ],
    "name": "studentCredentialFile",
    "presentable": false,
    "protected": true,
    "required": false,
    "system": false,
    "thumbs": [],
    "type": "file"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_162798418")

  // remove field
  collection.fields.removeById("file2602772463")

  return app.save(collection)
})
