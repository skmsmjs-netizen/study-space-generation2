import fs from 'node:fs';
const p = 'src/content/riley/catalog.json',
  c = JSON.parse(fs.readFileSync(p, 'utf8'));
const map = {
  quadratic: ['1.1', '1.3'],
  calculus: ['2.1', '2.2'],
  hessian: ['5.7', '5.8', '5.9'],
  polar: ['6.1', '6.4'],
  modes: ['9.1', '9.2', '9.3'],
  helix: ['10.1', '10.3'],
  flux: ['11.5', '11.6', '11.8'],
  laplace: ['13.2'],
  logistic: ['14.1', '14.2'],
  frobenius: ['16.1', '16.2', '16.3', '16.4', '16.5'],
  sturm: ['17.3', '17.4', '17.5'],
  legendre: ['18.1'],
  quantum: ['19.1', '19.2'],
  fredholm: ['23.1', '23.2', '23.4', '23.5'],
  analytic: ['24.1', '24.2', '24.7'],
  potential: ['25.1', '25.2'],
  quadrature: ['27.4'],
  representation: ['29.2', '29.3', '29.4', '29.6', '29.10'],
};
for (const s of c.sections) {
  if (s.number === '6.2' && s.scene === 'polar') delete s.scene;
  for (const [kind, nums] of Object.entries(map)) if (nums.includes(s.number)) s.scene = kind;
  s.relationReading = true;
  s.implementation =
    'section-question-relation-condition-steps' + (s.scene ? '+bounded-live-example' : '');
  if (s.scene) {
    s.classification = '부분 대응';
    s.reason =
      '이 절의 질문·관계·조건과 제한된 계산 사례를 실제로 조절할 수 있다. 절 전체의 모든 해·방법을 계산하는 도구로 확대하지 않는다.';
  } else {
    s.classification = '기존 틀로 대응';
    s.reason =
      '이 절의 개별 질문·대응 관계·적용 조건을 구조/문장·단계·수동 조건 확인으로 읽는다. 원문의 모든 세부 증명·계산을 자동 수행한다는 뜻은 아니다.';
  }
}
c.manifest.version = '2.0.0';
c.manifest.scope.relationReadings = 248;
c.manifest.scope.liveModels = 35;
fs.writeFileSync(p, JSON.stringify(c, null, 2) + '\n');
console.log({
  sections: c.sections.length,
  liveSections: c.sections.filter((s) => s.scene).length,
  models: new Set(c.sections.filter((s) => s.scene).map((s) => s.scene)).size,
  chaptersWithModels: new Set(c.sections.filter((s) => s.scene).map((s) => s.chapter)).size,
});
