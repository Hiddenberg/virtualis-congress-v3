/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_581399240")

  // update collection data
  unmarshal({
    "name": "courtesy_invitations"
  }, collection)

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_581399240")

  // update collection data
  unmarshal({
    "name": "courtesy_invitation_codes"
  }, collection)

  return app.save(collection)
})
