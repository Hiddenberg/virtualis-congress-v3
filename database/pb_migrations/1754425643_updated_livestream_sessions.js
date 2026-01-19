/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_3891906640")

  // update collection data
  unmarshal({
    "name": "livestream_sessions_old"
  }, collection)

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_3891906640")

  // update collection data
  unmarshal({
    "name": "livestream_sessions"
  }, collection)

  return app.save(collection)
})
