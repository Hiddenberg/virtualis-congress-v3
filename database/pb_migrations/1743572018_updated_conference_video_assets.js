/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_2668413169")

  // add field
  collection.fields.addAt(8, new Field({
    "autogeneratePattern": "",
    "hidden": false,
    "id": "text370503141",
    "max": 0,
    "min": 0,
    "name": "errorMessage",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": false,
    "system": false,
    "type": "text"
  }))

  // update field
  collection.fields.addAt(4, new Field({
    "autogeneratePattern": "",
    "hidden": false,
    "id": "text3889096196",
    "max": 0,
    "min": 0,
    "name": "muxAssetId",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": false,
    "system": false,
    "type": "text"
  }))

  // update field
  collection.fields.addAt(5, new Field({
    "autogeneratePattern": "",
    "hidden": false,
    "id": "text1061856600",
    "max": 0,
    "min": 0,
    "name": "muxPlaybackId",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": false,
    "system": false,
    "type": "text"
  }))

  // update field
  collection.fields.addAt(6, new Field({
    "hidden": false,
    "id": "select2602444009",
    "maxSelect": 1,
    "name": "videoType",
    "presentable": false,
    "required": true,
    "system": false,
    "type": "select",
    "values": [
      "camera",
      "screen",
      "combined",
      "other"
    ]
  }))

  // update field
  collection.fields.addAt(7, new Field({
    "hidden": false,
    "id": "select3788841698",
    "maxSelect": 1,
    "name": "muxAssetStatus",
    "presentable": false,
    "required": true,
    "system": false,
    "type": "select",
    "values": [
      "uploading",
      "preparing",
      "ready",
      "errored"
    ]
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_2668413169")

  // remove field
  collection.fields.removeById("text370503141")

  // update field
  collection.fields.addAt(4, new Field({
    "autogeneratePattern": "",
    "hidden": false,
    "id": "text3889096196",
    "max": 0,
    "min": 0,
    "name": "muxAssetId",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": true,
    "system": false,
    "type": "text"
  }))

  // update field
  collection.fields.addAt(5, new Field({
    "autogeneratePattern": "",
    "hidden": false,
    "id": "text1061856600",
    "max": 0,
    "min": 0,
    "name": "muxPlaybackId",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": true,
    "system": false,
    "type": "text"
  }))

  // update field
  collection.fields.addAt(6, new Field({
    "hidden": false,
    "id": "select2602444009",
    "maxSelect": 1,
    "name": "videoType",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "select",
    "values": [
      "camera",
      "screen",
      "combined",
      "other"
    ]
  }))

  // update field
  collection.fields.addAt(7, new Field({
    "hidden": false,
    "id": "select3788841698",
    "maxSelect": 1,
    "name": "muxAssetStatus",
    "presentable": false,
    "required": true,
    "system": false,
    "type": "select",
    "values": [
      "preparing",
      "ready",
      "errored"
    ]
  }))

  return app.save(collection)
})
