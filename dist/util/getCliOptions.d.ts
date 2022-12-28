import { BrowserType } from 'jest-playwright-preset';

type JestOptions = {
    [key: string]: any;
};
type CliOptions = {
    runnerOptions: {
        indexJson?: boolean;
        url?: string;
        configDir?: string;
        eject?: boolean;
        coverage?: boolean;
        junit?: boolean;
        browsers?: BrowserType | BrowserType[];
    };
    jestOptions: JestOptions;
};
declare const getCliOptions: () => CliOptions;

export { CliOptions, JestOptions, getCliOptions };
