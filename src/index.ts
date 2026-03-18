/**
 * Qryma JavaScript SDK
 *
 * A JavaScript SDK for the Qryma Search API.
 */

import { QrymaClient, qryma } from "./client";
import { __version__ } from "./version";

export { QrymaClient, qryma, __version__ };
export * from "./client";

// Default export for convenience
export default qryma;
