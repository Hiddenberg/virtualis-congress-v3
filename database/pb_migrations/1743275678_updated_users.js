/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("_pb_users_auth_")

  // update field
  collection.fields.addAt(10, new Field({
    "hidden": false,
    "id": "select912044284",
    "maxSelect": 1,
    "name": "preferredLanguage",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "select",
    "values": [
      "es-MX",
      "en-US",
      "pt-BR"
    ]
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("_pb_users_auth_")

  // update field
  collection.fields.addAt(10, new Field({
    "hidden": false,
    "id": "select912044284",
    "maxSelect": 1,
    "name": "prefferedLanguage",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "select",
    "values": [
      "es-MX",
      "en-US",
      "pt-BR"
    ]
  }))

  return app.save(collection)
})
