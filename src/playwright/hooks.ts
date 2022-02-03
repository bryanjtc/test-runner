import global from 'global';
import type { Page } from 'playwright';

export type TestContext = {
  id: string;
  title: string;
  name: string;
};

export type TestHook = (page: Page, context: TestContext) => Promise<void>;

export const setPreRender = (preRender: TestHook) => {
  global.__sbPreRender = preRender;
};

export const setPostRender = (postRender: TestHook) => {
  global.__sbPostRender = postRender;
};