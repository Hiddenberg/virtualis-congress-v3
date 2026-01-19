/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_2754935733")

  // add field
  collection.fields.addAt(4, new Field({
    "hidden": false,
    "id": "select722121570",
    "maxSelect": 1,
    "name": "academicTitle",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "select",
    "values": [
      "Dr.",
      "Dra.",
      "Ing.",
      "Arq.",
      "Lic.",
      "Mtro.",
      "Mtra.",
      "M.Sc.",
      "Ph.D.",
      "Téc.",
      "Prof.",
      "Abg.",
      "C.P."
    ]
  }))

  // add field
  collection.fields.addAt(5, new Field({
    "autogeneratePattern": "",
    "hidden": false,
    "id": "text3551045719",
    "max": 0,
    "min": 0,
    "name": "specialityDetails",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": false,
    "system": false,
    "type": "text"
  }))

  // add field
  collection.fields.addAt(6, new Field({
    "autogeneratePattern": "",
    "hidden": false,
    "id": "text3709889147",
    "max": 0,
    "min": 0,
    "name": "bio",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": false,
    "system": false,
    "type": "text"
  }))

  // add field
  collection.fields.addAt(7, new Field({
    "autogeneratePattern": "",
    "hidden": false,
    "id": "text3898508260",
    "max": 0,
    "min": 0,
    "name": "phoneNumber",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": false,
    "system": false,
    "type": "text"
  }))

  // add field
  collection.fields.addAt(8, new Field({
    "hidden": false,
    "id": "file2398387016",
    "maxSelect": 1,
    "maxSize": 0,
    "mimeTypes": [
      "image/jpeg",
      "image/png",
      "image/svg+xml",
      "image/gif",
      "image/webp"
    ],
    "name": "presentationPhoto",
    "presentable": false,
    "protected": false,
    "required": false,
    "system": false,
    "thumbs": [],
    "type": "file"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_2754935733")

  // remove field
  collection.fields.removeById("select722121570")

  // remove field
  collection.fields.removeById("text3551045719")

  // remove field
  collection.fields.removeById("text3709889147")

  // remove field
  collection.fields.removeById("text3898508260")

  // remove field
  collection.fields.removeById("file2398387016")

  return app.save(collection)
})
