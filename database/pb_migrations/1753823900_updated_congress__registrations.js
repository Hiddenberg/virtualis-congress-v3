/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_4139004309")

  // update collection data
  unmarshal({
    "indexes": [
      "CREATE UNIQUE INDEX `idx_1mfTdCC1Jv` ON `congress__registrations` (\n  `organization`,\n  `userRegistered_old`,\n  `congress`\n)"
    ],
    "listRule": null,
    "viewRule": null
  }, collection)

  // update field
  collection.fields.addAt(2, new Field({
    "cascadeDelete": true,
    "collectionId": "_pb_users_auth_",
    "hidden": true,
    "id": "relation1239404105",
    "maxSelect": 1,
    "minSelect": 0,
    "name": "userRegistered_old",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "relation"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_4139004309")

  // update collection data
  unmarshal({
    "indexes": [
      "CREATE UNIQUE INDEX `idx_1mfTdCC1Jv` ON `congress__registrations` (\n  `organization`,\n  `userRegistered`,\n  `congress`\n)"
    ],
    "listRule": "(@request.auth.id = userRegistered) &&\n(@request.auth.organization.id = organization)",
    "viewRule": "(@request.auth.id = userRegistered.id) &&\n(@request.auth.organization.id = organization.id)"
  }, collection)

  // update field
  collection.fields.addAt(2, new Field({
    "cascadeDelete": true,
    "collectionId": "_pb_users_auth_",
    "hidden": false,
    "id": "relation1239404105",
    "maxSelect": 1,
    "minSelect": 0,
    "name": "userRegistered",
    "presentable": false,
    "required": true,
    "system": false,
    "type": "relation"
  }))

  return app.save(collection)
})
