import { MongoClient } from 'mongodb';
import config from "../config/index";

export default class DatabaseClient {

  constructor() {
    this._isConnected = false;
    this._client = null;
    this._db = null;
    this._url = config.mongoDb.url;
    this._settings = config.mongoDb.settings;
    this._dbName = config.mongoDb.database;
  }
  
  collectionNames = {
    USERS: 'users',
    REFRESH_TOKENS: 'refreshTokens'
  };
  
  _connectWrapper = (functionName, collectionName, document) => {
    return new Promise((resolve, reject) => {
      if (!this._isConnected) {
        this.connect()
          .then(() => {
            functionName(this._db.collection(collectionName), document)
              .then(result => {
                this.disconnect()
                  .then(() => resolve(result))
                  .catch(error => reject(error));
              })
              .catch(error => reject(error));
          })
          .catch(error => reject(error));
      } else {
        functionName(this._db.collection(collectionName), document)
          .then(result => resolve(result))
          .catch(error => reject(error));
      }
    });
  };
  
  connect = () => {
    return new Promise((resolve, reject) => {
      if (this._isConnected) {
        resolve();
      } else {
        MongoClient.connect(this._url, this._settings)
          .then(client => {
            this._client = client;
            this._db = client.db(this._dbName);
            this._isConnected = true;
            resolve();
          })
          .catch(error => {
            this._isConnected = false;
            this._client = null;
            this._db = null;
            console.error(error);
            reject(error);
          });
      }
    });
  };
  disconnect = () => {
    return new Promise((resolve) => {
      if (this._isConnected){
        if (this._client) this._client.close();
        this._isConnected = false;
        this._client = null;
        this._db = null;
      }
      resolve();
    });
  };
  
  createIndexes = () => {
    return new Promise((resolve, reject) => {
      this.connect()
          .then(() => {
            let usersEmail = this._db.collection(this.collectionNames.USERS).createIndex({ email: 1 });
            let refreshTokens = this._db.collection(this.collectionNames.REFRESH_TOKENS).createIndex({ refreshToken: 1 });
            let refreshTokensEmail = this._db.collection(this.collectionNames.REFRESH_TOKENS).createIndex({ refreshToken: 1, email: 1 });
            Promise.all([ usersEmail, refreshTokens, refreshTokensEmail ])
              .then(() =>
              {
                this.disconnect();
                resolve();
              })
              .catch(error => reject(error));
          })
          .catch(error => reject(error));
    });
  };
  
  _find = (collection, query) => {
    return collection.find(query).toArray();
  };
  find = (collectionName, queryDocument) => {
    return this._connectWrapper(this._find, collectionName, queryDocument);
  };
  findOne = (collectionName, queryDocument) => {
    return new Promise((resolve, reject) => {
      this._connectWrapper(this._find, collectionName, queryDocument)
        .then(results => {
          if (results.length === 0)
            reject('No results');
          else if (results.length > 1)
            reject('Multiple results');
          else
            resolve(results[0]);
        })
        .catch(error => reject(error));
    });
  }
  
  _insertOne = (collection, newDocument) => {
    return collection.insertOne(newDocument);
  };
  insertOne = (collectionName, newDocument) => {
    return this._connectWrapper(this._insertOne, collectionName, newDocument);
  };
  
  _replaceOne = (collection, replacement) => {
    return collection.findOneAndReplace({_id: replacement._id}, replacement);
  };
  replaceOne = (collectionName, replacementDocument) => {
    return this._connectWrapper(this._replaceOne, collectionName, replacementDocument);
  };
  
  _deleteOne = (collection, id) => {
    return collection.deleteOne(id);
  };
  deleteOne = (collectionName, id) => {
    return this._connectWrapper(this._deleteOne, collectionName, id);
  }
}
