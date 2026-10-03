import plans from '../content/riley/section-plans.json';
import type { AppState } from '../domain/model';
import type { RileyPosition } from '../data/riley-observations';
import { Button, Select } from './index';
import { KnowledgeStructure } from './knowledge-structure';
export function RileySectionReading({
  data,
  id,
  position,
  onChange,
}: {
  data: Pick<AppState, 'namespace' | 'userId'>;
  id: string;
  position: RileyPosition;
  onChange: (p: RileyPosition) => void;
}) {
  const p = plans.find((x) => x.id === id);
  if (!p) return null;
  const step = position.planStep ?? 0;
  return (
    <section aria-label="이 절의 관계·조건 관찰" data-section-plan={id}>
      <h3 tabIndex={-1}>{p.question}</h3>
      <p className="prose">{p.interpretation}</p>
      <KnowledgeStructure
        data={data}
        viewKey={`${id}:source-relation`}
        visual={{
          kind: 'relation',
          label: p.question,
          nodes: [
            { id: 'question', label: '알아볼 질문', detail: p.question },
            { id: 'relation', label: '표현 사이의 관계', detail: p.relationship },
            { id: 'conditions', label: '적용 조건과 경계', detail: p.conditions },
          ],
          relations: [
            { from: 'question', to: 'relation', label: '이 질문에서 비교할 대상과 관계를 정한다' },
            { from: 'conditions', to: 'relation', label: '이 조건 범위에서 관계를 해석한다' },
          ],
          highlighted: [],
        }}
      />
      <Select
        label="이 절의 적용 조건 확인 · 사용자가 남기는 상태"
        value={position.conditionCheck ?? '확인 전'}
        onChange={(e) =>
          onChange({
            ...position,
            conditionCheck: e.target.value as RileyPosition['conditionCheck'],
          })
        }
      >
        <option>확인 전</option>
        <option>충족</option>
        <option>위반</option>
      </Select>
      <p className="prose">{p.conditions}</p>
      <p className="muted">
        이 선택은 원문 조건을 대조하며 남기는 상태다. 계산기의 자동 판정·증명·숙달 기록과 구별한다.
        조건 위반만으로 대상 자체가 불가능하다고 판단하지 않는다.
      </p>
      <h4>관계 읽기 · {step + 1}/3</h4>
      <p className="prose" aria-live="polite">
        {p.steps[step]}
      </p>
      <div className="riley-actions">
        <Button disabled={step === 0} onClick={() => onChange({ ...position, planStep: step - 1 })}>
          관계 앞 단계
        </Button>
        <Button disabled={step === 2} onClick={() => onChange({ ...position, planStep: step + 1 })}>
          관계 다음 단계
        </Button>
        <Button onClick={() => onChange({ ...position, planStep: 0, conditionCheck: '확인 전' })}>
          관계·조건 확인 초기화
        </Button>
      </div>
      <p className="muted">
        초기화는 이 관계의 단계와 수동 조건 확인만 바꾼다. 조절값·메모·원문·시야는 유지한다.
      </p>
    </section>
  );
}
