import { BrowserType } from 'jest-playwright-preset';

declare type CliOptions = {
    runnerOptions: {
        indexJson?: boolean;
        url?: string;
        configDir?: string;
        eject?: boolean;
        coverage?: boolean;
        junit?: boolean;
        browsers?: BrowserType | BrowserType[];
    };
    jestOptions: string[];
};
declare const getCliOptions: () => CliOptions;

export { getCliOptions };
