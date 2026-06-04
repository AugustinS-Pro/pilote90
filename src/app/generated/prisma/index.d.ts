
/**
 * Client
**/

import * as runtime from './runtime/library.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model User
 * 
 */
export type User = $Result.DefaultSelection<Prisma.$UserPayload>
/**
 * Model Client
 * 
 */
export type Client = $Result.DefaultSelection<Prisma.$ClientPayload>
/**
 * Model Cycle
 * 
 */
export type Cycle = $Result.DefaultSelection<Prisma.$CyclePayload>
/**
 * Model Week
 * 
 */
export type Week = $Result.DefaultSelection<Prisma.$WeekPayload>
/**
 * Model Objective
 * 
 */
export type Objective = $Result.DefaultSelection<Prisma.$ObjectivePayload>
/**
 * Model Transaction
 * 
 */
export type Transaction = $Result.DefaultSelection<Prisma.$TransactionPayload>

/**
 * Enums
 */
export namespace $Enums {
  export const Role: {
  ADMIN: 'ADMIN',
  CLIENT: 'CLIENT'
};

export type Role = (typeof Role)[keyof typeof Role]


export const CycleStatus: {
  ACTIVE: 'ACTIVE',
  COMPLETED: 'COMPLETED',
  ARCHIVED: 'ARCHIVED'
};

export type CycleStatus = (typeof CycleStatus)[keyof typeof CycleStatus]


export const TransactionType: {
  REVENUE: 'REVENUE',
  EXPENSE: 'EXPENSE'
};

export type TransactionType = (typeof TransactionType)[keyof typeof TransactionType]


export const ObjectiveStatus: {
  IN_PROGRESS: 'IN_PROGRESS',
  COMPLETED: 'COMPLETED',
  LATE: 'LATE'
};

export type ObjectiveStatus = (typeof ObjectiveStatus)[keyof typeof ObjectiveStatus]

}

export type Role = $Enums.Role

export const Role: typeof $Enums.Role

export type CycleStatus = $Enums.CycleStatus

export const CycleStatus: typeof $Enums.CycleStatus

export type TransactionType = $Enums.TransactionType

export const TransactionType: typeof $Enums.TransactionType

export type ObjectiveStatus = $Enums.ObjectiveStatus

export const ObjectiveStatus: typeof $Enums.ObjectiveStatus

/**
 * ##  Prisma Client ʲˢ
 *
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more Users
 * const users = await prisma.user.findMany()
 * ```
 *
 *
 * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  const U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   *
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient()
   * // Fetch zero or more Users
   * const users = await prisma.user.findMany()
   * ```
   *
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
   */

  constructor(optionsArg ?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): PrismaClient;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;


  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/concepts/components/prisma-client/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>


  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb<ClientOptions>, ExtArgs, $Utils.Call<Prisma.TypeMapCb<ClientOptions>, {
    extArgs: ExtArgs
  }>>

      /**
   * `prisma.user`: Exposes CRUD operations for the **User** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Users
    * const users = await prisma.user.findMany()
    * ```
    */
  get user(): Prisma.UserDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.client`: Exposes CRUD operations for the **Client** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Clients
    * const clients = await prisma.client.findMany()
    * ```
    */
  get client(): Prisma.ClientDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.cycle`: Exposes CRUD operations for the **Cycle** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Cycles
    * const cycles = await prisma.cycle.findMany()
    * ```
    */
  get cycle(): Prisma.CycleDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.week`: Exposes CRUD operations for the **Week** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Weeks
    * const weeks = await prisma.week.findMany()
    * ```
    */
  get week(): Prisma.WeekDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.objective`: Exposes CRUD operations for the **Objective** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Objectives
    * const objectives = await prisma.objective.findMany()
    * ```
    */
  get objective(): Prisma.ObjectiveDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.transaction`: Exposes CRUD operations for the **Transaction** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Transactions
    * const transactions = await prisma.transaction.findMany()
    * ```
    */
  get transaction(): Prisma.TransactionDelegate<ExtArgs, ClientOptions>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql



  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
   * Metrics
   */
  export type Metrics = runtime.Metrics
  export type Metric<T> = runtime.Metric<T>
  export type MetricHistogram = runtime.MetricHistogram
  export type MetricHistogramBucket = runtime.MetricHistogramBucket

  /**
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 6.19.3
   * Query Engine version: c2990dca591cba766e3b7ef5d9e8a84796e47ab7
   */
  export type PrismaVersion = {
    client: string
  }

  export const prismaVersion: PrismaVersion

  /**
   * Utility Types
   */


  export import Bytes = runtime.Bytes
  export import JsonObject = runtime.JsonObject
  export import JsonArray = runtime.JsonArray
  export import JsonValue = runtime.JsonValue
  export import InputJsonObject = runtime.InputJsonObject
  export import InputJsonArray = runtime.InputJsonArray
  export import InputJsonValue = runtime.InputJsonValue

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }

  type SelectAndOmit = {
    select: any
    omit: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : T extends SelectAndOmit
        ? 'Please either choose `select` or `omit`.'
        : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      (Without<T, U> & U) | (Without<U, T> & T)
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? P : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
    User: 'User',
    Client: 'Client',
    Cycle: 'Cycle',
    Week: 'Week',
    Objective: 'Objective',
    Transaction: 'Transaction'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]


  export type Datasources = {
    db?: Datasource
  }

  interface TypeMapCb<ClientOptions = {}> extends $Utils.Fn<{extArgs: $Extensions.InternalArgs }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], ClientOptions extends { omit: infer OmitOptions } ? OmitOptions : {}>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> = {
    globalOmitOptions: {
      omit: GlobalOmitOptions
    }
    meta: {
      modelProps: "user" | "client" | "cycle" | "week" | "objective" | "transaction"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      User: {
        payload: Prisma.$UserPayload<ExtArgs>
        fields: Prisma.UserFieldRefs
        operations: {
          findUnique: {
            args: Prisma.UserFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.UserFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findFirst: {
            args: Prisma.UserFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.UserFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findMany: {
            args: Prisma.UserFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          create: {
            args: Prisma.UserCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          createMany: {
            args: Prisma.UserCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.UserCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          delete: {
            args: Prisma.UserDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          update: {
            args: Prisma.UserUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          deleteMany: {
            args: Prisma.UserDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.UserUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.UserUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          upsert: {
            args: Prisma.UserUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          aggregate: {
            args: Prisma.UserAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateUser>
          }
          groupBy: {
            args: Prisma.UserGroupByArgs<ExtArgs>
            result: $Utils.Optional<UserGroupByOutputType>[]
          }
          count: {
            args: Prisma.UserCountArgs<ExtArgs>
            result: $Utils.Optional<UserCountAggregateOutputType> | number
          }
        }
      }
      Client: {
        payload: Prisma.$ClientPayload<ExtArgs>
        fields: Prisma.ClientFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ClientFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ClientPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ClientFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ClientPayload>
          }
          findFirst: {
            args: Prisma.ClientFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ClientPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ClientFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ClientPayload>
          }
          findMany: {
            args: Prisma.ClientFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ClientPayload>[]
          }
          create: {
            args: Prisma.ClientCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ClientPayload>
          }
          createMany: {
            args: Prisma.ClientCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ClientCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ClientPayload>[]
          }
          delete: {
            args: Prisma.ClientDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ClientPayload>
          }
          update: {
            args: Prisma.ClientUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ClientPayload>
          }
          deleteMany: {
            args: Prisma.ClientDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ClientUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.ClientUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ClientPayload>[]
          }
          upsert: {
            args: Prisma.ClientUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ClientPayload>
          }
          aggregate: {
            args: Prisma.ClientAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateClient>
          }
          groupBy: {
            args: Prisma.ClientGroupByArgs<ExtArgs>
            result: $Utils.Optional<ClientGroupByOutputType>[]
          }
          count: {
            args: Prisma.ClientCountArgs<ExtArgs>
            result: $Utils.Optional<ClientCountAggregateOutputType> | number
          }
        }
      }
      Cycle: {
        payload: Prisma.$CyclePayload<ExtArgs>
        fields: Prisma.CycleFieldRefs
        operations: {
          findUnique: {
            args: Prisma.CycleFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CyclePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.CycleFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CyclePayload>
          }
          findFirst: {
            args: Prisma.CycleFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CyclePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.CycleFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CyclePayload>
          }
          findMany: {
            args: Prisma.CycleFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CyclePayload>[]
          }
          create: {
            args: Prisma.CycleCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CyclePayload>
          }
          createMany: {
            args: Prisma.CycleCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.CycleCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CyclePayload>[]
          }
          delete: {
            args: Prisma.CycleDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CyclePayload>
          }
          update: {
            args: Prisma.CycleUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CyclePayload>
          }
          deleteMany: {
            args: Prisma.CycleDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.CycleUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.CycleUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CyclePayload>[]
          }
          upsert: {
            args: Prisma.CycleUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CyclePayload>
          }
          aggregate: {
            args: Prisma.CycleAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateCycle>
          }
          groupBy: {
            args: Prisma.CycleGroupByArgs<ExtArgs>
            result: $Utils.Optional<CycleGroupByOutputType>[]
          }
          count: {
            args: Prisma.CycleCountArgs<ExtArgs>
            result: $Utils.Optional<CycleCountAggregateOutputType> | number
          }
        }
      }
      Week: {
        payload: Prisma.$WeekPayload<ExtArgs>
        fields: Prisma.WeekFieldRefs
        operations: {
          findUnique: {
            args: Prisma.WeekFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WeekPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.WeekFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WeekPayload>
          }
          findFirst: {
            args: Prisma.WeekFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WeekPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.WeekFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WeekPayload>
          }
          findMany: {
            args: Prisma.WeekFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WeekPayload>[]
          }
          create: {
            args: Prisma.WeekCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WeekPayload>
          }
          createMany: {
            args: Prisma.WeekCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.WeekCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WeekPayload>[]
          }
          delete: {
            args: Prisma.WeekDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WeekPayload>
          }
          update: {
            args: Prisma.WeekUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WeekPayload>
          }
          deleteMany: {
            args: Prisma.WeekDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.WeekUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.WeekUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WeekPayload>[]
          }
          upsert: {
            args: Prisma.WeekUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WeekPayload>
          }
          aggregate: {
            args: Prisma.WeekAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateWeek>
          }
          groupBy: {
            args: Prisma.WeekGroupByArgs<ExtArgs>
            result: $Utils.Optional<WeekGroupByOutputType>[]
          }
          count: {
            args: Prisma.WeekCountArgs<ExtArgs>
            result: $Utils.Optional<WeekCountAggregateOutputType> | number
          }
        }
      }
      Objective: {
        payload: Prisma.$ObjectivePayload<ExtArgs>
        fields: Prisma.ObjectiveFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ObjectiveFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ObjectivePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ObjectiveFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ObjectivePayload>
          }
          findFirst: {
            args: Prisma.ObjectiveFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ObjectivePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ObjectiveFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ObjectivePayload>
          }
          findMany: {
            args: Prisma.ObjectiveFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ObjectivePayload>[]
          }
          create: {
            args: Prisma.ObjectiveCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ObjectivePayload>
          }
          createMany: {
            args: Prisma.ObjectiveCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ObjectiveCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ObjectivePayload>[]
          }
          delete: {
            args: Prisma.ObjectiveDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ObjectivePayload>
          }
          update: {
            args: Prisma.ObjectiveUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ObjectivePayload>
          }
          deleteMany: {
            args: Prisma.ObjectiveDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ObjectiveUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.ObjectiveUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ObjectivePayload>[]
          }
          upsert: {
            args: Prisma.ObjectiveUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ObjectivePayload>
          }
          aggregate: {
            args: Prisma.ObjectiveAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateObjective>
          }
          groupBy: {
            args: Prisma.ObjectiveGroupByArgs<ExtArgs>
            result: $Utils.Optional<ObjectiveGroupByOutputType>[]
          }
          count: {
            args: Prisma.ObjectiveCountArgs<ExtArgs>
            result: $Utils.Optional<ObjectiveCountAggregateOutputType> | number
          }
        }
      }
      Transaction: {
        payload: Prisma.$TransactionPayload<ExtArgs>
        fields: Prisma.TransactionFieldRefs
        operations: {
          findUnique: {
            args: Prisma.TransactionFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TransactionPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.TransactionFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TransactionPayload>
          }
          findFirst: {
            args: Prisma.TransactionFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TransactionPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.TransactionFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TransactionPayload>
          }
          findMany: {
            args: Prisma.TransactionFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TransactionPayload>[]
          }
          create: {
            args: Prisma.TransactionCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TransactionPayload>
          }
          createMany: {
            args: Prisma.TransactionCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.TransactionCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TransactionPayload>[]
          }
          delete: {
            args: Prisma.TransactionDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TransactionPayload>
          }
          update: {
            args: Prisma.TransactionUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TransactionPayload>
          }
          deleteMany: {
            args: Prisma.TransactionDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.TransactionUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.TransactionUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TransactionPayload>[]
          }
          upsert: {
            args: Prisma.TransactionUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TransactionPayload>
          }
          aggregate: {
            args: Prisma.TransactionAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateTransaction>
          }
          groupBy: {
            args: Prisma.TransactionGroupByArgs<ExtArgs>
            result: $Utils.Optional<TransactionGroupByOutputType>[]
          }
          count: {
            args: Prisma.TransactionCountArgs<ExtArgs>
            result: $Utils.Optional<TransactionCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<"define", Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasources?: Datasources
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasourceUrl?: string
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Shorthand for `emit: 'stdout'`
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events only
     * log: [
     *   { emit: 'event', level: 'query' },
     *   { emit: 'event', level: 'info' },
     *   { emit: 'event', level: 'warn' }
     *   { emit: 'event', level: 'error' }
     * ]
     * 
     * / Emit as events and log to stdout
     * og: [
     *  { emit: 'stdout', level: 'query' },
     *  { emit: 'stdout', level: 'info' },
     *  { emit: 'stdout', level: 'warn' }
     *  { emit: 'stdout', level: 'error' }
     * 
     * ```
     * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/logging#the-log-option).
     */
    log?: (LogLevel | LogDefinition)[]
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number
      timeout?: number
      isolationLevel?: Prisma.TransactionIsolationLevel
    }
    /**
     * Instance of a Driver Adapter, e.g., like one provided by `@prisma/adapter-planetscale`
     */
    adapter?: runtime.SqlDriverAdapterFactory | null
    /**
     * Global configuration for omitting model fields by default.
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   omit: {
     *     user: {
     *       password: true
     *     }
     *   }
     * })
     * ```
     */
    omit?: Prisma.GlobalOmitConfig
  }
  export type GlobalOmitConfig = {
    user?: UserOmit
    client?: ClientOmit
    cycle?: CycleOmit
    week?: WeekOmit
    objective?: ObjectiveOmit
    transaction?: TransactionOmit
  }

  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type CheckIsLogLevel<T> = T extends LogLevel ? T : never;

  export type GetLogType<T> = CheckIsLogLevel<
    T extends LogDefinition ? T['level'] : T
  >;

  export type GetEvents<T extends any[]> = T extends Array<LogLevel | LogDefinition>
    ? GetLogType<T[number]>
    : never;

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'updateManyAndReturn'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy'

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */


  /**
   * Count Type UserCountOutputType
   */

  export type UserCountOutputType = {
    managed: number
  }

  export type UserCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    managed?: boolean | UserCountOutputTypeCountManagedArgs
  }

  // Custom InputTypes
  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserCountOutputType
     */
    select?: UserCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountManagedArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ClientWhereInput
  }


  /**
   * Count Type ClientCountOutputType
   */

  export type ClientCountOutputType = {
    cycles: number
    transactions: number
  }

  export type ClientCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    cycles?: boolean | ClientCountOutputTypeCountCyclesArgs
    transactions?: boolean | ClientCountOutputTypeCountTransactionsArgs
  }

  // Custom InputTypes
  /**
   * ClientCountOutputType without action
   */
  export type ClientCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ClientCountOutputType
     */
    select?: ClientCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * ClientCountOutputType without action
   */
  export type ClientCountOutputTypeCountCyclesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: CycleWhereInput
  }

  /**
   * ClientCountOutputType without action
   */
  export type ClientCountOutputTypeCountTransactionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TransactionWhereInput
  }


  /**
   * Count Type CycleCountOutputType
   */

  export type CycleCountOutputType = {
    weeks: number
    objectives: number
  }

  export type CycleCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    weeks?: boolean | CycleCountOutputTypeCountWeeksArgs
    objectives?: boolean | CycleCountOutputTypeCountObjectivesArgs
  }

  // Custom InputTypes
  /**
   * CycleCountOutputType without action
   */
  export type CycleCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CycleCountOutputType
     */
    select?: CycleCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * CycleCountOutputType without action
   */
  export type CycleCountOutputTypeCountWeeksArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: WeekWhereInput
  }

  /**
   * CycleCountOutputType without action
   */
  export type CycleCountOutputTypeCountObjectivesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ObjectiveWhereInput
  }


  /**
   * Models
   */

  /**
   * Model User
   */

  export type AggregateUser = {
    _count: UserCountAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  export type UserMinAggregateOutputType = {
    id: string | null
    email: string | null
    password: string | null
    name: string | null
    role: $Enums.Role | null
    createdAt: Date | null
  }

  export type UserMaxAggregateOutputType = {
    id: string | null
    email: string | null
    password: string | null
    name: string | null
    role: $Enums.Role | null
    createdAt: Date | null
  }

  export type UserCountAggregateOutputType = {
    id: number
    email: number
    password: number
    name: number
    role: number
    createdAt: number
    _all: number
  }


  export type UserMinAggregateInputType = {
    id?: true
    email?: true
    password?: true
    name?: true
    role?: true
    createdAt?: true
  }

  export type UserMaxAggregateInputType = {
    id?: true
    email?: true
    password?: true
    name?: true
    role?: true
    createdAt?: true
  }

  export type UserCountAggregateInputType = {
    id?: true
    email?: true
    password?: true
    name?: true
    role?: true
    createdAt?: true
    _all?: true
  }

  export type UserAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which User to aggregate.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Users
    **/
    _count?: true | UserCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: UserMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: UserMaxAggregateInputType
  }

  export type GetUserAggregateType<T extends UserAggregateArgs> = {
        [P in keyof T & keyof AggregateUser]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateUser[P]>
      : GetScalarType<T[P], AggregateUser[P]>
  }




  export type UserGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserWhereInput
    orderBy?: UserOrderByWithAggregationInput | UserOrderByWithAggregationInput[]
    by: UserScalarFieldEnum[] | UserScalarFieldEnum
    having?: UserScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: UserCountAggregateInputType | true
    _min?: UserMinAggregateInputType
    _max?: UserMaxAggregateInputType
  }

  export type UserGroupByOutputType = {
    id: string
    email: string
    password: string
    name: string | null
    role: $Enums.Role
    createdAt: Date
    _count: UserCountAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  type GetUserGroupByPayload<T extends UserGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<UserGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof UserGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], UserGroupByOutputType[P]>
            : GetScalarType<T[P], UserGroupByOutputType[P]>
        }
      >
    >


  export type UserSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    email?: boolean
    password?: boolean
    name?: boolean
    role?: boolean
    createdAt?: boolean
    client?: boolean | User$clientArgs<ExtArgs>
    managed?: boolean | User$managedArgs<ExtArgs>
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["user"]>

  export type UserSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    email?: boolean
    password?: boolean
    name?: boolean
    role?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["user"]>

  export type UserSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    email?: boolean
    password?: boolean
    name?: boolean
    role?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["user"]>

  export type UserSelectScalar = {
    id?: boolean
    email?: boolean
    password?: boolean
    name?: boolean
    role?: boolean
    createdAt?: boolean
  }

  export type UserOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "email" | "password" | "name" | "role" | "createdAt", ExtArgs["result"]["user"]>
  export type UserInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    client?: boolean | User$clientArgs<ExtArgs>
    managed?: boolean | User$managedArgs<ExtArgs>
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type UserIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type UserIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $UserPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "User"
    objects: {
      client: Prisma.$ClientPayload<ExtArgs> | null
      managed: Prisma.$ClientPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      email: string
      password: string
      name: string | null
      role: $Enums.Role
      createdAt: Date
    }, ExtArgs["result"]["user"]>
    composites: {}
  }

  type UserGetPayload<S extends boolean | null | undefined | UserDefaultArgs> = $Result.GetResult<Prisma.$UserPayload, S>

  type UserCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<UserFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: UserCountAggregateInputType | true
    }

  export interface UserDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['User'], meta: { name: 'User' } }
    /**
     * Find zero or one User that matches the filter.
     * @param {UserFindUniqueArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends UserFindUniqueArgs>(args: SelectSubset<T, UserFindUniqueArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one User that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {UserFindUniqueOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends UserFindUniqueOrThrowArgs>(args: SelectSubset<T, UserFindUniqueOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first User that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends UserFindFirstArgs>(args?: SelectSubset<T, UserFindFirstArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first User that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends UserFindFirstOrThrowArgs>(args?: SelectSubset<T, UserFindFirstOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Users that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Users
     * const users = await prisma.user.findMany()
     * 
     * // Get first 10 Users
     * const users = await prisma.user.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const userWithIdOnly = await prisma.user.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends UserFindManyArgs>(args?: SelectSubset<T, UserFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a User.
     * @param {UserCreateArgs} args - Arguments to create a User.
     * @example
     * // Create one User
     * const User = await prisma.user.create({
     *   data: {
     *     // ... data to create a User
     *   }
     * })
     * 
     */
    create<T extends UserCreateArgs>(args: SelectSubset<T, UserCreateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Users.
     * @param {UserCreateManyArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends UserCreateManyArgs>(args?: SelectSubset<T, UserCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Users and returns the data saved in the database.
     * @param {UserCreateManyAndReturnArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Users and only return the `id`
     * const userWithIdOnly = await prisma.user.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends UserCreateManyAndReturnArgs>(args?: SelectSubset<T, UserCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a User.
     * @param {UserDeleteArgs} args - Arguments to delete one User.
     * @example
     * // Delete one User
     * const User = await prisma.user.delete({
     *   where: {
     *     // ... filter to delete one User
     *   }
     * })
     * 
     */
    delete<T extends UserDeleteArgs>(args: SelectSubset<T, UserDeleteArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one User.
     * @param {UserUpdateArgs} args - Arguments to update one User.
     * @example
     * // Update one User
     * const user = await prisma.user.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends UserUpdateArgs>(args: SelectSubset<T, UserUpdateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Users.
     * @param {UserDeleteManyArgs} args - Arguments to filter Users to delete.
     * @example
     * // Delete a few Users
     * const { count } = await prisma.user.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends UserDeleteManyArgs>(args?: SelectSubset<T, UserDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Users
     * const user = await prisma.user.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends UserUpdateManyArgs>(args: SelectSubset<T, UserUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Users and returns the data updated in the database.
     * @param {UserUpdateManyAndReturnArgs} args - Arguments to update many Users.
     * @example
     * // Update many Users
     * const user = await prisma.user.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Users and only return the `id`
     * const userWithIdOnly = await prisma.user.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends UserUpdateManyAndReturnArgs>(args: SelectSubset<T, UserUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one User.
     * @param {UserUpsertArgs} args - Arguments to update or create a User.
     * @example
     * // Update or create a User
     * const user = await prisma.user.upsert({
     *   create: {
     *     // ... data to create a User
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the User we want to update
     *   }
     * })
     */
    upsert<T extends UserUpsertArgs>(args: SelectSubset<T, UserUpsertArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserCountArgs} args - Arguments to filter Users to count.
     * @example
     * // Count the number of Users
     * const count = await prisma.user.count({
     *   where: {
     *     // ... the filter for the Users we want to count
     *   }
     * })
    **/
    count<T extends UserCountArgs>(
      args?: Subset<T, UserCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], UserCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends UserAggregateArgs>(args: Subset<T, UserAggregateArgs>): Prisma.PrismaPromise<GetUserAggregateType<T>>

    /**
     * Group by User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends UserGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: UserGroupByArgs['orderBy'] }
        : { orderBy?: UserGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, UserGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUserGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the User model
   */
  readonly fields: UserFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for User.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__UserClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    client<T extends User$clientArgs<ExtArgs> = {}>(args?: Subset<T, User$clientArgs<ExtArgs>>): Prisma__ClientClient<$Result.GetResult<Prisma.$ClientPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    managed<T extends User$managedArgs<ExtArgs> = {}>(args?: Subset<T, User$managedArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ClientPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the User model
   */
  interface UserFieldRefs {
    readonly id: FieldRef<"User", 'String'>
    readonly email: FieldRef<"User", 'String'>
    readonly password: FieldRef<"User", 'String'>
    readonly name: FieldRef<"User", 'String'>
    readonly role: FieldRef<"User", 'Role'>
    readonly createdAt: FieldRef<"User", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * User findUnique
   */
  export type UserFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findUniqueOrThrow
   */
  export type UserFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findFirst
   */
  export type UserFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findFirstOrThrow
   */
  export type UserFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findMany
   */
  export type UserFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which Users to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User create
   */
  export type UserCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The data needed to create a User.
     */
    data: XOR<UserCreateInput, UserUncheckedCreateInput>
  }

  /**
   * User createMany
   */
  export type UserCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * User createManyAndReturn
   */
  export type UserCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * User update
   */
  export type UserUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The data needed to update a User.
     */
    data: XOR<UserUpdateInput, UserUncheckedUpdateInput>
    /**
     * Choose, which User to update.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User updateMany
   */
  export type UserUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Users.
     */
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyInput>
    /**
     * Filter which Users to update
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to update.
     */
    limit?: number
  }

  /**
   * User updateManyAndReturn
   */
  export type UserUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * The data used to update Users.
     */
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyInput>
    /**
     * Filter which Users to update
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to update.
     */
    limit?: number
  }

  /**
   * User upsert
   */
  export type UserUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The filter to search for the User to update in case it exists.
     */
    where: UserWhereUniqueInput
    /**
     * In case the User found by the `where` argument doesn't exist, create a new User with this data.
     */
    create: XOR<UserCreateInput, UserUncheckedCreateInput>
    /**
     * In case the User was found with the provided `where` argument, update it with this data.
     */
    update: XOR<UserUpdateInput, UserUncheckedUpdateInput>
  }

  /**
   * User delete
   */
  export type UserDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter which User to delete.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User deleteMany
   */
  export type UserDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Users to delete
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to delete.
     */
    limit?: number
  }

  /**
   * User.client
   */
  export type User$clientArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Client
     */
    select?: ClientSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Client
     */
    omit?: ClientOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ClientInclude<ExtArgs> | null
    where?: ClientWhereInput
  }

  /**
   * User.managed
   */
  export type User$managedArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Client
     */
    select?: ClientSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Client
     */
    omit?: ClientOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ClientInclude<ExtArgs> | null
    where?: ClientWhereInput
    orderBy?: ClientOrderByWithRelationInput | ClientOrderByWithRelationInput[]
    cursor?: ClientWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ClientScalarFieldEnum | ClientScalarFieldEnum[]
  }

  /**
   * User without action
   */
  export type UserDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
  }


  /**
   * Model Client
   */

  export type AggregateClient = {
    _count: ClientCountAggregateOutputType | null
    _min: ClientMinAggregateOutputType | null
    _max: ClientMaxAggregateOutputType | null
  }

  export type ClientMinAggregateOutputType = {
    id: string | null
    userId: string | null
    adminId: string | null
    companyName: string | null
    sector: string | null
    status: string | null
  }

  export type ClientMaxAggregateOutputType = {
    id: string | null
    userId: string | null
    adminId: string | null
    companyName: string | null
    sector: string | null
    status: string | null
  }

  export type ClientCountAggregateOutputType = {
    id: number
    userId: number
    adminId: number
    companyName: number
    sector: number
    status: number
    _all: number
  }


  export type ClientMinAggregateInputType = {
    id?: true
    userId?: true
    adminId?: true
    companyName?: true
    sector?: true
    status?: true
  }

  export type ClientMaxAggregateInputType = {
    id?: true
    userId?: true
    adminId?: true
    companyName?: true
    sector?: true
    status?: true
  }

  export type ClientCountAggregateInputType = {
    id?: true
    userId?: true
    adminId?: true
    companyName?: true
    sector?: true
    status?: true
    _all?: true
  }

  export type ClientAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Client to aggregate.
     */
    where?: ClientWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Clients to fetch.
     */
    orderBy?: ClientOrderByWithRelationInput | ClientOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ClientWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Clients from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Clients.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Clients
    **/
    _count?: true | ClientCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ClientMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ClientMaxAggregateInputType
  }

  export type GetClientAggregateType<T extends ClientAggregateArgs> = {
        [P in keyof T & keyof AggregateClient]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateClient[P]>
      : GetScalarType<T[P], AggregateClient[P]>
  }




  export type ClientGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ClientWhereInput
    orderBy?: ClientOrderByWithAggregationInput | ClientOrderByWithAggregationInput[]
    by: ClientScalarFieldEnum[] | ClientScalarFieldEnum
    having?: ClientScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ClientCountAggregateInputType | true
    _min?: ClientMinAggregateInputType
    _max?: ClientMaxAggregateInputType
  }

  export type ClientGroupByOutputType = {
    id: string
    userId: string
    adminId: string | null
    companyName: string
    sector: string | null
    status: string | null
    _count: ClientCountAggregateOutputType | null
    _min: ClientMinAggregateOutputType | null
    _max: ClientMaxAggregateOutputType | null
  }

  type GetClientGroupByPayload<T extends ClientGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ClientGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ClientGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ClientGroupByOutputType[P]>
            : GetScalarType<T[P], ClientGroupByOutputType[P]>
        }
      >
    >


  export type ClientSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    adminId?: boolean
    companyName?: boolean
    sector?: boolean
    status?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
    admin?: boolean | Client$adminArgs<ExtArgs>
    cycles?: boolean | Client$cyclesArgs<ExtArgs>
    transactions?: boolean | Client$transactionsArgs<ExtArgs>
    _count?: boolean | ClientCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["client"]>

  export type ClientSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    adminId?: boolean
    companyName?: boolean
    sector?: boolean
    status?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
    admin?: boolean | Client$adminArgs<ExtArgs>
  }, ExtArgs["result"]["client"]>

  export type ClientSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    adminId?: boolean
    companyName?: boolean
    sector?: boolean
    status?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
    admin?: boolean | Client$adminArgs<ExtArgs>
  }, ExtArgs["result"]["client"]>

  export type ClientSelectScalar = {
    id?: boolean
    userId?: boolean
    adminId?: boolean
    companyName?: boolean
    sector?: boolean
    status?: boolean
  }

  export type ClientOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "userId" | "adminId" | "companyName" | "sector" | "status", ExtArgs["result"]["client"]>
  export type ClientInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
    admin?: boolean | Client$adminArgs<ExtArgs>
    cycles?: boolean | Client$cyclesArgs<ExtArgs>
    transactions?: boolean | Client$transactionsArgs<ExtArgs>
    _count?: boolean | ClientCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type ClientIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
    admin?: boolean | Client$adminArgs<ExtArgs>
  }
  export type ClientIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
    admin?: boolean | Client$adminArgs<ExtArgs>
  }

  export type $ClientPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Client"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
      admin: Prisma.$UserPayload<ExtArgs> | null
      cycles: Prisma.$CyclePayload<ExtArgs>[]
      transactions: Prisma.$TransactionPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      userId: string
      adminId: string | null
      companyName: string
      sector: string | null
      status: string | null
    }, ExtArgs["result"]["client"]>
    composites: {}
  }

  type ClientGetPayload<S extends boolean | null | undefined | ClientDefaultArgs> = $Result.GetResult<Prisma.$ClientPayload, S>

  type ClientCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<ClientFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ClientCountAggregateInputType | true
    }

  export interface ClientDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Client'], meta: { name: 'Client' } }
    /**
     * Find zero or one Client that matches the filter.
     * @param {ClientFindUniqueArgs} args - Arguments to find a Client
     * @example
     * // Get one Client
     * const client = await prisma.client.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ClientFindUniqueArgs>(args: SelectSubset<T, ClientFindUniqueArgs<ExtArgs>>): Prisma__ClientClient<$Result.GetResult<Prisma.$ClientPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Client that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ClientFindUniqueOrThrowArgs} args - Arguments to find a Client
     * @example
     * // Get one Client
     * const client = await prisma.client.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ClientFindUniqueOrThrowArgs>(args: SelectSubset<T, ClientFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ClientClient<$Result.GetResult<Prisma.$ClientPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Client that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ClientFindFirstArgs} args - Arguments to find a Client
     * @example
     * // Get one Client
     * const client = await prisma.client.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ClientFindFirstArgs>(args?: SelectSubset<T, ClientFindFirstArgs<ExtArgs>>): Prisma__ClientClient<$Result.GetResult<Prisma.$ClientPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Client that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ClientFindFirstOrThrowArgs} args - Arguments to find a Client
     * @example
     * // Get one Client
     * const client = await prisma.client.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ClientFindFirstOrThrowArgs>(args?: SelectSubset<T, ClientFindFirstOrThrowArgs<ExtArgs>>): Prisma__ClientClient<$Result.GetResult<Prisma.$ClientPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Clients that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ClientFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Clients
     * const clients = await prisma.client.findMany()
     * 
     * // Get first 10 Clients
     * const clients = await prisma.client.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const clientWithIdOnly = await prisma.client.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ClientFindManyArgs>(args?: SelectSubset<T, ClientFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ClientPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Client.
     * @param {ClientCreateArgs} args - Arguments to create a Client.
     * @example
     * // Create one Client
     * const Client = await prisma.client.create({
     *   data: {
     *     // ... data to create a Client
     *   }
     * })
     * 
     */
    create<T extends ClientCreateArgs>(args: SelectSubset<T, ClientCreateArgs<ExtArgs>>): Prisma__ClientClient<$Result.GetResult<Prisma.$ClientPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Clients.
     * @param {ClientCreateManyArgs} args - Arguments to create many Clients.
     * @example
     * // Create many Clients
     * const client = await prisma.client.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ClientCreateManyArgs>(args?: SelectSubset<T, ClientCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Clients and returns the data saved in the database.
     * @param {ClientCreateManyAndReturnArgs} args - Arguments to create many Clients.
     * @example
     * // Create many Clients
     * const client = await prisma.client.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Clients and only return the `id`
     * const clientWithIdOnly = await prisma.client.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ClientCreateManyAndReturnArgs>(args?: SelectSubset<T, ClientCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ClientPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Client.
     * @param {ClientDeleteArgs} args - Arguments to delete one Client.
     * @example
     * // Delete one Client
     * const Client = await prisma.client.delete({
     *   where: {
     *     // ... filter to delete one Client
     *   }
     * })
     * 
     */
    delete<T extends ClientDeleteArgs>(args: SelectSubset<T, ClientDeleteArgs<ExtArgs>>): Prisma__ClientClient<$Result.GetResult<Prisma.$ClientPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Client.
     * @param {ClientUpdateArgs} args - Arguments to update one Client.
     * @example
     * // Update one Client
     * const client = await prisma.client.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ClientUpdateArgs>(args: SelectSubset<T, ClientUpdateArgs<ExtArgs>>): Prisma__ClientClient<$Result.GetResult<Prisma.$ClientPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Clients.
     * @param {ClientDeleteManyArgs} args - Arguments to filter Clients to delete.
     * @example
     * // Delete a few Clients
     * const { count } = await prisma.client.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ClientDeleteManyArgs>(args?: SelectSubset<T, ClientDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Clients.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ClientUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Clients
     * const client = await prisma.client.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ClientUpdateManyArgs>(args: SelectSubset<T, ClientUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Clients and returns the data updated in the database.
     * @param {ClientUpdateManyAndReturnArgs} args - Arguments to update many Clients.
     * @example
     * // Update many Clients
     * const client = await prisma.client.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Clients and only return the `id`
     * const clientWithIdOnly = await prisma.client.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends ClientUpdateManyAndReturnArgs>(args: SelectSubset<T, ClientUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ClientPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Client.
     * @param {ClientUpsertArgs} args - Arguments to update or create a Client.
     * @example
     * // Update or create a Client
     * const client = await prisma.client.upsert({
     *   create: {
     *     // ... data to create a Client
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Client we want to update
     *   }
     * })
     */
    upsert<T extends ClientUpsertArgs>(args: SelectSubset<T, ClientUpsertArgs<ExtArgs>>): Prisma__ClientClient<$Result.GetResult<Prisma.$ClientPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Clients.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ClientCountArgs} args - Arguments to filter Clients to count.
     * @example
     * // Count the number of Clients
     * const count = await prisma.client.count({
     *   where: {
     *     // ... the filter for the Clients we want to count
     *   }
     * })
    **/
    count<T extends ClientCountArgs>(
      args?: Subset<T, ClientCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ClientCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Client.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ClientAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ClientAggregateArgs>(args: Subset<T, ClientAggregateArgs>): Prisma.PrismaPromise<GetClientAggregateType<T>>

    /**
     * Group by Client.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ClientGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ClientGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ClientGroupByArgs['orderBy'] }
        : { orderBy?: ClientGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ClientGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetClientGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Client model
   */
  readonly fields: ClientFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Client.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ClientClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    admin<T extends Client$adminArgs<ExtArgs> = {}>(args?: Subset<T, Client$adminArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    cycles<T extends Client$cyclesArgs<ExtArgs> = {}>(args?: Subset<T, Client$cyclesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CyclePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    transactions<T extends Client$transactionsArgs<ExtArgs> = {}>(args?: Subset<T, Client$transactionsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TransactionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Client model
   */
  interface ClientFieldRefs {
    readonly id: FieldRef<"Client", 'String'>
    readonly userId: FieldRef<"Client", 'String'>
    readonly adminId: FieldRef<"Client", 'String'>
    readonly companyName: FieldRef<"Client", 'String'>
    readonly sector: FieldRef<"Client", 'String'>
    readonly status: FieldRef<"Client", 'String'>
  }
    

  // Custom InputTypes
  /**
   * Client findUnique
   */
  export type ClientFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Client
     */
    select?: ClientSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Client
     */
    omit?: ClientOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ClientInclude<ExtArgs> | null
    /**
     * Filter, which Client to fetch.
     */
    where: ClientWhereUniqueInput
  }

  /**
   * Client findUniqueOrThrow
   */
  export type ClientFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Client
     */
    select?: ClientSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Client
     */
    omit?: ClientOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ClientInclude<ExtArgs> | null
    /**
     * Filter, which Client to fetch.
     */
    where: ClientWhereUniqueInput
  }

  /**
   * Client findFirst
   */
  export type ClientFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Client
     */
    select?: ClientSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Client
     */
    omit?: ClientOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ClientInclude<ExtArgs> | null
    /**
     * Filter, which Client to fetch.
     */
    where?: ClientWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Clients to fetch.
     */
    orderBy?: ClientOrderByWithRelationInput | ClientOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Clients.
     */
    cursor?: ClientWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Clients from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Clients.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Clients.
     */
    distinct?: ClientScalarFieldEnum | ClientScalarFieldEnum[]
  }

  /**
   * Client findFirstOrThrow
   */
  export type ClientFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Client
     */
    select?: ClientSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Client
     */
    omit?: ClientOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ClientInclude<ExtArgs> | null
    /**
     * Filter, which Client to fetch.
     */
    where?: ClientWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Clients to fetch.
     */
    orderBy?: ClientOrderByWithRelationInput | ClientOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Clients.
     */
    cursor?: ClientWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Clients from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Clients.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Clients.
     */
    distinct?: ClientScalarFieldEnum | ClientScalarFieldEnum[]
  }

  /**
   * Client findMany
   */
  export type ClientFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Client
     */
    select?: ClientSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Client
     */
    omit?: ClientOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ClientInclude<ExtArgs> | null
    /**
     * Filter, which Clients to fetch.
     */
    where?: ClientWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Clients to fetch.
     */
    orderBy?: ClientOrderByWithRelationInput | ClientOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Clients.
     */
    cursor?: ClientWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Clients from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Clients.
     */
    skip?: number
    distinct?: ClientScalarFieldEnum | ClientScalarFieldEnum[]
  }

  /**
   * Client create
   */
  export type ClientCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Client
     */
    select?: ClientSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Client
     */
    omit?: ClientOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ClientInclude<ExtArgs> | null
    /**
     * The data needed to create a Client.
     */
    data: XOR<ClientCreateInput, ClientUncheckedCreateInput>
  }

  /**
   * Client createMany
   */
  export type ClientCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Clients.
     */
    data: ClientCreateManyInput | ClientCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Client createManyAndReturn
   */
  export type ClientCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Client
     */
    select?: ClientSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Client
     */
    omit?: ClientOmit<ExtArgs> | null
    /**
     * The data used to create many Clients.
     */
    data: ClientCreateManyInput | ClientCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ClientIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Client update
   */
  export type ClientUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Client
     */
    select?: ClientSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Client
     */
    omit?: ClientOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ClientInclude<ExtArgs> | null
    /**
     * The data needed to update a Client.
     */
    data: XOR<ClientUpdateInput, ClientUncheckedUpdateInput>
    /**
     * Choose, which Client to update.
     */
    where: ClientWhereUniqueInput
  }

  /**
   * Client updateMany
   */
  export type ClientUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Clients.
     */
    data: XOR<ClientUpdateManyMutationInput, ClientUncheckedUpdateManyInput>
    /**
     * Filter which Clients to update
     */
    where?: ClientWhereInput
    /**
     * Limit how many Clients to update.
     */
    limit?: number
  }

  /**
   * Client updateManyAndReturn
   */
  export type ClientUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Client
     */
    select?: ClientSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Client
     */
    omit?: ClientOmit<ExtArgs> | null
    /**
     * The data used to update Clients.
     */
    data: XOR<ClientUpdateManyMutationInput, ClientUncheckedUpdateManyInput>
    /**
     * Filter which Clients to update
     */
    where?: ClientWhereInput
    /**
     * Limit how many Clients to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ClientIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Client upsert
   */
  export type ClientUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Client
     */
    select?: ClientSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Client
     */
    omit?: ClientOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ClientInclude<ExtArgs> | null
    /**
     * The filter to search for the Client to update in case it exists.
     */
    where: ClientWhereUniqueInput
    /**
     * In case the Client found by the `where` argument doesn't exist, create a new Client with this data.
     */
    create: XOR<ClientCreateInput, ClientUncheckedCreateInput>
    /**
     * In case the Client was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ClientUpdateInput, ClientUncheckedUpdateInput>
  }

  /**
   * Client delete
   */
  export type ClientDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Client
     */
    select?: ClientSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Client
     */
    omit?: ClientOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ClientInclude<ExtArgs> | null
    /**
     * Filter which Client to delete.
     */
    where: ClientWhereUniqueInput
  }

  /**
   * Client deleteMany
   */
  export type ClientDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Clients to delete
     */
    where?: ClientWhereInput
    /**
     * Limit how many Clients to delete.
     */
    limit?: number
  }

  /**
   * Client.admin
   */
  export type Client$adminArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    where?: UserWhereInput
  }

  /**
   * Client.cycles
   */
  export type Client$cyclesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Cycle
     */
    select?: CycleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Cycle
     */
    omit?: CycleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CycleInclude<ExtArgs> | null
    where?: CycleWhereInput
    orderBy?: CycleOrderByWithRelationInput | CycleOrderByWithRelationInput[]
    cursor?: CycleWhereUniqueInput
    take?: number
    skip?: number
    distinct?: CycleScalarFieldEnum | CycleScalarFieldEnum[]
  }

  /**
   * Client.transactions
   */
  export type Client$transactionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Transaction
     */
    select?: TransactionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Transaction
     */
    omit?: TransactionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TransactionInclude<ExtArgs> | null
    where?: TransactionWhereInput
    orderBy?: TransactionOrderByWithRelationInput | TransactionOrderByWithRelationInput[]
    cursor?: TransactionWhereUniqueInput
    take?: number
    skip?: number
    distinct?: TransactionScalarFieldEnum | TransactionScalarFieldEnum[]
  }

  /**
   * Client without action
   */
  export type ClientDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Client
     */
    select?: ClientSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Client
     */
    omit?: ClientOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ClientInclude<ExtArgs> | null
  }


  /**
   * Model Cycle
   */

  export type AggregateCycle = {
    _count: CycleCountAggregateOutputType | null
    _avg: CycleAvgAggregateOutputType | null
    _sum: CycleSumAggregateOutputType | null
    _min: CycleMinAggregateOutputType | null
    _max: CycleMaxAggregateOutputType | null
  }

  export type CycleAvgAggregateOutputType = {
    cycleNumber: number | null
    caTargetMonthly: number | null
  }

  export type CycleSumAggregateOutputType = {
    cycleNumber: number | null
    caTargetMonthly: number | null
  }

  export type CycleMinAggregateOutputType = {
    id: string | null
    clientId: string | null
    cycleNumber: number | null
    mainObjective: string | null
    caTargetMonthly: number | null
    startDate: Date | null
    endDate: Date | null
    status: $Enums.CycleStatus | null
    createdAt: Date | null
  }

  export type CycleMaxAggregateOutputType = {
    id: string | null
    clientId: string | null
    cycleNumber: number | null
    mainObjective: string | null
    caTargetMonthly: number | null
    startDate: Date | null
    endDate: Date | null
    status: $Enums.CycleStatus | null
    createdAt: Date | null
  }

  export type CycleCountAggregateOutputType = {
    id: number
    clientId: number
    cycleNumber: number
    mainObjective: number
    caTargetMonthly: number
    startDate: number
    endDate: number
    status: number
    createdAt: number
    _all: number
  }


  export type CycleAvgAggregateInputType = {
    cycleNumber?: true
    caTargetMonthly?: true
  }

  export type CycleSumAggregateInputType = {
    cycleNumber?: true
    caTargetMonthly?: true
  }

  export type CycleMinAggregateInputType = {
    id?: true
    clientId?: true
    cycleNumber?: true
    mainObjective?: true
    caTargetMonthly?: true
    startDate?: true
    endDate?: true
    status?: true
    createdAt?: true
  }

  export type CycleMaxAggregateInputType = {
    id?: true
    clientId?: true
    cycleNumber?: true
    mainObjective?: true
    caTargetMonthly?: true
    startDate?: true
    endDate?: true
    status?: true
    createdAt?: true
  }

  export type CycleCountAggregateInputType = {
    id?: true
    clientId?: true
    cycleNumber?: true
    mainObjective?: true
    caTargetMonthly?: true
    startDate?: true
    endDate?: true
    status?: true
    createdAt?: true
    _all?: true
  }

  export type CycleAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Cycle to aggregate.
     */
    where?: CycleWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Cycles to fetch.
     */
    orderBy?: CycleOrderByWithRelationInput | CycleOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: CycleWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Cycles from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Cycles.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Cycles
    **/
    _count?: true | CycleCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: CycleAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: CycleSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: CycleMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: CycleMaxAggregateInputType
  }

  export type GetCycleAggregateType<T extends CycleAggregateArgs> = {
        [P in keyof T & keyof AggregateCycle]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateCycle[P]>
      : GetScalarType<T[P], AggregateCycle[P]>
  }




  export type CycleGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: CycleWhereInput
    orderBy?: CycleOrderByWithAggregationInput | CycleOrderByWithAggregationInput[]
    by: CycleScalarFieldEnum[] | CycleScalarFieldEnum
    having?: CycleScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: CycleCountAggregateInputType | true
    _avg?: CycleAvgAggregateInputType
    _sum?: CycleSumAggregateInputType
    _min?: CycleMinAggregateInputType
    _max?: CycleMaxAggregateInputType
  }

  export type CycleGroupByOutputType = {
    id: string
    clientId: string
    cycleNumber: number
    mainObjective: string
    caTargetMonthly: number
    startDate: Date
    endDate: Date
    status: $Enums.CycleStatus
    createdAt: Date
    _count: CycleCountAggregateOutputType | null
    _avg: CycleAvgAggregateOutputType | null
    _sum: CycleSumAggregateOutputType | null
    _min: CycleMinAggregateOutputType | null
    _max: CycleMaxAggregateOutputType | null
  }

  type GetCycleGroupByPayload<T extends CycleGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<CycleGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof CycleGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], CycleGroupByOutputType[P]>
            : GetScalarType<T[P], CycleGroupByOutputType[P]>
        }
      >
    >


  export type CycleSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    clientId?: boolean
    cycleNumber?: boolean
    mainObjective?: boolean
    caTargetMonthly?: boolean
    startDate?: boolean
    endDate?: boolean
    status?: boolean
    createdAt?: boolean
    client?: boolean | ClientDefaultArgs<ExtArgs>
    weeks?: boolean | Cycle$weeksArgs<ExtArgs>
    objectives?: boolean | Cycle$objectivesArgs<ExtArgs>
    _count?: boolean | CycleCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["cycle"]>

  export type CycleSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    clientId?: boolean
    cycleNumber?: boolean
    mainObjective?: boolean
    caTargetMonthly?: boolean
    startDate?: boolean
    endDate?: boolean
    status?: boolean
    createdAt?: boolean
    client?: boolean | ClientDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["cycle"]>

  export type CycleSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    clientId?: boolean
    cycleNumber?: boolean
    mainObjective?: boolean
    caTargetMonthly?: boolean
    startDate?: boolean
    endDate?: boolean
    status?: boolean
    createdAt?: boolean
    client?: boolean | ClientDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["cycle"]>

  export type CycleSelectScalar = {
    id?: boolean
    clientId?: boolean
    cycleNumber?: boolean
    mainObjective?: boolean
    caTargetMonthly?: boolean
    startDate?: boolean
    endDate?: boolean
    status?: boolean
    createdAt?: boolean
  }

  export type CycleOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "clientId" | "cycleNumber" | "mainObjective" | "caTargetMonthly" | "startDate" | "endDate" | "status" | "createdAt", ExtArgs["result"]["cycle"]>
  export type CycleInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    client?: boolean | ClientDefaultArgs<ExtArgs>
    weeks?: boolean | Cycle$weeksArgs<ExtArgs>
    objectives?: boolean | Cycle$objectivesArgs<ExtArgs>
    _count?: boolean | CycleCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type CycleIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    client?: boolean | ClientDefaultArgs<ExtArgs>
  }
  export type CycleIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    client?: boolean | ClientDefaultArgs<ExtArgs>
  }

  export type $CyclePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Cycle"
    objects: {
      client: Prisma.$ClientPayload<ExtArgs>
      weeks: Prisma.$WeekPayload<ExtArgs>[]
      objectives: Prisma.$ObjectivePayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      clientId: string
      cycleNumber: number
      mainObjective: string
      caTargetMonthly: number
      startDate: Date
      endDate: Date
      status: $Enums.CycleStatus
      createdAt: Date
    }, ExtArgs["result"]["cycle"]>
    composites: {}
  }

  type CycleGetPayload<S extends boolean | null | undefined | CycleDefaultArgs> = $Result.GetResult<Prisma.$CyclePayload, S>

  type CycleCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<CycleFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: CycleCountAggregateInputType | true
    }

  export interface CycleDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Cycle'], meta: { name: 'Cycle' } }
    /**
     * Find zero or one Cycle that matches the filter.
     * @param {CycleFindUniqueArgs} args - Arguments to find a Cycle
     * @example
     * // Get one Cycle
     * const cycle = await prisma.cycle.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends CycleFindUniqueArgs>(args: SelectSubset<T, CycleFindUniqueArgs<ExtArgs>>): Prisma__CycleClient<$Result.GetResult<Prisma.$CyclePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Cycle that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {CycleFindUniqueOrThrowArgs} args - Arguments to find a Cycle
     * @example
     * // Get one Cycle
     * const cycle = await prisma.cycle.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends CycleFindUniqueOrThrowArgs>(args: SelectSubset<T, CycleFindUniqueOrThrowArgs<ExtArgs>>): Prisma__CycleClient<$Result.GetResult<Prisma.$CyclePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Cycle that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CycleFindFirstArgs} args - Arguments to find a Cycle
     * @example
     * // Get one Cycle
     * const cycle = await prisma.cycle.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends CycleFindFirstArgs>(args?: SelectSubset<T, CycleFindFirstArgs<ExtArgs>>): Prisma__CycleClient<$Result.GetResult<Prisma.$CyclePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Cycle that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CycleFindFirstOrThrowArgs} args - Arguments to find a Cycle
     * @example
     * // Get one Cycle
     * const cycle = await prisma.cycle.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends CycleFindFirstOrThrowArgs>(args?: SelectSubset<T, CycleFindFirstOrThrowArgs<ExtArgs>>): Prisma__CycleClient<$Result.GetResult<Prisma.$CyclePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Cycles that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CycleFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Cycles
     * const cycles = await prisma.cycle.findMany()
     * 
     * // Get first 10 Cycles
     * const cycles = await prisma.cycle.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const cycleWithIdOnly = await prisma.cycle.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends CycleFindManyArgs>(args?: SelectSubset<T, CycleFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CyclePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Cycle.
     * @param {CycleCreateArgs} args - Arguments to create a Cycle.
     * @example
     * // Create one Cycle
     * const Cycle = await prisma.cycle.create({
     *   data: {
     *     // ... data to create a Cycle
     *   }
     * })
     * 
     */
    create<T extends CycleCreateArgs>(args: SelectSubset<T, CycleCreateArgs<ExtArgs>>): Prisma__CycleClient<$Result.GetResult<Prisma.$CyclePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Cycles.
     * @param {CycleCreateManyArgs} args - Arguments to create many Cycles.
     * @example
     * // Create many Cycles
     * const cycle = await prisma.cycle.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends CycleCreateManyArgs>(args?: SelectSubset<T, CycleCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Cycles and returns the data saved in the database.
     * @param {CycleCreateManyAndReturnArgs} args - Arguments to create many Cycles.
     * @example
     * // Create many Cycles
     * const cycle = await prisma.cycle.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Cycles and only return the `id`
     * const cycleWithIdOnly = await prisma.cycle.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends CycleCreateManyAndReturnArgs>(args?: SelectSubset<T, CycleCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CyclePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Cycle.
     * @param {CycleDeleteArgs} args - Arguments to delete one Cycle.
     * @example
     * // Delete one Cycle
     * const Cycle = await prisma.cycle.delete({
     *   where: {
     *     // ... filter to delete one Cycle
     *   }
     * })
     * 
     */
    delete<T extends CycleDeleteArgs>(args: SelectSubset<T, CycleDeleteArgs<ExtArgs>>): Prisma__CycleClient<$Result.GetResult<Prisma.$CyclePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Cycle.
     * @param {CycleUpdateArgs} args - Arguments to update one Cycle.
     * @example
     * // Update one Cycle
     * const cycle = await prisma.cycle.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends CycleUpdateArgs>(args: SelectSubset<T, CycleUpdateArgs<ExtArgs>>): Prisma__CycleClient<$Result.GetResult<Prisma.$CyclePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Cycles.
     * @param {CycleDeleteManyArgs} args - Arguments to filter Cycles to delete.
     * @example
     * // Delete a few Cycles
     * const { count } = await prisma.cycle.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends CycleDeleteManyArgs>(args?: SelectSubset<T, CycleDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Cycles.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CycleUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Cycles
     * const cycle = await prisma.cycle.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends CycleUpdateManyArgs>(args: SelectSubset<T, CycleUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Cycles and returns the data updated in the database.
     * @param {CycleUpdateManyAndReturnArgs} args - Arguments to update many Cycles.
     * @example
     * // Update many Cycles
     * const cycle = await prisma.cycle.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Cycles and only return the `id`
     * const cycleWithIdOnly = await prisma.cycle.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends CycleUpdateManyAndReturnArgs>(args: SelectSubset<T, CycleUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CyclePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Cycle.
     * @param {CycleUpsertArgs} args - Arguments to update or create a Cycle.
     * @example
     * // Update or create a Cycle
     * const cycle = await prisma.cycle.upsert({
     *   create: {
     *     // ... data to create a Cycle
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Cycle we want to update
     *   }
     * })
     */
    upsert<T extends CycleUpsertArgs>(args: SelectSubset<T, CycleUpsertArgs<ExtArgs>>): Prisma__CycleClient<$Result.GetResult<Prisma.$CyclePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Cycles.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CycleCountArgs} args - Arguments to filter Cycles to count.
     * @example
     * // Count the number of Cycles
     * const count = await prisma.cycle.count({
     *   where: {
     *     // ... the filter for the Cycles we want to count
     *   }
     * })
    **/
    count<T extends CycleCountArgs>(
      args?: Subset<T, CycleCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], CycleCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Cycle.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CycleAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends CycleAggregateArgs>(args: Subset<T, CycleAggregateArgs>): Prisma.PrismaPromise<GetCycleAggregateType<T>>

    /**
     * Group by Cycle.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CycleGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends CycleGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: CycleGroupByArgs['orderBy'] }
        : { orderBy?: CycleGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, CycleGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetCycleGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Cycle model
   */
  readonly fields: CycleFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Cycle.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__CycleClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    client<T extends ClientDefaultArgs<ExtArgs> = {}>(args?: Subset<T, ClientDefaultArgs<ExtArgs>>): Prisma__ClientClient<$Result.GetResult<Prisma.$ClientPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    weeks<T extends Cycle$weeksArgs<ExtArgs> = {}>(args?: Subset<T, Cycle$weeksArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$WeekPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    objectives<T extends Cycle$objectivesArgs<ExtArgs> = {}>(args?: Subset<T, Cycle$objectivesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ObjectivePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Cycle model
   */
  interface CycleFieldRefs {
    readonly id: FieldRef<"Cycle", 'String'>
    readonly clientId: FieldRef<"Cycle", 'String'>
    readonly cycleNumber: FieldRef<"Cycle", 'Int'>
    readonly mainObjective: FieldRef<"Cycle", 'String'>
    readonly caTargetMonthly: FieldRef<"Cycle", 'Float'>
    readonly startDate: FieldRef<"Cycle", 'DateTime'>
    readonly endDate: FieldRef<"Cycle", 'DateTime'>
    readonly status: FieldRef<"Cycle", 'CycleStatus'>
    readonly createdAt: FieldRef<"Cycle", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Cycle findUnique
   */
  export type CycleFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Cycle
     */
    select?: CycleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Cycle
     */
    omit?: CycleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CycleInclude<ExtArgs> | null
    /**
     * Filter, which Cycle to fetch.
     */
    where: CycleWhereUniqueInput
  }

  /**
   * Cycle findUniqueOrThrow
   */
  export type CycleFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Cycle
     */
    select?: CycleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Cycle
     */
    omit?: CycleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CycleInclude<ExtArgs> | null
    /**
     * Filter, which Cycle to fetch.
     */
    where: CycleWhereUniqueInput
  }

  /**
   * Cycle findFirst
   */
  export type CycleFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Cycle
     */
    select?: CycleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Cycle
     */
    omit?: CycleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CycleInclude<ExtArgs> | null
    /**
     * Filter, which Cycle to fetch.
     */
    where?: CycleWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Cycles to fetch.
     */
    orderBy?: CycleOrderByWithRelationInput | CycleOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Cycles.
     */
    cursor?: CycleWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Cycles from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Cycles.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Cycles.
     */
    distinct?: CycleScalarFieldEnum | CycleScalarFieldEnum[]
  }

  /**
   * Cycle findFirstOrThrow
   */
  export type CycleFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Cycle
     */
    select?: CycleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Cycle
     */
    omit?: CycleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CycleInclude<ExtArgs> | null
    /**
     * Filter, which Cycle to fetch.
     */
    where?: CycleWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Cycles to fetch.
     */
    orderBy?: CycleOrderByWithRelationInput | CycleOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Cycles.
     */
    cursor?: CycleWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Cycles from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Cycles.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Cycles.
     */
    distinct?: CycleScalarFieldEnum | CycleScalarFieldEnum[]
  }

  /**
   * Cycle findMany
   */
  export type CycleFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Cycle
     */
    select?: CycleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Cycle
     */
    omit?: CycleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CycleInclude<ExtArgs> | null
    /**
     * Filter, which Cycles to fetch.
     */
    where?: CycleWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Cycles to fetch.
     */
    orderBy?: CycleOrderByWithRelationInput | CycleOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Cycles.
     */
    cursor?: CycleWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Cycles from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Cycles.
     */
    skip?: number
    distinct?: CycleScalarFieldEnum | CycleScalarFieldEnum[]
  }

  /**
   * Cycle create
   */
  export type CycleCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Cycle
     */
    select?: CycleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Cycle
     */
    omit?: CycleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CycleInclude<ExtArgs> | null
    /**
     * The data needed to create a Cycle.
     */
    data: XOR<CycleCreateInput, CycleUncheckedCreateInput>
  }

  /**
   * Cycle createMany
   */
  export type CycleCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Cycles.
     */
    data: CycleCreateManyInput | CycleCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Cycle createManyAndReturn
   */
  export type CycleCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Cycle
     */
    select?: CycleSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Cycle
     */
    omit?: CycleOmit<ExtArgs> | null
    /**
     * The data used to create many Cycles.
     */
    data: CycleCreateManyInput | CycleCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CycleIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Cycle update
   */
  export type CycleUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Cycle
     */
    select?: CycleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Cycle
     */
    omit?: CycleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CycleInclude<ExtArgs> | null
    /**
     * The data needed to update a Cycle.
     */
    data: XOR<CycleUpdateInput, CycleUncheckedUpdateInput>
    /**
     * Choose, which Cycle to update.
     */
    where: CycleWhereUniqueInput
  }

  /**
   * Cycle updateMany
   */
  export type CycleUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Cycles.
     */
    data: XOR<CycleUpdateManyMutationInput, CycleUncheckedUpdateManyInput>
    /**
     * Filter which Cycles to update
     */
    where?: CycleWhereInput
    /**
     * Limit how many Cycles to update.
     */
    limit?: number
  }

  /**
   * Cycle updateManyAndReturn
   */
  export type CycleUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Cycle
     */
    select?: CycleSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Cycle
     */
    omit?: CycleOmit<ExtArgs> | null
    /**
     * The data used to update Cycles.
     */
    data: XOR<CycleUpdateManyMutationInput, CycleUncheckedUpdateManyInput>
    /**
     * Filter which Cycles to update
     */
    where?: CycleWhereInput
    /**
     * Limit how many Cycles to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CycleIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Cycle upsert
   */
  export type CycleUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Cycle
     */
    select?: CycleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Cycle
     */
    omit?: CycleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CycleInclude<ExtArgs> | null
    /**
     * The filter to search for the Cycle to update in case it exists.
     */
    where: CycleWhereUniqueInput
    /**
     * In case the Cycle found by the `where` argument doesn't exist, create a new Cycle with this data.
     */
    create: XOR<CycleCreateInput, CycleUncheckedCreateInput>
    /**
     * In case the Cycle was found with the provided `where` argument, update it with this data.
     */
    update: XOR<CycleUpdateInput, CycleUncheckedUpdateInput>
  }

  /**
   * Cycle delete
   */
  export type CycleDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Cycle
     */
    select?: CycleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Cycle
     */
    omit?: CycleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CycleInclude<ExtArgs> | null
    /**
     * Filter which Cycle to delete.
     */
    where: CycleWhereUniqueInput
  }

  /**
   * Cycle deleteMany
   */
  export type CycleDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Cycles to delete
     */
    where?: CycleWhereInput
    /**
     * Limit how many Cycles to delete.
     */
    limit?: number
  }

  /**
   * Cycle.weeks
   */
  export type Cycle$weeksArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Week
     */
    select?: WeekSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Week
     */
    omit?: WeekOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WeekInclude<ExtArgs> | null
    where?: WeekWhereInput
    orderBy?: WeekOrderByWithRelationInput | WeekOrderByWithRelationInput[]
    cursor?: WeekWhereUniqueInput
    take?: number
    skip?: number
    distinct?: WeekScalarFieldEnum | WeekScalarFieldEnum[]
  }

  /**
   * Cycle.objectives
   */
  export type Cycle$objectivesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Objective
     */
    select?: ObjectiveSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Objective
     */
    omit?: ObjectiveOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ObjectiveInclude<ExtArgs> | null
    where?: ObjectiveWhereInput
    orderBy?: ObjectiveOrderByWithRelationInput | ObjectiveOrderByWithRelationInput[]
    cursor?: ObjectiveWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ObjectiveScalarFieldEnum | ObjectiveScalarFieldEnum[]
  }

  /**
   * Cycle without action
   */
  export type CycleDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Cycle
     */
    select?: CycleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Cycle
     */
    omit?: CycleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CycleInclude<ExtArgs> | null
  }


  /**
   * Model Week
   */

  export type AggregateWeek = {
    _count: WeekCountAggregateOutputType | null
    _avg: WeekAvgAggregateOutputType | null
    _sum: WeekSumAggregateOutputType | null
    _min: WeekMinAggregateOutputType | null
    _max: WeekMaxAggregateOutputType | null
  }

  export type WeekAvgAggregateOutputType = {
    weekNumber: number | null
  }

  export type WeekSumAggregateOutputType = {
    weekNumber: number | null
  }

  export type WeekMinAggregateOutputType = {
    id: string | null
    cycleId: string | null
    weekNumber: number | null
    startDate: Date | null
    focusTitle: string | null
    createdAt: Date | null
  }

  export type WeekMaxAggregateOutputType = {
    id: string | null
    cycleId: string | null
    weekNumber: number | null
    startDate: Date | null
    focusTitle: string | null
    createdAt: Date | null
  }

  export type WeekCountAggregateOutputType = {
    id: number
    cycleId: number
    weekNumber: number
    startDate: number
    focusTitle: number
    actions: number
    createdAt: number
    _all: number
  }


  export type WeekAvgAggregateInputType = {
    weekNumber?: true
  }

  export type WeekSumAggregateInputType = {
    weekNumber?: true
  }

  export type WeekMinAggregateInputType = {
    id?: true
    cycleId?: true
    weekNumber?: true
    startDate?: true
    focusTitle?: true
    createdAt?: true
  }

  export type WeekMaxAggregateInputType = {
    id?: true
    cycleId?: true
    weekNumber?: true
    startDate?: true
    focusTitle?: true
    createdAt?: true
  }

  export type WeekCountAggregateInputType = {
    id?: true
    cycleId?: true
    weekNumber?: true
    startDate?: true
    focusTitle?: true
    actions?: true
    createdAt?: true
    _all?: true
  }

  export type WeekAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Week to aggregate.
     */
    where?: WeekWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Weeks to fetch.
     */
    orderBy?: WeekOrderByWithRelationInput | WeekOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: WeekWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Weeks from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Weeks.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Weeks
    **/
    _count?: true | WeekCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: WeekAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: WeekSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: WeekMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: WeekMaxAggregateInputType
  }

  export type GetWeekAggregateType<T extends WeekAggregateArgs> = {
        [P in keyof T & keyof AggregateWeek]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateWeek[P]>
      : GetScalarType<T[P], AggregateWeek[P]>
  }




  export type WeekGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: WeekWhereInput
    orderBy?: WeekOrderByWithAggregationInput | WeekOrderByWithAggregationInput[]
    by: WeekScalarFieldEnum[] | WeekScalarFieldEnum
    having?: WeekScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: WeekCountAggregateInputType | true
    _avg?: WeekAvgAggregateInputType
    _sum?: WeekSumAggregateInputType
    _min?: WeekMinAggregateInputType
    _max?: WeekMaxAggregateInputType
  }

  export type WeekGroupByOutputType = {
    id: string
    cycleId: string
    weekNumber: number
    startDate: Date | null
    focusTitle: string | null
    actions: string[]
    createdAt: Date
    _count: WeekCountAggregateOutputType | null
    _avg: WeekAvgAggregateOutputType | null
    _sum: WeekSumAggregateOutputType | null
    _min: WeekMinAggregateOutputType | null
    _max: WeekMaxAggregateOutputType | null
  }

  type GetWeekGroupByPayload<T extends WeekGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<WeekGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof WeekGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], WeekGroupByOutputType[P]>
            : GetScalarType<T[P], WeekGroupByOutputType[P]>
        }
      >
    >


  export type WeekSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    cycleId?: boolean
    weekNumber?: boolean
    startDate?: boolean
    focusTitle?: boolean
    actions?: boolean
    createdAt?: boolean
    cycle?: boolean | CycleDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["week"]>

  export type WeekSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    cycleId?: boolean
    weekNumber?: boolean
    startDate?: boolean
    focusTitle?: boolean
    actions?: boolean
    createdAt?: boolean
    cycle?: boolean | CycleDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["week"]>

  export type WeekSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    cycleId?: boolean
    weekNumber?: boolean
    startDate?: boolean
    focusTitle?: boolean
    actions?: boolean
    createdAt?: boolean
    cycle?: boolean | CycleDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["week"]>

  export type WeekSelectScalar = {
    id?: boolean
    cycleId?: boolean
    weekNumber?: boolean
    startDate?: boolean
    focusTitle?: boolean
    actions?: boolean
    createdAt?: boolean
  }

  export type WeekOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "cycleId" | "weekNumber" | "startDate" | "focusTitle" | "actions" | "createdAt", ExtArgs["result"]["week"]>
  export type WeekInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    cycle?: boolean | CycleDefaultArgs<ExtArgs>
  }
  export type WeekIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    cycle?: boolean | CycleDefaultArgs<ExtArgs>
  }
  export type WeekIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    cycle?: boolean | CycleDefaultArgs<ExtArgs>
  }

  export type $WeekPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Week"
    objects: {
      cycle: Prisma.$CyclePayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      cycleId: string
      weekNumber: number
      startDate: Date | null
      focusTitle: string | null
      actions: string[]
      createdAt: Date
    }, ExtArgs["result"]["week"]>
    composites: {}
  }

  type WeekGetPayload<S extends boolean | null | undefined | WeekDefaultArgs> = $Result.GetResult<Prisma.$WeekPayload, S>

  type WeekCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<WeekFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: WeekCountAggregateInputType | true
    }

  export interface WeekDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Week'], meta: { name: 'Week' } }
    /**
     * Find zero or one Week that matches the filter.
     * @param {WeekFindUniqueArgs} args - Arguments to find a Week
     * @example
     * // Get one Week
     * const week = await prisma.week.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends WeekFindUniqueArgs>(args: SelectSubset<T, WeekFindUniqueArgs<ExtArgs>>): Prisma__WeekClient<$Result.GetResult<Prisma.$WeekPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Week that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {WeekFindUniqueOrThrowArgs} args - Arguments to find a Week
     * @example
     * // Get one Week
     * const week = await prisma.week.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends WeekFindUniqueOrThrowArgs>(args: SelectSubset<T, WeekFindUniqueOrThrowArgs<ExtArgs>>): Prisma__WeekClient<$Result.GetResult<Prisma.$WeekPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Week that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WeekFindFirstArgs} args - Arguments to find a Week
     * @example
     * // Get one Week
     * const week = await prisma.week.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends WeekFindFirstArgs>(args?: SelectSubset<T, WeekFindFirstArgs<ExtArgs>>): Prisma__WeekClient<$Result.GetResult<Prisma.$WeekPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Week that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WeekFindFirstOrThrowArgs} args - Arguments to find a Week
     * @example
     * // Get one Week
     * const week = await prisma.week.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends WeekFindFirstOrThrowArgs>(args?: SelectSubset<T, WeekFindFirstOrThrowArgs<ExtArgs>>): Prisma__WeekClient<$Result.GetResult<Prisma.$WeekPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Weeks that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WeekFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Weeks
     * const weeks = await prisma.week.findMany()
     * 
     * // Get first 10 Weeks
     * const weeks = await prisma.week.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const weekWithIdOnly = await prisma.week.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends WeekFindManyArgs>(args?: SelectSubset<T, WeekFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$WeekPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Week.
     * @param {WeekCreateArgs} args - Arguments to create a Week.
     * @example
     * // Create one Week
     * const Week = await prisma.week.create({
     *   data: {
     *     // ... data to create a Week
     *   }
     * })
     * 
     */
    create<T extends WeekCreateArgs>(args: SelectSubset<T, WeekCreateArgs<ExtArgs>>): Prisma__WeekClient<$Result.GetResult<Prisma.$WeekPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Weeks.
     * @param {WeekCreateManyArgs} args - Arguments to create many Weeks.
     * @example
     * // Create many Weeks
     * const week = await prisma.week.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends WeekCreateManyArgs>(args?: SelectSubset<T, WeekCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Weeks and returns the data saved in the database.
     * @param {WeekCreateManyAndReturnArgs} args - Arguments to create many Weeks.
     * @example
     * // Create many Weeks
     * const week = await prisma.week.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Weeks and only return the `id`
     * const weekWithIdOnly = await prisma.week.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends WeekCreateManyAndReturnArgs>(args?: SelectSubset<T, WeekCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$WeekPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Week.
     * @param {WeekDeleteArgs} args - Arguments to delete one Week.
     * @example
     * // Delete one Week
     * const Week = await prisma.week.delete({
     *   where: {
     *     // ... filter to delete one Week
     *   }
     * })
     * 
     */
    delete<T extends WeekDeleteArgs>(args: SelectSubset<T, WeekDeleteArgs<ExtArgs>>): Prisma__WeekClient<$Result.GetResult<Prisma.$WeekPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Week.
     * @param {WeekUpdateArgs} args - Arguments to update one Week.
     * @example
     * // Update one Week
     * const week = await prisma.week.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends WeekUpdateArgs>(args: SelectSubset<T, WeekUpdateArgs<ExtArgs>>): Prisma__WeekClient<$Result.GetResult<Prisma.$WeekPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Weeks.
     * @param {WeekDeleteManyArgs} args - Arguments to filter Weeks to delete.
     * @example
     * // Delete a few Weeks
     * const { count } = await prisma.week.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends WeekDeleteManyArgs>(args?: SelectSubset<T, WeekDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Weeks.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WeekUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Weeks
     * const week = await prisma.week.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends WeekUpdateManyArgs>(args: SelectSubset<T, WeekUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Weeks and returns the data updated in the database.
     * @param {WeekUpdateManyAndReturnArgs} args - Arguments to update many Weeks.
     * @example
     * // Update many Weeks
     * const week = await prisma.week.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Weeks and only return the `id`
     * const weekWithIdOnly = await prisma.week.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends WeekUpdateManyAndReturnArgs>(args: SelectSubset<T, WeekUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$WeekPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Week.
     * @param {WeekUpsertArgs} args - Arguments to update or create a Week.
     * @example
     * // Update or create a Week
     * const week = await prisma.week.upsert({
     *   create: {
     *     // ... data to create a Week
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Week we want to update
     *   }
     * })
     */
    upsert<T extends WeekUpsertArgs>(args: SelectSubset<T, WeekUpsertArgs<ExtArgs>>): Prisma__WeekClient<$Result.GetResult<Prisma.$WeekPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Weeks.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WeekCountArgs} args - Arguments to filter Weeks to count.
     * @example
     * // Count the number of Weeks
     * const count = await prisma.week.count({
     *   where: {
     *     // ... the filter for the Weeks we want to count
     *   }
     * })
    **/
    count<T extends WeekCountArgs>(
      args?: Subset<T, WeekCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], WeekCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Week.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WeekAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends WeekAggregateArgs>(args: Subset<T, WeekAggregateArgs>): Prisma.PrismaPromise<GetWeekAggregateType<T>>

    /**
     * Group by Week.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WeekGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends WeekGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: WeekGroupByArgs['orderBy'] }
        : { orderBy?: WeekGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, WeekGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetWeekGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Week model
   */
  readonly fields: WeekFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Week.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__WeekClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    cycle<T extends CycleDefaultArgs<ExtArgs> = {}>(args?: Subset<T, CycleDefaultArgs<ExtArgs>>): Prisma__CycleClient<$Result.GetResult<Prisma.$CyclePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Week model
   */
  interface WeekFieldRefs {
    readonly id: FieldRef<"Week", 'String'>
    readonly cycleId: FieldRef<"Week", 'String'>
    readonly weekNumber: FieldRef<"Week", 'Int'>
    readonly startDate: FieldRef<"Week", 'DateTime'>
    readonly focusTitle: FieldRef<"Week", 'String'>
    readonly actions: FieldRef<"Week", 'String[]'>
    readonly createdAt: FieldRef<"Week", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Week findUnique
   */
  export type WeekFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Week
     */
    select?: WeekSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Week
     */
    omit?: WeekOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WeekInclude<ExtArgs> | null
    /**
     * Filter, which Week to fetch.
     */
    where: WeekWhereUniqueInput
  }

  /**
   * Week findUniqueOrThrow
   */
  export type WeekFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Week
     */
    select?: WeekSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Week
     */
    omit?: WeekOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WeekInclude<ExtArgs> | null
    /**
     * Filter, which Week to fetch.
     */
    where: WeekWhereUniqueInput
  }

  /**
   * Week findFirst
   */
  export type WeekFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Week
     */
    select?: WeekSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Week
     */
    omit?: WeekOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WeekInclude<ExtArgs> | null
    /**
     * Filter, which Week to fetch.
     */
    where?: WeekWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Weeks to fetch.
     */
    orderBy?: WeekOrderByWithRelationInput | WeekOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Weeks.
     */
    cursor?: WeekWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Weeks from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Weeks.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Weeks.
     */
    distinct?: WeekScalarFieldEnum | WeekScalarFieldEnum[]
  }

  /**
   * Week findFirstOrThrow
   */
  export type WeekFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Week
     */
    select?: WeekSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Week
     */
    omit?: WeekOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WeekInclude<ExtArgs> | null
    /**
     * Filter, which Week to fetch.
     */
    where?: WeekWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Weeks to fetch.
     */
    orderBy?: WeekOrderByWithRelationInput | WeekOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Weeks.
     */
    cursor?: WeekWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Weeks from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Weeks.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Weeks.
     */
    distinct?: WeekScalarFieldEnum | WeekScalarFieldEnum[]
  }

  /**
   * Week findMany
   */
  export type WeekFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Week
     */
    select?: WeekSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Week
     */
    omit?: WeekOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WeekInclude<ExtArgs> | null
    /**
     * Filter, which Weeks to fetch.
     */
    where?: WeekWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Weeks to fetch.
     */
    orderBy?: WeekOrderByWithRelationInput | WeekOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Weeks.
     */
    cursor?: WeekWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Weeks from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Weeks.
     */
    skip?: number
    distinct?: WeekScalarFieldEnum | WeekScalarFieldEnum[]
  }

  /**
   * Week create
   */
  export type WeekCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Week
     */
    select?: WeekSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Week
     */
    omit?: WeekOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WeekInclude<ExtArgs> | null
    /**
     * The data needed to create a Week.
     */
    data: XOR<WeekCreateInput, WeekUncheckedCreateInput>
  }

  /**
   * Week createMany
   */
  export type WeekCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Weeks.
     */
    data: WeekCreateManyInput | WeekCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Week createManyAndReturn
   */
  export type WeekCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Week
     */
    select?: WeekSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Week
     */
    omit?: WeekOmit<ExtArgs> | null
    /**
     * The data used to create many Weeks.
     */
    data: WeekCreateManyInput | WeekCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WeekIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Week update
   */
  export type WeekUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Week
     */
    select?: WeekSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Week
     */
    omit?: WeekOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WeekInclude<ExtArgs> | null
    /**
     * The data needed to update a Week.
     */
    data: XOR<WeekUpdateInput, WeekUncheckedUpdateInput>
    /**
     * Choose, which Week to update.
     */
    where: WeekWhereUniqueInput
  }

  /**
   * Week updateMany
   */
  export type WeekUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Weeks.
     */
    data: XOR<WeekUpdateManyMutationInput, WeekUncheckedUpdateManyInput>
    /**
     * Filter which Weeks to update
     */
    where?: WeekWhereInput
    /**
     * Limit how many Weeks to update.
     */
    limit?: number
  }

  /**
   * Week updateManyAndReturn
   */
  export type WeekUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Week
     */
    select?: WeekSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Week
     */
    omit?: WeekOmit<ExtArgs> | null
    /**
     * The data used to update Weeks.
     */
    data: XOR<WeekUpdateManyMutationInput, WeekUncheckedUpdateManyInput>
    /**
     * Filter which Weeks to update
     */
    where?: WeekWhereInput
    /**
     * Limit how many Weeks to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WeekIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Week upsert
   */
  export type WeekUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Week
     */
    select?: WeekSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Week
     */
    omit?: WeekOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WeekInclude<ExtArgs> | null
    /**
     * The filter to search for the Week to update in case it exists.
     */
    where: WeekWhereUniqueInput
    /**
     * In case the Week found by the `where` argument doesn't exist, create a new Week with this data.
     */
    create: XOR<WeekCreateInput, WeekUncheckedCreateInput>
    /**
     * In case the Week was found with the provided `where` argument, update it with this data.
     */
    update: XOR<WeekUpdateInput, WeekUncheckedUpdateInput>
  }

  /**
   * Week delete
   */
  export type WeekDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Week
     */
    select?: WeekSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Week
     */
    omit?: WeekOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WeekInclude<ExtArgs> | null
    /**
     * Filter which Week to delete.
     */
    where: WeekWhereUniqueInput
  }

  /**
   * Week deleteMany
   */
  export type WeekDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Weeks to delete
     */
    where?: WeekWhereInput
    /**
     * Limit how many Weeks to delete.
     */
    limit?: number
  }

  /**
   * Week without action
   */
  export type WeekDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Week
     */
    select?: WeekSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Week
     */
    omit?: WeekOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WeekInclude<ExtArgs> | null
  }


  /**
   * Model Objective
   */

  export type AggregateObjective = {
    _count: ObjectiveCountAggregateOutputType | null
    _avg: ObjectiveAvgAggregateOutputType | null
    _sum: ObjectiveSumAggregateOutputType | null
    _min: ObjectiveMinAggregateOutputType | null
    _max: ObjectiveMaxAggregateOutputType | null
  }

  export type ObjectiveAvgAggregateOutputType = {
    progressPct: number | null
  }

  export type ObjectiveSumAggregateOutputType = {
    progressPct: number | null
  }

  export type ObjectiveMinAggregateOutputType = {
    id: string | null
    cycleId: string | null
    title: string | null
    description: string | null
    progressPct: number | null
    status: $Enums.ObjectiveStatus | null
    createdAt: Date | null
  }

  export type ObjectiveMaxAggregateOutputType = {
    id: string | null
    cycleId: string | null
    title: string | null
    description: string | null
    progressPct: number | null
    status: $Enums.ObjectiveStatus | null
    createdAt: Date | null
  }

  export type ObjectiveCountAggregateOutputType = {
    id: number
    cycleId: number
    title: number
    description: number
    progressPct: number
    status: number
    createdAt: number
    _all: number
  }


  export type ObjectiveAvgAggregateInputType = {
    progressPct?: true
  }

  export type ObjectiveSumAggregateInputType = {
    progressPct?: true
  }

  export type ObjectiveMinAggregateInputType = {
    id?: true
    cycleId?: true
    title?: true
    description?: true
    progressPct?: true
    status?: true
    createdAt?: true
  }

  export type ObjectiveMaxAggregateInputType = {
    id?: true
    cycleId?: true
    title?: true
    description?: true
    progressPct?: true
    status?: true
    createdAt?: true
  }

  export type ObjectiveCountAggregateInputType = {
    id?: true
    cycleId?: true
    title?: true
    description?: true
    progressPct?: true
    status?: true
    createdAt?: true
    _all?: true
  }

  export type ObjectiveAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Objective to aggregate.
     */
    where?: ObjectiveWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Objectives to fetch.
     */
    orderBy?: ObjectiveOrderByWithRelationInput | ObjectiveOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ObjectiveWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Objectives from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Objectives.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Objectives
    **/
    _count?: true | ObjectiveCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: ObjectiveAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: ObjectiveSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ObjectiveMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ObjectiveMaxAggregateInputType
  }

  export type GetObjectiveAggregateType<T extends ObjectiveAggregateArgs> = {
        [P in keyof T & keyof AggregateObjective]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateObjective[P]>
      : GetScalarType<T[P], AggregateObjective[P]>
  }




  export type ObjectiveGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ObjectiveWhereInput
    orderBy?: ObjectiveOrderByWithAggregationInput | ObjectiveOrderByWithAggregationInput[]
    by: ObjectiveScalarFieldEnum[] | ObjectiveScalarFieldEnum
    having?: ObjectiveScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ObjectiveCountAggregateInputType | true
    _avg?: ObjectiveAvgAggregateInputType
    _sum?: ObjectiveSumAggregateInputType
    _min?: ObjectiveMinAggregateInputType
    _max?: ObjectiveMaxAggregateInputType
  }

  export type ObjectiveGroupByOutputType = {
    id: string
    cycleId: string
    title: string
    description: string | null
    progressPct: number
    status: $Enums.ObjectiveStatus
    createdAt: Date
    _count: ObjectiveCountAggregateOutputType | null
    _avg: ObjectiveAvgAggregateOutputType | null
    _sum: ObjectiveSumAggregateOutputType | null
    _min: ObjectiveMinAggregateOutputType | null
    _max: ObjectiveMaxAggregateOutputType | null
  }

  type GetObjectiveGroupByPayload<T extends ObjectiveGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ObjectiveGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ObjectiveGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ObjectiveGroupByOutputType[P]>
            : GetScalarType<T[P], ObjectiveGroupByOutputType[P]>
        }
      >
    >


  export type ObjectiveSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    cycleId?: boolean
    title?: boolean
    description?: boolean
    progressPct?: boolean
    status?: boolean
    createdAt?: boolean
    cycle?: boolean | CycleDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["objective"]>

  export type ObjectiveSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    cycleId?: boolean
    title?: boolean
    description?: boolean
    progressPct?: boolean
    status?: boolean
    createdAt?: boolean
    cycle?: boolean | CycleDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["objective"]>

  export type ObjectiveSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    cycleId?: boolean
    title?: boolean
    description?: boolean
    progressPct?: boolean
    status?: boolean
    createdAt?: boolean
    cycle?: boolean | CycleDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["objective"]>

  export type ObjectiveSelectScalar = {
    id?: boolean
    cycleId?: boolean
    title?: boolean
    description?: boolean
    progressPct?: boolean
    status?: boolean
    createdAt?: boolean
  }

  export type ObjectiveOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "cycleId" | "title" | "description" | "progressPct" | "status" | "createdAt", ExtArgs["result"]["objective"]>
  export type ObjectiveInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    cycle?: boolean | CycleDefaultArgs<ExtArgs>
  }
  export type ObjectiveIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    cycle?: boolean | CycleDefaultArgs<ExtArgs>
  }
  export type ObjectiveIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    cycle?: boolean | CycleDefaultArgs<ExtArgs>
  }

  export type $ObjectivePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Objective"
    objects: {
      cycle: Prisma.$CyclePayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      cycleId: string
      title: string
      description: string | null
      progressPct: number
      status: $Enums.ObjectiveStatus
      createdAt: Date
    }, ExtArgs["result"]["objective"]>
    composites: {}
  }

  type ObjectiveGetPayload<S extends boolean | null | undefined | ObjectiveDefaultArgs> = $Result.GetResult<Prisma.$ObjectivePayload, S>

  type ObjectiveCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<ObjectiveFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ObjectiveCountAggregateInputType | true
    }

  export interface ObjectiveDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Objective'], meta: { name: 'Objective' } }
    /**
     * Find zero or one Objective that matches the filter.
     * @param {ObjectiveFindUniqueArgs} args - Arguments to find a Objective
     * @example
     * // Get one Objective
     * const objective = await prisma.objective.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ObjectiveFindUniqueArgs>(args: SelectSubset<T, ObjectiveFindUniqueArgs<ExtArgs>>): Prisma__ObjectiveClient<$Result.GetResult<Prisma.$ObjectivePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Objective that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ObjectiveFindUniqueOrThrowArgs} args - Arguments to find a Objective
     * @example
     * // Get one Objective
     * const objective = await prisma.objective.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ObjectiveFindUniqueOrThrowArgs>(args: SelectSubset<T, ObjectiveFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ObjectiveClient<$Result.GetResult<Prisma.$ObjectivePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Objective that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ObjectiveFindFirstArgs} args - Arguments to find a Objective
     * @example
     * // Get one Objective
     * const objective = await prisma.objective.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ObjectiveFindFirstArgs>(args?: SelectSubset<T, ObjectiveFindFirstArgs<ExtArgs>>): Prisma__ObjectiveClient<$Result.GetResult<Prisma.$ObjectivePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Objective that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ObjectiveFindFirstOrThrowArgs} args - Arguments to find a Objective
     * @example
     * // Get one Objective
     * const objective = await prisma.objective.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ObjectiveFindFirstOrThrowArgs>(args?: SelectSubset<T, ObjectiveFindFirstOrThrowArgs<ExtArgs>>): Prisma__ObjectiveClient<$Result.GetResult<Prisma.$ObjectivePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Objectives that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ObjectiveFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Objectives
     * const objectives = await prisma.objective.findMany()
     * 
     * // Get first 10 Objectives
     * const objectives = await prisma.objective.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const objectiveWithIdOnly = await prisma.objective.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ObjectiveFindManyArgs>(args?: SelectSubset<T, ObjectiveFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ObjectivePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Objective.
     * @param {ObjectiveCreateArgs} args - Arguments to create a Objective.
     * @example
     * // Create one Objective
     * const Objective = await prisma.objective.create({
     *   data: {
     *     // ... data to create a Objective
     *   }
     * })
     * 
     */
    create<T extends ObjectiveCreateArgs>(args: SelectSubset<T, ObjectiveCreateArgs<ExtArgs>>): Prisma__ObjectiveClient<$Result.GetResult<Prisma.$ObjectivePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Objectives.
     * @param {ObjectiveCreateManyArgs} args - Arguments to create many Objectives.
     * @example
     * // Create many Objectives
     * const objective = await prisma.objective.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ObjectiveCreateManyArgs>(args?: SelectSubset<T, ObjectiveCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Objectives and returns the data saved in the database.
     * @param {ObjectiveCreateManyAndReturnArgs} args - Arguments to create many Objectives.
     * @example
     * // Create many Objectives
     * const objective = await prisma.objective.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Objectives and only return the `id`
     * const objectiveWithIdOnly = await prisma.objective.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ObjectiveCreateManyAndReturnArgs>(args?: SelectSubset<T, ObjectiveCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ObjectivePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Objective.
     * @param {ObjectiveDeleteArgs} args - Arguments to delete one Objective.
     * @example
     * // Delete one Objective
     * const Objective = await prisma.objective.delete({
     *   where: {
     *     // ... filter to delete one Objective
     *   }
     * })
     * 
     */
    delete<T extends ObjectiveDeleteArgs>(args: SelectSubset<T, ObjectiveDeleteArgs<ExtArgs>>): Prisma__ObjectiveClient<$Result.GetResult<Prisma.$ObjectivePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Objective.
     * @param {ObjectiveUpdateArgs} args - Arguments to update one Objective.
     * @example
     * // Update one Objective
     * const objective = await prisma.objective.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ObjectiveUpdateArgs>(args: SelectSubset<T, ObjectiveUpdateArgs<ExtArgs>>): Prisma__ObjectiveClient<$Result.GetResult<Prisma.$ObjectivePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Objectives.
     * @param {ObjectiveDeleteManyArgs} args - Arguments to filter Objectives to delete.
     * @example
     * // Delete a few Objectives
     * const { count } = await prisma.objective.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ObjectiveDeleteManyArgs>(args?: SelectSubset<T, ObjectiveDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Objectives.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ObjectiveUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Objectives
     * const objective = await prisma.objective.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ObjectiveUpdateManyArgs>(args: SelectSubset<T, ObjectiveUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Objectives and returns the data updated in the database.
     * @param {ObjectiveUpdateManyAndReturnArgs} args - Arguments to update many Objectives.
     * @example
     * // Update many Objectives
     * const objective = await prisma.objective.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Objectives and only return the `id`
     * const objectiveWithIdOnly = await prisma.objective.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends ObjectiveUpdateManyAndReturnArgs>(args: SelectSubset<T, ObjectiveUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ObjectivePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Objective.
     * @param {ObjectiveUpsertArgs} args - Arguments to update or create a Objective.
     * @example
     * // Update or create a Objective
     * const objective = await prisma.objective.upsert({
     *   create: {
     *     // ... data to create a Objective
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Objective we want to update
     *   }
     * })
     */
    upsert<T extends ObjectiveUpsertArgs>(args: SelectSubset<T, ObjectiveUpsertArgs<ExtArgs>>): Prisma__ObjectiveClient<$Result.GetResult<Prisma.$ObjectivePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Objectives.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ObjectiveCountArgs} args - Arguments to filter Objectives to count.
     * @example
     * // Count the number of Objectives
     * const count = await prisma.objective.count({
     *   where: {
     *     // ... the filter for the Objectives we want to count
     *   }
     * })
    **/
    count<T extends ObjectiveCountArgs>(
      args?: Subset<T, ObjectiveCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ObjectiveCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Objective.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ObjectiveAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ObjectiveAggregateArgs>(args: Subset<T, ObjectiveAggregateArgs>): Prisma.PrismaPromise<GetObjectiveAggregateType<T>>

    /**
     * Group by Objective.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ObjectiveGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ObjectiveGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ObjectiveGroupByArgs['orderBy'] }
        : { orderBy?: ObjectiveGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ObjectiveGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetObjectiveGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Objective model
   */
  readonly fields: ObjectiveFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Objective.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ObjectiveClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    cycle<T extends CycleDefaultArgs<ExtArgs> = {}>(args?: Subset<T, CycleDefaultArgs<ExtArgs>>): Prisma__CycleClient<$Result.GetResult<Prisma.$CyclePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Objective model
   */
  interface ObjectiveFieldRefs {
    readonly id: FieldRef<"Objective", 'String'>
    readonly cycleId: FieldRef<"Objective", 'String'>
    readonly title: FieldRef<"Objective", 'String'>
    readonly description: FieldRef<"Objective", 'String'>
    readonly progressPct: FieldRef<"Objective", 'Int'>
    readonly status: FieldRef<"Objective", 'ObjectiveStatus'>
    readonly createdAt: FieldRef<"Objective", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Objective findUnique
   */
  export type ObjectiveFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Objective
     */
    select?: ObjectiveSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Objective
     */
    omit?: ObjectiveOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ObjectiveInclude<ExtArgs> | null
    /**
     * Filter, which Objective to fetch.
     */
    where: ObjectiveWhereUniqueInput
  }

  /**
   * Objective findUniqueOrThrow
   */
  export type ObjectiveFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Objective
     */
    select?: ObjectiveSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Objective
     */
    omit?: ObjectiveOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ObjectiveInclude<ExtArgs> | null
    /**
     * Filter, which Objective to fetch.
     */
    where: ObjectiveWhereUniqueInput
  }

  /**
   * Objective findFirst
   */
  export type ObjectiveFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Objective
     */
    select?: ObjectiveSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Objective
     */
    omit?: ObjectiveOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ObjectiveInclude<ExtArgs> | null
    /**
     * Filter, which Objective to fetch.
     */
    where?: ObjectiveWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Objectives to fetch.
     */
    orderBy?: ObjectiveOrderByWithRelationInput | ObjectiveOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Objectives.
     */
    cursor?: ObjectiveWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Objectives from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Objectives.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Objectives.
     */
    distinct?: ObjectiveScalarFieldEnum | ObjectiveScalarFieldEnum[]
  }

  /**
   * Objective findFirstOrThrow
   */
  export type ObjectiveFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Objective
     */
    select?: ObjectiveSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Objective
     */
    omit?: ObjectiveOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ObjectiveInclude<ExtArgs> | null
    /**
     * Filter, which Objective to fetch.
     */
    where?: ObjectiveWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Objectives to fetch.
     */
    orderBy?: ObjectiveOrderByWithRelationInput | ObjectiveOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Objectives.
     */
    cursor?: ObjectiveWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Objectives from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Objectives.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Objectives.
     */
    distinct?: ObjectiveScalarFieldEnum | ObjectiveScalarFieldEnum[]
  }

  /**
   * Objective findMany
   */
  export type ObjectiveFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Objective
     */
    select?: ObjectiveSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Objective
     */
    omit?: ObjectiveOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ObjectiveInclude<ExtArgs> | null
    /**
     * Filter, which Objectives to fetch.
     */
    where?: ObjectiveWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Objectives to fetch.
     */
    orderBy?: ObjectiveOrderByWithRelationInput | ObjectiveOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Objectives.
     */
    cursor?: ObjectiveWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Objectives from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Objectives.
     */
    skip?: number
    distinct?: ObjectiveScalarFieldEnum | ObjectiveScalarFieldEnum[]
  }

  /**
   * Objective create
   */
  export type ObjectiveCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Objective
     */
    select?: ObjectiveSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Objective
     */
    omit?: ObjectiveOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ObjectiveInclude<ExtArgs> | null
    /**
     * The data needed to create a Objective.
     */
    data: XOR<ObjectiveCreateInput, ObjectiveUncheckedCreateInput>
  }

  /**
   * Objective createMany
   */
  export type ObjectiveCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Objectives.
     */
    data: ObjectiveCreateManyInput | ObjectiveCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Objective createManyAndReturn
   */
  export type ObjectiveCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Objective
     */
    select?: ObjectiveSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Objective
     */
    omit?: ObjectiveOmit<ExtArgs> | null
    /**
     * The data used to create many Objectives.
     */
    data: ObjectiveCreateManyInput | ObjectiveCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ObjectiveIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Objective update
   */
  export type ObjectiveUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Objective
     */
    select?: ObjectiveSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Objective
     */
    omit?: ObjectiveOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ObjectiveInclude<ExtArgs> | null
    /**
     * The data needed to update a Objective.
     */
    data: XOR<ObjectiveUpdateInput, ObjectiveUncheckedUpdateInput>
    /**
     * Choose, which Objective to update.
     */
    where: ObjectiveWhereUniqueInput
  }

  /**
   * Objective updateMany
   */
  export type ObjectiveUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Objectives.
     */
    data: XOR<ObjectiveUpdateManyMutationInput, ObjectiveUncheckedUpdateManyInput>
    /**
     * Filter which Objectives to update
     */
    where?: ObjectiveWhereInput
    /**
     * Limit how many Objectives to update.
     */
    limit?: number
  }

  /**
   * Objective updateManyAndReturn
   */
  export type ObjectiveUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Objective
     */
    select?: ObjectiveSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Objective
     */
    omit?: ObjectiveOmit<ExtArgs> | null
    /**
     * The data used to update Objectives.
     */
    data: XOR<ObjectiveUpdateManyMutationInput, ObjectiveUncheckedUpdateManyInput>
    /**
     * Filter which Objectives to update
     */
    where?: ObjectiveWhereInput
    /**
     * Limit how many Objectives to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ObjectiveIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Objective upsert
   */
  export type ObjectiveUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Objective
     */
    select?: ObjectiveSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Objective
     */
    omit?: ObjectiveOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ObjectiveInclude<ExtArgs> | null
    /**
     * The filter to search for the Objective to update in case it exists.
     */
    where: ObjectiveWhereUniqueInput
    /**
     * In case the Objective found by the `where` argument doesn't exist, create a new Objective with this data.
     */
    create: XOR<ObjectiveCreateInput, ObjectiveUncheckedCreateInput>
    /**
     * In case the Objective was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ObjectiveUpdateInput, ObjectiveUncheckedUpdateInput>
  }

  /**
   * Objective delete
   */
  export type ObjectiveDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Objective
     */
    select?: ObjectiveSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Objective
     */
    omit?: ObjectiveOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ObjectiveInclude<ExtArgs> | null
    /**
     * Filter which Objective to delete.
     */
    where: ObjectiveWhereUniqueInput
  }

  /**
   * Objective deleteMany
   */
  export type ObjectiveDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Objectives to delete
     */
    where?: ObjectiveWhereInput
    /**
     * Limit how many Objectives to delete.
     */
    limit?: number
  }

  /**
   * Objective without action
   */
  export type ObjectiveDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Objective
     */
    select?: ObjectiveSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Objective
     */
    omit?: ObjectiveOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ObjectiveInclude<ExtArgs> | null
  }


  /**
   * Model Transaction
   */

  export type AggregateTransaction = {
    _count: TransactionCountAggregateOutputType | null
    _avg: TransactionAvgAggregateOutputType | null
    _sum: TransactionSumAggregateOutputType | null
    _min: TransactionMinAggregateOutputType | null
    _max: TransactionMaxAggregateOutputType | null
  }

  export type TransactionAvgAggregateOutputType = {
    amountHt: number | null
  }

  export type TransactionSumAggregateOutputType = {
    amountHt: number | null
  }

  export type TransactionMinAggregateOutputType = {
    id: string | null
    clientId: string | null
    type: $Enums.TransactionType | null
    amountHt: number | null
    transactionDate: Date | null
    label: string | null
    category: string | null
    recurrence: string | null
    createdAt: Date | null
  }

  export type TransactionMaxAggregateOutputType = {
    id: string | null
    clientId: string | null
    type: $Enums.TransactionType | null
    amountHt: number | null
    transactionDate: Date | null
    label: string | null
    category: string | null
    recurrence: string | null
    createdAt: Date | null
  }

  export type TransactionCountAggregateOutputType = {
    id: number
    clientId: number
    type: number
    amountHt: number
    transactionDate: number
    label: number
    category: number
    recurrence: number
    createdAt: number
    _all: number
  }


  export type TransactionAvgAggregateInputType = {
    amountHt?: true
  }

  export type TransactionSumAggregateInputType = {
    amountHt?: true
  }

  export type TransactionMinAggregateInputType = {
    id?: true
    clientId?: true
    type?: true
    amountHt?: true
    transactionDate?: true
    label?: true
    category?: true
    recurrence?: true
    createdAt?: true
  }

  export type TransactionMaxAggregateInputType = {
    id?: true
    clientId?: true
    type?: true
    amountHt?: true
    transactionDate?: true
    label?: true
    category?: true
    recurrence?: true
    createdAt?: true
  }

  export type TransactionCountAggregateInputType = {
    id?: true
    clientId?: true
    type?: true
    amountHt?: true
    transactionDate?: true
    label?: true
    category?: true
    recurrence?: true
    createdAt?: true
    _all?: true
  }

  export type TransactionAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Transaction to aggregate.
     */
    where?: TransactionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Transactions to fetch.
     */
    orderBy?: TransactionOrderByWithRelationInput | TransactionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: TransactionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Transactions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Transactions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Transactions
    **/
    _count?: true | TransactionCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: TransactionAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: TransactionSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: TransactionMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: TransactionMaxAggregateInputType
  }

  export type GetTransactionAggregateType<T extends TransactionAggregateArgs> = {
        [P in keyof T & keyof AggregateTransaction]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateTransaction[P]>
      : GetScalarType<T[P], AggregateTransaction[P]>
  }




  export type TransactionGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TransactionWhereInput
    orderBy?: TransactionOrderByWithAggregationInput | TransactionOrderByWithAggregationInput[]
    by: TransactionScalarFieldEnum[] | TransactionScalarFieldEnum
    having?: TransactionScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: TransactionCountAggregateInputType | true
    _avg?: TransactionAvgAggregateInputType
    _sum?: TransactionSumAggregateInputType
    _min?: TransactionMinAggregateInputType
    _max?: TransactionMaxAggregateInputType
  }

  export type TransactionGroupByOutputType = {
    id: string
    clientId: string
    type: $Enums.TransactionType
    amountHt: number
    transactionDate: Date
    label: string | null
    category: string | null
    recurrence: string | null
    createdAt: Date
    _count: TransactionCountAggregateOutputType | null
    _avg: TransactionAvgAggregateOutputType | null
    _sum: TransactionSumAggregateOutputType | null
    _min: TransactionMinAggregateOutputType | null
    _max: TransactionMaxAggregateOutputType | null
  }

  type GetTransactionGroupByPayload<T extends TransactionGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<TransactionGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof TransactionGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], TransactionGroupByOutputType[P]>
            : GetScalarType<T[P], TransactionGroupByOutputType[P]>
        }
      >
    >


  export type TransactionSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    clientId?: boolean
    type?: boolean
    amountHt?: boolean
    transactionDate?: boolean
    label?: boolean
    category?: boolean
    recurrence?: boolean
    createdAt?: boolean
    client?: boolean | ClientDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["transaction"]>

  export type TransactionSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    clientId?: boolean
    type?: boolean
    amountHt?: boolean
    transactionDate?: boolean
    label?: boolean
    category?: boolean
    recurrence?: boolean
    createdAt?: boolean
    client?: boolean | ClientDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["transaction"]>

  export type TransactionSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    clientId?: boolean
    type?: boolean
    amountHt?: boolean
    transactionDate?: boolean
    label?: boolean
    category?: boolean
    recurrence?: boolean
    createdAt?: boolean
    client?: boolean | ClientDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["transaction"]>

  export type TransactionSelectScalar = {
    id?: boolean
    clientId?: boolean
    type?: boolean
    amountHt?: boolean
    transactionDate?: boolean
    label?: boolean
    category?: boolean
    recurrence?: boolean
    createdAt?: boolean
  }

  export type TransactionOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "clientId" | "type" | "amountHt" | "transactionDate" | "label" | "category" | "recurrence" | "createdAt", ExtArgs["result"]["transaction"]>
  export type TransactionInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    client?: boolean | ClientDefaultArgs<ExtArgs>
  }
  export type TransactionIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    client?: boolean | ClientDefaultArgs<ExtArgs>
  }
  export type TransactionIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    client?: boolean | ClientDefaultArgs<ExtArgs>
  }

  export type $TransactionPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Transaction"
    objects: {
      client: Prisma.$ClientPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      clientId: string
      type: $Enums.TransactionType
      amountHt: number
      transactionDate: Date
      label: string | null
      category: string | null
      recurrence: string | null
      createdAt: Date
    }, ExtArgs["result"]["transaction"]>
    composites: {}
  }

  type TransactionGetPayload<S extends boolean | null | undefined | TransactionDefaultArgs> = $Result.GetResult<Prisma.$TransactionPayload, S>

  type TransactionCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<TransactionFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: TransactionCountAggregateInputType | true
    }

  export interface TransactionDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Transaction'], meta: { name: 'Transaction' } }
    /**
     * Find zero or one Transaction that matches the filter.
     * @param {TransactionFindUniqueArgs} args - Arguments to find a Transaction
     * @example
     * // Get one Transaction
     * const transaction = await prisma.transaction.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends TransactionFindUniqueArgs>(args: SelectSubset<T, TransactionFindUniqueArgs<ExtArgs>>): Prisma__TransactionClient<$Result.GetResult<Prisma.$TransactionPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Transaction that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {TransactionFindUniqueOrThrowArgs} args - Arguments to find a Transaction
     * @example
     * // Get one Transaction
     * const transaction = await prisma.transaction.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends TransactionFindUniqueOrThrowArgs>(args: SelectSubset<T, TransactionFindUniqueOrThrowArgs<ExtArgs>>): Prisma__TransactionClient<$Result.GetResult<Prisma.$TransactionPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Transaction that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TransactionFindFirstArgs} args - Arguments to find a Transaction
     * @example
     * // Get one Transaction
     * const transaction = await prisma.transaction.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends TransactionFindFirstArgs>(args?: SelectSubset<T, TransactionFindFirstArgs<ExtArgs>>): Prisma__TransactionClient<$Result.GetResult<Prisma.$TransactionPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Transaction that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TransactionFindFirstOrThrowArgs} args - Arguments to find a Transaction
     * @example
     * // Get one Transaction
     * const transaction = await prisma.transaction.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends TransactionFindFirstOrThrowArgs>(args?: SelectSubset<T, TransactionFindFirstOrThrowArgs<ExtArgs>>): Prisma__TransactionClient<$Result.GetResult<Prisma.$TransactionPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Transactions that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TransactionFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Transactions
     * const transactions = await prisma.transaction.findMany()
     * 
     * // Get first 10 Transactions
     * const transactions = await prisma.transaction.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const transactionWithIdOnly = await prisma.transaction.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends TransactionFindManyArgs>(args?: SelectSubset<T, TransactionFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TransactionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Transaction.
     * @param {TransactionCreateArgs} args - Arguments to create a Transaction.
     * @example
     * // Create one Transaction
     * const Transaction = await prisma.transaction.create({
     *   data: {
     *     // ... data to create a Transaction
     *   }
     * })
     * 
     */
    create<T extends TransactionCreateArgs>(args: SelectSubset<T, TransactionCreateArgs<ExtArgs>>): Prisma__TransactionClient<$Result.GetResult<Prisma.$TransactionPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Transactions.
     * @param {TransactionCreateManyArgs} args - Arguments to create many Transactions.
     * @example
     * // Create many Transactions
     * const transaction = await prisma.transaction.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends TransactionCreateManyArgs>(args?: SelectSubset<T, TransactionCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Transactions and returns the data saved in the database.
     * @param {TransactionCreateManyAndReturnArgs} args - Arguments to create many Transactions.
     * @example
     * // Create many Transactions
     * const transaction = await prisma.transaction.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Transactions and only return the `id`
     * const transactionWithIdOnly = await prisma.transaction.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends TransactionCreateManyAndReturnArgs>(args?: SelectSubset<T, TransactionCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TransactionPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Transaction.
     * @param {TransactionDeleteArgs} args - Arguments to delete one Transaction.
     * @example
     * // Delete one Transaction
     * const Transaction = await prisma.transaction.delete({
     *   where: {
     *     // ... filter to delete one Transaction
     *   }
     * })
     * 
     */
    delete<T extends TransactionDeleteArgs>(args: SelectSubset<T, TransactionDeleteArgs<ExtArgs>>): Prisma__TransactionClient<$Result.GetResult<Prisma.$TransactionPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Transaction.
     * @param {TransactionUpdateArgs} args - Arguments to update one Transaction.
     * @example
     * // Update one Transaction
     * const transaction = await prisma.transaction.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends TransactionUpdateArgs>(args: SelectSubset<T, TransactionUpdateArgs<ExtArgs>>): Prisma__TransactionClient<$Result.GetResult<Prisma.$TransactionPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Transactions.
     * @param {TransactionDeleteManyArgs} args - Arguments to filter Transactions to delete.
     * @example
     * // Delete a few Transactions
     * const { count } = await prisma.transaction.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends TransactionDeleteManyArgs>(args?: SelectSubset<T, TransactionDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Transactions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TransactionUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Transactions
     * const transaction = await prisma.transaction.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends TransactionUpdateManyArgs>(args: SelectSubset<T, TransactionUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Transactions and returns the data updated in the database.
     * @param {TransactionUpdateManyAndReturnArgs} args - Arguments to update many Transactions.
     * @example
     * // Update many Transactions
     * const transaction = await prisma.transaction.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Transactions and only return the `id`
     * const transactionWithIdOnly = await prisma.transaction.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends TransactionUpdateManyAndReturnArgs>(args: SelectSubset<T, TransactionUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TransactionPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Transaction.
     * @param {TransactionUpsertArgs} args - Arguments to update or create a Transaction.
     * @example
     * // Update or create a Transaction
     * const transaction = await prisma.transaction.upsert({
     *   create: {
     *     // ... data to create a Transaction
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Transaction we want to update
     *   }
     * })
     */
    upsert<T extends TransactionUpsertArgs>(args: SelectSubset<T, TransactionUpsertArgs<ExtArgs>>): Prisma__TransactionClient<$Result.GetResult<Prisma.$TransactionPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Transactions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TransactionCountArgs} args - Arguments to filter Transactions to count.
     * @example
     * // Count the number of Transactions
     * const count = await prisma.transaction.count({
     *   where: {
     *     // ... the filter for the Transactions we want to count
     *   }
     * })
    **/
    count<T extends TransactionCountArgs>(
      args?: Subset<T, TransactionCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], TransactionCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Transaction.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TransactionAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends TransactionAggregateArgs>(args: Subset<T, TransactionAggregateArgs>): Prisma.PrismaPromise<GetTransactionAggregateType<T>>

    /**
     * Group by Transaction.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TransactionGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends TransactionGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: TransactionGroupByArgs['orderBy'] }
        : { orderBy?: TransactionGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, TransactionGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetTransactionGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Transaction model
   */
  readonly fields: TransactionFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Transaction.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__TransactionClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    client<T extends ClientDefaultArgs<ExtArgs> = {}>(args?: Subset<T, ClientDefaultArgs<ExtArgs>>): Prisma__ClientClient<$Result.GetResult<Prisma.$ClientPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Transaction model
   */
  interface TransactionFieldRefs {
    readonly id: FieldRef<"Transaction", 'String'>
    readonly clientId: FieldRef<"Transaction", 'String'>
    readonly type: FieldRef<"Transaction", 'TransactionType'>
    readonly amountHt: FieldRef<"Transaction", 'Float'>
    readonly transactionDate: FieldRef<"Transaction", 'DateTime'>
    readonly label: FieldRef<"Transaction", 'String'>
    readonly category: FieldRef<"Transaction", 'String'>
    readonly recurrence: FieldRef<"Transaction", 'String'>
    readonly createdAt: FieldRef<"Transaction", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Transaction findUnique
   */
  export type TransactionFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Transaction
     */
    select?: TransactionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Transaction
     */
    omit?: TransactionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TransactionInclude<ExtArgs> | null
    /**
     * Filter, which Transaction to fetch.
     */
    where: TransactionWhereUniqueInput
  }

  /**
   * Transaction findUniqueOrThrow
   */
  export type TransactionFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Transaction
     */
    select?: TransactionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Transaction
     */
    omit?: TransactionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TransactionInclude<ExtArgs> | null
    /**
     * Filter, which Transaction to fetch.
     */
    where: TransactionWhereUniqueInput
  }

  /**
   * Transaction findFirst
   */
  export type TransactionFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Transaction
     */
    select?: TransactionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Transaction
     */
    omit?: TransactionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TransactionInclude<ExtArgs> | null
    /**
     * Filter, which Transaction to fetch.
     */
    where?: TransactionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Transactions to fetch.
     */
    orderBy?: TransactionOrderByWithRelationInput | TransactionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Transactions.
     */
    cursor?: TransactionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Transactions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Transactions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Transactions.
     */
    distinct?: TransactionScalarFieldEnum | TransactionScalarFieldEnum[]
  }

  /**
   * Transaction findFirstOrThrow
   */
  export type TransactionFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Transaction
     */
    select?: TransactionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Transaction
     */
    omit?: TransactionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TransactionInclude<ExtArgs> | null
    /**
     * Filter, which Transaction to fetch.
     */
    where?: TransactionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Transactions to fetch.
     */
    orderBy?: TransactionOrderByWithRelationInput | TransactionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Transactions.
     */
    cursor?: TransactionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Transactions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Transactions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Transactions.
     */
    distinct?: TransactionScalarFieldEnum | TransactionScalarFieldEnum[]
  }

  /**
   * Transaction findMany
   */
  export type TransactionFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Transaction
     */
    select?: TransactionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Transaction
     */
    omit?: TransactionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TransactionInclude<ExtArgs> | null
    /**
     * Filter, which Transactions to fetch.
     */
    where?: TransactionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Transactions to fetch.
     */
    orderBy?: TransactionOrderByWithRelationInput | TransactionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Transactions.
     */
    cursor?: TransactionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Transactions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Transactions.
     */
    skip?: number
    distinct?: TransactionScalarFieldEnum | TransactionScalarFieldEnum[]
  }

  /**
   * Transaction create
   */
  export type TransactionCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Transaction
     */
    select?: TransactionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Transaction
     */
    omit?: TransactionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TransactionInclude<ExtArgs> | null
    /**
     * The data needed to create a Transaction.
     */
    data: XOR<TransactionCreateInput, TransactionUncheckedCreateInput>
  }

  /**
   * Transaction createMany
   */
  export type TransactionCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Transactions.
     */
    data: TransactionCreateManyInput | TransactionCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Transaction createManyAndReturn
   */
  export type TransactionCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Transaction
     */
    select?: TransactionSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Transaction
     */
    omit?: TransactionOmit<ExtArgs> | null
    /**
     * The data used to create many Transactions.
     */
    data: TransactionCreateManyInput | TransactionCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TransactionIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Transaction update
   */
  export type TransactionUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Transaction
     */
    select?: TransactionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Transaction
     */
    omit?: TransactionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TransactionInclude<ExtArgs> | null
    /**
     * The data needed to update a Transaction.
     */
    data: XOR<TransactionUpdateInput, TransactionUncheckedUpdateInput>
    /**
     * Choose, which Transaction to update.
     */
    where: TransactionWhereUniqueInput
  }

  /**
   * Transaction updateMany
   */
  export type TransactionUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Transactions.
     */
    data: XOR<TransactionUpdateManyMutationInput, TransactionUncheckedUpdateManyInput>
    /**
     * Filter which Transactions to update
     */
    where?: TransactionWhereInput
    /**
     * Limit how many Transactions to update.
     */
    limit?: number
  }

  /**
   * Transaction updateManyAndReturn
   */
  export type TransactionUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Transaction
     */
    select?: TransactionSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Transaction
     */
    omit?: TransactionOmit<ExtArgs> | null
    /**
     * The data used to update Transactions.
     */
    data: XOR<TransactionUpdateManyMutationInput, TransactionUncheckedUpdateManyInput>
    /**
     * Filter which Transactions to update
     */
    where?: TransactionWhereInput
    /**
     * Limit how many Transactions to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TransactionIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Transaction upsert
   */
  export type TransactionUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Transaction
     */
    select?: TransactionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Transaction
     */
    omit?: TransactionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TransactionInclude<ExtArgs> | null
    /**
     * The filter to search for the Transaction to update in case it exists.
     */
    where: TransactionWhereUniqueInput
    /**
     * In case the Transaction found by the `where` argument doesn't exist, create a new Transaction with this data.
     */
    create: XOR<TransactionCreateInput, TransactionUncheckedCreateInput>
    /**
     * In case the Transaction was found with the provided `where` argument, update it with this data.
     */
    update: XOR<TransactionUpdateInput, TransactionUncheckedUpdateInput>
  }

  /**
   * Transaction delete
   */
  export type TransactionDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Transaction
     */
    select?: TransactionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Transaction
     */
    omit?: TransactionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TransactionInclude<ExtArgs> | null
    /**
     * Filter which Transaction to delete.
     */
    where: TransactionWhereUniqueInput
  }

  /**
   * Transaction deleteMany
   */
  export type TransactionDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Transactions to delete
     */
    where?: TransactionWhereInput
    /**
     * Limit how many Transactions to delete.
     */
    limit?: number
  }

  /**
   * Transaction without action
   */
  export type TransactionDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Transaction
     */
    select?: TransactionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Transaction
     */
    omit?: TransactionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TransactionInclude<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    ReadUncommitted: 'ReadUncommitted',
    ReadCommitted: 'ReadCommitted',
    RepeatableRead: 'RepeatableRead',
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const UserScalarFieldEnum: {
    id: 'id',
    email: 'email',
    password: 'password',
    name: 'name',
    role: 'role',
    createdAt: 'createdAt'
  };

  export type UserScalarFieldEnum = (typeof UserScalarFieldEnum)[keyof typeof UserScalarFieldEnum]


  export const ClientScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    adminId: 'adminId',
    companyName: 'companyName',
    sector: 'sector',
    status: 'status'
  };

  export type ClientScalarFieldEnum = (typeof ClientScalarFieldEnum)[keyof typeof ClientScalarFieldEnum]


  export const CycleScalarFieldEnum: {
    id: 'id',
    clientId: 'clientId',
    cycleNumber: 'cycleNumber',
    mainObjective: 'mainObjective',
    caTargetMonthly: 'caTargetMonthly',
    startDate: 'startDate',
    endDate: 'endDate',
    status: 'status',
    createdAt: 'createdAt'
  };

  export type CycleScalarFieldEnum = (typeof CycleScalarFieldEnum)[keyof typeof CycleScalarFieldEnum]


  export const WeekScalarFieldEnum: {
    id: 'id',
    cycleId: 'cycleId',
    weekNumber: 'weekNumber',
    startDate: 'startDate',
    focusTitle: 'focusTitle',
    actions: 'actions',
    createdAt: 'createdAt'
  };

  export type WeekScalarFieldEnum = (typeof WeekScalarFieldEnum)[keyof typeof WeekScalarFieldEnum]


  export const ObjectiveScalarFieldEnum: {
    id: 'id',
    cycleId: 'cycleId',
    title: 'title',
    description: 'description',
    progressPct: 'progressPct',
    status: 'status',
    createdAt: 'createdAt'
  };

  export type ObjectiveScalarFieldEnum = (typeof ObjectiveScalarFieldEnum)[keyof typeof ObjectiveScalarFieldEnum]


  export const TransactionScalarFieldEnum: {
    id: 'id',
    clientId: 'clientId',
    type: 'type',
    amountHt: 'amountHt',
    transactionDate: 'transactionDate',
    label: 'label',
    category: 'category',
    recurrence: 'recurrence',
    createdAt: 'createdAt'
  };

  export type TransactionScalarFieldEnum = (typeof TransactionScalarFieldEnum)[keyof typeof TransactionScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const QueryMode: {
    default: 'default',
    insensitive: 'insensitive'
  };

  export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode]


  export const NullsOrder: {
    first: 'first',
    last: 'last'
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]


  /**
   * Field references
   */


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'String[]'
   */
  export type ListStringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String[]'>
    


  /**
   * Reference to a field of type 'Role'
   */
  export type EnumRoleFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Role'>
    


  /**
   * Reference to a field of type 'Role[]'
   */
  export type ListEnumRoleFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Role[]'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'DateTime[]'
   */
  export type ListDateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime[]'>
    


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Int[]'
   */
  export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int[]'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    


  /**
   * Reference to a field of type 'Float[]'
   */
  export type ListFloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float[]'>
    


  /**
   * Reference to a field of type 'CycleStatus'
   */
  export type EnumCycleStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'CycleStatus'>
    


  /**
   * Reference to a field of type 'CycleStatus[]'
   */
  export type ListEnumCycleStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'CycleStatus[]'>
    


  /**
   * Reference to a field of type 'ObjectiveStatus'
   */
  export type EnumObjectiveStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'ObjectiveStatus'>
    


  /**
   * Reference to a field of type 'ObjectiveStatus[]'
   */
  export type ListEnumObjectiveStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'ObjectiveStatus[]'>
    


  /**
   * Reference to a field of type 'TransactionType'
   */
  export type EnumTransactionTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'TransactionType'>
    


  /**
   * Reference to a field of type 'TransactionType[]'
   */
  export type ListEnumTransactionTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'TransactionType[]'>
    
  /**
   * Deep Input Types
   */


  export type UserWhereInput = {
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    id?: StringFilter<"User"> | string
    email?: StringFilter<"User"> | string
    password?: StringFilter<"User"> | string
    name?: StringNullableFilter<"User"> | string | null
    role?: EnumRoleFilter<"User"> | $Enums.Role
    createdAt?: DateTimeFilter<"User"> | Date | string
    client?: XOR<ClientNullableScalarRelationFilter, ClientWhereInput> | null
    managed?: ClientListRelationFilter
  }

  export type UserOrderByWithRelationInput = {
    id?: SortOrder
    email?: SortOrder
    password?: SortOrder
    name?: SortOrderInput | SortOrder
    role?: SortOrder
    createdAt?: SortOrder
    client?: ClientOrderByWithRelationInput
    managed?: ClientOrderByRelationAggregateInput
  }

  export type UserWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    email?: string
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    password?: StringFilter<"User"> | string
    name?: StringNullableFilter<"User"> | string | null
    role?: EnumRoleFilter<"User"> | $Enums.Role
    createdAt?: DateTimeFilter<"User"> | Date | string
    client?: XOR<ClientNullableScalarRelationFilter, ClientWhereInput> | null
    managed?: ClientListRelationFilter
  }, "id" | "email">

  export type UserOrderByWithAggregationInput = {
    id?: SortOrder
    email?: SortOrder
    password?: SortOrder
    name?: SortOrderInput | SortOrder
    role?: SortOrder
    createdAt?: SortOrder
    _count?: UserCountOrderByAggregateInput
    _max?: UserMaxOrderByAggregateInput
    _min?: UserMinOrderByAggregateInput
  }

  export type UserScalarWhereWithAggregatesInput = {
    AND?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    OR?: UserScalarWhereWithAggregatesInput[]
    NOT?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"User"> | string
    email?: StringWithAggregatesFilter<"User"> | string
    password?: StringWithAggregatesFilter<"User"> | string
    name?: StringNullableWithAggregatesFilter<"User"> | string | null
    role?: EnumRoleWithAggregatesFilter<"User"> | $Enums.Role
    createdAt?: DateTimeWithAggregatesFilter<"User"> | Date | string
  }

  export type ClientWhereInput = {
    AND?: ClientWhereInput | ClientWhereInput[]
    OR?: ClientWhereInput[]
    NOT?: ClientWhereInput | ClientWhereInput[]
    id?: StringFilter<"Client"> | string
    userId?: StringFilter<"Client"> | string
    adminId?: StringNullableFilter<"Client"> | string | null
    companyName?: StringFilter<"Client"> | string
    sector?: StringNullableFilter<"Client"> | string | null
    status?: StringNullableFilter<"Client"> | string | null
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
    admin?: XOR<UserNullableScalarRelationFilter, UserWhereInput> | null
    cycles?: CycleListRelationFilter
    transactions?: TransactionListRelationFilter
  }

  export type ClientOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrder
    adminId?: SortOrderInput | SortOrder
    companyName?: SortOrder
    sector?: SortOrderInput | SortOrder
    status?: SortOrderInput | SortOrder
    user?: UserOrderByWithRelationInput
    admin?: UserOrderByWithRelationInput
    cycles?: CycleOrderByRelationAggregateInput
    transactions?: TransactionOrderByRelationAggregateInput
  }

  export type ClientWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    userId?: string
    AND?: ClientWhereInput | ClientWhereInput[]
    OR?: ClientWhereInput[]
    NOT?: ClientWhereInput | ClientWhereInput[]
    adminId?: StringNullableFilter<"Client"> | string | null
    companyName?: StringFilter<"Client"> | string
    sector?: StringNullableFilter<"Client"> | string | null
    status?: StringNullableFilter<"Client"> | string | null
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
    admin?: XOR<UserNullableScalarRelationFilter, UserWhereInput> | null
    cycles?: CycleListRelationFilter
    transactions?: TransactionListRelationFilter
  }, "id" | "userId">

  export type ClientOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrder
    adminId?: SortOrderInput | SortOrder
    companyName?: SortOrder
    sector?: SortOrderInput | SortOrder
    status?: SortOrderInput | SortOrder
    _count?: ClientCountOrderByAggregateInput
    _max?: ClientMaxOrderByAggregateInput
    _min?: ClientMinOrderByAggregateInput
  }

  export type ClientScalarWhereWithAggregatesInput = {
    AND?: ClientScalarWhereWithAggregatesInput | ClientScalarWhereWithAggregatesInput[]
    OR?: ClientScalarWhereWithAggregatesInput[]
    NOT?: ClientScalarWhereWithAggregatesInput | ClientScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Client"> | string
    userId?: StringWithAggregatesFilter<"Client"> | string
    adminId?: StringNullableWithAggregatesFilter<"Client"> | string | null
    companyName?: StringWithAggregatesFilter<"Client"> | string
    sector?: StringNullableWithAggregatesFilter<"Client"> | string | null
    status?: StringNullableWithAggregatesFilter<"Client"> | string | null
  }

  export type CycleWhereInput = {
    AND?: CycleWhereInput | CycleWhereInput[]
    OR?: CycleWhereInput[]
    NOT?: CycleWhereInput | CycleWhereInput[]
    id?: StringFilter<"Cycle"> | string
    clientId?: StringFilter<"Cycle"> | string
    cycleNumber?: IntFilter<"Cycle"> | number
    mainObjective?: StringFilter<"Cycle"> | string
    caTargetMonthly?: FloatFilter<"Cycle"> | number
    startDate?: DateTimeFilter<"Cycle"> | Date | string
    endDate?: DateTimeFilter<"Cycle"> | Date | string
    status?: EnumCycleStatusFilter<"Cycle"> | $Enums.CycleStatus
    createdAt?: DateTimeFilter<"Cycle"> | Date | string
    client?: XOR<ClientScalarRelationFilter, ClientWhereInput>
    weeks?: WeekListRelationFilter
    objectives?: ObjectiveListRelationFilter
  }

  export type CycleOrderByWithRelationInput = {
    id?: SortOrder
    clientId?: SortOrder
    cycleNumber?: SortOrder
    mainObjective?: SortOrder
    caTargetMonthly?: SortOrder
    startDate?: SortOrder
    endDate?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    client?: ClientOrderByWithRelationInput
    weeks?: WeekOrderByRelationAggregateInput
    objectives?: ObjectiveOrderByRelationAggregateInput
  }

  export type CycleWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: CycleWhereInput | CycleWhereInput[]
    OR?: CycleWhereInput[]
    NOT?: CycleWhereInput | CycleWhereInput[]
    clientId?: StringFilter<"Cycle"> | string
    cycleNumber?: IntFilter<"Cycle"> | number
    mainObjective?: StringFilter<"Cycle"> | string
    caTargetMonthly?: FloatFilter<"Cycle"> | number
    startDate?: DateTimeFilter<"Cycle"> | Date | string
    endDate?: DateTimeFilter<"Cycle"> | Date | string
    status?: EnumCycleStatusFilter<"Cycle"> | $Enums.CycleStatus
    createdAt?: DateTimeFilter<"Cycle"> | Date | string
    client?: XOR<ClientScalarRelationFilter, ClientWhereInput>
    weeks?: WeekListRelationFilter
    objectives?: ObjectiveListRelationFilter
  }, "id">

  export type CycleOrderByWithAggregationInput = {
    id?: SortOrder
    clientId?: SortOrder
    cycleNumber?: SortOrder
    mainObjective?: SortOrder
    caTargetMonthly?: SortOrder
    startDate?: SortOrder
    endDate?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    _count?: CycleCountOrderByAggregateInput
    _avg?: CycleAvgOrderByAggregateInput
    _max?: CycleMaxOrderByAggregateInput
    _min?: CycleMinOrderByAggregateInput
    _sum?: CycleSumOrderByAggregateInput
  }

  export type CycleScalarWhereWithAggregatesInput = {
    AND?: CycleScalarWhereWithAggregatesInput | CycleScalarWhereWithAggregatesInput[]
    OR?: CycleScalarWhereWithAggregatesInput[]
    NOT?: CycleScalarWhereWithAggregatesInput | CycleScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Cycle"> | string
    clientId?: StringWithAggregatesFilter<"Cycle"> | string
    cycleNumber?: IntWithAggregatesFilter<"Cycle"> | number
    mainObjective?: StringWithAggregatesFilter<"Cycle"> | string
    caTargetMonthly?: FloatWithAggregatesFilter<"Cycle"> | number
    startDate?: DateTimeWithAggregatesFilter<"Cycle"> | Date | string
    endDate?: DateTimeWithAggregatesFilter<"Cycle"> | Date | string
    status?: EnumCycleStatusWithAggregatesFilter<"Cycle"> | $Enums.CycleStatus
    createdAt?: DateTimeWithAggregatesFilter<"Cycle"> | Date | string
  }

  export type WeekWhereInput = {
    AND?: WeekWhereInput | WeekWhereInput[]
    OR?: WeekWhereInput[]
    NOT?: WeekWhereInput | WeekWhereInput[]
    id?: StringFilter<"Week"> | string
    cycleId?: StringFilter<"Week"> | string
    weekNumber?: IntFilter<"Week"> | number
    startDate?: DateTimeNullableFilter<"Week"> | Date | string | null
    focusTitle?: StringNullableFilter<"Week"> | string | null
    actions?: StringNullableListFilter<"Week">
    createdAt?: DateTimeFilter<"Week"> | Date | string
    cycle?: XOR<CycleScalarRelationFilter, CycleWhereInput>
  }

  export type WeekOrderByWithRelationInput = {
    id?: SortOrder
    cycleId?: SortOrder
    weekNumber?: SortOrder
    startDate?: SortOrderInput | SortOrder
    focusTitle?: SortOrderInput | SortOrder
    actions?: SortOrder
    createdAt?: SortOrder
    cycle?: CycleOrderByWithRelationInput
  }

  export type WeekWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: WeekWhereInput | WeekWhereInput[]
    OR?: WeekWhereInput[]
    NOT?: WeekWhereInput | WeekWhereInput[]
    cycleId?: StringFilter<"Week"> | string
    weekNumber?: IntFilter<"Week"> | number
    startDate?: DateTimeNullableFilter<"Week"> | Date | string | null
    focusTitle?: StringNullableFilter<"Week"> | string | null
    actions?: StringNullableListFilter<"Week">
    createdAt?: DateTimeFilter<"Week"> | Date | string
    cycle?: XOR<CycleScalarRelationFilter, CycleWhereInput>
  }, "id">

  export type WeekOrderByWithAggregationInput = {
    id?: SortOrder
    cycleId?: SortOrder
    weekNumber?: SortOrder
    startDate?: SortOrderInput | SortOrder
    focusTitle?: SortOrderInput | SortOrder
    actions?: SortOrder
    createdAt?: SortOrder
    _count?: WeekCountOrderByAggregateInput
    _avg?: WeekAvgOrderByAggregateInput
    _max?: WeekMaxOrderByAggregateInput
    _min?: WeekMinOrderByAggregateInput
    _sum?: WeekSumOrderByAggregateInput
  }

  export type WeekScalarWhereWithAggregatesInput = {
    AND?: WeekScalarWhereWithAggregatesInput | WeekScalarWhereWithAggregatesInput[]
    OR?: WeekScalarWhereWithAggregatesInput[]
    NOT?: WeekScalarWhereWithAggregatesInput | WeekScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Week"> | string
    cycleId?: StringWithAggregatesFilter<"Week"> | string
    weekNumber?: IntWithAggregatesFilter<"Week"> | number
    startDate?: DateTimeNullableWithAggregatesFilter<"Week"> | Date | string | null
    focusTitle?: StringNullableWithAggregatesFilter<"Week"> | string | null
    actions?: StringNullableListFilter<"Week">
    createdAt?: DateTimeWithAggregatesFilter<"Week"> | Date | string
  }

  export type ObjectiveWhereInput = {
    AND?: ObjectiveWhereInput | ObjectiveWhereInput[]
    OR?: ObjectiveWhereInput[]
    NOT?: ObjectiveWhereInput | ObjectiveWhereInput[]
    id?: StringFilter<"Objective"> | string
    cycleId?: StringFilter<"Objective"> | string
    title?: StringFilter<"Objective"> | string
    description?: StringNullableFilter<"Objective"> | string | null
    progressPct?: IntFilter<"Objective"> | number
    status?: EnumObjectiveStatusFilter<"Objective"> | $Enums.ObjectiveStatus
    createdAt?: DateTimeFilter<"Objective"> | Date | string
    cycle?: XOR<CycleScalarRelationFilter, CycleWhereInput>
  }

  export type ObjectiveOrderByWithRelationInput = {
    id?: SortOrder
    cycleId?: SortOrder
    title?: SortOrder
    description?: SortOrderInput | SortOrder
    progressPct?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    cycle?: CycleOrderByWithRelationInput
  }

  export type ObjectiveWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: ObjectiveWhereInput | ObjectiveWhereInput[]
    OR?: ObjectiveWhereInput[]
    NOT?: ObjectiveWhereInput | ObjectiveWhereInput[]
    cycleId?: StringFilter<"Objective"> | string
    title?: StringFilter<"Objective"> | string
    description?: StringNullableFilter<"Objective"> | string | null
    progressPct?: IntFilter<"Objective"> | number
    status?: EnumObjectiveStatusFilter<"Objective"> | $Enums.ObjectiveStatus
    createdAt?: DateTimeFilter<"Objective"> | Date | string
    cycle?: XOR<CycleScalarRelationFilter, CycleWhereInput>
  }, "id">

  export type ObjectiveOrderByWithAggregationInput = {
    id?: SortOrder
    cycleId?: SortOrder
    title?: SortOrder
    description?: SortOrderInput | SortOrder
    progressPct?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    _count?: ObjectiveCountOrderByAggregateInput
    _avg?: ObjectiveAvgOrderByAggregateInput
    _max?: ObjectiveMaxOrderByAggregateInput
    _min?: ObjectiveMinOrderByAggregateInput
    _sum?: ObjectiveSumOrderByAggregateInput
  }

  export type ObjectiveScalarWhereWithAggregatesInput = {
    AND?: ObjectiveScalarWhereWithAggregatesInput | ObjectiveScalarWhereWithAggregatesInput[]
    OR?: ObjectiveScalarWhereWithAggregatesInput[]
    NOT?: ObjectiveScalarWhereWithAggregatesInput | ObjectiveScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Objective"> | string
    cycleId?: StringWithAggregatesFilter<"Objective"> | string
    title?: StringWithAggregatesFilter<"Objective"> | string
    description?: StringNullableWithAggregatesFilter<"Objective"> | string | null
    progressPct?: IntWithAggregatesFilter<"Objective"> | number
    status?: EnumObjectiveStatusWithAggregatesFilter<"Objective"> | $Enums.ObjectiveStatus
    createdAt?: DateTimeWithAggregatesFilter<"Objective"> | Date | string
  }

  export type TransactionWhereInput = {
    AND?: TransactionWhereInput | TransactionWhereInput[]
    OR?: TransactionWhereInput[]
    NOT?: TransactionWhereInput | TransactionWhereInput[]
    id?: StringFilter<"Transaction"> | string
    clientId?: StringFilter<"Transaction"> | string
    type?: EnumTransactionTypeFilter<"Transaction"> | $Enums.TransactionType
    amountHt?: FloatFilter<"Transaction"> | number
    transactionDate?: DateTimeFilter<"Transaction"> | Date | string
    label?: StringNullableFilter<"Transaction"> | string | null
    category?: StringNullableFilter<"Transaction"> | string | null
    recurrence?: StringNullableFilter<"Transaction"> | string | null
    createdAt?: DateTimeFilter<"Transaction"> | Date | string
    client?: XOR<ClientScalarRelationFilter, ClientWhereInput>
  }

  export type TransactionOrderByWithRelationInput = {
    id?: SortOrder
    clientId?: SortOrder
    type?: SortOrder
    amountHt?: SortOrder
    transactionDate?: SortOrder
    label?: SortOrderInput | SortOrder
    category?: SortOrderInput | SortOrder
    recurrence?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    client?: ClientOrderByWithRelationInput
  }

  export type TransactionWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: TransactionWhereInput | TransactionWhereInput[]
    OR?: TransactionWhereInput[]
    NOT?: TransactionWhereInput | TransactionWhereInput[]
    clientId?: StringFilter<"Transaction"> | string
    type?: EnumTransactionTypeFilter<"Transaction"> | $Enums.TransactionType
    amountHt?: FloatFilter<"Transaction"> | number
    transactionDate?: DateTimeFilter<"Transaction"> | Date | string
    label?: StringNullableFilter<"Transaction"> | string | null
    category?: StringNullableFilter<"Transaction"> | string | null
    recurrence?: StringNullableFilter<"Transaction"> | string | null
    createdAt?: DateTimeFilter<"Transaction"> | Date | string
    client?: XOR<ClientScalarRelationFilter, ClientWhereInput>
  }, "id">

  export type TransactionOrderByWithAggregationInput = {
    id?: SortOrder
    clientId?: SortOrder
    type?: SortOrder
    amountHt?: SortOrder
    transactionDate?: SortOrder
    label?: SortOrderInput | SortOrder
    category?: SortOrderInput | SortOrder
    recurrence?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    _count?: TransactionCountOrderByAggregateInput
    _avg?: TransactionAvgOrderByAggregateInput
    _max?: TransactionMaxOrderByAggregateInput
    _min?: TransactionMinOrderByAggregateInput
    _sum?: TransactionSumOrderByAggregateInput
  }

  export type TransactionScalarWhereWithAggregatesInput = {
    AND?: TransactionScalarWhereWithAggregatesInput | TransactionScalarWhereWithAggregatesInput[]
    OR?: TransactionScalarWhereWithAggregatesInput[]
    NOT?: TransactionScalarWhereWithAggregatesInput | TransactionScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Transaction"> | string
    clientId?: StringWithAggregatesFilter<"Transaction"> | string
    type?: EnumTransactionTypeWithAggregatesFilter<"Transaction"> | $Enums.TransactionType
    amountHt?: FloatWithAggregatesFilter<"Transaction"> | number
    transactionDate?: DateTimeWithAggregatesFilter<"Transaction"> | Date | string
    label?: StringNullableWithAggregatesFilter<"Transaction"> | string | null
    category?: StringNullableWithAggregatesFilter<"Transaction"> | string | null
    recurrence?: StringNullableWithAggregatesFilter<"Transaction"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"Transaction"> | Date | string
  }

  export type UserCreateInput = {
    id?: string
    email: string
    password: string
    name?: string | null
    role?: $Enums.Role
    createdAt?: Date | string
    client?: ClientCreateNestedOneWithoutUserInput
    managed?: ClientCreateNestedManyWithoutAdminInput
  }

  export type UserUncheckedCreateInput = {
    id?: string
    email: string
    password: string
    name?: string | null
    role?: $Enums.Role
    createdAt?: Date | string
    client?: ClientUncheckedCreateNestedOneWithoutUserInput
    managed?: ClientUncheckedCreateNestedManyWithoutAdminInput
  }

  export type UserUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    client?: ClientUpdateOneWithoutUserNestedInput
    managed?: ClientUpdateManyWithoutAdminNestedInput
  }

  export type UserUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    client?: ClientUncheckedUpdateOneWithoutUserNestedInput
    managed?: ClientUncheckedUpdateManyWithoutAdminNestedInput
  }

  export type UserCreateManyInput = {
    id?: string
    email: string
    password: string
    name?: string | null
    role?: $Enums.Role
    createdAt?: Date | string
  }

  export type UserUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ClientCreateInput = {
    id?: string
    companyName: string
    sector?: string | null
    status?: string | null
    user: UserCreateNestedOneWithoutClientInput
    admin?: UserCreateNestedOneWithoutManagedInput
    cycles?: CycleCreateNestedManyWithoutClientInput
    transactions?: TransactionCreateNestedManyWithoutClientInput
  }

  export type ClientUncheckedCreateInput = {
    id?: string
    userId: string
    adminId?: string | null
    companyName: string
    sector?: string | null
    status?: string | null
    cycles?: CycleUncheckedCreateNestedManyWithoutClientInput
    transactions?: TransactionUncheckedCreateNestedManyWithoutClientInput
  }

  export type ClientUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    companyName?: StringFieldUpdateOperationsInput | string
    sector?: NullableStringFieldUpdateOperationsInput | string | null
    status?: NullableStringFieldUpdateOperationsInput | string | null
    user?: UserUpdateOneRequiredWithoutClientNestedInput
    admin?: UserUpdateOneWithoutManagedNestedInput
    cycles?: CycleUpdateManyWithoutClientNestedInput
    transactions?: TransactionUpdateManyWithoutClientNestedInput
  }

  export type ClientUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    adminId?: NullableStringFieldUpdateOperationsInput | string | null
    companyName?: StringFieldUpdateOperationsInput | string
    sector?: NullableStringFieldUpdateOperationsInput | string | null
    status?: NullableStringFieldUpdateOperationsInput | string | null
    cycles?: CycleUncheckedUpdateManyWithoutClientNestedInput
    transactions?: TransactionUncheckedUpdateManyWithoutClientNestedInput
  }

  export type ClientCreateManyInput = {
    id?: string
    userId: string
    adminId?: string | null
    companyName: string
    sector?: string | null
    status?: string | null
  }

  export type ClientUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    companyName?: StringFieldUpdateOperationsInput | string
    sector?: NullableStringFieldUpdateOperationsInput | string | null
    status?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type ClientUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    adminId?: NullableStringFieldUpdateOperationsInput | string | null
    companyName?: StringFieldUpdateOperationsInput | string
    sector?: NullableStringFieldUpdateOperationsInput | string | null
    status?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type CycleCreateInput = {
    id?: string
    cycleNumber: number
    mainObjective: string
    caTargetMonthly?: number
    startDate: Date | string
    endDate: Date | string
    status?: $Enums.CycleStatus
    createdAt?: Date | string
    client: ClientCreateNestedOneWithoutCyclesInput
    weeks?: WeekCreateNestedManyWithoutCycleInput
    objectives?: ObjectiveCreateNestedManyWithoutCycleInput
  }

  export type CycleUncheckedCreateInput = {
    id?: string
    clientId: string
    cycleNumber: number
    mainObjective: string
    caTargetMonthly?: number
    startDate: Date | string
    endDate: Date | string
    status?: $Enums.CycleStatus
    createdAt?: Date | string
    weeks?: WeekUncheckedCreateNestedManyWithoutCycleInput
    objectives?: ObjectiveUncheckedCreateNestedManyWithoutCycleInput
  }

  export type CycleUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    cycleNumber?: IntFieldUpdateOperationsInput | number
    mainObjective?: StringFieldUpdateOperationsInput | string
    caTargetMonthly?: FloatFieldUpdateOperationsInput | number
    startDate?: DateTimeFieldUpdateOperationsInput | Date | string
    endDate?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: EnumCycleStatusFieldUpdateOperationsInput | $Enums.CycleStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    client?: ClientUpdateOneRequiredWithoutCyclesNestedInput
    weeks?: WeekUpdateManyWithoutCycleNestedInput
    objectives?: ObjectiveUpdateManyWithoutCycleNestedInput
  }

  export type CycleUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    clientId?: StringFieldUpdateOperationsInput | string
    cycleNumber?: IntFieldUpdateOperationsInput | number
    mainObjective?: StringFieldUpdateOperationsInput | string
    caTargetMonthly?: FloatFieldUpdateOperationsInput | number
    startDate?: DateTimeFieldUpdateOperationsInput | Date | string
    endDate?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: EnumCycleStatusFieldUpdateOperationsInput | $Enums.CycleStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    weeks?: WeekUncheckedUpdateManyWithoutCycleNestedInput
    objectives?: ObjectiveUncheckedUpdateManyWithoutCycleNestedInput
  }

  export type CycleCreateManyInput = {
    id?: string
    clientId: string
    cycleNumber: number
    mainObjective: string
    caTargetMonthly?: number
    startDate: Date | string
    endDate: Date | string
    status?: $Enums.CycleStatus
    createdAt?: Date | string
  }

  export type CycleUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    cycleNumber?: IntFieldUpdateOperationsInput | number
    mainObjective?: StringFieldUpdateOperationsInput | string
    caTargetMonthly?: FloatFieldUpdateOperationsInput | number
    startDate?: DateTimeFieldUpdateOperationsInput | Date | string
    endDate?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: EnumCycleStatusFieldUpdateOperationsInput | $Enums.CycleStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CycleUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    clientId?: StringFieldUpdateOperationsInput | string
    cycleNumber?: IntFieldUpdateOperationsInput | number
    mainObjective?: StringFieldUpdateOperationsInput | string
    caTargetMonthly?: FloatFieldUpdateOperationsInput | number
    startDate?: DateTimeFieldUpdateOperationsInput | Date | string
    endDate?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: EnumCycleStatusFieldUpdateOperationsInput | $Enums.CycleStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type WeekCreateInput = {
    id?: string
    weekNumber: number
    startDate?: Date | string | null
    focusTitle?: string | null
    actions?: WeekCreateactionsInput | string[]
    createdAt?: Date | string
    cycle: CycleCreateNestedOneWithoutWeeksInput
  }

  export type WeekUncheckedCreateInput = {
    id?: string
    cycleId: string
    weekNumber: number
    startDate?: Date | string | null
    focusTitle?: string | null
    actions?: WeekCreateactionsInput | string[]
    createdAt?: Date | string
  }

  export type WeekUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    weekNumber?: IntFieldUpdateOperationsInput | number
    startDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    focusTitle?: NullableStringFieldUpdateOperationsInput | string | null
    actions?: WeekUpdateactionsInput | string[]
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    cycle?: CycleUpdateOneRequiredWithoutWeeksNestedInput
  }

  export type WeekUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    cycleId?: StringFieldUpdateOperationsInput | string
    weekNumber?: IntFieldUpdateOperationsInput | number
    startDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    focusTitle?: NullableStringFieldUpdateOperationsInput | string | null
    actions?: WeekUpdateactionsInput | string[]
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type WeekCreateManyInput = {
    id?: string
    cycleId: string
    weekNumber: number
    startDate?: Date | string | null
    focusTitle?: string | null
    actions?: WeekCreateactionsInput | string[]
    createdAt?: Date | string
  }

  export type WeekUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    weekNumber?: IntFieldUpdateOperationsInput | number
    startDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    focusTitle?: NullableStringFieldUpdateOperationsInput | string | null
    actions?: WeekUpdateactionsInput | string[]
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type WeekUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    cycleId?: StringFieldUpdateOperationsInput | string
    weekNumber?: IntFieldUpdateOperationsInput | number
    startDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    focusTitle?: NullableStringFieldUpdateOperationsInput | string | null
    actions?: WeekUpdateactionsInput | string[]
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ObjectiveCreateInput = {
    id?: string
    title: string
    description?: string | null
    progressPct?: number
    status?: $Enums.ObjectiveStatus
    createdAt?: Date | string
    cycle: CycleCreateNestedOneWithoutObjectivesInput
  }

  export type ObjectiveUncheckedCreateInput = {
    id?: string
    cycleId: string
    title: string
    description?: string | null
    progressPct?: number
    status?: $Enums.ObjectiveStatus
    createdAt?: Date | string
  }

  export type ObjectiveUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    progressPct?: IntFieldUpdateOperationsInput | number
    status?: EnumObjectiveStatusFieldUpdateOperationsInput | $Enums.ObjectiveStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    cycle?: CycleUpdateOneRequiredWithoutObjectivesNestedInput
  }

  export type ObjectiveUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    cycleId?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    progressPct?: IntFieldUpdateOperationsInput | number
    status?: EnumObjectiveStatusFieldUpdateOperationsInput | $Enums.ObjectiveStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ObjectiveCreateManyInput = {
    id?: string
    cycleId: string
    title: string
    description?: string | null
    progressPct?: number
    status?: $Enums.ObjectiveStatus
    createdAt?: Date | string
  }

  export type ObjectiveUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    progressPct?: IntFieldUpdateOperationsInput | number
    status?: EnumObjectiveStatusFieldUpdateOperationsInput | $Enums.ObjectiveStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ObjectiveUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    cycleId?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    progressPct?: IntFieldUpdateOperationsInput | number
    status?: EnumObjectiveStatusFieldUpdateOperationsInput | $Enums.ObjectiveStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TransactionCreateInput = {
    id?: string
    type: $Enums.TransactionType
    amountHt: number
    transactionDate: Date | string
    label?: string | null
    category?: string | null
    recurrence?: string | null
    createdAt?: Date | string
    client: ClientCreateNestedOneWithoutTransactionsInput
  }

  export type TransactionUncheckedCreateInput = {
    id?: string
    clientId: string
    type: $Enums.TransactionType
    amountHt: number
    transactionDate: Date | string
    label?: string | null
    category?: string | null
    recurrence?: string | null
    createdAt?: Date | string
  }

  export type TransactionUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: EnumTransactionTypeFieldUpdateOperationsInput | $Enums.TransactionType
    amountHt?: FloatFieldUpdateOperationsInput | number
    transactionDate?: DateTimeFieldUpdateOperationsInput | Date | string
    label?: NullableStringFieldUpdateOperationsInput | string | null
    category?: NullableStringFieldUpdateOperationsInput | string | null
    recurrence?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    client?: ClientUpdateOneRequiredWithoutTransactionsNestedInput
  }

  export type TransactionUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    clientId?: StringFieldUpdateOperationsInput | string
    type?: EnumTransactionTypeFieldUpdateOperationsInput | $Enums.TransactionType
    amountHt?: FloatFieldUpdateOperationsInput | number
    transactionDate?: DateTimeFieldUpdateOperationsInput | Date | string
    label?: NullableStringFieldUpdateOperationsInput | string | null
    category?: NullableStringFieldUpdateOperationsInput | string | null
    recurrence?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TransactionCreateManyInput = {
    id?: string
    clientId: string
    type: $Enums.TransactionType
    amountHt: number
    transactionDate: Date | string
    label?: string | null
    category?: string | null
    recurrence?: string | null
    createdAt?: Date | string
  }

  export type TransactionUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: EnumTransactionTypeFieldUpdateOperationsInput | $Enums.TransactionType
    amountHt?: FloatFieldUpdateOperationsInput | number
    transactionDate?: DateTimeFieldUpdateOperationsInput | Date | string
    label?: NullableStringFieldUpdateOperationsInput | string | null
    category?: NullableStringFieldUpdateOperationsInput | string | null
    recurrence?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TransactionUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    clientId?: StringFieldUpdateOperationsInput | string
    type?: EnumTransactionTypeFieldUpdateOperationsInput | $Enums.TransactionType
    amountHt?: FloatFieldUpdateOperationsInput | number
    transactionDate?: DateTimeFieldUpdateOperationsInput | Date | string
    label?: NullableStringFieldUpdateOperationsInput | string | null
    category?: NullableStringFieldUpdateOperationsInput | string | null
    recurrence?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type EnumRoleFilter<$PrismaModel = never> = {
    equals?: $Enums.Role | EnumRoleFieldRefInput<$PrismaModel>
    in?: $Enums.Role[] | ListEnumRoleFieldRefInput<$PrismaModel>
    notIn?: $Enums.Role[] | ListEnumRoleFieldRefInput<$PrismaModel>
    not?: NestedEnumRoleFilter<$PrismaModel> | $Enums.Role
  }

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type ClientNullableScalarRelationFilter = {
    is?: ClientWhereInput | null
    isNot?: ClientWhereInput | null
  }

  export type ClientListRelationFilter = {
    every?: ClientWhereInput
    some?: ClientWhereInput
    none?: ClientWhereInput
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type ClientOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type UserCountOrderByAggregateInput = {
    id?: SortOrder
    email?: SortOrder
    password?: SortOrder
    name?: SortOrder
    role?: SortOrder
    createdAt?: SortOrder
  }

  export type UserMaxOrderByAggregateInput = {
    id?: SortOrder
    email?: SortOrder
    password?: SortOrder
    name?: SortOrder
    role?: SortOrder
    createdAt?: SortOrder
  }

  export type UserMinOrderByAggregateInput = {
    id?: SortOrder
    email?: SortOrder
    password?: SortOrder
    name?: SortOrder
    role?: SortOrder
    createdAt?: SortOrder
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type EnumRoleWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.Role | EnumRoleFieldRefInput<$PrismaModel>
    in?: $Enums.Role[] | ListEnumRoleFieldRefInput<$PrismaModel>
    notIn?: $Enums.Role[] | ListEnumRoleFieldRefInput<$PrismaModel>
    not?: NestedEnumRoleWithAggregatesFilter<$PrismaModel> | $Enums.Role
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumRoleFilter<$PrismaModel>
    _max?: NestedEnumRoleFilter<$PrismaModel>
  }

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type UserScalarRelationFilter = {
    is?: UserWhereInput
    isNot?: UserWhereInput
  }

  export type UserNullableScalarRelationFilter = {
    is?: UserWhereInput | null
    isNot?: UserWhereInput | null
  }

  export type CycleListRelationFilter = {
    every?: CycleWhereInput
    some?: CycleWhereInput
    none?: CycleWhereInput
  }

  export type TransactionListRelationFilter = {
    every?: TransactionWhereInput
    some?: TransactionWhereInput
    none?: TransactionWhereInput
  }

  export type CycleOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type TransactionOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type ClientCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    adminId?: SortOrder
    companyName?: SortOrder
    sector?: SortOrder
    status?: SortOrder
  }

  export type ClientMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    adminId?: SortOrder
    companyName?: SortOrder
    sector?: SortOrder
    status?: SortOrder
  }

  export type ClientMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    adminId?: SortOrder
    companyName?: SortOrder
    sector?: SortOrder
    status?: SortOrder
  }

  export type IntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type FloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type EnumCycleStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.CycleStatus | EnumCycleStatusFieldRefInput<$PrismaModel>
    in?: $Enums.CycleStatus[] | ListEnumCycleStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.CycleStatus[] | ListEnumCycleStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumCycleStatusFilter<$PrismaModel> | $Enums.CycleStatus
  }

  export type ClientScalarRelationFilter = {
    is?: ClientWhereInput
    isNot?: ClientWhereInput
  }

  export type WeekListRelationFilter = {
    every?: WeekWhereInput
    some?: WeekWhereInput
    none?: WeekWhereInput
  }

  export type ObjectiveListRelationFilter = {
    every?: ObjectiveWhereInput
    some?: ObjectiveWhereInput
    none?: ObjectiveWhereInput
  }

  export type WeekOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type ObjectiveOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type CycleCountOrderByAggregateInput = {
    id?: SortOrder
    clientId?: SortOrder
    cycleNumber?: SortOrder
    mainObjective?: SortOrder
    caTargetMonthly?: SortOrder
    startDate?: SortOrder
    endDate?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
  }

  export type CycleAvgOrderByAggregateInput = {
    cycleNumber?: SortOrder
    caTargetMonthly?: SortOrder
  }

  export type CycleMaxOrderByAggregateInput = {
    id?: SortOrder
    clientId?: SortOrder
    cycleNumber?: SortOrder
    mainObjective?: SortOrder
    caTargetMonthly?: SortOrder
    startDate?: SortOrder
    endDate?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
  }

  export type CycleMinOrderByAggregateInput = {
    id?: SortOrder
    clientId?: SortOrder
    cycleNumber?: SortOrder
    mainObjective?: SortOrder
    caTargetMonthly?: SortOrder
    startDate?: SortOrder
    endDate?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
  }

  export type CycleSumOrderByAggregateInput = {
    cycleNumber?: SortOrder
    caTargetMonthly?: SortOrder
  }

  export type IntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type FloatWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedFloatFilter<$PrismaModel>
    _min?: NestedFloatFilter<$PrismaModel>
    _max?: NestedFloatFilter<$PrismaModel>
  }

  export type EnumCycleStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.CycleStatus | EnumCycleStatusFieldRefInput<$PrismaModel>
    in?: $Enums.CycleStatus[] | ListEnumCycleStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.CycleStatus[] | ListEnumCycleStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumCycleStatusWithAggregatesFilter<$PrismaModel> | $Enums.CycleStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumCycleStatusFilter<$PrismaModel>
    _max?: NestedEnumCycleStatusFilter<$PrismaModel>
  }

  export type DateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type StringNullableListFilter<$PrismaModel = never> = {
    equals?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    has?: string | StringFieldRefInput<$PrismaModel> | null
    hasEvery?: string[] | ListStringFieldRefInput<$PrismaModel>
    hasSome?: string[] | ListStringFieldRefInput<$PrismaModel>
    isEmpty?: boolean
  }

  export type CycleScalarRelationFilter = {
    is?: CycleWhereInput
    isNot?: CycleWhereInput
  }

  export type WeekCountOrderByAggregateInput = {
    id?: SortOrder
    cycleId?: SortOrder
    weekNumber?: SortOrder
    startDate?: SortOrder
    focusTitle?: SortOrder
    actions?: SortOrder
    createdAt?: SortOrder
  }

  export type WeekAvgOrderByAggregateInput = {
    weekNumber?: SortOrder
  }

  export type WeekMaxOrderByAggregateInput = {
    id?: SortOrder
    cycleId?: SortOrder
    weekNumber?: SortOrder
    startDate?: SortOrder
    focusTitle?: SortOrder
    createdAt?: SortOrder
  }

  export type WeekMinOrderByAggregateInput = {
    id?: SortOrder
    cycleId?: SortOrder
    weekNumber?: SortOrder
    startDate?: SortOrder
    focusTitle?: SortOrder
    createdAt?: SortOrder
  }

  export type WeekSumOrderByAggregateInput = {
    weekNumber?: SortOrder
  }

  export type DateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type EnumObjectiveStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.ObjectiveStatus | EnumObjectiveStatusFieldRefInput<$PrismaModel>
    in?: $Enums.ObjectiveStatus[] | ListEnumObjectiveStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.ObjectiveStatus[] | ListEnumObjectiveStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumObjectiveStatusFilter<$PrismaModel> | $Enums.ObjectiveStatus
  }

  export type ObjectiveCountOrderByAggregateInput = {
    id?: SortOrder
    cycleId?: SortOrder
    title?: SortOrder
    description?: SortOrder
    progressPct?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
  }

  export type ObjectiveAvgOrderByAggregateInput = {
    progressPct?: SortOrder
  }

  export type ObjectiveMaxOrderByAggregateInput = {
    id?: SortOrder
    cycleId?: SortOrder
    title?: SortOrder
    description?: SortOrder
    progressPct?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
  }

  export type ObjectiveMinOrderByAggregateInput = {
    id?: SortOrder
    cycleId?: SortOrder
    title?: SortOrder
    description?: SortOrder
    progressPct?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
  }

  export type ObjectiveSumOrderByAggregateInput = {
    progressPct?: SortOrder
  }

  export type EnumObjectiveStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.ObjectiveStatus | EnumObjectiveStatusFieldRefInput<$PrismaModel>
    in?: $Enums.ObjectiveStatus[] | ListEnumObjectiveStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.ObjectiveStatus[] | ListEnumObjectiveStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumObjectiveStatusWithAggregatesFilter<$PrismaModel> | $Enums.ObjectiveStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumObjectiveStatusFilter<$PrismaModel>
    _max?: NestedEnumObjectiveStatusFilter<$PrismaModel>
  }

  export type EnumTransactionTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.TransactionType | EnumTransactionTypeFieldRefInput<$PrismaModel>
    in?: $Enums.TransactionType[] | ListEnumTransactionTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.TransactionType[] | ListEnumTransactionTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumTransactionTypeFilter<$PrismaModel> | $Enums.TransactionType
  }

  export type TransactionCountOrderByAggregateInput = {
    id?: SortOrder
    clientId?: SortOrder
    type?: SortOrder
    amountHt?: SortOrder
    transactionDate?: SortOrder
    label?: SortOrder
    category?: SortOrder
    recurrence?: SortOrder
    createdAt?: SortOrder
  }

  export type TransactionAvgOrderByAggregateInput = {
    amountHt?: SortOrder
  }

  export type TransactionMaxOrderByAggregateInput = {
    id?: SortOrder
    clientId?: SortOrder
    type?: SortOrder
    amountHt?: SortOrder
    transactionDate?: SortOrder
    label?: SortOrder
    category?: SortOrder
    recurrence?: SortOrder
    createdAt?: SortOrder
  }

  export type TransactionMinOrderByAggregateInput = {
    id?: SortOrder
    clientId?: SortOrder
    type?: SortOrder
    amountHt?: SortOrder
    transactionDate?: SortOrder
    label?: SortOrder
    category?: SortOrder
    recurrence?: SortOrder
    createdAt?: SortOrder
  }

  export type TransactionSumOrderByAggregateInput = {
    amountHt?: SortOrder
  }

  export type EnumTransactionTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.TransactionType | EnumTransactionTypeFieldRefInput<$PrismaModel>
    in?: $Enums.TransactionType[] | ListEnumTransactionTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.TransactionType[] | ListEnumTransactionTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumTransactionTypeWithAggregatesFilter<$PrismaModel> | $Enums.TransactionType
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumTransactionTypeFilter<$PrismaModel>
    _max?: NestedEnumTransactionTypeFilter<$PrismaModel>
  }

  export type ClientCreateNestedOneWithoutUserInput = {
    create?: XOR<ClientCreateWithoutUserInput, ClientUncheckedCreateWithoutUserInput>
    connectOrCreate?: ClientCreateOrConnectWithoutUserInput
    connect?: ClientWhereUniqueInput
  }

  export type ClientCreateNestedManyWithoutAdminInput = {
    create?: XOR<ClientCreateWithoutAdminInput, ClientUncheckedCreateWithoutAdminInput> | ClientCreateWithoutAdminInput[] | ClientUncheckedCreateWithoutAdminInput[]
    connectOrCreate?: ClientCreateOrConnectWithoutAdminInput | ClientCreateOrConnectWithoutAdminInput[]
    createMany?: ClientCreateManyAdminInputEnvelope
    connect?: ClientWhereUniqueInput | ClientWhereUniqueInput[]
  }

  export type ClientUncheckedCreateNestedOneWithoutUserInput = {
    create?: XOR<ClientCreateWithoutUserInput, ClientUncheckedCreateWithoutUserInput>
    connectOrCreate?: ClientCreateOrConnectWithoutUserInput
    connect?: ClientWhereUniqueInput
  }

  export type ClientUncheckedCreateNestedManyWithoutAdminInput = {
    create?: XOR<ClientCreateWithoutAdminInput, ClientUncheckedCreateWithoutAdminInput> | ClientCreateWithoutAdminInput[] | ClientUncheckedCreateWithoutAdminInput[]
    connectOrCreate?: ClientCreateOrConnectWithoutAdminInput | ClientCreateOrConnectWithoutAdminInput[]
    createMany?: ClientCreateManyAdminInputEnvelope
    connect?: ClientWhereUniqueInput | ClientWhereUniqueInput[]
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type EnumRoleFieldUpdateOperationsInput = {
    set?: $Enums.Role
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type ClientUpdateOneWithoutUserNestedInput = {
    create?: XOR<ClientCreateWithoutUserInput, ClientUncheckedCreateWithoutUserInput>
    connectOrCreate?: ClientCreateOrConnectWithoutUserInput
    upsert?: ClientUpsertWithoutUserInput
    disconnect?: ClientWhereInput | boolean
    delete?: ClientWhereInput | boolean
    connect?: ClientWhereUniqueInput
    update?: XOR<XOR<ClientUpdateToOneWithWhereWithoutUserInput, ClientUpdateWithoutUserInput>, ClientUncheckedUpdateWithoutUserInput>
  }

  export type ClientUpdateManyWithoutAdminNestedInput = {
    create?: XOR<ClientCreateWithoutAdminInput, ClientUncheckedCreateWithoutAdminInput> | ClientCreateWithoutAdminInput[] | ClientUncheckedCreateWithoutAdminInput[]
    connectOrCreate?: ClientCreateOrConnectWithoutAdminInput | ClientCreateOrConnectWithoutAdminInput[]
    upsert?: ClientUpsertWithWhereUniqueWithoutAdminInput | ClientUpsertWithWhereUniqueWithoutAdminInput[]
    createMany?: ClientCreateManyAdminInputEnvelope
    set?: ClientWhereUniqueInput | ClientWhereUniqueInput[]
    disconnect?: ClientWhereUniqueInput | ClientWhereUniqueInput[]
    delete?: ClientWhereUniqueInput | ClientWhereUniqueInput[]
    connect?: ClientWhereUniqueInput | ClientWhereUniqueInput[]
    update?: ClientUpdateWithWhereUniqueWithoutAdminInput | ClientUpdateWithWhereUniqueWithoutAdminInput[]
    updateMany?: ClientUpdateManyWithWhereWithoutAdminInput | ClientUpdateManyWithWhereWithoutAdminInput[]
    deleteMany?: ClientScalarWhereInput | ClientScalarWhereInput[]
  }

  export type ClientUncheckedUpdateOneWithoutUserNestedInput = {
    create?: XOR<ClientCreateWithoutUserInput, ClientUncheckedCreateWithoutUserInput>
    connectOrCreate?: ClientCreateOrConnectWithoutUserInput
    upsert?: ClientUpsertWithoutUserInput
    disconnect?: ClientWhereInput | boolean
    delete?: ClientWhereInput | boolean
    connect?: ClientWhereUniqueInput
    update?: XOR<XOR<ClientUpdateToOneWithWhereWithoutUserInput, ClientUpdateWithoutUserInput>, ClientUncheckedUpdateWithoutUserInput>
  }

  export type ClientUncheckedUpdateManyWithoutAdminNestedInput = {
    create?: XOR<ClientCreateWithoutAdminInput, ClientUncheckedCreateWithoutAdminInput> | ClientCreateWithoutAdminInput[] | ClientUncheckedCreateWithoutAdminInput[]
    connectOrCreate?: ClientCreateOrConnectWithoutAdminInput | ClientCreateOrConnectWithoutAdminInput[]
    upsert?: ClientUpsertWithWhereUniqueWithoutAdminInput | ClientUpsertWithWhereUniqueWithoutAdminInput[]
    createMany?: ClientCreateManyAdminInputEnvelope
    set?: ClientWhereUniqueInput | ClientWhereUniqueInput[]
    disconnect?: ClientWhereUniqueInput | ClientWhereUniqueInput[]
    delete?: ClientWhereUniqueInput | ClientWhereUniqueInput[]
    connect?: ClientWhereUniqueInput | ClientWhereUniqueInput[]
    update?: ClientUpdateWithWhereUniqueWithoutAdminInput | ClientUpdateWithWhereUniqueWithoutAdminInput[]
    updateMany?: ClientUpdateManyWithWhereWithoutAdminInput | ClientUpdateManyWithWhereWithoutAdminInput[]
    deleteMany?: ClientScalarWhereInput | ClientScalarWhereInput[]
  }

  export type UserCreateNestedOneWithoutClientInput = {
    create?: XOR<UserCreateWithoutClientInput, UserUncheckedCreateWithoutClientInput>
    connectOrCreate?: UserCreateOrConnectWithoutClientInput
    connect?: UserWhereUniqueInput
  }

  export type UserCreateNestedOneWithoutManagedInput = {
    create?: XOR<UserCreateWithoutManagedInput, UserUncheckedCreateWithoutManagedInput>
    connectOrCreate?: UserCreateOrConnectWithoutManagedInput
    connect?: UserWhereUniqueInput
  }

  export type CycleCreateNestedManyWithoutClientInput = {
    create?: XOR<CycleCreateWithoutClientInput, CycleUncheckedCreateWithoutClientInput> | CycleCreateWithoutClientInput[] | CycleUncheckedCreateWithoutClientInput[]
    connectOrCreate?: CycleCreateOrConnectWithoutClientInput | CycleCreateOrConnectWithoutClientInput[]
    createMany?: CycleCreateManyClientInputEnvelope
    connect?: CycleWhereUniqueInput | CycleWhereUniqueInput[]
  }

  export type TransactionCreateNestedManyWithoutClientInput = {
    create?: XOR<TransactionCreateWithoutClientInput, TransactionUncheckedCreateWithoutClientInput> | TransactionCreateWithoutClientInput[] | TransactionUncheckedCreateWithoutClientInput[]
    connectOrCreate?: TransactionCreateOrConnectWithoutClientInput | TransactionCreateOrConnectWithoutClientInput[]
    createMany?: TransactionCreateManyClientInputEnvelope
    connect?: TransactionWhereUniqueInput | TransactionWhereUniqueInput[]
  }

  export type CycleUncheckedCreateNestedManyWithoutClientInput = {
    create?: XOR<CycleCreateWithoutClientInput, CycleUncheckedCreateWithoutClientInput> | CycleCreateWithoutClientInput[] | CycleUncheckedCreateWithoutClientInput[]
    connectOrCreate?: CycleCreateOrConnectWithoutClientInput | CycleCreateOrConnectWithoutClientInput[]
    createMany?: CycleCreateManyClientInputEnvelope
    connect?: CycleWhereUniqueInput | CycleWhereUniqueInput[]
  }

  export type TransactionUncheckedCreateNestedManyWithoutClientInput = {
    create?: XOR<TransactionCreateWithoutClientInput, TransactionUncheckedCreateWithoutClientInput> | TransactionCreateWithoutClientInput[] | TransactionUncheckedCreateWithoutClientInput[]
    connectOrCreate?: TransactionCreateOrConnectWithoutClientInput | TransactionCreateOrConnectWithoutClientInput[]
    createMany?: TransactionCreateManyClientInputEnvelope
    connect?: TransactionWhereUniqueInput | TransactionWhereUniqueInput[]
  }

  export type UserUpdateOneRequiredWithoutClientNestedInput = {
    create?: XOR<UserCreateWithoutClientInput, UserUncheckedCreateWithoutClientInput>
    connectOrCreate?: UserCreateOrConnectWithoutClientInput
    upsert?: UserUpsertWithoutClientInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutClientInput, UserUpdateWithoutClientInput>, UserUncheckedUpdateWithoutClientInput>
  }

  export type UserUpdateOneWithoutManagedNestedInput = {
    create?: XOR<UserCreateWithoutManagedInput, UserUncheckedCreateWithoutManagedInput>
    connectOrCreate?: UserCreateOrConnectWithoutManagedInput
    upsert?: UserUpsertWithoutManagedInput
    disconnect?: UserWhereInput | boolean
    delete?: UserWhereInput | boolean
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutManagedInput, UserUpdateWithoutManagedInput>, UserUncheckedUpdateWithoutManagedInput>
  }

  export type CycleUpdateManyWithoutClientNestedInput = {
    create?: XOR<CycleCreateWithoutClientInput, CycleUncheckedCreateWithoutClientInput> | CycleCreateWithoutClientInput[] | CycleUncheckedCreateWithoutClientInput[]
    connectOrCreate?: CycleCreateOrConnectWithoutClientInput | CycleCreateOrConnectWithoutClientInput[]
    upsert?: CycleUpsertWithWhereUniqueWithoutClientInput | CycleUpsertWithWhereUniqueWithoutClientInput[]
    createMany?: CycleCreateManyClientInputEnvelope
    set?: CycleWhereUniqueInput | CycleWhereUniqueInput[]
    disconnect?: CycleWhereUniqueInput | CycleWhereUniqueInput[]
    delete?: CycleWhereUniqueInput | CycleWhereUniqueInput[]
    connect?: CycleWhereUniqueInput | CycleWhereUniqueInput[]
    update?: CycleUpdateWithWhereUniqueWithoutClientInput | CycleUpdateWithWhereUniqueWithoutClientInput[]
    updateMany?: CycleUpdateManyWithWhereWithoutClientInput | CycleUpdateManyWithWhereWithoutClientInput[]
    deleteMany?: CycleScalarWhereInput | CycleScalarWhereInput[]
  }

  export type TransactionUpdateManyWithoutClientNestedInput = {
    create?: XOR<TransactionCreateWithoutClientInput, TransactionUncheckedCreateWithoutClientInput> | TransactionCreateWithoutClientInput[] | TransactionUncheckedCreateWithoutClientInput[]
    connectOrCreate?: TransactionCreateOrConnectWithoutClientInput | TransactionCreateOrConnectWithoutClientInput[]
    upsert?: TransactionUpsertWithWhereUniqueWithoutClientInput | TransactionUpsertWithWhereUniqueWithoutClientInput[]
    createMany?: TransactionCreateManyClientInputEnvelope
    set?: TransactionWhereUniqueInput | TransactionWhereUniqueInput[]
    disconnect?: TransactionWhereUniqueInput | TransactionWhereUniqueInput[]
    delete?: TransactionWhereUniqueInput | TransactionWhereUniqueInput[]
    connect?: TransactionWhereUniqueInput | TransactionWhereUniqueInput[]
    update?: TransactionUpdateWithWhereUniqueWithoutClientInput | TransactionUpdateWithWhereUniqueWithoutClientInput[]
    updateMany?: TransactionUpdateManyWithWhereWithoutClientInput | TransactionUpdateManyWithWhereWithoutClientInput[]
    deleteMany?: TransactionScalarWhereInput | TransactionScalarWhereInput[]
  }

  export type CycleUncheckedUpdateManyWithoutClientNestedInput = {
    create?: XOR<CycleCreateWithoutClientInput, CycleUncheckedCreateWithoutClientInput> | CycleCreateWithoutClientInput[] | CycleUncheckedCreateWithoutClientInput[]
    connectOrCreate?: CycleCreateOrConnectWithoutClientInput | CycleCreateOrConnectWithoutClientInput[]
    upsert?: CycleUpsertWithWhereUniqueWithoutClientInput | CycleUpsertWithWhereUniqueWithoutClientInput[]
    createMany?: CycleCreateManyClientInputEnvelope
    set?: CycleWhereUniqueInput | CycleWhereUniqueInput[]
    disconnect?: CycleWhereUniqueInput | CycleWhereUniqueInput[]
    delete?: CycleWhereUniqueInput | CycleWhereUniqueInput[]
    connect?: CycleWhereUniqueInput | CycleWhereUniqueInput[]
    update?: CycleUpdateWithWhereUniqueWithoutClientInput | CycleUpdateWithWhereUniqueWithoutClientInput[]
    updateMany?: CycleUpdateManyWithWhereWithoutClientInput | CycleUpdateManyWithWhereWithoutClientInput[]
    deleteMany?: CycleScalarWhereInput | CycleScalarWhereInput[]
  }

  export type TransactionUncheckedUpdateManyWithoutClientNestedInput = {
    create?: XOR<TransactionCreateWithoutClientInput, TransactionUncheckedCreateWithoutClientInput> | TransactionCreateWithoutClientInput[] | TransactionUncheckedCreateWithoutClientInput[]
    connectOrCreate?: TransactionCreateOrConnectWithoutClientInput | TransactionCreateOrConnectWithoutClientInput[]
    upsert?: TransactionUpsertWithWhereUniqueWithoutClientInput | TransactionUpsertWithWhereUniqueWithoutClientInput[]
    createMany?: TransactionCreateManyClientInputEnvelope
    set?: TransactionWhereUniqueInput | TransactionWhereUniqueInput[]
    disconnect?: TransactionWhereUniqueInput | TransactionWhereUniqueInput[]
    delete?: TransactionWhereUniqueInput | TransactionWhereUniqueInput[]
    connect?: TransactionWhereUniqueInput | TransactionWhereUniqueInput[]
    update?: TransactionUpdateWithWhereUniqueWithoutClientInput | TransactionUpdateWithWhereUniqueWithoutClientInput[]
    updateMany?: TransactionUpdateManyWithWhereWithoutClientInput | TransactionUpdateManyWithWhereWithoutClientInput[]
    deleteMany?: TransactionScalarWhereInput | TransactionScalarWhereInput[]
  }

  export type ClientCreateNestedOneWithoutCyclesInput = {
    create?: XOR<ClientCreateWithoutCyclesInput, ClientUncheckedCreateWithoutCyclesInput>
    connectOrCreate?: ClientCreateOrConnectWithoutCyclesInput
    connect?: ClientWhereUniqueInput
  }

  export type WeekCreateNestedManyWithoutCycleInput = {
    create?: XOR<WeekCreateWithoutCycleInput, WeekUncheckedCreateWithoutCycleInput> | WeekCreateWithoutCycleInput[] | WeekUncheckedCreateWithoutCycleInput[]
    connectOrCreate?: WeekCreateOrConnectWithoutCycleInput | WeekCreateOrConnectWithoutCycleInput[]
    createMany?: WeekCreateManyCycleInputEnvelope
    connect?: WeekWhereUniqueInput | WeekWhereUniqueInput[]
  }

  export type ObjectiveCreateNestedManyWithoutCycleInput = {
    create?: XOR<ObjectiveCreateWithoutCycleInput, ObjectiveUncheckedCreateWithoutCycleInput> | ObjectiveCreateWithoutCycleInput[] | ObjectiveUncheckedCreateWithoutCycleInput[]
    connectOrCreate?: ObjectiveCreateOrConnectWithoutCycleInput | ObjectiveCreateOrConnectWithoutCycleInput[]
    createMany?: ObjectiveCreateManyCycleInputEnvelope
    connect?: ObjectiveWhereUniqueInput | ObjectiveWhereUniqueInput[]
  }

  export type WeekUncheckedCreateNestedManyWithoutCycleInput = {
    create?: XOR<WeekCreateWithoutCycleInput, WeekUncheckedCreateWithoutCycleInput> | WeekCreateWithoutCycleInput[] | WeekUncheckedCreateWithoutCycleInput[]
    connectOrCreate?: WeekCreateOrConnectWithoutCycleInput | WeekCreateOrConnectWithoutCycleInput[]
    createMany?: WeekCreateManyCycleInputEnvelope
    connect?: WeekWhereUniqueInput | WeekWhereUniqueInput[]
  }

  export type ObjectiveUncheckedCreateNestedManyWithoutCycleInput = {
    create?: XOR<ObjectiveCreateWithoutCycleInput, ObjectiveUncheckedCreateWithoutCycleInput> | ObjectiveCreateWithoutCycleInput[] | ObjectiveUncheckedCreateWithoutCycleInput[]
    connectOrCreate?: ObjectiveCreateOrConnectWithoutCycleInput | ObjectiveCreateOrConnectWithoutCycleInput[]
    createMany?: ObjectiveCreateManyCycleInputEnvelope
    connect?: ObjectiveWhereUniqueInput | ObjectiveWhereUniqueInput[]
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type FloatFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type EnumCycleStatusFieldUpdateOperationsInput = {
    set?: $Enums.CycleStatus
  }

  export type ClientUpdateOneRequiredWithoutCyclesNestedInput = {
    create?: XOR<ClientCreateWithoutCyclesInput, ClientUncheckedCreateWithoutCyclesInput>
    connectOrCreate?: ClientCreateOrConnectWithoutCyclesInput
    upsert?: ClientUpsertWithoutCyclesInput
    connect?: ClientWhereUniqueInput
    update?: XOR<XOR<ClientUpdateToOneWithWhereWithoutCyclesInput, ClientUpdateWithoutCyclesInput>, ClientUncheckedUpdateWithoutCyclesInput>
  }

  export type WeekUpdateManyWithoutCycleNestedInput = {
    create?: XOR<WeekCreateWithoutCycleInput, WeekUncheckedCreateWithoutCycleInput> | WeekCreateWithoutCycleInput[] | WeekUncheckedCreateWithoutCycleInput[]
    connectOrCreate?: WeekCreateOrConnectWithoutCycleInput | WeekCreateOrConnectWithoutCycleInput[]
    upsert?: WeekUpsertWithWhereUniqueWithoutCycleInput | WeekUpsertWithWhereUniqueWithoutCycleInput[]
    createMany?: WeekCreateManyCycleInputEnvelope
    set?: WeekWhereUniqueInput | WeekWhereUniqueInput[]
    disconnect?: WeekWhereUniqueInput | WeekWhereUniqueInput[]
    delete?: WeekWhereUniqueInput | WeekWhereUniqueInput[]
    connect?: WeekWhereUniqueInput | WeekWhereUniqueInput[]
    update?: WeekUpdateWithWhereUniqueWithoutCycleInput | WeekUpdateWithWhereUniqueWithoutCycleInput[]
    updateMany?: WeekUpdateManyWithWhereWithoutCycleInput | WeekUpdateManyWithWhereWithoutCycleInput[]
    deleteMany?: WeekScalarWhereInput | WeekScalarWhereInput[]
  }

  export type ObjectiveUpdateManyWithoutCycleNestedInput = {
    create?: XOR<ObjectiveCreateWithoutCycleInput, ObjectiveUncheckedCreateWithoutCycleInput> | ObjectiveCreateWithoutCycleInput[] | ObjectiveUncheckedCreateWithoutCycleInput[]
    connectOrCreate?: ObjectiveCreateOrConnectWithoutCycleInput | ObjectiveCreateOrConnectWithoutCycleInput[]
    upsert?: ObjectiveUpsertWithWhereUniqueWithoutCycleInput | ObjectiveUpsertWithWhereUniqueWithoutCycleInput[]
    createMany?: ObjectiveCreateManyCycleInputEnvelope
    set?: ObjectiveWhereUniqueInput | ObjectiveWhereUniqueInput[]
    disconnect?: ObjectiveWhereUniqueInput | ObjectiveWhereUniqueInput[]
    delete?: ObjectiveWhereUniqueInput | ObjectiveWhereUniqueInput[]
    connect?: ObjectiveWhereUniqueInput | ObjectiveWhereUniqueInput[]
    update?: ObjectiveUpdateWithWhereUniqueWithoutCycleInput | ObjectiveUpdateWithWhereUniqueWithoutCycleInput[]
    updateMany?: ObjectiveUpdateManyWithWhereWithoutCycleInput | ObjectiveUpdateManyWithWhereWithoutCycleInput[]
    deleteMany?: ObjectiveScalarWhereInput | ObjectiveScalarWhereInput[]
  }

  export type WeekUncheckedUpdateManyWithoutCycleNestedInput = {
    create?: XOR<WeekCreateWithoutCycleInput, WeekUncheckedCreateWithoutCycleInput> | WeekCreateWithoutCycleInput[] | WeekUncheckedCreateWithoutCycleInput[]
    connectOrCreate?: WeekCreateOrConnectWithoutCycleInput | WeekCreateOrConnectWithoutCycleInput[]
    upsert?: WeekUpsertWithWhereUniqueWithoutCycleInput | WeekUpsertWithWhereUniqueWithoutCycleInput[]
    createMany?: WeekCreateManyCycleInputEnvelope
    set?: WeekWhereUniqueInput | WeekWhereUniqueInput[]
    disconnect?: WeekWhereUniqueInput | WeekWhereUniqueInput[]
    delete?: WeekWhereUniqueInput | WeekWhereUniqueInput[]
    connect?: WeekWhereUniqueInput | WeekWhereUniqueInput[]
    update?: WeekUpdateWithWhereUniqueWithoutCycleInput | WeekUpdateWithWhereUniqueWithoutCycleInput[]
    updateMany?: WeekUpdateManyWithWhereWithoutCycleInput | WeekUpdateManyWithWhereWithoutCycleInput[]
    deleteMany?: WeekScalarWhereInput | WeekScalarWhereInput[]
  }

  export type ObjectiveUncheckedUpdateManyWithoutCycleNestedInput = {
    create?: XOR<ObjectiveCreateWithoutCycleInput, ObjectiveUncheckedCreateWithoutCycleInput> | ObjectiveCreateWithoutCycleInput[] | ObjectiveUncheckedCreateWithoutCycleInput[]
    connectOrCreate?: ObjectiveCreateOrConnectWithoutCycleInput | ObjectiveCreateOrConnectWithoutCycleInput[]
    upsert?: ObjectiveUpsertWithWhereUniqueWithoutCycleInput | ObjectiveUpsertWithWhereUniqueWithoutCycleInput[]
    createMany?: ObjectiveCreateManyCycleInputEnvelope
    set?: ObjectiveWhereUniqueInput | ObjectiveWhereUniqueInput[]
    disconnect?: ObjectiveWhereUniqueInput | ObjectiveWhereUniqueInput[]
    delete?: ObjectiveWhereUniqueInput | ObjectiveWhereUniqueInput[]
    connect?: ObjectiveWhereUniqueInput | ObjectiveWhereUniqueInput[]
    update?: ObjectiveUpdateWithWhereUniqueWithoutCycleInput | ObjectiveUpdateWithWhereUniqueWithoutCycleInput[]
    updateMany?: ObjectiveUpdateManyWithWhereWithoutCycleInput | ObjectiveUpdateManyWithWhereWithoutCycleInput[]
    deleteMany?: ObjectiveScalarWhereInput | ObjectiveScalarWhereInput[]
  }

  export type WeekCreateactionsInput = {
    set: string[]
  }

  export type CycleCreateNestedOneWithoutWeeksInput = {
    create?: XOR<CycleCreateWithoutWeeksInput, CycleUncheckedCreateWithoutWeeksInput>
    connectOrCreate?: CycleCreateOrConnectWithoutWeeksInput
    connect?: CycleWhereUniqueInput
  }

  export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null
  }

  export type WeekUpdateactionsInput = {
    set?: string[]
    push?: string | string[]
  }

  export type CycleUpdateOneRequiredWithoutWeeksNestedInput = {
    create?: XOR<CycleCreateWithoutWeeksInput, CycleUncheckedCreateWithoutWeeksInput>
    connectOrCreate?: CycleCreateOrConnectWithoutWeeksInput
    upsert?: CycleUpsertWithoutWeeksInput
    connect?: CycleWhereUniqueInput
    update?: XOR<XOR<CycleUpdateToOneWithWhereWithoutWeeksInput, CycleUpdateWithoutWeeksInput>, CycleUncheckedUpdateWithoutWeeksInput>
  }

  export type CycleCreateNestedOneWithoutObjectivesInput = {
    create?: XOR<CycleCreateWithoutObjectivesInput, CycleUncheckedCreateWithoutObjectivesInput>
    connectOrCreate?: CycleCreateOrConnectWithoutObjectivesInput
    connect?: CycleWhereUniqueInput
  }

  export type EnumObjectiveStatusFieldUpdateOperationsInput = {
    set?: $Enums.ObjectiveStatus
  }

  export type CycleUpdateOneRequiredWithoutObjectivesNestedInput = {
    create?: XOR<CycleCreateWithoutObjectivesInput, CycleUncheckedCreateWithoutObjectivesInput>
    connectOrCreate?: CycleCreateOrConnectWithoutObjectivesInput
    upsert?: CycleUpsertWithoutObjectivesInput
    connect?: CycleWhereUniqueInput
    update?: XOR<XOR<CycleUpdateToOneWithWhereWithoutObjectivesInput, CycleUpdateWithoutObjectivesInput>, CycleUncheckedUpdateWithoutObjectivesInput>
  }

  export type ClientCreateNestedOneWithoutTransactionsInput = {
    create?: XOR<ClientCreateWithoutTransactionsInput, ClientUncheckedCreateWithoutTransactionsInput>
    connectOrCreate?: ClientCreateOrConnectWithoutTransactionsInput
    connect?: ClientWhereUniqueInput
  }

  export type EnumTransactionTypeFieldUpdateOperationsInput = {
    set?: $Enums.TransactionType
  }

  export type ClientUpdateOneRequiredWithoutTransactionsNestedInput = {
    create?: XOR<ClientCreateWithoutTransactionsInput, ClientUncheckedCreateWithoutTransactionsInput>
    connectOrCreate?: ClientCreateOrConnectWithoutTransactionsInput
    upsert?: ClientUpsertWithoutTransactionsInput
    connect?: ClientWhereUniqueInput
    update?: XOR<XOR<ClientUpdateToOneWithWhereWithoutTransactionsInput, ClientUpdateWithoutTransactionsInput>, ClientUncheckedUpdateWithoutTransactionsInput>
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type NestedEnumRoleFilter<$PrismaModel = never> = {
    equals?: $Enums.Role | EnumRoleFieldRefInput<$PrismaModel>
    in?: $Enums.Role[] | ListEnumRoleFieldRefInput<$PrismaModel>
    notIn?: $Enums.Role[] | ListEnumRoleFieldRefInput<$PrismaModel>
    not?: NestedEnumRoleFilter<$PrismaModel> | $Enums.Role
  }

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type NestedEnumRoleWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.Role | EnumRoleFieldRefInput<$PrismaModel>
    in?: $Enums.Role[] | ListEnumRoleFieldRefInput<$PrismaModel>
    notIn?: $Enums.Role[] | ListEnumRoleFieldRefInput<$PrismaModel>
    not?: NestedEnumRoleWithAggregatesFilter<$PrismaModel> | $Enums.Role
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumRoleFilter<$PrismaModel>
    _max?: NestedEnumRoleFilter<$PrismaModel>
  }

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type NestedFloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type NestedEnumCycleStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.CycleStatus | EnumCycleStatusFieldRefInput<$PrismaModel>
    in?: $Enums.CycleStatus[] | ListEnumCycleStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.CycleStatus[] | ListEnumCycleStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumCycleStatusFilter<$PrismaModel> | $Enums.CycleStatus
  }

  export type NestedIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type NestedFloatWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedFloatFilter<$PrismaModel>
    _min?: NestedFloatFilter<$PrismaModel>
    _max?: NestedFloatFilter<$PrismaModel>
  }

  export type NestedEnumCycleStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.CycleStatus | EnumCycleStatusFieldRefInput<$PrismaModel>
    in?: $Enums.CycleStatus[] | ListEnumCycleStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.CycleStatus[] | ListEnumCycleStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumCycleStatusWithAggregatesFilter<$PrismaModel> | $Enums.CycleStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumCycleStatusFilter<$PrismaModel>
    _max?: NestedEnumCycleStatusFilter<$PrismaModel>
  }

  export type NestedDateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type NestedDateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type NestedEnumObjectiveStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.ObjectiveStatus | EnumObjectiveStatusFieldRefInput<$PrismaModel>
    in?: $Enums.ObjectiveStatus[] | ListEnumObjectiveStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.ObjectiveStatus[] | ListEnumObjectiveStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumObjectiveStatusFilter<$PrismaModel> | $Enums.ObjectiveStatus
  }

  export type NestedEnumObjectiveStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.ObjectiveStatus | EnumObjectiveStatusFieldRefInput<$PrismaModel>
    in?: $Enums.ObjectiveStatus[] | ListEnumObjectiveStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.ObjectiveStatus[] | ListEnumObjectiveStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumObjectiveStatusWithAggregatesFilter<$PrismaModel> | $Enums.ObjectiveStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumObjectiveStatusFilter<$PrismaModel>
    _max?: NestedEnumObjectiveStatusFilter<$PrismaModel>
  }

  export type NestedEnumTransactionTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.TransactionType | EnumTransactionTypeFieldRefInput<$PrismaModel>
    in?: $Enums.TransactionType[] | ListEnumTransactionTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.TransactionType[] | ListEnumTransactionTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumTransactionTypeFilter<$PrismaModel> | $Enums.TransactionType
  }

  export type NestedEnumTransactionTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.TransactionType | EnumTransactionTypeFieldRefInput<$PrismaModel>
    in?: $Enums.TransactionType[] | ListEnumTransactionTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.TransactionType[] | ListEnumTransactionTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumTransactionTypeWithAggregatesFilter<$PrismaModel> | $Enums.TransactionType
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumTransactionTypeFilter<$PrismaModel>
    _max?: NestedEnumTransactionTypeFilter<$PrismaModel>
  }

  export type ClientCreateWithoutUserInput = {
    id?: string
    companyName: string
    sector?: string | null
    status?: string | null
    admin?: UserCreateNestedOneWithoutManagedInput
    cycles?: CycleCreateNestedManyWithoutClientInput
    transactions?: TransactionCreateNestedManyWithoutClientInput
  }

  export type ClientUncheckedCreateWithoutUserInput = {
    id?: string
    adminId?: string | null
    companyName: string
    sector?: string | null
    status?: string | null
    cycles?: CycleUncheckedCreateNestedManyWithoutClientInput
    transactions?: TransactionUncheckedCreateNestedManyWithoutClientInput
  }

  export type ClientCreateOrConnectWithoutUserInput = {
    where: ClientWhereUniqueInput
    create: XOR<ClientCreateWithoutUserInput, ClientUncheckedCreateWithoutUserInput>
  }

  export type ClientCreateWithoutAdminInput = {
    id?: string
    companyName: string
    sector?: string | null
    status?: string | null
    user: UserCreateNestedOneWithoutClientInput
    cycles?: CycleCreateNestedManyWithoutClientInput
    transactions?: TransactionCreateNestedManyWithoutClientInput
  }

  export type ClientUncheckedCreateWithoutAdminInput = {
    id?: string
    userId: string
    companyName: string
    sector?: string | null
    status?: string | null
    cycles?: CycleUncheckedCreateNestedManyWithoutClientInput
    transactions?: TransactionUncheckedCreateNestedManyWithoutClientInput
  }

  export type ClientCreateOrConnectWithoutAdminInput = {
    where: ClientWhereUniqueInput
    create: XOR<ClientCreateWithoutAdminInput, ClientUncheckedCreateWithoutAdminInput>
  }

  export type ClientCreateManyAdminInputEnvelope = {
    data: ClientCreateManyAdminInput | ClientCreateManyAdminInput[]
    skipDuplicates?: boolean
  }

  export type ClientUpsertWithoutUserInput = {
    update: XOR<ClientUpdateWithoutUserInput, ClientUncheckedUpdateWithoutUserInput>
    create: XOR<ClientCreateWithoutUserInput, ClientUncheckedCreateWithoutUserInput>
    where?: ClientWhereInput
  }

  export type ClientUpdateToOneWithWhereWithoutUserInput = {
    where?: ClientWhereInput
    data: XOR<ClientUpdateWithoutUserInput, ClientUncheckedUpdateWithoutUserInput>
  }

  export type ClientUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    companyName?: StringFieldUpdateOperationsInput | string
    sector?: NullableStringFieldUpdateOperationsInput | string | null
    status?: NullableStringFieldUpdateOperationsInput | string | null
    admin?: UserUpdateOneWithoutManagedNestedInput
    cycles?: CycleUpdateManyWithoutClientNestedInput
    transactions?: TransactionUpdateManyWithoutClientNestedInput
  }

  export type ClientUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    adminId?: NullableStringFieldUpdateOperationsInput | string | null
    companyName?: StringFieldUpdateOperationsInput | string
    sector?: NullableStringFieldUpdateOperationsInput | string | null
    status?: NullableStringFieldUpdateOperationsInput | string | null
    cycles?: CycleUncheckedUpdateManyWithoutClientNestedInput
    transactions?: TransactionUncheckedUpdateManyWithoutClientNestedInput
  }

  export type ClientUpsertWithWhereUniqueWithoutAdminInput = {
    where: ClientWhereUniqueInput
    update: XOR<ClientUpdateWithoutAdminInput, ClientUncheckedUpdateWithoutAdminInput>
    create: XOR<ClientCreateWithoutAdminInput, ClientUncheckedCreateWithoutAdminInput>
  }

  export type ClientUpdateWithWhereUniqueWithoutAdminInput = {
    where: ClientWhereUniqueInput
    data: XOR<ClientUpdateWithoutAdminInput, ClientUncheckedUpdateWithoutAdminInput>
  }

  export type ClientUpdateManyWithWhereWithoutAdminInput = {
    where: ClientScalarWhereInput
    data: XOR<ClientUpdateManyMutationInput, ClientUncheckedUpdateManyWithoutAdminInput>
  }

  export type ClientScalarWhereInput = {
    AND?: ClientScalarWhereInput | ClientScalarWhereInput[]
    OR?: ClientScalarWhereInput[]
    NOT?: ClientScalarWhereInput | ClientScalarWhereInput[]
    id?: StringFilter<"Client"> | string
    userId?: StringFilter<"Client"> | string
    adminId?: StringNullableFilter<"Client"> | string | null
    companyName?: StringFilter<"Client"> | string
    sector?: StringNullableFilter<"Client"> | string | null
    status?: StringNullableFilter<"Client"> | string | null
  }

  export type UserCreateWithoutClientInput = {
    id?: string
    email: string
    password: string
    name?: string | null
    role?: $Enums.Role
    createdAt?: Date | string
    managed?: ClientCreateNestedManyWithoutAdminInput
  }

  export type UserUncheckedCreateWithoutClientInput = {
    id?: string
    email: string
    password: string
    name?: string | null
    role?: $Enums.Role
    createdAt?: Date | string
    managed?: ClientUncheckedCreateNestedManyWithoutAdminInput
  }

  export type UserCreateOrConnectWithoutClientInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutClientInput, UserUncheckedCreateWithoutClientInput>
  }

  export type UserCreateWithoutManagedInput = {
    id?: string
    email: string
    password: string
    name?: string | null
    role?: $Enums.Role
    createdAt?: Date | string
    client?: ClientCreateNestedOneWithoutUserInput
  }

  export type UserUncheckedCreateWithoutManagedInput = {
    id?: string
    email: string
    password: string
    name?: string | null
    role?: $Enums.Role
    createdAt?: Date | string
    client?: ClientUncheckedCreateNestedOneWithoutUserInput
  }

  export type UserCreateOrConnectWithoutManagedInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutManagedInput, UserUncheckedCreateWithoutManagedInput>
  }

  export type CycleCreateWithoutClientInput = {
    id?: string
    cycleNumber: number
    mainObjective: string
    caTargetMonthly?: number
    startDate: Date | string
    endDate: Date | string
    status?: $Enums.CycleStatus
    createdAt?: Date | string
    weeks?: WeekCreateNestedManyWithoutCycleInput
    objectives?: ObjectiveCreateNestedManyWithoutCycleInput
  }

  export type CycleUncheckedCreateWithoutClientInput = {
    id?: string
    cycleNumber: number
    mainObjective: string
    caTargetMonthly?: number
    startDate: Date | string
    endDate: Date | string
    status?: $Enums.CycleStatus
    createdAt?: Date | string
    weeks?: WeekUncheckedCreateNestedManyWithoutCycleInput
    objectives?: ObjectiveUncheckedCreateNestedManyWithoutCycleInput
  }

  export type CycleCreateOrConnectWithoutClientInput = {
    where: CycleWhereUniqueInput
    create: XOR<CycleCreateWithoutClientInput, CycleUncheckedCreateWithoutClientInput>
  }

  export type CycleCreateManyClientInputEnvelope = {
    data: CycleCreateManyClientInput | CycleCreateManyClientInput[]
    skipDuplicates?: boolean
  }

  export type TransactionCreateWithoutClientInput = {
    id?: string
    type: $Enums.TransactionType
    amountHt: number
    transactionDate: Date | string
    label?: string | null
    category?: string | null
    recurrence?: string | null
    createdAt?: Date | string
  }

  export type TransactionUncheckedCreateWithoutClientInput = {
    id?: string
    type: $Enums.TransactionType
    amountHt: number
    transactionDate: Date | string
    label?: string | null
    category?: string | null
    recurrence?: string | null
    createdAt?: Date | string
  }

  export type TransactionCreateOrConnectWithoutClientInput = {
    where: TransactionWhereUniqueInput
    create: XOR<TransactionCreateWithoutClientInput, TransactionUncheckedCreateWithoutClientInput>
  }

  export type TransactionCreateManyClientInputEnvelope = {
    data: TransactionCreateManyClientInput | TransactionCreateManyClientInput[]
    skipDuplicates?: boolean
  }

  export type UserUpsertWithoutClientInput = {
    update: XOR<UserUpdateWithoutClientInput, UserUncheckedUpdateWithoutClientInput>
    create: XOR<UserCreateWithoutClientInput, UserUncheckedCreateWithoutClientInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutClientInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutClientInput, UserUncheckedUpdateWithoutClientInput>
  }

  export type UserUpdateWithoutClientInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    managed?: ClientUpdateManyWithoutAdminNestedInput
  }

  export type UserUncheckedUpdateWithoutClientInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    managed?: ClientUncheckedUpdateManyWithoutAdminNestedInput
  }

  export type UserUpsertWithoutManagedInput = {
    update: XOR<UserUpdateWithoutManagedInput, UserUncheckedUpdateWithoutManagedInput>
    create: XOR<UserCreateWithoutManagedInput, UserUncheckedCreateWithoutManagedInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutManagedInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutManagedInput, UserUncheckedUpdateWithoutManagedInput>
  }

  export type UserUpdateWithoutManagedInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    client?: ClientUpdateOneWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutManagedInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    client?: ClientUncheckedUpdateOneWithoutUserNestedInput
  }

  export type CycleUpsertWithWhereUniqueWithoutClientInput = {
    where: CycleWhereUniqueInput
    update: XOR<CycleUpdateWithoutClientInput, CycleUncheckedUpdateWithoutClientInput>
    create: XOR<CycleCreateWithoutClientInput, CycleUncheckedCreateWithoutClientInput>
  }

  export type CycleUpdateWithWhereUniqueWithoutClientInput = {
    where: CycleWhereUniqueInput
    data: XOR<CycleUpdateWithoutClientInput, CycleUncheckedUpdateWithoutClientInput>
  }

  export type CycleUpdateManyWithWhereWithoutClientInput = {
    where: CycleScalarWhereInput
    data: XOR<CycleUpdateManyMutationInput, CycleUncheckedUpdateManyWithoutClientInput>
  }

  export type CycleScalarWhereInput = {
    AND?: CycleScalarWhereInput | CycleScalarWhereInput[]
    OR?: CycleScalarWhereInput[]
    NOT?: CycleScalarWhereInput | CycleScalarWhereInput[]
    id?: StringFilter<"Cycle"> | string
    clientId?: StringFilter<"Cycle"> | string
    cycleNumber?: IntFilter<"Cycle"> | number
    mainObjective?: StringFilter<"Cycle"> | string
    caTargetMonthly?: FloatFilter<"Cycle"> | number
    startDate?: DateTimeFilter<"Cycle"> | Date | string
    endDate?: DateTimeFilter<"Cycle"> | Date | string
    status?: EnumCycleStatusFilter<"Cycle"> | $Enums.CycleStatus
    createdAt?: DateTimeFilter<"Cycle"> | Date | string
  }

  export type TransactionUpsertWithWhereUniqueWithoutClientInput = {
    where: TransactionWhereUniqueInput
    update: XOR<TransactionUpdateWithoutClientInput, TransactionUncheckedUpdateWithoutClientInput>
    create: XOR<TransactionCreateWithoutClientInput, TransactionUncheckedCreateWithoutClientInput>
  }

  export type TransactionUpdateWithWhereUniqueWithoutClientInput = {
    where: TransactionWhereUniqueInput
    data: XOR<TransactionUpdateWithoutClientInput, TransactionUncheckedUpdateWithoutClientInput>
  }

  export type TransactionUpdateManyWithWhereWithoutClientInput = {
    where: TransactionScalarWhereInput
    data: XOR<TransactionUpdateManyMutationInput, TransactionUncheckedUpdateManyWithoutClientInput>
  }

  export type TransactionScalarWhereInput = {
    AND?: TransactionScalarWhereInput | TransactionScalarWhereInput[]
    OR?: TransactionScalarWhereInput[]
    NOT?: TransactionScalarWhereInput | TransactionScalarWhereInput[]
    id?: StringFilter<"Transaction"> | string
    clientId?: StringFilter<"Transaction"> | string
    type?: EnumTransactionTypeFilter<"Transaction"> | $Enums.TransactionType
    amountHt?: FloatFilter<"Transaction"> | number
    transactionDate?: DateTimeFilter<"Transaction"> | Date | string
    label?: StringNullableFilter<"Transaction"> | string | null
    category?: StringNullableFilter<"Transaction"> | string | null
    recurrence?: StringNullableFilter<"Transaction"> | string | null
    createdAt?: DateTimeFilter<"Transaction"> | Date | string
  }

  export type ClientCreateWithoutCyclesInput = {
    id?: string
    companyName: string
    sector?: string | null
    status?: string | null
    user: UserCreateNestedOneWithoutClientInput
    admin?: UserCreateNestedOneWithoutManagedInput
    transactions?: TransactionCreateNestedManyWithoutClientInput
  }

  export type ClientUncheckedCreateWithoutCyclesInput = {
    id?: string
    userId: string
    adminId?: string | null
    companyName: string
    sector?: string | null
    status?: string | null
    transactions?: TransactionUncheckedCreateNestedManyWithoutClientInput
  }

  export type ClientCreateOrConnectWithoutCyclesInput = {
    where: ClientWhereUniqueInput
    create: XOR<ClientCreateWithoutCyclesInput, ClientUncheckedCreateWithoutCyclesInput>
  }

  export type WeekCreateWithoutCycleInput = {
    id?: string
    weekNumber: number
    startDate?: Date | string | null
    focusTitle?: string | null
    actions?: WeekCreateactionsInput | string[]
    createdAt?: Date | string
  }

  export type WeekUncheckedCreateWithoutCycleInput = {
    id?: string
    weekNumber: number
    startDate?: Date | string | null
    focusTitle?: string | null
    actions?: WeekCreateactionsInput | string[]
    createdAt?: Date | string
  }

  export type WeekCreateOrConnectWithoutCycleInput = {
    where: WeekWhereUniqueInput
    create: XOR<WeekCreateWithoutCycleInput, WeekUncheckedCreateWithoutCycleInput>
  }

  export type WeekCreateManyCycleInputEnvelope = {
    data: WeekCreateManyCycleInput | WeekCreateManyCycleInput[]
    skipDuplicates?: boolean
  }

  export type ObjectiveCreateWithoutCycleInput = {
    id?: string
    title: string
    description?: string | null
    progressPct?: number
    status?: $Enums.ObjectiveStatus
    createdAt?: Date | string
  }

  export type ObjectiveUncheckedCreateWithoutCycleInput = {
    id?: string
    title: string
    description?: string | null
    progressPct?: number
    status?: $Enums.ObjectiveStatus
    createdAt?: Date | string
  }

  export type ObjectiveCreateOrConnectWithoutCycleInput = {
    where: ObjectiveWhereUniqueInput
    create: XOR<ObjectiveCreateWithoutCycleInput, ObjectiveUncheckedCreateWithoutCycleInput>
  }

  export type ObjectiveCreateManyCycleInputEnvelope = {
    data: ObjectiveCreateManyCycleInput | ObjectiveCreateManyCycleInput[]
    skipDuplicates?: boolean
  }

  export type ClientUpsertWithoutCyclesInput = {
    update: XOR<ClientUpdateWithoutCyclesInput, ClientUncheckedUpdateWithoutCyclesInput>
    create: XOR<ClientCreateWithoutCyclesInput, ClientUncheckedCreateWithoutCyclesInput>
    where?: ClientWhereInput
  }

  export type ClientUpdateToOneWithWhereWithoutCyclesInput = {
    where?: ClientWhereInput
    data: XOR<ClientUpdateWithoutCyclesInput, ClientUncheckedUpdateWithoutCyclesInput>
  }

  export type ClientUpdateWithoutCyclesInput = {
    id?: StringFieldUpdateOperationsInput | string
    companyName?: StringFieldUpdateOperationsInput | string
    sector?: NullableStringFieldUpdateOperationsInput | string | null
    status?: NullableStringFieldUpdateOperationsInput | string | null
    user?: UserUpdateOneRequiredWithoutClientNestedInput
    admin?: UserUpdateOneWithoutManagedNestedInput
    transactions?: TransactionUpdateManyWithoutClientNestedInput
  }

  export type ClientUncheckedUpdateWithoutCyclesInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    adminId?: NullableStringFieldUpdateOperationsInput | string | null
    companyName?: StringFieldUpdateOperationsInput | string
    sector?: NullableStringFieldUpdateOperationsInput | string | null
    status?: NullableStringFieldUpdateOperationsInput | string | null
    transactions?: TransactionUncheckedUpdateManyWithoutClientNestedInput
  }

  export type WeekUpsertWithWhereUniqueWithoutCycleInput = {
    where: WeekWhereUniqueInput
    update: XOR<WeekUpdateWithoutCycleInput, WeekUncheckedUpdateWithoutCycleInput>
    create: XOR<WeekCreateWithoutCycleInput, WeekUncheckedCreateWithoutCycleInput>
  }

  export type WeekUpdateWithWhereUniqueWithoutCycleInput = {
    where: WeekWhereUniqueInput
    data: XOR<WeekUpdateWithoutCycleInput, WeekUncheckedUpdateWithoutCycleInput>
  }

  export type WeekUpdateManyWithWhereWithoutCycleInput = {
    where: WeekScalarWhereInput
    data: XOR<WeekUpdateManyMutationInput, WeekUncheckedUpdateManyWithoutCycleInput>
  }

  export type WeekScalarWhereInput = {
    AND?: WeekScalarWhereInput | WeekScalarWhereInput[]
    OR?: WeekScalarWhereInput[]
    NOT?: WeekScalarWhereInput | WeekScalarWhereInput[]
    id?: StringFilter<"Week"> | string
    cycleId?: StringFilter<"Week"> | string
    weekNumber?: IntFilter<"Week"> | number
    startDate?: DateTimeNullableFilter<"Week"> | Date | string | null
    focusTitle?: StringNullableFilter<"Week"> | string | null
    actions?: StringNullableListFilter<"Week">
    createdAt?: DateTimeFilter<"Week"> | Date | string
  }

  export type ObjectiveUpsertWithWhereUniqueWithoutCycleInput = {
    where: ObjectiveWhereUniqueInput
    update: XOR<ObjectiveUpdateWithoutCycleInput, ObjectiveUncheckedUpdateWithoutCycleInput>
    create: XOR<ObjectiveCreateWithoutCycleInput, ObjectiveUncheckedCreateWithoutCycleInput>
  }

  export type ObjectiveUpdateWithWhereUniqueWithoutCycleInput = {
    where: ObjectiveWhereUniqueInput
    data: XOR<ObjectiveUpdateWithoutCycleInput, ObjectiveUncheckedUpdateWithoutCycleInput>
  }

  export type ObjectiveUpdateManyWithWhereWithoutCycleInput = {
    where: ObjectiveScalarWhereInput
    data: XOR<ObjectiveUpdateManyMutationInput, ObjectiveUncheckedUpdateManyWithoutCycleInput>
  }

  export type ObjectiveScalarWhereInput = {
    AND?: ObjectiveScalarWhereInput | ObjectiveScalarWhereInput[]
    OR?: ObjectiveScalarWhereInput[]
    NOT?: ObjectiveScalarWhereInput | ObjectiveScalarWhereInput[]
    id?: StringFilter<"Objective"> | string
    cycleId?: StringFilter<"Objective"> | string
    title?: StringFilter<"Objective"> | string
    description?: StringNullableFilter<"Objective"> | string | null
    progressPct?: IntFilter<"Objective"> | number
    status?: EnumObjectiveStatusFilter<"Objective"> | $Enums.ObjectiveStatus
    createdAt?: DateTimeFilter<"Objective"> | Date | string
  }

  export type CycleCreateWithoutWeeksInput = {
    id?: string
    cycleNumber: number
    mainObjective: string
    caTargetMonthly?: number
    startDate: Date | string
    endDate: Date | string
    status?: $Enums.CycleStatus
    createdAt?: Date | string
    client: ClientCreateNestedOneWithoutCyclesInput
    objectives?: ObjectiveCreateNestedManyWithoutCycleInput
  }

  export type CycleUncheckedCreateWithoutWeeksInput = {
    id?: string
    clientId: string
    cycleNumber: number
    mainObjective: string
    caTargetMonthly?: number
    startDate: Date | string
    endDate: Date | string
    status?: $Enums.CycleStatus
    createdAt?: Date | string
    objectives?: ObjectiveUncheckedCreateNestedManyWithoutCycleInput
  }

  export type CycleCreateOrConnectWithoutWeeksInput = {
    where: CycleWhereUniqueInput
    create: XOR<CycleCreateWithoutWeeksInput, CycleUncheckedCreateWithoutWeeksInput>
  }

  export type CycleUpsertWithoutWeeksInput = {
    update: XOR<CycleUpdateWithoutWeeksInput, CycleUncheckedUpdateWithoutWeeksInput>
    create: XOR<CycleCreateWithoutWeeksInput, CycleUncheckedCreateWithoutWeeksInput>
    where?: CycleWhereInput
  }

  export type CycleUpdateToOneWithWhereWithoutWeeksInput = {
    where?: CycleWhereInput
    data: XOR<CycleUpdateWithoutWeeksInput, CycleUncheckedUpdateWithoutWeeksInput>
  }

  export type CycleUpdateWithoutWeeksInput = {
    id?: StringFieldUpdateOperationsInput | string
    cycleNumber?: IntFieldUpdateOperationsInput | number
    mainObjective?: StringFieldUpdateOperationsInput | string
    caTargetMonthly?: FloatFieldUpdateOperationsInput | number
    startDate?: DateTimeFieldUpdateOperationsInput | Date | string
    endDate?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: EnumCycleStatusFieldUpdateOperationsInput | $Enums.CycleStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    client?: ClientUpdateOneRequiredWithoutCyclesNestedInput
    objectives?: ObjectiveUpdateManyWithoutCycleNestedInput
  }

  export type CycleUncheckedUpdateWithoutWeeksInput = {
    id?: StringFieldUpdateOperationsInput | string
    clientId?: StringFieldUpdateOperationsInput | string
    cycleNumber?: IntFieldUpdateOperationsInput | number
    mainObjective?: StringFieldUpdateOperationsInput | string
    caTargetMonthly?: FloatFieldUpdateOperationsInput | number
    startDate?: DateTimeFieldUpdateOperationsInput | Date | string
    endDate?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: EnumCycleStatusFieldUpdateOperationsInput | $Enums.CycleStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    objectives?: ObjectiveUncheckedUpdateManyWithoutCycleNestedInput
  }

  export type CycleCreateWithoutObjectivesInput = {
    id?: string
    cycleNumber: number
    mainObjective: string
    caTargetMonthly?: number
    startDate: Date | string
    endDate: Date | string
    status?: $Enums.CycleStatus
    createdAt?: Date | string
    client: ClientCreateNestedOneWithoutCyclesInput
    weeks?: WeekCreateNestedManyWithoutCycleInput
  }

  export type CycleUncheckedCreateWithoutObjectivesInput = {
    id?: string
    clientId: string
    cycleNumber: number
    mainObjective: string
    caTargetMonthly?: number
    startDate: Date | string
    endDate: Date | string
    status?: $Enums.CycleStatus
    createdAt?: Date | string
    weeks?: WeekUncheckedCreateNestedManyWithoutCycleInput
  }

  export type CycleCreateOrConnectWithoutObjectivesInput = {
    where: CycleWhereUniqueInput
    create: XOR<CycleCreateWithoutObjectivesInput, CycleUncheckedCreateWithoutObjectivesInput>
  }

  export type CycleUpsertWithoutObjectivesInput = {
    update: XOR<CycleUpdateWithoutObjectivesInput, CycleUncheckedUpdateWithoutObjectivesInput>
    create: XOR<CycleCreateWithoutObjectivesInput, CycleUncheckedCreateWithoutObjectivesInput>
    where?: CycleWhereInput
  }

  export type CycleUpdateToOneWithWhereWithoutObjectivesInput = {
    where?: CycleWhereInput
    data: XOR<CycleUpdateWithoutObjectivesInput, CycleUncheckedUpdateWithoutObjectivesInput>
  }

  export type CycleUpdateWithoutObjectivesInput = {
    id?: StringFieldUpdateOperationsInput | string
    cycleNumber?: IntFieldUpdateOperationsInput | number
    mainObjective?: StringFieldUpdateOperationsInput | string
    caTargetMonthly?: FloatFieldUpdateOperationsInput | number
    startDate?: DateTimeFieldUpdateOperationsInput | Date | string
    endDate?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: EnumCycleStatusFieldUpdateOperationsInput | $Enums.CycleStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    client?: ClientUpdateOneRequiredWithoutCyclesNestedInput
    weeks?: WeekUpdateManyWithoutCycleNestedInput
  }

  export type CycleUncheckedUpdateWithoutObjectivesInput = {
    id?: StringFieldUpdateOperationsInput | string
    clientId?: StringFieldUpdateOperationsInput | string
    cycleNumber?: IntFieldUpdateOperationsInput | number
    mainObjective?: StringFieldUpdateOperationsInput | string
    caTargetMonthly?: FloatFieldUpdateOperationsInput | number
    startDate?: DateTimeFieldUpdateOperationsInput | Date | string
    endDate?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: EnumCycleStatusFieldUpdateOperationsInput | $Enums.CycleStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    weeks?: WeekUncheckedUpdateManyWithoutCycleNestedInput
  }

  export type ClientCreateWithoutTransactionsInput = {
    id?: string
    companyName: string
    sector?: string | null
    status?: string | null
    user: UserCreateNestedOneWithoutClientInput
    admin?: UserCreateNestedOneWithoutManagedInput
    cycles?: CycleCreateNestedManyWithoutClientInput
  }

  export type ClientUncheckedCreateWithoutTransactionsInput = {
    id?: string
    userId: string
    adminId?: string | null
    companyName: string
    sector?: string | null
    status?: string | null
    cycles?: CycleUncheckedCreateNestedManyWithoutClientInput
  }

  export type ClientCreateOrConnectWithoutTransactionsInput = {
    where: ClientWhereUniqueInput
    create: XOR<ClientCreateWithoutTransactionsInput, ClientUncheckedCreateWithoutTransactionsInput>
  }

  export type ClientUpsertWithoutTransactionsInput = {
    update: XOR<ClientUpdateWithoutTransactionsInput, ClientUncheckedUpdateWithoutTransactionsInput>
    create: XOR<ClientCreateWithoutTransactionsInput, ClientUncheckedCreateWithoutTransactionsInput>
    where?: ClientWhereInput
  }

  export type ClientUpdateToOneWithWhereWithoutTransactionsInput = {
    where?: ClientWhereInput
    data: XOR<ClientUpdateWithoutTransactionsInput, ClientUncheckedUpdateWithoutTransactionsInput>
  }

  export type ClientUpdateWithoutTransactionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    companyName?: StringFieldUpdateOperationsInput | string
    sector?: NullableStringFieldUpdateOperationsInput | string | null
    status?: NullableStringFieldUpdateOperationsInput | string | null
    user?: UserUpdateOneRequiredWithoutClientNestedInput
    admin?: UserUpdateOneWithoutManagedNestedInput
    cycles?: CycleUpdateManyWithoutClientNestedInput
  }

  export type ClientUncheckedUpdateWithoutTransactionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    adminId?: NullableStringFieldUpdateOperationsInput | string | null
    companyName?: StringFieldUpdateOperationsInput | string
    sector?: NullableStringFieldUpdateOperationsInput | string | null
    status?: NullableStringFieldUpdateOperationsInput | string | null
    cycles?: CycleUncheckedUpdateManyWithoutClientNestedInput
  }

  export type ClientCreateManyAdminInput = {
    id?: string
    userId: string
    companyName: string
    sector?: string | null
    status?: string | null
  }

  export type ClientUpdateWithoutAdminInput = {
    id?: StringFieldUpdateOperationsInput | string
    companyName?: StringFieldUpdateOperationsInput | string
    sector?: NullableStringFieldUpdateOperationsInput | string | null
    status?: NullableStringFieldUpdateOperationsInput | string | null
    user?: UserUpdateOneRequiredWithoutClientNestedInput
    cycles?: CycleUpdateManyWithoutClientNestedInput
    transactions?: TransactionUpdateManyWithoutClientNestedInput
  }

  export type ClientUncheckedUpdateWithoutAdminInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    companyName?: StringFieldUpdateOperationsInput | string
    sector?: NullableStringFieldUpdateOperationsInput | string | null
    status?: NullableStringFieldUpdateOperationsInput | string | null
    cycles?: CycleUncheckedUpdateManyWithoutClientNestedInput
    transactions?: TransactionUncheckedUpdateManyWithoutClientNestedInput
  }

  export type ClientUncheckedUpdateManyWithoutAdminInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    companyName?: StringFieldUpdateOperationsInput | string
    sector?: NullableStringFieldUpdateOperationsInput | string | null
    status?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type CycleCreateManyClientInput = {
    id?: string
    cycleNumber: number
    mainObjective: string
    caTargetMonthly?: number
    startDate: Date | string
    endDate: Date | string
    status?: $Enums.CycleStatus
    createdAt?: Date | string
  }

  export type TransactionCreateManyClientInput = {
    id?: string
    type: $Enums.TransactionType
    amountHt: number
    transactionDate: Date | string
    label?: string | null
    category?: string | null
    recurrence?: string | null
    createdAt?: Date | string
  }

  export type CycleUpdateWithoutClientInput = {
    id?: StringFieldUpdateOperationsInput | string
    cycleNumber?: IntFieldUpdateOperationsInput | number
    mainObjective?: StringFieldUpdateOperationsInput | string
    caTargetMonthly?: FloatFieldUpdateOperationsInput | number
    startDate?: DateTimeFieldUpdateOperationsInput | Date | string
    endDate?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: EnumCycleStatusFieldUpdateOperationsInput | $Enums.CycleStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    weeks?: WeekUpdateManyWithoutCycleNestedInput
    objectives?: ObjectiveUpdateManyWithoutCycleNestedInput
  }

  export type CycleUncheckedUpdateWithoutClientInput = {
    id?: StringFieldUpdateOperationsInput | string
    cycleNumber?: IntFieldUpdateOperationsInput | number
    mainObjective?: StringFieldUpdateOperationsInput | string
    caTargetMonthly?: FloatFieldUpdateOperationsInput | number
    startDate?: DateTimeFieldUpdateOperationsInput | Date | string
    endDate?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: EnumCycleStatusFieldUpdateOperationsInput | $Enums.CycleStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    weeks?: WeekUncheckedUpdateManyWithoutCycleNestedInput
    objectives?: ObjectiveUncheckedUpdateManyWithoutCycleNestedInput
  }

  export type CycleUncheckedUpdateManyWithoutClientInput = {
    id?: StringFieldUpdateOperationsInput | string
    cycleNumber?: IntFieldUpdateOperationsInput | number
    mainObjective?: StringFieldUpdateOperationsInput | string
    caTargetMonthly?: FloatFieldUpdateOperationsInput | number
    startDate?: DateTimeFieldUpdateOperationsInput | Date | string
    endDate?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: EnumCycleStatusFieldUpdateOperationsInput | $Enums.CycleStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TransactionUpdateWithoutClientInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: EnumTransactionTypeFieldUpdateOperationsInput | $Enums.TransactionType
    amountHt?: FloatFieldUpdateOperationsInput | number
    transactionDate?: DateTimeFieldUpdateOperationsInput | Date | string
    label?: NullableStringFieldUpdateOperationsInput | string | null
    category?: NullableStringFieldUpdateOperationsInput | string | null
    recurrence?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TransactionUncheckedUpdateWithoutClientInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: EnumTransactionTypeFieldUpdateOperationsInput | $Enums.TransactionType
    amountHt?: FloatFieldUpdateOperationsInput | number
    transactionDate?: DateTimeFieldUpdateOperationsInput | Date | string
    label?: NullableStringFieldUpdateOperationsInput | string | null
    category?: NullableStringFieldUpdateOperationsInput | string | null
    recurrence?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TransactionUncheckedUpdateManyWithoutClientInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: EnumTransactionTypeFieldUpdateOperationsInput | $Enums.TransactionType
    amountHt?: FloatFieldUpdateOperationsInput | number
    transactionDate?: DateTimeFieldUpdateOperationsInput | Date | string
    label?: NullableStringFieldUpdateOperationsInput | string | null
    category?: NullableStringFieldUpdateOperationsInput | string | null
    recurrence?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type WeekCreateManyCycleInput = {
    id?: string
    weekNumber: number
    startDate?: Date | string | null
    focusTitle?: string | null
    actions?: WeekCreateactionsInput | string[]
    createdAt?: Date | string
  }

  export type ObjectiveCreateManyCycleInput = {
    id?: string
    title: string
    description?: string | null
    progressPct?: number
    status?: $Enums.ObjectiveStatus
    createdAt?: Date | string
  }

  export type WeekUpdateWithoutCycleInput = {
    id?: StringFieldUpdateOperationsInput | string
    weekNumber?: IntFieldUpdateOperationsInput | number
    startDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    focusTitle?: NullableStringFieldUpdateOperationsInput | string | null
    actions?: WeekUpdateactionsInput | string[]
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type WeekUncheckedUpdateWithoutCycleInput = {
    id?: StringFieldUpdateOperationsInput | string
    weekNumber?: IntFieldUpdateOperationsInput | number
    startDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    focusTitle?: NullableStringFieldUpdateOperationsInput | string | null
    actions?: WeekUpdateactionsInput | string[]
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type WeekUncheckedUpdateManyWithoutCycleInput = {
    id?: StringFieldUpdateOperationsInput | string
    weekNumber?: IntFieldUpdateOperationsInput | number
    startDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    focusTitle?: NullableStringFieldUpdateOperationsInput | string | null
    actions?: WeekUpdateactionsInput | string[]
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ObjectiveUpdateWithoutCycleInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    progressPct?: IntFieldUpdateOperationsInput | number
    status?: EnumObjectiveStatusFieldUpdateOperationsInput | $Enums.ObjectiveStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ObjectiveUncheckedUpdateWithoutCycleInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    progressPct?: IntFieldUpdateOperationsInput | number
    status?: EnumObjectiveStatusFieldUpdateOperationsInput | $Enums.ObjectiveStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ObjectiveUncheckedUpdateManyWithoutCycleInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    progressPct?: IntFieldUpdateOperationsInput | number
    status?: EnumObjectiveStatusFieldUpdateOperationsInput | $Enums.ObjectiveStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }



  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}