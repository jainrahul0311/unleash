/**
 * Generated by Orval
 * Do not edit manually.
 * See `gen:api` script in package.json
 */
import type { ClientMetricsSchemaBucket } from './clientMetricsSchemaBucket';

/**
 * Client usage metrics, accumulated in buckets of hour by hour by default
 */
export interface ClientMetricsSchema {
    /** The name of the application that is evaluating toggles */
    appName: string;
    /** A [(somewhat) unique identifier](https://docs.getunleash.io/reference/sdks/node#advanced-usage) for the application */
    instanceId?: string;
    /** Which environment the application is running in */
    environment?: string;
    /** Holds all metrics gathered over a window of time. Typically 1 hour wide */
    bucket: ClientMetricsSchemaBucket;
}
