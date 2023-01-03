import { flow, Instance, SnapshotIn, SnapshotOut, types } from "mobx-state-tree"
import { ContactModel } from "./Contact"
import { createNewContactDefaultModel } from "./NewContact"
import { api } from "../services/core"
import { load } from "../utils/storage"
/**
 * Model description here for TypeScript hints.
 */
export const ContactStoreModel = types
  .model("ContactStore")
  .props({
    list: types.array(ContactModel),
    form: createNewContactDefaultModel()
  })
  .views((self) => ({})) // eslint-disable-line @typescript-eslint/no-unused-vars
  .actions((self) => ({
    load: flow(function* loadContact() {
      const list = yield api.beeCore.contact.list(0, 50)
      self.list.replace(list)
    }),
    add: flow(function* addContacts() {
      self.form.saving = true;
      const newContact = { _id:self.form._id, name:self.form.name }
      try {
        yield api.beeCore.contact.add(newContact)
        self.list.push(newContact)
        self.form.done = true
      } catch (error) {
        self.form.err = error
        console.log("failed to create new contract", error)
      }
      self.form.saving = false;
    }),
    addDone:()=>{self.form.clear()}
  })) // eslint-disable-line @typescript-eslint/no-unused-vars

export interface ContactStore extends Instance<typeof ContactStoreModel> {}
export interface ContactStoreSnapshotOut extends SnapshotOut<typeof ContactStoreModel> {}
export interface ContactStoreSnapshotIn extends SnapshotIn<typeof ContactStoreModel> {}
export const createContactStoreDefaultModel = () => types.optional(ContactStoreModel, {})
