import { ContactStoreModel } from "./ContactStore"

test("can be created", () => {
  const instance = ContactStoreModel.create({})

  expect(instance).toBeTruthy()
})
