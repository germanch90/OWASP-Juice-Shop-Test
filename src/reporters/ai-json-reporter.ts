import type { Reporter, TestCase, TestResult, FullResult } from '@playwright/test/reporter';
import fs from 'fs';

type AISummary = {
  timestamp: string;
  duration_ms: number;
  stats: {
    total: number;
    passed: number;
    failed: number;
    skipped: number;
  };
  results: Array<{
    title: string;
    file: string;
    status: TestResult['status'];
    duration: number;
    error?: string;
    retries: number;
  }>;
  };

class AIJSONReporter implements Reporter {
  private results: AISummary['results'] = [];
  private readonly startTime = Date.now();

  onTestEnd(test: TestCase, result: TestResult) {
    this.results.push({
      title: test.title,
      file: test.location.file,
      status: result.status,
      duration: result.duration,
      error: result.error?.message,
      retries: result.retry,
    });
  }

  async onEnd(_: FullResult) {
    const summary: AISummary = {
      timestamp: new Date().toISOString(),
      duration_ms: Date.now() - this.startTime,
      stats: {
        total: this.results.length,
        passed: this.results.filter((r) => r.status === 'passed').length,
        failed: this.results.filter((r) => r.status === 'failed').length,
        skipped: this.results.filter((r) => r.status === 'skipped').length,
      },
      results: this.results,
    };

    fs.writeFileSync('playwright-results.json', JSON.stringify(summary, null, 2));
    console.log('\nAI JSON Reporter: playwright-results.json generated.');
  }
}

export default AIJSONReporter;
