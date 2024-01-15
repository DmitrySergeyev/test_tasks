import {
  DataSource,
  ObjectType,
} from "typeorm"
import { Repository } from "typeorm/repository/Repository"
import { DataSourceConfig } from "@src/database/database.config";

export class DbUtils {
  private _connection: DataSource

  private static instance: DbUtils

  private constructor () {
    if (process.env.NODE_ENV !== "test") {
      throw new Error("ERROR-DB-UTILS-ONLY-FOR-TESTS")
    }
  }

  static getInstance (): DbUtils {
    if (!DbUtils.instance) {
      DbUtils.instance = new DbUtils()
    }
    return DbUtils.instance
  }

  get connection (): Promise<DataSource> {
    if (!this._connection || !this._connection.isInitialized) {
      return DataSourceConfig.initialize().then(dataSource => {
        this._connection = dataSource
        return this._connection
      })
    }

    return Promise.resolve(this._connection)
  }

  async getRepository<T> (entity: ObjectType<T>): Promise<Repository<T>> {
    const connection = await this.connection
    return connection.getRepository(entity)
  }

  async cleanRepository (repository: Repository<any>): Promise<void> {
    const tableName = repository.metadata.tableName
    await repository.query(`TRUNCATE TABLE ${tableName} CASCADE;`)
  }

  async cleanAllRepositories (repositories: Repository<any>[]): Promise<void> {
    await Promise.all(repositories.map(repository => {
      const tableName = repository.metadata.tableName
      return repository.query(`TRUNCATE TABLE ${tableName} CASCADE;`)
    }))
  }

  async cleanAllRepositoriesSync (repositories: Repository<any>[]): Promise<void> {
    // eslint-disable-next-line no-restricted-syntax
    for (const repo of repositories) {
      await this.cleanRepository(repo)
    }
  }

  async closeConnection (): Promise<void> {
    const connection = await this.connection
    return connection.destroy()
  }
}
