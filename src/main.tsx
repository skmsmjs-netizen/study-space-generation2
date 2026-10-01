import { createRoot } from "react-dom/client";
import App from "./App";
import { ScreenBoundary } from "./ui";
import { BackupRecoveryGate } from "./ui/full-backup";
import "./app.css";
createRoot(document.getElementById("root")!).render(<ScreenBoundary><BackupRecoveryGate><App /></BackupRecoveryGate></ScreenBoundary>);
