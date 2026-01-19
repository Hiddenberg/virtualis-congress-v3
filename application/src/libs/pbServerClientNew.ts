import Pocketbase, {
   ClientResponseError,
   type ListResult,
   type RecordListOptions,
   type RecordOptions,
} from "pocketbase";
import PB_COLLECTIONS from "@/types/constants/pocketbaseCollections";

if (!process.env.POCKETBASE_SERVER_URL) {
   throw new Error("NEXT_PUBLIC_POCKETBASE_URL is not set");
}

if (!process.env.PB_SERVER_TOKEN) {
   throw new Error("PB_SERVER_TOKEN is not set");
}

const pbServerClient = new Pocketbase(process.env.POCKETBASE_SERVER_URL);

pbServerClient.autoCancellation(false);
pbServerClient.authStore.save(process.env.PB_SERVER_TOKEN!);

export async function getDBRecordById<T>(
   collection: keyof typeof PB_COLLECTIONS,
   id: string,
   options?: RecordOptions,
) {
   try {
      const record = await pbServerClient
         .collection(PB_COLLECTIONS[collection])
         .getOne<DBRecordItem<T>>(id, options);
      return record;
   } catch (error) {
      if (error instanceof ClientResponseError && error.status === 404) {
         return null;
      }
      console.error(
         `[getDBRecordById] Error getting record from ${collection} collection with id ${id}`,
         error,
      );
      throw error;
   }
}

export async function getSingleDBRecord<T>(
   collection: keyof typeof PB_COLLECTIONS,
   filter: string,
   options?: RecordListOptions,
) {
   try {
      const record = await pbServerClient
         .collection(PB_COLLECTIONS[collection])
         .getFirstListItem<DBRecordItem<T>>(filter, options);
      return record;
   } catch (error) {
      if (error instanceof ClientResponseError && error.status === 404) {
         return null;
      }
      console.error(
         `[getSingleDBRecord] Error getting record from ${collection} collection with filter ${filter}`,
         error,
      );
      throw error;
   }
}

export async function getFullDBRecordsList<T>(
   collection: keyof typeof PB_COLLECTIONS,
   options?: RecordListOptions,
) {
   try {
      const records = await pbServerClient
         .collection(PB_COLLECTIONS[collection])
         .getFullList<DBRecordItem<T>>(options);
      return records;
   } catch (error) {
      if (error instanceof ClientResponseError && error.status === 404) {
         return [];
      }
      console.error(
         `[getFullDBRecordsList] Error getting records from ${collection} collection with options ${JSON.stringify(options)}`,
         error,
      );
      throw error;
   }
}

export async function getPaginatedDBRecordsList<T>(
   collection: keyof typeof PB_COLLECTIONS,
   page: number,
   recordsPerPage: number,
   options?: RecordListOptions,
): Promise<ListResult<DBRecordItem<T>>> {
   try {
      const paginatedRecords = await pbServerClient
         .collection(PB_COLLECTIONS[collection])
         .getList<DBRecordItem<T>>(page, recordsPerPage, options);

      return paginatedRecords;
   } catch (error) {
      if (error instanceof ClientResponseError && error.status === 404) {
         return {
            items: [] as DBRecordItem<T>[],
            page: 1,
            perPage: recordsPerPage,
            totalItems: 0,
            totalPages: 0,
         };
      }
      console.error(
         `[getPaginatedDBRecordsList] Error getting paginated records from ${collection} collection with page ${page} and recordsPerPage ${recordsPerPage} and options ${JSON.stringify(options)}`,
         error,
      );
      throw error;
   }
}

export async function createDBRecord<T>(
   collection: keyof typeof PB_COLLECTIONS,
   data: T,
) {
   try {
      const newRecord = await pbServerClient
         .collection(PB_COLLECTIONS[collection])
         .create<DBRecordItem<T>>(data as Record<string, unknown>);
      return newRecord;
   } catch (error) {
      if (error instanceof ClientResponseError) {
         throw new Error(
            `[createDBRecord] Error creating record in ${collection} collection with data ${JSON.stringify(data)}: ${JSON.stringify(error.data)}`,
         );
      }
      throw error;
   }
}

export async function updateDBRecord<T>(
   collection: keyof typeof PB_COLLECTIONS,
   id: string,
   newData: Partial<T>,
) {
   try {
      const updatedRecord = await pbServerClient
         .collection(PB_COLLECTIONS[collection])
         .update<DBRecordItem<T>>(id, newData);
      return updatedRecord;
   } catch (error) {
      if (error instanceof ClientResponseError) {
         throw new Error(
            `[updateDBRecord] Error updating record in ${collection} collection with id ${id} and new data ${JSON.stringify(newData)}: ${JSON.stringify(error.data)}`,
         );
      }
      throw error;
   }
}

export async function deleteDBRecord(
   collection: keyof typeof PB_COLLECTIONS,
   id: string,
) {
   try {
      await pbServerClient.collection(PB_COLLECTIONS[collection]).delete(id);
      console.log(
         `[deleteDBRecord] Record deleted from ${PB_COLLECTIONS[collection]} collection with id ${id}`,
      );

      return null;
   } catch (error) {
      if (error instanceof ClientResponseError && error.status === 404) {
         throw new Error(
            `[deleteDBRecord] Unable to delete record from ${collection} collection with id ${id} because it does not exist`,
         );
      }

      console.error(
         `[deleteDBRecord] Error deleting record from ${collection} collection with id ${id}`,
         error,
      );
      throw error;
   }
}

/**
 * Constructs a filter expression with placeholders populated from a parameters object.
 *
 * Placeholder parameters are defined with the `{:paramName}` notation.
 *
 * The following parameter values are supported:
 *
 * - `string` (_single quotes are autoescaped_)
 * - `number`
 * - `boolean`
 * - `Date` object (_stringified into the PocketBase datetime format_)
 * - `null`
 * - everything else is converted to a string using `JSON.stringify()`
 *
 * Example:
 *
 * ```js
 * pb.collection("example").getFirstListItem(pb.filter(
 *    'title ~ {:title} && created >= {:created}',
 *    { title: "example", created: new Date()}
 * ))
 * ```
 */
export const pbFilter = pbServerClient.filter;

/**
 * Creates a new batch handler for sending multiple transactional
 * create/update/upsert/delete collection requests in one network call.
 *
 * Example:
 * ```js
 * const batch = pb.createBatch();
 *
 * batch.collection("example1").create({ ... })
 * batch.collection("example2").update("RECORD_ID", { ... })
 * batch.collection("example3").delete("RECORD_ID")
 * batch.collection("example4").upsert({ ... })
 *
 * await batch.send()
 * ```
 */
export const dbBatch = () => {
   return pbServerClient.createBatch();
};
