import { useRef, useState } from 'react';
import type { AppState, QuickMemo } from '../domain/model';
import type { StudyRepository } from '../data/repository';
import {
  clearConceptDraft,
  conceptDraftKey,
  editConceptDraft,
  newConceptDraft,
  preserveConceptDraft,
  readConceptDraft,
  saveConceptMemo,
  writeConceptDraft,
  type ConceptDraft,
} from '../data/canvas-concept';
import { Button, Input, Textarea } from './index';

export function CanvasConceptEditor({
  data,
  repository,
  memo,
  ownerId = null,
  onSaved,
  onClose,
}: {
  data: AppState;
  repository: StudyRepository;
  memo?: QuickMemo;
  ownerId?: string | null;
  onSaved: (next: AppState, memoId: string) => void;
  onClose: () => void;
}) {
  const [boot] = useState(() => {
    let key = '';
    try {
      key = conceptDraftKey(data, memo?.id);
      return { key, ...readConceptDraft(key), error: '' };
    } catch (e) {
      return {
        key,
        raw: null,
        draft: null,
        error: e instanceof Error ? e.message : '초안을 읽지 못했습니다.',
      };
    }
  });
  const [draft, setDraft] = useState<ConceptDraft>(
    () => boot.draft ?? (memo ? editConceptDraft(memo) : newConceptDraft(ownerId)),
  );
  const raw = useRef(boot.raw);
  const [error, setError] = useState(boot.error),
    [composing, setComposing] = useState(false);
  const ready =
    data.namespace === 'demo' ||
    !repository.getCapabilities ||
    repository.getCapabilities().includes('saveMemo');
  const subjectName = data.subjects.find((s) => s.id === draft.ownerId)?.name;
  const change = (next: ConceptDraft) => {
    setDraft(next);
    try {
      raw.current = writeConceptDraft(boot.key, next, raw.current);
      setError('');
      return true;
    } catch (e) {
      const message = e instanceof Error ? e.message : '초안 보관을 다시 시도해 주세요.';
      if (!message.includes('다른 곳')) raw.current = JSON.stringify(next);
      setError(message);
      return false;
    }
  };
  const save = () => {
    if (composing || boot.error || !ready || !change(draft)) return;
    try {
      const result = saveConceptMemo(repository, draft);
      // Keep the same identity on cleanup failure so a retry cannot create a duplicate card.
      clearConceptDraft(boot.key, raw.current);
      raw.current = null;
      onSaved(result, draft.id);
    } catch (e) {
      setError(e instanceof Error ? e.message : '저장하지 못했습니다. 입력은 유지했습니다.');
    }
  };
  return (
    <form
      className="canvas-concept-editor"
      aria-label={memo ? '개념 카드 편집' : '개념 카드 추가'}
      onCompositionStart={() => setComposing(true)}
      onCompositionEnd={() => setComposing(false)}
      onSubmit={(event) => {
        event.preventDefault();
        save();
      }}
    >
      {!memo && <h2>개념 카드 추가</h2>}
      <Input
        label="개념 이름"
        value={draft.name}
        disabled={Boolean(boot.error)}
        placeholder="예: 에너지 보존"
        onChange={(event) => change({ ...draft, name: event.target.value })}
      />
      <details open={Boolean(draft.description)}>
        <summary>설명 덧붙이기 · 선택</summary>
        <Textarea
          label="개념 설명"
          rows={4}
          value={draft.description}
          disabled={Boolean(boot.error)}
          onChange={(event) => change({ ...draft, description: event.target.value })}
        />
      </details>
      {!memo && (
        <p>
          {subjectName
            ? `${subjectName}에 보관합니다.`
            : '과목 지정 없이 보관합니다.'}
        </p>
      )}
      {error && (
        <div role="alert">
          <p>{error}</p>
          {boot.error && boot.key && (
            <Button
              onClick={() => {
                try {
                  preserveConceptDraft(boot.key);
                  setError('원문 사본을 보관했습니다. 초안 보관본에서 확인해 주세요.');
                } catch (e) {
                  setError(e instanceof Error ? e.message : '사본을 보관하지 못했습니다.');
                }
              }}
            >
              원문 사본 보관
            </Button>
          )}
          <a href="#/draft-archives">초안 보관본</a>
        </div>
      )}
      {!ready && (
        <p role="alert">지금은 카드를 저장할 수 없습니다. 작성 내용은 이 기기에 남아 있습니다.</p>
      )}
      <div className="actions">
        <Button
          variant="primary"
          type="submit"
          disabled={!ready || Boolean(boot.error) || composing || !draft.name.trim()}
        >
          {memo ? '개념 저장' : '카드 추가'}
        </Button>
        <Button onClick={onClose}>접기</Button>
      </div>
    </form>
  );
}
