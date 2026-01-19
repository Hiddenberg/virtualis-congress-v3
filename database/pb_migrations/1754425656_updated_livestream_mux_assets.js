/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_3754519134")

  // update collection data
  unmarshal({
    "name": "livestream_mux_assets_old"
  }, collection)

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_3754519134")

  // update collection data
  unmarshal({
    "name": "livestream_mux_assets"
  }, collection)

  return app.save(collection)
})
