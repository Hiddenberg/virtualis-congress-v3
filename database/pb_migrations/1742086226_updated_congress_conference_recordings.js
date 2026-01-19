/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_3858085117")

  // update field
  collection.fields.addAt(10, new Field({
    "hidden": false,
    "id": "bool1288219256",
    "name": "invitationEmailOpened",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "bool"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_3858085117")

  // update field
  collection.fields.addAt(10, new Field({
    "hidden": false,
    "id": "bool1288219256",
    "name": "invitationEmailOpen",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "bool"
  }))

  return app.save(collection)
})
