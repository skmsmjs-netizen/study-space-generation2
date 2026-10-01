import { useEffect, useMemo, useState } from 'react';
import { Button, Checkbox, ErrorState, Select } from './index';
import { canUseOwnerAI } from '../domain/ai-access';
import type { Namespace } from '../domain/model';
import {
  CHATGPT_USAGE_URL,
  connectLocalAI,
  localAIStatus,
  updateGPTConnection,
  type GPTConnectionStatus,
} from '../data/study-ai';
import './study-materials.css';
const message = (error: unknown) =>
  error instanceof Error ? error.message : '연결을 확인해 주세요.';
/** GPT connection is independent of the study ledger's exclusive writer. */
export function GPTConnectionPanel({
  userId,
  namespace = 'personal',
  busy = false,
  purpose = 'materials',
}: {
  userId: string;
  namespace?: Namespace;
  busy?: boolean;
  purpose?: 'materials' | 'memory';
}) {
  const owner = useMemo(() => ({ userId, namespace }), [userId, namespace]);
  const allowed = canUseOwnerAI(owner);
  const [connection, setConnection] = useState<GPTConnectionStatus | null>(null);
  const [connectionBusy, setConnectionBusy] = useState(false);
  const [creditsDisabled, setCreditsDisabled] = useState(false);
  const [model, setModel] = useState('');
  const [authorizationURL, setAuthorizationURL] = useState('');
  const [error, setError] = useState(''),
    [notice, setNotice] = useState('');
  useEffect(() => {
    if (!allowed) return;
    let alive = true;
    void localAIStatus(owner)
      .then((status) => {
        if (alive) {
          setConnection(status);
          setModel(status.model);
          setCreditsDisabled(status.creditsConfirmed);
        }
      })
      .catch((error) => {
        if (alive) setError(message(error));
      });
    return () => {
      alive = false;
    };
  }, [owner, allowed]);
  if (!allowed) return null;
  return (
    <section aria-label="GPT 연결 설정">
      {error && <ErrorState message={error} />}
      {notice && <p role="status">{notice}</p>}
      <div className="material-connection" aria-busy={connectionBusy}>
        <h2>GPT 연결</h2>
        <p>
          {connection?.configured
            ? `ChatGPT 연결됨 · ${connection.session.identity?.name || connection.session.identity?.email || '본인 계정'}`
            : purpose === 'memory'
              ? 'Study Space에 ChatGPT 구독을 연결해 목차와 주제로 암기항목을 만듭니다.'
              : 'ChatGPT 구독을 연결해 요약과 카드를 만듭니다.'}
        </p>
        <p>
          포함 사용량만 사용합니다. 추가 크레딧 사용 허용은 ChatGPT 설정에서 꺼 주세요. 이 앱은 그
          설정을 자동으로 조회하거나 변경할 수 없습니다.
        </p>
        <a href={CHATGPT_USAGE_URL} target="_blank" rel="noreferrer">
          ChatGPT 사용량 설정 열기
        </a>
        {connection?.local === false ? (
          <p>{connection.connectionError || '이 계정의 ChatGPT 연결을 확인하지 못했습니다. 녹음과 필기는 보관할 수 있습니다.'}</p>
        ) : (
          <>
            <div className="material-actions">
              <Button
                disabled={!connection || connectionBusy || connection.connecting || busy}
                onClick={async () => {
                  setConnectionBusy(true);
                  setError('');
                  try {
                    const result = await connectLocalAI(owner);
                    const url = new URL(result.authorizationURL);
                    if (url.origin !== 'https://auth.openai.com')
                      throw Error('공식 ChatGPT 연결 주소를 확인하지 못했습니다.');
                    setAuthorizationURL(url.href);
                    setConnection(await localAIStatus(owner));
                    setNotice('ChatGPT로 계속을 눌러 로그인과 구독 사용 권한을 허용해 주세요.');
                  } catch (error) {
                    setError(message(error));
                  } finally {
                    setConnectionBusy(false);
                  }
                }}
              >
                ChatGPT 연결 시작
              </Button>
              {authorizationURL && connection?.connecting && (
                <a href={authorizationURL} target="_blank" rel="noreferrer">
                  Continue with ChatGPT · ChatGPT로 계속
                </a>
              )}
              <Button
                disabled={!connection || connectionBusy || busy}
                onClick={async () => {
                  setConnectionBusy(true);
                  try {
                    let status = await localAIStatus(owner);
                    if (status.configured && !status.connecting)
                      status = await updateGPTConnection(owner, 'models');
                    setConnection(status);
                    setModel(status.model);
                    setCreditsDisabled(status.creditsConfirmed);
                    if (status.connectionError) throw Error(status.connectionError);
                    setNotice(
                      status.configured
                        ? 'ChatGPT 연결과 사용할 모델을 확인했습니다.'
                        : status.connecting
                          ? 'ChatGPT 로그인을 마친 뒤 다시 연결 확인을 눌러 주세요.'
                          : 'ChatGPT 연결 시작을 눌러 주세요.',
                    );
                  } catch (error) {
                    setError(message(error));
                  } finally {
                    setConnectionBusy(false);
                  }
                }}
              >
                연결 확인
              </Button>
              {connection?.connecting && (
                <Button
                  onClick={async () => {
                    try {
                      setConnection(await updateGPTConnection(owner, 'cancel-connect'));
                      setAuthorizationURL('');
                    } catch (error) {
                      setError(message(error));
                    }
                  }}
                >
                  연결 취소
                </Button>
              )}
              {connection?.configured && (
                <Button
                  disabled={connectionBusy || busy}
                  onClick={async () => {
                    try {
                      setConnection(await updateGPTConnection(owner, 'disconnect'));
                      setAuthorizationURL('');
                      setCreditsDisabled(false);
                    } catch (error) {
                      setError(message(error));
                    }
                  }}
                >
                  연결 해제
                </Button>
              )}
            </div>
            {connection?.configured && (
              <>
                <Select
                  label="GPT 모델"
                  value={model}
                  disabled={busy}
                  onChange={(event) => setModel(event.target.value)}
                >
                  {(connection.models ?? []).map((row) => (
                    <option key={row.slug} value={row.slug}>
                      {row.displayName}
                    </option>
                  ))}
                </Select>
                <Checkbox
                  label="추가 크레딧 사용 허용이 꺼져 있음을 확인했습니다"
                  checked={creditsDisabled}
                  disabled={busy}
                  onChange={(event) => setCreditsDisabled(event.target.checked)}
                />
                <Button
                  disabled={busy || connectionBusy || !model || !creditsDisabled}
                  onClick={async () => {
                    try {
                      setConnection(
                        await updateGPTConnection(owner, 'settings', { model, creditsDisabled }),
                      );
                      setNotice(
                        '선택한 GPT 모델과 크레딧 설정 확인을 반영했습니다. 확인은 한 시간 동안 유지됩니다.',
                      );
                    } catch (error) {
                      setError(message(error));
                    }
                  }}
                >
                  생성 설정 적용
                </Button>
                {purpose === 'materials' && <p>
                  녹음은 지금 사용하는 기기에서 받아씁니다. 확인한 전사문을 필기에 추가하면 선택한 내용만 GPT에 보냅니다.
                </p>}
              </>
            )}
          </>
        )}
      </div>
    </section>
  );
}
