declare module 'firebase-admin' {
  export * from '../node_modules/firebase-admin/lib/default-namespace'
  import admin = require('../node_modules/firebase-admin/lib/default-namespace')
  export = admin
}
