import { SchemaTables } from "@/lib/utils";
import {
  ANYONE_CAN,
  column,
  createSchema,
  createTableSchema,
  definePermissions,
  Row,
} from "@rocicorp/zero";

const userSchema = createTableSchema({
  tableName: "user",
  columns: {
    id: { type: "string" },
    name: { type: "string" },
  },
  primaryKey: ["id"],
});

const cafeSchema = createTableSchema({
  tableName: "cafe",
  columns: {
    id: "string",
    userId: "string",
    name: "string",
    city: "string",
    vibe: column.enumeration<
      "modern" | "cozy" | "artisanal" | "social" | "studious"
    >(),
    rating: "number",
    lastVisited: "number",
  },
  primaryKey: ["id"],
  relationships: {
    user: {
      sourceField: "userId",
      destField: "id",
      destSchema: () => userSchema,
    },
    drinks: {
      sourceField: "id",
      destField: "cafeId",
      destSchema: () => drinkSchema,
    },
    beans: {
      sourceField: "id",
      destField: "cafeId",
      destSchema: () => beansSchema,
    },
  },
});

const drinkSchema = createTableSchema({
  tableName: "drink",
  columns: {
    id: "string",
    cafeId: "string",
    name: "string",
    notes: "string",
    type: column.enumeration<"coffee" | "tea" | "other">(),
    rating: "number",
    date: "number",
  },
  primaryKey: ["id"],
});

const beansSchema = createTableSchema({
  tableName: "beans",
  columns: {
    id: "string",
    cafeId: "string",
    name: "string",
    notes: "string",
    origin: "string",
    roast: column.enumeration<"light" | "medium" | "dark">(),
    rating: "number",
    date: "number",
  },
  primaryKey: ["id"],
});

export const schema = createSchema({
  version: 1,
  tables: {
    user: userSchema,
    cafe: cafeSchema,
    drink: drinkSchema,
    beans: beansSchema,
  },
});

export type Z = SchemaTables<typeof schema.tables>;

type AuthData = {
  // The logged-in user.
  sub: string | null;
};

export const permissions = definePermissions<AuthData, Schema>(schema, () => {
  return {
    user: {
      row: {
        select: ANYONE_CAN,
        insert: ANYONE_CAN,
        update: ANYONE_CAN,
        delete: ANYONE_CAN,
      },
    },
  };
});

export type Schema = typeof schema;
