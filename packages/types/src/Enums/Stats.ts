import type { StatKindId } from './StatKindId';

/**
 * @tsoaModel
 */
export type Stats = Record<keyof typeof StatKindId, number>;
