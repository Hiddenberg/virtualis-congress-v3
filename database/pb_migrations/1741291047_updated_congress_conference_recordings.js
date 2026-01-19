/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_3858085117")

  // add field
  collection.fields.addAt(4, new Field({
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
  }))

  // add field
  collection.fields.addAt(9, new Field({
    "hidden": false,
    "id": "bool1383859061",
    "name": "invitationEmailSent",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "bool"
  }))

  // add field
  collection.fields.addAt(10, new Field({
    "hidden": false,
    "id": "date2594667351",
    "max": "",
    "min": "",
    "name": "lastReminderSentAt",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "date"
  }))

  // add field
  collection.fields.addAt(11, new Field({
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
  }))

  // update field
  collection.fields.addAt(8, new Field({
    "hidden": false,
    "id": "select208246217",
    "maxSelect": 1,
    "name": "recordingType",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "select",
    "values": [
      "conference",
      "presentation",
      "group_conference"
    ]
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_3858085117")

  // remove field
  collection.fields.removeById("relation3537914281")

  // remove field
  collection.fields.removeById("bool1383859061")

  // remove field
  collection.fields.removeById("date2594667351")

  // remove field
  collection.fields.removeById("number2964489726")

  // update field
  collection.fields.addAt(7, new Field({
    "hidden": false,
    "id": "select208246217",
    "maxSelect": 1,
    "name": "recordingType",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "select",
    "values": [
      "conference",
      "presentation"
    ]
  }))

  return app.save(collection)
})
