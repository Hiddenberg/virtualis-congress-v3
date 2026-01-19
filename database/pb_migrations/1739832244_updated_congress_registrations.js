/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_4139004309")

  // update collection data
  unmarshal({
    "listRule": "(@request.auth.id = userRegistered.id) &&\n(@request.auth.organization.id = organization.id)"
  }, collection)

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_4139004309")

  // update collection data
  unmarshal({
    "listRule": null
  }, collection)

  return app.save(collection)
})
