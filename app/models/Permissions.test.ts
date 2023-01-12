import { PermissionsModel } from "./Permissions"

test("can be created", () => {
  const instance = PermissionsModel.create({})

  expect(instance).toBeTruthy()
})
