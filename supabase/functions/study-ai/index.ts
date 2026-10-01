// src/domain/model.ts
var DomainError = class extends Error {
  constructor(code, message, details) {
    super(message);
    this.code = code;
    this.details = details;
    this.name = "DomainError";
  }
  code;
  details;
};

// src/domain/ai-access.ts
var AI_OWNER_USER_ID = "d33cf234-2998-43bd-b420-3ac056db4bea";
function canUseOwnerAI(identity) {
  return identity.userId === AI_OWNER_USER_ID && identity.namespace === "personal";
}
function requireOwnerAI(identity) {
  if (!canUseOwnerAI(identity)) throw new DomainError("AI_OWNER_REQUIRED", "AI \uC5F0\uACB0\uACFC \uC0DD\uC131\uC740 \uC18C\uC720\uC790 \uACC4\uC815\uC5D0\uC11C\uB9CC \uC0AC\uC6A9\uD560 \uC218 \uC788\uC2B5\uB2C8\uB2E4.");
}

// src/domain/study-ai-request.ts
var CURRENT_STUDY_AI_TASKS = {
  quiz: {
    label: "\uAC1D\uAD00\uC2DD \uD034\uC988",
    instruction: "\uC81C\uACF5\uB41C \uC790\uB8CC\uB9CC\uC73C\uB85C \uB2F5\uD560 \uC218 \uC788\uB294 \uAC1D\uAD00\uC2DD \uBB38\uD56D\uC744 quiz\uC5D0 \uB9CC\uB4E0\uB2E4. \uBCF4\uAE30\uC758 \uC815\uB2F5\uC740 \uD558\uB098\uC774\uACE0 \uC624\uB2F5\uB3C4 \uAC19\uC740 \uC885\uB958\uB85C \uADF8\uB7F4\uB4EF\uD574\uC57C \uD55C\uB2E4. \uBB38\uC81C\xB7\uBCF4\uAE30\uC640 \uC815\uB2F5\xB7\uD574\uC124\uC744 \uBD84\uB9AC\uD558\uACE0 summary\uC640 cards\uB294 \uBE44\uC6B4\uB2E4."
  },
  tutor: {
    label: "\uC790\uB8CC\uC5D0 \uC9C8\uBB38",
    instruction: "request-focus\uC758 \uC9C8\uBB38\uC5D0 \uC790\uB8CC\uB97C \uADFC\uAC70\uB85C \uB2F5\uD55C\uB2E4. history\uB294 \uC774\uC804 \uB300\uD654\uC774\uBA70 \uC6D0\uBB38 \uADFC\uAC70\uAC00 \uC544\uB2C8\uB2E4. \uC790\uB8CC\uB85C \uD655\uC778\uD560 \uC218 \uC5C6\uB294 \uB0B4\uC6A9\uC740 \uD655\uC778 \uBD88\uAC00\uB77C\uACE0 \uBC1D\uD78C\uB2E4. cards\uB294 \uBE44\uC6B4\uB2E4."
  },
  mindmap: {
    label: "\uAC1C\uB150\uB3C4 \uB9CC\uB4E4\uAE30",
    instruction: "\uC790\uB8CC\uC758 \uC2E4\uC81C \uAC1C\uB150\uACFC \uAD00\uACC4\uB97C map\uC5D0 \uB9CC\uB4E0\uB2E4. \uAC01 \uAC1C\uB150\uACFC \uAD00\uACC4\uC758 sourceIds\uB97C \uC5F0\uACB0\uD55C\uB2E4. \uD3EC\uD568\xB7\uC6D0\uC778\xB7\uC870\uAC74\xB7\uC120\uD589\xB7\uBE44\uAD50 \uAD00\uACC4\uB97C label\uC5D0 \uBA85\uC2DC\uD55C\uB2E4. summary\uC5D0\uB294 \uD574\uC11D \uC870\uAC74\uB9CC \uC801\uACE0 cards\uB294 \uBE44\uC6B4\uB2E4."
  },
  summary: {
    label: "\uC694\uC57D\uACFC \uCE74\uB4DC",
    instruction: "\uC6D0\uBB38\uC758 \uD575\uC2EC\uACFC \uB0A8\uC740 \uC758\uBB38\uC744 \uC694\uC57D\uD558\uACE0 \uC790\uB8CC\uB85C \uB2F5\uD560 \uC218 \uC788\uB294 \uC778\uCD9C \uCE74\uB4DC\uB97C \uB9CC\uB4E0\uB2E4."
  },
  formula: {
    label: "\uC218\uC2DD \uBCF4\uC644",
    instruction: "\uB9D0\uB85C \uC4F4 \uC2DD\uC774\uB098 \uBD80\uBD84 \uC218\uC2DD\uC744 \uD3B8\uC9D1 \uAC00\uB2A5\uD55C LaTeX\uB85C \uC81C\uC548\uD55C\uB2E4. \\( ... \\) \uB610\uB294 $$ ... $$\uB97C \uC4F4\uB2E4. \uAE30\uD638 \uB73B\xB7\uB2E8\uC704\xB7\uC131\uB9BD \uC870\uAC74\xB7\uC5EC\uB7EC \uAC00\uB2A5\uD55C \uD574\uC11D\uC744 \uD568\uAED8 \uC124\uBA85\uD55C\uB2E4. \uC785\uB825 \uBD88\uD3B8\uC73C\uB85C \uBE44\uC6B4 \uC2DD\uC744 \uC9C0\uC2DD \uBD80\uC871\uC73C\uB85C \uD310\uC815\uD558\uC9C0 \uC54A\uB294\uB2E4."
  },
  questions: {
    label: "\uC778\uCD9C \uC9C8\uBB38",
    instruction: "\uC120\uD0DD \uC790\uB8CC \uC548\uC758 \uD575\uC2EC \uC6D0\uB9AC\uB97C \uBB3B\uB294 \uC778\uCD9C \uC9C8\uBB38\uC744 \uB9CC\uB4E0\uB2E4. \uB2F5\uACFC \uADFC\uAC70\uB294 \uCE74\uB4DC\uC758 answer\uC5D0\uB9CC \uB123\uACE0 summary\uC5D0 \uC815\uB2F5\uC744 \uB178\uCD9C\uD558\uC9C0 \uC54A\uB294\uB2E4."
  },
  organize: {
    label: "\uD544\uAE30 \uC815\uB9AC",
    instruction: "\uC6D0\uBB38 \uC21C\uC11C\xB7\uC870\uAC74\xB7\uC774\uC720\xB7\uC608\uC678\xB7\uAC1C\uC778 \uC758\uACAC\uC744 \uBCF4\uC874\uD558\uC5EC \uC77D\uAE30 \uC26C\uC6B4 \uC815\uB9AC\uC548\uC744 \uB9CC\uB4E0\uB2E4. \uC2E4\uC81C \uC758\uBB38\uACFC \uB2E4\uC74C \uD589\uB3D9\uC740 \uC6D0\uBB38 \uADFC\uAC70\uC640 \uD568\uAED8 \uAD6C\uBD84\uD558\uACE0 \uC758\uBB34\uB098 \uC77C\uC815\uC73C\uB85C \uD655\uC815\uD558\uC9C0 \uC54A\uB294\uB2E4."
  },
  glossary: {
    label: "\uC6A9\uC5B4 \uD480\uC774",
    instruction: "\uC785\uB825 \uBB38\uB9E5\uC758 \uC6A9\uC5B4\xB7\uC6D0\uC5B4\xB7\uBC88\uC5ED\xB7\uC758\uBBF8\uB97C \uD480\uC5B4 \uC4F4\uB2E4. \uAD50\uC7AC\uC758 \uD2B9\uC218 \uC815\uC758\uB97C \uBCF4\uC874\uD558\uACE0 \uC77C\uBC18\uC801\uC778 \uBCF4\uCDA9 \uC124\uBA85\uACFC \uC6D0\uBB38\uC758 \uC124\uBA85\uC744 \uAD6C\uBCC4\uD55C\uB2E4."
  },
  explain: {
    label: "\uB2E4\uB978 \uBC29\uC2DD\uC73C\uB85C \uC124\uBA85",
    instruction: "\uC870\uAC74\uC744 \uBCF4\uC874\uD558\uBA70 \uBB38\uC7A5\xB7\uC218\uC2DD\xB7\uC218\uCE58 \uC608\uB85C \uB2E4\uC2DC \uC124\uBA85\uD55C\uB2E4. \uC0AC\uC6A9\uC790\uC758 \uC218\uC900\uC774\uB098 \uACE0\uC815 \uD559\uC2B5 \uC2A4\uD0C0\uC77C\uC744 \uCD94\uC815\uD558\uC9C0 \uC54A\uB294\uB2E4. \uC6D0\uBB38 \uBC16\uC758 \uBCF4\uCDA9\uC740 \uBCF4\uCDA9 \uC124\uBA85\uC774\uB77C\uACE0 \uBC1D\uD78C\uB2E4."
  },
  reasoning: {
    label: "\uC124\uBA85\xB7\uB17C\uB9AC \uAC80\uD1A0",
    instruction: "\uC2E4\uC81C \uC11C\uC220\xB7\uC99D\uBA85\xB7\uC720\uB3C4\uC5D0\uC11C \uC870\uAC74\uACFC \uBB38\uC7A5 \uC0AC\uC774\uC758 \uBE60\uC9C4 \uADFC\uAC70\xB7\uB2E4\uB978 \uD574\uC11D\uC744 \uC9DA\uB294\uB2E4. \uAE00\uC5D0 \uC0DD\uB7B5\uD55C \uC124\uBA85\uC744 \uAC1C\uB150 \uBB34\uC9C0\uB85C \uD310\uC815\uD558\uC9C0 \uC54A\uB294\uB2E4. \uC6D0\uBB38 \uC704\uCE58\uC640 \uD655\uC778\uD560 \uC9C8\uBB38\uC744 \uB0A8\uAE30\uACE0 \uC218\uC815\uC548\uC740 \uBCC4\uB3C4\uB85C \uC81C\uC2DC\uD55C\uB2E4."
  },
  code: {
    label: "\uCF54\uB4DC\xB7\uC2E4\uD589 \uAC80\uD1A0",
    instruction: "\uC81C\uACF5\uB41C \uC2E4\uC81C \uCF54\uB4DC\xB7\uC785\uB825\xB7\uC2E4\uD589 \uACB0\uACFC\xB7\uBA54\uBAA8\uC5D0 \uADFC\uAC70\uD574 \uC81C\uC5B4 \uD750\uB984\xB7\uC624\uB958 \uC704\uCE58\xB7\uC218\uC815 \uD6C4\uBCF4\xB7\uD655\uC778\uD560 \uB2E4\uB978 \uC785\uB825\uC744 \uC124\uBA85\uD55C\uB2E4. \uD604\uC7AC \uCF54\uB4DC\uC640 \uACFC\uAC70 \uC2E4\uD589 \uB2F9\uC2DC \uCF54\uB4DC\uB97C \uAD6C\uBCC4\uD558\uACE0 GPT\uC758 \uC608\uCE21\uC744 \uC2E4\uC81C \uC2E4\uD589 \uACB0\uACFC\uB85C \uBC14\uAFB8\uC9C0 \uC54A\uB294\uB2E4. \uC0C8 \uCF54\uB4DC\uB97C \uC2E4\uD589\uD558\uAC70\uB098 \uB3C5\uB9BD \uC791\uC131 \uB2A5\uB825\xB7\uACF5\uBD80 \uC644\uB8CC\uB97C \uD310\uC815\uD558\uC9C0 \uC54A\uB294\uB2E4."
  },
  conditions: {
    label: "\uC801\uC6A9 \uC870\uAC74\uACFC \uBC18\uB840",
    instruction: "\uC8FC\uC5B4\uC9C4 \uAC1C\uB150\xB7\uBA85\uC81C\uC758 \uC801\uC6A9 \uC870\uAC74, \uC608\uC640 \uBE44\uC608, \uBC18\uB840 \uD6C4\uBCF4\uC640 \uD655\uC778\uD560 \uC774\uC720\uB97C \uC124\uBA85\uD55C\uB2E4. \uACC4\uC0B0\xB7\uBC18\uB840\uAC00 \uAC80\uC99D\uB410\uB2E4\uACE0 \uC8FC\uC7A5\uD558\uC9C0 \uC54A\uB294\uB2E4."
  },
  compare: {
    label: "\uAC1C\uB150 \uBE44\uAD50",
    instruction: "\uC0AC\uC6A9\uC790\uAC00 \uC9C0\uC815\uD55C \uC2E4\uC81C \uB450 \uAC1C\uB150\uC758 \uC815\uC758\xB7\uCC28\uC774\xB7\uC801\uC6A9 \uC0C1\uD669\uC744 \uBE44\uAD50\uD55C\uB2E4. \uC774\uB984\uC774\uB098 \uBAA9\uCC28\uB9CC\uC73C\uB85C \uD63C\uB3D9\uC744 \uCD94\uC815\uD558\uC9C0 \uC54A\uB294\uB2E4. \uB300\uC0C1\uC774 \uBD88\uBA85\uD655\uD558\uBA74 \uD655\uC778\uD560 \uC9C8\uBB38\uC744 \uB0A8\uAE34\uB2E4."
  },
  diagram: {
    label: "\uAD00\uACC4\uB3C4 \uCD08\uC548",
    instruction: "\uAD00\uACC4\uB97C \uAE00\uB85C \uBA85\uD655\uD788 \uC124\uBA85\uD558\uACE0 \uD3B8\uC9D1 \uAC00\uB2A5\uD55C Mermaid \uCF54\uB4DC \uBE14\uB85D\uC73C\uB85C \uC791\uC740 \uAD00\uACC4\uB3C4 \uCD08\uC548\uC744 \uC81C\uC548\uD55C\uB2E4. \uC778\uACFC\xB7\uD3EC\uD568\xB7\uC120\uD589\xB7\uC720\uC0AC\uB97C \uAD6C\uBD84\uD55C\uB2E4. \uAE30\uC874 Canvas \uC88C\uD45C\uB098 \uC5F0\uACB0\uC744 \uBC14\uAFB8\uC5C8\uB2E4\uACE0 \uD558\uC9C0 \uC54A\uB294\uB2E4."
  },
  hint: {
    label: "\uB2E4\uC74C \uB2E8\uACC4 \uD78C\uD2B8",
    instruction: "\uC2E4\uC81C \uBB38\uC81C\uC640 \uD604\uC7AC \uC2DC\uB3C4\uC5D0\uC11C \uC870\uAC74 \uD655\uC778\xB7\uC804\uB7B5\xB7\uB2E4\uC74C \uD55C \uB2E8\uACC4\uAE4C\uC9C0\uB9CC \uD78C\uD2B8\uB97C \uC900\uB2E4. \uC804\uCCB4 \uC815\uB2F5\uC774\uB098 \uD480\uC774\uB97C \uBA3C\uC800 \uB178\uCD9C\uD558\uC9C0 \uC54A\uB294\uB2E4. \uB9C9\uD798\uC758 \uC6D0\uC778\uC740 \uAC00\uC124\uB85C\uB9CC \uD45C\uD604\uD55C\uB2E4."
  },
  feedback: {
    label: "\uB2F5\uC548 \uAC80\uD1A0",
    instruction: "\uC2E4\uC81C \uBB38\uC81C\xB7\uB2F5\uC548\xB7\uCC38\uACE0 \uAE30\uC900\uC744 \uB300\uC870\uD55C\uB2E4. \uC870\uAC74\xB7\uACC4\uC0B0\xB7\uB2E8\uC704\xB7\uC124\uBA85 \uC0DD\uB7B5\uC744 \uAD6C\uBD84\uD558\uBA70 \uB2E4\uB978 \uAC00\uB2A5\uD55C \uD480\uC774\uB97C \uD5C8\uC6A9\uD55C\uB2E4. \uC6D0\uC778\uC740 \uAC00\uC124\uC774\uACE0 \uADFC\uAC70\uAC00 \uBD80\uC871\uD558\uBA74 \uD655\uC778 \uBD88\uAC00\uB77C\uACE0 \uC4F4\uB2E4. \uACF5\uC2DD \uC810\uC218\xB7\uC219\uB2EC\xB7\uB3C5\uB9BD \uC218\uD589\uC744 \uD310\uC815\uD558\uC9C0 \uC54A\uB294\uB2E4."
  },
  practice: {
    label: "\uB2E4\uB978 \uB9E5\uB77D\uC758 \uC7AC\uC5F0\uC2B5",
    instruction: "\uC2E4\uC81C \uBB38\uC81C\uC640 \uD655\uC778\uD560 \uCC38\uACE0 \uD480\uC774\uC5D0 \uADFC\uAC70\uD574 \uAC19\uC740 \uC6D0\uB9AC\uB97C \uB2E4\uB978 \uB9E5\uB77D\uC5D0\uC11C \uBB3B\uB294 \uCE74\uB4DC\uB97C \uB9CC\uB4E0\uB2E4. \uC9C8\uBB38\uACFC \uD574\uC124\uC744 \uBD84\uB9AC\uD558\uACE0 \uBC94\uC704 \uBC16 \uAC1C\uB150\xB7\uD574 \uC5C6\uC74C\xB7\uBAA8\uD638\uD55C \uC870\uAC74\uC744 \uC810\uAC80\uD560 \uB300\uC0C1\uC73C\uB85C \uD45C\uC2DC\uD55C\uB2E4. \uC790\uCCB4 \uAC80\uD1A0\uB97C \uAC80\uC99D \uC644\uB8CC\uB77C\uACE0 \uD558\uC9C0 \uC54A\uB294\uB2E4."
  },
  reflect: {
    label: "\uAE30\uB85D \uBCC0\uD654 \uB3CC\uC544\uBCF4\uAE30",
    instruction: "\uC785\uB825\uC5D0 \uC2E4\uC81C\uB85C \uC788\uB294 \uB0A0\uC9DC\xB7\uC774\uC804 \uC124\uBA85\xB7\uC790\uAE30 \uC815\uC815\uC744 \uBE44\uAD50\uD55C\uB2E4. \uBC18\uBCF5 \uC9C8\uBB38\uC744 \uBCF4\uC5EC \uC8FC\uB418 \uBBF8\uAE30\uB85D\uC744 \uD574\uACB0\uC774\uB098 \uC2E4\uD328\uB85C, \uAE34 \uAE00\uC744 \uC2E4\uB825 \uC0C1\uC2B9\uC73C\uB85C \uD310\uB2E8\uD558\uC9C0 \uC54A\uB294\uB2E4. \uB0A0\uC9DC\uAC00 \uC5C6\uC73C\uBA74 \uBCC0\uD654 \uC21C\uC11C\uB97C \uB2E8\uC815\uD558\uC9C0 \uC54A\uB294\uB2E4."
  },
  "next-study": {
    label: "\uB2E4\uC74C \uACF5\uBD80 \uC81C\uC548",
    instruction: "\uC2E4\uC81C \uC758\uBB38\xB7\uB9C9\uD798\uACFC \uC81C\uACF5\uB41C \uBAA9\uD45C\uC5D0 \uADFC\uAC70\uD55C \uC791\uC740 \uD589\uB3D9\uC744 \uC81C\uC548\uD55C\uB2E4. \uC5C6\uB294 \uBB38\uC81C\xB7\uC790\uB8CC\xB7\uC2DC\uAC04\xB7\uAC10\uC815\uC744 \uAC00\uC815\uD558\uC9C0 \uC54A\uB294\uB2E4. \uACF5\uBD80 \uD69F\uC218\xB7\uBCF5\uC2B5 \uB0A0\uC9DC\xB7\uC131\uACFC\uB97C \uC0C8\uB85C \uACC4\uC0B0\uD558\uC9C0 \uC54A\uACE0 \uC81C\uC548\uC744 \uC644\uB8CC\xB7\uC758\uBB34\uB85C \uB9CC\uB4E4\uC9C0 \uC54A\uB294\uB2E4."
  }
};
var STUDY_AI_TASKS = Object.defineProperty(CURRENT_STUDY_AI_TASKS, "source-qa", { value: CURRENT_STUDY_AI_TASKS.tutor, enumerable: false });
var isStudyAITask = (value) => typeof value === "string" && (value === "source-qa" || Object.hasOwn(STUDY_AI_TASKS, value));
function validateStudyAIRequest(value, complete = true) {
  const row = value;
  if (!row || !isStudyAITask(row.task))
    throw new DomainError("INVALID_AI_REQUEST", "GPT \uC791\uC5C5\uC744 \uACE8\uB77C \uC8FC\uC138\uC694.");
  for (const key of ["problem", "attempt", "reference", "focus"])
    if (row[key] !== void 0 && (typeof row[key] !== "string" || row[key].length > 3e4))
      throw new DomainError("INVALID_AI_REQUEST", "\uCD94\uAC00 \uB0B4\uC6A9\uC744 3\uB9CC \uC790 \uC774\uB0B4\uB85C \uB098\uB204\uC5B4 \uC8FC\uC138\uC694.");
  if (row.history !== void 0 && (!Array.isArray(row.history) || row.history.length > 6 || row.history.some(
    (turn) => !turn || typeof turn.question !== "string" || turn.question.length > 1e4 || typeof turn.answer !== "string" || turn.answer.length > 2e4
  ) || JSON.stringify(row.history).length > 4e4))
    throw new DomainError("INVALID_AI_REQUEST", "\uC774\uC804 \uC9C8\uBB38\uC758 \uBC94\uC704\uB97C \uB098\uB204\uC5B4 \uC8FC\uC138\uC694.");
  if (row.support !== void 0 && !["full", "key", "check"].includes(row.support)) throw new DomainError("INVALID_AI_REQUEST", "\uC124\uBA85 \uB3C4\uC6C0 \uC218\uC900\uC744 \uD655\uC778\uD574 \uC8FC\uC138\uC694.");
  if (!complete) return;
  if (["tutor", "source-qa"].includes(row.task) && !row.focus?.trim())
    throw new DomainError("INVALID_AI_REQUEST", "\uC790\uB8CC\uC5D0 \uBB3C\uC5B4\uBCFC \uC9C8\uBB38\uC744 \uB123\uC5B4 \uC8FC\uC138\uC694.");
  if (["hint", "feedback", "practice"].includes(row.task) && !row.problem?.trim())
    throw new DomainError("INVALID_AI_REQUEST", "\uC774 \uC791\uC5C5\uC5D0 \uC0AC\uC6A9\uD560 \uC2E4\uC81C \uBB38\uC81C\uC640 \uC870\uAC74\uC744 \uB123\uC5B4 \uC8FC\uC138\uC694.");
  if (["hint", "feedback"].includes(row.task) && !row.attempt?.trim())
    throw new DomainError("INVALID_AI_REQUEST", "\uD604\uC7AC \uD480\uC774 \uB610\uB294 \uB9C9\uD78C \uB2E8\uACC4\uB97C \uB123\uC5B4 \uC8FC\uC138\uC694.");
  if (["feedback", "practice"].includes(row.task) && !row.reference?.trim())
    throw new DomainError("INVALID_AI_REQUEST", "\uD655\uC778\uD560 \uD574\uC124\uC774\uB098 \uD310\uB2E8 \uAE30\uC900\uC744 \uB123\uC5B4 \uC8FC\uC138\uC694.");
}

// src/domain/material-source.ts
var MAX_DOCUMENT_BYTES = 50 * 1024 * 1024;
var MAX_DOCUMENT_TEXT = 1e6;
function validateDocuments(value) {
  const bad = () => {
    throw new DomainError("INVALID_MATERIAL", "\uAC00\uC838\uC628 \uC790\uB8CC\uC758 \uC6D0\uBB38\xB7\uCD9C\uCC98\uB97C \uD655\uC778\uD574 \uC8FC\uC138\uC694.");
  };
  if (!Array.isArray(value) || value.length > 20) bad();
  let size = 0;
  const ids = /* @__PURE__ */ new Set();
  for (const doc of value) {
    if (!doc || typeof doc.id !== "string" || !doc.id || doc.id.length > 100 || ids.has(doc.id) || typeof doc.name !== "string" || !doc.name || doc.name.length > 512 || !["pdf", "docx", "pptx", "image", "text", "subtitle", "youtube"].includes(doc.kind) || !Array.isArray(doc.blocks) || doc.blocks.length > 6e3 || !Array.isArray(doc.warnings) || doc.warnings.length > 500 || doc.warnings.some((w) => typeof w !== "string" || w.length > 1e3)) bad();
    ids.add(doc.id);
    if (doc.url !== void 0 && (typeof doc.url !== "string" || !/^https:\/\/(www\.)?youtube\.com\/watch\?v=[A-Za-z0-9_-]{11}$/.test(doc.url))) bad();
    if (doc.file !== null && (!doc.file || typeof doc.file.key !== "string" || !doc.file.key || doc.file.key.length > 512 || typeof doc.file.name !== "string" || doc.file.name.length > 512 || typeof doc.file.type !== "string" || doc.file.type.length > 150 || !Number.isSafeInteger(doc.file.size) || doc.file.size <= 0 || doc.file.size > MAX_DOCUMENT_BYTES || !/^[a-f0-9]{64}$/.test(doc.file.sha256))) bad();
    if (doc.file?.cloudPath !== void 0 && (typeof doc.file.cloudPath !== "string" || !doc.file.cloudPath.endsWith(`/document/${doc.file.sha256}`) || !/^[a-zA-Z0-9-]+\/(personal|test)\/document\/[a-f0-9]{64}$/.test(doc.file.cloudPath))) bad();
    const blocks = /* @__PURE__ */ new Set();
    for (const block of doc.blocks) {
      if (!block || typeof block.id !== "string" || !block.id || block.id.length > 100 || blocks.has(block.id) || typeof block.label !== "string" || block.label.length > 300 || typeof block.text !== "string" || block.text.length > 1e5 || block.originalText !== void 0 && (typeof block.originalText !== "string" || block.originalText.length > 1e5) || typeof block.included !== "boolean" || !(block.start === null && block.end === null || typeof block.start === "number" && Number.isFinite(block.start) && block.start >= 0 && typeof block.end === "number" && Number.isFinite(block.end) && block.end >= block.start)) bad();
      blocks.add(block.id);
      size += block.text.length;
    }
  }
  if (size > MAX_DOCUMENT_TEXT) throw new DomainError("SOURCE_SIZE", "\uAC00\uC838\uC628 \uC6D0\uBB38\uC774 100\uB9CC \uC790\uB97C \uB118\uC2B5\uB2C8\uB2E4. \uC790\uB8CC\uB97C \uB098\uB204\uC5B4 \uBCF4\uAD00\uD574 \uC8FC\uC138\uC694.");
}

// src/domain/study-gpt-contract.ts
var MATERIAL_CONTRACT_VERSION = "jun-split-20261001-1";
function sourceRole(segment) {
  if (segment.role) return segment.role;
  if (segment.id.startsWith("request-")) {
    const key = segment.id.slice(8);
    if (["problem", "attempt", "reference", "focus"].includes(key)) return key;
  }
  return segment.role ?? "material";
}

// src/domain/material-learning.ts
var fail = () => {
  throw new DomainError("INVALID_MATERIAL", "\uD034\uC988\xB7\uAC1C\uB150\uB3C4\uC758 \uD615\uC2DD\uACFC \uC6D0\uBB38 \uADFC\uAC70\uB97C \uD655\uC778\uD574 \uC8FC\uC138\uC694.");
};
function validateQuiz(value, sourceIds) {
  if (!Array.isArray(value) || value.length > 30) fail();
  const seen = /* @__PURE__ */ new Set();
  for (const q of value) {
    if (!q || typeof q.id !== "string" || !q.id || q.id.length > 256 || seen.has(q.id) || typeof q.question !== "string" || !q.question.trim() || q.question.length > 4e3 || !Array.isArray(q.options) || q.options.length < 2 || q.options.length > 6 || q.options.some((a) => typeof a !== "string" || !a.trim() || a.length > 4e3) || new Set(q.options).size !== q.options.length || !Number.isInteger(q.correctIndex) || q.correctIndex < 0 || q.correctIndex >= q.options.length || typeof q.explanation !== "string" || !q.explanation.trim() || q.explanation.length > 1e4 || !Array.isArray(q.sourceIds) || !q.sourceIds.length || q.sourceIds.length > 50 || q.sourceIds.some((id) => typeof id !== "string" || sourceIds && !sourceIds.has(id))) fail();
    seen.add(q.id);
  }
}
function validateMap(value, sourceIds) {
  const map = value;
  if (!map || !Array.isArray(map.nodes) || !map.nodes.length || map.nodes.length > 40 || !Array.isArray(map.edges) || map.edges.length > 80) fail();
  const ids = /* @__PURE__ */ new Set(), edges = /* @__PURE__ */ new Set();
  const refs = (v) => Array.isArray(v) && v.length > 0 && v.length <= 50 && v.every((id) => sourceIds.has(id));
  for (const n of map.nodes) {
    if (typeof n.id !== "string" || !n.id || n.id.length > 100 || ids.has(n.id) || typeof n.label !== "string" || !n.label.trim() || n.label.length > 1e3 || !refs(n.sourceIds)) fail();
    ids.add(n.id);
  }
  for (const e of map.edges) {
    if (typeof e.id !== "string" || !e.id || e.id.length > 100 || ids.has(e.id) || edges.has(e.id) || !ids.has(e.from) || !ids.has(e.to) || e.from === e.to || typeof e.label !== "string" || !e.label.trim() || e.label.length > 300 || !refs(e.sourceIds)) fail();
    edges.add(e.id);
  }
  for (const [id, p] of Object.entries(map.positions ?? {})) if (!ids.has(id) || !p || !Number.isFinite(p.x) || !Number.isFinite(p.y) || Math.abs(p.x) > 1e6 || Math.abs(p.y) > 1e6) fail();
}

// src/domain/study-material.ts
var MAX_AUDIO_BYTES = 50 * 1024 * 1024;
var MAX_SOURCE_TEXT = 15e4;
var invalid = (message) => {
  throw new DomainError("INVALID_MATERIAL", message);
};
var text = (value, max) => typeof value === "string" && value.length <= max;
function validateMaterialResult(value) {
  const result = value;
  if (result?.promptVersion !== void 0 && (!text(result.promptVersion, 160) || !result.promptVersion.trim()))
    invalid("\uC0DD\uC131 \uB2F9\uC2DC GPT \uC9C0\uCE68 \uBC84\uC804\uC744 \uD655\uC778\uD574 \uC8FC\uC138\uC694.");
  if (result?.request !== void 0) validateStudyAIRequest(result.request);
  if (result?.source?.documents !== void 0) validateDocuments(result.source.documents);
  if (!result || !text(result.id, 256) || !result.id || !text(result.model, 160) || !Number.isFinite(Date.parse(result.at)) || !Array.isArray(result.segments) || !result.segments.length || result.segments.length > 6e3 || !Array.isArray(result.summary) || result.summary.length > 100 || !Array.isArray(result.cards) || result.cards.length > 100)
    invalid("AI \uACB0\uACFC\uC758 \uD615\uC2DD\uC744 \uD655\uC778\uD558\uC9C0 \uBABB\uD588\uC2B5\uB2C8\uB2E4. \uC6D0\uBCF8\uC740 \uBCF4\uC874\uD588\uC2B5\uB2C8\uB2E4.");
  const ids = /* @__PURE__ */ new Set();
  for (const segment of result.segments) {
    if (!text(segment.id, 256) || !segment.id || ids.has(segment.id) || !text(segment.text, MAX_SOURCE_TEXT) || !segment.text.trim())
      invalid("\uBC1B\uC544\uC4F4 \uBB38\uC7A5\uACFC \uC2DD\uBCC4\uC790\uB97C \uD655\uC778\uD574 \uC8FC\uC138\uC694.");
    if (segment.label !== void 0 && !text(segment.label, 1e3))
      invalid("\uC6D0\uBB38 \uC704\uCE58\uB97C \uD655\uC778\uD574 \uC8FC\uC138\uC694.");
    if (!(segment.start === null && segment.end === null) && !(typeof segment.start === "number" && Number.isFinite(segment.start) && segment.start >= 0 && typeof segment.end === "number" && Number.isFinite(segment.end) && segment.end >= segment.start))
      invalid("\uC74C\uC131 \uAD6C\uAC04\uC758 \uC2DC\uAC04\uC744 \uD655\uC778\uD574 \uC8FC\uC138\uC694.");
    if (segment.role !== void 0 && !["material", "problem", "attempt", "reference", "focus"].includes(segment.role)) invalid("\uC790\uB8CC \uC5ED\uD560\uC744 \uD655\uC778\uD574 \uC8FC\uC138\uC694.");
    ids.add(segment.id);
  }
  if (result.segments.reduce((sum, row) => sum + row.text.length, 0) > MAX_SOURCE_TEXT)
    invalid("\uBC1B\uC544\uC4F4 \uB0B4\uC6A9\uC774 \uD55C \uBC88\uC5D0 \uCC98\uB9AC\uD560 \uC218 \uC788\uB294 \uBC94\uC704\uB97C \uB118\uC5C8\uC2B5\uB2C8\uB2E4.");
  const references = (sources) => Array.isArray(sources) && sources.length > 0 && sources.length <= 50 && sources.every((id) => typeof id === "string" && ids.has(id));
  for (const row of result.summary)
    if (!text(row.text, 1e4) || !row.text.trim() || !references(row.sourceIds) || row.originalText !== void 0 && !text(row.originalText, 1e4))
      invalid("\uC694\uC57D\uC758 \uC6D0\uBB38 \uADFC\uAC70\uB97C \uD655\uC778\uD558\uC9C0 \uBABB\uD588\uC2B5\uB2C8\uB2E4.");
  if (result.diagnostics !== void 0) {
    if (!Array.isArray(result.diagnostics) || result.diagnostics.length > 10) invalid("\uD655\uC778\uD560 \uB0B4\uC6A9\uC758 \uD615\uC2DD\uC744 \uD655\uC778\uD574 \uC8FC\uC138\uC694.");
    for (const d of result.diagnostics) {
      if (!d || !["needs-input", "insufficient-evidence", "partial"].includes(d.kind) || !text(d.message, 4e3) || !d.message.trim() || d.questions !== void 0 && (!Array.isArray(d.questions) || d.questions.length > 2 || d.questions.some((q) => !text(q, 1e3) || !q.trim())) || d.sourceIds !== void 0 && (!Array.isArray(d.sourceIds) || d.sourceIds.length > 50 || d.sourceIds.some((id) => !ids.has(id)))) invalid("\uD655\uC778\uD560 \uB0B4\uC6A9\uC758 \uD615\uC2DD\uC744 \uD655\uC778\uD574 \uC8FC\uC138\uC694.");
    }
  }
  if (result.range !== void 0 && (!Number.isSafeInteger(result.range.index) || !Number.isSafeInteger(result.range.count) || result.range.index < 0 || result.range.count < 1 || result.range.index >= result.range.count || !text(result.range.sourceIdentity, 160) || !result.range.sourceIdentity || !Number.isSafeInteger(result.range.totalSegments) || result.range.totalSegments < 0 || !Array.isArray(result.range.sourceIds) || !result.range.sourceIds.length || result.range.sourceIds.length > 6e3 || result.range.sourceIds.some((id) => !ids.has(id)))) invalid("\uCC98\uB9AC \uBC94\uC704\uC640 \uC6D0\uBB38 \uC704\uCE58\uB97C \uD655\uC778\uD574 \uC8FC\uC138\uC694.");
  if (result.range?.overlapIds !== void 0 && (!Array.isArray(result.range.overlapIds) || result.range.overlapIds.some((id) => !result.range.sourceIds.includes(id)))) invalid("\uACB9\uCE58\uB294 \uC6D0\uBB38 \uAD6C\uAC04\uC744 \uD655\uC778\uD574 \uC8FC\uC138\uC694.");
  if (result.contractVersion !== void 0 && result.contractVersion !== MATERIAL_CONTRACT_VERSION) invalid("\uACB0\uACFC \uACC4\uC57D \uBC84\uC804\uC744 \uD655\uC778\uD574 \uC8FC\uC138\uC694.");
  const cards = /* @__PURE__ */ new Set();
  for (const card of result.cards) {
    if (!text(card.id, 256) || !card.id || cards.has(card.id) || !text(card.question, 4e3) || !card.question.trim() || !text(card.answer, 1e4) || !card.answer.trim() || !references(card.sourceIds) || typeof card.excluded !== "boolean")
      invalid("\uCE74\uB4DC\uC758 \uC9C8\uBB38\xB7\uB2F5\xB7\uC6D0\uBB38 \uADFC\uAC70\uB97C \uD655\uC778\uD574 \uC8FC\uC138\uC694.");
    cards.add(card.id);
  }
  if (result.quiz !== void 0) validateQuiz(result.quiz, ids);
  if (result.map !== void 0) validateMap(result.map, ids);
  if (result.originalMap !== void 0) validateMap(result.originalMap, ids);
  if (result.contractVersion === MATERIAL_CONTRACT_VERSION) {
    const task = result.request?.task ?? "summary";
    const roles = new Set(task === "feedback" || task === "practice" || task === "hint" ? ["material", "problem", "reference"] : ["material"]);
    const validBasis = (sourceIds) => sourceIds.some((id) => roles.has(sourceRole(result.segments.find((s) => s.id === id))));
    for (const item of [...result.summary, ...result.cards]) {
      if (item.evidenceType !== void 0 && !["material-grounded", "general-supplement"].includes(item.evidenceType)) invalid("\uC790\uB8CC \uADFC\uAC70\uC640 \uBCF4\uCDA9 \uC124\uBA85\uC744 \uAD6C\uBCC4\uD574 \uC8FC\uC138\uC694.");
      if (!validBasis(item.sourceIds)) invalid("\uC9C8\uBB38\xB7\uCD08\uC810\uC774\uB098 \uC0AC\uC6A9\uC790 \uC2DC\uB3C4\uB9CC\uC73C\uB85C \uB2F5\uC758 \uC6D0\uBB38 \uADFC\uAC70\uB97C \uC0BC\uC744 \uC218 \uC5C6\uC2B5\uB2C8\uB2E4.");
      if (["tutor", "source-qa", "questions", "quiz"].includes(task) && item.evidenceType === "general-supplement") invalid("\uC774 \uC791\uC5C5\uC740 \uC77C\uBC18 \uC9C0\uC2DD \uBCF4\uCDA9\uC73C\uB85C \uC790\uB8CC\uC758 \uB2F5\uC744 \uB300\uCCB4\uD560 \uC218 \uC5C6\uC2B5\uB2C8\uB2E4.");
      if ("answer" in item && item.evidenceType === "general-supplement") invalid("\uC790\uB8CC \uAE30\uBC18 \uBB38\uD56D\uC740 \uC81C\uACF5\uB41C \uC6D0\uBB38\uC73C\uB85C \uB2F5\uD560 \uC218 \uC788\uC5B4\uC57C \uD569\uB2C8\uB2E4.");
    }
    for (const q of result.quiz ?? []) if (!validBasis(q.sourceIds)) invalid("\uD034\uC988\uC758 \uC790\uB8CC \uADFC\uAC70\uB97C \uD655\uC778\uD574 \uC8FC\uC138\uC694.");
    for (const n of [...result.map?.nodes ?? [], ...result.map?.edges ?? []]) if (!validBasis(n.sourceIds)) invalid("\uAC1C\uB150\uB3C4\uC758 \uC790\uB8CC \uADFC\uAC70\uB97C \uD655\uC778\uD574 \uC8FC\uC138\uC694.");
  }
}

// src/server/study-ai.ts
var cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, apikey, content-type, x-client-info",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Cache-Control": "no-store"
};
function aiResponse(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...cors, "Content-Type": "application/json" }
  });
}
async function boundedBody(request) {
  const limit = MAX_AUDIO_BYTES + MAX_SOURCE_TEXT * 12 + 2e5;
  if (Number(request.headers.get("content-length")) > limit)
    throw new DomainError("TOO_LARGE", "\uC74C\uC131\uC740 50MB \uC774\uD558\uB85C \uB123\uC5B4 \uC8FC\uC138\uC694.");
  const reader = request.body?.getReader();
  if (!reader) throw new DomainError("INVALID_REQUEST", "\uBD84\uC11D\uD560 \uC790\uB8CC\uB97C \uB123\uC5B4 \uC8FC\uC138\uC694.");
  const chunks = [];
  let size = 0;
  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    size += value.length;
    if (size > limit) {
      await reader.cancel();
      throw new DomainError("TOO_LARGE", "\uC74C\uC131\uC740 50MB \uC774\uD558\uB85C \uB123\uC5B4 \uC8FC\uC138\uC694.");
    }
    chunks.push(value);
  }
  const bytes = new Uint8Array(size);
  let offset = 0;
  for (const chunk of chunks) {
    bytes.set(chunk, offset);
    offset += chunk.length;
  }
  return new Request(request.url, {
    method: "POST",
    headers: request.headers,
    body: bytes
  }).formData();
}
async function handleStudyAI(request, backend) {
  if (request.method === "OPTIONS") return new Response(null, { status: 204, headers: cors });
  if (request.method !== "POST")
    return aiResponse({ code: "METHOD", message: "\uC9C0\uC6D0\uD558\uC9C0 \uC54A\uB294 \uC694\uCCAD\uC785\uB2C8\uB2E4." }, 405);
  try {
    const identity = await backend.authorize(request);
    requireOwnerAI(identity);
    const form = await boundedBody(request), namespace = String(form.get("namespace") ?? "");
    if (form.get("userId") !== identity.userId || identity.namespace !== void 0 && namespace !== identity.namespace || !["personal", "test", "demo"].includes(namespace))
      throw new DomainError("OWNERSHIP", "\uC774 \uACF5\uAC04\uC758 \uC790\uB8CC\uB9CC \uBD84\uC11D\uD560 \uC218 \uC788\uC2B5\uB2C8\uB2E4.");
    const text2 = form.has("textJSON") ? JSON.parse(String(form.get("textJSON"))) : form.get("text") ?? "", audio = form.get("audio"), cardCount = Number(form.get("cardCount") ?? 10);
    if (typeof text2 !== "string" || text2.length > MAX_SOURCE_TEXT || !Number.isInteger(cardCount) || cardCount < 1 || cardCount > 30)
      throw new DomainError("INVALID_REQUEST", "\uAC15\uC758 \uB0B4\uC6A9\uACFC \uCE74\uB4DC \uAC1C\uC218\uB97C \uD655\uC778\uD574 \uC8FC\uC138\uC694.");
    if (audio !== null && (!(audio instanceof Blob) || !audio.size || audio.size > MAX_AUDIO_BYTES || !/^audio\/(mpeg|mp4|wav|webm|ogg|aac|flac)$/.test(audio.type)))
      throw new DomainError("INVALID_AUDIO", "\uC9C0\uC6D0\uB418\uB294 50MB \uC774\uD558 \uC74C\uC131 \uD30C\uC77C\uC744 \uB123\uC5B4 \uC8FC\uC138\uC694.");
    if (!audio && !text2.trim() && !form.has("segmentsJSON"))
      throw new DomainError("INVALID_REQUEST", "\uB179\uC74C \uD30C\uC77C\uC774\uB098 \uAC15\uC758 \uB0B4\uC6A9\uC744 \uB123\uC5B4 \uC8FC\uC138\uC694.");
    const aiRequest = form.has("requestJSON") ? JSON.parse(String(form.get("requestJSON"))) : void 0;
    if (aiRequest !== void 0) validateStudyAIRequest(aiRequest);
    const sourceSegments = form.has("segmentsJSON") ? JSON.parse(String(form.get("segmentsJSON"))) : void 0;
    if (sourceSegments !== void 0) {
      if (!Array.isArray(sourceSegments)) throw new DomainError("INVALID_REQUEST", "\uC790\uB8CC\uC758 \uC6D0\uBB38 \uAD6C\uAC04\uC744 \uD655\uC778\uD574 \uC8FC\uC138\uC694.");
      if (sourceSegments.length) validateMaterialResult({ id: "input", at: (/* @__PURE__ */ new Date()).toISOString(), model: "source", segments: sourceSegments, summary: [], cards: [] });
      if (text2.length + sourceSegments.reduce((n, b) => n + b.text.length, 0) > MAX_SOURCE_TEXT) throw new DomainError("SOURCE_SIZE", "\uD544\uAE30\uC640 \uC120\uD0DD\uD55C \uC790\uB8CC\uAC00 15\uB9CC \uC790\uB97C \uB118\uC2B5\uB2C8\uB2E4. \uC0AC\uC6A9\uD560 \uAD6C\uAC04\uC744 \uB098\uB204\uC5B4 \uC8FC\uC138\uC694.");
    }
    if (!audio && !text2.trim() && !sourceSegments?.length) throw new DomainError("INVALID_REQUEST", "\uBD84\uC11D\uD560 \uC6D0\uBB38 \uAD6C\uAC04\uC744 \uC120\uD0DD\uD574 \uC8FC\uC138\uC694.");
    const extra = ["problem", "attempt", "reference", "focus"].reduce((n, key) => n + (aiRequest?.[key]?.length ?? 0), 0);
    if (text2.length + (sourceSegments?.reduce((n, b) => n + b.text.length, 0) ?? 0) + extra > MAX_SOURCE_TEXT) throw new DomainError("SOURCE_SIZE", "\uC120\uD0DD \uC6D0\uBB38\uACFC \uCD94\uAC00 \uC9C8\uBB38\uC758 \uBC94\uC704\uB97C \uB098\uB204\uC5B4 \uC8FC\uC138\uC694.");
    const range = form.has("rangeJSON") ? JSON.parse(String(form.get("rangeJSON"))) : void 0;
    if (range !== void 0) {
      if (audio || text2 || !sourceSegments?.length) throw new DomainError("INVALID_REQUEST", "\uBD84\uD560 \uBC94\uC704\uC5D0\uB294 \uC120\uD0DD\uD55C \uC6D0\uBB38 \uAD6C\uAC04\uB9CC \uC0AC\uC6A9\uD560 \uC218 \uC788\uC2B5\uB2C8\uB2E4.");
      validateMaterialResult({ id: "range-input", at: (/* @__PURE__ */ new Date()).toISOString(), model: "source", segments: sourceSegments, summary: [], cards: [], range });
    }
    await backend.reserve(identity.userId);
    const result = await backend.generate({
      text: text2,
      audio,
      audioName: audio instanceof File ? audio.name : "lecture",
      cardCount,
      ...aiRequest ? { request: aiRequest } : {},
      ...sourceSegments ? { sourceSegments } : {},
      ...range ? { range } : {}
    });
    validateMaterialResult(result);
    return aiResponse({ result });
  } catch (error) {
    const known = error instanceof DomainError;
    const code = known ? error.code : "AI_ERROR";
    return aiResponse(
      {
        code,
        message: known ? error.message : "AI \uCC98\uB9AC \uC911 \uC5F0\uACB0\uC774 \uB04A\uACBC\uC2B5\uB2C8\uB2E4. \uC6D0\uBCF8\uC740 \uB0A8\uC544 \uC788\uC2B5\uB2C8\uB2E4. \uB2E4\uC2DC \uC2DC\uB3C4\uD574 \uC8FC\uC138\uC694."
      },
      code === "AUTH_REQUIRED" ? 401 : ["OWNERSHIP", "ACCESS_DENIED", "AI_OWNER_REQUIRED"].includes(code) ? 403 : code === "RATE_LIMIT" ? 429 : known && !["AI_ERROR", "AI_KEY_REQUIRED", "AI_QUOTA", "AI_MODEL"].includes(code) ? 400 : 503
    );
  }
}

// src/domain/ai-connection.ts
var REMOTE_AI_APPROVAL_MESSAGE = "\uC774 \uACF5\uBD80\uC571\uC758 \uC6D0\uACA9 ChatGPT \uC5F0\uACB0\uC740 OpenAI\uC758 \uC11C\uBE44\uC2A4 \uC811\uADFC \uC2B9\uC778\uC774 \uD544\uC694\uD569\uB2C8\uB2E4. \uB179\uC74C\uACFC \uD544\uAE30\uB294 \uBCF4\uAD00\uD560 \uC218 \uC788\uC2B5\uB2C8\uB2E4.";

// src/server/remote-ai-status.ts
async function remoteAIStatus(request, authorize2) {
  try {
    requireOwnerAI(await authorize2(request));
    return aiResponse({ configured: false, local: false, provider: "chatgpt", model: "", models: [], session: { status: "disconnected", sharing: false }, creditsConfirmed: false, transcription: false, connecting: false, connectionError: REMOTE_AI_APPROVAL_MESSAGE });
  } catch (error) {
    const known = error instanceof DomainError;
    const code = known ? error.code : "AI_STATUS_ERROR";
    return aiResponse({ code, message: known ? error.message : "ChatGPT \uC5F0\uACB0 \uC0C1\uD0DC\uB97C \uD655\uC778\uD558\uC9C0 \uBABB\uD588\uC2B5\uB2C8\uB2E4. \uC6D0\uBCF8\uC740 \uC720\uC9C0\uD588\uC2B5\uB2C8\uB2E4." }, code === "AUTH_REQUIRED" ? 401 : ["AI_OWNER_REQUIRED", "ACCESS_DENIED"].includes(code) ? 403 : 503);
  }
}

// src/server/account-access.ts
var accessMessages = {
  pending: "\uAD00\uB9AC\uC790\uAC00 \uAC00\uC785\uC744 \uC2B9\uC778\uD558\uBA74 \uB0B4 \uACF5\uBD80 \uACF5\uAC04\uC744 \uC0AC\uC6A9\uD560 \uC218 \uC788\uC2B5\uB2C8\uB2E4.",
  approved: "\uC774\uC6A9\uC774 \uC2B9\uC778\uB418\uC5C8\uC2B5\uB2C8\uB2E4.",
  rejected: "\uAC00\uC785 \uC694\uCCAD\uC774 \uC2B9\uC778\uB418\uC9C0 \uC54A\uC558\uC2B5\uB2C8\uB2E4. \uC774\uC6A9\uC774 \uD544\uC694\uD558\uBA74 \uAD00\uB9AC\uC790\uC5D0\uAC8C \uBB38\uC758\uD574 \uC8FC\uC138\uC694.",
  suspended: "\uD604\uC7AC \uC774\uC6A9\uC774 \uC911\uC9C0\uB418\uC5B4 \uC788\uC2B5\uB2C8\uB2E4. \uAE30\uC874 \uAE30\uB85D\uC740 \uC0AD\uC81C\uD558\uC9C0 \uC54A\uC558\uC2B5\uB2C8\uB2E4. \uAD00\uB9AC\uC790\uC5D0\uAC8C \uBB38\uC758\uD574 \uC8FC\uC138\uC694."
};
function requireApproved(access) {
  if (access.status !== "approved") throw new DomainError("ACCESS_DENIED", accessMessages[access.status] ?? accessMessages.pending);
}

// supabase/functions/study-ai/entry.ts
var url = Deno.env.get("SUPABASE_URL");
var publicKey = Deno.env.get("SUPABASE_ANON_KEY");
var service = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
async function authorize(req) {
  const token = req.headers.get("authorization");
  if (!token?.startsWith("Bearer "))
    throw new DomainError("AUTH_REQUIRED", "\uAC1C\uC778 \uACF5\uAC04\uC5D0 \uB2E4\uC2DC \uB85C\uADF8\uC778\uD574 \uC8FC\uC138\uC694.");
  const response = await fetch(`${url}/auth/v1/user`, {
    headers: { apikey: publicKey, Authorization: token }
  });
  if (!response.ok) throw new DomainError("AUTH_REQUIRED", "\uB85C\uADF8\uC778\uC774 \uB9CC\uB8CC\uB418\uC5C8\uC2B5\uB2C8\uB2E4.");
  const userId = (await response.json()).id;
  const identity = { userId, namespace: "personal" };
  requireOwnerAI(identity);
  const access = await fetch(`${url}/rest/v1/rpc/study_account_access`, {
    method: "POST",
    headers: { apikey: service, Authorization: `Bearer ${service}`, "Content-Type": "application/json" },
    body: JSON.stringify({ p_user: userId })
  });
  if (!access.ok) throw new DomainError("ACCESS_DENIED", "\uC571 \uC774\uC6A9 \uC2B9\uC778\uC744 \uD655\uC778\uD558\uC9C0 \uBABB\uD588\uC2B5\uB2C8\uB2E4.");
  requireApproved(await access.json());
  return identity;
}
Deno.serve((request) => {
  if (request.method === "GET" && new URL(request.url).pathname.endsWith("/study-ai/status"))
    return remoteAIStatus(request, authorize);
  return handleStudyAI(request, {
    async authorize(req) {
      await authorize(req);
      throw new DomainError("GPT_REMOTE_APPROVAL_REQUIRED", REMOTE_AI_APPROVAL_MESSAGE);
    },
    async reserve() {
      throw new DomainError("GPT_REMOTE_APPROVAL_REQUIRED", REMOTE_AI_APPROVAL_MESSAGE);
    },
    async generate() {
      throw new DomainError("GPT_REMOTE_APPROVAL_REQUIRED", REMOTE_AI_APPROVAL_MESSAGE);
    }
  });
});
