import * as msw from 'msw';
import { isTest } from '@/utils/index';

export async function delay(durationOrMode?: msw.DelayMode | number) {
  if (isTest()) return;
  return await msw.delay(durationOrMode);
}
