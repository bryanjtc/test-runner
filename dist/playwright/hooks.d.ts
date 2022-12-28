import { Page } from 'playwright';
import { StoryContext } from '@storybook/csf';

type TestContext = {
    id: string;
    title: string;
    name: string;
};
type TestHook = (page: Page, context: TestContext) => Promise<void>;
interface TestRunnerConfig {
    setup?: () => void;
    preRender?: TestHook;
    postRender?: TestHook;
}
declare const setPreRender: (preRender: TestHook) => void;
declare const setPostRender: (postRender: TestHook) => void;
declare const getStoryContext: (page: Page, context: TestContext) => Promise<StoryContext>;

export { TestContext, TestHook, TestRunnerConfig, getStoryContext, setPostRender, setPreRender };
