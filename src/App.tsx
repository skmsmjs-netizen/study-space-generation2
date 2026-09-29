import { useEffect, useRef, useState } from "react";
import {
  Button,
  Input,
  Textarea,
  Select,
  Checkbox,
  Card,
  Modal,
  Toast,
  Breadcrumb,
  Search,
  EmptyState,
  ErrorState,
  LoadingState,
  NavigationBar,
  ContextMenu,
} from "./ui";
import type {
  AppState,
  Command,
  CommandContext,
  OutlineNode,
  NarrativeKind,
  StudyRecord,
} from "./domain/model";
import { readRescuedDraft, storeDraftSafely, clearRescuedDraft, draftHasUnstoredText, rescueWithoutOverwrite, draftReadError, rememberDraftReadError } from "./data/draft-safety";
import { validateFormDraft } from "./data/demo-repository";
import { useRoute, navigate as go } from "./ui/navigation-context";
import { TraceEditor } from "./ui/trace-editor";
import { CriteriaEditor } from "./ui/criteria-editor";
import { resolveCriteria } from "./domain/criteria";
import { OutlineTree } from "./ui/outline-tree";
import { TRACE_ITEMS } from "./domain/trace";
import {
  DemoRepository,
  localDay,
  readDraft,
  type FormDraft,
} from "./data/demo-repository";

type Action = Command extends infer C
  ? C extends Command
    ? Omit<C, keyof CommandContext>
    : never
  : never;
const uid = () => crypto.randomUUID();
const active = <T extends { deletedAt: string | null }>(items: T[]) =>
  items.filter((item) => !item.deletedAt);
const labelRole = { unit: "단원", outline: "목차", topic: "주제" };
function message(error: unknown) {
  return error instanceof Error
    ? error.message
    : "내용을 보존했습니다. 다시 시도해 주세요.";
}

function readPreference(name: string, fallback: string) {
  try { return sessionStorage.getItem(`study-space:demo:context:${name}`) ?? fallback; }
  catch { return fallback; }
}
function writePreference(name: string, value: string) {
  try { sessionStorage.setItem(`study-space:demo:context:${name}`, value); } catch { /* Optional view context never blocks a study draft. */ }
}

export default function App() {
  const [boot, setBoot] = useState<{
    repo: DemoRepository | null;
    error: string;
    loading: boolean;
  }>({ repo: null, error: "", loading: true });
  useEffect(() => {
    let disposed = false,
      release: (() => void) | undefined;
    if (!navigator.locks) {
      setBoot({
        repo: null,
        error:
          "이 브라우저에서는 시연 자료의 동시 쓰기를 안전하게 막을 수 없습니다. 최신 브라우저에서 열어 주세요.",
        loading: false,
      });
      return;
    }
    void navigator.locks
      .request(
        "study-space:demo:writer",
        { ifAvailable: true },
        async (lock) => {
          if (disposed) return;
          if (!lock) {
            setBoot({
              repo: null,
              error:
                "다른 창에서 시연 공간을 사용하고 있습니다. 그 창을 닫은 뒤 다시 열어 주세요. 저장된 자료는 그대로 남아 있습니다.",
              loading: false,
            });
            return;
          }
          try {
            setBoot({
              repo: new DemoRepository(localStorage),
              error: "",
              loading: false,
            });
          } catch (e) {
            setBoot({ repo: null, error: message(e), loading: false });
          }
          await new Promise<void>((resolve) => {
            release = resolve;
          });
        },
      )
      .catch((e) => {
        if (!disposed)
          setBoot({ repo: null, error: message(e), loading: false });
      });
    return () => {
      disposed = true;
      release?.();
    };
  }, []);
  if (boot.loading)
    return (
      <main className="boot">
        <LoadingState />
      </main>
    );
  if (!boot.repo)
    return (
      <main className="boot">
        <ErrorState
          title="시연 자료를 열지 못했습니다"
          message={boot.error}
          onRetry={() => location.reload()}
        />
      </main>
    );
  return <Workspace repository={boot.repo} />;
}
function Workspace({ repository }: { repository: DemoRepository }) {
  const [data, setData] = useState(repository.getSnapshot());
  const route = useRoute();
  const [scope, setScope] = useState(() => readPreference("scope", "all"));
  const [query, setQuery] = useState(() => readPreference("query", ""));
  const [error, setError] = useState("");
  const [notice, setNotice] = useState<{
    message: string;
    undo?: () => void;
  } | null>(null);
  const [dialog, setDialog] = useState<
    "semester" | "subject" | "node" | "trash" | "rename" | "move" | null
  >(null);
  const [name, setName] = useState("");
  const [moveParent, setMoveParent] = useState<string>("");
  const [role, setRole] = useState<OutlineNode["role"]>("topic");
  const [theme, setTheme] = useState(() => readPreference("theme", "auto"));
  const [recent, setRecent] = useState<string[]>(() => {
    try {
      return JSON.parse(sessionStorage.getItem("demo:recent") || "[]");
    } catch {
      return [];
    }
  });
  useEffect(() => { writePreference("scope", scope); }, [scope]);
  useEffect(() => { writePreference("query", query); }, [query]);
  useEffect(() => { writePreference("theme", theme); }, [theme]);
  const quickGuard = useRef(new Set<string>());
  const nodes = active(data.nodes),
    subjects = active(data.subjects);
  const node = nodes.find((n) => route === `/node/${n.id}`);
  const subject = subjects.find(
    (s) => route === `/subject/${s.id}` || s.id === node?.subjectId,
  );
  const shownSubjects = subjects.filter(
    (s) =>
      scope === "all" ||
      s.scope.kind === scope ||
      (s.scope.kind === "semester" && s.scope.semesterId === scope),
  );
  const shownNodes = nodes.filter((n) =>
    shownSubjects.some((s) => s.id === n.subjectId),
  );
  const topics = shownNodes.filter((n) => n.role === "topic");
  const records = active(data.records);
  const recentTopics = recent
    .map((id) => topics.find((t) => t.id === id))
    .filter(Boolean) as OutlineNode[];
  const topicPath = (id: string) => {
    const result: OutlineNode[] = [];
    let current = nodes.find((n) => n.id === id);
    while (current && result.length <= nodes.length) {
      result.unshift(current);
      current = nodes.find((n) => n.id === current!.parentId);
    }
    return result;
  };
  const commit = (action: Action, success?: string): AppState | null => {
    try {
      const next = repository.execute({
        ...action,
        opId: uid(),
        at: new Date().toISOString(),
        userId: data.userId,
        namespace: "demo",
      } as Command);
      setData(next);
      setError("");
      if (success) setNotice({ message: success });
      return next;
    } catch (e) {
      setError(message(e));
      return null;
    }
  };
  useEffect(() => {
    if (!node) return;
    setRecent((previous) => {
      const next = [node.id, ...previous.filter((id) => id !== node.id)].slice(
        0,
        6,
      );
      try {
        sessionStorage.setItem("demo:recent", JSON.stringify(next));
      } catch {}
      return next;
    });
  }, [node?.id]);
  useEffect(() => {
    if (theme === "auto") delete document.documentElement.dataset.theme;
    else document.documentElement.dataset.theme = theme;
  }, [theme]);
  const quickRecord = (target: OutlineNode) => {
    if (quickGuard.current.has(target.id)) return;
    quickGuard.current.add(target.id);
    const next = commit({
      type: "saveRecords",
      sessionId: uid(),
      entries: [{ targetId: target.id, done: true }],
      dateEvidence: { kind: "exact", date: localDay() },
    });
    if (!next) {
      quickGuard.current.delete(target.id);
      return;
    }
    const revision = [...next.revisions]
      .reverse()
      .find(
        (r) =>
          r.collection === "records" && r.entityId === next.records.at(-1)?.id,
      );
    setNotice({
      message: `‘${target.name}’ 공부함을 기록했습니다.`,
      undo: revision
        ? () => {
            const restored = commit(
              {
                type: "undoRevision",
                revisionId: revision.id,
                expectedVersion: revision.after.version,
              },
              "기록을 되돌렸습니다.",
            );
            if (restored) quickGuard.current.delete(target.id);
          }
        : undefined,
    });
  };
  const openDialog = (next: typeof dialog) => {
    setName(next === "rename" ? node?.name || "" : "");
    if (next === "move") setMoveParent(node?.parentId || "");
    setDialog(next);
  };
  const addItem = () => {
    let next: AppState | null = null;
    const id = uid();
    if (dialog === "semester") next = commit({ type: "addSemester", id, name });
    if (dialog === "subject")
      next = commit({
        type: "addSubject",
        id,
        name,
        scope:
          scope === "independent"
            ? { kind: "independent" }
            : scope === "all" || scope === "unassigned"
              ? { kind: "unassigned" }
              : { kind: "semester", semesterId: scope },
      });
    if (dialog === "node" && subject)
      next = commit({
        type: "addNode",
        id,
        name,
        role,
        subjectId: subject.id,
        parentId: node?.id || null,
      });
    if (dialog === "rename" && node)
      next = commit({
        type: "renameNode",
        id: node.id,
        name,
        expectedVersion: node.version,
      });
    if (next) {
      setDialog(null);
      setNotice({ message: "저장했습니다." });
      if (dialog === "semester") setScope(id);
      if (dialog === "subject") go(`/subject/${id}`);
    }
  };
  const descendants = (id: string): OutlineNode[] => {
    const found: OutlineNode[] = [], seen = new Set([id]), stack = [id];
    while (stack.length) {
      const parent = stack.pop();
      for (const child of nodes.filter(n => n.parentId === parent)) {
        if (!seen.has(child.id)) { seen.add(child.id); found.push(child); stack.push(child.id); }
      }
    }
    return found;
  };
  const moveNode = () => {
    if (!node) return;
    const next = commit({ type: "moveNode", id: node.id, parentId: moveParent || null, expectedVersion: node.version });
    if (!next) return;
    const revision = next.revisions.slice().reverse().find(r => r.collection === "nodes" && r.entityId === node.id);
    setDialog(null);
    setNotice({ message: "목차 위치를 옮겼습니다. 하위 항목과 기록은 같은 항목에 남습니다.", undo: revision ? () => {
      commit({ type: "undoRevision", revisionId: revision.id, expectedVersion: revision.after.version }, "원래 위치로 되돌렸습니다.");
    } : undefined });
  };
  const deleteNode = () => {
    if (!node) return;
    const id = node.id;
    const next = commit({
      type: "trashNode",
      id,
      expectedVersion: node.version,
    });
    if (next) {
      setDialog(null);
      go(`/subject/${node.subjectId}`);
      const after = next.nodes.find((n) => n.id === id)!;
      setNotice({
        message: "목차를 휴지통으로 옮겼습니다. 공부 기록은 남아 있습니다.",
        undo: () => {
          if (
            commit(
              { type: "restoreNode", id, expectedVersion: after.version },
              "목차를 복원했습니다.",
            )
          )
            go(`/node/${id}`);
        },
      });
    }
  };
  const navItems = [
    { href: "/", text: "오늘" },
    { href: "/subjects", text: "과목" },
    { href: "/record", text: "기록" },
    { href: "/search", text: "찾기" },
  ];
  const recordRoute = route.startsWith("/record");
  const freeRoute = route === "/free" || route.startsWith("/free/");
  const rootTitle =
    route === "/subjects"
      ? "공부할 범위"
      : route === "/search"
        ? "기억을 찾아서"
        : route === "/trash"
          ? "휴지통"
          : route.startsWith("/free")
            ? "자유롭게 남기기"
            : recordRoute
              ? "공부한 만큼 남기기"
              : "다시, 한 걸음";
  const tree = (parentId: string | null) => nodes.some(n => n.subjectId === subject?.id && n.parentId === parentId)
    ? <OutlineTree nodes={nodes} records={records} subjectId={subject!.id} subjectName={subject!.name} parentId={parentId} /> : null;
  return (
    <div className={`app-shell${route === "/" ? " is-home" : ""}`}>
      <aside className="sidebar">
        <a className="brand" href="#/">
          공부의 자리<span>LEARNING SPACE</span>
        </a>
        <NavigationBar label="주 메뉴" orientation="vertical" items={navItems.map(item => ({href:`#${item.href}`, label:item.text, active:route === item.href || item.href === "/record" && recordRoute || item.href === "/subjects" && Boolean(subject)}))} />
        <div className="sidebar-bottom">
          <a href="#/trash">휴지통</a>
          <Select
            label="화면 밝기"
            value={theme}
            onChange={(e) => setTheme(e.target.value)}
          >
            <option value="auto">기기 설정</option>
            <option value="light">밝게</option>
            <option value="dark">어둡게</option>
          </Select>
        </div>
      </aside>
      <div className="workspace">
        <div className="demo-banner">
          가짜 자료로 살펴보는 시연 공간 · 이 기기에만 저장됩니다
        </div>
        <header className="topbar">
          <span className="small-brand">공부의 자리</span>
          <Select
            label="학기와 공부 범위"
            value={scope}
            onChange={(e) => {
              setScope(e.target.value);
              if (subject) go("/subjects");
            }}
          >
            <option value="all">모든 공부</option>
            {active(data.semesters).map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
            <option value="independent">독립 공부</option>
            <option value="unassigned">학기 미지정</option>
          </Select>
          <Button variant="quiet" onClick={() => openDialog("semester")}>
            학기 추가
          </Button>
          <details className="compact-menu">
            <summary>더 보기</summary>
            <a href="#/trash">휴지통</a>
            <Select
              label="화면 밝기"
              value={theme}
              onChange={(e) => setTheme(e.target.value)}
            >
              <option value="auto">기기 설정</option>
              <option value="light">밝게</option>
              <option value="dark">어둡게</option>
            </Select>
          </details>
        </header>
        <main id="main" className="main-content">
          <Breadcrumb
            items={[
              { label: "오늘", href: "#/" },
              ...(subject
                ? [{ label: subject.name, href: `#/subject/${subject.id}` }]
                : []),
              ...(node
                ? topicPath(node.id).map((n) => ({
                    label: n.name,
                    href: `#/node/${n.id}`,
                  }))
                : route !== "/" && !subject
                  ? [{ label: rootTitle }]
                  : []),
            ]}
          />
          {error && <ErrorState title="저장하지 못했습니다" message={error} />}
          {notice && (!notice.undo || recordRoute) && (
            <div className="feedback-banner">
              <span role="status">{notice.message}</span>
              {notice.undo && (
                <Button
                  onClick={() => {
                    notice.undo?.();
                    setNotice(null);
                  }}
                >
                  되돌리기
                </Button>
              )}
              <Button
                variant="quiet"
                aria-label="알림 닫기"
                onClick={() => setNotice(null)}
              >
                닫기
              </Button>
            </div>
          )}
          <div className="page-heading">
            <div>
              <p className="eyebrow">
                {node
                  ? labelRole[node.role]
                  : subject
                    ? "과목"
                    : "나의 학습 공간"}
              </p>
              <h1>{node?.name || subject?.name || rootTitle}</h1>
            </div>
            {subject && !node && (
              <Button onClick={() => openDialog("node")}>목차 추가</Button>
            )}
          </div>
          {route === "/" && (
            <>
              <Card className="hero">
                <div>
                  <p className="eyebrow">오늘 남길 작은 변화</p>
                  <h2>공부했다면, 그 사실만으로도.</h2>
                  <p>
                    짧게 체크하고 돌아가도 됩니다.
                    <br />
                    생각이 있다면 같은 자리에서 이어 써 보세요.
                  </p>
                </div>
                <div className="actions">
                  <Button variant="primary" onClick={() => go("/record")}>
                    공부 기록하기
                  </Button>
                  <Button onClick={() => go("/free")}>자유롭게 쓰기</Button>
                </div>
              </Card>
              <div className="dashboard-grid">
                <section>
                  <div className="section-heading">
                    <h2>
                      {recentTopics.length
                        ? "이어서 볼 주제"
                        : "기록을 시작할 주제"}
                    </h2>
                    <a href="#/subjects">전체 범위</a>
                  </div>
                  <div className="card-stack">
                    {(recentTopics.length
                      ? recentTopics
                      : topics.slice(0, 3)
                    ).map((t) => (
                      <Card key={t.id} className="quick-topic">
                        <div>
                          <p className="muted">
                            {subjects.find((s) => s.id === t.subjectId)?.name}
                          </p>
                          <a className="topic-title" href={`#/node/${t.id}`}>
                            {t.name}
                          </a>
                        </div>
                        <Button
                          onClick={() =>
                            quickGuard.current.has(t.id)
                              ? go(`/record/${t.id}`)
                              : quickRecord(t)
                          }
                        >
                          {quickGuard.current.has(t.id) ? "새 기록" : "공부함"}
                        </Button>
                      </Card>
                    ))}
                  </div>
                </section>
                <section>
                  <h2>쌓인 기록</h2>
                  <Card className="summary-card">
                    <strong>
                      {
                        new Set(
                          records
                            .filter(
                              (r) =>
                                (r.done ||
                                  Object.values(r.trace).some(
                                    (t) =>
                                      t.status === "checked" ||
                                      (t.repeats?.length || 0) > 0,
                                  )) &&
                                shownSubjects.some(
                                  (subject) => subject.id === r.subjectId,
                                ),
                            )
                            .map((r) => r.sessionId),
                        ).size
                      }
                    </strong>
                    <span>공부를 남긴 회차</span>
                    <p className="muted">
                      체크는 해 보았다는 기록입니다.
                      <br />
                      이해나 독립 해결을 뜻하지 않습니다.
                    </p>
                    <hr />
                    <span>아직 기록이 없는 주제</span>
                    <b>
                      {
                        topics.filter(
                          (t) => !records.some((r) => r.targetId === t.id),
                        ).length
                      }
                      개
                    </b>
                  </Card>
                </section>
              </div>
            </>
          )}
          {route === "/subjects" && (
            <>
              <div className="actions">
                <Button variant="primary" onClick={() => openDialog("subject")}>
                  과목 추가
                </Button>
                <span className="muted">현재 선택한 범위에 추가됩니다.</span>
              </div>
              <div className="subject-grid">
                {shownSubjects.map((s) => (
                  <Card key={s.id}>
                    <p className="eyebrow">
                      {s.scope.kind === "semester"
                        ? data.semesters.find(
                            (x) =>
                              s.scope.kind === "semester" &&
                              x.id === s.scope.semesterId,
                          )?.name
                        : s.scope.kind === "independent"
                          ? "독립 공부"
                          : "학기 미지정"}
                    </p>
                    <h2>
                      <a href={`#/subject/${s.id}`}>{s.name}</a>
                    </h2>
                    <p className="muted">
                      {
                        nodes.filter(
                          (n) => n.subjectId === s.id && n.role === "topic",
                        ).length
                      }
                      개 주제
                    </p>
                  </Card>
                ))}
              </div>
              {!shownSubjects.length && (
                <EmptyState
                  title="새 과목을 담아 보세요"
                  message="교재나 강의에서 공부할 범위를 가져오면 됩니다."
                />
              )}
            </>
          )}
          {subject && !node && (
            <>
              <NarrativeEditor
                key={subject.id}
                data={data}
                kind="subject-overview"
                ownerId={subject.id}
                label="과목 개요"
                commit={commit}
              />
              <section className="section-space">
                <h2>목차</h2>
                {tree(null) || (
                  <EmptyState
                    title="목차가 아직 없습니다"
                    message="서로 다른 깊이로 단원과 주제를 추가할 수 있습니다."
                  />
                )}
              </section>
            </>
          )}
          {node && (
            <>
              <div className="actions">
                <Button
                  variant="primary"
                  onClick={() => go(`/record/${node.id}`)}
                >
                  공부 기록하기
                </Button>
                <ContextMenu targetLabel={node.name} label="목차 관리" items={[
                  {id:"add", label:"하위 항목 추가", onSelect:()=>openDialog("node")},
                  {id:"rename", label:"이름 수정", onSelect:()=>openDialog("rename")},
                  {id:"move", label:"위치 옮기기", onSelect:()=>openDialog("move")},
                  {id:"trash", label:"휴지통으로 이동", danger:true, onSelect:()=>openDialog("trash")},
                ]} />
              </div>
              <CriteriaEditor data={data} targetId={node.id}
                onApply={change => commit({type: "adjustCriteria", ...change}, "공부 기준을 조정했습니다.")}
                onUndo={(revisionId, expectedVersion) => commit({type: "undoRevision", revisionId, expectedVersion}, "기준 변경을 되돌렸습니다.")} />
              {tree(node.id)}
              <NarrativeEditor
                key={node.id}
                data={data}
                kind={node.role === "unit" ? "unit-introduction" : "topic-note"}
                ownerId={node.id}
                label={node.role === "unit" ? "단원 서문" : "주제 메모"}
                commit={commit}
              />
              <section className="section-space">
                <h2>공부 기록</h2>
                {records.filter((r) => r.targetId === node.id).length ? (
                  records
                    .filter((r) => r.targetId === node.id)
                    .slice()
                    .reverse()
                    .map((r) => (
                      <RecordCard key={r.id} record={r} commit={commit} allowNewWrittenReview={resolveCriteria(data, node.id).items.some(item => item.id === "Cself1" && item.mode !== "excluded")} />
                    ))
                ) : (
                  <EmptyState
                    title="첫 기록을 남길 자리입니다"
                    message="일부만 공부했거나 막혔어도 남길 수 있습니다."
                  />
                )}
              </section>
            </>
          )}
          {recordRoute && (
            <RecordForm
              key={route}
              data={data}
              initialTarget={route.startsWith("/record/") ? route.slice("/record/".length) : undefined}
              commit={commit}
              onSaved={(warning) => {
                setNotice({ message: warning || "공부 기록을 저장했습니다." });
                go("/");
              }}
            />
          )}
          {freeRoute && <FreeNotes key={route} data={data} route={route} commit={commit} />}
          {route === "/search" && (
            <>
              <Search
                label="과목·목차·기록 검색"
                placeholder="찾고 싶은 말"
                defaultValue={query}
                onQueryChange={setQuery}
              />
              <div className="card-stack section-space">
                {query.trim() ? (
                  <>
                    {shownSubjects
                      .filter((s) => s.name.includes(query) || active(data.narratives).some(n => n.ownerId === s.id && n.body.includes(query)))
                      .map((s) => (
                        <Card key={s.id}>
                          <a href={`#/subject/${s.id}`}>{s.name}</a>
                          <p className="muted">과목</p>
                        </Card>
                      ))}
                    {shownNodes
                      .filter(
                        (n) =>
                          n.name.includes(query) ||
                          active(data.narratives).some(text => text.ownerId === n.id && text.body.includes(query)) ||
                          records.some(
                            (r) =>
                              r.targetId === n.id && r.body.includes(query),
                          ),
                      )
                      .map((n) => (
                        <Card key={n.id}>
                          <a href={`#/node/${n.id}`}>{n.name}</a>
                          <p className="muted">
                            {subjects.find((s) => s.id === n.subjectId)?.name} · {topicPath(n.id).map(parent => parent.name).join(" / ")}
                          </p>
                        </Card>
                      ))}
                    {scope === "all" && active(data.narratives).filter(n => n.kind === "free-note" && n.ownerId === null && n.body.includes(query)).map(n => <Card key={n.id}>
                      <a href={`#/free/${n.id}`}>{n.body.trim().split("\n")[0].slice(0, 80) || "자유 기록"}</a>
                      <p className="muted">자유 기록 · 학기 소속 없음</p>
                    </Card>)}
                  </>
                ) : (
                  <EmptyState
                    title="어떤 내용을 찾으시나요?"
                    message="제목이나 기록에 남긴 말로 찾아보세요."
                  />
                )}
              </div>
            </>
          )}
          {route === "/trash" && (
            <>
              <p className="muted">
                목차를 복원하면 연결된 기록을 다시 볼 수 있습니다. 기록 본문은
                삭제하지 않았습니다.
              </p>
              {!data.nodes.some((n) => n.deletedAt) && (
                <EmptyState title="휴지통이 비어 있습니다" />
              )}
              {data.nodes
                .filter(
                  (n) =>
                    n.deletedAt &&
                    !data.nodes.find((parent) => parent.id === n.parentId)
                      ?.deletedAt,
                )
                .map((n) => (
                  <Card className="quick-topic" key={n.id}>
                    <span>{n.name}</span>
                    <Button
                      onClick={() =>
                        commit(
                          {
                            type: "restoreNode",
                            id: n.id,
                            expectedVersion: n.version,
                          },
                          "목차를 복원했습니다.",
                        )
                      }
                    >
                      복원
                    </Button>
                  </Card>
                ))}
            </>
          )}
          {!["/", "/subjects", "/search", "/trash", "/free"].includes(route) &&
            !recordRoute &&
            !freeRoute &&
            !subject && (
              <EmptyState
                title="이 항목을 찾을 수 없습니다"
                message="휴지통으로 이동했거나 현재 자료에 없는 항목입니다."
              >
                <Button onClick={() => go("/subjects")}>
                  과목으로 돌아가기
                </Button>
              </EmptyState>
            )}
        </main>
        <NavigationBar label="빠른 이동" className="bottom-nav" items={navItems.map(item => ({href:`#${item.href}`, label:item.text, active:route === item.href || item.href === "/record" && recordRoute || item.href === "/subjects" && Boolean(subject)}))} />
      </div>
      <Modal
        open={Boolean(dialog)}
        title={
          dialog === "semester"
            ? "학기 추가"
            : dialog === "subject"
              ? "과목 추가"
              : dialog === "move"
                ? "목차 위치 옮기기"
              : dialog === "rename"
                ? "이름 수정"
                : dialog === "trash"
                  ? "휴지통으로 옮길까요?"
                  : "목차 추가"
        }
        onClose={() => setDialog(null)}
      >
        {dialog === "move" && node ? (
          <div className="field-stack">
            <p>‘{node.name}’와 하위 {descendants(node.id).length}개 항목을 같은 과목 안에서 옮깁니다. 공부 기록과 메모는 그대로 연결됩니다.</p>
            <Select label="옮길 상위 항목" value={moveParent} onChange={e => setMoveParent(e.target.value)}>
              <option value="">{subject?.name} · 과목 바로 아래</option>
              {nodes.filter(candidate => candidate.subjectId === node.subjectId && candidate.id !== node.id && !descendants(node.id).some(child => child.id === candidate.id)).map(candidate => <option key={candidate.id} value={candidate.id}>{topicPath(candidate.id).map(parent => parent.name).join(" / ")}</option>)}
            </Select>
            <Button variant="primary" disabled={moveParent === (node.parentId || "")} onClick={moveNode}>이 위치로 옮기기</Button>
          </div>
        ) : dialog === "trash" && node ? (
          <>
            <p>
              ‘{node.name}’와 하위 {descendants(node.id).length}개 항목이
              탐색에서 숨겨집니다. 공부 기록은 남고, 휴지통에서 목차를 복원할 수
              있습니다.
            </p>
            <Button variant="danger" onClick={deleteNode}>
              목차를 휴지통으로 이동
            </Button>
          </>
        ) : (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              addItem();
            }}
          >
            <div className="field-stack">
              <Input
                label="이름"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
              {dialog === "node" && (
                <Select
                  label="항목 종류"
                  value={role}
                  onChange={(e) =>
                    setRole(e.target.value as OutlineNode["role"])
                  }
                >
                  <option value="topic">주제</option>
                  <option value="outline">목차</option>
                  <option value="unit">단원</option>
                </Select>
              )}
              {dialog === "subject" && scope === "all" && (
                <p className="muted">
                  ‘학기 미지정’에 추가됩니다. 학기에 넣으려면 상단 범위를 먼저
                  선택하세요.
                </p>
              )}
              <Button type="submit" variant="primary">
                {dialog === "rename" ? "이름 저장" : "추가하기"}
              </Button>
            </div>
          </form>
        )}
      </Modal>
      {notice?.undo && !recordRoute && (
        <Toast
          message={notice.message}
          onUndo={
            notice.undo
              ? () => {
                  notice.undo?.();
                  setNotice(null);
                }
              : undefined
          }
          onClose={() => setNotice(null)}
        />
      )}
    </div>
  );
}

type Commit = (action: Action, success?: string) => AppState | null;
function useTextDraft(key: string, initial: string, version: number) {
  const [boot] = useState(() => {
    try {
      const raw = readRescuedDraft(key) ?? localStorage.getItem(key);
      if (!raw) return { body: initial, version, error: "" };
      const draft = JSON.parse(raw);
      if (
        typeof draft.body !== "string" ||
        !Number.isSafeInteger(draft.version)
      )
        throw Error();
      return { ...draft, error: draftReadError(key) } as {
        body: string;
        version: number;
        error: string;
      };
    } catch {
      rememberDraftReadError(key, "초안을 읽지 못했습니다. 저장된 초안을 덮어쓰지 않았습니다.");
      return {
        body: initial,
        version,
        error: "초안을 읽지 못했습니다. 저장된 초안을 덮어쓰지 않았습니다.",
      };
    }
  });
  const [body, setBody] = useState(boot.body),
    [error, setError] = useState(boot.error || (draftHasUnstoredText(key) ? "저장 실패한 입력을 이 창에서 유지하고 있습니다. 다시 저장하거나 복사해 주세요." : ""));
  const expected = useRef(boot.version);
  const change = (value: string) => {
    setBody(value);
    if (boot.error) { rescueWithoutOverwrite(key, JSON.stringify({body: value, version: expected.current})); return; }
    try {
      storeDraftSafely(
        key,
        JSON.stringify({ body: value, version: expected.current }),
      );
      setError("");
    } catch {
      setError(
        "초안을 저장하지 못했습니다. 화면을 닫기 전에 입력을 복사해 주세요.",
      );
    }
  };
  const clear = (nextVersion: number) => {
    expected.current = nextVersion;
    clearRescuedDraft(key);
    try {
      localStorage.removeItem(key);
      setError("");
    } catch {
      setError("저장했지만 이전 초안 정리를 못했습니다.");
    }
  };
  return { body, change, error, blocked: Boolean(boot.error), expected, clear };
}
function NarrativeEditor({
  data,
  kind,
  ownerId,
  label,
  commit,
  narrativeId,
  newNote = false,
  onSaved,
  draftKey,
}: {
  data: AppState;
  kind: NarrativeKind;
  ownerId: string | null;
  label: string;
  commit: Commit;
  narrativeId?: string;
  newNote?: boolean;
  onSaved?: (id: string) => void;
  draftKey?: string;
}) {
  const original = active(data.narratives).find(
    (n) => !newNote && (narrativeId ? n.id === narrativeId : n.kind === kind && n.ownerId === ownerId),
  );
  const draft = useTextDraft(
    draftKey || `study-space:demo:narrative:${kind}:${ownerId}`,
    original?.body || "",
    original?.version || 0,
  );
  const [saved, setSaved] = useState(false);
  const stableId = useRef(original?.id || narrativeId || uid());
  const save = () => {
    const result = commit(
      {
        type: "updateNarrative",
        id: stableId.current,
        kind,
        ownerId,
        body: draft.body,
        expectedVersion: draft.expected.current,
      },
      `${label}을 저장했습니다.`,
    );
    if (result) {
      draft.clear(
        result.narratives.find((n) => n.id === stableId.current)!.version,
      );
      setSaved(true);
      onSaved?.(stableId.current);
    }
  };
  return (
    <details className="narrative-editor" open={kind === "free-note"}>
      <summary>
        {label}
        {original?.body ? " · 작성한 내용 있음" : " · 선택"}
      </summary>
      <div className="field-stack">
        <Textarea
          label={label}
          value={draft.body}
          onChange={(e) => {
            draft.change(e.target.value);
            setSaved(false);
          }}
          rows={kind === "free-note" ? 10 : 4}
          placeholder="자신의 말로 자유롭게 남겨 보세요."
        />
        <p className="muted">
          {saved
            ? "이 기기에 저장했습니다."
            : "입력은 이 기기의 초안으로 보관됩니다. 내용 저장을 누르면 수정 이력에 남습니다."}
        </p>
        {draft.error && <ErrorState message={draft.error} />}
        <Button disabled={draft.blocked} onClick={save}>
          내용 저장
        </Button>
      </div>
    </details>
  );
}
function FreeNotes({ data, route, commit }: { data: AppState; route: string; commit: Commit }) {
  const notes = active(data.narratives).filter(n => n.kind === "free-note" && n.ownerId === null);
  const [legacy] = useState(() => {
    try {
      const key = "study-space:demo:free-default-id";
      const existing = localStorage.getItem(key);
      const id = existing || notes[0]?.id || uid();
      if (!id.trim()) throw new Error();
      if (!existing) localStorage.setItem(key, id);
      return { id, error: "" };
    } catch { return { id: "", error: "자유 기록의 연결을 보관하지 못했습니다. 기존 초안을 남겨 두었습니다." }; }
  });
  const id = route === "/free" ? legacy.id : route.slice("/free/".length);
  const creating = route === "/free/new";
  const selected = notes.find(n => n.id === id);
  if (legacy.error) return <ErrorState message={legacy.error} />;
  return <>
    <div className="actions">
      <Button onClick={() => go("/free/new")}>새 자유 기록</Button>
      {route !== "/free" && <a href="#/free">자유 기록 목록</a>}
    </div>
    {route !== "/free" && id !== legacy.id && !creating && !selected
      ? <EmptyState title="이 자유 기록을 찾을 수 없습니다" />
      : <NarrativeEditor data={data} kind="free-note" ownerId={null} label="자유 기록" commit={commit}
          narrativeId={creating ? undefined : id} newNote={creating}
          draftKey={creating ? "study-space:demo:narrative:free-note:new" : id === legacy.id ? "study-space:demo:narrative:free-note:null" : `study-space:demo:narrative:free-note:id:${id}`}
          onSaved={creating ? savedId => go(`/free/${savedId}`) : undefined} />}
    <section className="section-space" aria-label="저장한 자유 기록">
      <h2>저장한 자유 기록</h2>
      <p className="muted">생각을 저장해도 공부 회차는 늘어나지 않습니다. 새 기록의 초안은 ‘새 자유 기록’에서 이어 씁니다.</p>
      <div className="card-stack">{notes.slice().reverse().map(note => <Card key={note.id}>
        <a href={`#/free/${note.id}`} aria-current={selected?.id === note.id ? "page" : undefined}>
          {note.body.trim().split("\n")[0].slice(0, 80) || "내용 없이 남긴 자유 기록"}
        </a>
        <small>{new Date(note.updatedAt).toLocaleString("ko-KR")}</small>
      </Card>)}</div>
    </section>
  </>;
}

function RecordForm({
  data,
  initialTarget,
  commit,
  onSaved,
}: {
  data: AppState;
  initialTarget?: string;
  commit: Commit;
  onSaved: (warning?: string) => void;
}) {
  const key = initialTarget || "multiple";
  const [boot] = useState(() => {
    try {
      const storageKey = `study-space:demo:draft:${key}`;
      const rescued = readRescuedDraft(storageKey);
      if (rescued) { const draft = JSON.parse(rescued); validateFormDraft(draft, key); return { draft, error: draftReadError(storageKey) }; }
      return { draft: readDraft(localStorage, key), error: draftReadError(storageKey) };
    } catch (e) {
      rememberDraftReadError(`study-space:demo:draft:${key}`, message(e));
      return { draft: null, error: message(e) };
    }
  });
  const [form, setForm] = useState<FormDraft>(
    () =>
      boot.draft || {
        key,
        sessionId: uid(),
        selectedIds: initialTarget ? [initialTarget] : [],
        bodies: {},
        done: initialTarget ? { [initialTarget]: true } : {},
        trace: {},
        dateEvidence: { kind: "exact", date: localDay() },
      },
  );
  const currentForm = useRef(form);
  const [draftError, setDraftError] = useState(boot.error || (draftHasUnstoredText(`study-space:demo:draft:${key}`) ? "저장에 실패한 입력을 이 창에서 유지합니다. 다시 저장하거나 복사해 주세요." : ""));
  const [filter, setFilter] = useState("");
  const guard = useRef(false);
  const nodes = active(data.nodes).filter(
    (n) => n.role === "topic" || n.id === initialTarget,
  );
  const change = (next: FormDraft) => {
    currentForm.current = next;
    setForm(next);
    const storageKey = `study-space:demo:draft:${key}`;
    if (boot.error) { rescueWithoutOverwrite(storageKey, JSON.stringify(next)); return; }
    try {
      validateFormDraft(next, key);
      storeDraftSafely(storageKey, JSON.stringify(next));
      setDraftError("");
    } catch {
      setDraftError(
        "초안을 보관하지 못했습니다. 화면을 닫기 전에 입력을 복사해 주세요.",
      );
    }
  };
  const select = (id: string, checked: boolean) =>
    change({
      ...form,
      selectedIds: checked
        ? [...form.selectedIds, id]
        : form.selectedIds.filter((x) => x !== id),
      done: checked ? { ...form.done, [id]: form.done[id] ?? true } : form.done,
    });
  const submit = () => {
    if (guard.current || boot.error) return;
    guard.current = true;
    const form = currentForm.current;
    const next = commit({
      type: "saveRecords",
      sessionId: form.sessionId,
      dateEvidence: form.dateEvidence,
      entries: form.selectedIds.map((id) => ({
        targetId: id,
        done: form.done[id] ?? true,
        body: form.bodies[id] || "",
        trace: form.trace[id] || {},
      })),
    });
    if (next) {
      let warning: string | undefined;
      clearRescuedDraft(`study-space:demo:draft:${key}`);
      try {
        localStorage.removeItem(`study-space:demo:draft:${key}`);
      } catch {
        warning =
          "기록은 저장했습니다. 초안 정리에 실패해 이전 초안이 남아 있을 수 있습니다.";
      }
      onSaved(warning);
    } else guard.current = false;
  };
  return (
    <div className="record-layout">
      <section className="topic-picker">
        <h2>공부한 주제</h2>
        <Search label="주제 찾기" onQueryChange={setFilter} />
        {nodes
          .filter((n) => n.name.includes(filter))
          .map((n) => (
            <Checkbox
              key={n.id}
              label={
                <>
                  <span>{n.name}</span>
                  <small>
                    {data.subjects.find((s) => s.id === n.subjectId)?.name}
                  </small>
                </>
              }
              checked={form.selectedIds.includes(n.id)}
              onChange={(e) => select(n.id, e.target.checked)}
            />
          ))}
      </section>
      <section className="record-compose">
        <p className="muted">
          내용 없이 저장해도 됩니다. 일부만 했거나 막힌 것도 공부한 기록입니다.
        </p>
        {form.selectedIds.length > 1 && (
          <Button
            onClick={() =>
              change({
                ...form,
                done: {
                  ...form.done,
                  ...Object.fromEntries(
                    form.selectedIds.map((id) => [id, true]),
                  ),
                },
              })
            }
          >
            선택한 주제 모두 공부함
          </Button>
        )}
        {form.selectedIds.map((id) => (
          <Card key={id} className="record-entry">
            <h2>
              {nodes.find((n) => n.id === id)?.name || "현재 목록에 없는 주제"}
            </h2>
            <Checkbox
              label="공부함"
              checked={form.done[id] ?? true}
              onChange={(e) =>
                change({
                  ...form,
                  done: { ...form.done, [id]: e.target.checked },
                })
              }
            />
            <Textarea
              label="남길 생각 · 선택"
              value={form.bodies[id] || ""}
              rows={3}
              onChange={(e) =>
                change({
                  ...form,
                  bodies: { ...form.bodies, [id]: e.target.value },
                })
              }
              placeholder="짧은 메모, 막힌 점, 긴 생각 모두 괜찮습니다."
            />
            <TraceEditor
              definitions={data.nodes.some(node => node.id === id) ? resolveCriteria(data, id).items : undefined}
              trace={form.trace[id] || {}}
              onChange={(trace) =>
                change({ ...form, trace: { ...form.trace, [id]: trace } })
              }
            />
          </Card>
        ))}
        {!form.selectedIds.length && (
          <EmptyState
            title="주제를 고르면 바로 기록할 수 있습니다"
            message="여러 주제를 함께 골라도 글과 체크는 각 주제에 남습니다."
          />
        )}
        <details className="date-details">
          <summary>
            공부한 때 ·{" "}
            {form.dateEvidence.kind === "exact"
              ? form.dateEvidence.date
              : form.dateEvidence.kind === "range"
                ? "기간"
                : "정확히 모름"}
          </summary>
          <Select
            label="날짜 정밀도"
            value={form.dateEvidence.kind}
            onChange={(e) =>
              change({
                ...form,
                dateEvidence:
                  e.target.value === "unknown"
                    ? { kind: "unknown" }
                    : e.target.value === "range"
                      ? { kind: "range", from: localDay(), to: localDay() }
                      : { kind: "exact", date: localDay() },
              })
            }
          >
            <option value="exact">하루</option>
            <option value="range">기간</option>
            <option value="unknown">정확히 모름</option>
          </Select>
          {form.dateEvidence.kind === "exact" && (
            <Input
              label="공부한 날짜"
              type="date"
              value={form.dateEvidence.date}
              onChange={(e) =>
                change({
                  ...form,
                  dateEvidence: { kind: "exact", date: e.target.value },
                })
              }
            />
          )}{" "}
          {form.dateEvidence.kind === "range" && (
            <>
              <Input
                label="기간 시작"
                type="date"
                value={form.dateEvidence.from}
                onChange={(e) => {
                  if (form.dateEvidence.kind === "range")
                    change({
                      ...form,
                      dateEvidence: {
                        ...form.dateEvidence,
                        from: e.target.value,
                      },
                    });
                }}
              />
              <Input
                label="기간 끝"
                type="date"
                value={form.dateEvidence.to}
                onChange={(e) => {
                  if (form.dateEvidence.kind === "range")
                    change({
                      ...form,
                      dateEvidence: {
                        ...form.dateEvidence,
                        to: e.target.value,
                      },
                    });
                }}
              />
            </>
          )}
        </details>
        {draftError && <ErrorState message={draftError} />}
        <div className="save-bar">
          <span className="muted">
            {boot.draft
              ? "이 기기의 초안을 이어 쓰고 있습니다."
              : "이 기기에 초안을 보관합니다."}
          </span>
          <Button
            variant="primary"
            disabled={!form.selectedIds.length || Boolean(boot.error)}
            onClick={submit}
          >
            {form.selectedIds.length
              ? `${form.selectedIds.length}개 주제 기록 저장`
              : "주제를 선택해 주세요"}
          </Button>
        </div>
      </section>
    </div>
  );
}
function RecordCard({
  record,
  commit,
  allowNewWrittenReview,
}: {
  record: StudyRecord;
  commit: Commit;
  allowNewWrittenReview: boolean;
}) {
  const body = useTextDraft(
    `study-space:demo:record:${record.id}`,
    record.body,
    record.version,
  );
  const review = record.trace.Cself1?.examReview;
  const answer = useTextDraft(
    `study-space:demo:review:${record.id}`,
    review?.answer || "",
    record.version,
  );
  const [editing, setEditing] = useState(body.body !== record.body);
  return (
    <Card className="record-card">
      <p className="eyebrow">
        {record.dateEvidence.kind === "exact"
          ? record.dateEvidence.date
          : record.dateEvidence.kind === "range"
            ? `${record.dateEvidence.from} ~ ${record.dateEvidence.to}`
            : "날짜 미상"}{" "}
        ·{" "}
        {record.done
          ? "공부함"
          : Object.values(record.trace).some((t) => t.status === "checked")
            ? "공부 방법 체크"
            : "생각만 남김"}
      </p>
      {editing ? (
        <>
          <Textarea
            label="기록 수정"
            value={body.body}
            onChange={(e) => body.change(e.target.value)}
          />
          <Button
            disabled={body.blocked}
            onClick={() => {
              const result = commit(
                {
                  type: "updateRecord",
                  id: record.id,
                  expectedVersion: body.expected.current,
                  patch: { body: body.body },
                },
                "기록을 수정했습니다.",
              );
              if (result) {
                const updated = result.records.find((r) => r.id === record.id)!;
                body.clear(updated.version);
                answer.expected.current = updated.version;
                setEditing(false);
              }
            }}
          >
            수정 저장
          </Button>
          <Button variant="quiet" onClick={() => setEditing(false)}>
            초안 두고 닫기
          </Button>
        </>
      ) : (
        <>
          <p className="prose">
            {record.body || "본문 없이 공부한 사실을 남겼습니다."}
          </p>
          <Button variant="quiet" onClick={() => setEditing(true)}>
            기록 수정
          </Button>
        </>
      )}
      {body.error && <ErrorState message={body.error} />}
      <details>
        <summary>남긴 체크와 시험 전 서술 점검</summary>
        <p>
          {Object.entries(record.trace)
            .filter(([, value]) => value.status === "checked")
            .map(
              ([id, value]) => value.definition?.label || TRACE_ITEMS.find((item) => item.id === id)?.label || id,
            )
            .join(" · ") || "선택한 공부 방법이 없습니다."}
        </p>
        {Object.entries(record.trace).map(([id, item]) => <details key={id}>
          <summary>{item.definition?.label || TRACE_ITEMS.find(value => value.id === id)?.label || `이전 항목 (${id})`} · {{checked:"체크함",unchecked:"미체크",na:"해당 없음",deferred:"보류"}[item.status]}</summary>
          {item.note !== undefined && <p className="prose">{item.note}</p>}
          {item.repeats?.map(repeat => <div key={repeat.id}>
            <p>{repeat.kind === "unknown" ? "반복 횟수 모름" : `${repeat.kind === "minimum" ? "최소 " : ""}${repeat.count}회 반복`}</p>
            {repeat.note !== undefined && <p className="prose">{repeat.note}</p>}
          </div>)}
        </details>)}
        {(allowNewWrittenReview || record.trace.Cself1 || answer.body) && <>
        <Textarea
          label="시험 전, 자신의 문장으로 설명하기"
          value={answer.body}
          onChange={(e) => answer.change(e.target.value)}
        />
        <Button
          disabled={answer.blocked}
          onClick={() => {
            const result = commit(
              {
                type: "editWrittenReview",
                recordId: record.id,
                expectedVersion: answer.expected.current,
                answer: answer.body,
              },
              "서술을 저장했습니다. 점검 체크는 다시 열었습니다.",
            );
            if (result) {
              const updated = result.records.find((r) => r.id === record.id)!;
              answer.clear(updated.version);
              body.expected.current = updated.version;
            }
          }}
        >
          서술 저장
        </Button>
        <Checkbox
          label="서술을 남기고 점검함"
          checked={Boolean(review?.checked)}
          disabled={!review?.answer.trim() || answer.body !== review.answer}
          onChange={() => {
            const result = commit(
              {
                type: review?.checked
                  ? "unconfirmWrittenReview"
                  : "confirmWrittenReview",
                recordId: record.id,
                expectedVersion: record.version,
              },
              review?.checked
                ? "점검만 해제했습니다. 서술은 남아 있습니다."
                : "서술 점검을 기록했습니다.",
            );
            if (result) {
              const updated = result.records.find((r) => r.id === record.id)!;
              body.expected.current = updated.version;
              answer.expected.current = updated.version;
            }
          }}
        />
        {answer.error && <ErrorState message={answer.error} />}
        <p className="muted">
          서술 점검은 실제 정확성이나 목표 달성과 별개입니다.
        </p>
        </>}
      </details>
    </Card>
  );
}
