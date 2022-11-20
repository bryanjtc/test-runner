import { Page } from 'playwright';

declare const setupPage: (page: Page) => Promise<void>;

export { setupPage };
