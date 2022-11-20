import { StorybookConfig } from '@storybook/core-common';

declare const getStorybookMain: (configDir: string) => StorybookConfig;

export { getStorybookMain };
