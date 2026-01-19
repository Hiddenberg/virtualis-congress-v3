/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_3799568309")

  // update collection data
  unmarshal({
    "name": "presentation__realtime_states"
  }, collection)

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_3799568309")

  // update collection data
  unmarshal({
    "name": "presentation__realtime_state"
  }, collection)

  return app.save(collection)
})
