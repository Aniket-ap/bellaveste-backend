const Collection = require('../models/collectionModel');
const factory = require('./handlerFactory');

exports.getAllCollections = factory.getAll(Collection);
exports.getCollection = factory.getOne(Collection);
exports.createCollection = factory.createOne(Collection);
exports.updateCollection = factory.updateOne(Collection);
exports.deleteCollection = factory.deleteOne(Collection);
