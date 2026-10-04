import fs from 'node:fs';
import crypto from 'node:crypto';
import { RILEY_SCENES } from '../src/domain/riley-observations.ts';

const work = process.env.RILEY_REPORT_DIR || 'work/riley-observations-20261003';
fs.mkdirSync(work, { recursive: true });
const plans = JSON.parse(fs.readFileSync('src/content/riley/section-plans.json', 'utf8'));
const catalog = JSON.parse(fs.readFileSync('src/content/riley/catalog.json', 'utf8'));
const discovery = JSON.parse(fs.readFileSync('src/content/riley/discovery.json', 'utf8'));
const rows = catalog.sections.map((s) => ({
  ...s,
  chapterContext: catalog.chapters[s.chapter - 1],
  sectionPlan: plans.find((p) => p.id === s.id),
  observation: s.scene ? RILEY_SCENES[s.scene] : null,
  interpretationLevel: '기존 원문 연결 + 절별 질문·관계·조건에 대한 설계 해석 + 제한된 계산 사례',
  remaining: s.scene
    ? '절의 모든 방법·대상까지 구현하지 않은 부분 대응'
    : s.classification === '정적 설명 적합'
      ? '원문 읽기 적합성의 현재 설계 판단; 구조 관찰의 필요성은 사용 결과로 보완'
      : '절별 구조·문장·수동 조건·관계 단계는 구현. 원문의 개별 정리·세부 방법·식마다의 실제 계산·증명 대응은 구별하여 대조 필요',
}));
fs.writeFileSync(
  `${work}/correspondence.json`,
  JSON.stringify({ manifest: catalog.manifest, sections: rows, discovery }, null, 2) + '\n',
);
fs.writeFileSync(`${work}/scene-specs.json`, JSON.stringify(RILEY_SCENES, null, 2) + '\n');
const csv = (v) => '"' + String(v ?? '').replaceAll('"', '""') + '"';
const headers = [
  '안정 ID',
  '절',
  '원제목',
  '책 시작 쪽',
  'PDF 시작 페이지',
  '분류',
  '이유',
  '실제 계산 사례',
  '이 절의 질문(설계)',
  '이 절의 관계(연결 해석)',
  '이 절의 조건·주의점',
  '계산 사례의 질문(설계)',
  '장 질문(연결 해석)',
  '선행 개념(장 단위)',
  '정의·방법(장 단위)',
  '조건·예외(장 단위)',
  '교차 연결(장 단위)',
  '남은 직접 조건',
];
const values = rows.map((s) => [
  s.id,
  s.number,
  s.title,
  s.printed,
  s.pdf,
  s.classification,
  s.reason,
  s.scene ?? '',
  s.sectionPlan?.question,
  s.sectionPlan?.relationship,
  s.sectionPlan?.conditions,
  s.observation?.question ?? '관계 읽기 · 수동 조건 확인',
  s.chapterContext.question,
  s.chapterContext.prior,
  s.chapterContext.laws,
  s.chapterContext.conditions,
  s.chapterContext.next,
  s.remaining,
]);
fs.writeFileSync(
  `${work}/correspondence.csv`,
  '\ufeff' + [headers, ...values].map((r) => r.map(csv).join(',')).join('\r\n') + '\r\n',
);
const criteria = [
  [
    '공통 관찰틀',
    'docs/observation-frames.md',
    '역할별 자리/관계·단계·조건; src/ui/riley-observatory.tsx',
  ],
  [
    '천문대 기준값',
    'docs/observatory-experience-baseline.json',
    '2.1.0, 기존 MathExplorer/공통 토큰 → riley-observatory.css',
  ],
  [
    '지식 표현',
    'docs/knowledge-structure-contract.json',
    '1.0.0, 기존 KnowledgeStructure → 49개 개념/61개 관계',
  ],
  [
    '레이아웃',
    'docs/layout-standard-contract.json',
    '1.0.0, 목록P02/관찰P05 L194/구조P07; 실제 역할별 UI',
  ],
  [
    '본문 글자',
    'docs/paper-typography-standard/contract.json',
    '1.1.0, native95%/700/18 또는16/justify/start → p.prose, textarea.paper-memo',
  ],
  [
    'MI01–MI12',
    '../docs/수학 인터랙티브 설계·검증 기준.md',
    'domain/data/UI 및 계산·조판·보존·브라우저 증거',
  ],
  [
    '표시 값',
    'src/interactive/math-physics/presentation.mjs',
    '기존 formatNumber를 domain/UI에서 소비; 입력·계산 원값 보존',
  ],
  [
    '시야 수학',
    'src/interactive/math-physics/gestures.mjs',
    'gestureRanges를 SVG PointerEvent 어댑터에서 소비',
  ],
  [
    '시야 가시성',
    'src/interactive/math-physics/visibility.mjs',
    'hasVisibleTrace: 화면 밖 곡선과 계산 불가 구별',
  ],
  [
    '저장 계약',
    'docs/data-contract.md',
    '기존 원문/ID/학습 의미 보존; repository prefix/draft-safety/storage-codec 재사용',
  ],
];
fs.writeFileSync(
  `${work}/standards-consumption.json`,
  JSON.stringify(
    criteria.map(([name, file, scope]) => ({
      name,
      file,
      scope,
      sha256: crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex'),
    })),
    null,
    2,
  ) + '\n',
);
const escape = (v) => String(v).replaceAll('|', ' / ').replaceAll('\n', ' ');
const table = [
  '# 수학교재 전체 주요 절 대응표',
  '',
  '원문 주요 절248개를 모두 포함한다. 절별 질문·관계·조건은 설계 해석이며, 본문의 모든 정리·법칙의 완전한 조건 목록이라는 뜻은 아니다. 장 단위 질문·조건과 개별 관찰 질문을 구별하며, 특정 사례를 절 전체의 구현으로 확대하지 않는다. 상세 질문·매개변수·범위·초기 이유·단계는 correspondence.json 및 scene-specs.json을 참조한다. 아래 쪽수는 주요 절의 시작이다.',
  '',
  '| 절 | 원제목 | 책 / PDF | 분류 | 실제 계산 사례 |',
  '| --- | --- | --- | --- | --- |',
  ...rows.map(
    (s) =>
      `| ${s.number} | ${escape(s.title)} | ${s.printed} / ${s.pdf} | ${s.classification} | ${s.observation ? escape(s.observation.title) : '절별 관계·조건·단계 읽기'} |`,
  ),
  '',
  '## 구현된 사례의 질문·조건·원문 연결',
  '',
];
for (const [id, s] of Object.entries(RILEY_SCENES))
  table.push(
    `### ${s.title}`,
    '',
    s.question,
    '',
    `원식: \`${s.tex}\``,
    '',
    s.conditions,
    '',
    s.initialReason,
    '',
    s.fields
      .map((f) => `${f.label}: 초기값${f.value}, 범위${f.min}~${f.max}, 간격${f.step}`)
      .join('; '),
    '',
    rows
      .filter((r) => r.scene === id)
      .map((r) => `${r.id} / §${r.number} / 책${r.printed} / PDF${r.pdf}`)
      .join('; '),
    '',
    s.steps.join(' → '),
    '',
  );
fs.writeFileSync(`${work}/전체-대응표.md`, table.join('\n') + '\n');
console.log(
  JSON.stringify({
    chapters: catalog.chapters.length,
    sections: rows.length,
    counts: rows.reduce((r, s) => ((r[s.classification] = (r[s.classification] ?? 0) + 1), r), {}),
    cases: Object.keys(RILEY_SCENES).length,
    pending: discovery.subsections.length + discovery.equationMentions.length,
  }),
);
