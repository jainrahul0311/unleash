/**
 * Generated by Orval
 * Do not edit manually.
 * See `gen:api` script in package.json
 */
import type { FeatureLifecycleSchemaItemStage } from './featureLifecycleSchemaItemStage';

/**
 * The lifecycle stage of the feature
 */
export type FeatureLifecycleSchemaItem = {
    /** The date when the feature entered a given stage */
    enteredStageAt: string;
    /** The name of the lifecycle stage that got recorded for a given feature */
    stage: FeatureLifecycleSchemaItemStage;
};