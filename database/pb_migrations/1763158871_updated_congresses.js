/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_3334691818")

  // add field
  collection.fields.addAt(8, new Field({
    "hidden": false,
    "id": "bool408658070",
    "name": "showClosingConferenceBanner",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "bool"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_3334691818")

  // remove field
  collection.fields.removeById("bool408658070")

  return app.save(collection)
})
