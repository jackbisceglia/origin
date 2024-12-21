import { createSchema, Row } from "@rocicorp/zero";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export type SchemaTables<T extends ReturnType<typeof createSchema>["tables"]> =
  {
    [K in keyof T as Capitalize<string & K>]: Row<T[K]>;
  };

export type NoUndefinedState<T> = T extends [
  infer S | undefined,
  React.Dispatch<React.SetStateAction<infer S | undefined>>,
]
  ? [S, React.Dispatch<React.SetStateAction<S>>]
  : never;
