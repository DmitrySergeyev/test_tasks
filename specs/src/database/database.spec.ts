import { DataSource } from "typeorm";
import { DbUtils } from "./db.utils";

describe("database schema", () => {
  let dbConnect: DataSource
  const dbUtils = DbUtils.getInstance()

  beforeAll(async () => {
    dbConnect = await dbUtils.connection
  })

  afterAll(async () => {
    await dbUtils.closeConnection()
  })

  it("should be synced with entities", async () => {
    const syncQueries = await dbConnect.driver.createSchemaBuilder().log()
    const upQueries = syncQueries.upQueries.map(up => up.query)
    const downQueries = syncQueries.downQueries.map(down => down.query)

    expect(upQueries).toBeArrayOfSize(0)
    expect(downQueries).toBeArrayOfSize(0)
  }, 10000)
})