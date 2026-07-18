import { createManifest, manifestResponse } from "@/lib/create-manifest";

export async function GET() {
  return manifestResponse(await createManifest("en"));
}
