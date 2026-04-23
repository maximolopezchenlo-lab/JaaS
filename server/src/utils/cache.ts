import { logger } from "./logger";

/**
 * JaaS — LRU Memory Cache Simulator
 * RULE 15: Aprovechamiento Intensivo de RAM (64GB).
 * This class implements a robust in-memory cache to serve repeated
 * jurisprudential queries and avoid redundant API calls.
 */
export class MemoryCache<T> {
  private cache: Map<string, { value: T; expiresAt: number }>;
  private readonly ttlMs: number;
  private readonly maxSize: number;

  constructor(ttlMs: number = 3600000, maxSize: number = 10000) {
    this.cache = new Map();
    this.ttlMs = ttlMs;
    this.maxSize = maxSize;
  }

  set(key: string, value: T): void {
    if (this.cache.size >= this.maxSize) {
      // Very simple LRU approximation: delete the first (oldest) key
      const firstKey = this.cache.keys().next().value;
      if (firstKey) this.cache.delete(firstKey);
    }
    this.cache.set(key, { value, expiresAt: Date.now() + this.ttlMs });
    logger.debug(`Cache set for key: ${key}`);
  }

  get(key: string): T | null {
    const entry = this.cache.get(key);
    if (!entry) return null;

    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      logger.debug(`Cache expired for key: ${key}`);
      return null;
    }

    logger.info(`Cache hit for key: ${key}`);
    return entry.value;
  }

  delete(key: string): void {
    this.cache.delete(key);
  }

  clear(): void {
    this.cache.clear();
  }
}

// Singleton instance specifically for legal analysis caching
export const legalAnalysisCache = new MemoryCache<any>(3600000, 5000);
