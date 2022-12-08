import { TestRunnerConfig } from '../playwright/hooks.js';
import 'playwright';
import '@storybook/csf';

declare const getTestRunnerConfig: (configDir: string) => TestRunnerConfig | undefined;

export { getTestRunnerConfig };