import { NewGroupModel } from "./NewGroup"

test("can be created", () => {
  const instance = NewGroupModel.create({})

  expect(instance).toBeTruthy()
})
