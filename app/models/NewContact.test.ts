import { NewContactModel } from "./NewContact"

test("can be created", () => {
  const instance = NewContactModel.create({})

  expect(instance).toBeTruthy()
})
