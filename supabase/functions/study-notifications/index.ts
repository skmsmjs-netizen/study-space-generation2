var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __commonJS = (cb, mod) => function __require() {
  try {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  } catch (e) {
    throw mod = 0, e;
  }
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key2 of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key2) && key2 !== except)
        __defProp(to, key2, { get: () => from[key2], enumerable: !(desc = __getOwnPropDesc(from, key2)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// node_modules/lz-string/libs/lz-string.js
var require_lz_string = __commonJS({
  "node_modules/lz-string/libs/lz-string.js"(exports, module) {
    var LZString2 = (function() {
      var f = String.fromCharCode;
      var keyStrBase64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
      var keyStrUriSafe = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+-$";
      var baseReverseDic = {};
      function getBaseValue(alphabet, character) {
        if (!baseReverseDic[alphabet]) {
          baseReverseDic[alphabet] = {};
          for (var i = 0; i < alphabet.length; i++) {
            baseReverseDic[alphabet][alphabet.charAt(i)] = i;
          }
        }
        return baseReverseDic[alphabet][character];
      }
      var LZString3 = {
        compressToBase64: function(input) {
          if (input == null) return "";
          var res = LZString3._compress(input, 6, function(a) {
            return keyStrBase64.charAt(a);
          });
          switch (res.length % 4) {
            // To produce valid Base64
            default:
            // When could this happen ?
            case 0:
              return res;
            case 1:
              return res + "===";
            case 2:
              return res + "==";
            case 3:
              return res + "=";
          }
        },
        decompressFromBase64: function(input) {
          if (input == null) return "";
          if (input == "") return null;
          return LZString3._decompress(input.length, 32, function(index) {
            return getBaseValue(keyStrBase64, input.charAt(index));
          });
        },
        compressToUTF16: function(input) {
          if (input == null) return "";
          return LZString3._compress(input, 15, function(a) {
            return f(a + 32);
          }) + " ";
        },
        decompressFromUTF16: function(compressed) {
          if (compressed == null) return "";
          if (compressed == "") return null;
          return LZString3._decompress(compressed.length, 16384, function(index) {
            return compressed.charCodeAt(index) - 32;
          });
        },
        //compress into uint8array (UCS-2 big endian format)
        compressToUint8Array: function(uncompressed) {
          var compressed = LZString3.compress(uncompressed);
          var buf = new Uint8Array(compressed.length * 2);
          for (var i = 0, TotalLen = compressed.length; i < TotalLen; i++) {
            var current_value = compressed.charCodeAt(i);
            buf[i * 2] = current_value >>> 8;
            buf[i * 2 + 1] = current_value % 256;
          }
          return buf;
        },
        //decompress from uint8array (UCS-2 big endian format)
        decompressFromUint8Array: function(compressed) {
          if (compressed === null || compressed === void 0) {
            return LZString3.decompress(compressed);
          } else {
            var buf = new Array(compressed.length / 2);
            for (var i = 0, TotalLen = buf.length; i < TotalLen; i++) {
              buf[i] = compressed[i * 2] * 256 + compressed[i * 2 + 1];
            }
            var result = [];
            buf.forEach(function(c) {
              result.push(f(c));
            });
            return LZString3.decompress(result.join(""));
          }
        },
        //compress into a string that is already URI encoded
        compressToEncodedURIComponent: function(input) {
          if (input == null) return "";
          return LZString3._compress(input, 6, function(a) {
            return keyStrUriSafe.charAt(a);
          });
        },
        //decompress from an output of compressToEncodedURIComponent
        decompressFromEncodedURIComponent: function(input) {
          if (input == null) return "";
          if (input == "") return null;
          input = input.replace(/ /g, "+");
          return LZString3._decompress(input.length, 32, function(index) {
            return getBaseValue(keyStrUriSafe, input.charAt(index));
          });
        },
        compress: function(uncompressed) {
          return LZString3._compress(uncompressed, 16, function(a) {
            return f(a);
          });
        },
        _compress: function(uncompressed, bitsPerChar, getCharFromInt) {
          if (uncompressed == null) return "";
          var i, value, context_dictionary = {}, context_dictionaryToCreate = {}, context_c = "", context_wc = "", context_w = "", context_enlargeIn = 2, context_dictSize = 3, context_numBits = 2, context_data = [], context_data_val = 0, context_data_position = 0, ii;
          for (ii = 0; ii < uncompressed.length; ii += 1) {
            context_c = uncompressed.charAt(ii);
            if (!Object.prototype.hasOwnProperty.call(context_dictionary, context_c)) {
              context_dictionary[context_c] = context_dictSize++;
              context_dictionaryToCreate[context_c] = true;
            }
            context_wc = context_w + context_c;
            if (Object.prototype.hasOwnProperty.call(context_dictionary, context_wc)) {
              context_w = context_wc;
            } else {
              if (Object.prototype.hasOwnProperty.call(context_dictionaryToCreate, context_w)) {
                if (context_w.charCodeAt(0) < 256) {
                  for (i = 0; i < context_numBits; i++) {
                    context_data_val = context_data_val << 1;
                    if (context_data_position == bitsPerChar - 1) {
                      context_data_position = 0;
                      context_data.push(getCharFromInt(context_data_val));
                      context_data_val = 0;
                    } else {
                      context_data_position++;
                    }
                  }
                  value = context_w.charCodeAt(0);
                  for (i = 0; i < 8; i++) {
                    context_data_val = context_data_val << 1 | value & 1;
                    if (context_data_position == bitsPerChar - 1) {
                      context_data_position = 0;
                      context_data.push(getCharFromInt(context_data_val));
                      context_data_val = 0;
                    } else {
                      context_data_position++;
                    }
                    value = value >> 1;
                  }
                } else {
                  value = 1;
                  for (i = 0; i < context_numBits; i++) {
                    context_data_val = context_data_val << 1 | value;
                    if (context_data_position == bitsPerChar - 1) {
                      context_data_position = 0;
                      context_data.push(getCharFromInt(context_data_val));
                      context_data_val = 0;
                    } else {
                      context_data_position++;
                    }
                    value = 0;
                  }
                  value = context_w.charCodeAt(0);
                  for (i = 0; i < 16; i++) {
                    context_data_val = context_data_val << 1 | value & 1;
                    if (context_data_position == bitsPerChar - 1) {
                      context_data_position = 0;
                      context_data.push(getCharFromInt(context_data_val));
                      context_data_val = 0;
                    } else {
                      context_data_position++;
                    }
                    value = value >> 1;
                  }
                }
                context_enlargeIn--;
                if (context_enlargeIn == 0) {
                  context_enlargeIn = Math.pow(2, context_numBits);
                  context_numBits++;
                }
                delete context_dictionaryToCreate[context_w];
              } else {
                value = context_dictionary[context_w];
                for (i = 0; i < context_numBits; i++) {
                  context_data_val = context_data_val << 1 | value & 1;
                  if (context_data_position == bitsPerChar - 1) {
                    context_data_position = 0;
                    context_data.push(getCharFromInt(context_data_val));
                    context_data_val = 0;
                  } else {
                    context_data_position++;
                  }
                  value = value >> 1;
                }
              }
              context_enlargeIn--;
              if (context_enlargeIn == 0) {
                context_enlargeIn = Math.pow(2, context_numBits);
                context_numBits++;
              }
              context_dictionary[context_wc] = context_dictSize++;
              context_w = String(context_c);
            }
          }
          if (context_w !== "") {
            if (Object.prototype.hasOwnProperty.call(context_dictionaryToCreate, context_w)) {
              if (context_w.charCodeAt(0) < 256) {
                for (i = 0; i < context_numBits; i++) {
                  context_data_val = context_data_val << 1;
                  if (context_data_position == bitsPerChar - 1) {
                    context_data_position = 0;
                    context_data.push(getCharFromInt(context_data_val));
                    context_data_val = 0;
                  } else {
                    context_data_position++;
                  }
                }
                value = context_w.charCodeAt(0);
                for (i = 0; i < 8; i++) {
                  context_data_val = context_data_val << 1 | value & 1;
                  if (context_data_position == bitsPerChar - 1) {
                    context_data_position = 0;
                    context_data.push(getCharFromInt(context_data_val));
                    context_data_val = 0;
                  } else {
                    context_data_position++;
                  }
                  value = value >> 1;
                }
              } else {
                value = 1;
                for (i = 0; i < context_numBits; i++) {
                  context_data_val = context_data_val << 1 | value;
                  if (context_data_position == bitsPerChar - 1) {
                    context_data_position = 0;
                    context_data.push(getCharFromInt(context_data_val));
                    context_data_val = 0;
                  } else {
                    context_data_position++;
                  }
                  value = 0;
                }
                value = context_w.charCodeAt(0);
                for (i = 0; i < 16; i++) {
                  context_data_val = context_data_val << 1 | value & 1;
                  if (context_data_position == bitsPerChar - 1) {
                    context_data_position = 0;
                    context_data.push(getCharFromInt(context_data_val));
                    context_data_val = 0;
                  } else {
                    context_data_position++;
                  }
                  value = value >> 1;
                }
              }
              context_enlargeIn--;
              if (context_enlargeIn == 0) {
                context_enlargeIn = Math.pow(2, context_numBits);
                context_numBits++;
              }
              delete context_dictionaryToCreate[context_w];
            } else {
              value = context_dictionary[context_w];
              for (i = 0; i < context_numBits; i++) {
                context_data_val = context_data_val << 1 | value & 1;
                if (context_data_position == bitsPerChar - 1) {
                  context_data_position = 0;
                  context_data.push(getCharFromInt(context_data_val));
                  context_data_val = 0;
                } else {
                  context_data_position++;
                }
                value = value >> 1;
              }
            }
            context_enlargeIn--;
            if (context_enlargeIn == 0) {
              context_enlargeIn = Math.pow(2, context_numBits);
              context_numBits++;
            }
          }
          value = 2;
          for (i = 0; i < context_numBits; i++) {
            context_data_val = context_data_val << 1 | value & 1;
            if (context_data_position == bitsPerChar - 1) {
              context_data_position = 0;
              context_data.push(getCharFromInt(context_data_val));
              context_data_val = 0;
            } else {
              context_data_position++;
            }
            value = value >> 1;
          }
          while (true) {
            context_data_val = context_data_val << 1;
            if (context_data_position == bitsPerChar - 1) {
              context_data.push(getCharFromInt(context_data_val));
              break;
            } else context_data_position++;
          }
          return context_data.join("");
        },
        decompress: function(compressed) {
          if (compressed == null) return "";
          if (compressed == "") return null;
          return LZString3._decompress(compressed.length, 32768, function(index) {
            return compressed.charCodeAt(index);
          });
        },
        _decompress: function(length, resetValue, getNextValue) {
          var dictionary = [], next, enlargeIn = 4, dictSize = 4, numBits = 3, entry = "", result = [], i, w, bits, resb, maxpower, power, c, data = { val: getNextValue(0), position: resetValue, index: 1 };
          for (i = 0; i < 3; i += 1) {
            dictionary[i] = i;
          }
          bits = 0;
          maxpower = Math.pow(2, 2);
          power = 1;
          while (power != maxpower) {
            resb = data.val & data.position;
            data.position >>= 1;
            if (data.position == 0) {
              data.position = resetValue;
              data.val = getNextValue(data.index++);
            }
            bits |= (resb > 0 ? 1 : 0) * power;
            power <<= 1;
          }
          switch (next = bits) {
            case 0:
              bits = 0;
              maxpower = Math.pow(2, 8);
              power = 1;
              while (power != maxpower) {
                resb = data.val & data.position;
                data.position >>= 1;
                if (data.position == 0) {
                  data.position = resetValue;
                  data.val = getNextValue(data.index++);
                }
                bits |= (resb > 0 ? 1 : 0) * power;
                power <<= 1;
              }
              c = f(bits);
              break;
            case 1:
              bits = 0;
              maxpower = Math.pow(2, 16);
              power = 1;
              while (power != maxpower) {
                resb = data.val & data.position;
                data.position >>= 1;
                if (data.position == 0) {
                  data.position = resetValue;
                  data.val = getNextValue(data.index++);
                }
                bits |= (resb > 0 ? 1 : 0) * power;
                power <<= 1;
              }
              c = f(bits);
              break;
            case 2:
              return "";
          }
          dictionary[3] = c;
          w = c;
          result.push(c);
          while (true) {
            if (data.index > length) {
              return "";
            }
            bits = 0;
            maxpower = Math.pow(2, numBits);
            power = 1;
            while (power != maxpower) {
              resb = data.val & data.position;
              data.position >>= 1;
              if (data.position == 0) {
                data.position = resetValue;
                data.val = getNextValue(data.index++);
              }
              bits |= (resb > 0 ? 1 : 0) * power;
              power <<= 1;
            }
            switch (c = bits) {
              case 0:
                bits = 0;
                maxpower = Math.pow(2, 8);
                power = 1;
                while (power != maxpower) {
                  resb = data.val & data.position;
                  data.position >>= 1;
                  if (data.position == 0) {
                    data.position = resetValue;
                    data.val = getNextValue(data.index++);
                  }
                  bits |= (resb > 0 ? 1 : 0) * power;
                  power <<= 1;
                }
                dictionary[dictSize++] = f(bits);
                c = dictSize - 1;
                enlargeIn--;
                break;
              case 1:
                bits = 0;
                maxpower = Math.pow(2, 16);
                power = 1;
                while (power != maxpower) {
                  resb = data.val & data.position;
                  data.position >>= 1;
                  if (data.position == 0) {
                    data.position = resetValue;
                    data.val = getNextValue(data.index++);
                  }
                  bits |= (resb > 0 ? 1 : 0) * power;
                  power <<= 1;
                }
                dictionary[dictSize++] = f(bits);
                c = dictSize - 1;
                enlargeIn--;
                break;
              case 2:
                return result.join("");
            }
            if (enlargeIn == 0) {
              enlargeIn = Math.pow(2, numBits);
              numBits++;
            }
            if (dictionary[c]) {
              entry = dictionary[c];
            } else {
              if (c === dictSize) {
                entry = w + w.charAt(0);
              } else {
                return null;
              }
            }
            result.push(entry);
            dictionary[dictSize++] = w + entry.charAt(0);
            enlargeIn--;
            w = entry;
            if (enlargeIn == 0) {
              enlargeIn = Math.pow(2, numBits);
              numBits++;
            }
          }
        }
      };
      return LZString3;
    })();
    if (typeof define === "function" && define.amd) {
      define(function() {
        return LZString2;
      });
    } else if (typeof module !== "undefined" && module != null) {
      module.exports = LZString2;
    } else if (typeof angular !== "undefined" && angular != null) {
      angular.module("LZString", []).factory("LZString", function() {
        return LZString2;
      });
    }
  }
});

// supabase/functions/study-notifications/entry.ts
import webpush from "npm:web-push@3.6.7";

// src/domain/learning-schedule.ts
function scheduleSteps(kind) {
  return kind === "assignment" ? ["prepare", "submit"] : kind === "lecture" ? ["watch", "learn", "attendance"] : kind === "class" ? ["learn", "attendance"] : [];
}
function scheduleWorkSteps(s) {
  return [...["exam", "quiz"].includes(s.kind) ? ["take"] : scheduleSteps(s.kind), ...s.notesRequired ? ["notes"] : []];
}
var validSource = (s) => {
  try {
    const url2 = new URL(s);
    return ["http:", "https:"].includes(url2.protocol) && !/[\r\n]/.test(s);
  } catch {
    return false;
  }
};
var day = (s) => s === "" || /^\d{4}-\d{2}-\d{2}$/.test(s) && Number.isFinite(Date.parse(s)) && new Date(s).toISOString().slice(0, 10) === s;
function validateScheduleExtensions(w, data) {
  const node = new Map(data.nodes.map((n) => [n.id, n])), ids = /* @__PURE__ */ new Set();
  for (const s of w.schedules ?? []) {
    if (!s || typeof s.id !== "string" || !s.id || ids.has(s.id) || !data.subjects.some((p) => p.id === s.subjectId) || typeof s.name !== "string" || !s.name.trim() || !["exam", "quiz", "assignment", "lecture", "class"].includes(s.kind) || !["active", "ended"].includes(s.status) || !["exam", "submission", "attendance", "personal", "unknown"].includes(s.dueMeaning) || typeof s.note !== "string" || !day(s.dueDate) || !day(s.opensDate) || s.opensDate && s.dueDate && s.opensDate > s.dueDate || s.weight !== null && (!Number.isFinite(s.weight) || s.weight < 0 || s.weight > 1) || !Array.isArray(s.goalIds) || !Array.isArray(s.targetIds) || !s.states || typeof s.states !== "object" || Object.values(s.states).some((v) => !["unknown", "not-done", "done"].includes(v))) throw Error("\uC77C\uC815\uC758 \uB0A0\uC9DC\xB7\uBC94\uC704\xB7\uC0C1\uD0DC\uB97C \uD655\uC778\uD574 \uC8FC\uC138\uC694.");
    const time = (v) => v === void 0 || v === "" || typeof v === "string" && /^([01]\d|2[0-3]):[0-5]\d$/.test(v);
    if (s.notesRequired !== void 0 && typeof s.notesRequired !== "boolean" || !time(s.dueTime) || !time(s.opensTime) || s.reviewDate !== void 0 && !day(s.reviewDate) || [s.taskText, s.sourceUrl, s.seriesId].some((v) => v !== void 0 && typeof v !== "string") || s.sourceUrl && !validSource(s.sourceUrl) || s.week !== void 0 && (!Number.isSafeInteger(s.week) || s.week < 1) || s.deletedAt !== void 0 && s.deletedAt !== null && !Number.isFinite(Date.parse(s.deletedAt))) throw Error("\uC77C\uC815\uC758 \uC2DC\uAC04\xB7\uD655\uC778\uC77C\xB7\uACF5\uC9C0 \uC8FC\uC18C\uB97C \uD655\uC778\uD574 \uC8FC\uC138\uC694.");
    if (s.dueDate && s.opensDate && scheduleDeadline(s) < scheduleOpening(s)) throw Error("\uC2DC\uC791 \uAC00\uB2A5 \uC2DC\uAC01\uC740 \uAE30\uD55C\uBCF4\uB2E4 \uB2A6\uC744 \uC218 \uC5C6\uC2B5\uB2C8\uB2E4.");
    if (s.history !== void 0 && (!Array.isArray(s.history) || s.history.some((h) => !h || !Number.isFinite(Date.parse(h.at)) || typeof h.reason !== "string" || !h.previous || h.previous.id !== s.id || typeof h.previous.note !== "string"))) throw Error("\uC77C\uC815 \uBCC0\uACBD \uC774\uB825\uC744 \uD655\uC778\uD574 \uC8FC\uC138\uC694.");
    for (const h of s.history ?? []) {
      if ("history" in h.previous) throw Error("\uC77C\uC815 \uBCC0\uACBD \uC774\uB825\uC774 \uC911\uCCA9\uB418\uC5B4 \uC788\uC2B5\uB2C8\uB2E4.");
      validateScheduleExtensions({ goals: w.goals, schedules: [h.previous] }, data);
    }
    ids.add(s.id);
    if (s.targetIds.some((id) => node.get(id)?.subjectId !== s.subjectId) || s.goalIds.some((id) => !w.goals.some((g) => g.id === id && node.get(g.targetId)?.subjectId === s.subjectId))) throw Error("\uC77C\uC815\uACFC \uC8FC\uC81C\uC758 \uACFC\uBAA9\uC774 \uB2E4\uB985\uB2C8\uB2E4.");
  }
  const conditions = /* @__PURE__ */ new Map();
  for (const c of w.conditions ?? []) {
    if (!c || !node.has(c.targetId) || conditions.has(c.targetId) || !Array.isArray(c.prerequisiteIds) || new Set(c.prerequisiteIds).size !== c.prerequisiteIds.length || ![null, true, false].includes(c.materialAvailable) || c.prerequisiteIds.some((id) => !node.has(id) || node.get(id)?.subjectId !== node.get(c.targetId)?.subjectId)) throw Error("\uC120\uD589 \uAD00\uACC4\uC640 \uC790\uB8CC \uC5EC\uBD80\uB97C \uD655\uC778\uD574 \uC8FC\uC138\uC694.");
    conditions.set(c.targetId, c);
  }
  const seen = /* @__PURE__ */ new Set(), active = /* @__PURE__ */ new Set();
  function visit(id) {
    if (active.has(id)) throw Error("\uC120\uD589 \uAD00\uACC4\uAC00 \uC11C\uB85C \uC21C\uD658\uD569\uB2C8\uB2E4. \uAD00\uACC4\uB97C \uB2E4\uC2DC \uD655\uC778\uD574 \uC8FC\uC138\uC694.");
    if (seen.has(id)) return;
    active.add(id);
    for (const p of conditions.get(id)?.prerequisiteIds ?? []) visit(p);
    active.delete(id);
    seen.add(id);
  }
  for (const id of conditions.keys()) visit(id);
  const pairIds = /* @__PURE__ */ new Set();
  for (const p of w.comparisons ?? []) {
    if (!p || !p.id || pairIds.has(p.id) || !node.has(p.targetId) || typeof p.action !== "string" || !p.action.trim() || !w.goals.some((g) => g.id === p.goalId && g.targetId === p.targetId) || !Number.isFinite(Date.parse(p.registeredAt)) || !Number.isFinite(Date.parse(p.outcomeDueAt)) || Date.parse(p.registeredAt) >= Date.parse(p.outcomeDueAt) || !Number.isFinite(p.before) || p.before < 0 || p.before > 1 || p.after !== null && (!Number.isFinite(p.after) || p.after < 0 || p.after > 1) || p.after !== null && !p.performed || ![p.independent, p.rubricMatched, p.attributionBundle, p.performed].every((v) => typeof v === "boolean") || typeof p.note !== "string") throw Error("\uBE44\uAD50 \uAE30\uB85D\uC758 \uAE30\uC900\xB7\uC810\uC218\xB7\uC2DC\uC810\uC744 \uD655\uC778\uD574 \uC8FC\uC138\uC694.");
    pairIds.add(p.id);
  }
  if (w.snapshots !== void 0 && (!Array.isArray(w.snapshots) || w.snapshots.some((s) => !s || typeof s.id !== "string" || !Number.isFinite(Date.parse(s.createdAt)) || typeof s.dataVersion !== "string" || typeof s.policyVersion !== "string" || !Number.isSafeInteger(s.workspaceRevision)))) throw Error("\uCD94\uCC9C \uC774\uB825\uC744 \uD655\uC778\uD574 \uC8FC\uC138\uC694.");
  if (w.scheduleChecks !== void 0 && (!Array.isArray(w.scheduleChecks) || new Set(w.scheduleChecks.map((c) => c?.id)).size !== w.scheduleChecks.length || w.scheduleChecks.some((c) => !c || typeof c.id !== "string" || !c.id || !data.subjects.some((s) => s.id === c.subjectId) || !Number.isFinite(Date.parse(c.at))))) throw Error("\uACFC\uBAA9 \uACF5\uC9C0 \uD655\uC778 \uAE30\uB85D\uC744 \uD655\uC778\uD574 \uC8FC\uC138\uC694.");
}
function scheduleDeadline(s) {
  return s.dueDate ? (/* @__PURE__ */ new Date(`${s.dueDate}T${s.dueTime || "23:59:59.999"}+09:00`)).toISOString() : null;
}
function scheduleOpening(s) {
  return s.opensDate ? (/* @__PURE__ */ new Date(`${s.opensDate}T${s.opensTime || "00:00"}+09:00`)).toISOString() : null;
}

// src/domain/schedule-management.ts
var koreanDay = (at = (/* @__PURE__ */ new Date()).toISOString()) => new Date(Date.parse(at) + 9 * 36e5).toISOString().slice(0, 10);
var addDays = (day2, days) => new Date(Date.parse(`${day2}T00:00:00Z`) + days * 864e5).toISOString().slice(0, 10);
function schedulePending(s) {
  return !s.deletedAt && s.status === "active" && (scheduleWorkSteps(s).length === 0 || scheduleWorkSteps(s).some((step) => s.states[step] !== "done"));
}
function deadlinePending(s) {
  return schedulePending(s) && !(s.kind === "assignment" && s.states.submit === "done") && !(["lecture", "class"].includes(s.kind) && s.dueMeaning === "attendance" && s.states.attendance === "done");
}
function remainingTime(s, at) {
  const due = scheduleDeadline(s);
  if (!due) return "\uAE30\uD55C \uBBF8\uC815";
  const ms = Date.parse(due) - Date.parse(at);
  const days = Math.abs(Math.round((Date.parse(`${s.dueDate}T00:00:00Z`) - Date.parse(`${koreanDay(at)}T00:00:00Z`)) / 864e5));
  if (ms < 0) return days ? `${days}\uC77C \uC9C0\uB0A8` : "\uAE30\uD55C \uC9C0\uB0A8";
  if (!s.dueTime) return days ? `${days}\uC77C \uB0A8\uC74C \xB7 \uC2DC\uAC01 \uBBF8\uC815` : "\uC624\uB298 \xB7 \uC2DC\uAC01 \uBBF8\uC815";
  if (ms < 36e5) return `${Math.ceil(ms / 6e4)}\uBD84 \uB0A8\uC74C`;
  return days ? `${days}\uC77C \uB0A8\uC74C \xB7 ${s.dueTime}` : `${Math.ceil(ms / 36e5)}\uC2DC\uAC04 \uB0A8\uC74C \xB7 ${s.dueTime}`;
}
function orderSchedules(schedules) {
  return [...schedules].sort((a, b) => (a.dueDate || "9999-12-31").localeCompare(b.dueDate || "9999-12-31") || (a.dueTime || "23:59").localeCompare(b.dueTime || "23:59") || a.name.localeCompare(b.name, "ko") || a.id.localeCompare(b.id));
}
function scheduleDigest(schedules, at) {
  const day2 = koreanDay(at), until = addDays(day2, 7);
  const due = orderSchedules(schedules.filter((s) => deadlinePending(s) && s.dueDate >= day2 && s.dueDate <= until && Date.parse(scheduleDeadline(s)) >= Date.parse(at)));
  const unknown = schedules.filter((s) => schedulePending(s) && !s.dueDate && s.reviewDate && s.reviewDate <= day2);
  return { day: day2, due, unknown, count: due.length + unknown.length };
}

// src/server/schedule-notifications.ts
var cors = { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Headers": "authorization, apikey, content-type, x-client-info", "Access-Control-Allow-Methods": "POST, OPTIONS", "Cache-Control": "no-store" };
var json = (body, status = 200) => new Response(JSON.stringify(body), { status, headers: { ...cors, "Content-Type": "application/json" } });
function allowedPushEndpoint(endpoint) {
  if (typeof endpoint !== "string" || endpoint.length > 4096) return false;
  try {
    const url2 = new URL(endpoint);
    return url2.protocol === "https:" && !url2.username && !url2.password && !url2.port && !url2.hash && (url2.hostname === "fcm.googleapis.com" || url2.hostname === "updates.push.services.mozilla.com" || url2.hostname.endsWith(".push.services.mozilla.com") || url2.hostname === "web.push.apple.com" || url2.hostname.endsWith(".push.apple.com"));
  } catch {
    return false;
  }
}
function validatePushSubscription(value) {
  const s = value;
  const key2 = (value2, size) => {
    if (typeof value2 !== "string" || !/^[A-Za-z0-9_-]+={0,2}$/.test(value2)) return false;
    try {
      return atob(value2.replace(/-/g, "+").replace(/_/g, "/")).length === size;
    } catch {
      return false;
    }
  };
  if (!s || !allowedPushEndpoint(s.endpoint) || !s.keys || !key2(s.keys.auth, 16) || !key2(s.keys.p256dh, 65) || s.expirationTime !== void 0 && s.expirationTime !== null && (!Number.isFinite(s.expirationTime) || s.expirationTime < 0)) throw Error("\uC54C\uB9BC \uAD6C\uB3C5 \uD615\uC2DD\uC744 \uD655\uC778\uD574 \uC8FC\uC138\uC694.");
  return { endpoint: s.endpoint, keys: { auth: s.keys.auth, p256dh: s.keys.p256dh }, expirationTime: s.expirationTime ?? null };
}
async function handleScheduleNotifications(request, backend2, config) {
  if (request.method === "OPTIONS") return new Response(null, { status: 204, headers: cors });
  if (request.method !== "POST") return json({ message: "\uC9C0\uC6D0\uD558\uC9C0 \uC54A\uB294 \uC694\uCCAD\uC785\uB2C8\uB2E4." }, 405);
  try {
    const text3 = await request.text();
    if (text3.length > 12e3) return json({ message: "\uC54C\uB9BC \uC694\uCCAD\uC774 \uB108\uBB34 \uD07D\uB2C8\uB2E4." }, 413);
    let body;
    try {
      body = JSON.parse(text3);
    } catch {
      return json({ message: "\uC54C\uB9BC \uC694\uCCAD\uC744 \uC77D\uC9C0 \uBABB\uD588\uC2B5\uB2C8\uB2E4." }, 400);
    }
    if (!body || typeof body !== "object" || Array.isArray(body)) return json({ message: "\uC54C\uB9BC \uC694\uCCAD\uC744 \uD655\uC778\uD574 \uC8FC\uC138\uC694." }, 400);
    if (body.action === "dispatch") {
      if (config.cronSecret.length < 32 || request.headers.get("authorization") !== `Bearer ${config.cronSecret}`) return json({ message: "\uC54C\uB9BC \uBC1C\uC1A1 \uAD8C\uD55C\uC774 \uC5C6\uC2B5\uB2C8\uB2E4." }, 403);
      const at = config.now?.() ?? (/* @__PURE__ */ new Date()).toISOString(), hour = new Date(Date.parse(at) + 9 * 36e5).getUTCHours();
      if (hour !== 9) return json({ sent: 0, outsideWindow: true });
      let sent = 0, failed = 0;
      for (const job of await backend2.claim(at)) {
        try {
          if (job.day !== koreanDay(at) || !allowedPushEndpoint(job.subscription.endpoint) || !await backend2.approved(job.userId)) {
            await backend2.finish(job, "empty");
            continue;
          }
          const data = await backend2.read(job.userId);
          if (!data || data.userId !== job.userId || data.namespace !== "personal") {
            await backend2.finish(job, "empty");
            continue;
          }
          const schedules = data.learningPlans?.find((row) => !row.deletedAt)?.workspace.schedules ?? [], subjectIds = new Set(data.subjects.filter((s) => !s.deletedAt && s.userId === job.userId && s.namespace === "personal").map((s) => s.id));
          const digest = scheduleDigest(schedules.filter((s) => subjectIds.has(s.subjectId)), at);
          if (!digest.count) {
            await backend2.finish(job, "empty");
            continue;
          }
          const names = [...digest.due.map((s) => `${s.name} \xB7 ${remainingTime(s, at)}`), ...digest.unknown.map((s) => `${s.name} \xB7 \uACF5\uC9C0\uC5D0\uC11C \uAE30\uD55C \uD655\uC778`)];
          let message = "";
          for (const name of names) {
            if (new TextEncoder().encode(message + name).length > 2400) {
              message += "\n\uC804\uCCB4 \uC77C\uC815\uC740 \uACF5\uBD80 \uACF5\uAC04\uC5D0\uC11C \uD655\uC778\uD574 \uC8FC\uC138\uC694.";
              break;
            }
            message += (message ? "\n" : "") + name;
          }
          await backend2.send(job.subscription, { title: `\uC77C\uC8FC\uC77C \uC548\uC758 \uACF5\uBD80 \uC77C\uC815 ${digest.count}\uAC1C`, body: message });
          await backend2.finish(job, "sent");
          sent++;
        } catch (error) {
          const expired = [404, 410].includes(error?.statusCode ?? 0);
          await backend2.finish(job, expired ? "expired" : "retry");
          failed++;
        }
      }
      return json({ sent, failed });
    }
    const authorization = request.headers.get("authorization");
    if (!authorization?.startsWith("Bearer ")) return json({ message: "\uB0B4 \uACF5\uBD80 \uACF5\uAC04\uC5D0 \uB2E4\uC2DC \uB85C\uADF8\uC778\uD574 \uC8FC\uC138\uC694." }, 401);
    let owner;
    try {
      owner = await backend2.authenticate(authorization.slice(7));
    } catch {
      return json({ message: "\uB0B4 \uACF5\uBD80 \uACF5\uAC04\uC5D0 \uB2E4\uC2DC \uB85C\uADF8\uC778\uD574 \uC8FC\uC138\uC694." }, 401);
    }
    if (!owner || !await backend2.approved(owner)) return json({ message: "\uC2B9\uC778\uB41C \uB0B4 \uACF5\uBD80 \uACF5\uAC04\uC5D0\uC11C \uC54C\uB9BC\uC744 \uC0AC\uC6A9\uD560 \uC218 \uC788\uC2B5\uB2C8\uB2E4." }, 403);
    if (body.action === "config") {
      if (!config.publicKey) return json({ message: "\uC54C\uB9BC \uC11C\uBC84 \uC5F0\uACB0\uC744 \uD655\uC778\uD558\uC9C0 \uBABB\uD588\uC2B5\uB2C8\uB2E4. \uCE98\uB9B0\uB354 \uD30C\uC77C\uB85C \uC77C\uC815\uC744 \uAC00\uC838\uAC08 \uC218 \uC788\uC2B5\uB2C8\uB2E4." }, 503);
      return json({ publicKey: config.publicKey });
    }
    if (body.action === "subscribe") {
      let subscription;
      try {
        subscription = validatePushSubscription(body.subscription);
      } catch {
        return json({ message: "\uC54C\uB9BC \uAD6C\uB3C5 \uD615\uC2DD\uC744 \uD655\uC778\uD574 \uC8FC\uC138\uC694." }, 400);
      }
      await backend2.save(owner, subscription);
      return json({ enabled: true });
    }
    if (!allowedPushEndpoint(body.endpoint)) return json({ message: "\uC54C\uB9BC \uAD6C\uB3C5 \uC8FC\uC18C\uB97C \uD655\uC778\uD574 \uC8FC\uC138\uC694." }, 400);
    if (body.action === "unsubscribe") {
      await backend2.remove(owner, body.endpoint);
      return json({ enabled: false });
    }
    if (body.action === "status") return json({ enabled: await backend2.status(owner, body.endpoint) });
    return json({ message: "\uC9C0\uC6D0\uD558\uC9C0 \uC54A\uB294 \uC54C\uB9BC \uC694\uCCAD\uC785\uB2C8\uB2E4." }, 400);
  } catch {
    return json({ message: "\uC54C\uB9BC \uC5F0\uACB0\uC744 \uCC98\uB9AC\uD558\uC9C0 \uBABB\uD588\uC2B5\uB2C8\uB2E4. \uC77C\uC815 \uC6D0\uBB38\uC740 \uC720\uC9C0\uD588\uC2B5\uB2C8\uB2E4. \uB2E4\uC2DC \uC2DC\uB3C4\uD574 \uC8FC\uC138\uC694." }, 503);
  }
}

// src/server/state-codec.ts
var import_lz_string = __toESM(require_lz_string(), 1);

// node_modules/ts-fsrs/dist/index.mjs
var FSRSError = class _FSRSError extends Error {
  constructor(message = "FSRS Error") {
    super(message);
    this.name = "FSRSError";
    Error.captureStackTrace?.(this, _FSRSError);
  }
};
var FSRSValidationError = class _FSRSValidationError extends FSRSError {
  constructor(message) {
    super(message);
    this.name = "FSRSValidationError";
    Error.captureStackTrace?.(this, _FSRSValidationError);
  }
};
var State = /* @__PURE__ */ ((State2) => {
  State2[State2["New"] = 0] = "New";
  State2[State2["Learning"] = 1] = "Learning";
  State2[State2["Review"] = 2] = "Review";
  State2[State2["Relearning"] = 3] = "Relearning";
  return State2;
})(State || {});
var Rating = /* @__PURE__ */ ((Rating2) => {
  Rating2[Rating2["Manual"] = 0] = "Manual";
  Rating2[Rating2["Again"] = 1] = "Again";
  Rating2[Rating2["Hard"] = 2] = "Hard";
  Rating2[Rating2["Good"] = 3] = "Good";
  Rating2[Rating2["Easy"] = 4] = "Easy";
  return Rating2;
})(Rating || {});
var TypeConvert = class _TypeConvert {
  static card(card) {
    return {
      ...card,
      state: _TypeConvert.state(card.state),
      due: _TypeConvert.time(card.due),
      last_review: card.last_review ? _TypeConvert.time(card.last_review) : void 0
    };
  }
  static rating(value) {
    if (typeof value === "string") {
      const firstLetter = value.charAt(0).toUpperCase();
      const restOfString = value.slice(1).toLowerCase();
      const ret = Rating[`${firstLetter}${restOfString}`];
      if (ret === void 0) {
        throw new FSRSValidationError(`Invalid rating:[${value}]`);
      }
      return ret;
    } else if (typeof value === "number") {
      return value;
    }
    throw new FSRSValidationError(`Invalid rating:[${value}]`);
  }
  static state(value) {
    if (typeof value === "string") {
      const firstLetter = value.charAt(0).toUpperCase();
      const restOfString = value.slice(1).toLowerCase();
      const ret = State[`${firstLetter}${restOfString}`];
      if (ret === void 0) {
        throw new FSRSValidationError(`Invalid state:[${value}]`);
      }
      return ret;
    } else if (typeof value === "number") {
      return value;
    }
    throw new FSRSValidationError(`Invalid state:[${value}]`);
  }
  static time(value) {
    if (value instanceof Date) {
      return value;
    }
    const date = new Date(value);
    if (typeof value === "object" && value !== null && !Number.isNaN(Date.parse(value) || +date)) {
      return date;
    } else if (typeof value === "string") {
      const timestamp = Date.parse(value);
      if (!Number.isNaN(timestamp)) {
        return new Date(timestamp);
      } else {
        throw new FSRSValidationError(`Invalid date:[${value}]`);
      }
    } else if (typeof value === "number") {
      return new Date(value);
    }
    throw new FSRSValidationError(`Invalid date:[${value}]`);
  }
  static review_log(log) {
    return {
      ...log,
      due: _TypeConvert.time(log.due),
      rating: _TypeConvert.rating(log.rating),
      state: _TypeConvert.state(log.state),
      review: _TypeConvert.time(log.review)
    };
  }
};
Date.prototype.scheduler = function(t, isDay) {
  return date_scheduler(this, t, isDay);
};
Date.prototype.diff = function(pre, unit) {
  return date_diff(this, pre, unit);
};
Date.prototype.format = function() {
  return formatDate(this);
};
Date.prototype.dueFormat = function(last_review, unit, timeUnit) {
  return show_diff_message(this, last_review, unit, timeUnit);
};
function date_scheduler(now, t, isDay) {
  return new Date(
    isDay ? TypeConvert.time(now).getTime() + t * 24 * 60 * 60 * 1e3 : TypeConvert.time(now).getTime() + t * 60 * 1e3
  );
}
function date_diff(now, pre, unit) {
  if (!now || !pre) {
    throw new FSRSValidationError("Invalid date");
  }
  const diff = TypeConvert.time(now).getTime() - TypeConvert.time(pre).getTime();
  let r = 0;
  switch (unit) {
    case "days":
      r = Math.floor(diff / (24 * 60 * 60 * 1e3));
      break;
    case "minutes":
      r = Math.floor(diff / (60 * 1e3));
      break;
  }
  return r;
}
function formatDate(dateInput) {
  const date = TypeConvert.time(dateInput);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day2 = date.getDate();
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const seconds = date.getSeconds();
  return `${year}-${padZero(month)}-${padZero(day2)} ${padZero(hours)}:${padZero(
    minutes
  )}:${padZero(seconds)}`;
}
function padZero(num) {
  return num < 10 ? `0${num}` : `${num}`;
}
var TIMEUNIT = [60, 60, 24, 31, 12];
var TIMEUNITFORMAT = ["second", "min", "hour", "day", "month", "year"];
function show_diff_message(due, last_review, unit, timeUnit = TIMEUNITFORMAT) {
  due = TypeConvert.time(due);
  last_review = TypeConvert.time(last_review);
  if (timeUnit.length !== TIMEUNITFORMAT.length) {
    timeUnit = TIMEUNITFORMAT;
  }
  let diff = due.getTime() - last_review.getTime();
  let i = 0;
  diff /= 1e3;
  for (i = 0; i < TIMEUNIT.length; i++) {
    if (diff < TIMEUNIT[i]) {
      break;
    } else {
      diff /= TIMEUNIT[i];
    }
  }
  return `${Math.floor(diff)}${unit ? timeUnit[i] : ""}`;
}
var Grades = Object.freeze([
  Rating.Again,
  Rating.Hard,
  Rating.Good,
  Rating.Easy
]);
var version = "5.4.2";
var default_learning_steps = Object.freeze([
  "1m",
  "10m"
]);
var default_relearning_steps = Object.freeze([
  "10m"
]);
var FSRSVersion = `v${version} using FSRS-6.0`;
var FSRS6_DEFAULT_DECAY = 0.1542;
var default_w = Object.freeze([
  0.212,
  1.2931,
  2.3065,
  8.2956,
  6.4133,
  0.8334,
  3.0194,
  1e-3,
  1.8722,
  0.1666,
  0.796,
  1.4835,
  0.0614,
  0.2629,
  1.6483,
  0.6014,
  1.8729,
  0.5425,
  0.0912,
  0.0658,
  FSRS6_DEFAULT_DECAY
]);

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

// src/domain/recall-cloze.ts
function parse(source) {
  if (typeof source !== "string" || source.length > 1e5) throw new DomainError("INVALID_CLOZE", "\uBE48\uCE78 \uBB38\uC7A5\uC744 \uD655\uC778\uD574 \uC8FC\uC138\uC694.");
  let pos = 0;
  const read = (nested, depth) => {
    if (depth > 8) throw new DomainError("INVALID_CLOZE", "\uACB9\uCE5C \uBE48\uCE78\uC740 \uC5EC\uB35F \uB2E8\uACC4\uAE4C\uC9C0 \uC0AC\uC6A9\uD560 \uC218 \uC788\uC2B5\uB2C8\uB2E4.");
    const parts = [];
    let text3 = "";
    while (pos < source.length) {
      if (nested && source.startsWith("}}", pos)) break;
      const match = source.startsWith("{{c", pos) && source.slice(pos).match(/^\{\{c(\d+(?:,\d+)*)::/);
      if (match) {
        if (text3) {
          parts.push(text3);
          text3 = "";
        }
        const numbers = [...new Set(match[1].split(",").map(Number))];
        if (numbers.some((n) => !Number.isSafeInteger(n) || n < 1 || n > 999)) throw new DomainError("INVALID_CLOZE", "\uBE48\uCE78 \uBC88\uD638\uB294 1\uBD80\uD130 999\uAE4C\uC9C0 \uC0AC\uC6A9\uD574 \uC8FC\uC138\uC694.");
        pos += match[0].length;
        const body = read(true, depth + 1);
        if (!source.startsWith("}}", pos)) throw new DomainError("INVALID_CLOZE", "\uBE48\uCE78\uC758 \uB05D\uC5D0 }}\uB97C \uBD99\uC5EC \uC8FC\uC138\uC694.");
        pos += 2;
        let hint = "";
        const last = body.at(-1);
        if (typeof last === "string" && last.includes("::")) {
          const split = last.indexOf("::");
          hint = last.slice(split + 2);
          body[body.length - 1] = last.slice(0, split);
        }
        parts.push({ numbers, body, hint });
      } else {
        text3 += source[pos++];
      }
    }
    if (text3) parts.push(text3);
    return parts;
  };
  return read(false, 0);
}
function clozeNumbers(source) {
  const numbers = /* @__PURE__ */ new Set();
  const visit = (parts) => {
    for (const p of parts) if (typeof p !== "string") {
      p.numbers.forEach((n) => numbers.add(n));
      visit(p.body);
    }
  };
  visit(parse(source));
  return [...numbers].sort((a, b) => a - b);
}

// src/domain/recall-scheduler.ts
var RECALL_GRADES = [1, 2, 3, 4];
var invalid = () => {
  throw new DomainError("INVALID_RECALL", "\uBCF5\uC2B5 \uC124\uC815\uACFC \uCE74\uB4DC\uC758 \uC800\uC7A5 \uB0B4\uC6A9\uC744 \uD655\uC778\uD574 \uC8FC\uC138\uC694. \uC6D0\uBB38\uC740 \uBCC0\uACBD\uD558\uC9C0 \uC54A\uC558\uC2B5\uB2C8\uB2E4.");
};
var isDate = (v) => typeof v === "string" && Number.isFinite(Date.parse(v));
function validateRecallOptions(options) {
  if (options?.burySiblings !== void 0 && typeof options.burySiblings !== "boolean") invalid();
  if (options?.parameters !== void 0 && (!Array.isArray(options.parameters) || options.parameters.length !== 21 || options.parameters.some((v, i) => !Number.isFinite(v) || v < 0 || v > 100 || i < 4 && v < 1e-3 || i === 20 && (v < 0.1 || v > 0.8)))) invalid();
  if (options?.optimizedAt !== void 0 && !isDate(options.optimizedAt) || options?.optimizedReviews !== void 0 && (!Number.isSafeInteger(options.optimizedReviews) || options.optimizedReviews < 1)) invalid();
  if (!options || !Number.isFinite(options.retention) || options.retention < 0.7 || options.retention > 0.97 || !Number.isSafeInteger(options.newPerDay) || options.newPerDay < 0 || options.newPerDay > 9999 || !Number.isSafeInteger(options.maximumDays) || options.maximumDays < 1 || options.maximumDays > 36500) invalid();
  for (const steps of [options.learningMinutes, options.relearningMinutes]) {
    if (!Array.isArray(steps) || steps.length > 10 || steps.some((v, i) => !Number.isSafeInteger(v) || v < 1 || v > 1440 || i > 0 && v <= steps[i - 1])) invalid();
  }
}
function validateMemory(memory) {
  if (!memory || !isDate(memory.due) || memory.last_review !== void 0 && !isDate(memory.last_review) || ![0, 1, 2, 3].includes(memory.state)) invalid();
  for (const k of ["stability", "difficulty", "elapsed_days", "scheduled_days", "learning_steps", "reps", "lapses"])
    if (!Number.isFinite(memory[k]) || memory[k] < 0) invalid();
  for (const k of ["elapsed_days", "scheduled_days", "learning_steps", "reps", "lapses"])
    if (!Number.isSafeInteger(memory[k])) invalid();
  if (memory.difficulty > 10 || memory.lapses > memory.reps) invalid();
}
function validateRecallCard(card, state) {
  if (card.deckId !== void 0 && !state.recallPreferences?.some((row) => row.id === card.deckId && row.deckName !== void 0)) invalid();
  if (card.suspended !== void 0 && typeof card.suspended !== "boolean") invalid();
  if (card.cloze && (typeof card.cloze.noteId !== "string" || !card.cloze.noteId || !Number.isSafeInteger(card.cloze.number) || !card.suspended && !clozeNumbers(card.cloze.source).includes(card.cloze.number))) invalid();
  if (card.importSource && (typeof card.importSource.key !== "string" || !card.importSource.key || JSON.stringify(card.importSource).length > 3e5)) invalid();
  if (card.front !== void 0 && (typeof card.front !== "string" || !card.front.trim() || card.front.length > 1e5)) invalid();
  if (!state.nodes.some((node) => node.id === card.topicId && node.role === "topic") || typeof card.reference !== "string" || card.reference.length > 1e5 || !Array.isArray(card.reviews) || card.manualDue !== void 0 && !isDate(card.manualDue)) invalid();
  validateMemory(card.memory);
  const ids = /* @__PURE__ */ new Set();
  for (const review of card.reviews) {
    if (!review || typeof review.id !== "string" || !review.id || ids.has(review.id) || !isDate(review.at) || !RECALL_GRADES.includes(review.rating) || review.memoId !== null && !(state.memos ?? []).some((memo) => memo.id === review.memoId && memo.ownerId === card.topicId)) invalid();
    ids.add(review.id);
    validateMemory(review.before);
    validateMemory(review.after);
    validateRecallOptions(review.options);
  }
}

// src/domain/recommendation-kernel.mjs
var POLICY = Object.freeze({
  version: "rules-2-webapp",
  criticalFraction: 0.1,
  emphasisFraction: 0.2,
  refreshFraction: 0.1,
  freezeFraction: 0.1,
  maxCards: 3,
  shrinkage: 8,
  minPairs: 8,
  maxPairs: 20,
  maxMissingFraction: 0.2,
  maxAdaptiveLift: 0.2
});

// src/domain/recommendation-workspace.ts
function validISO(value) {
  return typeof value === "string" && /(?:Z|[+-]\d\d:\d\d)$/.test(value) && Number.isFinite(Date.parse(value));
}
function dateDeadline(date) {
  if (!date) return null;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || (/* @__PURE__ */ new Date(`${date}T00:00:00Z`)).toISOString().slice(0, 10) !== date) throw Error("\uAE30\uD55C\uC744 \uB2E4\uC2DC \uD655\uC778\uD574 \uC8FC\uC138\uC694.");
  return (/* @__PURE__ */ new Date(`${date}T23:59:59.999+09:00`)).toISOString();
}
function termPeriod(dates) {
  if (!dates.start && !dates.end) return null;
  if (!dates.start || !dates.end) throw Error("\uD559\uAE30 \uC2DC\uC791\uC77C\uACFC \uC885\uB8CC\uC77C\uC744 \uD568\uAED8 \uB0A8\uAE30\uAC70\uB098 \uB458 \uB2E4 \uBE44\uC6CC \uC8FC\uC138\uC694.");
  dateDeadline(dates.start);
  const end = dateDeadline(dates.end);
  const start = (/* @__PURE__ */ new Date(`${dates.start}T00:00:00+09:00`)).toISOString();
  if (Date.parse(end) < Date.parse(start)) throw Error("\uC885\uB8CC\uC77C\uC740 \uC2DC\uC791\uC77C\uBCF4\uB2E4 \uC55E\uC124 \uC218 \uC5C6\uC2B5\uB2C8\uB2E4.");
  return { start, end: new Date(Date.parse(end) + 1).toISOString(), timezone: "Asia/Seoul" };
}
function validateRecommendations(value, data) {
  const w = value;
  if (!w || w.version !== 1 || w.userId !== data.userId || w.namespace !== data.namespace || !Number.isSafeInteger(w.revision) || w.revision < 0 || !Array.isArray(w.goals) || !Array.isArray(w.events) || !w.controls || typeof w.controls !== "object" || !w.responses || typeof w.responses !== "object" || !w.draft || typeof w.draft.targetId !== "string" || typeof w.draft.label !== "string" || typeof w.draft.dueDate !== "string" || !["same", "new"].includes(w.draft.novelty)) throw Error("\uCD94\uCC9C \uB0B4\uC6A9\uC744 \uC77D\uC9C0 \uBABB\uD588\uC2B5\uB2C8\uB2E4. \uC6D0\uB798 \uB0B4\uC6A9\uC740 \uBCF4\uC874\uD588\uC2B5\uB2C8\uB2E4.");
  const ids = /* @__PURE__ */ new Set();
  for (const goal of w.goals) {
    if (!data.nodes.some((n) => n.id === goal.targetId && n.role === "topic") || typeof goal.id !== "string" || !goal.id || ids.has(goal.id) || typeof goal.targetId !== "string" || typeof goal.label !== "string" || !goal.label.trim() || typeof goal.dueDate !== "string" || typeof goal.ended !== "boolean" || !validISO(goal.createdAt) || !["same", "new"].includes(goal.novelty)) throw Error("\uD655\uC778\uD560 \uB0B4\uC6A9\uC758 \uD615\uC2DD\uC744 \uB2E4\uC2DC \uD655\uC778\uD574 \uC8FC\uC138\uC694.");
    if (goal.minDelayDays !== void 0 && (!Number.isFinite(goal.minDelayDays) || goal.minDelayDays < 0) || goal.refreshDays != null && (!Number.isFinite(goal.refreshDays) || goal.refreshDays <= 0)) throw Error("\uC7AC\uD655\uC778 \uAC04\uACA9\uC744 \uD655\uC778\uD574 \uC8FC\uC138\uC694.");
    ids.add(goal.id);
    dateDeadline(goal.dueDate);
  }
  for (const e of w.events) {
    if (!e.id || !Number.isSafeInteger(e.revision) || e.revision < 1 || !Number.isSafeInteger(e.sequence) || !validISO(e.knownAt) || !validISO(e.occurredAt) || !w.goals.some((g) => g.id === e.facet && g.targetId === e.targetId) || e.rubricVersion !== "self-check-1" || !["assessment", "correction"].includes(e.kind) || !["none", "notes", "unknown"].includes(e.assistance ?? "") || !["pass", "fail", "unknown", "disputed"].includes(e.result ?? "") || !["same", "new", "unknown"].includes(e.novelty ?? "") || typeof e.answer !== "string" || e.authority !== "local") throw Error("\uC218\uD589 \uACB0\uACFC\uC758 \uC5F0\uACB0\uC744 \uD655\uC778\uD558\uC9C0 \uBABB\uD588\uC2B5\uB2C8\uB2E4.");
  }
  for (const e of w.events) {
    if (e.delayDays !== void 0 && (!Number.isFinite(e.delayDays) || e.delayDays < 0) || e.delayVerified !== void 0 && typeof e.delayVerified !== "boolean") throw Error("\uC2E4\uC81C \uC218\uD589 \uAC04\uACA9\uC744 \uD655\uC778\uD574 \uC8FC\uC138\uC694.");
    if (e.kind === "correction" && !w.events.some((f) => f.id === e.errorEventId && f.facet === e.facet && f.result === "fail")) throw Error("\uAD50\uC815\uC5D0 \uC5F0\uACB0\uB41C \uC2E4\uD328\uB97C \uD655\uC778\uD574 \uC8FC\uC138\uC694.");
  }
  for (const response of Object.values(w.responses)) {
    if (!response || !["pass", "fail", "unknown", "disputed"].includes(response.result) || !["none", "notes", "unknown"].includes(response.assistance) || !["same", "new", "unknown"].includes(response.novelty) || typeof response.answer !== "string") throw Error("\uC791\uC131 \uC911\uC778 \uACB0\uACFC\uB97C \uC77D\uC9C0 \uBABB\uD588\uC2B5\uB2C8\uB2E4.");
  }
  for (const control of Object.values(w.controls)) if (!control || control.snoozeUntil && !validISO(control.snoozeUntil)) throw Error("\uBCF4\uB958 \uC2DC\uC810\uC744 \uC77D\uC9C0 \uBABB\uD588\uC2B5\uB2C8\uB2E4.");
  if (w.terms !== void 0) {
    if (!w.terms || Array.isArray(w.terms) || typeof w.terms !== "object") throw Error("\uD559\uAE30 \uAE30\uAC04\uC744 \uC77D\uC9C0 \uBABB\uD588\uC2B5\uB2C8\uB2E4.");
    for (const dates of Object.values(w.terms)) {
      if (typeof dates.start !== "string" || typeof dates.end !== "string") throw Error("\uD559\uAE30 \uAE30\uAC04\uC744 \uC77D\uC9C0 \uBABB\uD588\uC2B5\uB2C8\uB2E4.");
      termPeriod(dates);
    }
  }
  validateScheduleExtensions(w, data);
  validateLearningLinks(w, data);
  if (w.termDraft && (typeof w.termDraft.semesterId !== "string" || typeof w.termDraft.start !== "string" || typeof w.termDraft.end !== "string")) throw Error("\uC791\uC131 \uC911\uC778 \uD559\uAE30 \uAE30\uAC04\uC744 \uC77D\uC9C0 \uBABB\uD588\uC2B5\uB2C8\uB2E4.");
}

// src/domain/learning-evidence.ts
function canonical(value) {
  if (Array.isArray(value)) return "[" + value.map(canonical).join(",") + "]";
  if (value && typeof value === "object") return "{" + Object.entries(value).filter(([, v]) => v !== void 0).sort(([a], [b]) => a.localeCompare(b)).map(([k, v]) => JSON.stringify(k) + ":" + canonical(v)).join(",") + "}";
  return JSON.stringify(value);
}
var owned = (data, row) => row.userId === data.userId && row.namespace === data.namespace;
function sourceRevision(data, collection, id, version2) {
  const live = data[collection]?.find((row) => row.id === id && row.version === version2 && owned(data, row));
  if (live) return live;
  for (const revision of data.revisions) {
    if (revision.collection !== collection || revision.entityId !== id || !owned(data, revision)) continue;
    const row = [revision.after, revision.before].find((row2) => row2?.version === version2 && row2.id === id && owned(data, row2));
    if (row) return row;
  }
}
function performanceSource(data, kind, id, itemId, version2) {
  const collection = kind === "exam-memo" ? "memos" : "memoryTests";
  const row = version2 === void 0 ? data[collection]?.find((row2) => row2.id === id && !row2.deletedAt && owned(data, row2)) : sourceRevision(data, collection, id, version2);
  if (!row) throw Error("\uC800\uC7A5\uB41C \uB2F5\uC548\uC758 \uC6D0\uBB38\uC744 \uCC3E\uC9C0 \uBABB\uD588\uC2B5\uB2C8\uB2E4.");
  if (kind === "exam-memo") {
    const memo = row;
    if (!memo.id.startsWith("exam-practice:") || !memo.ownerId) throw Error("\uC8FC\uC81C\uC640 \uC5F0\uACB0\uB41C \uC2DC\uD5D8 \uC5F0\uC2B5 \uBA54\uBAA8\uB97C \uC120\uD0DD\uD574 \uC8FC\uC138\uC694.");
    return { kind, id, version: row.version, topicId: memo.ownerId, body: memo.body, strokes: structuredClone(memo.strokes), performedAt: null };
  }
  const test = row, question = test.questions.find((q) => q.cardId === itemId);
  if (!question) throw Error("\uC2DC\uD5D8 \uB2F9\uC2DC\uC758 \uBB38\uD56D\uC744 \uCC3E\uC9C0 \uBABB\uD588\uC2B5\uB2C8\uB2E4.");
  return { kind, id, version: row.version, itemId, topicId: question.topicId, body: question.response, strokes: structuredClone(question.responseStrokes), question: question.question, reference: question.answer, referenceStrokes: structuredClone(question.strokes), performedAt: test.endedAt };
}
function validatePerformanceSource(value, data) {
  if (!value || !["exam-memo", "memory-question"].includes(value.kind) || typeof value.id !== "string" || !Number.isSafeInteger(value.version) || value.version < 1) throw Error("\uB2F5\uC548\uC758 \uCD9C\uCC98\uB97C \uD655\uC778\uD574 \uC8FC\uC138\uC694.");
  const original = performanceSource(data, value.kind, value.id, value.itemId, value.version);
  if (canonical(original) !== canonical(value)) throw Error("\uC218\uD589 \uACB0\uACFC\uC5D0 \uC5F0\uACB0\uB41C \uB2F5\uC548\uC774 \uC6D0\uBB38\uACFC \uB2E4\uB985\uB2C8\uB2E4.");
}
function sourceEventId(source, goalId) {
  return "source-result:" + [source.kind, source.id, source.itemId ?? "", goalId].map(encodeURIComponent).join(":");
}
function validateMaterialCardSource(content, data, requireCurrent = false) {
  const source = content.materialSource;
  if (!source) return;
  if (source.reviewed !== true || !Number.isSafeInteger(source.materialVersion) || source.materialVersion < 1 || ![source.materialId, source.resultId, source.cardId].every((id) => typeof id === "string" && !!id)) throw Error("\uCE74\uB4DC\uC758 \uC6D0\uC790\uB8CC\uC640 \uD655\uC778 \uC5EC\uBD80\uB97C \uD655\uC778\uD574 \uC8FC\uC138\uC694.");
  const material = sourceRevision(data, "studyMaterials", source.materialId, source.materialVersion);
  const card = material?.results.find((r) => r.id === source.resultId)?.cards.find((c) => c.id === source.cardId);
  if (!material || !card || !data.nodes.some((n) => n.id === content.topicId && n.subjectId === material.subjectId)) throw Error("\uCE74\uB4DC\uC758 \uC6D0\uC790\uB8CC\uC640 \uC8FC\uC81C\uAC00 \uC5F0\uACB0\uB418\uC9C0 \uC54A\uC2B5\uB2C8\uB2E4.");
  if (requireCurrent && (material.deletedAt || card.excluded || data.studyMaterials?.find((m) => m.id === material.id)?.version !== source.materialVersion || card.question !== content.question || card.answer !== content.answer)) throw Error("\uC6D0\uC790\uB8CC\uAC00 \uBC14\uB00C\uC5C8\uC2B5\uB2C8\uB2E4. \uC800\uC7A5\uB41C \uCE74\uB4DC\uC640 \uC6D0\uBB38\uC744 \uB2E4\uC2DC \uD655\uC778\uD574 \uC8FC\uC138\uC694.");
}
function validateLearningLinks(workspace, data) {
  for (const event of workspace.events) if (event.source) {
    validatePerformanceSource(event.source, data);
    if (event.targetId !== event.source.topicId || event.answer !== event.source.body || event.id !== sourceEventId(event.source, event.facet)) throw Error("\uACB0\uACFC\uC640 \uC6D0\uBB38 \uB2F5\uC548\uC758 \uC5F0\uACB0\uC744 \uD655\uC778\uD574 \uC8FC\uC138\uC694.");
  }
  if (workspace.codeLinks !== void 0 && !Array.isArray(workspace.codeLinks)) throw Error("\uCF54\uB4DC \uC608\uC81C\uC758 \uC8FC\uC81C \uC5F0\uACB0\uC744 \uD655\uC778\uD574 \uC8FC\uC138\uC694.");
  const ids = /* @__PURE__ */ new Set();
  for (const link of workspace.codeLinks ?? []) {
    if (!link || ids.has(link.exampleId) || !data.codeExamples?.some((e) => e.id === link.exampleId && owned(data, e)) || !data.nodes.some((n) => n.id === link.topicId && n.role === "topic" && owned(data, n))) throw Error("\uCF54\uB4DC \uC608\uC81C\uC758 \uC8FC\uC81C \uC5F0\uACB0\uC744 \uD655\uC778\uD574 \uC8FC\uC138\uC694.");
    ids.add(link.exampleId);
  }
}

// src/domain/study-board.ts
function validateBoard(value) {
  const row = value;
  const fail3 = () => {
    throw new DomainError(
      "INVALID_BOARD",
      "\uBCF4\uB4DC\uC758 \uC5F4\uACFC \uCE74\uB4DC\uB97C \uD655\uC778\uD574 \uC8FC\uC138\uC694. \uC791\uC131\uD55C \uAE00\uC740 \uC720\uC9C0\uD588\uC2B5\uB2C8\uB2E4."
    );
  };
  const id = (v) => typeof v === "string" && Boolean(v.trim()) && v.length <= 256;
  const title = (v) => typeof v === "string" && Boolean(v.trim()) && v.length <= 1e3;
  if (!row || !title(row.title) || !Array.isArray(row.columns) || row.columns.length < 1 || row.columns.length > 100 || !Array.isArray(row.cards) || row.cards.length > 1e4)
    return fail3();
  const columns = /* @__PURE__ */ new Set(), cards = /* @__PURE__ */ new Set();
  for (const col of row.columns) {
    if (!col || !id(col.id) || columns.has(col.id) || !title(col.title)) return fail3();
    columns.add(col.id);
  }
  for (const card of row.cards) {
    if (!card || !id(card.id) || cards.has(card.id) || !columns.has(card.columnId) || !title(card.title) || typeof card.body !== "string" || card.body.length > 2e5 || card.topicId !== null && !id(card.topicId) || typeof card.archived !== "boolean")
      return fail3();
    cards.add(card.id);
  }
}
function verifyBoardTopics(content, state) {
  for (const card of content.cards)
    if (card.topicId !== null && !state.nodes.some((n) => n.id === card.topicId && n.role === "topic"))
      throw new DomainError(
        "INVALID_BOARD_TOPIC",
        "\uCE74\uB4DC\uC5D0 \uC5F0\uACB0\uD55C \uC6D0\uB798 \uC8FC\uC81C\uB97C \uCC3E\uC744 \uC218 \uC5C6\uC2B5\uB2C8\uB2E4. \uAE00\uC740 \uC720\uC9C0\uD588\uC2B5\uB2C8\uB2E4."
      );
}

// src/domain/trace.ts
var TRACE_ITEMS = [
  {
    "id": "Td1",
    "group": "T",
    "label": "\uC774 \uC8FC\uC81C\uC5D0\uC11C \uB2F5\uD558\uB824\uB294 \uC9C8\uBB38\uC744 \uD55C \uBB38\uC7A5\uC73C\uB85C \uC801\uC5B4\uBCF4\uC558\uB2E4.",
    "question": "\uC774 \uC8FC\uC81C\uC5D0\uC11C \uB2F5\uD558\uB824\uB294 \uC9C8\uBB38\uC740 \uBB34\uC5C7\uC778\uAC00\uC694?",
    "mode": "required"
  },
  {
    "id": "Td2",
    "group": "T",
    "label": "\uC124\uBA85\uC758 \uD750\uB984\uC744 \uB530\uB77C\uAC00\uACE0 \uD544\uC694\uD55C \uC120\uD589 \uAC1C\uB150\uC744 \uC9DA\uC5B4\uBCF4\uC558\uB2E4.",
    "question": "\uC124\uBA85\uC740 \uC5B4\uB5BB\uAC8C \uC774\uC5B4\uC9C0\uACE0, \uC5B4\uB5A4 \uAC1C\uB150\uC774 \uBA3C\uC800 \uD544\uC694\uD55C\uAC00\uC694?",
    "mode": "required"
  },
  {
    "id": "Rd1",
    "group": "R",
    "label": "\uAE30\uC5B5\uD558\uACE0 \uC0AC\uC6A9\uD560 \uC815\uC758\xB7\uACF5\uC2DD\xB7\uD575\uC2EC \uACB0\uB860\uC744 \uC815\uB9AC\uD574\uBCF4\uC558\uB2E4.",
    "question": "\uC9C0\uAE08 \uAE30\uC5B5\uD558\uACE0 \uC0AC\uC6A9\uD560 \uD575\uC2EC\uC740 \uBB34\uC5C7\uC778\uAC00\uC694?",
    "mode": "required"
  },
  {
    "id": "Rd2",
    "group": "R",
    "label": "\uAE30\uD638\uC758 \uB73B\uACFC \uC801\uC6A9 \uC870\uAC74\uC744 \uD655\uC778\uD558\uACE0 \uC6D0\uBB38\uACFC \uB300\uC870\uD574\uBCF4\uC558\uB2E4.",
    "question": "\uAE30\uD638\uC640 \uC870\uAC74\uC744 \uC5B4\uB5BB\uAC8C \uAE30\uC5B5\uD558\uBA70, \uC6D0\uBB38\uACFC \uB9DE\uB098\uC694?",
    "mode": "required"
  },
  {
    "id": "Ad1",
    "group": "A",
    "label": "\uB300\uD45C \uBB38\uC81C\uB97C \uC9C1\uC811 \uD480\uACE0 \uBC29\uBC95\uC744 \uC120\uD0DD\uD55C \uC774\uC720\uB97C \uC124\uBA85\uD574\uBCF4\uC558\uB2E4.",
    "question": "\uC5B4\uB5A4 \uBC29\uBC95\uC744 \uC120\uD0DD\uD574 \uC2DC\uB3C4\uD588\uACE0, \uC65C \uADF8 \uBC29\uBC95\uC744 \uACE8\uB790\uB098\uC694?",
    "mode": "required"
  },
  {
    "id": "Ad2",
    "group": "A",
    "label": "\uD2C0\uB9AC\uAC70\uB098 \uB9C9\uD78C \uBD80\uBD84\uC744 \uBCF4\uC644\uD558\uACE0 \uB2E4\uC2DC \uD480\uC5B4\uBCF4\uC558\uB2E4.",
    "question": "\uB9C9\uD78C \uBD80\uBD84\uC744 \uC5B4\uB5BB\uAC8C \uBCF4\uC644\uD588\uACE0, \uB2E4\uC2DC \uD574\uBCF4\uB2C8 \uC5B4\uB514\uAE4C\uC9C0 \uB418\uB098\uC694?",
    "mode": "required"
  },
  {
    "id": "Cd1",
    "group": "C",
    "label": "\uC790\uB8CC \uC5C6\uC774 \uD575\uC2EC\uC744 \uB5A0\uC62C\uB9AC\uACE0 \uC815\uD655\uC131\uC744 \uD655\uC778\uD574\uBCF4\uC558\uB2E4.",
    "question": "\uB3C4\uC6C0 \uC5C6\uC774 \uBB34\uC5C7\uC744 \uB5A0\uC62C\uB838\uC73C\uBA70 \uC6D0\uBB38\uACFC \uC5BC\uB9C8\uB098 \uB9DE\uB098\uC694?",
    "mode": "required"
  },
  {
    "id": "Cself1",
    "group": "C",
    "label": "\uC790\uAE30\uD654 \uC7AC\uAD6C\uC131: \uACF5\uBD80\uD55C \uB0B4\uC6A9\uC744 \uB098\uB9CC\uC758 \uC5B8\uC5B4\uC640 \uBC29\uC2DD\uC73C\uB85C \uD45C\uD604\uD558\uACE0 \uC5F0\uACB0\uD574\uBCF4\uC558\uB2E4.",
    "question": "\uACF5\uBD80\uD55C \uB0B4\uC6A9\uC744 \uB098\uB9CC\uC758 \uC5B8\uC5B4\uC640 \uBC29\uC2DD\uC73C\uB85C \uC5B4\uB5BB\uAC8C \uD45C\uD604\uD558\uACE0 \uC5F0\uACB0\uD588\uB098\uC694?",
    "mode": "optional"
  },
  {
    "id": "Cd3",
    "group": "C",
    "label": "\uBCC0\uD615\xB7\uD63C\uD569\xB7\uC0C8 \uBB38\uC81C\uC5D0\uC11C \uBAA9\uD45C \uC218\uD589\uC744 \uD655\uC778\uD574\uBCF4\uC558\uB2E4.",
    "question": "\uC0C8\uB85C\uC6B4 \uBB38\uC81C\uC5D0\uC11C\uB3C4 \uBAA9\uD45C\uB85C \uD55C \uC218\uD589\uC744 \uD560 \uC218 \uC788\uB098\uC694?",
    "mode": "required"
  },
  {
    "id": "Cd4",
    "group": "C",
    "label": "\uD575\uC2EC \uC815\uC758\xB7\uACF5\uC2DD\xB7\uC870\uAC74\xB7\uACB0\uB860\uC744 \uBC31\uC9C0\uC5D0 \uC11C\uC220\uD558\uACE0 \uC6D0\uBB38\uACFC \uB300\uC870\uD574\uBCF4\uC558\uB2E4.",
    "question": "\uC774 \uC8FC\uC81C\uC5D0\uC11C \uC2E4\uC81C\uB85C \uC4F8 \uD575\uC2EC\uC744 \uC790\uB8CC \uC5C6\uC774 \uC5B4\uB5BB\uAC8C \uC11C\uC220\uD588\uB098\uC694?",
    "mode": "optional"
  },
  {
    "id": "Cd5",
    "group": "C",
    "label": "\uAC80\uC99D \uACB0\uACFC\uB97C \uC0B4\uD53C\uACE0 \uBD80\uC871\uD568\uACFC \uB2E4\uC74C \uD589\uB3D9\uC744 \uC815\uD574\uBCF4\uC558\uB2E4.",
    "question": "\uD655\uC778\uD55C \uACB0\uACFC\uC640 \uB0A8\uC740 \uBD80\uC871\uD568\uC740 \uBB34\uC5C7\uC774\uBA70, \uB2E4\uC74C\uC5D0 \uBB34\uC5C7\uC744 \uD560\uAE4C\uC694?",
    "mode": "required"
  },
  {
    "id": "Ed1",
    "group": "E",
    "label": "\uC5B4\uB5A4 \uBB38\uC81C\uB098 \uD544\uC694\uB97C \uB2E4\uB8E8\uAE30 \uC704\uD574 \uB3C4\uC785\uB418\uB294\uC9C0 \uC124\uBA85\uD574\uBCF4\uC558\uB2E4.",
    "question": "\uC774 \uAC1C\uB150\xB7\uC815\uB9AC\xB7\uACF5\uC2DD\uC740 \uC5B4\uB5A4 \uD544\uC694\uB97C \uB2E4\uB8E8\uB098\uC694?",
    "mode": "required"
  },
  {
    "id": "Ed2",
    "group": "E",
    "label": "\uB3C4\uC785 \uC0AC\uB840\uC5D0\uC11C \uC8FC\uC5B4\uC9C4 \uAC83\uACFC \uAD6C\uD558\uB824\uB294 \uAC83\uC744 \uD480\uC5B4 \uB9D0\uD574\uBCF4\uC558\uB2E4.",
    "question": "\uC608\uC2DC\uC5D0\uC11C \uBB34\uC5C7\uC774 \uC8FC\uC5B4\uC9C0\uACE0 \uBB34\uC5C7\uC744 \uAD6C\uD558\uAC70\uB098 \uC124\uBA85\uD558\uB098\uC694?",
    "mode": "required"
  },
  {
    "id": "Ed3",
    "group": "E",
    "label": "\uB73B\uC744 \uC790\uAE30 \uB9D0\uACFC \uC608\uC2DC\uB85C \uC124\uBA85\uD558\uACE0 \uC6D0\uBB38\uACFC \uB300\uC870\uD574\uBCF4\uC558\uB2E4.",
    "question": "\uC790\uAE30 \uB9D0\uACFC \uC608\uC2DC\uB85C \uC124\uBA85\uD558\uBA74 \uC5B4\uB5A4 \uB73B\uC774\uBA70, \uC6D0\uBB38\uACFC \uB9DE\uB098\uC694?",
    "mode": "required"
  },
  {
    "id": "Ed4",
    "group": "E",
    "label": "\uB2E4\uB978 \uC801\uC6A9 \uC0C1\uD669\xB7\uC870\uAC74 \uBCC0\uD654\xB7\uB354 \uC54C \uC218 \uC788\uB294 \uACB0\uB860\uC744 \uC0DD\uAC01\uD574\uBCF4\uC558\uB2E4.",
    "question": "\uBB34\uC5C7\uC744 \uB354 \uC54C \uC218 \uC788\uACE0, \uC870\uAC74\uC774\uB098 \uC0C1\uD669\uC774 \uB2EC\uB77C\uC9C0\uBA74 \uC5B4\uB5BB\uAC8C \uB418\uB098\uC694?",
    "mode": "required"
  }
];

// src/domain/criteria.ts
function defaultCriteriaItems() {
  return TRACE_ITEMS.map((item) => ({ id: item.id, group: item.group, label: item.label, version: 1, mode: item.mode }));
}
function validateTraceDefinition(value, expectedId = value?.id) {
  if (!value || typeof value !== "object" || typeof value.id !== "string" || !/^[TRACE][A-Za-z0-9_-]*$/.test(value.id) || value.id.length > 256 || value.id !== expectedId || !["T", "R", "A", "C", "E"].includes(value.group) || typeof value.label !== "string" || !value.label.trim() || !Number.isSafeInteger(value.version) || value.version < 1 || !["required", "optional", "excluded"].includes(value.mode)) {
    throw new DomainError("INVALID_TRACE_DEFINITION", "\uD65C\uB3D9\uC758 \uC6D0\uB798 \uD56D\uBAA9\uACFC \uC815\uC758\uB97C \uD655\uC778\uD574 \uC8FC\uC138\uC694.");
  }
}

// src/domain/memo.ts
var MEMO_WIDTH = 900;
var MEMO_HEIGHT = 600;
function validateMemoContent(value) {
  const row = value;
  const bad2 = () => {
    throw new DomainError("INVALID_MEMO", "\uBA54\uBAA8\uC758 \uAE00\uC774\uB098 \uADF8\uB9BC\uC744 \uC77D\uC9C0 \uBABB\uD588\uC2B5\uB2C8\uB2E4. \uC6D0\uBB38\uC744 \uBCC0\uACBD\uD558\uC9C0 \uC54A\uC558\uC2B5\uB2C8\uB2E4.");
  };
  if (!row || typeof row.body !== "string" || row.ownerId !== null && (typeof row.ownerId !== "string" || !row.ownerId.trim()) || !Array.isArray(row.strokes)) return bad2();
  const ids = /* @__PURE__ */ new Set();
  for (const stroke of row.strokes) {
    if (!stroke || typeof stroke.id !== "string" || !stroke.id.trim() || ids.has(stroke.id) || !["ink", "blue", "green"].includes(stroke.ink) || !Number.isFinite(stroke.width) || stroke.width <= 0 || stroke.width > 40 || !Array.isArray(stroke.points) || !stroke.points.length) return bad2();
    ids.add(stroke.id);
    for (const point of stroke.points) if (!point || !Number.isFinite(point.x) || !Number.isFinite(point.y) || point.x < 0 || point.x > MEMO_WIDTH || point.y < 0 || point.y > MEMO_HEIGHT || !Number.isFinite(point.pressure) || point.pressure < 0 || point.pressure > 1) return bad2();
  }
}

// src/domain/topic-memory.ts
var text = (v, max, required = true) => typeof v === "string" && v.length <= max && (!required || !!v.trim());
function invalid2() {
  throw new DomainError(
    "INVALID_TOPIC_GENERATION",
    "\uC8FC\uC81C \uAE30\uBC18 \uC0DD\uC131\uC758 \uBC94\uC704\uC640 \uC9C8\uBB38\xB7\uB2F5\uC548\uC744 \uD655\uC778\uD574 \uC8FC\uC138\uC694."
  );
}
function validateTopicMemoryInput(value) {
  const v = value;
  if (!v || !text(v.subject?.id, 256) || !text(v.subject.name, 500) || !Number.isSafeInteger(v.subject.version) || v.subject.version < 1 || !Number.isSafeInteger(v.count) || v.count < 1 || v.count > 30 || !text(v.guidance, 2e3, false) || !Array.isArray(v.topics) || !v.topics.length || v.topics.length > 20)
    invalid2();
  const ids = /* @__PURE__ */ new Set();
  for (const t of v.topics) {
    if (!text(t?.id, 256) || ids.has(t.id) || !Array.isArray(t.path) || !t.path.length || t.path.length > 20 || t.path.at(-1)?.id !== t.id)
      invalid2();
    ids.add(t.id);
    const pathIds = /* @__PURE__ */ new Set();
    for (const n of t.path) {
      if (!text(n?.id, 256) || !text(n.name, 500) || !Number.isSafeInteger(n.version) || n.version < 1 || pathIds.has(n.id))
        invalid2();
      pathIds.add(n.id);
    }
  }
  if (JSON.stringify(v).length > 32e3) invalid2();
}
function validateTopicGenerationSource(value) {
  const s = value;
  if (s?.promptVersion !== void 0 && !text(s.promptVersion, 160)) invalid2();
  if (s?.kind !== "topic" || s.reviewed !== true || !text(s.resultId, 256) || !text(s.cardId, 256) || !text(s.model, 160) || !text(s.at, 40) || !Number.isFinite(Date.parse(s.at)) || !text(s.originalQuestion, 4e3) || !text(s.originalAnswer, 1e4))
    invalid2();
  validateTopicMemoryInput(s.input);
}

// src/domain/memory-test.ts
function bad(message) {
  throw new DomainError("INVALID_MEMORY_TEST", message);
}
function validateMemoryCard(value, complete = true) {
  const c = value;
  if (!c || typeof c.topicId !== "string" || !c.topicId.trim() || typeof c.question !== "string" || typeof c.answer !== "string")
    bad("\uC554\uAE30 \uD56D\uBAA9\uC758 \uC9C8\uBB38\uACFC \uB2F5\uC548\uC744 \uD655\uC778\uD574 \uC8FC\uC138\uC694.");
  validateMemoContent({ ownerId: c.topicId, body: c.answer, strokes: c.strokes });
  if (c.topicGeneration !== void 0) {
    validateTopicGenerationSource(c.topicGeneration);
    if (c.materialSource || !c.topicGeneration.input.topics.some((t) => t.id === c.topicId))
      bad("\uC8FC\uC81C \uAE30\uBC18 \uC0DD\uC131\uACFC \uC6D0\uC790\uB8CC \uAE30\uBC18 \uCD9C\uCC98\uB97C \uAD6C\uBCC4\uD574 \uC8FC\uC138\uC694.");
  }
  if (complete && (!c.question.trim() || !c.answer.trim() && !c.strokes.length))
    bad("\uC9C8\uBB38\uACFC \uAE30\uC900 \uB2F5\uC548\uC744 \uB123\uC5B4 \uC8FC\uC138\uC694. \uB2F5\uC548\uC740 \uADF8\uB9BC\uB9CC \uC788\uC5B4\uB3C4 \uB429\uB2C8\uB2E4.");
}
function validateMemoryQuestions(value) {
  if (!Array.isArray(value) || !value.length || value.length > 50)
    bad("\uC2DC\uD5D8\uC5D0 \uB123\uC744 \uD56D\uBAA9\uC740 1\uAC1C\uBD80\uD130 50\uAC1C\uAE4C\uC9C0 \uC120\uD0DD\uD574 \uC8FC\uC138\uC694.");
  const ids = /* @__PURE__ */ new Set();
  for (const q of value) {
    validateMemoryCard(q);
    if (typeof q.cardId !== "string" || !q.cardId.trim() || ids.has(q.cardId) || !Number.isSafeInteger(q.cardVersion) || q.cardVersion < 1 || typeof q.topicName !== "string" || ![null, "correct", "partial", "wrong", "uncertain"].includes(q.verdict))
      bad("\uBB38\uD56D\uC758 \uC6D0\uB798 \uD56D\uBAA9\uACFC \uBE44\uAD50 \uACB0\uACFC\uB97C \uD655\uC778\uD574 \uC8FC\uC138\uC694.");
    ids.add(q.cardId);
    validateMemoContent({ ownerId: q.topicId, body: q.response, strokes: q.responseStrokes });
    if (!q.response.trim() && !q.responseStrokes.length && ["correct", "partial", "wrong"].includes(q.verdict ?? ""))
      bad("\uB2F5\uD558\uC9C0 \uC54A\uC740 \uBB38\uD56D\uC740 \uBBF8\uD310\uC815\uC73C\uB85C \uB0A8\uACA8 \uC8FC\uC138\uC694.");
  }
}
function validateMemoryTest(value) {
  const t = value;
  if (!t || ![t.startedAt, t.endedAt].every(
    (x) => typeof x === "string" && Number.isFinite(Date.parse(x))
  ) || Date.parse(t.startedAt) > Date.parse(t.endedAt))
    bad("\uC2DC\uD5D8\uC758 \uC2DC\uC791\uACFC \uC885\uB8CC \uC2DC\uAC01\uC744 \uD655\uC778\uD574 \uC8FC\uC138\uC694.");
  validateMemoryQuestions(t.questions);
}

// src/domain/canvas.ts
function validateCanvasLayout(value) {
  const validKey = (id) => typeof id === "string" && /^(subject|node|memo|narrative):.+/.test(id) && id.length <= 300 && !/[\u0000-\u001f]/.test(id);
  const position = (p) => p && Number.isFinite(p.x) && Number.isFinite(p.y) && Math.abs(p.x) <= 1e7 && Math.abs(p.y) <= 1e7;
  if (!value.positions || typeof value.positions !== "object" || Array.isArray(value.positions) || !Object.entries(value.positions).every(([id, p]) => validKey(id) && position(p)) || !Array.isArray(value.links)) throw new DomainError("INVALID_CANVAS", "Canvas \uBC30\uCE58\uC640 \uC5F0\uACB0\uC744 \uD655\uC778\uD574 \uC8FC\uC138\uC694. \uC6D0\uBB38\uC740 \uC720\uC9C0\uD588\uC2B5\uB2C8\uB2E4.");
  const ids = /* @__PURE__ */ new Set();
  for (const link of value.links) {
    if (!link || typeof link.id !== "string" || !link.id.trim() || link.id.length > 256 || ids.has(link.id) || link.id.startsWith("auto:") || !validKey(link.source) || !validKey(link.target) || typeof link.label !== "string" || link.label.length > 300) throw new DomainError("INVALID_CANVAS", "Canvas \uC5F0\uACB0\uC758 \uC2DD\uBCC4\uC790\uC640 \uC6D0\uBB38\uC744 \uD655\uC778\uD574 \uC8FC\uC138\uC694.");
    ids.add(link.id);
  }
  if (value.viewport && (!position(value.viewport) || !Number.isFinite(value.viewport.zoom) || value.viewport.zoom < 0.1 || value.viewport.zoom > 2)) throw new DomainError("INVALID_CANVAS", "Canvas \uD655\uB300 \uC704\uCE58\uB97C \uD655\uC778\uD574 \uC8FC\uC138\uC694.");
}

// src/domain/study-ai-request.ts
var STUDY_AI_TASKS = {
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
var isStudyAITask = (value) => typeof value === "string" && Object.hasOwn(STUDY_AI_TASKS, value);
function validateStudyAIRequest(value, complete = true) {
  const row = value;
  if (!row || !isStudyAITask(row.task))
    throw new DomainError("INVALID_AI_REQUEST", "GPT \uC791\uC5C5\uC744 \uACE8\uB77C \uC8FC\uC138\uC694.");
  for (const key2 of ["problem", "attempt", "reference", "focus"])
    if (row[key2] !== void 0 && (typeof row[key2] !== "string" || row[key2].length > 3e4))
      throw new DomainError("INVALID_AI_REQUEST", "\uCD94\uAC00 \uB0B4\uC6A9\uC744 3\uB9CC \uC790 \uC774\uB0B4\uB85C \uB098\uB204\uC5B4 \uC8FC\uC138\uC694.");
  if (!complete) return;
  if (row.task === "tutor" && !row.focus?.trim())
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
  const bad2 = () => {
    throw new DomainError("INVALID_MATERIAL", "\uAC00\uC838\uC628 \uC790\uB8CC\uC758 \uC6D0\uBB38\xB7\uCD9C\uCC98\uB97C \uD655\uC778\uD574 \uC8FC\uC138\uC694.");
  };
  if (!Array.isArray(value) || value.length > 20) bad2();
  let size = 0;
  const ids = /* @__PURE__ */ new Set();
  for (const doc of value) {
    if (!doc || typeof doc.id !== "string" || !doc.id || doc.id.length > 100 || ids.has(doc.id) || typeof doc.name !== "string" || !doc.name || doc.name.length > 512 || !["pdf", "docx", "pptx", "image", "text", "subtitle", "youtube"].includes(doc.kind) || !Array.isArray(doc.blocks) || doc.blocks.length > 6e3 || !Array.isArray(doc.warnings) || doc.warnings.length > 500 || doc.warnings.some((w) => typeof w !== "string" || w.length > 1e3)) bad2();
    ids.add(doc.id);
    if (doc.url !== void 0 && (typeof doc.url !== "string" || !/^https:\/\/(www\.)?youtube\.com\/watch\?v=[A-Za-z0-9_-]{11}$/.test(doc.url))) bad2();
    if (doc.file !== null && (!doc.file || typeof doc.file.key !== "string" || !doc.file.key || doc.file.key.length > 512 || typeof doc.file.name !== "string" || doc.file.name.length > 512 || typeof doc.file.type !== "string" || doc.file.type.length > 150 || !Number.isSafeInteger(doc.file.size) || doc.file.size <= 0 || doc.file.size > MAX_DOCUMENT_BYTES || !/^[a-f0-9]{64}$/.test(doc.file.sha256))) bad2();
    if (doc.file?.cloudPath !== void 0 && (typeof doc.file.cloudPath !== "string" || !doc.file.cloudPath.endsWith(`/document/${doc.file.sha256}`) || !/^[a-zA-Z0-9-]+\/(personal|test)\/document\/[a-f0-9]{64}$/.test(doc.file.cloudPath))) bad2();
    const blocks = /* @__PURE__ */ new Set();
    for (const block of doc.blocks) {
      if (!block || typeof block.id !== "string" || !block.id || block.id.length > 100 || blocks.has(block.id) || typeof block.label !== "string" || block.label.length > 300 || typeof block.text !== "string" || block.text.length > 1e5 || block.originalText !== void 0 && (typeof block.originalText !== "string" || block.originalText.length > 1e5) || typeof block.included !== "boolean" || !(block.start === null && block.end === null || typeof block.start === "number" && Number.isFinite(block.start) && block.start >= 0 && typeof block.end === "number" && Number.isFinite(block.end) && block.end >= block.start)) bad2();
      blocks.add(block.id);
      size += block.text.length;
    }
  }
  if (size > MAX_DOCUMENT_TEXT) throw new DomainError("SOURCE_SIZE", "\uAC00\uC838\uC628 \uC6D0\uBB38\uC774 100\uB9CC \uC790\uB97C \uB118\uC2B5\uB2C8\uB2E4. \uC790\uB8CC\uB97C \uB098\uB204\uC5B4 \uBCF4\uAD00\uD574 \uC8FC\uC138\uC694.");
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
    if (typeof e.id !== "string" || !e.id || edges.has(e.id) || !ids.has(e.from) || !ids.has(e.to) || e.from === e.to || typeof e.label !== "string" || !e.label.trim() || e.label.length > 1e3 || !refs(e.sourceIds)) fail();
    edges.add(e.id);
  }
  for (const [id, p] of Object.entries(map.positions ?? {})) if (!ids.has(id) || !p || !Number.isFinite(p.x) || !Number.isFinite(p.y) || Math.abs(p.x) > 1e6 || Math.abs(p.y) > 1e6) fail();
}
function validateQuizAttempts(attempts) {
  if (!Array.isArray(attempts) || attempts.length > 100) fail();
  const ids = /* @__PURE__ */ new Set();
  for (const a of attempts) {
    if (!a || typeof a.id !== "string" || !a.id || ids.has(a.id) || typeof a.resultId !== "string" || !Number.isFinite(Date.parse(a.at)) || !(a.submittedAt === null || Number.isFinite(Date.parse(a.submittedAt)))) fail();
    ids.add(a.id);
    validateQuiz(a.questions);
    for (const [id, answer] of Object.entries(a.answers)) {
      const q = a.questions.find((q2) => q2.id === id);
      if (!q || !Number.isInteger(answer) || answer < 0 || answer >= q.options.length) fail();
    }
  }
}

// src/domain/study-material.ts
var MAX_AUDIO_BYTES = 50 * 1024 * 1024;
var MAX_SOURCE_TEXT = 15e4;
var invalid3 = (message) => {
  throw new DomainError("INVALID_MATERIAL", message);
};
var text2 = (value, max) => typeof value === "string" && value.length <= max;
function validateMaterialResult(value) {
  const result = value;
  if (result?.promptVersion !== void 0 && (!text2(result.promptVersion, 160) || !result.promptVersion.trim()))
    invalid3("\uC0DD\uC131 \uB2F9\uC2DC GPT \uC9C0\uCE68 \uBC84\uC804\uC744 \uD655\uC778\uD574 \uC8FC\uC138\uC694.");
  if (result?.request !== void 0) validateStudyAIRequest(result.request);
  if (result?.source?.documents !== void 0) validateDocuments(result.source.documents);
  if (!result || !text2(result.id, 256) || !result.id || !text2(result.model, 160) || !Number.isFinite(Date.parse(result.at)) || !Array.isArray(result.segments) || !result.segments.length || result.segments.length > 6e3 || !Array.isArray(result.summary) || result.summary.length > 100 || !Array.isArray(result.cards) || result.cards.length > 100)
    invalid3("AI \uACB0\uACFC\uC758 \uD615\uC2DD\uC744 \uD655\uC778\uD558\uC9C0 \uBABB\uD588\uC2B5\uB2C8\uB2E4. \uC6D0\uBCF8\uC740 \uBCF4\uC874\uD588\uC2B5\uB2C8\uB2E4.");
  const ids = /* @__PURE__ */ new Set();
  for (const segment of result.segments) {
    if (!text2(segment.id, 256) || !segment.id || ids.has(segment.id) || !text2(segment.text, MAX_SOURCE_TEXT) || !segment.text.trim())
      invalid3("\uBC1B\uC544\uC4F4 \uBB38\uC7A5\uACFC \uC2DD\uBCC4\uC790\uB97C \uD655\uC778\uD574 \uC8FC\uC138\uC694.");
    if (segment.label !== void 0 && !text2(segment.label, 1e3))
      invalid3("\uC6D0\uBB38 \uC704\uCE58\uB97C \uD655\uC778\uD574 \uC8FC\uC138\uC694.");
    if (!(segment.start === null && segment.end === null) && !(typeof segment.start === "number" && Number.isFinite(segment.start) && segment.start >= 0 && typeof segment.end === "number" && Number.isFinite(segment.end) && segment.end >= segment.start))
      invalid3("\uC74C\uC131 \uAD6C\uAC04\uC758 \uC2DC\uAC04\uC744 \uD655\uC778\uD574 \uC8FC\uC138\uC694.");
    ids.add(segment.id);
  }
  if (result.segments.reduce((sum, row) => sum + row.text.length, 0) > MAX_SOURCE_TEXT)
    invalid3("\uBC1B\uC544\uC4F4 \uB0B4\uC6A9\uC774 \uD55C \uBC88\uC5D0 \uCC98\uB9AC\uD560 \uC218 \uC788\uB294 \uBC94\uC704\uB97C \uB118\uC5C8\uC2B5\uB2C8\uB2E4.");
  const references = (sources) => Array.isArray(sources) && sources.length > 0 && sources.length <= 50 && sources.every((id) => typeof id === "string" && ids.has(id));
  for (const row of result.summary)
    if (!text2(row.text, 1e4) || !row.text.trim() || !references(row.sourceIds) || row.originalText !== void 0 && !text2(row.originalText, 1e4))
      invalid3("\uC694\uC57D\uC758 \uC6D0\uBB38 \uADFC\uAC70\uB97C \uD655\uC778\uD558\uC9C0 \uBABB\uD588\uC2B5\uB2C8\uB2E4.");
  const cards = /* @__PURE__ */ new Set();
  for (const card of result.cards) {
    if (!text2(card.id, 256) || !card.id || cards.has(card.id) || !text2(card.question, 4e3) || !card.question.trim() || !text2(card.answer, 1e4) || !card.answer.trim() || !references(card.sourceIds) || typeof card.excluded !== "boolean")
      invalid3("\uCE74\uB4DC\uC758 \uC9C8\uBB38\xB7\uB2F5\xB7\uC6D0\uBB38 \uADFC\uAC70\uB97C \uD655\uC778\uD574 \uC8FC\uC138\uC694.");
    cards.add(card.id);
  }
  if (result.quiz !== void 0) validateQuiz(result.quiz, ids);
  if (result.map !== void 0) validateMap(result.map, ids);
  if (result.originalMap !== void 0) validateMap(result.originalMap, ids);
}
function validateMaterialContent(value) {
  const row = value;
  if (row?.originalStorage !== void 0 && !["device", "private-server"].includes(row.originalStorage)) invalid3("\uC6D0\uBCF8 \uBCF4\uAD00 \uC704\uCE58\uB97C \uD655\uC778\uD574 \uC8FC\uC138\uC694.");
  if (row?.aiRequest !== void 0) validateStudyAIRequest(row.aiRequest, false);
  if (row?.documents !== void 0) validateDocuments(row.documents);
  if (row?.quizAttempts !== void 0) validateQuizAttempts(row.quizAttempts);
  if (row?.tutorDraft !== void 0 && !text2(row.tutorDraft, 1e4))
    invalid3("\uC9C8\uBB38\uC744 1\uB9CC \uC790 \uC774\uB0B4\uB85C \uB123\uC5B4 \uC8FC\uC138\uC694.");
  if (!row || !text2(row.title, 300) || !row.title.trim() || !text2(row.subjectId, 256) || !row.subjectId || !(row.topicId === null || text2(row.topicId, 256)) || !text2(row.sourceText, MAX_SOURCE_TEXT) || !Array.isArray(row.results) || row.results.length > 30)
    invalid3("\uC790\uB8CC \uC81C\uBAA9\xB7\uACFC\uBAA9\xB7\uBCF8\uBB38\uC744 \uD655\uC778\uD574 \uC8FC\uC138\uC694.");
  if (row.audio !== null && (!row.audio || !text2(row.audio.key, 512) || !row.audio.key || !text2(row.audio.name, 512) || !text2(row.audio.type, 100) || !Number.isSafeInteger(row.audio.size) || row.audio.size <= 0 || row.audio.size > MAX_AUDIO_BYTES || !/^[a-f0-9]{64}$/.test(row.audio.sha256)))
    invalid3("\uC6D0\uBCF8 \uC74C\uC131 \uD30C\uC77C \uC815\uBCF4\uB97C \uD655\uC778\uD574 \uC8FC\uC138\uC694.");
  if (row.audio?.cloudPath !== void 0 && (typeof row.audio.cloudPath !== "string" || !row.audio.cloudPath.endsWith(`/audio/${row.audio.sha256}`) || !/^[a-zA-Z0-9-]+\/(personal|test)\/audio\/[a-f0-9]{64}$/.test(row.audio.cloudPath))) invalid3("\uC6D0\uBCF8 \uC74C\uC131\uC758 \uC11C\uBC84 \uC704\uCE58\uB97C \uD655\uC778\uD574 \uC8FC\uC138\uC694.");
  if (!row.audio && !row.sourceText.trim() && !row.documents?.length)
    invalid3("\uB179\uC74C \uD30C\uC77C\uC774\uB098 \uAC15\uC758 \uB0B4\uC6A9\uC744 \uB123\uC5B4 \uC8FC\uC138\uC694.");
  const ids = /* @__PURE__ */ new Set();
  for (const result of row.results) {
    validateMaterialResult(result);
    if (ids.has(result.id)) invalid3("\uC0DD\uC131 \uACB0\uACFC\uC758 \uC2DD\uBCC4\uC790\uAC00 \uC911\uBCF5\uB418\uC5C8\uC2B5\uB2C8\uB2E4.");
    ids.add(result.id);
  }
}

// src/domain/code-example.ts
var CODE_LANGUAGES = {
  c: "C",
  cpp: "C++",
  csharp: "C#",
  python: "Python",
  javascript: "JavaScript"
};
var MAX_CODE_TEXT = 2e5;
var MAX_CODE_OUTPUT = 1e5;
function validateCodeContent(value) {
  const fail3 = () => {
    throw new DomainError(
      "INVALID_CODE_EXAMPLE",
      "\uCF54\uB4DC \uC608\uC81C\uC758 \uC81C\uBAA9\xB7\uCF54\uB4DC\xB7\uC124\uBA85\xB7\uC2E4\uD589 \uACB0\uACFC\uB97C \uD655\uC778\uD574 \uC8FC\uC138\uC694."
    );
  };
  if (!value || typeof value !== "object" || Array.isArray(value)) return fail3();
  const content = value;
  if (content.inputMode !== void 0 && !["batch", "terminal"].includes(content.inputMode))
    return fail3();
  if (!Object.hasOwn(CODE_LANGUAGES, content.language)) return fail3();
  for (const name of ["title", "code", "stdin", "notes"]) {
    if (typeof content[name] !== "string" || content[name].length > MAX_CODE_TEXT) return fail3();
  }
  if (content.lastRun !== void 0) {
    const run = content.lastRun;
    if (!run || run.mode !== void 0 && run.mode !== "terminal" || !Object.hasOwn(CODE_LANGUAGES, run.language) || !["success", "error", "stopped"].includes(run.outcome) || typeof run.at !== "string" || !Number.isFinite(Date.parse(run.at)))
      return fail3();
    for (const name of ["code", "stdin", "output", "error"]) {
      if (typeof run[name] !== "string" || run[name].length > (name === "output" || name === "error" ? MAX_CODE_OUTPUT : MAX_CODE_TEXT))
        return fail3();
    }
  }
}

// src/domain/commands.ts
function verifyLearningPlan(workspace, state) {
  try {
    validateRecommendations(workspace, state);
  } catch (error) {
    throw new DomainError("INVALID_LEARNING_PLAN", error instanceof Error ? error.message : "\uD559\uC2B5 \uC77C\uC815\uC758 \uB0B4\uC6A9\uC744 \uD655\uC778\uD574 \uC8FC\uC138\uC694.");
  }
}
var collections = ["studyBoards", "semesters", "subjects", "nodes", "sessions", "records", "narratives", "criteria", "criteriaAssignments", "memos", "learningPlans", "canvasLayouts", "codeExamples", "recallCards", "recallPreferences", "studyMaterials", "memoryCards", "memoryTests"];
function fail2(code, message, details) {
  throw new DomainError(code, message, details);
}
function canonical2(value) {
  if (Array.isArray(value)) return "[" + value.map(canonical2).join(",") + "]";
  if (value && typeof value === "object") return "{" + Object.entries(value).filter(([, v]) => v !== void 0).sort(([a], [b]) => a.localeCompare(b)).map(([k, v]) => JSON.stringify(k) + ":" + canonical2(v)).join(",") + "}";
  return JSON.stringify(value);
}
function identity(id) {
  if (typeof id !== "string" || !id.trim() || id.length > 256) fail2("INVALID_ID", "\uD56D\uBAA9\uC758 \uC2DD\uBCC4\uC790\uB97C \uD655\uC778\uD574 \uC8FC\uC138\uC694.");
}
function validDay(day2) {
  return typeof day2 === "string" && /^\d{4}-\d{2}-\d{2}$/.test(day2) && Number.isFinite(Date.parse(day2)) && new Date(day2).toISOString().slice(0, 10) === day2;
}
function validateDateEvidence(value) {
  if (!value || !["exact", "range", "unknown"].includes(value.kind)) fail2("INVALID_DATE", "\uACF5\uBD80\uD55C \uB0A0\uC9DC\uC758 \uAE30\uC5B5 \uC815\uB3C4\uB97C \uD655\uC778\uD574 \uC8FC\uC138\uC694.");
  if (value.kind === "exact" && !validDay(value.date)) fail2("INVALID_DATE", "\uC2E4\uC81C \uACF5\uBD80\uD55C \uB0A0\uC9DC\uB97C \uD655\uC778\uD574 \uC8FC\uC138\uC694.");
  if (value.kind === "range" && (!validDay(value.from) || !validDay(value.to) || value.from > value.to)) fail2("INVALID_DATE", "\uAE30\uC5B5\uB098\uB294 \uB0A0\uC9DC \uBC94\uC704\uB97C \uD655\uC778\uD574 \uC8FC\uC138\uC694.");
}
function find(values, id, active = true) {
  const row = values.find((v) => v.id === id);
  if (!row || active && row.deletedAt) return fail2("NOT_FOUND", "\uB300\uC0C1\uC744 \uCC3E\uC744 \uC218 \uC5C6\uC2B5\uB2C8\uB2E4. \uD734\uC9C0\uD1B5\uC744 \uD655\uC778\uD574 \uC8FC\uC138\uC694.", { id });
  return row;
}
function targetSubject(state, targetId, active = true) {
  const direct = state.subjects.find((s) => s.id === targetId);
  if (direct) {
    find(state.subjects, direct.id, active);
    return direct.id;
  }
  const node = find(state.nodes, targetId, active);
  find(state.subjects, node.subjectId, active);
  if (active) {
    let parentId = node.parentId;
    while (parentId) {
      const parent = find(state.nodes, parentId);
      parentId = parent.parentId;
    }
  }
  return node.subjectId;
}
function verifyTrace(trace) {
  if (!trace || typeof trace !== "object" || Array.isArray(trace)) fail2("INVALID_TRACE", "\uD65C\uB3D9 \uC785\uB825\uC744 \uD655\uC778\uD574 \uC8FC\uC138\uC694.");
  for (const [id, item] of Object.entries(trace)) {
    identity(id);
    if (!/^[TRACE][A-Za-z0-9_-]*$/.test(id)) fail2("INVALID_TRACE_ID", "\uD65C\uB3D9\uC758 \uC6D0\uB798 \uC2DD\uBCC4\uC790\uB97C \uD655\uC778\uD574 \uC8FC\uC138\uC694.");
    if (!item || !["checked", "unchecked", "na", "deferred"].includes(item.status) || item.note !== void 0 && typeof item.note !== "string") fail2("INVALID_TRACE", "\uD65C\uB3D9 \uC0C1\uD0DC\uC640 \uBA54\uBAA8\uB97C \uD655\uC778\uD574 \uC8FC\uC138\uC694.");
    if (item.definition !== void 0) validateTraceDefinition(item.definition, id);
    if (item.examReview && (typeof item.examReview.answer !== "string" || typeof item.examReview.checked !== "boolean" || item.examReview.checked && (!item.examReview.answer.trim() || item.status !== "checked"))) fail2("INVALID_WRITTEN_REVIEW", "\uC810\uAC80\uD558\uB824\uBA74 \uC790\uAE30 \uBB38\uC7A5\uC73C\uB85C \uC11C\uC220\uC744 \uB0A8\uACA8 \uC8FC\uC138\uC694.");
    if (item.repeats) {
      const ids = /* @__PURE__ */ new Set();
      for (const repeat of item.repeats) {
        identity(repeat.id);
        if (ids.has(repeat.id)) fail2("DUPLICATE_REPEAT", "\uAC19\uC740 \uBC18\uBCF5 \uAE30\uB85D\uC774 \uC911\uBCF5\uB418\uC5B4 \uC788\uC2B5\uB2C8\uB2E4.");
        ids.add(repeat.id);
        if (!["exact", "minimum", "unknown"].includes(repeat.kind) || (repeat.kind === "unknown" ? repeat.count !== null : !Number.isSafeInteger(repeat.count) || Number(repeat.count) < 1)) fail2("INVALID_REPEAT", "\uBC18\uBCF5 \uD69F\uC218\uC758 \uAE30\uC5B5 \uC815\uB3C4\uB97C \uD655\uC778\uD574 \uC8FC\uC138\uC694.");
        if (repeat.dateEvidence) validateDateEvidence(repeat.dateEvidence);
      }
    }
  }
}
function assertState(state) {
  if (state.schemaVersion !== 1 || !["demo", "personal", "test"].includes(state.namespace)) fail2("INVALID_STATE", "\uC790\uB8CC \uD615\uC2DD\uC744 \uD655\uC778\uD574 \uC8FC\uC138\uC694.");
  identity(state.userId);
  const globallyUnique = /* @__PURE__ */ new Set();
  for (const name of collections) {
    if (state[name] !== void 0 && !Array.isArray(state[name])) fail2("INVALID_STATE", "\uC790\uB8CC \uBAA9\uB85D\uC758 \uD615\uC2DD\uC744 \uD655\uC778\uD574 \uC8FC\uC138\uC694.");
    for (const row of state[name] ?? []) {
      identity(row.id);
      if (globallyUnique.has(row.id)) fail2("DUPLICATE_ID", "\uAC19\uC740 \uC2DD\uBCC4\uC790\uAC00 \uC911\uBCF5\uB418\uC5B4 \uC788\uC2B5\uB2C8\uB2E4.", { id: row.id });
      globallyUnique.add(row.id);
      if (row.userId !== state.userId || row.namespace !== state.namespace) fail2("OWNERSHIP", "\uB2E4\uB978 \uC0AC\uC6A9\uC790\uB098 \uC2DC\uD5D8 \uACF5\uAC04\uC758 \uC790\uB8CC\uB97C \uD568\uAED8 \uCC98\uB9AC\uD560 \uC218 \uC5C6\uC2B5\uB2C8\uB2E4.");
      if (!Number.isInteger(row.version) || row.version < 1) fail2("INVALID_VERSION", "\uC218\uC815 \uC21C\uC11C\uB97C \uD655\uC778\uD574 \uC8FC\uC138\uC694.");
    }
  }
  const index = new Map(collections.flatMap((name) => (state[name] ?? []).map((row) => [row.id, row])));
  const subjectIds = new Set(state.subjects.map((row) => row.id));
  const sessionIds = new Set(state.sessions.map((row) => row.id));
  const semesterIds = new Set(state.semesters.map((row) => row.id));
  const nodeIndex = new Map(state.nodes.map((row) => [row.id, row]));
  for (const subject2 of state.subjects) {
    if (subject2.scope.kind === "semester") {
      if (!semesterIds.has(subject2.scope.semesterId)) fail2("NOT_FOUND", "\uACFC\uBAA9\uC774 \uC5F0\uACB0\uB41C \uD559\uAE30\uB97C \uCC3E\uC744 \uC218 \uC5C6\uC2B5\uB2C8\uB2E4.");
    } else if (!["independent", "unassigned"].includes(subject2.scope.kind)) fail2("INVALID_SCOPE", "\uACFC\uBAA9 \uC18C\uC18D\uC744 \uD655\uC778\uD574 \uC8FC\uC138\uC694.");
  }
  for (const node of state.nodes) {
    if (!subjectIds.has(node.subjectId)) fail2("NOT_FOUND", "\uBAA9\uCC28\uC758 \uACFC\uBAA9\uC744 \uCC3E\uC744 \uC218 \uC5C6\uC2B5\uB2C8\uB2E4.");
    const seen = /* @__PURE__ */ new Set([node.id]);
    let parentId = node.parentId;
    while (parentId !== null) {
      if (seen.has(parentId)) fail2("CYCLE", "\uD558\uC704 \uD56D\uBAA9 \uC548\uC73C\uB85C \uC774\uB3D9\uD560 \uC218 \uC5C6\uC2B5\uB2C8\uB2E4.");
      seen.add(parentId);
      const parent = nodeIndex.get(parentId);
      if (!parent) fail2("NOT_FOUND", "\uBD80\uBAA8 \uBAA9\uCC28\uB97C \uCC3E\uC744 \uC218 \uC5C6\uC2B5\uB2C8\uB2E4.");
      if (parent.subjectId !== node.subjectId) fail2("SUBJECT_MISMATCH", "\uB2E4\uB978 \uACFC\uBAA9\uC758 \uD56D\uBAA9 \uC544\uB798\uB85C \uC774\uB3D9\uD560 \uC218 \uC5C6\uC2B5\uB2C8\uB2E4.");
      parentId = parent.parentId;
    }
  }
  const pairs = /* @__PURE__ */ new Set();
  for (const row of state.records) {
    if (!sessionIds.has(row.sessionId)) fail2("NOT_FOUND", "\uC6D0\uB798 \uACF5\uBD80 \uC138\uC158\uC744 \uCC3E\uC744 \uC218 \uC5C6\uC2B5\uB2C8\uB2E4.");
    const subjectId = subjectIds.has(row.targetId) ? row.targetId : nodeIndex.get(row.targetId)?.subjectId;
    if (subjectId !== row.subjectId) fail2("SUBJECT_MISMATCH", "\uAE30\uB85D\uACFC \uC8FC\uC81C\uC758 \uACFC\uBAA9\uC774 \uB2E4\uB985\uB2C8\uB2E4.");
    const key2 = canonical2([row.sessionId, row.targetId]);
    if (pairs.has(key2)) fail2("DUPLICATE_RECORD", "\uD55C \uACF5\uBD80\uC758 \uAC19\uC740 \uB300\uC0C1 \uAE30\uB85D\uC774 \uC911\uBCF5\uB418\uC5B4 \uC788\uC2B5\uB2C8\uB2E4.");
    pairs.add(key2);
    validateDateEvidence(row.dateEvidence);
    verifyTrace(row.trace);
    if (typeof row.body !== "string" || typeof row.done !== "boolean") fail2("INVALID_RECORD", "\uACF5\uBD80 \uAE30\uB85D\uC758 \uC785\uB825\uC744 \uD655\uC778\uD574 \uC8FC\uC138\uC694.");
  }
  for (const row of state.sessions) validateDateEvidence(row.dateEvidence);
  if ((state.learningPlans ?? []).filter((row) => !row.deletedAt).length > 1) fail2("DUPLICATE_PLAN", "\uD559\uC2B5 \uC77C\uC815\uC758 \uC6D0\uB798 \uC5F0\uACB0\uC744 \uD655\uC778\uD574 \uC8FC\uC138\uC694.");
  for (const row of state.learningPlans ?? []) verifyLearningPlan(row.workspace, state);
  for (const row of state.studyBoards ?? []) {
    validateBoard(row);
    verifyBoardTopics(row, state);
  }
  for (const row of state.canvasLayouts ?? []) validateCanvasLayout(row);
  for (const row of state.codeExamples ?? []) validateCodeContent(row);
  for (const row of state.studyMaterials ?? []) {
    validateMaterialContent(row);
    if (!subjectIds.has(row.subjectId) || row.topicId !== null && nodeIndex.get(row.topicId)?.subjectId !== row.subjectId) fail2("SUBJECT_MISMATCH", "\uC790\uB8CC\uC758 \uACFC\uBAA9\uACFC \uC8FC\uC81C\uB97C \uD655\uC778\uD574 \uC8FC\uC138\uC694.");
  }
  for (const card of state.memoryCards ?? []) {
    validateMemoryCard(card);
    validateMaterialCardSource(card, state);
    if (nodeIndex.get(card.topicId)?.role !== "topic") fail2("INVALID_MEMORY_TEST", "\uC554\uAE30 \uD56D\uBAA9\uC758 \uC6D0\uB798 \uC8FC\uC81C\uB97C \uCC3E\uC744 \uC218 \uC5C6\uC2B5\uB2C8\uB2E4.");
  }
  for (const test of state.memoryTests ?? []) {
    validateMemoryTest(test);
    for (const q of test.questions) if (!(state.memoryCards ?? []).some((c) => c.id === q.cardId && c.topicId === q.topicId)) fail2("INVALID_MEMORY_TEST", "\uC2DC\uD5D8 \uBB38\uD56D\uC758 \uC6D0\uB798 \uD56D\uBAA9\uC744 \uCC3E\uC744 \uC218 \uC5C6\uC2B5\uB2C8\uB2E4.");
  }
  const recallTopics = /* @__PURE__ */ new Set();
  for (const row of state.recallCards ?? []) {
    validateRecallCard(row, state);
    if (!row.deletedAt && row.front === void 0) {
      if (recallTopics.has(row.topicId)) fail2("DUPLICATE_RECALL", "\uC8FC\uC81C\uC758 \uBCF5\uC2B5 \uCE74\uB4DC\uAC00 \uC911\uBCF5\uB418\uC5B4 \uC788\uC2B5\uB2C8\uB2E4.");
      recallTopics.add(row.topicId);
    }
  }
  if ((state.recallPreferences ?? []).filter((row) => !row.deletedAt && row.deckName === void 0).length > 1) fail2("DUPLICATE_RECALL", "\uBCF5\uC2B5 \uC124\uC815\uC774 \uC911\uBCF5\uB418\uC5B4 \uC788\uC2B5\uB2C8\uB2E4.");
  for (const row of state.recallPreferences ?? []) {
    validateRecallOptions(row.options);
    if (row.deckName !== void 0 && (typeof row.deckName !== "string" || !row.deckName.trim() || row.deckName.length > 200)) fail2("INVALID_RECALL", "\uB371 \uC774\uB984\uC744 \uD655\uC778\uD574 \uC8FC\uC138\uC694.");
  }
  const sourceKeys = /* @__PURE__ */ new Set();
  for (const row of state.recallCards ?? []) if (row.importSource) {
    if (sourceKeys.has(row.importSource.key)) fail2("DUPLICATE_RECALL", "Anki \uC6D0\uBCF8 \uCE74\uB4DC\uAC00 \uC911\uBCF5\uB418\uC5B4 \uC788\uC2B5\uB2C8\uB2E4.");
    sourceKeys.add(row.importSource.key);
  }
  for (const row of state.memos ?? []) {
    validateMemoContent(row);
    if (row.recallCardId !== void 0 && !(state.recallCards ?? []).some((card) => card.id === row.recallCardId && card.topicId === row.ownerId)) fail2("INVALID_MEMO", "\uB2F5\uBCC0 \uBA54\uBAA8\uC758 \uC6D0\uB798 \uCE74\uB4DC \uC5F0\uACB0\uC744 \uD655\uC778\uD574 \uC8FC\uC138\uC694.");
    if (row.ownerId !== null && !subjectIds.has(row.ownerId) && !nodeIndex.has(row.ownerId)) fail2("NOT_FOUND", "\uBA54\uBAA8\uC758 \uC6D0\uB798 \uC5F0\uACB0 \uB300\uC0C1\uC744 \uCC3E\uC744 \uC218 \uC5C6\uC2B5\uB2C8\uB2E4.");
  }
  for (const row of state.narratives) {
    if (row.ownerId !== null && !index.has(row.ownerId)) fail2("NOT_FOUND", "\uBCF8\uBB38\uC758 \uC6D0\uB798 \uB300\uC0C1\uC744 \uCC3E\uC744 \uC218 \uC5C6\uC2B5\uB2C8\uB2E4.");
    verifyNarrative(state, row);
  }
  const definitions = new Map(defaultCriteriaItems().map((item) => [item.id, item]));
  for (const criteria of state.criteria ?? []) {
    if (!Array.isArray(criteria.items) || criteria.items.length > 100 || new Set(criteria.items.map((item) => item.id)).size !== criteria.items.length) fail2("INVALID_CRITERIA", "\uAE30\uC900\uC758 \uD56D\uBAA9\uACFC \uC911\uBCF5 \uC5EC\uBD80\uB97C \uD655\uC778\uD574 \uC8FC\uC138\uC694.");
    for (const item of criteria.items) {
      validateTraceDefinition(item);
      const prior = definitions.get(item.id);
      if (prior && (prior.label !== item.label || prior.group !== item.group || prior.mode !== item.mode || prior.version !== item.version)) fail2("CRITERIA_ID_REUSED", "\uB73B\uC774\uB098 \uC801\uC6A9 \uAE30\uC900\uC774 \uBC14\uB010 \uD65C\uB3D9\uC740 \uC0C8 \uD56D\uBAA9\uC73C\uB85C \uAD6C\uBCC4\uD574 \uC8FC\uC138\uC694.");
      definitions.set(item.id, item);
    }
  }
  const assignments = /* @__PURE__ */ new Set();
  for (const assignment of state.criteriaAssignments ?? []) {
    if (!["topic", "subject", "global"].includes(assignment.scope) || assignment.scope === "global" && assignment.ownerId !== null || assignment.scope === "subject" && !subjectIds.has(assignment.ownerId ?? "") || assignment.scope === "topic" && !nodeIndex.has(assignment.ownerId ?? "")) fail2("CRITERIA_OWNER", "\uAE30\uC900\uC744 \uC801\uC6A9\uD560 \uC18C\uC18D\uC744 \uD655\uC778\uD574 \uC8FC\uC138\uC694.");
    const key2 = JSON.stringify([assignment.scope, assignment.ownerId]);
    if (assignments.has(key2)) fail2("DUPLICATE_CRITERIA_ASSIGNMENT", "\uAC19\uC740 \uD56D\uBAA9\uC5D0 \uAE30\uC900 \uC5F0\uACB0\uC774 \uC911\uBCF5\uB418\uC5B4 \uC788\uC2B5\uB2C8\uB2E4.");
    assignments.add(key2);
    const target = state.criteria?.find((criteria) => criteria.id === assignment.criteriaId);
    if (!target || !assignment.deletedAt && target.deletedAt) fail2("CRITERIA_REFERENCE", "\uAE30\uC900\uC758 \uC6D0\uBB38 \uC5F0\uACB0\uC744 \uD655\uC778\uD574 \uC8FC\uC138\uC694.");
  }
  for (const row of state.revisions) if (row.userId !== state.userId || row.namespace !== state.namespace) fail2("OWNERSHIP", "\uC218\uC815 \uC774\uB825\uC758 \uC18C\uC720\uC790\uAC00 \uB2E4\uB985\uB2C8\uB2E4.");
}
function verifyNarrative(state, row) {
  if (typeof row.body !== "string") fail2("INVALID_BODY", "\uBCF8\uBB38\uC740 \uAE00\uB85C \uB0A8\uACA8 \uC8FC\uC138\uC694.");
  if (row.kind === "free-note") {
    if (row.ownerId !== null) targetSubject(state, row.ownerId, false);
    return;
  }
  if (row.ownerId === null) fail2("OWNER_REQUIRED", "\uBCF8\uBB38\uC744 \uC5F0\uACB0\uD560 \uB300\uC0C1\uC744 \uD655\uC778\uD574 \uC8FC\uC138\uC694.");
  if (row.kind === "subject-overview") find(state.subjects, row.ownerId, false);
  else if (row.kind === "unit-introduction") {
    if (find(state.nodes, row.ownerId, false).role !== "unit") fail2("INVALID_OWNER", "\uB2E8\uC6D0 \uC11C\uBB38\uC740 \uB2E8\uC6D0\uC5D0 \uC5F0\uACB0\uD574 \uC8FC\uC138\uC694.");
  } else if (row.kind === "topic-note") find(state.nodes, row.ownerId, false);
  else fail2("INVALID_NARRATIVE", "\uBCF8\uBB38\uC758 \uC885\uB958\uB97C \uD655\uC778\uD574 \uC8FC\uC138\uC694.");
}
var validateState = assertState;

// src/server/state-codec.ts
function unpackServerState(value) {
  const stored = value;
  if (stored.encoding === void 0) {
    validateState(value);
    return value;
  }
  if (stored.encoding !== "lz-base64-utf16-v1" || typeof stored.encoded !== "string") throw new DomainError("ENCODING", "\uC11C\uBC84 \uC6D0\uBB38 \uD615\uC2DD\uC744 \uC77D\uC9C0 \uBABB\uD588\uC2B5\uB2C8\uB2E4.");
  const raw = import_lz_string.default.decompressFromBase64(stored.encoded);
  if (!raw) throw new DomainError("ENCODING", "\uC11C\uBC84 \uC6D0\uBB38\uC744 \uC77D\uC9C0 \uBABB\uD588\uC2B5\uB2C8\uB2E4.");
  const state = JSON.parse(raw);
  validateState(state);
  if (state.userId !== stored.userId || state.namespace !== stored.namespace) throw new DomainError("OWNERSHIP", "\uC11C\uBC84 \uC6D0\uBB38\uC758 \uC18C\uC720\uAD8C\uC744 \uD655\uC778\uD558\uC9C0 \uBABB\uD588\uC2B5\uB2C8\uB2E4.");
  return state;
}

// supabase/functions/study-notifications/entry.ts
var url = Deno.env.get("SUPABASE_URL");
var key = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
var anon = Deno.env.get("SUPABASE_ANON_KEY");
var publicKey = Deno.env.get("STUDY_PUSH_PUBLIC_KEY") ?? "";
var privateKey = Deno.env.get("STUDY_PUSH_PRIVATE_KEY") ?? "";
var subject = Deno.env.get("STUDY_PUSH_SUBJECT") ?? "";
async function rpc(name, body) {
  const response = await fetch(`${url}/rest/v1/rpc/${name}`, { method: "POST", headers: { apikey: key, Authorization: `Bearer ${key}`, "Content-Type": "application/json" }, body: JSON.stringify(body) });
  if (!response.ok) throw Error("NOTIFICATION_STORAGE");
  return response.status === 204 ? void 0 : await response.json();
}
var backend = {
  async authenticate(token) {
    const response = await fetch(`${url}/auth/v1/user`, { headers: { apikey: anon, Authorization: `Bearer ${token}` } });
    if (!response.ok) throw Error("AUTH_REQUIRED");
    return (await response.json()).id;
  },
  async approved(userId) {
    const access = await rpc("study_account_access", { p_user: userId });
    return access.status === "approved";
  },
  async save(userId, subscription) {
    await rpc("study_save_push", { p_user: userId, p_subscription: subscription });
  },
  async remove(userId, endpoint) {
    await rpc("study_remove_push", { p_user: userId, p_endpoint: endpoint });
  },
  async status(userId, endpoint) {
    return rpc("study_push_status", { p_user: userId, p_endpoint: endpoint });
  },
  async claim(at) {
    return rpc("study_claim_push", { p_at: at });
  },
  async read(userId) {
    const row = await rpc("study_read_workspace", { p_user: userId, p_namespace: "personal" });
    return row ? unpackServerState(row.state) : null;
  },
  async finish(job, outcome) {
    await rpc("study_finish_push", { p_id: job.id, p_day: job.day, p_claim: job.claim, p_outcome: outcome });
  },
  async send(subscription, payload) {
    if (!privateKey || !publicKey || !subject) throw Error("PUSH_CONFIGURATION");
    await webpush.sendNotification(subscription, JSON.stringify(payload), { vapidDetails: { subject, publicKey, privateKey }, TTL: 3600, timeout: 8e3, urgency: "normal", topic: "study-schedule-daily" });
  }
};
Deno.serve((request) => handleScheduleNotifications(request, backend, { publicKey: privateKey && subject ? publicKey : "", cronSecret: Deno.env.get("STUDY_PUSH_CRON_SECRET") ?? "" }));
/*! Bundled license information:

ts-fsrs/dist/index.mjs:
ts-fsrs/dist/index.mjs:
ts-fsrs/dist/index.mjs:
  (* istanbul ignore next -- @preserve *)
*/
