import { Instance, SnapshotIn, SnapshotOut, types, flow } from "mobx-state-tree"
import { api } from "../services/core"
import { ContactModel } from "./Contact"

/**
 * Model description here for TypeScript hints.
 */
export const IdentityModel = types
  .model("Identity")
  .props({
    user: types.maybeNull(ContactModel),
    isLoggedIn: types.boolean
  })
  .views((self) => ({})) // eslint-disable-line @typescript-eslint/no-unused-vars
  .actions((self) => {
    const newIdentity = flow(function* newIdentity(name: string) {
      let idObj = yield api.beeCore.newIdentity(name)
      self.user = { _id: idObj._id, name: idObj.name }
      self.isLoggedIn = true
    })
    const loadIdentity = flow(function* load() {
      try {
        let hasId = yield api.beeCore.hasIdentity()
        if (!hasId) {
          self.user = null
          self.isLoggedIn = false
        }
        else {
          let idObj = yield api.beeCore.getIdentity()
          self.user = { _id: idObj._id, name: idObj.name }
          self.isLoggedIn = true
        }
      } catch (error) {
        console.log(error)
      }

    })
    const setName = (name) => {
      self.user.name = name
    }
    return {
      loadIdentity,
      newIdentity,
      afterCreate: loadIdentity,
      setName
    }
  }) // eslint-disable-line @typescript-eslint/no-unused-vars

export interface Identity extends Instance<typeof IdentityModel> { }
export interface IdentitySnapshotOut extends SnapshotOut<typeof IdentityModel> { }
export interface IdentitySnapshotIn extends SnapshotIn<typeof IdentityModel> { }
export const createIdentityDefaultModel = () => types.optional(IdentityModel, { isLoggedIn: false })
