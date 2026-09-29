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
} from "./ui";
import type {
  AppState,
  Command,
  CommandContext,
  OutlineNode,
  NarrativeKind,
  StudyRecord,
  TraceState,
} from "./domain/model";
import { TRACE_ITEMS, TRACE_GROUP_LABELS } from "./domain/trace";
import {
  DemoRepository,
  localDay,
  readDraft,
  saveDraft,
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
const routeNow = () => decodeURIComponent(location.hash.slice(1) || "/");
const go = (path: string) => {
  location.hash = encodeURI(path);
};
function useRoute() {
  const [route, setRoute] = useState(routeNow);
  useEffect(() => {
    const update = () => setRoute(routeNow());
    addEventListener("hashchange", update);
    return () => removeEventListener("hashchange", update);
  }, []);
  return route;
}
function message(error: unknown) {
  return error instanceof Error
    ? error.message
    : "내용을 보존했습니다. 다시 시도해 주세요.";
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
  const [scope, setScope] = useState("all");
  const [query, setQuery] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState<{
    message: string;
    undo?: () => void;
  } | null>(null);
  const [dialog, setDialog] = useState<
    "semester" | "subject" | "node" | "trash" | "rename" | null
  >(null);
  const [name, setName] = useState("");
  const [role, setRole] = useState<OutlineNode["role"]>("topic");
  const [theme, setTheme] = useState("auto");
  const [recent, setRecent] = useState<string[]>(() => {
    try {
      return JSON.parse(sessionStorage.getItem("demo:recent") || "[]");
    } catch {
      return [];
    }
  });
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
    const children = nodes.filter((n) => n.parentId === id);
    return children.flatMap((child) => [child, ...descendants(child.id)]);
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
  const rootTitle =
    route === "/subjects"
      ? "공부할 범위"
      : route === "/search"
        ? "기억을 찾아서"
        : route === "/trash"
          ? "휴지통"
          : route === "/free"
            ? "자유롭게 남기기"
            : recordRoute
              ? "공부한 만큼 남기기"
              : "다시, 한 걸음";
  const tree = (parentId: string | null, depth = 0): React.ReactNode => {
    const children = nodes
      .filter((n) => n.subjectId === subject?.id && n.parentId === parentId)
      .sort((a, b) => a.order - b.order);
    return children.length ? (
      <ul className="outline-list">
        {children.map((n) => (
          <li key={n.id}>
            <a className={`node-link role-${n.role}`} href={`#/node/${n.id}`}>
              <span className="role-label">{labelRole[n.role]}</span>
              <span>{n.name}</span>
              <span className="row-tail">
                {records.filter((r) => r.targetId === n.id && r.done).length ||
                  "—"}
              </span>
            </a>
            {depth < 8
              ? tree(n.id, depth + 1)
              : nodes.some((child) => child.parentId === n.id) && (
                  <a className="node-link" href={`#/node/${n.id}`}>
                    하위 항목 펼쳐 보기
                  </a>
                )}
          </li>
        ))}
      </ul>
    ) : null;
  };
  return (
    <div className="app-shell">
      <aside className="sidebar">
        <a className="brand" href="#/">
          공부의 자리<span>LEARNING SPACE</span>
        </a>
        <nav aria-label="주 메뉴">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={`#${item.href}`}
              aria-current={route === item.href ? "page" : undefined}
            >
              {item.text}
            </a>
          ))}
        </nav>
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
                <details className="menu-details">
                  <summary>목차 관리</summary>
                  <div className="actions">
                    <Button onClick={() => openDialog("node")}>
                      하위 항목 추가
                    </Button>
                    <Button onClick={() => openDialog("rename")}>
                      이름 수정
                    </Button>
                    <Button
                      variant="danger"
                      onClick={() => openDialog("trash")}
                    >
                      휴지통으로 이동
                    </Button>
                  </div>
                </details>
              </div>
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
                      <RecordCard key={r.id} record={r} commit={commit} />
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
              initialTarget={route.split("/")[2]}
              commit={commit}
              onSaved={(warning) => {
                setNotice({ message: warning || "공부 기록을 저장했습니다." });
                go("/");
              }}
            />
          )}
          {route === "/free" && (
            <NarrativeEditor
              data={data}
              kind="free-note"
              ownerId={null}
              label="자유 기록"
              commit={commit}
            />
          )}
          {route === "/search" && (
            <>
              <Search
                label="과목·목차·기록 검색"
                placeholder="찾고 싶은 말"
                onQueryChange={setQuery}
              />
              <div className="card-stack section-space">
                {query.trim() ? (
                  <>
                    {shownSubjects
                      .filter((s) => s.name.includes(query))
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
                          records.some(
                            (r) =>
                              r.targetId === n.id && r.body.includes(query),
                          ),
                      )
                      .map((n) => (
                        <Card key={n.id}>
                          <a href={`#/node/${n.id}`}>{n.name}</a>
                          <p className="muted">
                            {subjects.find((s) => s.id === n.subjectId)?.name} ·{" "}
                            {labelRole[n.role]}
                          </p>
                        </Card>
                      ))}
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
        <nav className="bottom-nav" aria-label="빠른 이동">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={`#${item.href}`}
              aria-current={route === item.href ? "page" : undefined}
            >
              {item.text}
            </a>
          ))}
        </nav>
      </div>
      <Modal
        open={Boolean(dialog)}
        title={
          dialog === "semester"
            ? "학기 추가"
            : dialog === "subject"
              ? "과목 추가"
              : dialog === "rename"
                ? "이름 수정"
                : dialog === "trash"
                  ? "휴지통으로 옮길까요?"
                  : "목차 추가"
        }
        onClose={() => setDialog(null)}
      >
        {dialog === "trash" && node ? (
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
      const raw = localStorage.getItem(key);
      if (!raw) return { body: initial, version, error: "" };
      const draft = JSON.parse(raw);
      if (
        typeof draft.body !== "string" ||
        !Number.isSafeInteger(draft.version)
      )
        throw Error();
      return { ...draft, error: "" } as {
        body: string;
        version: number;
        error: string;
      };
    } catch {
      return {
        body: initial,
        version,
        error: "초안을 읽지 못했습니다. 저장된 초안을 덮어쓰지 않았습니다.",
      };
    }
  });
  const [body, setBody] = useState(boot.body),
    [error, setError] = useState(boot.error);
  const expected = useRef(boot.version);
  const change = (value: string) => {
    setBody(value);
    if (boot.error) return;
    try {
      localStorage.setItem(
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
}: {
  data: AppState;
  kind: NarrativeKind;
  ownerId: string | null;
  label: string;
  commit: Commit;
}) {
  const original = active(data.narratives).find(
    (n) => n.kind === kind && n.ownerId === ownerId,
  );
  const draft = useTextDraft(
    `study-space:demo:narrative:${kind}:${ownerId}`,
    original?.body || "",
    original?.version || 0,
  );
  const [saved, setSaved] = useState(false);
  const stableId = useRef(original?.id || uid());
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
        result.narratives.find((n) => n.kind === kind && n.ownerId === ownerId)!
          .version,
      );
      setSaved(true);
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
      return { draft: readDraft(localStorage, key), error: "" };
    } catch (e) {
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
  const [draftError, setDraftError] = useState(boot.error);
  const [filter, setFilter] = useState("");
  const guard = useRef(false);
  const nodes = active(data.nodes).filter(
    (n) => n.role === "topic" || n.id === initialTarget,
  );
  const change = (next: FormDraft) => {
    currentForm.current = next;
    setForm(next);
    if (boot.error) return;
    try {
      saveDraft(localStorage, next);
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
function TraceEditor({
  trace,
  onChange,
}: {
  trace: TraceState;
  onChange: (state: TraceState) => void;
}) {
  return (
    <details className="trace-editor">
      <summary>공부 방법과 체크 · 선택</summary>
      <p className="muted">
        순서 없이 필요한 것을 골라 해 보세요. 체크는 일부 시도와 막힘도
        포함합니다.
      </p>
      {Object.entries(TRACE_GROUP_LABELS).map(([group, label]) => (
        <fieldset key={group}>
          <legend>{label}</legend>
          {TRACE_ITEMS.filter((item) => item.group === group).map((item) => (
            <div key={item.id}>
              <Checkbox
                label={item.label}
                checked={trace[item.id]?.status === "checked"}
                onChange={(e) =>
                  onChange({
                    ...trace,
                    [item.id]: {
                      ...trace[item.id],
                      status: e.target.checked ? "checked" : "unchecked",
                      definition: {
                        id: item.id,
                        group: item.group,
                        label: item.label,
                        version: 1,
                        mode: item.mode,
                      },
                    },
                  })
                }
              />
              <p className="trace-hint">{item.question}</p>
            </div>
          ))}
        </fieldset>
      ))}
      <details>
        <summary>TRACE 공부 방법 안내</summary>
        <p>
          흐름 조망(T), 실효 정립(R), 해결 연습(A), 수행 검증(C), 본질 해석(E)은
          왕복할 수 있는 활동입니다. 자기화 재구성은 C2에 속하고, 의인화 문답은
          여러 활동에 활용하는 선택 기법입니다.
        </p>
      </details>
    </details>
  );
}
function RecordCard({
  record,
  commit,
}: {
  record: StudyRecord;
  commit: Commit;
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
              ([id]) => TRACE_ITEMS.find((item) => item.id === id)?.label || id,
            )
            .join(" · ") || "선택한 공부 방법이 없습니다."}
        </p>
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
      </details>
    </Card>
  );
}
