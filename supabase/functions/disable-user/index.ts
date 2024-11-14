import "jsr:@supabase/functions-js/edge-runtime.d.ts"
import { z } from "https://deno.land/x/zod@v3.23.8/mod.ts";
import EdgeFunctionRequest, { RunParams } from "../_shared/EdgeFunctionRequest.ts";
import disableUser from "./disableUser.ts";

Deno.serve(async (req) => {
    const parameters: RunParams = {
        metaUrl: import.meta.url,
        req: req,
        schemaRecord: { userId: z.string(), disable: z.bool() },
        endpointFunction: disableUser,
        adminOnly: true
    };

    return await EdgeFunctionRequest.run(parameters);
});
