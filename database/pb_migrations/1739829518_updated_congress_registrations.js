/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_4139004309")

  // update collection data
  unmarshal({
    "createRule": "(@request.auth.id = @request.body.userRegistered.id) &&\n(@request.body.paymentConfirmed = false)"
  }, collection)

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_4139004309")

  // update collection data
  unmarshal({
    "createRule": null
  }, collection)

  return app.save(collection)
})
