import { WorkspaceSearch } from "./ui/workspace-search";
import { MaterialCardLibrary } from './ui/material-card-library';
import { MotionWidgets } from './ui/motion-widgets';
import { SavedMark } from './ui/motion';
import { RelatedCodeExamples } from './ui/learning-links';
import { useEffect, useRef, useState, Suspense, lazy, type ReactNode } from "react";
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
  ScreenBoundary,
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
import { DraftArchiveError, readRescuedDraft, storeDraftSafely, draftHasUnstoredText, rescueWithoutOverwrite, draftReadError, rememberDraftReadError, archiveDamagedDraft, clearStoredDraft } from "./data/draft-safety";
import { validateFormDraft } from "./data/demo-repository";
import { useRoute, navigate as go } from "./ui/navigation-context";
import { TraceEditor } from "./ui/trace-editor";
import { CriteriaEditor } from "./ui/criteria-editor";
import { resolveCriteria } from "./domain/criteria";
import { recallPath } from "./domain/topic-recall";
import { outlineRevisionToken, previewOutlineEntries } from "./domain/outline";
import { OutlineTableEditor } from "./ui/outline-table-editor";
import { OutlineTree } from "./ui/outline-tree";
import { DraftArchives } from "./ui/draft-archives";
import { QuickMemos } from "./ui/quick-memos";
import { StudyLaunch } from "./ui/study-launch";
import { BrandIdentity, BrandContinuity, BrandService, ExperienceSettings, RelatedThinking, useExperience } from "./ui/brand-experience";
import { SubjectWeeks } from "./ui/semester-weeks";
const NextStudy = lazy(() => import("./ui/next-study").then(module => ({ default: module.NextStudy })));
const StudyStatistics = lazy(() => import("./ui/statistics").then(module => ({ default: module.StudyStatistics })));
const StudyLandscapes = lazy(() => import("./ui/study-landscapes").then(module => ({ default: module.StudyLandscapes })));
const StudyMaterials = lazy(() => import("./ui/study-materials").then(module => ({ default: module.StudyMaterials })));
const MathExplorer = lazy(() => import("./ui/math-explorer").then(module => ({ default: module.MathExplorer })));
const CodePractice = lazy(() => import("./ui/code-practice").then(module => ({ default: module.CodePractice })));
const MemoryTests = lazy(() => import("./ui/memory-test").then(module => ({ default: module.MemoryTests })));
const ExamPractice = lazy(() => import("./ui/exam-practice").then(module => ({ default: module.ExamPractice })));
import { TopicRecall } from "./ui/topic-recall";
const StudyGraph = lazy(() => import('./ui/study-graph').then(module => ({ default: module.StudyGraph })));
const FullBackup = lazy(() => import("./ui/full-backup").then(module => ({ default: module.FullBackup })));
const StudyBoard = lazy(() => import('./ui/study-board').then(module => ({ default: module.StudyBoard })));
const StudyCanvas = lazy(() => import("./ui/study-canvas").then(module => ({ default: module.StudyCanvas })));
const PersonalSpace = lazy(() => import("./ui/personal-space").then(module => ({ default: module.PersonalSpace })));
import { storagePrefix, type StudyRepository } from "./data/repository";
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
  if (error instanceof DOMException && error.name === "QuotaExceededError")
    return "이 기기의 저장 공간이 부족해 저장하지 못했습니다. 작성 중인 내용은 유지했습니다. 공간을 확보한 뒤 다시 저장해 주세요.";
  return error instanceof Error
    ? error.message
    : "내용을 보존했습니다. 다시 시도해 주세요.";
}

function readPreference(name: string, fallback: string, prefix = "study-space:demo") {
  try { return sessionStorage.getItem(`${prefix}:context:${name}`) ?? localStorage.getItem(`${prefix}:context:${name}:device`) ?? fallback; }
  catch { return fallback; }
}
function writePreference(name: string, value: string, prefix = "study-space:demo") {
  try { sessionStorage.setItem(`${prefix}:context:${name}`, value); } catch { /* Optional view context never blocks a study draft. */ }
  try { localStorage.setItem(`${prefix}:context:${name}:device`, value); } catch { /* Optional reopening preference. */ }
}

export default function App() {
  // Personal entry is the default, including visits with an old demo preference.
  // Existing example records remain accessible only through an explicit URL.
  const [personal, setPersonal] = useState(() => location.hash === '#/account' || new URLSearchParams(location.search).get('space') !== 'demo');
  useEffect(() => { if (location.hash === '#/account') { try { sessionStorage.setItem('study-space:active-space', 'personal'); } catch { /* Space stays open for this visit. */ } location.hash = '#/'; } }, []);
  const choose = (value: boolean) => { const url = new URL(location.href); url.searchParams.delete('space'); history.replaceState(null, '', url); try { sessionStorage.setItem('study-space:active-space', value ? 'personal' : 'demo'); } catch { /* In-memory space choice remains usable. */ } location.hash = '#/'; setPersonal(value); };
  return <ScreenBoundary><Suspense fallback={<main className="boot"><LoadingState message="공부 공간을 여는 중입니다." /></main>}>{personal ? <Suspense fallback={<main className="boot"><LoadingState /></main>}><PersonalSpace renderWorkspace={(repo, controls) => <Workspace key={repo.getSnapshot().userId} repository={repo} accountControls={controls} />} /></Suspense>
    : <DemoApp accountControls={<Button variant="quiet" onClick={() => choose(true)}>내 공부 공간</Button>} />}</Suspense></ScreenBoundary>;
}
function DemoApp({ accountControls }: { accountControls: ReactNode }) {
  const [showBootArchives, setShowBootArchives] = useState(false);
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
          "이 브라우저에서는 동시 작성을 보호할 수 없습니다. 최신 브라우저에서 열어 주세요.",
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
                "다른 창에서 예시 자료를 사용하고 있습니다. 그 창을 닫은 뒤 다시 열어 주세요. 저장된 자료는 그대로 남아 있습니다.",
              loading: false,
            });
            return;
          }
          // Register release before publishing the mounted workspace, including refresh cleanup.
          const held = new Promise<void>((resolve) => { release = resolve; });
          try {
            setBoot({
              repo: new DemoRepository(localStorage),
              error: "",
              loading: false,
            });
          } catch (e) {
            setBoot({ repo: null, error: message(e), loading: false });
          }
          await held;
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
          title="예시 자료를 열지 못했습니다"
          message={boot.error}
          onRetry={() => location.reload()}
        />
        <Button onClick={() => setShowBootArchives(value => !value)}>초안 보관본 확인</Button>
        {accountControls}
        {showBootArchives && <DraftArchives />}
      </main>
    );
  return <Workspace repository={boot.repo} accountControls={accountControls} />;
}
export function Workspace({ repository, accountControls }: { repository: StudyRepository; accountControls?: ReactNode }) {
  const [data, setData] = useState(repository.getSnapshot());
  useEffect(() => repository.subscribe?.(() => setData(repository.getSnapshot())), [repository]);
  const prefix = storagePrefix(data);
  const route = useRoute(prefix);
  const brandExperience = useExperience(data);
  const [scope, setScope] = useState(() => readPreference("scope", "all", prefix));
  const [query, setQuery] = useState(() => readPreference("query", "", prefix));
  const [error, setError] = useState("");
  const [cleanupKeys, setCleanupKeys] = useState<string[]>([]);
  const [notice, setNotice] = useState<{
    message: string;
    undo?: () => void;
  } | null>(null);
  const [dialog, setDialog] = useState<
    "semester" | "subject" | "node" | "bulk" | "trash" | "rename" | "move" | null
  >(null);
  const [name, setName] = useState("");
  const [moveParent, setMoveParent] = useState<string>("");
  const [role, setRole] = useState<OutlineNode["role"]>("topic");
  const [modalKey, setModalKey] = useState("");
  const [modalError, setModalError] = useState("");
  const [modalBlocked, setModalBlocked] = useState(false);
  const [bulkNames, setBulkNames] = useState<string[]>(["", "", ""]);
  const [duplicateChoice, setDuplicateChoice] = useState<"" | "reuse" | "create">("");
  const [bulkPreview, setBulkPreview] = useState(false);
  const [outlineToken, setOutlineToken] = useState("");
  const [theme, setTheme] = useState(() => readPreference("theme", "auto", prefix));
  const [reducedMotion, setReducedMotion] = useState(() => readPreference("motion", "auto", prefix) === "reduce");
  const [recent, setRecent] = useState<string[]>(() => {
    try {
      return JSON.parse(sessionStorage.getItem(data.namespace === "demo" ? "demo:recent" : `${prefix}:recent`) || "[]");
    } catch {
      return [];
    }
  });
  useEffect(() => { writePreference("scope", scope, prefix); }, [scope]);
  useEffect(() => { writePreference("query", query, prefix); }, [query]);
  useEffect(() => { writePreference("theme", theme, prefix); }, [theme]);
  useEffect(() => {
    writePreference("motion", reducedMotion ? "reduce" : "auto", prefix);
    if (reducedMotion) document.documentElement.dataset.motion = 'reduce';
    else delete document.documentElement.dataset.motion;
    return () => { delete document.documentElement.dataset.motion; };
  }, [reducedMotion, prefix]);
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
  // Preview registered writing; editing an older record does not make it a new study.
  const latestWrittenRecords = new Map<string, StudyRecord>();
  for (const record of records) {
    if (!record.body.trim()) continue;
    const previous = latestWrittenRecords.get(record.targetId);
    if (!previous || record.createdAt >= previous.createdAt)
      latestWrittenRecords.set(record.targetId, record);
  }
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
  const commit = (action: Action, success?: string, operation?: { opId: string; at: string }): AppState | null => {
    try {
      const next = repository.execute({
        ...action,
        opId: operation?.opId || uid(),
        at: operation?.at || new Date().toISOString(),
        userId: data.userId,
        namespace: data.namespace,
      } as Command);
      setData(next);
      setError("");
      if (success) setNotice({ message: success });
      return next;
    } catch (e) {
      setError(message(e));
      if (dialog) setModalError(message(e));
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
        sessionStorage.setItem(data.namespace === "demo" ? "demo:recent" : `${prefix}:recent`, JSON.stringify(next));
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
  useEffect(() => { setDialog(null); }, [route, scope]);
  const modalValue = (patch: Record<string, unknown> = {}) => ({ name, moveParent, role, bulkNames, ...patch });
  const persistModal = (patch: Record<string, unknown>) => {
    const raw = JSON.stringify(modalValue(patch));
    if (modalBlocked) { rescueWithoutOverwrite(modalKey, raw); return; }
    try { storeDraftSafely(modalKey, raw); setModalError(""); }
    catch { setModalError("초안을 이 기기에 보관하지 못했습니다. 입력은 현재 창에만 남아 있습니다. 다시 보관하거나 복사한 뒤 창을 닫아 주세요."); }
  };
  const recoverModal = () => {
    try {
      if (modalBlocked) archiveDamagedDraft(modalKey);
      storeDraftSafely(modalKey, JSON.stringify(modalValue()));
      setModalBlocked(false); setModalError("");
    } catch (reason) { setModalError(reason instanceof DraftArchiveError ? reason.message : "초안을 보관하지 못했습니다. 원본과 현재 창의 입력은 유지했습니다. 저장 공간을 확인한 뒤 다시 시도해 주세요."); }
  };
  const finishModal = () => {
    try { clearStoredDraft(modalKey); setModalError(""); }
    catch {
      setCleanupKeys(keys => [...new Set([...keys, modalKey])]);
      setError("변경은 저장했지만 초안을 정리하지 못했습니다. 이 창에서는 다시 적용하지 않습니다. 새로 열기 전에 초안 정리를 다시 시도해 주세요.");
    }
    setDialog(null);
  };
  const openDialog = (next: typeof dialog) => {
    const key = `${prefix}:modal:${next}:${next === "semester" ? "global" : next === "subject" ? scope : node?.id || subject?.id || "missing"}`;
    setModalKey(key); setModalError(""); setModalBlocked(false); setBulkPreview(false); setDuplicateChoice("");
    let values = { name: next === "rename" ? node?.name || "" : "", moveParent: node?.parentId || "", role: "topic" as OutlineNode["role"], bulkNames: ["", "", ""] };
    if (next !== "trash") {
      try {
        const raw = readRescuedDraft(key) ?? localStorage.getItem(key);
        if (raw) {
          const saved = JSON.parse(raw);
          if (!saved || typeof saved.name !== "string" || typeof saved.moveParent !== "string" || !["unit", "outline", "topic"].includes(saved.role) || !Array.isArray(saved.bulkNames) || saved.bulkNames.length > 500 || !saved.bulkNames.every((value: unknown) => typeof value === "string")) throw Error();
          values = saved;
        }
        if (draftReadError(key)) { setModalBlocked(true); setModalError(draftReadError(key)); }
        else if (draftHasUnstoredText(key)) setModalError("저장에 실패한 초안을 현재 창에서 이어 쓰고 있습니다. 새로고침 전 다시 보관해 주세요.");
      } catch {
        rememberDraftReadError(key, "기존 초안을 읽지 못했습니다. 원본을 덮어쓰지 않았습니다. 원본 사본을 보관한 뒤 현재 입력을 새 초안으로 보관할 수 있습니다.");
        setModalBlocked(true); setModalError("기존 초안을 읽지 못했습니다. 원본을 덮어쓰지 않았습니다. 원본 사본을 보관한 뒤 현재 입력을 새 초안으로 보관할 수 있습니다.");
      }
    }
    setName(values.name); setMoveParent(values.moveParent); setRole(values.role); setBulkNames(values.bulkNames);
    if (subject) setOutlineToken(outlineRevisionToken(data, subject.id, node?.id || null));
    setDialog(next);
  };
  const bulkExisting = nodes.filter(item => item.subjectId === subject?.id && item.parentId === (node?.id || null) && previewOutlineEntries(bulkNames).entries.some(entry => entry.name === item.name)).sort((a, b) => a.order - b.order);
  const bulkEntries = previewOutlineEntries(bulkNames).entries.filter(entry => duplicateChoice !== "reuse" || !bulkExisting.some(item => item.name === entry.name));
  const addItem = () => {
    if (modalBlocked) return;
    if (dialog === "bulk" && (!bulkPreview || previewOutlineEntries(bulkNames).issues.length || (bulkExisting.length > 0 && !duplicateChoice))) return;
    if (dialog === "bulk" && duplicateChoice === "reuse" && !bulkEntries.length) {
      finishModal(); setNotice({ message: "같은 이름의 기존 항목을 유지했습니다. 새 항목이나 공부 기록은 만들지 않았습니다." }); return;
    }
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
    if (dialog === "bulk" && subject)
      next = commit({ type: "addNodes", subjectId: subject.id, parentId: node?.id || null, role,
        entries: bulkEntries.map(value => ({ id: uid(), name: value.name })), expectedToken: outlineToken, ...(duplicateChoice === "create" ? { duplicateNames: "create" as const } : {}) });
    if (dialog === "rename" && node)
      next = commit({
        type: "renameNode",
        id: node.id,
        name,
        expectedVersion: node.version,
      });
    if (next) {
      finishModal();
      const revision = dialog === "bulk" ? next.revisions.at(-1) : undefined;
      setNotice({ message: "저장했습니다.", undo: revision ? () => { commit({ type: "undoRevision", revisionId: revision.id, expectedVersion: revision.after.version }, "추가한 목차를 되돌렸습니다."); } : undefined });
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
    if (!node || modalBlocked) return;
    const next = commit({ type: "moveNode", id: node.id, parentId: moveParent || null, expectedVersion: node.version });
    if (!next) return;
    const revision = next.revisions.slice().reverse().find(r => r.collection === "nodes" && r.entityId === node.id);
    finishModal();
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
  const reorderNode = (direction: -1 | 1) => {
    if (!node || !subject) return;
    const siblings = nodes.filter(item => item.subjectId === subject.id && item.parentId === node.parentId).sort((a, b) => a.order - b.order);
    const index = siblings.findIndex(item => item.id === node.id), other = index + direction;
    if (other < 0 || other >= siblings.length) return;
    [siblings[index], siblings[other]] = [siblings[other], siblings[index]];
    const next = commit({ type: "reorderNodes", subjectId: subject.id, parentId: node.parentId, ids: siblings.map(item => item.id), expectedToken: outlineRevisionToken(data, subject.id, node.parentId) });
    const revision = next?.revisions.at(-1);
    if (revision) setNotice({ message: "형제 항목의 순서를 바꿨습니다.", undo: () => { commit({ type: "undoRevision", revisionId: revision.id, expectedVersion: revision.after.version }, "목차 순서를 되돌렸습니다."); } });
  };
  const siblings = node ? nodes.filter(item => item.subjectId === node.subjectId && item.parentId === node.parentId).sort((a,b) => a.order - b.order) : [];
  const siblingIndex = siblings.findIndex(item => item.id === node?.id);
  const navItems = [
    { href: "/", text: "오늘" },
    { href: "/statistics", text: "통계" },
    { href: "/schedules", text: "일정·과제" },
    { href: "/subjects", text: "과목" },
    { href: "/record", text: "기록" },
    { href: "/memos", text: "메모" },
    { href: "/materials", text: "강의 자료" },
    { href: "/code", text: "코딩 연습" },
    { href: "/math", text: "수식 탐색" },
    { href: "/practice", text: "시험 연습" },
    { href: "/memory-test", text: "암기시험" },
    { href: "/material-cards", text: "자료 카드" },
    { href: "/recall", text: "주제 카드" },
    { href: "/canvas", text: "Canvas" },
    { href: "/graph", text: "그래프뷰" },
    { href: "/board", text: "칸반보드" },
    { href: "/search", text: "찾기" },
  ];
  const recordRoute = route.startsWith("/record");
  const memoRoute = route === "/memos" || route.startsWith("/memos/");
  const materialRoute = route === "/materials" || route.startsWith("/materials/");
  const codeRoute = route === "/code" || route.startsWith("/code/");
  const memoryTestRoute = route === "/memory-test" || route.startsWith("/memory-test/");
  const practiceRoute = route === "/practice" || route.startsWith("/practice/");
  const freeRoute = route === "/free" || route.startsWith("/free/");
  const rootTitle =
    route === "/about" ? "manseeksong" : (route === "/help" || route === "/subscription") ? "도움말" : route === "/my-progress" ? "내 생각 다시 보기" :
    route === "/schedules" ? "일정·과제·온라인 강의" : route === "/material-cards" ? "자료 카드" : route === "/math" ? "수식 탐색" : memoryTestRoute ? "암기시험" : materialRoute ? "강의 자료" : practiceRoute ? "시험 연습" : codeRoute ? "코딩 연습" : route === "/statistics" ? "공부 통계" :
    route === "/backup" ? "백업·복원" : route === "/graph" ? "그래프뷰" : route === "/board" ? "칸반보드" : route === "/canvas"
      ? "Canvas"
      : (route === "/recall" || route === "/recall/scheduled")
      ? "주제 카드"
      : memoRoute
      ? "작은 메모"
      : route === "/draft-archives"
      ? "초안 보관본"
      : route === "/subjects"
      ? "공부할 범위"
      : route === "/search"
        ? "기억을 찾아서"
        : route === "/trash"
          ? "휴지통"
          : route.startsWith("/free")
            ? "자유롭게 남기기"
            : recordRoute
              ? "공부 기록"
              : "오늘";
  const tree = (parentId: string | null) => nodes.some(n => n.subjectId === subject?.id && n.parentId === parentId)
    ? <OutlineTree nodes={nodes} records={records} subjectId={subject!.id} subjectName={subject!.name} parentId={parentId} /> : null;
  return (
    <div data-reading-width={brandExperience.state.readingWidth} className={`app-shell${route === "/" ? " is-home" : route === "/canvas" ? " is-canvas" : ""}`}>
      <aside className="sidebar">
        <BrandIdentity />
        <NavigationBar label="주 메뉴" orientation="vertical" items={navItems.map(item => ({href:`#${item.href}`, label:item.text, active:route === item.href || item.href === "/record" && recordRoute || item.href === "/memos" && memoRoute || item.href === "/materials" && materialRoute || item.href === "/code" && codeRoute || item.href === "/practice" && practiceRoute || item.href === "/memory-test" && memoryTestRoute || item.href === "/subjects" && Boolean(subject)}))} />
        <details className="sidebar-bottom workspace-tools"><summary>보관함·화면 설정</summary><div className="workspace-tools-content">
          <MotionWidgets reduced={reducedMotion} onReducedChange={setReducedMotion} />
          <a href="#/backup">백업·복원</a>
          <a href="#/trash">휴지통</a>
          <a href="#/draft-archives">초안 보관본</a>
          <a href="#/my-progress">내 생각 다시 보기</a>
          <a href="#/help">도움말</a>
          <a href="#/about">manseeksong 소개</a>
          <ExperienceSettings data={data} />
          <Select
            label="화면 밝기"
            value={theme}
            onChange={(e) => setTheme(e.target.value)}
          >
            <option value="auto">기기 설정</option>
            <option value="light">밝게</option>
            <option value="dark">어둡게</option>
          </Select>
        </div></details>
      </aside>
      <div className="workspace">
        <header className="topbar">
          <BrandIdentity compact />
          <span className="space-label">{data.namespace === "demo" ? "예시 자료 · 이 기기에 저장" : "내 공부 공간"}</span>{accountControls}
          <Select
            label="공부 범위"
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
            <MotionWidgets reduced={reducedMotion} onReducedChange={setReducedMotion} />
            <a href="#/trash">휴지통</a>
            <a href="#/draft-archives">초안 보관본</a>
            <a href="#/my-progress">내 생각 다시 보기</a>
            <a href="#/help">도움말</a>
            <a href="#/about">manseeksong 소개</a>
            <ExperienceSettings data={data} />
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
          <ScreenBoundary key={`${data.namespace}:${data.userId}:${route}`}>
          {route !== "/" && <Breadcrumb
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
          />}
          {error && <ErrorState title={cleanupKeys.length ? "저장 후 초안 정리가 남았습니다" : "저장하지 못했습니다"} message={error} />}
          {cleanupKeys.length > 0 && <Button onClick={() => {
            const remaining = cleanupKeys.filter(key => {
              // A later edit replaces the empty committed marker; never clear that new input.
              if (readRescuedDraft(key) !== "") return false;
              try { clearStoredDraft(key); return false; } catch { return true; }
            });
            setCleanupKeys(remaining);
            if (!remaining.length) { setError(""); setNotice({ message: "저장된 내용은 유지하고 이전 초안만 정리했습니다." }); }
          }}>저장한 초안 정리 다시 시도</Button>}
          {notice && (!notice.undo || recordRoute) && (
            <div className="feedback-banner">
              <span role="status">{notice.message}</span>
              {notice.undo && (
                <Button
                  onClick={() => {
                    const undo = notice.undo;
                    setNotice(null);
                    undo?.();
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
                    : ""}
              </p>
              <h1>{node?.name || subject?.name || rootTitle}</h1>
            </div>
            {subject && !node && (
              <div className="actions"><Button onClick={() => openDialog("node")}>목차 추가</Button><Button onClick={() => openDialog("bulk")}>여러 항목 추가</Button><SubjectWeeks data={data} repository={repository} subjectId={subject.id} onSaved={setData} /></div>
            )}
          </div>
          <BrandContinuity key={`${data.namespace}:${data.userId}`} data={data} route={route} />
          {["/about", "/help", "/my-progress", "/subscription"].includes(route) && <BrandService key={`${data.namespace}:${data.userId}:${route}`} data={data} repository={repository} page={route === "/subscription" ? "/help" : route} />}
          {route === "/draft-archives" && <DraftArchives data={data} />}
          {route === "/schedules" && <Suspense fallback={<LoadingState message="일정을 여는 중입니다." />}><NextStudy onlySchedules repository={repository} onSaved={setData} data={data} subjectIds={shownSubjects.map(subject=>subject.id)} semesterId={scope}/></Suspense>}
          {route === "/statistics" && <Suspense fallback={<LoadingState message="공부 통계를 여는 중입니다." />}><StudyStatistics key={scope} data={data} subjectIds={shownSubjects.map(subject => subject.id)} /></Suspense>}
          {route === "/" && (
            <>
              <Card className="hero">
                <div>
                  <h2>오늘 공부한 것을 남겨 주세요.</h2>
                  <p>주제를 고르고 공부함을 체크하세요. 글은 필요할 때 함께 남길 수 있습니다.</p>
                </div>
                <div className="actions">
                  <Button variant="primary" onClick={() => go("/record")}>
                    공부 기록하기
                  </Button>
                  <Button onClick={() => go("/free")}>자유롭게 쓰기</Button>
                  <Button onClick={() => go("/recall")}>주제 카드로 설명하기</Button>
                </div>
              </Card>
              {records.some(record => shownSubjects.some(subject => subject.id === record.subjectId)) && <section className="recent-study-list section-space" aria-label="최근 남긴 공부 기록">
                <h2>최근 남긴 기록</h2>
                {records.filter(record => shownSubjects.some(subject => subject.id === record.subjectId)).slice().sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, 3).map(record => <article key={record.id}>
                  <h3><a href={`#/node/${encodeURIComponent(record.targetId)}`}>{nodes.find(node => node.id === record.targetId)?.name ?? subjects.find(subject => subject.id === record.targetId)?.name ?? '보관된 공부 주제'}</a></h3>
                  <div className="record-source">{subjects.find(subject => subject.id === record.subjectId)?.name} · {record.dateEvidence.kind === 'exact' ? record.dateEvidence.date : record.dateEvidence.kind === 'range' ? `${record.dateEvidence.from}~${record.dateEvidence.to}` : '공부한 날짜 미정'}</div>
                  {record.body && <p className="prose">{record.body}</p>}
                  <footer><a href={`#/node/${encodeURIComponent(record.targetId)}`}>기록 열기</a><a href={`#/record/${encodeURIComponent(record.targetId)}`}>이 주제에 새 기록</a></footer>
                </article>)}
              </section>}
              <QuickMemos data={data} repository={repository} onSaved={setData} compact />
              <StudyLaunch data={data} />
              <Suspense fallback={null}><StudyLandscapes data={data} subjectIds={shownSubjects.map(subject => subject.id)} /></Suspense>
              <Suspense fallback={<LoadingState message="공부 통계를 여는 중입니다." />}><StudyStatistics key={`statistics:${scope}`} compact data={data} subjectIds={shownSubjects.map(subject => subject.id)} /></Suspense>
              <Suspense fallback={<LoadingState message="다음 공부를 여는 중입니다." />}><NextStudy key={`${data.namespace}:${data.userId}`} repository={repository} onSaved={setData} data={data} subjectIds={shownSubjects.map(subject => subject.id)} semesterId={scope} /></Suspense>
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
                          {latestWrittenRecords.has(t.id) && (
                            <a className="recent-record-preview" href={`#/node/${encodeURIComponent(t.id)}`}
                              aria-label={`${t.name} 최근 남긴 글 보기`}>
                              최근 남긴 글: {latestWrittenRecords.get(t.id)!.body.trim().replace(/\s+/g, " ")}
                            </a>
                          )}
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
                <OutlineTableEditor data={data}
                  initialScope={scope === "independent" ? { kind: "independent" } : scope === "all" || scope === "unassigned" ? { kind: "unassigned" } : { kind: "semester", semesterId: scope }}
                  onApply={command => {
                    const result = commit(command, undefined, { opId: command.opId, at: command.at });
                    const revision = result?.revisions.filter(item => item.operationId === command.opId).at(-1);
                    if (result) setNotice({ message: "표의 과목과 목차를 저장했습니다.", undo: revision ? () => { commit({ type: "undoRevision", revisionId: revision.id, expectedVersion: revision.after.version }, "표에서 생성한 항목을 되돌렸습니다."); } : undefined });
                    return result;
                  }}
                  onUndo={(revisionId, expectedVersion) => commit({ type: "undoRevision", revisionId, expectedVersion }, "표에서 생성한 항목을 되돌렸습니다.")} />
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
                <div className="section-heading"><h2>목차</h2><a href="#/canvas">Canvas에서 함께 보기 ↗</a></div>
                {tree(null) || (
                  <EmptyState
                    title="목차가 아직 없습니다"
                    message="서로 다른 깊이로 단원과 주제를 추가할 수 있습니다."
                  />
                )}
              </section>
              <QuickMemos key={`memo:${subject.id}`} data={data} repository={repository} onSaved={setData} ownerId={subject.id} />
            </>
          )}
          {node && (
            <>
              <RelatedThinking key={`thinking:${node.id}`} data={data} nodeId={node.id} />
              {node.role === "topic" && <StudyLaunch data={data} nodeId={node.id} />}
              <div className="actions">
                <Button
                  variant="primary"
                  onClick={() => go(`/record/${node.id}`)}
                >
                  공부 기록하기
                </Button>
                <ContextMenu targetLabel={node.name} label="목차 관리" items={[
                  {id:"add", label:"하위 항목 추가", onSelect:()=>openDialog("node")},
                  {id:"bulk", label:"여러 하위 항목 추가", onSelect:()=>openDialog("bulk")},
                  {id:"rename", label:"이름 수정", onSelect:()=>openDialog("rename")},
                  {id:"move", label:"위치 옮기기", onSelect:()=>openDialog("move")},
                  {id:"trash", label:"휴지통으로 이동", danger:true, onSelect:()=>openDialog("trash")},
                ]} />
              </div>
              <div className="actions" aria-label="형제 항목 순서">
                {node.role === 'topic' && <Button onClick={() => go(`/memory-test/${encodeURIComponent(node.id)}`)}>암기시험 만들기</Button>}
                {node.role === 'topic' && <Button onClick={() => go(`/practice/${encodeURIComponent(node.id)}`)}>시험처럼 풀어 보기</Button>}
                <Button disabled={siblingIndex <= 0} onClick={() => reorderNode(-1)}>순서 위로</Button>
                <Button disabled={siblingIndex < 0 || siblingIndex >= siblings.length - 1} onClick={() => reorderNode(1)}>순서 아래로</Button>
              </div>
              {node.role === "topic" && <RelatedCodeExamples data={data} topicId={node.id} />}
              <CriteriaEditor data={data} targetId={node.id}
                onApply={change => {
                  const result = commit({type: "adjustCriteria", ...change});
                  const revision = result?.revisions.find(item => item.collection === "criteria" && item.entityId === change.id);
                  if (revision) setNotice({ message: "공부 기준을 조정했습니다.", undo: () => { commit({type: "undoRevision", revisionId: revision.id, expectedVersion: revision.after.version}, "기준 변경을 되돌렸습니다."); } });
                  return result;
                }}
                onUndo={(revisionId, expectedVersion) => {
                  const result = commit({type: "undoRevision", revisionId, expectedVersion});
                  if (result) setNotice({ message: "기준 변경을 되돌렸습니다." });
                  return result;
                }} />
              {tree(node.id)}
              <NarrativeEditor
                key={node.id}
                data={data}
                kind={node.role === "unit" ? "unit-introduction" : "topic-note"}
                ownerId={node.id}
                label={node.role === "unit" ? "단원 서문" : "주제 메모"}
                commit={commit}
              />
              <QuickMemos key={`memo:${node.id}`} data={data} repository={repository} onSaved={setData} ownerId={node.id} />
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
              subjectIds={shownSubjects.map(subject => subject.id)}
              initialTarget={route.startsWith("/record/") ? route.slice("/record/".length) : undefined}
              commit={commit}
              onSaved={(warning, cleanupKey) => {
                if (cleanupKey) { setCleanupKeys(keys => [...new Set([...keys, cleanupKey])]); setError(warning || "초안 정리를 다시 시도해 주세요."); }
                setNotice({ message: warning || "공부 기록을 저장했습니다." });
                go("/");
              }}
            />
          )}
          {freeRoute && <FreeNotes key={route} data={data} route={route} commit={commit} onCleanupFailure={key => {
            setCleanupKeys(keys => [...new Set([...keys, key])]);
            setError("자유 기록은 저장했습니다. 이전 초안 정리가 남았습니다. 창을 닫기 전에 다시 시도해 주세요.");
          }} />}
          {route === "/graph" && <Suspense fallback={<LoadingState />}><StudyGraph key={`${data.namespace}:${data.userId}`} data={data} subjectIds={shownSubjects.map(subject => subject.id)} /></Suspense>}
          {route === "/board" && <Suspense fallback={<LoadingState />}><StudyBoard key={`${data.namespace}:${data.userId}`} data={data} repository={repository} onSaved={setData} subjectIds={shownSubjects.map(subject => subject.id)} /></Suspense>}
          {route === "/canvas" && <Suspense fallback={<LoadingState message="Canvas를 여는 중입니다." />}><StudyCanvas key={`${data.namespace}:${data.userId}`} data={data} repository={repository} onSaved={setData} subjectIds={shownSubjects.map(subject => subject.id)} renderNarrative={(ownerId, narrative, finishEditing) => {
            const target = data.nodes.find(node => node.id === ownerId);
            return <NarrativeEditor key={narrative?.id ?? ownerId} data={data} ownerId={ownerId} narrativeId={narrative?.id} kind={narrative?.kind ?? (target ? target.role === 'unit' ? 'unit-introduction' : 'topic-note' : 'subject-overview')} label={narrative ? '메모' : '새 메모'} commit={commit} repository={repository} onSaved={(_id, cleanupKey) => { if (!cleanupKey) finishEditing(); }} inline />;
          }} /></Suspense>}
          {(route === "/recall" || route === "/recall/scheduled") && <TopicRecall key={`${data.namespace}:${data.userId}:${route}`} initialMode={route === "/recall/scheduled" ? "scheduled" : undefined} data={data} repository={repository} onSaved={setData} subjectIds={shownSubjects.map(subject => subject.id)} />}
          {memoRoute && <QuickMemos key={route} data={data} repository={repository} onSaved={setData} memoId={route.startsWith("/memos/") ? route.slice("/memos/".length) : undefined} />}
          {materialRoute && <Suspense fallback={<LoadingState message="강의 자료를 여는 중입니다." />}><StudyMaterials data={data} repository={repository} onSaved={setData} subjectIds={shownSubjects.map(subject => subject.id)} materialId={route.startsWith("/materials/") ? decodeURIComponent(route.slice("/materials/".length)) : undefined} trash={route === "/materials/trash"} /></Suspense>}
          {route === "/math" && <Suspense fallback={<LoadingState message="수식 탐색을 여는 중입니다." />}><MathExplorer key={`${data.namespace}:${data.userId}`} data={data} repository={repository} onSaved={setData} /></Suspense>}
          {codeRoute && <Suspense fallback={<LoadingState message="코드 편집기를 여는 중입니다." />}><CodePractice data={data} repository={repository} onSaved={setData} exampleId={route.startsWith("/code/") ? route.slice("/code/".length) : undefined} /></Suspense>}
          {route === "/material-cards" && <MaterialCardLibrary data={data} repository={repository} onSaved={setData} subjectIds={shownSubjects.map(subject => subject.id)} />}
          {memoryTestRoute && <Suspense fallback={<LoadingState />}><MemoryTests key={`${data.namespace}:${data.userId}:${route}`} data={data} repository={repository} onSaved={setData} subjectIds={shownSubjects.map(subject => subject.id)} resultId={route.startsWith("/memory-test/result/") ? decodeURIComponent(route.slice("/memory-test/result/".length)) : undefined} initialTopicId={route.startsWith("/memory-test/") && !route.startsWith("/memory-test/result/") ? decodeURIComponent(route.slice("/memory-test/".length)) : undefined} /></Suspense>}
          {practiceRoute && <Suspense fallback={<LoadingState />}><ExamPractice key={`${data.namespace}:${data.userId}:${route}`} data={data} repository={repository} onSaved={setData} subjectIds={shownSubjects.map(subject => subject.id)} initialTopicId={route.startsWith('/practice/') ? route.slice('/practice/'.length) : undefined} /></Suspense>}
          {route === "/search" && <WorkspaceSearch data={data} query={query} onQueryChange={setQuery} subjectIds={shownSubjects.map(subject => subject.id)} allScopes={scope === "all"} onAllScopes={() => setScope("all")} />}
          {route === "/trash" && (
            <>
              <p className="muted">
                목차를 복원하면 연결된 기록을 다시 볼 수 있습니다. 기록 본문은
                삭제하지 않았습니다.
              </p>
              {!data.nodes.some((n) => n.deletedAt) && !(data.memos ?? []).some(memo => memo.deletedAt) && (
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
          {route === "/backup" && <Suspense fallback={<LoadingState />}><FullBackup repository={repository} /></Suspense>}
          {route === "/trash" && <QuickMemos data={data} repository={repository} onSaved={setData} trash />}
          {route === "/trash" && <Suspense fallback={<LoadingState />}><CodePractice data={data} repository={repository} onSaved={setData} trash /></Suspense>}
          {!["/", "/subjects", "/search", "/trash", "/free", "/draft-archives", "/material-cards", "/recall", "/recall/scheduled", "/canvas", "/graph", "/board", "/statistics", "/math", "/backup", "/about", "/help", "/my-progress", "/subscription"].includes(route) &&
            !recordRoute &&
            !memoRoute &&
            !materialRoute &&
            !codeRoute &&
            !practiceRoute &&
            !memoryTestRoute &&
            route !== "/schedules" &&
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
          </ScreenBoundary>
        </main>
        <NavigationBar label="빠른 이동" className="bottom-nav" items={navItems.map(item => ({href:`#${item.href}`, label:item.text, active:route === item.href || item.href === "/record" && recordRoute || item.href === "/memos" && memoRoute || item.href === "/materials" && materialRoute || item.href === "/code" && codeRoute || item.href === "/practice" && practiceRoute || item.href === "/memory-test" && memoryTestRoute || item.href === "/subjects" && Boolean(subject)}))} />
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
        {modalError && <ErrorState message={modalError} onRetry={recoverModal} />}
        {modalBlocked && <Button onClick={recoverModal}>원본 사본 보관 후 입력 이어가기</Button>}
        {dialog === "move" && node ? (
          <div className="field-stack">
            <p>‘{node.name}’와 하위 {descendants(node.id).length}개 항목을 같은 과목 안에서 옮깁니다. 공부 기록과 메모는 그대로 연결됩니다.</p>
            <Select label="옮길 상위 항목" value={moveParent} onChange={e => { setMoveParent(e.target.value); persistModal({ moveParent: e.target.value }); }}>
              <option value="">{subject?.name} · 과목 바로 아래</option>
              {nodes.filter(candidate => candidate.subjectId === node.subjectId && candidate.id !== node.id && !descendants(node.id).some(child => child.id === candidate.id)).map(candidate => <option key={candidate.id} value={candidate.id}>{topicPath(candidate.id).map(parent => parent.name).join(" / ")}</option>)}
            </Select>
            <Button variant="primary" disabled={modalBlocked || moveParent === (node.parentId || "")} onClick={moveNode}>이 위치로 옮기기</Button>
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
            onKeyDown={event => {
              if (event.key === "Enter" && (event.nativeEvent.isComposing || event.keyCode === 229)) event.preventDefault();
            }}
            onSubmit={(e) => {
              e.preventDefault();
              addItem();
            }}
          >
            <div className="field-stack">
              {dialog === "bulk" ? <>
                <p>같은 위치에 항목을 하나씩 적어 주세요. 빈 행은 제외하며, 입력 행끼리 같은 이름은 한 번만 추가합니다. 기존 항목과 같은 이름을 새로 만들 때는 미리보기에서 선택해 주세요.</p>
                {bulkNames.map((value, index) => <Input key={index} label={`항목 ${index + 1} 이름`} value={value} maxLength={180}
                  onKeyDown={event => {
                    if (event.key !== "Enter" || event.nativeEvent.isComposing || event.keyCode === 229) return;
                    event.preventDefault();
                    if (index === bulkNames.length - 1 && bulkNames.length < 500) {
                      const next = [...bulkNames, ""]; setBulkNames(next); setBulkPreview(false); persistModal({ bulkNames: next });
                    }
                    requestAnimationFrame(() => document.querySelectorAll<HTMLInputElement>('[data-editing-context]').forEach(input => {
                      if (input.dataset.editingContext === `${modalKey}:row:${index + 1}`) input.focus();
                    }));
                  }}
                  data-editing-context={`${modalKey}:row:${index}`} onChange={event => {
                    const next = bulkNames.map((name, row) => row === index ? event.target.value : name);
                    setBulkNames(next); setBulkPreview(false); persistModal({ bulkNames: next });
                  }} />)}
                <Button disabled={bulkNames.length >= 500} onClick={() => { const next = [...bulkNames, ""]; setBulkNames(next); setBulkPreview(false); persistModal({ bulkNames: next }); }}>입력 행 추가</Button>
              </> : <Input
                label="이름"
                value={name}
                data-editing-context={`${modalKey}:name`}
                onChange={(e) => { setName(e.target.value); persistModal({ name: e.target.value }); }}
                required
              />}
              {(dialog === "node" || dialog === "bulk") && (
                <Select
                  label="항목 종류"
                  value={role}
                  onChange={(e) => {
                    setRole(e.target.value as OutlineNode["role"]); setBulkPreview(false); persistModal({ role: e.target.value });
                  }}
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
              {dialog === "bulk" && <>
                <Button disabled={!bulkNames.some(value => value.trim())} onClick={() => { if (subject) setOutlineToken(outlineRevisionToken(data, subject.id, node?.id || null)); setBulkPreview(true); }}>추가할 항목 미리보기</Button>
                {bulkPreview && <section aria-label="추가할 목차 미리보기"><p>{node?.name || subject?.name} 바로 아래에 {previewOutlineEntries(bulkNames).entries.length}개 {labelRole[role]}를 추가합니다.</p><ol>{previewOutlineEntries(bulkNames).entries.map(({name},index) => <li key={index}>{name}</li>)}</ol>
                  {previewOutlineEntries(bulkNames).issues.map((issue,index) => <p role="alert" key={index}>{issue.line}행: {issue.message}</p>)}
                  {bulkExisting.length > 0 && <>
                    <Select label="같은 이름의 기존 항목 처리" value={duplicateChoice} onChange={event => setDuplicateChoice(event.target.value as typeof duplicateChoice)}>
                      <option value="">처리 방법을 선택해 주세요</option><option value="reuse">기존 항목 사용</option><option value="create">같은 이름으로 새 항목 만들기</option>
                    </Select>
                    <ul>{bulkExisting.map((item, index) => <li key={item.id}>{item.name} · 현재 목록의 {index + 1}번째 항목</li>)}</ul>
                    {duplicateChoice === "reuse" && <p>위 기존 항목은 그대로 사용하고 나머지 {bulkEntries.length}개만 추가합니다.</p>}
                  </>}
                </section>}
              </>}
              <Button type="submit" variant="primary" disabled={modalBlocked || (dialog === "bulk" && (!bulkPreview || !previewOutlineEntries(bulkNames).entries.length || previewOutlineEntries(bulkNames).issues.length > 0 || (bulkExisting.length > 0 && !duplicateChoice)))}>
                {dialog === "rename" ? "이름 저장" : "추가하기"}
              </Button>
              <p className="muted">닫아도 초안을 보관합니다. 같은 위치에서 다시 열어 이어 쓸 수 있습니다.</p>
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
                  const undo = notice.undo;
                  setNotice(null);
                  undo?.();
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
export function useTextDraft(key: string, initial: string, version: number, identity?: { entityId: string; restoreIdentity: boolean }) {
  const [boot] = useState(() => {
    try {
      const raw = readRescuedDraft(key) ?? localStorage.getItem(key);
      if (!raw) return { body: initial, version, error: "", entityId: identity?.entityId };
      const draft = JSON.parse(raw);
      if (
        typeof draft.body !== "string" ||
        !Number.isSafeInteger(draft.version) ||
        (draft.entityId !== undefined && (typeof draft.entityId !== "string" || !draft.entityId.trim())) ||
        (identity && !identity.restoreIdentity && draft.entityId !== undefined && draft.entityId !== identity.entityId)
      )
        throw Error();
      return { ...draft, entityId: draft.entityId || identity?.entityId, error: draftReadError(key) } as {
        body: string;
        version: number;
        error: string;
        entityId?: string;
      };
    } catch {
      rememberDraftReadError(key, "초안을 읽지 못했습니다. 저장된 초안을 덮어쓰지 않았습니다.");
      return {
        body: initial,
        version,
        error: "초안을 읽지 못했습니다. 저장된 초안을 덮어쓰지 않았습니다.",
        entityId: identity?.entityId,
      };
    }
  });
  const [body, setBody] = useState(boot.body),
    [error, setError] = useState(boot.error || (draftHasUnstoredText(key) ? "저장 실패한 입력을 이 창에서 유지하고 있습니다. 다시 저장하거나 복사해 주세요." : ""));
  const [blocked, setBlocked] = useState(Boolean(boot.error));
  const [cleanupPending, setCleanupPending] = useState(false);
  const expected = useRef(boot.version);
  // A remote refresh may replace only a clean editor. Restored or unsaved text
  // keeps its original version so a later save still detects a conflict.
  const dirty = useRef(boot.body !== initial || boot.version !== version || Boolean(boot.error) || draftHasUnstoredText(key));
  useEffect(() => {
    if (dirty.current || blocked || cleanupPending || error || version < expected.current) return;
    expected.current = version;
    setBody(initial);
  }, [initial, version, blocked, cleanupPending, error]);
  const change = (value: string) => {
    dirty.current = true;
    setCleanupPending(false);
    setBody(value);
    if (blocked) { rescueWithoutOverwrite(key, JSON.stringify({body: value, version: expected.current, ...(identity ? { entityId: boot.entityId } : {})})); return; }
    try {
      storeDraftSafely(
        key,
        JSON.stringify({ body: value, version: expected.current, ...(identity ? { entityId: boot.entityId } : {}) }),
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
    dirty.current = false;
    try {
      clearStoredDraft(key);
      setCleanupPending(false); setError("");
      return true;
    } catch {
      setCleanupPending(true);
      setError("내용은 저장했지만 이전 초안 정리를 못했습니다. 창을 닫기 전에 다시 시도해 주세요.");
      return false;
    }
  };
  const retry = () => {
    try {
      if (cleanupPending) { clearStoredDraft(key); setCleanupPending(false); setError(""); return; }
      if (blocked) archiveDamagedDraft(key);
      storeDraftSafely(key, JSON.stringify({ body, version: expected.current, ...(identity ? { entityId: boot.entityId } : {}) }));
      setBlocked(false); setError("");
    } catch (reason) { setError(reason instanceof DraftArchiveError ? reason.message : "초안을 보관하지 못했습니다. 원본과 현재 창의 입력은 유지했습니다. 저장 공간을 확인한 뒤 다시 시도해 주세요."); }
  };
  return { body, change, error, blocked, expected, clear, retry, cleanupPending, entityId: boot.entityId };
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
  inline = false,
  repository,
}: {
  data: AppState;
  kind: NarrativeKind;
  ownerId: string | null;
  label: string;
  commit: Commit;
  narrativeId?: string;
  newNote?: boolean;
  onSaved?: (id: string, cleanupKey?: string) => void;
  draftKey?: string;
  inline?: boolean;
  repository?: StudyRepository;
}) {
  const original = active(data.narratives).find(
    (n) => !newNote && (narrativeId ? n.id === narrativeId : n.kind === kind && n.ownerId === ownerId),
  );
  const initialId = useRef(original?.id || narrativeId || uid());
  const storageKey = draftKey || `${storagePrefix(data)}:narrative:${kind}:${ownerId}`;
  // Tab-local presentation only; the existing draft remains the owner of text.
  const disclosureKey = `${storagePrefix(data)}:narrative-disclosure:${storageKey}`;
  const [expanded, setExpanded] = useState(() => {
    if (inline) return true;
    try {
      const saved = sessionStorage.getItem(disclosureKey);
      if (saved === "open" || saved === "closed") return saved === "open";
    } catch { /* A missing view hint must not block writing. */ }
    return kind === "free-note";
  });
  const draft = useTextDraft(storageKey, original?.body || "", original?.version || 0,
    { entityId: initialId.current, restoreIdentity: newNote || (!original && !narrativeId) });
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false), [saveError, setSaveError] = useState('');
  const savingGuard = useRef(false), mounted = useRef(true);
  useEffect(() => { mounted.current = true; return () => { mounted.current = false; }; }, []);
  const stableId = draft.entityId || initialId.current;
  const alreadyCreated = newNote ? active(data.narratives).find(item => item.id === stableId && item.kind === kind && item.ownerId === ownerId) : undefined;
  const save = async () => {
    if (savingGuard.current || draft.blocked) return;
    savingGuard.current = true; setSaving(true); setSaveError('');
    try {
      // A failed server transmission retains the original queued operation. Retry
      // that operation when this exact text is already committed on this device.
      const queued = repository?.getSnapshot().narratives.find(item => item.id === stableId && !item.deletedAt && item.kind === kind && item.ownerId === ownerId && item.body === draft.body);
      // A previous successful create may have outlived draft cleanup. Reuse that identity.
      if (!repository && alreadyCreated && alreadyCreated.body === draft.body) {
        const cleaned = draft.clear(alreadyCreated.version);
        setSaved(true); onSaved?.(stableId, cleaned ? undefined : storageKey); return;
      }
      const result = queued ? repository!.getSnapshot() : commit(
        {
          type: "updateNarrative",
          id: stableId,
          kind,
          ownerId,
          body: draft.body,
          expectedVersion: draft.expected.current,
        },
        repository ? undefined : `${label}을 저장했습니다.`,
      );
      if (result) {
        if (repository) {
          // Keep the text draft, but advance its base to the local commit so that
          // a failed transmission can be followed by further edits and a retry.
          draft.expected.current = result.narratives.find(n => n.id === stableId)!.version;
          draft.change(draft.body);
        }
        if (repository && data.namespace !== 'demo') {
          if (!repository.flush || !repository.getStatus) throw new Error('서버 저장을 확인하지 못했습니다. 입력은 이 기기에 남아 있습니다.');
          await repository.flush();
          if (!mounted.current) return;
          const status = repository.getStatus();
          if (status.phase !== 'saved' || status.pending !== 0) throw new Error(`${status.message} 편집 내용은 유지했습니다. 다시 저장해 주세요.`);
        }
        if (!mounted.current) return;
        const cleaned = draft.clear(
          result.narratives.find((n) => n.id === stableId)!.version,
        );
        setSaved(true);
        onSaved?.(stableId, cleaned ? undefined : storageKey);
      } else if (repository) {
        setSaveError('내용을 저장하지 못했습니다. 편집 내용은 유지했습니다. 다시 저장해 주세요.');
      }
    } catch (reason) {
      if (mounted.current) setSaveError(message(reason));
    } finally {
      savingGuard.current = false;
      if (mounted.current) setSaving(false);
    }
  };
  return (
    <details className="narrative-editor" open={expanded} onToggle={(event) => {
      const open = event.currentTarget.open;
      setExpanded(open);
      try { sessionStorage.setItem(disclosureKey, open ? "open" : "closed"); }
      catch { /* Keep the current interaction usable if view-hint storage is denied. */ }
    }}>
      <summary data-navigation-focus={`${storageKey}:disclosure`}>
        {label}
        {original?.body ? " · 작성한 내용 있음" : " · 선택"}
      </summary>
      <div className="field-stack">
        <Textarea
          label={label}
          data-editing-context={draftKey || `narrative:${kind}:${ownerId}`}
          value={draft.body}
          readOnly={saving}
          onChange={(e) => {
            draft.change(e.target.value);
            setSaved(false);
            setSaveError('');
          }}
          rows={kind === "free-note" ? 10 : 4}
          placeholder="자신의 말로 자유롭게 남겨 보세요."
        />
        <p className="muted" role="status">
          {saved && !saving && !saveError && <SavedMark />}
          {saving ? (repository && data.namespace !== 'demo' ? '서버에 저장 중입니다…' : '저장 중입니다…') : saved
            ? (repository && data.namespace !== 'demo' ? '서버에 저장했습니다.' : "이 기기에 저장했습니다.")
            : "입력은 이 기기의 초안으로 보관됩니다. 내용 저장을 누르면 수정 이력에 남습니다."}
        </p>
        {saveError && <ErrorState message={saveError} />}
        {alreadyCreated && alreadyCreated.body !== draft.body && draft.expected.current !== alreadyCreated.version && <>
          <p role="alert">이 초안의 자유 기록은 이미 저장되어 있습니다. 현재 초안과 저장된 글이 달라 원문을 유지했습니다. 저장된 글을 확인해 주세요.</p>
          <a href={`#/free/${stableId}`}>저장된 자유 기록 열기</a>
        </>}
        {draft.error && <><ErrorState message={draft.error} /><Button onClick={draft.retry}>{draft.blocked ? "원본 사본 보관 후 입력 이어가기" : draft.cleanupPending ? "저장한 초안 정리 다시 시도" : "초안 다시 보관"}</Button></>}
        <Button disabled={draft.blocked} busy={saving} onClick={() => { void save(); }}>
          {saving ? '저장 중…' : saveError ? '저장 다시 시도' : '내용 저장'}
        </Button>
      </div>
    </details>
  );
}
function FreeNotes({ data, route, commit, onCleanupFailure }: { data: AppState; route: string; commit: Commit; onCleanupFailure: (key: string) => void }) {
  const notes = active(data.narratives).filter(n => n.kind === "free-note" && n.ownerId === null);
  const [legacy] = useState(() => {
    try {
      const key = `${storagePrefix(data)}:free-default-id`;
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
          draftKey={creating ? `${storagePrefix(data)}:narrative:free-note:new` : id === legacy.id ? `${storagePrefix(data)}:narrative:free-note:null` : `${storagePrefix(data)}:narrative:free-note:id:${id}`}
          onSaved={creating ? (savedId, cleanupKey) => { if (cleanupKey) onCleanupFailure(cleanupKey); go(`/free/${savedId}`); } : undefined} />}
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
  subjectIds,
  initialTarget,
  commit,
  onSaved,
}: {
  data: AppState;
  subjectIds: string[];
  initialTarget?: string;
  commit: Commit;
  onSaved: (warning?: string, cleanupKey?: string) => void;
}) {
  const key = initialTarget || "multiple";
  const [boot] = useState(() => {
    try {
      const storageKey = `${storagePrefix(data)}:draft:${key}`;
      const rescued = readRescuedDraft(storageKey);
      if (rescued === "") return { draft: null, error: "" };
      if (rescued) { const draft = JSON.parse(rescued); validateFormDraft(draft, key); return { draft, error: draftReadError(storageKey) }; }
      return { draft: readDraft(localStorage, key, storagePrefix(data)), error: draftReadError(storageKey) };
    } catch (e) {
      rememberDraftReadError(`${storagePrefix(data)}:draft:${key}`, message(e));
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
  const [draftError, setDraftError] = useState(boot.error || (draftHasUnstoredText(`${storagePrefix(data)}:draft:${key}`) ? "저장에 실패한 입력을 이 창에서 유지합니다. 다시 저장하거나 복사해 주세요." : ""));
  const [draftBlocked, setDraftBlocked] = useState(Boolean(boot.error));
  const [filter, setFilter] = useState(() => readPreference(`record-filter:${key}`, "", storagePrefix(data)));
  useEffect(() => { writePreference(`record-filter:${key}`, filter, storagePrefix(data)); }, [key, filter]);
  const guard = useRef(false);
  const nodes = active(data.nodes).filter(
    (n) => n.role === "topic" || n.id === initialTarget,
  );
  const pickerSubjects = active(data.subjects).filter(subject => subjectIds.includes(subject.id));
  const pickerNodes = nodes.filter(node => subjectIds.includes(node.subjectId));
  const hasMatches = pickerNodes.some(node => node.name.includes(filter));
  const selectedOutsideScope = form.selectedIds.some(id => !pickerNodes.some(node => node.id === id));
  const change = (next: FormDraft) => {
    currentForm.current = next;
    setForm(next);
    const storageKey = `${storagePrefix(data)}:draft:${key}`;
    if (draftBlocked) { rescueWithoutOverwrite(storageKey, JSON.stringify(next)); return; }
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
    if (guard.current || draftBlocked) return;
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
        clearStoredDraft(`${storagePrefix(data)}:draft:${key}`);
      } catch {
        warning =
          "기록은 저장했습니다. 초안 정리에 실패해 이전 초안이 남아 있을 수 있습니다.";
      }
      onSaved(warning, warning ? `${storagePrefix(data)}:draft:${key}` : undefined);
    } else guard.current = false;
  };
  return (
    <div className="record-layout">
      <section className="topic-picker">
        <h2>공부한 주제</h2>
        <Search label="주제 찾기" defaultValue={filter} onQueryChange={setFilter} />
        {pickerSubjects.map(subject => {
          const matching = pickerNodes.filter(node => node.subjectId === subject.id && node.name.includes(filter));
          if (!matching.length) return null;
          const groups = [...new Set(matching.map(node => node.parentId))];
          return <fieldset className="record-topic-group" key={subject.id}><legend>{subject.name}</legend>{groups.map(parentId => <div key={parentId ?? 'root'}>
            {parentId && <h3 className="record-unit-heading">{recallPath(data.nodes, parentId).map(node => node.name).join(' / ')}</h3>}
            {matching.filter(node => node.parentId === parentId).map(node => <Checkbox key={node.id} label={node.name} checked={form.selectedIds.includes(node.id)} onChange={event => select(node.id, event.target.checked)} />)}
          </div>)}</fieldset>;
        })}
        {!hasMatches && <EmptyState
          title={filter ? "검색어에 맞는 주제가 없습니다" : "이 공부 범위에는 기록할 주제가 없습니다"}
          message={filter ? "검색어를 바꾸거나 상단의 공부 범위를 확인해 주세요. 작성 중인 내용은 유지합니다." : "상단에서 다른 공부 범위를 고르거나 과목에서 주제를 추가해 주세요."}
        />}
      </section>
      <section className="record-compose">
        {form.selectedIds.length > 0 && <p className="muted record-help">일부만 했거나 막혔어도 남겨 주세요. 글은 선택입니다.</p>}
        {selectedOutsideScope && <p className="muted">범위를 바꾸기 전에 고른 주제도 아래에 유지했습니다. 함께 저장할 수 있습니다.</p>}
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
            <div className="record-entry-heading"><h2>
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
            </div>
            <Textarea
              label="메모" hint="선택 입력"
              data-editing-context={`record-draft:${key}:${id}`}
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
              contextKey={`record-draft:${key}:${form.sessionId}:${id}`}
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
            title="공부한 주제를 골라 주세요"
            message="여러 주제를 함께 기록할 수 있습니다. 글 없이 공부함만 남겨도 됩니다."
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
        {draftError && <><ErrorState message={draftError} /><Button onClick={() => {
          const storageKey = `${storagePrefix(data)}:draft:${key}`;
          try {
            if (draftBlocked) archiveDamagedDraft(storageKey);
            validateFormDraft(currentForm.current, key);
            storeDraftSafely(storageKey, JSON.stringify(currentForm.current));
            setDraftBlocked(false); setDraftError("");
          } catch (reason) { setDraftError(reason instanceof DraftArchiveError ? reason.message : "초안을 보관하지 못했습니다. 원본과 현재 창의 입력은 유지했습니다. 저장 공간을 확인한 뒤 다시 시도해 주세요."); }
        }}>{draftBlocked ? "원본 사본 보관 후 입력 이어가기" : "초안 다시 보관"}</Button></>}
        <div className="save-bar">
          <span className="muted">
            {boot.draft
              ? "이 기기의 초안을 이어 쓰고 있습니다."
              : "이 기기에 초안을 보관합니다."}
          </span>
          <Button
            variant="primary"
            disabled={!form.selectedIds.length || draftBlocked}
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
    `${storagePrefix(record)}:record:${record.id}`,
    record.body,
    record.version,
  );
  const review = record.trace.Cself1?.examReview;
  const answer = useTextDraft(
    `${storagePrefix(record)}:review:${record.id}`,
    review?.answer || "",
    record.version,
  );
  const [editing, setEditing] = useState(body.body !== record.body);
  return (
    <Card className="record-card" data-reading-anchor={`record:${record.id}`}>
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
            data-editing-context={`record:${record.id}`}
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
      {body.error && <><ErrorState message={body.error} /><Button onClick={body.retry}>{body.blocked ? "원본 사본 보관 후 입력 이어가기" : body.cleanupPending ? "저장한 초안 정리 다시 시도" : "초안 다시 보관"}</Button></>}
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
          data-editing-context={`review:${record.id}`}
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
        {answer.error && <><ErrorState message={answer.error} /><Button onClick={answer.retry}>{answer.blocked ? "원본 사본 보관 후 입력 이어가기" : answer.cleanupPending ? "저장한 초안 정리 다시 시도" : "초안 다시 보관"}</Button></>}
        <p className="muted">
          서술 점검은 실제 정확성이나 목표 달성과 별개입니다.
        </p>
        </>}
      </details>
    </Card>
  );
}
