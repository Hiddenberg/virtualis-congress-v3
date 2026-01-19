/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_1380377198")

  // update collection data
  unmarshal({
    "name": "congress__certificate_designs"
  }, collection)

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_1380377198")

  // update collection data
  unmarshal({
    "name": "congress__certificate__designs"
  }, collection)

  return app.save(collection)
})
