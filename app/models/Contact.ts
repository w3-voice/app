import { Instance, SnapshotIn, SnapshotOut, types } from "mobx-state-tree"

/**
 * Model description here for TypeScript hints.
 */
export const ContactModel = types
  .model("Contact")
  .props({
    _id: types.identifier,
    name: types.string,
    selected : types.maybe(types.boolean)
  })
  .views((self) => ({})) // eslint-disable-line @typescript-eslint/no-unused-vars
  .actions((self) => ({
    onChangeSelect(){
      console.log("Called!")
      self.selected = !self.selected
    }
  })) // eslint-disable-line @typescript-eslint/no-unused-vars

export interface Contact extends Instance<typeof ContactModel> {}
export interface ContactSnapshotOut extends SnapshotOut<typeof ContactModel> {}
export interface ContactSnapshotIn extends SnapshotIn<typeof ContactModel> {}
export const createContactDefaultModel = () => types.optional(ContactModel, {})
