import { Instance, SnapshotIn, SnapshotOut, types, flow } from "mobx-state-tree"
import { api } from "../services/core"

/**
 * Model description here for TypeScript hints.
 */
export const IdentityModel = types
  .model("Identity")
  .props({
    _id: types.maybeNull(types.string),
    name: types.maybe(types.string),
    isLoggedIn: types.boolean
  })
  .views((self) => ({})) // eslint-disable-line @typescript-eslint/no-unused-vars
  .actions((self) => {
    const newIdentity = flow(function* newIdentity(name: string){
      let idObj = yield api.beeCore.newIdentity(name)
      self._id = idObj._id
      self.name = idObj.name
      self.isLoggedIn = true
    })
    const loadIdentity = flow(function* load(){
      let hasId = yield api.beeCore.hasIdentity()
      if (!hasId) {
        self._id = null
        self.name = null
        self.isLoggedIn = false
      }
      else {
        let idObj = yield api.beeCore.getIdentity()
        self._id = idObj._id
        self.name = idObj.name
        self.isLoggedIn = true
      }
    }) 
    const setName = (name)=>{
      self.name = name
    }
    return {
      loadIdentity,
      newIdentity,
      afterCreate: loadIdentity,
      setName
    }
  }) // eslint-disable-line @typescript-eslint/no-unused-vars

export interface Identity extends Instance<typeof IdentityModel> {}
export interface IdentitySnapshotOut extends SnapshotOut<typeof IdentityModel> {}
export interface IdentitySnapshotIn extends SnapshotIn<typeof IdentityModel> {}
export const createIdentityDefaultModel = () => types.optional(IdentityModel, {isLoggedIn:false})
