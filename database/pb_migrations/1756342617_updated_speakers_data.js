/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_2754935733")

  // update field
  collection.fields.addAt(5, new Field({
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
      "C.P.",
      "LN."
    ]
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_2754935733")

  // update field
  collection.fields.addAt(5, new Field({
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

  return app.save(collection)
})
