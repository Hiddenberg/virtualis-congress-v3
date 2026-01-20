/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_3858085117");

  return app.delete(collection);
}, (app) => {
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
        "cascadeDelete": true,
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
      },
      {
        "cascadeDelete": true,
        "collectionId": "pbc_349178817",
        "hidden": false,
        "id": "relation2434085832",
        "maxSelect": 1,
        "minSelect": 0,
        "name": "conference",
        "presentable": false,
        "required": true,
        "system": false,
        "type": "relation"
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
          "pending",
          "recording",
          "uploading",
          "processing",
          "available",
          "failed"
        ]
      },
      {
        "cascadeDelete": false,
        "collectionId": "_pb_users_auth_",
        "hidden": false,
        "id": "relation3537914281",
        "maxSelect": 999,
        "minSelect": 0,
        "name": "usersWhoWillRecord",
        "presentable": false,
        "required": false,
        "system": false,
        "type": "relation"
      },
      {
        "autogeneratePattern": "",
        "hidden": false,
        "id": "text651390523",
        "max": 0,
        "min": 0,
        "name": "recordingUrl",
        "pattern": "",
        "presentable": false,
        "primaryKey": false,
        "required": true,
        "system": false,
        "type": "text"
      },
      {
        "hidden": false,
        "id": "number1085737684",
        "max": null,
        "min": null,
        "name": "durationSeconds",
        "onlyInt": false,
        "presentable": false,
        "required": false,
        "system": false,
        "type": "number"
      },
      {
        "hidden": false,
        "id": "date4079792263",
        "max": "",
        "min": "",
        "name": "recordedAt",
        "presentable": false,
        "required": false,
        "system": false,
        "type": "date"
      },
      {
        "hidden": false,
        "id": "select208246217",
        "maxSelect": 1,
        "name": "recordingType",
        "presentable": true,
        "required": false,
        "system": false,
        "type": "select",
        "values": [
          "conference",
          "presentation",
          "group_conference"
        ]
      },
      {
        "hidden": false,
        "id": "bool1383859061",
        "name": "invitationEmailSent",
        "presentable": false,
        "required": false,
        "system": false,
        "type": "bool"
      },
      {
        "hidden": false,
        "id": "bool1288219256",
        "name": "invitationEmailOpened",
        "presentable": false,
        "required": false,
        "system": false,
        "type": "bool"
      },
      {
        "hidden": false,
        "id": "date60179772",
        "max": "",
        "min": "",
        "name": "invitationEmailOpenedAt",
        "presentable": false,
        "required": false,
        "system": false,
        "type": "date"
      },
      {
        "hidden": false,
        "id": "date2594667351",
        "max": "",
        "min": "",
        "name": "lastReminderSentAt",
        "presentable": false,
        "required": false,
        "system": false,
        "type": "date"
      },
      {
        "hidden": false,
        "id": "date2699908074",
        "max": "",
        "min": "",
        "name": "lastReminderOpenedAt",
        "presentable": false,
        "required": false,
        "system": false,
        "type": "date"
      },
      {
        "hidden": false,
        "id": "number2964489726",
        "max": null,
        "min": null,
        "name": "remindersSentCount",
        "onlyInt": false,
        "presentable": false,
        "required": false,
        "system": false,
        "type": "number"
      },
      {
        "hidden": false,
        "id": "bool3034184549",
        "name": "reRecordingEmailSent",
        "presentable": false,
        "required": false,
        "system": false,
        "type": "bool"
      },
      {
        "hidden": false,
        "id": "date3442923825",
        "max": "",
        "min": "",
        "name": "reRecordingEmailSentAt",
        "presentable": false,
        "required": false,
        "system": false,
        "type": "date"
      },
      {
        "hidden": false,
        "id": "date2878474910",
        "max": "",
        "min": "",
        "name": "reRecordingEmailOpenedAt",
        "presentable": false,
        "required": false,
        "system": false,
        "type": "date"
      },
      {
        "hidden": false,
        "id": "json1492220231",
        "maxSize": 0,
        "name": "preformanceMetrics",
        "presentable": false,
        "required": false,
        "system": false,
        "type": "json"
      },
      {
        "hidden": false,
        "id": "date2383655349",
        "max": "",
        "min": "",
        "name": "startedRecordingAt",
        "presentable": false,
        "required": false,
        "system": false,
        "type": "date"
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
    "id": "pbc_3858085117",
    "indexes": [],
    "listRule": null,
    "name": "congress_conference_recordings",
    "system": false,
    "type": "base",
    "updateRule": null,
    "viewRule": null
  });

  return app.save(collection);
})
