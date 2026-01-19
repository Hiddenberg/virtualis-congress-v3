/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_162798418")

  // update field
  collection.fields.addAt(3, new Field({
    "hidden": false,
    "id": "file2894849927",
    "maxSelect": 1,
    "maxSize": 0,
    "mimeTypes": [
      "application/pdf",
      "image/png",
      "image/jpeg"
    ],
    "name": "cmimCredentialFile",
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

  // update field
  collection.fields.addAt(3, new Field({
    "hidden": false,
    "id": "file2894849927",
    "maxSelect": 1,
    "maxSize": 0,
    "mimeTypes": [
      "application/pdf",
      "image/png",
      "image/jpeg"
    ],
    "name": "credentialFile",
    "presentable": false,
    "protected": true,
    "required": true,
    "system": false,
    "thumbs": [],
    "type": "file"
  }))

  return app.save(collection)
})
