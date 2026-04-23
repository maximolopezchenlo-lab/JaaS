/**
 * JaaS — Circle SDK Metrics Tracker
 * RULE 24: Track SDK latency and friction points for the
 * "Product Feedback" hackathon prize ($500 USDC).
 * RULE 26: Log exact token consumption for cost analysis.
 */

interface CircleCallMetric {
  endpoint: string;
  method: string;
  durationMs: number;
  statusCode: number;
  errorMessage?: string;
  timestamp: string;
}

interface TokenUsageMetric {
  model: string;
  inputTokens: number;
  outputTokens: number;
  costEstimateUsd: number;
  timestamp: string;
}

class MetricsCollector {
  private circleMetrics: CircleCallMetric[] = [];
  private tokenMetrics: TokenUsageMetric[] = [];

  recordCircleCall(metric: Omit<CircleCallMetric, "timestamp">): void {
    this.circleMetrics.push({
      ...metric,
      timestamp: new Date().toISOString(),
    });
  }

  recordTokenUsage(metric: Omit<TokenUsageMetric, "timestamp">): void {
    this.tokenMetrics.push({
      ...metric,
      timestamp: new Date().toISOString(),
    });
  }

  getCircleMetrics(): CircleCallMetric[] {
    return [...this.circleMetrics];
  }

  getTokenMetrics(): TokenUsageMetric[] {
    return [...this.tokenMetrics];
  }

  getCircleSummary(): {
    totalCalls: number;
    avgLatencyMs: number;
    errorRate: number;
    slowestEndpoint: string | null;
  } {
    const total = this.circleMetrics.length;
    if (total === 0) {
      return { totalCalls: 0, avgLatencyMs: 0, errorRate: 0, slowestEndpoint: null };
    }

    const avgLatency =
      this.circleMetrics.reduce((sum, m) => sum + m.durationMs, 0) / total;
    const errors = this.circleMetrics.filter((m) => m.statusCode >= 400).length;
    const slowest = this.circleMetrics.reduce((prev, curr) =>
      curr.durationMs > prev.durationMs ? curr : prev
    );

    return {
      totalCalls: total,
      avgLatencyMs: Math.round(avgLatency),
      errorRate: errors / total,
      slowestEndpoint: slowest.endpoint,
    };
  }

  getTokenCostSummary(): {
    totalInputTokens: number;
    totalOutputTokens: number;
    totalCostUsd: number;
  } {
    return {
      totalInputTokens: this.tokenMetrics.reduce((s, m) => s + m.inputTokens, 0),
      totalOutputTokens: this.tokenMetrics.reduce((s, m) => s + m.outputTokens, 0),
      totalCostUsd: this.tokenMetrics.reduce((s, m) => s + m.costEstimateUsd, 0),
    };
  }
}

export const metrics = new MetricsCollector();
