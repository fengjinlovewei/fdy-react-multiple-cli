// @ts-ignore
import { isMock } from '../../../script/package-readonly.js';
import { isDev } from '@/utils';
import { worker } from '@/api/mock/index.browser.mock';

export async function enableMocking() {
  if (isDev() && isMock) {
    // const { worker } = await import('@/api/mock/index.browser.mock');
    return worker.start();
  }
}
