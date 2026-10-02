import {
  WorkspaceSearchIndex,
  type SearchWorkerMessage,
  type SearchWorkerResponse,
} from './workspace-search-engine';
const index = new WorkspaceSearchIndex();
self.onmessage = (event: MessageEvent<SearchWorkerMessage>) => {
  const message = event.data;
  try {
    if (message.type === 'index') index.apply(message);
    else {
      const result = index.query(message);
      if (result) self.postMessage(result);
    }
  } catch {
    if (message.type === 'query')
      self.postMessage({
        owner: message.owner,
        revision: message.revision,
        request: message.request,
        error: true,
      } satisfies SearchWorkerResponse);
  }
};
