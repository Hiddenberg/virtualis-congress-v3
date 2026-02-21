/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_382459631")

  // add field
  collection.fields.addAt(15, new Field({
    "hidden": false,
    "id": "bool2033260659",
    "name": "manuallyContacted",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "bool"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_382459631")

  // remove field
  collection.fields.removeById("bool2033260659")

  return app.save(collection)
})
