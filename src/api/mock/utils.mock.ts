import * as msw from 'msw';
import { isTest } from '@/utils/index';

/**
 * 如果是单元测试，那么延迟全部归0
 */
export async function delay(durationOrMode?: msw.DelayMode | number) {
  if (isTest()) return;
  return await msw.delay(durationOrMode);
}
