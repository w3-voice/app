import { IdentityModel } from "./Identity"

test("can be created", () => {
  const instance = IdentityModel.create({})

  expect(instance).toBeTruthy()
})
