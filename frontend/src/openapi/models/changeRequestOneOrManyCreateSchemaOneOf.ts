/**
 * Generated by Orval
 * Do not edit manually.
 * See `gen:api` script in package.json
 */
import type { ChangeRequestOneOrManyCreateSchemaOneOfAction } from './changeRequestOneOrManyCreateSchemaOneOfAction';
import type { UpsertSegmentSchema } from './upsertSegmentSchema';

export type ChangeRequestOneOrManyCreateSchemaOneOf = {
    /** The name of this action. */
    action: ChangeRequestOneOrManyCreateSchemaOneOfAction;
    payload: UpsertSegmentSchema;
};