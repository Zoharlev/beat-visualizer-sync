// Temporary ambient module to satisfy TS until generated types are available.
declare module "./types" {
  export type Json = string | number | boolean | null | { [key: string]: Json } | Json[];
  export interface Database {}
}
