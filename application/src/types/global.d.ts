type Prettify<T> = {
   [K in keyof T]: T[K];
} & {};

interface DBRecord {
   id: string;
   collectionId: string;
   collectionName: string;
   created: string;
   updated: string;
}

type DBRecordItem<T> = T & DBRecord;

type ExpandedDBRecord<T, K> = Prettify<
   T & {
      expand: K;
   }
>;

interface GenericBackendResponse<T> {
   success: true;
   successMessage?: string;
   data: T;
}

interface GenericBackendErrorResponse {
   success: false;
   errorMessage: string;
}

type BackendResponse<T = unknown> =
   | GenericBackendResponse<T>
   | GenericBackendErrorResponse;
