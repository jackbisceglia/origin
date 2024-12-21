import { useZero as useZeroGeneric } from "@rocicorp/zero/react";
import { Schema } from "../schema";

export const dummyId = "0193dda2-a111-7ea3-8ca3-7f132c039815";
export const useZero = useZeroGeneric<Schema>;
export type Zero = ReturnType<typeof useZero>;
