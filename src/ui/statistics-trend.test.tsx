import { cleanup, render } from '@testing-library/react';
import { afterEach, expect, it } from 'vitest';
import type { Metric, StatisticItem } from '../domain/statistics';
import { StatisticsTrend } from './statistics-trend';
afterEach(cleanup);
it('plots exact dates and minimum counts while keeping ranges and unknown dates outside the trend', () => {
  const item: StatisticItem = { id:'exact', value:2, maximum:null, date:{kind:'exact',date:'2026-10-01'}, targetId:'topic', recordIds:[], eventIds:[], label:'주제' };
  const metric: Metric = { id:'repeats', label:'반복', unit:'회', description:'', items:[item,
    {...item,id:'range',value:90,date:{kind:'range',from:'2026-10-01',to:'2026-10-02'}},
    {...item,id:'unknown',value:100,date:{kind:'unknown'}},
  ] };
  const {container,rerender}=render(<StatisticsTrend metric={metric} from="2026-10-01" to="2026-10-31"/>);
  expect(container.querySelectorAll('rect')).toHaveLength(11);
  expect([...container.querySelectorAll('rect')].map(bar=>bar.getAttribute('height'))).toEqual(['48',...Array(10).fill('0')]);
  rerender(<StatisticsTrend metric={metric} from="2026-11-01" to="2026-11-30"/>);
  expect([...container.querySelectorAll('rect')].every(bar=>bar.getAttribute('height')==='0')).toBe(true);
});
