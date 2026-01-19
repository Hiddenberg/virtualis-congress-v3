/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_382459631")

  // update collection data
  unmarshal({
    "name": "simple_recording__recordings"
  }, collection)

  // add field
  collection.fields.addAt(1, new Field({
    "cascadeDelete": false,
    "collectionId": "pbc_2873630990",
    "hidden": false,
    "id": "relation3253625724",
    "maxSelect": 1,
    "minSelect": 0,
    "name": "organization",
    "presentable": false,
    "required": true,
    "system": false,
    "type": "relation"
  }))

  // add field
  collection.fields.addAt(2, new Field({
    "cascadeDelete": false,
    "collectionId": "pbc_461895359",
    "hidden": false,
    "id": "relation521474781",
    "maxSelect": 1,
    "minSelect": 0,
    "name": "campaign",
    "presentable": false,
    "required": true,
    "system": false,
    "type": "relation"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_382459631")

  // update collection data
  unmarshal({
    "name": "simple_recordings"
  }, collection)

  // remove field
  collection.fields.removeById("relation3253625724")

  // remove field
  collection.fields.removeById("relation521474781")

  return app.save(collection)
})
