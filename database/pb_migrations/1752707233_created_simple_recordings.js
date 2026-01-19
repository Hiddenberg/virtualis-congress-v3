/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = new Collection({
    "createRule": null,
    "deleteRule": null,
    "fields": [
      {
        "autogeneratePattern": "[a-z0-9]{15}",
        "hidden": false,
        "id": "text3208210256",
        "max": 15,
        "min": 15,
        "name": "id",
        "pattern": "^[a-z0-9]+$",
        "presentable": false,
        "primaryKey": true,
        "required": true,
        "system": true,
        "type": "text"
      },
      {
        "autogeneratePattern": "",
        "hidden": false,
        "id": "text724990059",
        "max": 0,
        "min": 0,
        "name": "title",
        "pattern": "",
        "presentable": false,
        "primaryKey": false,
        "required": true,
        "system": false,
        "type": "text"
      },
      {
        "autogeneratePattern": "",
        "hidden": false,
        "id": "text3202338561",
        "max": 0,
        "min": 0,
        "name": "recorderName",
        "pattern": "",
        "presentable": false,
        "primaryKey": false,
        "required": true,
        "system": false,
        "type": "text"
      },
      {
        "exceptDomains": [],
        "hidden": false,
        "id": "email2031490406",
        "name": "recorderEmail",
        "onlyDomains": [],
        "presentable": false,
        "required": true,
        "system": false,
        "type": "email"
      },
      {
        "hidden": false,
        "id": "select2063623452",
        "maxSelect": 1,
        "name": "status",
        "presentable": false,
        "required": true,
        "system": false,
        "type": "select",
        "values": [
          "scheduled",
          "recording",
          "uploading",
          "ready",
          "error"
        ]
      },
      {
        "hidden": false,
        "id": "select339714011",
        "maxSelect": 1,
        "name": "invitationEmailStatus",
        "presentable": false,
        "required": true,
        "system": false,
        "type": "select",
        "values": [
          "not_sent",
          "sent",
          "opened",
          "error"
        ]
      },
      {
        "hidden": false,
        "id": "date3661983880",
        "max": "",
        "min": "",
        "name": "invitationEmailOpenedAt",
        "presentable": false,
        "required": false,
        "system": false,
        "type": "date"
      },
      {
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
      },
      {
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
      },
      {
        "hidden": false,
        "id": "autodate2990389176",
        "name": "created",
        "onCreate": true,
        "onUpdate": false,
        "presentable": false,
        "system": false,
        "type": "autodate"
      },
      {
        "hidden": false,
        "id": "autodate3332085495",
        "name": "updated",
        "onCreate": true,
        "onUpdate": true,
        "presentable": false,
        "system": false,
        "type": "autodate"
      }
    ],
    "id": "pbc_382459631",
    "indexes": [],
    "listRule": null,
    "name": "simple_recordings",
    "system": false,
    "type": "base",
    "updateRule": null,
    "viewRule": null
  });

  return app.save(collection);
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_382459631");

  return app.delete(collection);
})
