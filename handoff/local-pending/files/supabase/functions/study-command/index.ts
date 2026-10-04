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
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
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

// src/server/state-codec.ts
var import_lz_string = __toESM(require_lz_string(), 1);

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
function emptyState(userId, namespace) {
  return { schemaVersion: 1, userId, namespace, semesters: [], subjects: [], nodes: [], sessions: [], records: [], narratives: [], revisions: [], appliedOps: {} };
}

// src/domain/concept-production.ts
var CONCEPT_TYPES = [
  "\uC815\uC758\uD615",
  "\uAD6C\uBCC4\uD615",
  "\uAD6C\uC870\uD615",
  "\uACFC\uC815\uD615",
  "\uC6D0\uB9AC\uD615",
  "\uC808\uCC28\uD615",
  "\uAD00\uC810\uD615"
];
var EMPTY_CONCEPT_CHECKS = {
  classification: false,
  meaning: false,
  conditions: false,
  example: false,
  wording: false,
  screen: false
};
var CONCEPT_BATCH_SIZE = 30;
var fail = (message) => {
  throw new DomainError("INVALID_CONCEPT", message);
};
var text = (v, max = 2e4) => typeof v === "string" && v.length <= max;
function parseConceptSource(raw) {
  if (!text(raw, 3e6))
    fail("\uAC1C\uB150 \uC6D0\uBB38\uC740 300\uB9CC \uAE00\uC790\uAE4C\uC9C0 \uAC00\uC838\uC62C \uC218 \uC788\uC2B5\uB2C8\uB2E4. \uC6D0\uBCF8 \uD30C\uC77C\uC740 \uC720\uC9C0\uD588\uC2B5\uB2C8\uB2E4.");
  let v;
  try {
    v = JSON.parse(raw);
  } catch {
    return fail("JSON \uD30C\uC77C\uC744 \uC77D\uC9C0 \uBABB\uD588\uC2B5\uB2C8\uB2E4. \uC6D0\uBCF8 \uD30C\uC77C\uC744 \uD655\uC778\uD574 \uC8FC\uC138\uC694.");
  }
  if (!v || !Array.isArray(v.items) || !v.items.length || v.items.length > 1e4)
    fail("\uAC1C\uB150 \uBAA9\uB85D\uACFC \uC6D0\uB798 \uC2DD\uBCC4\uC790\uB97C \uD655\uC778\uD574 \uC8FC\uC138\uC694.");
  const ids = /* @__PURE__ */ new Set();
  for (const item of v.items) {
    if (!item || !text(item.id, 120) || !item.id || ids.has(item.id) || !text(item.name, 500) || !item.name.trim() || !text(item.def) || !text(item.ex) || !text(item.insight) || !text(item.type, 200) || !Number.isSafeInteger(item.cat))
      fail("\uAC1C\uB150 \uC774\uB984\xB7\uBCF8\uBB38\xB7\uC2DD\uBCC4\uC790\uC5D0 \uB204\uB77D\uC774\uB098 \uC911\uBCF5\uC774 \uC788\uC2B5\uB2C8\uB2E4. \uC77C\uBD80\uB9CC \uAC00\uC838\uC624\uC9C0 \uC54A\uC558\uC2B5\uB2C8\uB2E4.");
    ids.add(item.id);
  }
  return v;
}
function validateConceptCatalog(c) {
  parseConceptSource(c.raw);
  if (!/^[a-f0-9]{64}$/.test(c.sha256) || !text(c.filename, 500) || !c.filename)
    fail("\uC6D0\uBB38 \uD30C\uC77C\uC758 \uC774\uB984\uACFC \uD574\uC2DC\uB97C \uD655\uC778\uD574 \uC8FC\uC138\uC694.");
}
function validateConceptEdition(value) {
  if (!value || !text(value.catalogId, 256) || !text(value.sourceId, 120) || ![null, ...CONCEPT_TYPES].includes(value.displayType) || !Array.isArray(value.secondaryTypes) || value.secondaryTypes.length > 6 || value.secondaryTypes.some((t) => !CONCEPT_TYPES.includes(t)) || new Set(value.secondaryTypes).size !== value.secondaryTypes.length || !text(value.reason, 5e3) || !text(value.issue, 5e3) || !text(value.promptVersion, 160) || !(value.jobId === null || text(value.jobId, 256)) || !["draft", "blocked", "published"].includes(value.status))
    fail("\uAC1C\uB150 \uC81C\uC791 \uACB0\uACFC\uC758 \uC720\uD615\xB7\uC6D0\uBB38 \uC5F0\uACB0\xB7\uC0C1\uD0DC\uB97C \uD655\uC778\uD574 \uC8FC\uC138\uC694.");
  if (!value.checks || Object.keys(EMPTY_CONCEPT_CHECKS).some(
    (k) => typeof value.checks[k] !== "boolean"
  ))
    fail("\uAC80\uD1A0\uD55C \uD56D\uBAA9\uC744 \uD655\uC778\uD574 \uC8FC\uC138\uC694.");
  if (!Array.isArray(value.evidence) || value.evidence.length > 30 || value.evidence.some(
    (e) => !e || !text(e.title, 500) || !text(e.url, 2e3) || !/^https?:\/\//.test(e.url) || !text(e.supports, 5e3) || typeof e.checked !== "boolean"
  ))
    fail("\uD655\uC778\uD55C \uADFC\uAC70\uC640 \uC5F0\uACB0 \uC8FC\uC18C\uB97C \uD655\uC778\uD574 \uC8FC\uC138\uC694.");
  const s = value.screen;
  if (s !== null && (!s || s.type !== value.displayType || !CONCEPT_TYPES.includes(s.type) || !text(s.title, 500) || !s.title.trim() || !text(s.intro, 5e3) || !["choose", "steps"].includes(s.navigation) || !text(s.mode, 100) || !Array.isArray(s.scenes) || !s.scenes.length || s.scenes.length > 12 || s.scenes.some(
    (row) => !row || !text(row.action, 200) || !row.action.trim() || !text(row.title, 500) || !row.title.trim() || !text(row.body, 5e3) || !row.body.trim() || !text(row.caption, 5e3) || !text(row.takeaway, 5e3)
  )))
    fail("\uD654\uBA74\uC758 \uC81C\uBAA9\xB7\uC124\uBA85\xB7\uC120\uD0DD \uB610\uB294 \uC21C\uC11C\uB97C \uD655\uC778\uD574 \uC8FC\uC138\uC694.");
  if (value.status === "blocked" && !value.issue.trim()) fail("\uBCF4\uB958\uD558\uB294 \uC774\uC720\uB97C \uB0A8\uACA8 \uC8FC\uC138\uC694.");
  if (value.status === "published" && (!s || !value.reason.trim() || !Object.keys(EMPTY_CONCEPT_CHECKS).every((k) => value.checks[k]) || value.issue.trim()))
    fail("\uB0B4\uC6A9\uACFC \uD654\uBA74\uC758 \uC5EC\uC12F \uAC80\uD1A0\uB97C \uB9C8\uCE5C \uB4A4 \uC77D\uAE30\uC6A9\uC73C\uB85C \uB4F1\uB85D\uD574 \uC8FC\uC138\uC694.");
}
function validateConceptBatch(b) {
  if (!b || !text(b.catalogId, 256) || !Array.isArray(b.sourceIds) || !b.sourceIds.length || b.sourceIds.length > CONCEPT_BATCH_SIZE || new Set(b.sourceIds).size !== b.sourceIds.length || b.sourceIds.some(
    (id) => !text(id, 120) || !Number.isSafeInteger(b.baseVersions?.[id]) || b.baseVersions[id] < 0
  ) || !["open", "paused", "closed"].includes(b.status))
    fail("\uC791\uC5C5 \uBB36\uC74C\uC740 \uC11C\uB85C \uB2E4\uB978 \uAC1C\uB150 30\uAC1C\uAE4C\uC9C0 \uCC98\uB9AC\uD569\uB2C8\uB2E4.");
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

// src/domain/memo.ts
var MEMO_WIDTH = 900;
var MEMO_HEIGHT = 600;
function validateMemoContent(value) {
  const row = value;
  const bad2 = () => {
    throw new DomainError("INVALID_MEMO", "\uBA54\uBAA8\uC758 \uAE00\uC774\uB098 \uADF8\uB9BC\uC744 \uC77D\uC9C0 \uBABB\uD588\uC2B5\uB2C8\uB2E4. \uC6D0\uBB38\uC744 \uBCC0\uACBD\uD558\uC9C0 \uC54A\uC558\uC2B5\uB2C8\uB2E4.");
  };
  if (!row || typeof row.body !== "string" || row.ownerId !== null && (typeof row.ownerId !== "string" || !row.ownerId.trim()) || !Array.isArray(row.strokes)) return bad2();
  if (row.document !== void 0) {
    const d = row.document;
    if (!d || !Number.isSafeInteger(d.pages) || d.pages < 1 || !Number.isSafeInteger(d.startPage) || d.startPage < 0 || d.startPage + d.pages >= Number.MAX_SAFE_INTEGER) return bad2();
    validateDocuments([{ id: "memo-pdf", name: d.file?.name, kind: "pdf", file: d.file, blocks: [], warnings: [] }]);
  }
  const ids = /* @__PURE__ */ new Set();
  for (const stroke of row.strokes) {
    if (!stroke || typeof stroke.id !== "string" || !stroke.id.trim() || ids.has(stroke.id) || !["ink", "blue", "green"].includes(stroke.ink) || !Number.isFinite(stroke.width) || stroke.width <= 0 || stroke.width > 40 || stroke.page !== void 0 && (!Number.isSafeInteger(stroke.page) || stroke.page < 0 || stroke.page >= Number.MAX_SAFE_INTEGER) || stroke.pressureSensitive !== void 0 && typeof stroke.pressureSensitive !== "boolean" || !Array.isArray(stroke.points) || !stroke.points.length) return bad2();
    ids.add(stroke.id);
    for (const point of stroke.points) if (!point || !Number.isFinite(point.x) || !Number.isFinite(point.y) || point.x < 0 || point.x > MEMO_WIDTH || point.y < 0 || point.y > MEMO_HEIGHT || !Number.isFinite(point.pressure) || point.pressure < 0 || point.pressure > 1) return bad2();
  }
}

// src/domain/ink-workspace.ts
function validateInkWorkspace(content) {
  const bad2 = () => {
    throw new DomainError("INVALID_INK_WORKSPACE", "\uD544\uAE30 \uC124\uC815\uACFC \uC218\uC815 \uC774\uB825\uC744 \uD655\uC778\uD558\uC9C0 \uBABB\uD588\uC2B5\uB2C8\uB2E4. \uC6D0\uBB38\uC740 \uBCF4\uC874\uD588\uC2B5\uB2C8\uB2E4.");
  };
  if (!content || !content.value) return bad2();
  if (content.kind === "preferences") {
    const p = content.value;
    if (!["ink", "blue", "green"].includes(p.ink) || ![2, 3, 5, 8].includes(p.width) || typeof p.finger !== "boolean" || typeof p.pressure !== "boolean") bad2();
  } else if (content.kind === "document") {
    const w = content.value;
    if (!Number.isSafeInteger(w.page) || w.page < 0 || !Number.isSafeInteger(w.pages) || w.pages < 1 || w.page >= w.pages || ![1, 1.5, 2].includes(w.zoom) || typeof w.fingerprint !== "string" || !Array.isArray(w.undo) || !Array.isArray(w.redo) || w.undo.length > 50 || w.redo.length > 50) return bad2();
    for (const c of [...w.undo, ...w.redo]) {
      if (!c || !Array.isArray(c.before) || !Array.isArray(c.after)) return bad2();
      for (const entries of [c.before, c.after]) {
        const ids = /* @__PURE__ */ new Set(), indexes = /* @__PURE__ */ new Set();
        for (const row of entries) {
          if (!row || !Number.isSafeInteger(row.index) || row.index < 0 || indexes.has(row.index) || ids.has(row.stroke?.id)) return bad2();
          validateMemoContent({ body: "", ownerId: null, strokes: [row.stroke] });
          ids.add(row.stroke.id);
          indexes.add(row.index);
        }
      }
    }
  } else bad2();
}

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
var FUZZ_RANGES = [
  {
    start: 2.5,
    end: 7,
    factor: 0.15
  },
  {
    start: 7,
    end: 20,
    factor: 0.1
  },
  {
    start: 20,
    end: Infinity,
    factor: 0.05
  }
];
function get_fuzz_range(interval, elapsed_days, maximum_interval) {
  let delta = 1;
  for (const range of FUZZ_RANGES) {
    delta += range.factor * Math.max(Math.min(interval, range.end) - range.start, 0);
  }
  interval = Math.min(interval, maximum_interval);
  let min_ivl = Math.max(2, Math.round(interval - delta));
  const max_ivl = Math.min(Math.round(interval + delta), maximum_interval);
  if (interval > elapsed_days) {
    min_ivl = Math.max(min_ivl, elapsed_days + 1);
  }
  min_ivl = Math.min(min_ivl, max_ivl);
  return { min_ivl, max_ivl };
}
function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}
function roundTo(num, decimals) {
  const factor = 10 ** decimals;
  return Math.round(num * factor) / factor;
}
function dateDiffInDays(last, cur) {
  const utc1 = Date.UTC(
    last.getUTCFullYear(),
    last.getUTCMonth(),
    last.getUTCDate()
  );
  const utc2 = Date.UTC(
    cur.getUTCFullYear(),
    cur.getUTCMonth(),
    cur.getUTCDate()
  );
  return Math.floor(
    (utc2 - utc1) / 864e5
    /** 1000 * 60 * 60 * 24*/
  );
}
var ConvertStepUnitToMinutes = (step) => {
  const unit = step.slice(-1);
  const value = parseInt(step.slice(0, -1), 10);
  if (Number.isNaN(value) || !Number.isFinite(value) || value < 0) {
    throw new FSRSValidationError(`Invalid step value: ${step}`);
  }
  switch (unit) {
    case "m":
      return value;
    case "h":
      return value * 60;
    case "d":
      return value * 1440;
    default:
      throw new FSRSValidationError(
        `Invalid step unit: ${step}, expected m/h/d`
      );
  }
};
var BasicLearningStepsStrategy = (params, state, cur_step) => {
  const learning_steps = state === State.Relearning || state === State.Review ? params.relearning_steps : params.learning_steps;
  const steps_length = learning_steps.length;
  if (steps_length === 0 || cur_step >= steps_length) return {};
  const firstStep = learning_steps[0];
  const toMinutes = ConvertStepUnitToMinutes;
  const getAgainInterval = () => {
    return toMinutes(firstStep);
  };
  const getHardInterval = () => {
    if (steps_length === 1) return Math.round(toMinutes(firstStep) * 1.5);
    const nextStep = learning_steps[1];
    return Math.round((toMinutes(firstStep) + toMinutes(nextStep)) / 2);
  };
  const getStepInfo = (index) => {
    if (index < 0 || index >= steps_length) {
      return null;
    } else {
      return learning_steps[index];
    }
  };
  const getGoodMinutes = (step) => {
    return toMinutes(step);
  };
  const result = {};
  const step_info = getStepInfo(Math.max(0, cur_step));
  if (state === State.Review) {
    result[Rating.Again] = {
      scheduled_minutes: toMinutes(step_info),
      next_step: 0
    };
    return result;
  } else {
    result[Rating.Again] = {
      scheduled_minutes: getAgainInterval(),
      next_step: 0
    };
    result[Rating.Hard] = {
      scheduled_minutes: getHardInterval(),
      next_step: cur_step
    };
    const next_info = getStepInfo(cur_step + 1);
    if (next_info) {
      const nextMin = getGoodMinutes(next_info);
      if (nextMin) {
        result[Rating.Good] = {
          scheduled_minutes: Math.round(nextMin),
          next_step: cur_step + 1
        };
      }
    }
  }
  return result;
};
function DefaultInitSeedStrategy() {
  const time = this.review_time.getTime();
  const reps = this.current.reps;
  const mul = this.current.difficulty * this.current.stability;
  return `${time}_${reps}_${mul}`;
}
var StrategyMode = /* @__PURE__ */ ((StrategyMode2) => {
  StrategyMode2["SCHEDULER"] = "Scheduler";
  StrategyMode2["LEARNING_STEPS"] = "LearningSteps";
  StrategyMode2["SEED"] = "Seed";
  return StrategyMode2;
})(StrategyMode || {});
var AbstractScheduler = class {
  last;
  current;
  review_time;
  next = /* @__PURE__ */ new Map();
  algorithm;
  strategies;
  elapsed_days = 0;
  // init
  constructor(card, now, algorithm, strategies) {
    this.algorithm = algorithm;
    this.last = TypeConvert.card(card);
    this.current = TypeConvert.card(card);
    this.review_time = TypeConvert.time(now);
    this.strategies = strategies;
    this.init();
  }
  checkGrade(grade) {
    if (!Number.isFinite(grade) || grade < 1 || grade > 4) {
      throw new FSRSValidationError(`Invalid grade "${grade}",expected 1-4`);
    }
  }
  init() {
    const { state, last_review } = this.current;
    let interval = 0;
    if (state !== State.New && last_review) {
      interval = dateDiffInDays(last_review, this.review_time);
    }
    this.current.last_review = this.review_time;
    this.elapsed_days = interval;
    this.current.elapsed_days = interval;
    this.current.reps += 1;
    let seed_strategy = DefaultInitSeedStrategy;
    if (this.strategies) {
      const custom_strategy = this.strategies.get(StrategyMode.SEED);
      if (custom_strategy) {
        seed_strategy = custom_strategy;
      }
    }
    this.algorithm.seed = seed_strategy.call(this);
  }
  preview() {
    return {
      [Rating.Again]: this.review(Rating.Again),
      [Rating.Hard]: this.review(Rating.Hard),
      [Rating.Good]: this.review(Rating.Good),
      [Rating.Easy]: this.review(Rating.Easy),
      [Symbol.iterator]: this.previewIterator.bind(this)
    };
  }
  *previewIterator() {
    for (const grade of Grades) {
      yield this.review(grade);
    }
  }
  review(grade) {
    const { state } = this.last;
    let item;
    this.checkGrade(grade);
    switch (state) {
      case State.New:
        item = this.newState(grade);
        break;
      case State.Learning:
      case State.Relearning:
        item = this.learningState(grade);
        break;
      case State.Review:
        item = this.reviewState(grade);
        break;
    }
    return item;
  }
  buildLog(rating) {
    const { last_review, due, elapsed_days } = this.last;
    return {
      rating,
      state: this.current.state,
      due: last_review || due,
      stability: this.current.stability,
      difficulty: this.current.difficulty,
      elapsed_days: this.elapsed_days,
      last_elapsed_days: elapsed_days,
      scheduled_days: this.current.scheduled_days,
      learning_steps: this.current.learning_steps,
      review: this.review_time
    };
  }
};
var Alea = class {
  c;
  s0;
  s1;
  s2;
  constructor(seed) {
    const mash = Mash();
    this.c = 1;
    this.s0 = mash(" ");
    this.s1 = mash(" ");
    this.s2 = mash(" ");
    if (seed == null) seed = Date.now();
    this.s0 -= mash(seed);
    if (this.s0 < 0) this.s0 += 1;
    this.s1 -= mash(seed);
    if (this.s1 < 0) this.s1 += 1;
    this.s2 -= mash(seed);
    if (this.s2 < 0) this.s2 += 1;
  }
  next() {
    const t = 2091639 * this.s0 + this.c * 23283064365386963e-26;
    this.s0 = this.s1;
    this.s1 = this.s2;
    this.c = t | 0;
    this.s2 = t - this.c;
    return this.s2;
  }
  set state(state) {
    this.c = state.c;
    this.s0 = state.s0;
    this.s1 = state.s1;
    this.s2 = state.s2;
  }
  get state() {
    return {
      c: this.c,
      s0: this.s0,
      s1: this.s1,
      s2: this.s2
    };
  }
};
function Mash() {
  let n = 4022871197;
  return function mash(data) {
    data = String(data);
    for (let i = 0; i < data.length; i++) {
      n += data.charCodeAt(i);
      let h = 0.02519603282416938 * n;
      n = h >>> 0;
      h -= n;
      h *= n;
      n = h >>> 0;
      h -= n;
      n += h * 4294967296;
    }
    return (n >>> 0) * 23283064365386963e-26;
  };
}
function alea(seed) {
  const xg = new Alea(seed);
  const prng = () => xg.next();
  prng.int32 = () => xg.next() * 4294967296 | 0;
  prng.double = () => prng() + (prng() * 2097152 | 0) * 11102230246251565e-32;
  prng.state = () => xg.state;
  prng.importState = (state) => {
    xg.state = state;
    return prng;
  };
  return prng;
}
var version = "5.4.2";
var default_request_retention = 0.9;
var default_maximum_interval = 36500;
var default_enable_fuzz = false;
var default_enable_short_term = true;
var default_learning_steps = Object.freeze([
  "1m",
  "10m"
]);
var default_relearning_steps = Object.freeze([
  "10m"
]);
var FSRSVersion = `v${version} using FSRS-6.0`;
var S_MIN = 1e-3;
var INIT_S_MAX = 100;
var FSRS5_DEFAULT_DECAY = 0.5;
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
var W17_W18_Ceiling = 2;
var CLAMP_PARAMETERS = (w17_w18_ceiling, enable_short_term = default_enable_short_term) => [
  [S_MIN, INIT_S_MAX],
  [S_MIN, INIT_S_MAX],
  [S_MIN, INIT_S_MAX],
  [S_MIN, INIT_S_MAX],
  [1, 10],
  [1e-3, 4],
  [1e-3, 4],
  [1e-3, 0.75],
  [0, 4.5],
  [0, 0.8],
  [1e-3, 3.5],
  [1e-3, 5],
  [1e-3, 0.25],
  [1e-3, 0.9],
  [0, 4],
  [0, 1],
  [1, 6],
  [0, w17_w18_ceiling],
  [0, w17_w18_ceiling],
  [
    enable_short_term ? 0.01 : 0,
    0.8
  ],
  [0.1, 0.8]
];
var clipParameters = (parameters, numRelearningSteps, enableShortTerm = default_enable_short_term) => {
  const clip = CLAMP_PARAMETERS(W17_W18_Ceiling, enableShortTerm).slice(
    0,
    parameters.length
  );
  if (Math.max(0, numRelearningSteps) > 1) {
    const w11 = clamp(parameters[11] || 0, clip[11][0], clip[11][1]);
    const w13 = clamp(parameters[13] || 0, clip[13][0], clip[13][1]);
    const w14 = clamp(parameters[14] || 0, clip[14][0], clip[14][1]);
    const value = -(Math.log(w11) + Math.log(Math.pow(2, w13) - 1) + w14 * 0.3) / numRelearningSteps;
    const w17_w18_ceiling = clamp(
      roundTo(Math.sqrt(Math.max(value, 0)), 8),
      0.01,
      W17_W18_Ceiling
    );
    if (clip[17]) clip[17] = [clip[17][0], w17_w18_ceiling];
    if (clip[18]) clip[18] = [clip[18][0], w17_w18_ceiling];
  }
  return clip.map(
    ([min, max], index) => clamp(parameters[index] || 0, min, max)
  );
};
var migrateParameters = (parameters, numRelearningSteps = 0, enableShortTerm = default_enable_short_term) => {
  if (parameters === void 0) {
    return [...default_w];
  }
  switch (parameters.length) {
    case 21:
      return clipParameters(
        Array.from(parameters),
        numRelearningSteps,
        enableShortTerm
      );
    case 19:
      console.debug("[FSRS-6]auto fill w from 19 to 21 length");
      return clipParameters(
        Array.from(parameters),
        numRelearningSteps,
        enableShortTerm
      ).concat([0, FSRS5_DEFAULT_DECAY]);
    case 17: {
      const w = clipParameters(
        Array.from(parameters),
        numRelearningSteps,
        enableShortTerm
      );
      w[4] = +(w[5] * 2 + w[4]).toFixed(8);
      w[5] = +(Math.log(w[5] * 3 + 1) / 3).toFixed(8);
      w[6] = +(w[6] + 0.5).toFixed(8);
      console.debug("[FSRS-6]auto fill w from 17 to 21 length");
      return w.concat([0, 0, 0, FSRS5_DEFAULT_DECAY]);
    }
    default:
      console.warn("[FSRS]Invalid parameters length, using default parameters");
      return [...default_w];
  }
};
var generatorParameters = (props) => {
  const learning_steps = Array.isArray(props?.learning_steps) ? props.learning_steps : default_learning_steps;
  const relearning_steps = Array.isArray(props?.relearning_steps) ? props.relearning_steps : default_relearning_steps;
  const enable_short_term = props?.enable_short_term ?? default_enable_short_term;
  const w = migrateParameters(
    props?.w,
    relearning_steps.length,
    enable_short_term
  );
  return {
    request_retention: props?.request_retention || default_request_retention,
    maximum_interval: props?.maximum_interval || default_maximum_interval,
    w,
    enable_fuzz: props?.enable_fuzz ?? default_enable_fuzz,
    enable_short_term,
    learning_steps,
    relearning_steps
  };
};
function createEmptyCard(now, afterHandler) {
  const emptyCard = {
    due: now ? TypeConvert.time(now) : /* @__PURE__ */ new Date(),
    stability: 0,
    difficulty: 0,
    elapsed_days: 0,
    scheduled_days: 0,
    reps: 0,
    lapses: 0,
    learning_steps: 0,
    state: State.New,
    last_review: void 0
  };
  if (afterHandler && typeof afterHandler === "function") {
    return afterHandler(emptyCard);
  } else {
    return emptyCard;
  }
}
var computeDecayFactor = (decayOrParams) => {
  const decay = typeof decayOrParams === "number" ? -decayOrParams : -decayOrParams[20];
  const factor = Math.exp(Math.pow(decay, -1) * Math.log(0.9)) - 1;
  return { decay, factor: roundTo(factor, 8) };
};
function forgetting_curve(decayOrParams, elapsed_days, stability) {
  const { decay, factor } = computeDecayFactor(decayOrParams);
  return roundTo(Math.pow(1 + factor * elapsed_days / stability, decay), 8);
}
var FSRSAlgorithm = class {
  param;
  intervalModifier;
  _seed;
  constructor(params) {
    this.param = new Proxy(
      this.prepare_parameters(params),
      this.params_handler_proxy()
    );
    this.intervalModifier = this.calculate_interval_modifier(
      this.param.request_retention
    );
    this.forgetting_curve = forgetting_curve.bind(this, this.param.w);
  }
  get interval_modifier() {
    return this.intervalModifier;
  }
  set seed(seed) {
    this._seed = seed;
  }
  /**
   * @see https://github.com/open-spaced-repetition/fsrs4anki/wiki/The-Algorithm#fsrs-5
   *
   * The formula used is: $$I(r,s) = (r^{\frac{1}{DECAY}} - 1) / FACTOR \times s$$
   * @param request_retention 0<request_retention<=1,Requested retention rate
   * @throws {Error} Requested retention rate should be in the range (0,1]
   */
  calculate_interval_modifier(request_retention) {
    if (request_retention <= 0 || request_retention > 1) {
      throw new FSRSValidationError(
        "Requested retention rate should be in the range (0,1]"
      );
    }
    const { decay, factor } = computeDecayFactor(this.param.w);
    return roundTo((Math.pow(request_retention, 1 / decay) - 1) / factor, 8);
  }
  /**
   * Get the parameters of the algorithm.
   */
  get parameters() {
    return this.param;
  }
  /**
   * Set the parameters of the algorithm.
   * @param params Partial<FSRSParameters>
   */
  set parameters(params) {
    this.update_parameters(params);
  }
  params_handler_proxy() {
    const _this = this;
    return {
      set: function(target, prop, value) {
        if (prop === "request_retention" && Number.isFinite(value)) {
          _this.intervalModifier = _this.calculate_interval_modifier(
            Number(value)
          );
        } else if (prop === "w") {
          value = migrateParameters(
            value,
            target.relearning_steps.length,
            target.enable_short_term
          );
          value = clipParameters(
            Array.from(value),
            target.relearning_steps.length,
            target.enable_short_term
          );
          _this.forgetting_curve = forgetting_curve.bind(this, value);
          _this.intervalModifier = _this.calculate_interval_modifier(
            Number(target.request_retention)
          );
        }
        Reflect.set(target, prop, value);
        return true;
      }
    };
  }
  update_parameters(params) {
    const _params = this.prepare_parameters(params);
    for (const key in _params) {
      const paramKey = key;
      this.param[paramKey] = _params[paramKey];
    }
  }
  prepare_parameters = (params) => {
    const generated = generatorParameters(params);
    generated.w = clipParameters(
      Array.from(generated.w),
      generated.relearning_steps.length,
      generated.enable_short_term
    );
    return generated;
  };
  /**
     * The formula used is :
     * $$ S_0(G) = w_{G-1}$$
     * $$S_0 = \max \lbrace S_0,0.1\rbrace $$
  
     * @param g Grade (rating at Anki) [1.again,2.hard,3.good,4.easy]
     * @return Stability (interval when R=90%)
     */
  init_stability(g) {
    return Math.max(this.param.w[g - 1], 0.1);
  }
  /**
   * The formula used is :
   * $$D_0(G) = w_4 - e^{(G-1) \cdot w_5} + 1 $$
   * $$D_0 = \min \lbrace \max \lbrace D_0(G),1 \rbrace,10 \rbrace$$
   * where the $$D_0(1)=w_4$$ when the first rating is good.
   *
   * @param {Grade} g Grade (rating at Anki) [1.again,2.hard,3.good,4.easy]
   * @return {number} Difficulty $$D \in [1,10]$$
   */
  init_difficulty(g) {
    const w = this.param.w;
    const d = w[4] - Math.exp((g - 1) * w[5]) + 1;
    return roundTo(d, 8);
  }
  /**
   * If fuzzing is disabled or ivl is less than 2.5, it returns the original interval.
   * @param {number} ivl - The interval to be fuzzed.
   * @param {number} elapsed_days t days since the last review
   * @return {number} - The fuzzed interval.
   **/
  apply_fuzz(ivl, elapsed_days) {
    if (!this.param.enable_fuzz || ivl < 2.5) return Math.round(ivl);
    const generator = alea(this._seed);
    const fuzz_factor = generator();
    const { min_ivl, max_ivl } = get_fuzz_range(
      ivl,
      elapsed_days,
      this.param.maximum_interval
    );
    return Math.floor(fuzz_factor * (max_ivl - min_ivl + 1) + min_ivl);
  }
  /**
   *   @see The formula used is : {@link FSRSAlgorithm.calculate_interval_modifier}
   *   @param {number} s - Stability (interval when R=90%)
   *   @param {number} elapsed_days t days since the last review
   */
  next_interval(s, elapsed_days) {
    const newInterval = Math.min(
      Math.max(1, Math.round(s * this.intervalModifier)),
      this.param.maximum_interval
    );
    return this.apply_fuzz(newInterval, elapsed_days);
  }
  /**
   * @see https://github.com/open-spaced-repetition/fsrs4anki/issues/697
   */
  linear_damping(delta_d, old_d) {
    return roundTo(delta_d * (10 - old_d) / 9, 8);
  }
  /**
   * The formula used is :
   * $$\text{delta}_d = -w_6 \cdot (g - 3)$$
   * $$\text{next}_d = D + \text{linear damping}(\text{delta}_d , D)$$
   * $$D^\prime(D,R) = w_7 \cdot D_0(4) +(1 - w_7) \cdot \text{next}_d$$
   * @param {number} d Difficulty $$D \in [1,10]$$
   * @param {Grade} g Grade (rating at Anki) [1.again,2.hard,3.good,4.easy]
   * @return {number} $$\text{next}_D$$
   */
  next_difficulty(d, g) {
    const delta_d = -this.param.w[6] * (g - 3);
    const next_d = d + this.linear_damping(delta_d, d);
    return clamp(
      this.mean_reversion(this.init_difficulty(Rating.Easy), next_d),
      1,
      10
    );
  }
  /**
   * The formula used is :
   * $$w_7 \cdot \text{init} +(1 - w_7) \cdot \text{current}$$
   * @param {number} init $$w_2 : D_0(3) = w_2 + (R-2) \cdot w_3= w_2$$
   * @param {number} current $$D - w_6 \cdot (R - 2)$$
   * @return {number} difficulty
   */
  mean_reversion(init, current) {
    const w = this.param.w;
    return roundTo(w[7] * init + (1 - w[7]) * current, 8);
  }
  /**
   * The formula used is :
   * $$S^\prime_r(D,S,R,G) = S\cdot(e^{w_8}\cdot (11-D)\cdot S^{-w_9}\cdot(e^{w_{10}\cdot(1-R)}-1)\cdot w_{15}(\text{if} G=2) \cdot w_{16}(\text{if} G=4)+1)$$
   * @param {number} d Difficulty D \in [1,10]
   * @param {number} s Stability (interval when R=90%)
   * @param {number} r Retrievability (probability of recall)
   * @param {Grade} g Grade (Rating[0.again,1.hard,2.good,3.easy])
   * @return {number} S^\prime_r new stability after recall
   */
  next_recall_stability(d, s, r, g) {
    const w = this.param.w;
    const hard_penalty = Rating.Hard === g ? w[15] : 1;
    const easy_bound = Rating.Easy === g ? w[16] : 1;
    return roundTo(
      clamp(
        s * (1 + Math.exp(w[8]) * (11 - d) * Math.pow(s, -w[9]) * (Math.exp((1 - r) * w[10]) - 1) * hard_penalty * easy_bound),
        S_MIN,
        36500
      ),
      8
    );
  }
  /**
   * The formula used is :
   * $$S^\prime_f(D,S,R) = w_{11}\cdot D^{-w_{12}}\cdot ((S+1)^{w_{13}}-1) \cdot e^{w_{14}\cdot(1-R)}$$
   * enable_short_term = true : $$S^\prime_f \in \min \lbrace \max \lbrace S^\prime_f,0.01\rbrace, \frac{S}{e^{w_{17} \cdot w_{18}}} \rbrace$$
   * enable_short_term = false : $$S^\prime_f \in \min \lbrace \max \lbrace S^\prime_f,0.01\rbrace, S \rbrace$$
   * @param {number} d Difficulty D \in [1,10]
   * @param {number} s Stability (interval when R=90%)
   * @param {number} r Retrievability (probability of recall)
   * @return {number} S^\prime_f new stability after forgetting
   */
  next_forget_stability(d, s, r) {
    const w = this.param.w;
    return roundTo(
      clamp(
        w[11] * Math.pow(d, -w[12]) * (Math.pow(s + 1, w[13]) - 1) * Math.exp((1 - r) * w[14]),
        S_MIN,
        36500
      ),
      8
    );
  }
  /**
   * The formula used is :
   * $$S^\prime_s(S,G) = S \cdot e^{w_{17} \cdot (G-3+w_{18})}$$
   * @param {number} s Stability (interval when R=90%)
   * @param {Grade} g Grade (Rating[0.again,1.hard,2.good,3.easy])
   */
  next_short_term_stability(s, g) {
    const w = this.param.w;
    const sinc = Math.pow(s, -w[19]) * Math.exp(w[17] * (g - 3 + w[18]));
    const maskedSinc = g >= Rating.Hard ? Math.max(sinc, 1) : sinc;
    return roundTo(clamp(s * maskedSinc, S_MIN, 36500), 8);
  }
  /**
   * The formula used is :
   * $$R(t,S) = (1 + \text{FACTOR} \times \frac{t}{9 \cdot S})^{\text{DECAY}}$$
   * @param {number} elapsed_days t days since the last review
   * @param {number} stability Stability (interval when R=90%)
   * @return {number} r Retrievability (probability of recall)
   */
  forgetting_curve;
  /**
   * Calculates the next state of memory based on the current state, time elapsed, and grade.
   *
   * @param memory_state - The current state of memory, which can be null.
   * @param t - The time elapsed since the last review.
   * @param {Rating} g Grade (Rating[0.Manual,1.Again,2.Hard,3.Good,4.Easy])
   * @param r - Optional retrievability value. If not provided, it will be calculated.
   * @returns The next state of memory with updated difficulty and stability.
   */
  next_state(memory_state, t, g, r) {
    const { difficulty: d, stability: s } = memory_state ?? {
      difficulty: 0,
      stability: 0
    };
    if (t < 0) {
      throw new FSRSValidationError(`Invalid delta_t "${t}"`);
    }
    if (g < 0 || g > 4) {
      throw new FSRSValidationError(`Invalid grade "${g}"`);
    }
    if (d === 0 && s === 0) {
      return {
        difficulty: clamp(this.init_difficulty(g), 1, 10),
        stability: this.init_stability(g)
      };
    }
    if (g === 0) {
      return {
        difficulty: d,
        stability: s
      };
    }
    if (d < 1 || s < S_MIN) {
      throw new FSRSValidationError(
        `Invalid memory state { difficulty: ${d}, stability: ${s} }`
      );
    }
    const w = this.param.w;
    r = typeof r === "number" ? r : this.forgetting_curve(t, s);
    let new_s;
    if (t === 0 && this.param.enable_short_term) {
      new_s = this.next_short_term_stability(s, g);
    } else if (g === 1) {
      const s_after_fail = this.next_forget_stability(d, s, r);
      let [w_17, w_18] = [0, 0];
      if (this.param.enable_short_term) {
        w_17 = w[17];
        w_18 = w[18];
      }
      const next_s_min = s / Math.exp(w_17 * w_18);
      new_s = clamp(roundTo(next_s_min, 8), S_MIN, s_after_fail);
    } else {
      new_s = this.next_recall_stability(d, s, r, g);
    }
    const new_d = this.next_difficulty(d, g);
    return { difficulty: new_d, stability: new_s };
  }
};
var BasicScheduler = class extends AbstractScheduler {
  learningStepsStrategy;
  constructor(card, now, algorithm, strategies) {
    super(card, now, algorithm, strategies);
    let learningStepStrategy = BasicLearningStepsStrategy;
    if (this.strategies) {
      const custom_strategy = this.strategies.get(StrategyMode.LEARNING_STEPS);
      if (custom_strategy) {
        learningStepStrategy = custom_strategy;
      }
    }
    this.learningStepsStrategy = learningStepStrategy;
  }
  getLearningInfo(card, grade) {
    const parameters = this.algorithm.parameters;
    card.learning_steps = card.learning_steps || 0;
    const steps_strategy = this.learningStepsStrategy(
      parameters,
      card.state,
      card.learning_steps
    );
    const scheduled_minutes = Math.max(
      0,
      steps_strategy[grade]?.scheduled_minutes ?? 0
    );
    const next_steps = Math.max(0, steps_strategy[grade]?.next_step ?? 0);
    return {
      scheduled_minutes,
      next_steps
    };
  }
  /**
   * @description This function applies the learning steps based on the current card's state and grade.
   */
  applyLearningSteps(nextCard, grade, to_state) {
    const { scheduled_minutes, next_steps } = this.getLearningInfo(
      this.current,
      grade
    );
    if (scheduled_minutes > 0 && scheduled_minutes < 1440) {
      nextCard.learning_steps = next_steps;
      nextCard.scheduled_days = 0;
      nextCard.state = to_state;
      nextCard.due = date_scheduler(
        this.review_time,
        Math.round(scheduled_minutes),
        false
        /** true:days false: minute */
      );
    } else {
      nextCard.state = State.Review;
      if (scheduled_minutes >= 1440) {
        nextCard.learning_steps = next_steps;
        nextCard.due = date_scheduler(
          this.review_time,
          Math.round(scheduled_minutes),
          false
          /** true:days false: minute */
        );
        nextCard.scheduled_days = Math.floor(scheduled_minutes / 1440);
      } else {
        nextCard.learning_steps = 0;
        const interval = this.algorithm.next_interval(
          nextCard.stability,
          this.elapsed_days
        );
        nextCard.scheduled_days = interval;
        nextCard.due = date_scheduler(this.review_time, interval, true);
      }
    }
  }
  newState(grade) {
    const exist = this.next.get(grade);
    if (exist) {
      return exist;
    }
    const next = this.next_ds(this.elapsed_days, grade);
    this.applyLearningSteps(next, grade, State.Learning);
    const item = {
      card: next,
      log: this.buildLog(grade)
    };
    this.next.set(grade, item);
    return item;
  }
  learningState(grade) {
    const exist = this.next.get(grade);
    if (exist) {
      return exist;
    }
    const next = this.next_ds(this.elapsed_days, grade);
    this.applyLearningSteps(
      next,
      grade,
      this.last.state
      /** Learning or Relearning */
    );
    const item = {
      card: next,
      log: this.buildLog(grade)
    };
    this.next.set(grade, item);
    return item;
  }
  reviewState(grade) {
    const exist = this.next.get(grade);
    if (exist) {
      return exist;
    }
    const interval = this.elapsed_days;
    const retrievability = this.algorithm.forgetting_curve(
      interval,
      this.current.stability
    );
    const next_again = this.next_ds(interval, Rating.Again, retrievability);
    const next_hard = this.next_ds(interval, Rating.Hard, retrievability);
    const next_good = this.next_ds(interval, Rating.Good, retrievability);
    const next_easy = this.next_ds(interval, Rating.Easy, retrievability);
    this.next_interval(next_hard, next_good, next_easy, interval);
    this.next_state(next_hard, next_good, next_easy);
    this.applyLearningSteps(next_again, Rating.Again, State.Relearning);
    next_again.lapses += 1;
    const item_again = {
      card: next_again,
      log: this.buildLog(Rating.Again)
    };
    const item_hard = {
      card: next_hard,
      log: super.buildLog(Rating.Hard)
    };
    const item_good = {
      card: next_good,
      log: super.buildLog(Rating.Good)
    };
    const item_easy = {
      card: next_easy,
      log: super.buildLog(Rating.Easy)
    };
    this.next.set(Rating.Again, item_again);
    this.next.set(Rating.Hard, item_hard);
    this.next.set(Rating.Good, item_good);
    this.next.set(Rating.Easy, item_easy);
    return this.next.get(grade);
  }
  /**
   * Review next_ds
   */
  next_ds(t, g, r) {
    const next_state = this.algorithm.next_state(
      {
        difficulty: this.current.difficulty,
        stability: this.current.stability
      },
      t,
      g,
      r
    );
    const card = TypeConvert.card(this.current);
    card.difficulty = next_state.difficulty;
    card.stability = next_state.stability;
    return card;
  }
  /**
   * Review next_interval
   */
  next_interval(next_hard, next_good, next_easy, interval) {
    let hard_interval, good_interval;
    hard_interval = this.algorithm.next_interval(next_hard.stability, interval);
    good_interval = this.algorithm.next_interval(next_good.stability, interval);
    hard_interval = Math.min(hard_interval, good_interval);
    good_interval = Math.max(good_interval, hard_interval + 1);
    const easy_interval = Math.max(
      this.algorithm.next_interval(next_easy.stability, interval),
      good_interval + 1
    );
    next_hard.scheduled_days = hard_interval;
    next_hard.due = date_scheduler(this.review_time, hard_interval, true);
    next_good.scheduled_days = good_interval;
    next_good.due = date_scheduler(this.review_time, good_interval, true);
    next_easy.scheduled_days = easy_interval;
    next_easy.due = date_scheduler(this.review_time, easy_interval, true);
  }
  /**
   * Review next_state
   */
  next_state(next_hard, next_good, next_easy) {
    next_hard.state = State.Review;
    next_hard.learning_steps = 0;
    next_good.state = State.Review;
    next_good.learning_steps = 0;
    next_easy.state = State.Review;
    next_easy.learning_steps = 0;
  }
};
var LongTermScheduler = class extends AbstractScheduler {
  newState(grade) {
    const exist = this.next.get(grade);
    if (exist) {
      return exist;
    }
    this.current.scheduled_days = 0;
    this.current.elapsed_days = 0;
    const first_interval = 0;
    const next_again = this.next_ds(first_interval, Rating.Again);
    const next_hard = this.next_ds(first_interval, Rating.Hard);
    const next_good = this.next_ds(first_interval, Rating.Good);
    const next_easy = this.next_ds(first_interval, Rating.Easy);
    this.next_interval(
      next_again,
      next_hard,
      next_good,
      next_easy,
      first_interval
    );
    this.next_state(next_again, next_hard, next_good, next_easy);
    this.update_next(next_again, next_hard, next_good, next_easy);
    return this.next.get(grade);
  }
  next_ds(t, g, r) {
    const next_state = this.algorithm.next_state(
      {
        difficulty: this.current.difficulty,
        stability: this.current.stability
      },
      t,
      g,
      r
    );
    const card = TypeConvert.card(this.current);
    card.difficulty = next_state.difficulty;
    card.stability = next_state.stability;
    return card;
  }
  /**
   * @see https://github.com/open-spaced-repetition/ts-fsrs/issues/98#issuecomment-2241923194
   */
  learningState(grade) {
    return this.reviewState(grade);
  }
  reviewState(grade) {
    const exist = this.next.get(grade);
    if (exist) {
      return exist;
    }
    const interval = this.elapsed_days;
    const retrievability = this.algorithm.forgetting_curve(
      interval,
      this.current.stability
    );
    const next_again = this.next_ds(interval, Rating.Again, retrievability);
    const next_hard = this.next_ds(interval, Rating.Hard, retrievability);
    const next_good = this.next_ds(interval, Rating.Good, retrievability);
    const next_easy = this.next_ds(interval, Rating.Easy, retrievability);
    this.next_interval(next_again, next_hard, next_good, next_easy, interval);
    this.next_state(next_again, next_hard, next_good, next_easy);
    next_again.lapses += 1;
    this.update_next(next_again, next_hard, next_good, next_easy);
    return this.next.get(grade);
  }
  /**
   * Review/New next_interval
   */
  next_interval(next_again, next_hard, next_good, next_easy, interval) {
    let again_interval, hard_interval, good_interval, easy_interval;
    again_interval = this.algorithm.next_interval(
      next_again.stability,
      interval
    );
    hard_interval = this.algorithm.next_interval(next_hard.stability, interval);
    good_interval = this.algorithm.next_interval(next_good.stability, interval);
    easy_interval = this.algorithm.next_interval(next_easy.stability, interval);
    again_interval = Math.min(again_interval, hard_interval);
    hard_interval = Math.max(hard_interval, again_interval + 1);
    good_interval = Math.max(good_interval, hard_interval + 1);
    easy_interval = Math.max(easy_interval, good_interval + 1);
    next_again.scheduled_days = again_interval;
    next_again.due = date_scheduler(this.review_time, again_interval, true);
    next_hard.scheduled_days = hard_interval;
    next_hard.due = date_scheduler(this.review_time, hard_interval, true);
    next_good.scheduled_days = good_interval;
    next_good.due = date_scheduler(this.review_time, good_interval, true);
    next_easy.scheduled_days = easy_interval;
    next_easy.due = date_scheduler(this.review_time, easy_interval, true);
  }
  /**
   * Review/New next_state
   */
  next_state(next_again, next_hard, next_good, next_easy) {
    next_again.state = State.Review;
    next_again.learning_steps = 0;
    next_hard.state = State.Review;
    next_hard.learning_steps = 0;
    next_good.state = State.Review;
    next_good.learning_steps = 0;
    next_easy.state = State.Review;
    next_easy.learning_steps = 0;
  }
  update_next(next_again, next_hard, next_good, next_easy) {
    const item_again = {
      card: next_again,
      log: this.buildLog(Rating.Again)
    };
    const item_hard = {
      card: next_hard,
      log: super.buildLog(Rating.Hard)
    };
    const item_good = {
      card: next_good,
      log: super.buildLog(Rating.Good)
    };
    const item_easy = {
      card: next_easy,
      log: super.buildLog(Rating.Easy)
    };
    this.next.set(Rating.Again, item_again);
    this.next.set(Rating.Hard, item_hard);
    this.next.set(Rating.Good, item_good);
    this.next.set(Rating.Easy, item_easy);
  }
};
var Reschedule = class {
  fsrs;
  /**
   * Creates an instance of the `Reschedule` class.
   * @param fsrs - An instance of the FSRS class used for scheduling.
   */
  constructor(fsrs2) {
    this.fsrs = fsrs2;
  }
  /**
   * Replays a review for a card and determines the next review date based on the given rating.
   * @param card - The card being reviewed.
   * @param reviewed - The date the card was reviewed.
   * @param rating - The grade given to the card during the review.
   * @returns A `RecordLogItem` containing the updated card and review log.
   */
  replay(card, reviewed, rating) {
    return this.fsrs.next(card, reviewed, rating);
  }
  /**
   * Processes a manual review for a card, allowing for custom state, stability, difficulty, and due date.
   * @param card - The card being reviewed.
   * @param state - The state of the card after the review.
   * @param reviewed - The date the card was reviewed.
   * @param elapsed_days - The number of days since the last review.
   * @param stability - (Optional) The stability of the card.
   * @param difficulty - (Optional) The difficulty of the card.
   * @param due - (Optional) The due date for the next review.
   * @returns A `RecordLogItem` containing the updated card and review log.
   * @throws Will throw an error if the state or due date is not provided when required.
   */
  handleManualRating(card, state, reviewed, elapsed_days, stability, difficulty, due) {
    if (typeof state === "undefined") {
      throw new FSRSValidationError(
        "reschedule: state is required for manual rating"
      );
    }
    let log;
    let next_card;
    if (state === State.New) {
      log = {
        rating: Rating.Manual,
        state,
        due: due ?? reviewed,
        stability: card.stability,
        difficulty: card.difficulty,
        elapsed_days,
        last_elapsed_days: card.elapsed_days,
        scheduled_days: card.scheduled_days,
        learning_steps: card.learning_steps,
        review: reviewed
      };
      next_card = createEmptyCard(reviewed);
      next_card.last_review = reviewed;
    } else {
      if (typeof due === "undefined") {
        throw new FSRSValidationError(
          "reschedule: due is required for manual rating"
        );
      }
      const scheduled_days = date_diff(due, reviewed, "days");
      log = {
        rating: Rating.Manual,
        state: card.state,
        due: card.last_review || card.due,
        stability: card.stability,
        difficulty: card.difficulty,
        elapsed_days,
        last_elapsed_days: card.elapsed_days,
        scheduled_days: card.scheduled_days,
        learning_steps: card.learning_steps,
        review: reviewed
      };
      next_card = {
        ...card,
        state,
        due,
        last_review: reviewed,
        stability: stability || card.stability,
        difficulty: difficulty || card.difficulty,
        elapsed_days,
        scheduled_days,
        reps: card.reps + 1
      };
    }
    return { card: next_card, log };
  }
  /**
   * Reschedules a card based on its review history.
   *
   * @param current_card - The card to be rescheduled.
   * @param reviews - An array of review history objects.
   * @returns An array of record log items representing the rescheduling process.
   */
  reschedule(current_card, reviews) {
    const collections2 = [];
    let cur_card = createEmptyCard(current_card.due);
    for (const review of reviews) {
      let item;
      review.review = TypeConvert.time(review.review);
      if (review.rating === Rating.Manual) {
        let interval = 0;
        if (cur_card.state !== State.New && cur_card.last_review) {
          interval = date_diff(review.review, cur_card.last_review, "days");
        }
        item = this.handleManualRating(
          cur_card,
          review.state,
          review.review,
          interval,
          review.stability,
          review.difficulty,
          review.due ? TypeConvert.time(review.due) : void 0
        );
      } else {
        item = this.replay(cur_card, review.review, review.rating);
      }
      collections2.push(item);
      cur_card = item.card;
    }
    return collections2;
  }
  calculateManualRecord(current_card, now, record_log_item, update_memory) {
    if (!record_log_item) {
      return null;
    }
    const { card: reschedule_card, log } = record_log_item;
    const cur_card = TypeConvert.card(current_card);
    if (cur_card.due.getTime() === reschedule_card.due.getTime()) {
      return null;
    }
    cur_card.scheduled_days = date_diff(
      reschedule_card.due,
      cur_card.due,
      "days"
    );
    return this.handleManualRating(
      cur_card,
      reschedule_card.state,
      TypeConvert.time(now),
      log.elapsed_days,
      update_memory ? reschedule_card.stability : void 0,
      update_memory ? reschedule_card.difficulty : void 0,
      reschedule_card.due
    );
  }
};
function applyAfterHandler(value, afterHandler) {
  return typeof afterHandler === "function" ? afterHandler(value) : value;
}
var FSRS = class extends FSRSAlgorithm {
  strategyHandler = /* @__PURE__ */ new Map();
  Scheduler;
  constructor(param) {
    super(param);
    const { enable_short_term } = this.parameters;
    this.Scheduler = enable_short_term ? BasicScheduler : LongTermScheduler;
  }
  params_handler_proxy() {
    const _this = this;
    return {
      set: function(target, prop, value) {
        if (prop === "request_retention" && Number.isFinite(value)) {
          _this.intervalModifier = _this.calculate_interval_modifier(
            Number(value)
          );
        } else if (prop === "enable_short_term") {
          _this.Scheduler = value === true ? BasicScheduler : LongTermScheduler;
        } else if (prop === "w") {
          value = migrateParameters(
            value,
            target.relearning_steps.length,
            target.enable_short_term
          );
          value = clipParameters(
            Array.from(value),
            target.relearning_steps.length,
            target.enable_short_term
          );
          _this.forgetting_curve = forgetting_curve.bind(this, value);
          _this.intervalModifier = _this.calculate_interval_modifier(
            Number(target.request_retention)
          );
        }
        Reflect.set(target, prop, value);
        return true;
      }
    };
  }
  useStrategy(mode, handler) {
    this.strategyHandler.set(mode, handler);
    return this;
  }
  clearStrategy(mode) {
    if (mode) {
      this.strategyHandler.delete(mode);
    } else {
      this.strategyHandler.clear();
    }
    return this;
  }
  getScheduler(card, now) {
    const schedulerStrategy = this.strategyHandler.get(
      StrategyMode.SCHEDULER
    );
    const Scheduler = schedulerStrategy || this.Scheduler;
    const instance = new Scheduler(card, now, this, this.strategyHandler);
    return instance;
  }
  /**
   * Display the collection of cards and logs for the four scenarios after scheduling the card at the current time.
   * @param card Card to be processed
   * @param now Current time or scheduled time
   * @param afterHandler Convert the result to another type. (Optional)
   * @example
   * ```typescript
   * const card: Card = createEmptyCard(new Date());
   * const f = fsrs();
   * const recordLog = f.repeat(card, new Date());
   * ```
   * @example
   * ```typescript
   * interface RevLogUnchecked
   *   extends Omit<ReviewLog, "due" | "review" | "state" | "rating"> {
   *   cid: string;
   *   due: Date | number;
   *   state: StateType;
   *   review: Date | number;
   *   rating: RatingType;
   * }
   *
   * interface RepeatRecordLog {
   *   card: CardUnChecked; //see method: createEmptyCard
   *   log: RevLogUnchecked;
   * }
   *
   * function repeatAfterHandler(recordLog: RecordLog) {
   *     const record: { [key in Grade]: RepeatRecordLog } = {} as {
   *       [key in Grade]: RepeatRecordLog;
   *     };
   *     for (const grade of Grades) {
   *       record[grade] = {
   *         card: {
   *           ...(recordLog[grade].card as Card & { cid: string }),
   *           due: recordLog[grade].card.due.getTime(),
   *           state: State[recordLog[grade].card.state] as StateType,
   *           last_review: recordLog[grade].card.last_review
   *             ? recordLog[grade].card.last_review!.getTime()
   *             : null,
   *         },
   *         log: {
   *           ...recordLog[grade].log,
   *           cid: (recordLog[grade].card as Card & { cid: string }).cid,
   *           due: recordLog[grade].log.due.getTime(),
   *           review: recordLog[grade].log.review.getTime(),
   *           state: State[recordLog[grade].log.state] as StateType,
   *           rating: Rating[recordLog[grade].log.rating] as RatingType,
   *         },
   *       };
   *     }
   *     return record;
   * }
   * const card: Card = createEmptyCard(new Date(), cardAfterHandler); //see method:  createEmptyCard
   * const f = fsrs();
   * const recordLog = f.repeat(card, new Date(), repeatAfterHandler);
   * ```
   */
  repeat(card, now, afterHandler) {
    const instance = this.getScheduler(card, now);
    const recordLog = instance.preview();
    return applyAfterHandler(recordLog, afterHandler);
  }
  /**
   * Display the collection of cards and logs for the card scheduled at the current time, after applying a specific grade rating.
   * @param card Card to be processed
   * @param now Current time or scheduled time
   * @param grade Rating of the review (Again, Hard, Good, Easy)
   * @param afterHandler Convert the result to another type. (Optional)
   * @example
   * ```typescript
   * const card: Card = createEmptyCard(new Date());
   * const f = fsrs();
   * const recordLogItem = f.next(card, new Date(), Rating.Again);
   * ```
   * @example
   * ```typescript
   * interface RevLogUnchecked
   *   extends Omit<ReviewLog, "due" | "review" | "state" | "rating"> {
   *   cid: string;
   *   due: Date | number;
   *   state: StateType;
   *   review: Date | number;
   *   rating: RatingType;
   * }
   *
   * interface NextRecordLog {
   *   card: CardUnChecked; //see method: createEmptyCard
   *   log: RevLogUnchecked;
   * }
   *
  function nextAfterHandler(recordLogItem: RecordLogItem) {
    const recordItem = {
      card: {
        ...(recordLogItem.card as Card & { cid: string }),
        due: recordLogItem.card.due.getTime(),
        state: State[recordLogItem.card.state] as StateType,
        last_review: recordLogItem.card.last_review
          ? recordLogItem.card.last_review!.getTime()
          : null,
      },
      log: {
        ...recordLogItem.log,
        cid: (recordLogItem.card as Card & { cid: string }).cid,
        due: recordLogItem.log.due.getTime(),
        review: recordLogItem.log.review.getTime(),
        state: State[recordLogItem.log.state] as StateType,
        rating: Rating[recordLogItem.log.rating] as RatingType,
      },
    };
    return recordItem
  }
   * const card: Card = createEmptyCard(new Date(), cardAfterHandler); //see method:  createEmptyCard
   * const f = fsrs();
   * const recordLogItem = f.repeat(card, new Date(), Rating.Again, nextAfterHandler);
   * ```
   */
  next(card, now, grade, afterHandler) {
    const instance = this.getScheduler(card, now);
    const g = TypeConvert.rating(grade);
    if (g === Rating.Manual) {
      throw new FSRSValidationError("Cannot review a manual rating");
    }
    const recordLogItem = instance.review(g);
    return applyAfterHandler(recordLogItem, afterHandler);
  }
  /**
   * Get the retrievability of the card
   * @param card  Card to be processed
   * @param now  Current time or scheduled time
   * @param format  default:true , Convert the result to another type. (Optional)
   * @returns  The retrievability of the card,if format is true, the result is a string, otherwise it is a number
   */
  get_retrievability(card, now, format = true) {
    const processedCard = TypeConvert.card(card);
    now = now ? TypeConvert.time(now) : /* @__PURE__ */ new Date();
    const t = processedCard.state !== State.New ? Math.max(date_diff(now, processedCard.last_review, "days"), 0) : 0;
    const r = processedCard.state !== State.New ? this.forgetting_curve(t, +processedCard.stability.toFixed(8)) : 0;
    return format ? `${(r * 100).toFixed(2)}%` : r;
  }
  /**
   *
   * @param card Card to be processed
   * @param log last review log
   * @param afterHandler Convert the result to another type. (Optional)
   * @example
   * ```typescript
   * const now = new Date();
   * const f = fsrs();
   * const emptyCardFormAfterHandler = createEmptyCard(now);
   * const repeatFormAfterHandler = f.repeat(emptyCardFormAfterHandler, now);
   * const { card, log } = repeatFormAfterHandler[Rating.Hard];
   * const rollbackFromAfterHandler = f.rollback(card, log);
   * ```
   *
   * @example
   * ```typescript
   * const now = new Date();
   * const f = fsrs();
   * const emptyCardFormAfterHandler = createEmptyCard(now, cardAfterHandler);  //see method: createEmptyCard
   * const repeatFormAfterHandler = f.repeat(emptyCardFormAfterHandler, now, repeatAfterHandler); //see method: fsrs.repeat()
   * const { card, log } = repeatFormAfterHandler[Rating.Hard];
   * const rollbackFromAfterHandler = f.rollback(card, log, cardAfterHandler);
   * ```
   */
  rollback(card, log, afterHandler) {
    const processedCard = TypeConvert.card(card);
    const processedLog = TypeConvert.review_log(log);
    if (processedLog.rating === Rating.Manual) {
      throw new FSRSValidationError("Cannot rollback a manual rating");
    }
    let last_due;
    let last_review;
    let last_lapses;
    switch (processedLog.state) {
      case State.New:
        last_due = processedLog.due;
        last_review = void 0;
        last_lapses = 0;
        break;
      case State.Learning:
      case State.Relearning:
      case State.Review:
        last_due = processedLog.review;
        last_review = processedLog.due;
        last_lapses = processedCard.lapses - (processedLog.rating === Rating.Again && processedLog.state === State.Review ? 1 : 0);
        break;
    }
    const prevCard = {
      ...processedCard,
      due: last_due,
      stability: processedLog.stability,
      difficulty: processedLog.difficulty,
      elapsed_days: processedLog.last_elapsed_days,
      scheduled_days: processedLog.scheduled_days,
      reps: Math.max(0, processedCard.reps - 1),
      lapses: Math.max(0, last_lapses),
      learning_steps: processedLog.learning_steps,
      state: processedLog.state,
      last_review
    };
    return applyAfterHandler(prevCard, afterHandler);
  }
  /**
   *
   * @param card Card to be processed
   * @param now Current time or scheduled time
   * @param reset_count Should the review count information(reps,lapses) be reset. (Optional)
   * @param afterHandler Convert the result to another type. (Optional)
   * @example
   * ```typescript
   * const now = new Date();
   * const f = fsrs();
   * const emptyCard = createEmptyCard(now);
   * const scheduling_cards = f.repeat(emptyCard, now);
   * const { card, log } = scheduling_cards[Rating.Hard];
   * const forgetCard = f.forget(card, new Date(), true);
   * ```
   *
   * @example
   * ```typescript
   * interface RepeatRecordLog {
   *   card: CardUnChecked; //see method: createEmptyCard
   *   log: RevLogUnchecked; //see method: fsrs.repeat()
   * }
   *
   * function forgetAfterHandler(recordLogItem: RecordLogItem): RepeatRecordLog {
   *     return {
   *       card: {
   *         ...(recordLogItem.card as Card & { cid: string }),
   *         due: recordLogItem.card.due.getTime(),
   *         state: State[recordLogItem.card.state] as StateType,
   *         last_review: recordLogItem.card.last_review
   *           ? recordLogItem.card.last_review!.getTime()
   *           : null,
   *       },
   *       log: {
   *         ...recordLogItem.log,
   *         cid: (recordLogItem.card as Card & { cid: string }).cid,
   *         due: recordLogItem.log.due.getTime(),
   *         review: recordLogItem.log.review.getTime(),
   *         state: State[recordLogItem.log.state] as StateType,
   *         rating: Rating[recordLogItem.log.rating] as RatingType,
   *       },
   *     };
   * }
   * const now = new Date();
   * const f = fsrs();
   * const emptyCardFormAfterHandler = createEmptyCard(now, cardAfterHandler); //see method:  createEmptyCard
   * const repeatFormAfterHandler = f.repeat(emptyCardFormAfterHandler, now, repeatAfterHandler); //see method: fsrs.repeat()
   * const { card } = repeatFormAfterHandler[Rating.Hard];
   * const forgetFromAfterHandler = f.forget(card, date_scheduler(now, 1, true), false, forgetAfterHandler);
   * ```
   */
  forget(card, now, reset_count = false, afterHandler) {
    const processedCard = TypeConvert.card(card);
    now = TypeConvert.time(now);
    const scheduled_days = processedCard.state === State.New ? 0 : date_diff(now, processedCard.due, "days");
    const forget_log = {
      rating: Rating.Manual,
      state: processedCard.state,
      due: processedCard.due,
      stability: processedCard.stability,
      difficulty: processedCard.difficulty,
      elapsed_days: 0,
      last_elapsed_days: processedCard.elapsed_days,
      scheduled_days,
      learning_steps: processedCard.learning_steps,
      review: now
    };
    const forget_card = {
      ...processedCard,
      due: now,
      stability: 0,
      difficulty: 0,
      elapsed_days: 0,
      scheduled_days: 0,
      reps: reset_count ? 0 : processedCard.reps,
      lapses: reset_count ? 0 : processedCard.lapses,
      learning_steps: 0,
      state: State.New,
      last_review: processedCard.last_review
    };
    const recordLogItem = { card: forget_card, log: forget_log };
    return applyAfterHandler(recordLogItem, afterHandler);
  }
  /**
   * Reschedules the current card and returns the rescheduled collections and reschedule item.
   *
   * @template T - The type of the record log item.
   * @param {CardInput | Card} current_card - The current card to be rescheduled.
   * @param {Array<FSRSHistory>} reviews - The array of FSRSHistory objects representing the reviews.
   * @param {Partial<RescheduleOptions<T>>} options - The optional reschedule options.
   * @returns {IReschedule<T>} - The rescheduled collections and reschedule item.
   *
   * @example
   * ```typescript
   * const f = fsrs()
   * const grades: Grade[] = [Rating.Good, Rating.Good, Rating.Good, Rating.Good]
   * const reviews_at = [
   *   new Date(2024, 8, 13),
   *   new Date(2024, 8, 13),
   *   new Date(2024, 8, 17),
   *   new Date(2024, 8, 28),
   * ]
   *
   * const reviews: FSRSHistory[] = []
   * for (let i = 0; i < grades.length; i++) {
   *   reviews.push({
   *     rating: grades[i],
   *     review: reviews_at[i],
   *   })
   * }
   *
   * const results_short = scheduler.reschedule(
   *   createEmptyCard(),
   *   reviews,
   *   {
   *     skipManual: false,
   *   }
   * )
   * console.log(results_short)
   * ```
   */
  reschedule(current_card, reviews = [], options = {}) {
    const {
      recordLogHandler,
      reviewsOrderBy,
      skipManual = true,
      now = /* @__PURE__ */ new Date(),
      update_memory_state: updateMemoryState = false
    } = options;
    if (reviewsOrderBy && typeof reviewsOrderBy === "function") {
      reviews.sort(reviewsOrderBy);
    }
    if (skipManual) {
      reviews = reviews.filter((review) => review.rating !== Rating.Manual);
    }
    const rescheduleSvc = new Reschedule(this);
    const collections2 = rescheduleSvc.reschedule(
      options.first_card || createEmptyCard(),
      reviews
    );
    const len = collections2.length;
    const cur_card = TypeConvert.card(current_card);
    const manual_item = rescheduleSvc.calculateManualRecord(
      cur_card,
      now,
      len ? collections2[len - 1] : void 0,
      updateMemoryState
    );
    return {
      collections: typeof recordLogHandler === "function" ? collections2.map(recordLogHandler) : collections2,
      reschedule_item: manual_item ? applyAfterHandler(manual_item, recordLogHandler) : null
    };
  }
};
var fsrs = (params) => {
  return new FSRS(params || {});
};

// src/domain/recall-cloze.ts
function parse(source) {
  if (typeof source !== "string" || source.length > 1e5) throw new DomainError("INVALID_CLOZE", "\uBE48\uCE78 \uBB38\uC7A5\uC744 \uD655\uC778\uD574 \uC8FC\uC138\uC694.");
  let pos = 0;
  const read = (nested, depth) => {
    if (depth > 8) throw new DomainError("INVALID_CLOZE", "\uACB9\uCE5C \uBE48\uCE78\uC740 \uC5EC\uB35F \uB2E8\uACC4\uAE4C\uC9C0 \uC0AC\uC6A9\uD560 \uC218 \uC788\uC2B5\uB2C8\uB2E4.");
    const parts = [];
    let text4 = "";
    while (pos < source.length) {
      if (nested && source.startsWith("}}", pos)) break;
      const match = source.startsWith("{{c", pos) && source.slice(pos).match(/^\{\{c(\d+(?:,\d+)*)::/);
      if (match) {
        if (text4) {
          parts.push(text4);
          text4 = "";
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
        text4 += source[pos++];
      }
    }
    if (text4) parts.push(text4);
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
function renderCloze(source, number, revealed = false) {
  const render = (parts) => parts.map((p) => typeof p === "string" ? p : !revealed && p.numbers.includes(number) ? `[${p.hint || "\u2026"}]` : render(p.body)).join("");
  return render(parse(source));
}

// src/domain/recall-scheduler.ts
var DEFAULT_RECALL_OPTIONS = { retention: 0.9, newPerDay: 20, learningMinutes: [1, 10], relearningMinutes: [10], maximumDays: 36500 };
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
function recallPreference(data, deckId) {
  return data.recallPreferences?.find((row) => !row.deletedAt && (deckId ? row.id === deckId && row.deckName !== void 0 : row.deckName === void 0));
}
function recallOptions(data, deckId) {
  return recallPreference(data, deckId)?.options ?? recallPreference(data)?.options ?? DEFAULT_RECALL_OPTIONS;
}
function serializeMemory(card) {
  return { ...card, due: card.due.toISOString(), ...card.last_review ? { last_review: card.last_review.toISOString() } : {} };
}
function newRecallMemory(at) {
  return serializeMemory(createEmptyCard(at));
}
function recallPreview(memory, at, options, reviews = []) {
  validateRecallOptions(options);
  const scheduler = fsrs({
    request_retention: options.retention,
    maximum_interval: options.maximumDays,
    ...options.parameters ? { w: options.parameters } : {},
    learning_steps: options.learningMinutes.map((v) => `${v}m`),
    relearning_steps: options.relearningMinutes.map((v) => `${v}m`),
    enable_fuzz: false
  });
  let current = memory ?? newRecallMemory(at);
  if (options.parameters && reviews.length) {
    let replayed = createEmptyCard(reviews[0].at);
    for (const review of reviews) replayed = scheduler.next(replayed, review.at, review.rating).card;
    current = { ...current, stability: replayed.stability, difficulty: replayed.difficulty };
  }
  return scheduler.repeat(current, at);
}

// src/domain/learning-schedule.ts
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
function boardContent(row) {
  return { title: row.title, columns: row.columns, cards: row.cards };
}
function validateBoard(value) {
  const row = value;
  const fail4 = () => {
    throw new DomainError(
      "INVALID_BOARD",
      "\uBCF4\uB4DC\uC758 \uC5F4\uACFC \uCE74\uB4DC\uB97C \uD655\uC778\uD574 \uC8FC\uC138\uC694. \uC791\uC131\uD55C \uAE00\uC740 \uC720\uC9C0\uD588\uC2B5\uB2C8\uB2E4."
    );
  };
  const id = (v) => typeof v === "string" && Boolean(v.trim()) && v.length <= 256;
  const title2 = (v) => typeof v === "string" && Boolean(v.trim()) && v.length <= 1e3;
  if (!row || !title2(row.title) || !Array.isArray(row.columns) || row.columns.length < 1 || row.columns.length > 100 || !Array.isArray(row.cards) || row.cards.length > 1e4)
    return fail4();
  const columns = /* @__PURE__ */ new Set(), cards = /* @__PURE__ */ new Set();
  for (const col of row.columns) {
    if (!col || !id(col.id) || columns.has(col.id) || !title2(col.title)) return fail4();
    columns.add(col.id);
  }
  for (const card of row.cards) {
    if (!card || !id(card.id) || cards.has(card.id) || !columns.has(card.columnId) || !title2(card.title) || typeof card.body !== "string" || card.body.length > 2e5 || card.topicId !== null && !id(card.topicId) || typeof card.archived !== "boolean")
      return fail4();
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
var WRITTEN_REVIEW_ITEM_ID = "Cself1";

// src/domain/criteria.ts
function defaultCriteriaItems() {
  return TRACE_ITEMS.map((item) => ({ id: item.id, group: item.group, label: item.label, version: 1, mode: item.mode }));
}
function validateTraceDefinition(value, expectedId = value?.id) {
  if (!value || typeof value !== "object" || typeof value.id !== "string" || !/^[TRACE][A-Za-z0-9_-]*$/.test(value.id) || value.id.length > 256 || value.id !== expectedId || !["T", "R", "A", "C", "E"].includes(value.group) || typeof value.label !== "string" || !value.label.trim() || !Number.isSafeInteger(value.version) || value.version < 1 || !["required", "optional", "excluded"].includes(value.mode)) {
    throw new DomainError("INVALID_TRACE_DEFINITION", "\uD65C\uB3D9\uC758 \uC6D0\uB798 \uD56D\uBAA9\uACFC \uC815\uC758\uB97C \uD655\uC778\uD574 \uC8FC\uC138\uC694.");
  }
}
function criteriaRevisionToken(state) {
  return JSON.stringify([
    state.subjects.map((row) => [row.id, row.version, row.deletedAt]),
    state.nodes.map((row) => [row.id, row.subjectId, row.version, row.deletedAt]),
    (state.criteria ?? []).map((row) => [row.id, row.version, row.deletedAt]),
    (state.criteriaAssignments ?? []).map((row) => [row.id, row.version, row.deletedAt])
  ]);
}
function criteriaScopeTargets(state, targetId, scope) {
  const subjectId = state.nodes.find((node) => node.id === targetId)?.subjectId;
  if (!subjectId) throw new DomainError("NOT_FOUND", "\uAE30\uC900\uC744 \uC870\uC815\uD560 \uBAA9\uCC28 \uD56D\uBAA9\uC744 \uCC3E\uC744 \uC218 \uC5C6\uC2B5\uB2C8\uB2E4.");
  if (scope === "topic") return [{ scope: "topic", ownerId: targetId }];
  if (scope !== "subject" && scope !== "all") throw new DomainError("INVALID_CRITERIA_SCOPE", "\uAE30\uC900\uC758 \uC801\uC6A9 \uBC94\uC704\uB97C \uD655\uC778\uD574 \uC8FC\uC138\uC694.");
  const subjects = state.subjects.filter((subject) => scope === "all" || subject.id === subjectId);
  const nodes = state.nodes.filter((node) => scope === "all" || node.subjectId === subjectId);
  return [
    ...scope === "all" ? [{ scope: "global", ownerId: null }] : [],
    ...subjects.map((subject) => ({ scope: "subject", ownerId: subject.id })),
    ...nodes.map((node) => ({ scope: "topic", ownerId: node.id }))
  ];
}

// src/domain/outline.ts
var MAX_OUTLINE_ROWS = 500;
var MAX_OUTLINE_NAME = 180;
function outlineRevisionToken(state, subjectId, parentId) {
  const subject = state.subjects.find((row) => row.id === subjectId);
  return JSON.stringify([
    state.userId,
    state.namespace,
    subjectId,
    parentId,
    subject ? [subject.version, subject.deletedAt, subject.scope] : null,
    state.nodes.filter((row) => row.subjectId === subjectId).map((row) => [row.id, row.parentId, row.order, row.name, row.version, row.deletedAt]).sort((a, b) => String(a[0]).localeCompare(String(b[0])))
  ]);
}
function previewOutlineEntries(names) {
  const entries = [], issues = [];
  if (!Array.isArray(names) || names.length > MAX_OUTLINE_ROWS) {
    return { entries, issues: [{ line: 0, message: `\uD55C \uBC88\uC5D0 ${MAX_OUTLINE_ROWS}\uD589\uAE4C\uC9C0 \uCD94\uAC00\uD560 \uC218 \uC788\uC2B5\uB2C8\uB2E4.` }] };
  }
  const seen = /* @__PURE__ */ new Set();
  names.forEach((raw, index) => {
    const line = index + 1;
    if (typeof raw !== "string") {
      issues.push({ line, message: "\uC774\uB984\uC744 \uAE00\uB85C \uC785\uB825\uD574 \uC8FC\uC138\uC694." });
      return;
    }
    const name = raw.trim();
    if (!name) return;
    if (/[\r\n\t]/.test(raw)) {
      issues.push({ line, message: "\uD56D\uBAA9\uB9C8\uB2E4 \uBCC4\uB3C4 \uC785\uB825\uCE78\uC744 \uC0AC\uC6A9\uD574 \uC8FC\uC138\uC694." });
      return;
    }
    if (name.length > MAX_OUTLINE_NAME) {
      issues.push({ line, message: `\uC774\uB984\uC740 ${MAX_OUTLINE_NAME}\uC790 \uC774\uB0B4\uB85C \uC785\uB825\uD574 \uC8FC\uC138\uC694.` });
      return;
    }
    if (!seen.has(name)) {
      seen.add(name);
      entries.push({ line, name });
    }
  });
  return { entries, issues };
}
function outlineTableToken(state) {
  return JSON.stringify([
    state.userId,
    state.namespace,
    state.semesters.map((row) => [row.id, row.version, row.deletedAt]),
    state.subjects.map((row) => [row.id, row.name, row.scope, row.order, row.version, row.deletedAt]),
    state.nodes.map((row) => [row.id, row.subjectId, row.parentId, row.role, row.name, row.order, row.version, row.deletedAt])
  ]);
}
var sameOutlineScope = (left, right) => left.kind === right.kind && (left.kind !== "semester" || right.kind === "semester" && left.semesterId === right.semesterId);
function previewOutlineTable(state, input) {
  const fail4 = (message) => {
    throw new DomainError("INVALID_OUTLINE_TABLE", message);
  };
  if (!input || !input.scope || !["semester", "independent", "unassigned"].includes(input.scope.kind)) fail4("\uB4F1\uB85D\uD560 \uD559\uAE30\uB97C \uD655\uC778\uD574 \uC8FC\uC138\uC694.");
  if (input.scope.kind === "semester" && !state.semesters.some((row) => row.id === input.scope.semesterId && !row.deletedAt)) fail4("\uB4F1\uB85D\uD560 \uD559\uAE30\uB97C \uCC3E\uC744 \uC218 \uC5C6\uC2B5\uB2C8\uB2E4.");
  if (!Array.isArray(input.courses) || input.courses.length > MAX_OUTLINE_ROWS || !input.choices || typeof input.choices !== "object" || Array.isArray(input.choices)) fail4("\uC785\uB825 \uD45C\uC758 \uD615\uC2DD\uC744 \uD655\uC778\uD574 \uC8FC\uC138\uC694.");
  const keys = /* @__PURE__ */ new Set(), entries = [], paths = /* @__PURE__ */ new Map();
  let rows = 0;
  const cell = (value) => {
    if (!value || typeof value.key !== "string" || !value.key || keys.has(value.key) || typeof value.name !== "string") fail4("\uC785\uB825\uCE78\uC758 \uC2DD\uBCC4\uC790\uC640 \uC6D0\uBB38\uC744 \uD655\uC778\uD574 \uC8FC\uC138\uC694.");
    keys.add(value.key);
    const name = value.name.trim();
    if (name.length > MAX_OUTLINE_NAME || /[\r\n\t]/.test(value.name)) fail4("\uC774\uB984\uC740 \uC904\uBC14\uAFC8 \uC5C6\uC774 180\uC790 \uC774\uB0B4\uB85C \uAC1C\uBCC4 \uCE78\uC5D0 \uC801\uC5B4 \uC8FC\uC138\uC694.");
    return name;
  };
  const append = (path, kind) => {
    const key = JSON.stringify(path);
    if (paths.has(key)) return;
    const parentKey = path.length > 1 ? JSON.stringify(path.slice(0, -1)) : null;
    const parent = parentKey ? paths.get(parentKey) : null;
    const subjectKey = JSON.stringify(path.slice(0, 1)), subject = paths.get(subjectKey);
    const candidates = (kind === "subject" ? state.subjects.filter((row) => !row.deletedAt && row.name === path[0] && sameOutlineScope(row.scope, input.scope)) : parent?.status === "reuse" ? state.nodes.filter((row) => !row.deletedAt && row.subjectId === (kind === "unit" ? parent.id : subject?.id) && row.parentId === (kind === "unit" ? null : parent.id) && row.role === kind && row.name === path.at(-1)) : []).sort((a, b) => a.order - b.order);
    const choice = Object.hasOwn(input.choices, key) ? input.choices[key] : void 0;
    let status = "new", id = null;
    if (parent && ["choose", "blocked"].includes(parent.status)) status = "blocked";
    else if (candidates.length) {
      if (choice === "new") status = "new";
      else if (candidates.some((row) => row.id === choice)) {
        status = "reuse";
        id = choice;
      } else status = "choose";
    } else if (choice && choice !== "new") fail4("\uC5F0\uACB0\uD558\uB824\uB358 \uAE30\uC874 \uD56D\uBAA9\uC774 \uBC14\uB00C\uC5C8\uC2B5\uB2C8\uB2E4. \uAC19\uC740 \uC774\uB984\uC758 \uD56D\uBAA9\uC744 \uB2E4\uC2DC \uD655\uC778\uD574 \uC8FC\uC138\uC694.");
    const entry = { key, parentKey, subjectKey, name: path.at(-1), path, kind, status, id, candidates: candidates.map((row) => ({ id: row.id, name: row.name })) };
    paths.set(key, entry);
    entries.push(entry);
  };
  for (const course of input.courses) {
    const courseName = cell(course);
    if (!Array.isArray(course.units)) fail4("\uB2E8\uC6D0 \uC785\uB825\uCE78\uC744 \uD655\uC778\uD574 \uC8FC\uC138\uC694.");
    if (courseName) append([courseName], "subject");
    for (const unit of course.units) {
      if (++rows > MAX_OUTLINE_ROWS) fail4("\uB2E8\uC6D0\uACFC \uC8FC\uC81C \uC785\uB825\uC740 \uD569\uACC4 500\uD589\uAE4C\uC9C0 \uC0AC\uC6A9\uD560 \uC218 \uC788\uC2B5\uB2C8\uB2E4.");
      const unitName = cell(unit);
      if (!Array.isArray(unit.topics)) fail4("\uC8FC\uC81C \uC785\uB825\uCE78\uC744 \uD655\uC778\uD574 \uC8FC\uC138\uC694.");
      if (unitName && !courseName) fail4("\uB2E8\uC6D0\uC744 \uB2F4\uC744 \uACFC\uBAA9\uBA85\uC744 \uC801\uC5B4 \uC8FC\uC138\uC694.");
      if (unitName) append([courseName, unitName], "unit");
      for (const topic of unit.topics) {
        if (++rows > MAX_OUTLINE_ROWS) fail4("\uB2E8\uC6D0\uACFC \uC8FC\uC81C \uC785\uB825\uC740 \uD569\uACC4 500\uD589\uAE4C\uC9C0 \uC0AC\uC6A9\uD560 \uC218 \uC788\uC2B5\uB2C8\uB2E4.");
        const topicName = cell(topic);
        if (topicName && (!courseName || !unitName)) fail4("\uC8FC\uC81C\uB97C \uB2F4\uC744 \uACFC\uBAA9\uBA85\uACFC \uB2E8\uC6D0\uBA85\uC744 \uC801\uC5B4 \uC8FC\uC138\uC694.");
        if (topicName) append([courseName, unitName, topicName], "topic");
      }
    }
  }
  return { entries, ready: entries.length > 0 && entries.every((row) => ["new", "reuse"].includes(row.status)), newCount: entries.filter((row) => row.status === "new").length, reuseCount: entries.filter((row) => row.status === "reuse").length, expectedToken: outlineTableToken(state) };
}

// src/domain/topic-memory.ts
var text2 = (v, max, required = true) => typeof v === "string" && v.length <= max && (!required || !!v.trim());
function invalid2() {
  throw new DomainError(
    "INVALID_TOPIC_GENERATION",
    "\uC8FC\uC81C \uAE30\uBC18 \uC0DD\uC131\uC758 \uBC94\uC704\uC640 \uC9C8\uBB38\xB7\uB2F5\uC548\uC744 \uD655\uC778\uD574 \uC8FC\uC138\uC694."
  );
}
function validateTopicMemoryInput(value) {
  const v = value;
  if (!v || !text2(v.subject?.id, 256) || !text2(v.subject.name, 500) || !Number.isSafeInteger(v.subject.version) || v.subject.version < 1 || !Number.isSafeInteger(v.count) || v.count < 1 || v.count > 30 || !text2(v.guidance, 2e3, false) || !Array.isArray(v.topics) || !v.topics.length || v.topics.length > 20)
    invalid2();
  const ids = /* @__PURE__ */ new Set();
  for (const t of v.topics) {
    if (!text2(t?.id, 256) || ids.has(t.id) || !Array.isArray(t.path) || !t.path.length || t.path.length > 20 || t.path.at(-1)?.id !== t.id)
      invalid2();
    ids.add(t.id);
    const pathIds = /* @__PURE__ */ new Set();
    for (const n of t.path) {
      if (!text2(n?.id, 256) || !text2(n.name, 500) || !Number.isSafeInteger(n.version) || n.version < 1 || pathIds.has(n.id))
        invalid2();
      pathIds.add(n.id);
    }
  }
  if (JSON.stringify(v).length > 32e3) invalid2();
}
function validateTopicGenerationSource(value) {
  const s = value;
  if (s?.evidenceType !== void 0 && s.evidenceType !== "topic-general") invalid2();
  if (s?.promptVersion !== void 0 && !text2(s.promptVersion, 160)) invalid2();
  if (s?.kind !== "topic" || s.reviewed !== true || !text2(s.resultId, 256) || !text2(s.cardId, 256) || !text2(s.model, 160) || !text2(s.at, 40) || !Number.isFinite(Date.parse(s.at)) || !text2(s.originalQuestion, 4e3) || !text2(s.originalAnswer, 1e4))
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

// src/domain/study-ai-request.ts
var CURRENT_STUDY_AI_TASKS = {
  "study-pack": { label: "복습 자료 한 번에", instruction: "선택한 자료로 요약·카드·퀴즈·개념도를 함께 만든다." },
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
  if (row.externalization !== void 0 && !["auto", "full", "off"].includes(row.externalization)) throw new DomainError("INVALID_AI_REQUEST", "사고 보조 장치 선택을 확인해 주세요.");
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

// src/domain/material-learning.ts
var fail2 = () => {
  throw new DomainError("INVALID_MATERIAL", "\uD034\uC988\xB7\uAC1C\uB150\uB3C4\uC758 \uD615\uC2DD\uACFC \uC6D0\uBB38 \uADFC\uAC70\uB97C \uD655\uC778\uD574 \uC8FC\uC138\uC694.");
};
function validateQuiz(value, sourceIds) {
  if (!Array.isArray(value) || value.length > 30) fail2();
  const seen = /* @__PURE__ */ new Set();
  for (const q of value) {
    if (!q || typeof q.id !== "string" || !q.id || q.id.length > 256 || seen.has(q.id) || typeof q.question !== "string" || !q.question.trim() || q.question.length > 4e3 || !Array.isArray(q.options) || q.options.length < 2 || q.options.length > 6 || q.options.some((a) => typeof a !== "string" || !a.trim() || a.length > 4e3) || new Set(q.options).size !== q.options.length || !Number.isInteger(q.correctIndex) || q.correctIndex < 0 || q.correctIndex >= q.options.length || typeof q.explanation !== "string" || !q.explanation.trim() || q.explanation.length > 1e4 || !Array.isArray(q.sourceIds) || !q.sourceIds.length || q.sourceIds.length > 50 || q.sourceIds.some((id) => typeof id !== "string" || sourceIds && !sourceIds.has(id))) fail2();
    seen.add(q.id);
  }
}
function validateMap(value, sourceIds) {
  const map = value;
  if (!map || !Array.isArray(map.nodes) || !map.nodes.length || map.nodes.length > 40 || !Array.isArray(map.edges) || map.edges.length > 80) fail2();
  const ids = /* @__PURE__ */ new Set(), edges = /* @__PURE__ */ new Set();
  const refs = (v) => Array.isArray(v) && v.length > 0 && v.length <= 50 && v.every((id) => sourceIds.has(id));
  for (const n of map.nodes) {
    if (typeof n.id !== "string" || !n.id || n.id.length > 100 || ids.has(n.id) || typeof n.label !== "string" || !n.label.trim() || n.label.length > 1e3 || !refs(n.sourceIds)) fail2();
    ids.add(n.id);
  }
  for (const e of map.edges) {
    if (typeof e.id !== "string" || !e.id || e.id.length > 100 || ids.has(e.id) || edges.has(e.id) || !ids.has(e.from) || !ids.has(e.to) || e.from === e.to || typeof e.label !== "string" || !e.label.trim() || e.label.length > 300 || !refs(e.sourceIds)) fail2();
    edges.add(e.id);
  }
  for (const [id, p] of Object.entries(map.positions ?? {})) if (!ids.has(id) || !p || !Number.isFinite(p.x) || !Number.isFinite(p.y) || Math.abs(p.x) > 1e6 || Math.abs(p.y) > 1e6) fail2();
}
function validateQuizAttempts(attempts) {
  if (!Array.isArray(attempts) || attempts.length > 100) fail2();
  const ids = /* @__PURE__ */ new Set();
  for (const a of attempts) {
    if (!a || typeof a.id !== "string" || !a.id || ids.has(a.id) || a.id.length > 256 || typeof a.resultId !== "string" || !a.answers || typeof a.answers !== "object" || Array.isArray(a.answers) || !Number.isFinite(Date.parse(a.at)) || !(a.submittedAt === null || Number.isFinite(Date.parse(a.submittedAt)))) fail2();
    ids.add(a.id);
    validateQuiz(a.questions);
    if (a.helpedQuestionIds !== void 0 && (!Array.isArray(a.helpedQuestionIds) || a.helpedQuestionIds.some((id) => !a.questions.some((q) => q.id === id)))) fail2();
    for (const [id, answer] of Object.entries(a.answers)) {
      const q = a.questions.find((q2) => q2.id === id);
      if (!q || !Number.isInteger(answer) || answer < 0 || answer >= q.options.length) fail2();
    }
  }
}

// src/domain/study-material.ts
var MAX_AUDIO_BYTES = 50 * 1024 * 1024;
var MAX_SOURCE_TEXT = 15e4;
var invalid3 = (message) => {
  throw new DomainError("INVALID_MATERIAL", message);
};
var text3 = (value, max) => typeof value === "string" && value.length <= max;
function validateMaterialResult(value) {
  const result = value;
  if (result?.promptVersion !== void 0 && (!text3(result.promptVersion, 160) || !result.promptVersion.trim()))
    invalid3("\uC0DD\uC131 \uB2F9\uC2DC GPT \uC9C0\uCE68 \uBC84\uC804\uC744 \uD655\uC778\uD574 \uC8FC\uC138\uC694.");
  if (result?.request !== void 0) validateStudyAIRequest(result.request);
  if (result?.source?.documents !== void 0) validateDocuments(result.source.documents);
  if (!result || !text3(result.id, 256) || !result.id || !text3(result.model, 160) || !Number.isFinite(Date.parse(result.at)) || !Array.isArray(result.segments) || !result.segments.length || result.segments.length > 6e3 || !Array.isArray(result.summary) || result.summary.length > 100 || !Array.isArray(result.cards) || result.cards.length > 100)
    invalid3("AI \uACB0\uACFC\uC758 \uD615\uC2DD\uC744 \uD655\uC778\uD558\uC9C0 \uBABB\uD588\uC2B5\uB2C8\uB2E4. \uC6D0\uBCF8\uC740 \uBCF4\uC874\uD588\uC2B5\uB2C8\uB2E4.");
  const ids = /* @__PURE__ */ new Set();
  for (const segment of result.segments) {
    if (!text3(segment.id, 256) || !segment.id || ids.has(segment.id) || !text3(segment.text, MAX_SOURCE_TEXT) || !segment.text.trim())
      invalid3("\uBC1B\uC544\uC4F4 \uBB38\uC7A5\uACFC \uC2DD\uBCC4\uC790\uB97C \uD655\uC778\uD574 \uC8FC\uC138\uC694.");
    if (segment.label !== void 0 && !text3(segment.label, 1e3))
      invalid3("\uC6D0\uBB38 \uC704\uCE58\uB97C \uD655\uC778\uD574 \uC8FC\uC138\uC694.");
    if (!(segment.start === null && segment.end === null) && !(typeof segment.start === "number" && Number.isFinite(segment.start) && segment.start >= 0 && typeof segment.end === "number" && Number.isFinite(segment.end) && segment.end >= segment.start))
      invalid3("\uC74C\uC131 \uAD6C\uAC04\uC758 \uC2DC\uAC04\uC744 \uD655\uC778\uD574 \uC8FC\uC138\uC694.");
    if (segment.role !== void 0 && !["material", "problem", "attempt", "reference", "focus"].includes(segment.role)) invalid3("\uC790\uB8CC \uC5ED\uD560\uC744 \uD655\uC778\uD574 \uC8FC\uC138\uC694.");
    ids.add(segment.id);
  }
  if (result.segments.reduce((sum, row) => sum + row.text.length, 0) > MAX_SOURCE_TEXT)
    invalid3("\uBC1B\uC544\uC4F4 \uB0B4\uC6A9\uC774 \uD55C \uBC88\uC5D0 \uCC98\uB9AC\uD560 \uC218 \uC788\uB294 \uBC94\uC704\uB97C \uB118\uC5C8\uC2B5\uB2C8\uB2E4.");
  const references = (sources) => Array.isArray(sources) && sources.length > 0 && sources.length <= 50 && sources.every((id) => typeof id === "string" && ids.has(id));
  for (const row of result.summary)
    if (!text3(row.text, 1e4) || !row.text.trim() || !references(row.sourceIds) || row.originalText !== void 0 && !text3(row.originalText, 1e4))
      invalid3("\uC694\uC57D\uC758 \uC6D0\uBB38 \uADFC\uAC70\uB97C \uD655\uC778\uD558\uC9C0 \uBABB\uD588\uC2B5\uB2C8\uB2E4.");
  if (result.diagnostics !== void 0) {
    if (!Array.isArray(result.diagnostics) || result.diagnostics.length > 10) invalid3("\uD655\uC778\uD560 \uB0B4\uC6A9\uC758 \uD615\uC2DD\uC744 \uD655\uC778\uD574 \uC8FC\uC138\uC694.");
    for (const d of result.diagnostics) {
      if (!d || !["needs-input", "insufficient-evidence", "partial"].includes(d.kind) || !text3(d.message, 4e3) || !d.message.trim() || d.questions !== void 0 && (!Array.isArray(d.questions) || d.questions.length > 2 || d.questions.some((q) => !text3(q, 1e3) || !q.trim())) || d.sourceIds !== void 0 && (!Array.isArray(d.sourceIds) || d.sourceIds.length > 50 || d.sourceIds.some((id) => !ids.has(id)))) invalid3("\uD655\uC778\uD560 \uB0B4\uC6A9\uC758 \uD615\uC2DD\uC744 \uD655\uC778\uD574 \uC8FC\uC138\uC694.");
    }
  }
  if (result.range !== void 0 && (!Number.isSafeInteger(result.range.index) || !Number.isSafeInteger(result.range.count) || result.range.index < 0 || result.range.count < 1 || result.range.index >= result.range.count || !text3(result.range.sourceIdentity, 160) || !result.range.sourceIdentity || !Number.isSafeInteger(result.range.totalSegments) || result.range.totalSegments < 0 || !Array.isArray(result.range.sourceIds) || !result.range.sourceIds.length || result.range.sourceIds.length > 6e3 || result.range.sourceIds.some((id) => !ids.has(id)))) invalid3("\uCC98\uB9AC \uBC94\uC704\uC640 \uC6D0\uBB38 \uC704\uCE58\uB97C \uD655\uC778\uD574 \uC8FC\uC138\uC694.");
  if (result.range?.overlapIds !== void 0 && (!Array.isArray(result.range.overlapIds) || result.range.overlapIds.some((id) => !result.range.sourceIds.includes(id)))) invalid3("\uACB9\uCE58\uB294 \uC6D0\uBB38 \uAD6C\uAC04\uC744 \uD655\uC778\uD574 \uC8FC\uC138\uC694.");
  if (result.contractVersion !== void 0 && result.contractVersion !== MATERIAL_CONTRACT_VERSION) invalid3("\uACB0\uACFC \uACC4\uC57D \uBC84\uC804\uC744 \uD655\uC778\uD574 \uC8FC\uC138\uC694.");
  if (result.status !== void 0 && !["complete", "needs-input", "insufficient-evidence", "partial"].includes(result.status)) invalid3("생성 처리 상태를 확인해 주세요.");
  const cards = /* @__PURE__ */ new Set();
  for (const card of result.cards) {
    if (!text3(card.id, 256) || !card.id || cards.has(card.id) || !text3(card.question, 4e3) || !card.question.trim() || !text3(card.answer, 1e4) || !card.answer.trim() || !references(card.sourceIds) || typeof card.excluded !== "boolean")
      invalid3("\uCE74\uB4DC\uC758 \uC9C8\uBB38\xB7\uB2F5\xB7\uC6D0\uBB38 \uADFC\uAC70\uB97C \uD655\uC778\uD574 \uC8FC\uC138\uC694.");
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
      if (item.evidenceType !== void 0 && !["material-grounded", "general-supplement"].includes(item.evidenceType)) invalid3("\uC790\uB8CC \uADFC\uAC70\uC640 \uBCF4\uCDA9 \uC124\uBA85\uC744 \uAD6C\uBCC4\uD574 \uC8FC\uC138\uC694.");
      if (!validBasis(item.sourceIds)) invalid3("\uC9C8\uBB38\xB7\uCD08\uC810\uC774\uB098 \uC0AC\uC6A9\uC790 \uC2DC\uB3C4\uB9CC\uC73C\uB85C \uB2F5\uC758 \uC6D0\uBB38 \uADFC\uAC70\uB97C \uC0BC\uC744 \uC218 \uC5C6\uC2B5\uB2C8\uB2E4.");
      if (["tutor", "source-qa", "questions", "quiz", "study-pack"].includes(task) && item.evidenceType === "general-supplement") invalid3("\uC774 \uC791\uC5C5\uC740 \uC77C\uBC18 \uC9C0\uC2DD \uBCF4\uCDA9\uC73C\uB85C \uC790\uB8CC\uC758 \uB2F5\uC744 \uB300\uCCB4\uD560 \uC218 \uC5C6\uC2B5\uB2C8\uB2E4.");
      if ("answer" in item && item.evidenceType === "general-supplement") invalid3("\uC790\uB8CC \uAE30\uBC18 \uBB38\uD56D\uC740 \uC81C\uACF5\uB41C \uC6D0\uBB38\uC73C\uB85C \uB2F5\uD560 \uC218 \uC788\uC5B4\uC57C \uD569\uB2C8\uB2E4.");
    }
    for (const q of result.quiz ?? []) if (!validBasis(q.sourceIds)) invalid3("\uD034\uC988\uC758 \uC790\uB8CC \uADFC\uAC70\uB97C \uD655\uC778\uD574 \uC8FC\uC138\uC694.");
    for (const n of [...result.map?.nodes ?? [], ...result.map?.edges ?? []]) if (!validBasis(n.sourceIds)) invalid3("\uAC1C\uB150\uB3C4\uC758 \uC790\uB8CC \uADFC\uAC70\uB97C \uD655\uC778\uD574 \uC8FC\uC138\uC694.");
  }
}
function validateMaterialContent(value) {
  const row = value;
  if (row?.originalStorage !== void 0 && !["device", "private-server"].includes(row.originalStorage)) invalid3("\uC6D0\uBCF8 \uBCF4\uAD00 \uC704\uCE58\uB97C \uD655\uC778\uD574 \uC8FC\uC138\uC694.");
  if (row?.generationProgress !== void 0) {
    const p = row.generationProgress;
    if (!text3(p.sourceIdentity, 160) || !Number.isSafeInteger(p.index) || p.index < 0 || !Array.isArray(p.completed) || p.completed.length > 30 || p.completed.some((c) => !Number.isSafeInteger(c.index) || c.index < 0 || !text3(c.resultId, 256) || !c.resultId)) invalid3("\uC774\uC5B4\uAC08 \uBC94\uC704\uB97C \uD655\uC778\uD574 \uC8FC\uC138\uC694.");
  }
  if (row?.learningView !== void 0) {
    const v = row.learningView;
    if (!v || !["summary", "transcript", "cards", "quiz", "map"].includes(v.tab) || !Array.isArray(v.revealed) || !Array.isArray(v.helped) || v.revealed.length > 3e3 || v.helped.length > 30 || [...v.revealed, ...v.helped].some((id) => !text3(id, 520)) || v.resultId !== void 0 && !text3(v.resultId, 256) || v.cardId !== void 0 && !text3(v.cardId, 256) || v.quizAttemptId !== void 0 && !text3(v.quizAttemptId, 256) || v.activeDisclosure !== void 0 && !["hidden", "revealed"].includes(v.activeDisclosure)) invalid3("\uD559\uC2B5 \uD654\uBA74\uC758 \uC704\uCE58\uC640 \uACF5\uAC1C \uC774\uB825\uC744 \uD655\uC778\uD574 \uC8FC\uC138\uC694.");
  }
  if (row?.aiRequest !== void 0) validateStudyAIRequest(row.aiRequest, false);
  if (row?.documents !== void 0) validateDocuments(row.documents);
  if (row?.quizAttempts !== void 0) validateQuizAttempts(row.quizAttempts);
  if (row?.tutorDraft !== void 0 && !text3(row.tutorDraft, 1e4))
    invalid3("\uC9C8\uBB38\uC744 1\uB9CC \uC790 \uC774\uB0B4\uB85C \uB123\uC5B4 \uC8FC\uC138\uC694.");
  if (!row || !text3(row.title, 300) || !row.title.trim() || !text3(row.subjectId, 256) || !row.subjectId || !(row.topicId === null || text3(row.topicId, 256)) || !text3(row.sourceText, MAX_SOURCE_TEXT) || !Array.isArray(row.results) || row.results.length > 30)
    invalid3("\uC790\uB8CC \uC81C\uBAA9\xB7\uACFC\uBAA9\xB7\uBCF8\uBB38\uC744 \uD655\uC778\uD574 \uC8FC\uC138\uC694.");
  if (row.audio !== null && (!row.audio || !text3(row.audio.key, 512) || !row.audio.key || !text3(row.audio.name, 512) || !text3(row.audio.type, 100) || !Number.isSafeInteger(row.audio.size) || row.audio.size <= 0 || row.audio.size > MAX_AUDIO_BYTES || !/^[a-f0-9]{64}$/.test(row.audio.sha256)))
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
  if (row.generationProgress?.completed.some((c) => {
    const r = row.results.find((r2) => r2.id === c.resultId);
    return !r?.range || r.range.sourceIdentity !== row.generationProgress.sourceIdentity || r.range.index !== c.index;
  })) invalid3("\uCC98\uB9AC \uBC94\uC704\uC758 \uACB0\uACFC \uC5F0\uACB0\uC744 \uD655\uC778\uD574 \uC8FC\uC138\uC694.");
}
function materialContent(row) {
  return structuredClone({
    title: row.title,
    subjectId: row.subjectId,
    topicId: row.topicId,
    sourceText: row.sourceText,
    audio: row.audio,
    results: row.results,
    ...row.aiRequest ? { aiRequest: row.aiRequest } : {},
    ...row.documents ? { documents: row.documents } : {},
    ...row.quizAttempts ? { quizAttempts: row.quizAttempts } : {},
    ...row.tutorDraft !== void 0 ? { tutorDraft: row.tutorDraft } : {},
    ...row.learningView ? { learningView: row.learningView } : {},
    ...row.generationProgress ? { generationProgress: row.generationProgress } : {},
    ...row.originalStorage ? { originalStorage: row.originalStorage } : {}
  });
}
function validateMaterialTransition(previous, next, owner) {
  const canonical3 = (value) => Array.isArray(value) ? "[" + value.map(canonical3).join(",") + "]" : value && typeof value === "object" ? "{" + Object.entries(value).filter(([, v]) => v !== void 0).sort(([a], [b]) => a.localeCompare(b)).map(([k, v]) => JSON.stringify(k) + ":" + canonical3(v)).join(",") + "}" : JSON.stringify(value);
  for (const attempt of next.quizAttempts ?? []) {
    const source = next.results.find((r) => r.id === attempt.resultId);
    if (!source?.quiz || !attempt.questions.length || attempt.questions.some((q) => !source.quiz.some((original) => canonical3(original) === canonical3(q)))) invalid3("\uD034\uC988 \uC2DC\uB3C4\uC758 \uCD9C\uC81C \uC6D0\uBB38\uC744 \uD655\uC778\uD574 \uC8FC\uC138\uC694.");
  }
  for (const old of previous?.quizAttempts ?? []) {
    const saved = next.quizAttempts?.find((a) => a.id === old.id);
    if (!saved || old.helpedQuestionIds?.some((id) => !saved.helpedQuestionIds?.includes(id)) || old.submittedAt && canonical3(saved) !== canonical3(old) || saved.resultId !== old.resultId || saved.at !== old.at || canonical3(saved.questions) !== canonical3(old.questions)) invalid3("\uAE30\uC874 \uD034\uC988 \uC751\uB2F5\uACFC \uCD9C\uC81C \uB2F9\uC2DC \uB0B4\uC6A9\uC744 \uC720\uC9C0\uD574 \uC8FC\uC138\uC694. \uC0C8 \uC2DC\uB3C4\uB85C \uB2E4\uC2DC \uD480 \uC218 \uC788\uC2B5\uB2C8\uB2E4.");
  }
  if (owner) {
    const location = (file, kind) => {
      if (file?.cloudPath !== void 0 && file.cloudPath !== `${owner.userId}/${owner.namespace}/${kind}/${file.sha256}`) invalid3("\uB2E4\uB978 \uACC4\uC815\xB7\uACF5\uAC04\uC758 \uC6D0\uBCF8 \uD30C\uC77C\uC744 \uCC38\uC870\uD560 \uC218 \uC5C6\uC2B5\uB2C8\uB2E4.");
    };
    location(next.audio, "audio");
    for (const d of next.documents ?? []) location(d.file, "document");
    for (const r of next.results) {
      location(r.source?.audio, "audio");
      for (const d of r.source?.documents ?? []) location(d.file, "document");
    }
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
  const fail4 = () => {
    throw new DomainError(
      "INVALID_CODE_EXAMPLE",
      "\uCF54\uB4DC \uC608\uC81C\uC758 \uC81C\uBAA9\xB7\uCF54\uB4DC\xB7\uC124\uBA85\xB7\uC2E4\uD589 \uACB0\uACFC\uB97C \uD655\uC778\uD574 \uC8FC\uC138\uC694."
    );
  };
  if (!value || typeof value !== "object" || Array.isArray(value)) return fail4();
  const content = value;
  if (content.inputMode !== void 0 && !["batch", "terminal"].includes(content.inputMode))
    return fail4();
  if (!Object.hasOwn(CODE_LANGUAGES, content.language)) return fail4();
  for (const name of ["title", "code", "stdin", "notes"]) {
    if (typeof content[name] !== "string" || content[name].length > MAX_CODE_TEXT) return fail4();
  }
  if (content.lastRun !== void 0) {
    const run = content.lastRun;
    if (!run || run.mode !== void 0 && run.mode !== "terminal" || !Object.hasOwn(CODE_LANGUAGES, run.language) || !["success", "error", "stopped"].includes(run.outcome) || typeof run.at !== "string" || !Number.isFinite(Date.parse(run.at)))
      return fail4();
    for (const name of ["code", "stdin", "output", "error"]) {
      if (typeof run[name] !== "string" || run[name].length > (name === "output" || name === "error" ? MAX_CODE_OUTPUT : MAX_CODE_TEXT))
        return fail4();
    }
  }
}
function codeContent(row) {
  return {
    title: row.title,
    language: row.language,
    code: row.code,
    stdin: row.stdin,
    notes: row.notes,
    ...row.inputMode ? { inputMode: row.inputMode } : {},
    ...row.lastRun ? { lastRun: row.lastRun } : {}
  };
}

// src/domain/commands.ts
function verifyLearningPlan(workspace, state) {
  try {
    validateRecommendations(workspace, state);
  } catch (error) {
    throw new DomainError("INVALID_LEARNING_PLAN", error instanceof Error ? error.message : "\uD559\uC2B5 \uC77C\uC815\uC758 \uB0B4\uC6A9\uC744 \uD655\uC778\uD574 \uC8FC\uC138\uC694.");
  }
}
var collections = ["conceptCatalogs", "conceptEditions", "conceptBatches", "studyBoards", "semesters", "subjects", "nodes", "sessions", "records", "narratives", "criteria", "criteriaAssignments", "memos", "learningPlans", "canvasLayouts", "codeExamples", "recallCards", "recallPreferences", "studyMaterials", "memoryCards", "memoryTests", "inkWorkspaces"];
var clone = (value) => structuredClone(value);
function fail3(code, message, details) {
  throw new DomainError(code, message, details);
}
function canonical2(value) {
  if (Array.isArray(value)) return "[" + value.map(canonical2).join(",") + "]";
  if (value && typeof value === "object") return "{" + Object.entries(value).filter(([, v]) => v !== void 0).sort(([a], [b]) => a.localeCompare(b)).map(([k, v]) => JSON.stringify(k) + ":" + canonical2(v)).join(",") + "}";
  return JSON.stringify(value);
}
function identity(id) {
  if (typeof id !== "string" || !id.trim() || id.length > 256) fail3("INVALID_ID", "\uD56D\uBAA9\uC758 \uC2DD\uBCC4\uC790\uB97C \uD655\uC778\uD574 \uC8FC\uC138\uC694.");
}
function title(name) {
  if (typeof name !== "string" || !name.trim()) fail3("EMPTY_NAME", "\uC774\uB984\uC744 \uC785\uB825\uD574 \uC8FC\uC138\uC694.");
  return name.trim();
}
function validDay(day2) {
  return typeof day2 === "string" && /^\d{4}-\d{2}-\d{2}$/.test(day2) && Number.isFinite(Date.parse(day2)) && new Date(day2).toISOString().slice(0, 10) === day2;
}
function validateDateEvidence(value) {
  if (!value || !["exact", "range", "unknown"].includes(value.kind)) fail3("INVALID_DATE", "\uACF5\uBD80\uD55C \uB0A0\uC9DC\uC758 \uAE30\uC5B5 \uC815\uB3C4\uB97C \uD655\uC778\uD574 \uC8FC\uC138\uC694.");
  if (value.kind === "exact" && !validDay(value.date)) fail3("INVALID_DATE", "\uC2E4\uC81C \uACF5\uBD80\uD55C \uB0A0\uC9DC\uB97C \uD655\uC778\uD574 \uC8FC\uC138\uC694.");
  if (value.kind === "range" && (!validDay(value.from) || !validDay(value.to) || value.from > value.to)) fail3("INVALID_DATE", "\uAE30\uC5B5\uB098\uB294 \uB0A0\uC9DC \uBC94\uC704\uB97C \uD655\uC778\uD574 \uC8FC\uC138\uC694.");
}
function verifyScope(state, scope) {
  if (!scope || !["semester", "independent", "unassigned"].includes(scope.kind)) fail3("INVALID_SCOPE", "\uACFC\uBAA9\uC758 \uC18C\uC18D\uC744 \uD655\uC778\uD574 \uC8FC\uC138\uC694.");
  if (scope.kind === "semester" && !state.semesters.some((s) => s.id === scope.semesterId && !s.deletedAt)) fail3("INVALID_SCOPE", "\uC5F0\uACB0\uD560 \uD559\uAE30\uB97C \uCC3E\uC744 \uC218 \uC5C6\uC2B5\uB2C8\uB2E4.");
}
function find(values, id, active = true) {
  const row = values.find((v) => v.id === id);
  if (!row || active && row.deletedAt) return fail3("NOT_FOUND", "\uB300\uC0C1\uC744 \uCC3E\uC744 \uC218 \uC5C6\uC2B5\uB2C8\uB2E4. \uD734\uC9C0\uD1B5\uC744 \uD655\uC778\uD574 \uC8FC\uC138\uC694.", { id });
  return row;
}
function expected(row, version2, attempted) {
  if (row.version !== version2) fail3("VERSION_CONFLICT", "\uB2E4\uB978 \uACF3\uC5D0\uC11C \uBCC0\uACBD\uB41C \uB0B4\uC6A9\uC774 \uC788\uC2B5\uB2C8\uB2E4. \uB450 \uB0B4\uC6A9\uC744 \uD655\uC778\uD574 \uC8FC\uC138\uC694.", { baseVersion: version2, current: clone(row), attempted: clone(attempted) });
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
  if (!trace || typeof trace !== "object" || Array.isArray(trace)) fail3("INVALID_TRACE", "\uD65C\uB3D9 \uC785\uB825\uC744 \uD655\uC778\uD574 \uC8FC\uC138\uC694.");
  for (const [id, item] of Object.entries(trace)) {
    identity(id);
    if (!/^[TRACE][A-Za-z0-9_-]*$/.test(id)) fail3("INVALID_TRACE_ID", "\uD65C\uB3D9\uC758 \uC6D0\uB798 \uC2DD\uBCC4\uC790\uB97C \uD655\uC778\uD574 \uC8FC\uC138\uC694.");
    if (!item || !["checked", "unchecked", "na", "deferred"].includes(item.status) || item.note !== void 0 && typeof item.note !== "string") fail3("INVALID_TRACE", "\uD65C\uB3D9 \uC0C1\uD0DC\uC640 \uBA54\uBAA8\uB97C \uD655\uC778\uD574 \uC8FC\uC138\uC694.");
    if (item.definition !== void 0) validateTraceDefinition(item.definition, id);
    if (item.examReview && (typeof item.examReview.answer !== "string" || typeof item.examReview.checked !== "boolean" || item.examReview.checked && (!item.examReview.answer.trim() || item.status !== "checked"))) fail3("INVALID_WRITTEN_REVIEW", "\uC810\uAC80\uD558\uB824\uBA74 \uC790\uAE30 \uBB38\uC7A5\uC73C\uB85C \uC11C\uC220\uC744 \uB0A8\uACA8 \uC8FC\uC138\uC694.");
    if (item.repeats) {
      const ids = /* @__PURE__ */ new Set();
      for (const repeat of item.repeats) {
        identity(repeat.id);
        if (ids.has(repeat.id)) fail3("DUPLICATE_REPEAT", "\uAC19\uC740 \uBC18\uBCF5 \uAE30\uB85D\uC774 \uC911\uBCF5\uB418\uC5B4 \uC788\uC2B5\uB2C8\uB2E4.");
        ids.add(repeat.id);
        if (!["exact", "minimum", "unknown"].includes(repeat.kind) || (repeat.kind === "unknown" ? repeat.count !== null : !Number.isSafeInteger(repeat.count) || Number(repeat.count) < 1)) fail3("INVALID_REPEAT", "\uBC18\uBCF5 \uD69F\uC218\uC758 \uAE30\uC5B5 \uC815\uB3C4\uB97C \uD655\uC778\uD574 \uC8FC\uC138\uC694.");
        if (repeat.dateEvidence) validateDateEvidence(repeat.dateEvidence);
      }
    }
  }
}
function mergeTrace(previous, patch) {
  verifyTrace(patch);
  const next = clone(previous);
  for (const [id, item] of Object.entries(patch)) {
    if (item.examReview && canonical2(item.examReview) !== canonical2(previous[id]?.examReview ?? null)) fail3("REVIEW_COMMAND_REQUIRED", "\uC11C\uC220 \uC218\uC815\uACFC \uC810\uAC80 \uD655\uC778\uC740 \uD574\uB2F9 \uC870\uC791\uC744 \uC0AC\uC6A9\uD574 \uC8FC\uC138\uC694.");
    const definition = previous[id]?.definition ?? item.definition ?? (() => {
      const original = TRACE_ITEMS.find((t) => t.id === id);
      return original ? { id, group: original.group, label: original.label, mode: original.mode, version: 1 } : void 0;
    })();
    next[id] = { ...previous[id], ...clone(item), ...definition ? { definition } : {} };
    if (next[id].status !== "checked" && next[id].examReview) next[id].examReview = { ...next[id].examReview, checked: false };
  }
  verifyTrace(next);
  return next;
}
function assertState(state) {
  if (state.schemaVersion !== 1 || !["demo", "personal", "test"].includes(state.namespace)) fail3("INVALID_STATE", "\uC790\uB8CC \uD615\uC2DD\uC744 \uD655\uC778\uD574 \uC8FC\uC138\uC694.");
  identity(state.userId);
  const globallyUnique = /* @__PURE__ */ new Set();
  for (const name of collections) {
    if (state[name] !== void 0 && !Array.isArray(state[name])) fail3("INVALID_STATE", "\uC790\uB8CC \uBAA9\uB85D\uC758 \uD615\uC2DD\uC744 \uD655\uC778\uD574 \uC8FC\uC138\uC694.");
    for (const row of state[name] ?? []) {
      identity(row.id);
      if (globallyUnique.has(row.id)) fail3("DUPLICATE_ID", "\uAC19\uC740 \uC2DD\uBCC4\uC790\uAC00 \uC911\uBCF5\uB418\uC5B4 \uC788\uC2B5\uB2C8\uB2E4.", { id: row.id });
      globallyUnique.add(row.id);
      if (row.userId !== state.userId || row.namespace !== state.namespace) fail3("OWNERSHIP", "\uB2E4\uB978 \uC0AC\uC6A9\uC790\uB098 \uC2DC\uD5D8 \uACF5\uAC04\uC758 \uC790\uB8CC\uB97C \uD568\uAED8 \uCC98\uB9AC\uD560 \uC218 \uC5C6\uC2B5\uB2C8\uB2E4.");
      if (!Number.isInteger(row.version) || row.version < 1) fail3("INVALID_VERSION", "\uC218\uC815 \uC21C\uC11C\uB97C \uD655\uC778\uD574 \uC8FC\uC138\uC694.");
    }
  }
  const index = new Map(collections.flatMap((name) => (state[name] ?? []).map((row) => [row.id, row])));
  const subjectIds = new Set(state.subjects.map((row) => row.id));
  const sessionIds = new Set(state.sessions.map((row) => row.id));
  const semesterIds = new Set(state.semesters.map((row) => row.id));
  const nodeIndex = new Map(state.nodes.map((row) => [row.id, row]));
  for (const subject of state.subjects) {
    if (subject.scope.kind === "semester") {
      if (!semesterIds.has(subject.scope.semesterId)) fail3("NOT_FOUND", "\uACFC\uBAA9\uC774 \uC5F0\uACB0\uB41C \uD559\uAE30\uB97C \uCC3E\uC744 \uC218 \uC5C6\uC2B5\uB2C8\uB2E4.");
    } else if (!["independent", "unassigned"].includes(subject.scope.kind)) fail3("INVALID_SCOPE", "\uACFC\uBAA9 \uC18C\uC18D\uC744 \uD655\uC778\uD574 \uC8FC\uC138\uC694.");
  }
  for (const node of state.nodes) {
    if (!subjectIds.has(node.subjectId)) fail3("NOT_FOUND", "\uBAA9\uCC28\uC758 \uACFC\uBAA9\uC744 \uCC3E\uC744 \uC218 \uC5C6\uC2B5\uB2C8\uB2E4.");
    const seen = /* @__PURE__ */ new Set([node.id]);
    let parentId = node.parentId;
    while (parentId !== null) {
      if (seen.has(parentId)) fail3("CYCLE", "\uD558\uC704 \uD56D\uBAA9 \uC548\uC73C\uB85C \uC774\uB3D9\uD560 \uC218 \uC5C6\uC2B5\uB2C8\uB2E4.");
      seen.add(parentId);
      const parent = nodeIndex.get(parentId);
      if (!parent) fail3("NOT_FOUND", "\uBD80\uBAA8 \uBAA9\uCC28\uB97C \uCC3E\uC744 \uC218 \uC5C6\uC2B5\uB2C8\uB2E4.");
      if (parent.subjectId !== node.subjectId) fail3("SUBJECT_MISMATCH", "\uB2E4\uB978 \uACFC\uBAA9\uC758 \uD56D\uBAA9 \uC544\uB798\uB85C \uC774\uB3D9\uD560 \uC218 \uC5C6\uC2B5\uB2C8\uB2E4.");
      parentId = parent.parentId;
    }
  }
  const pairs = /* @__PURE__ */ new Set();
  for (const row of state.records) {
    if (!sessionIds.has(row.sessionId)) fail3("NOT_FOUND", "\uC6D0\uB798 \uACF5\uBD80 \uC138\uC158\uC744 \uCC3E\uC744 \uC218 \uC5C6\uC2B5\uB2C8\uB2E4.");
    const subjectId = subjectIds.has(row.targetId) ? row.targetId : nodeIndex.get(row.targetId)?.subjectId;
    if (subjectId !== row.subjectId) fail3("SUBJECT_MISMATCH", "\uAE30\uB85D\uACFC \uC8FC\uC81C\uC758 \uACFC\uBAA9\uC774 \uB2E4\uB985\uB2C8\uB2E4.");
    const key = canonical2([row.sessionId, row.targetId]);
    if (pairs.has(key)) fail3("DUPLICATE_RECORD", "\uD55C \uACF5\uBD80\uC758 \uAC19\uC740 \uB300\uC0C1 \uAE30\uB85D\uC774 \uC911\uBCF5\uB418\uC5B4 \uC788\uC2B5\uB2C8\uB2E4.");
    pairs.add(key);
    validateDateEvidence(row.dateEvidence);
    verifyTrace(row.trace);
    if (typeof row.body !== "string" || typeof row.done !== "boolean") fail3("INVALID_RECORD", "\uACF5\uBD80 \uAE30\uB85D\uC758 \uC785\uB825\uC744 \uD655\uC778\uD574 \uC8FC\uC138\uC694.");
  }
  const inkKeys = /* @__PURE__ */ new Set();
  for (const row of state.inkWorkspaces ?? []) {
    if (typeof row.key !== "string" || !row.key || row.key.length > 512 || inkKeys.has(row.key)) fail3("INVALID_INK_WORKSPACE", "\uD544\uAE30 \uC124\uC815\uC758 \uC5F0\uACB0\uC744 \uD655\uC778\uD574 \uC8FC\uC138\uC694.");
    inkKeys.add(row.key);
    validateInkWorkspace(row.content);
  }
  for (const row of state.sessions) validateDateEvidence(row.dateEvidence);
  if ((state.learningPlans ?? []).filter((row) => !row.deletedAt).length > 1) fail3("DUPLICATE_PLAN", "\uD559\uC2B5 \uC77C\uC815\uC758 \uC6D0\uB798 \uC5F0\uACB0\uC744 \uD655\uC778\uD574 \uC8FC\uC138\uC694.");
  for (const row of state.learningPlans ?? []) verifyLearningPlan(row.workspace, state);
  for (const row of state.studyBoards ?? []) {
    validateBoard(row);
    verifyBoardTopics(row, state);
  }
  for (const row of state.canvasLayouts ?? []) validateCanvasLayout(row);
  for (const row of state.codeExamples ?? []) validateCodeContent(row);
  for (const row of state.studyMaterials ?? []) {
    validateMaterialContent(row);
    if (!subjectIds.has(row.subjectId) || row.topicId !== null && nodeIndex.get(row.topicId)?.subjectId !== row.subjectId) fail3("SUBJECT_MISMATCH", "\uC790\uB8CC\uC758 \uACFC\uBAA9\uACFC \uC8FC\uC81C\uB97C \uD655\uC778\uD574 \uC8FC\uC138\uC694.");
  }
  for (const card of state.memoryCards ?? []) {
    validateMemoryCard(card);
    validateMaterialCardSource(card, state);
    if (nodeIndex.get(card.topicId)?.role !== "topic") fail3("INVALID_MEMORY_TEST", "\uC554\uAE30 \uD56D\uBAA9\uC758 \uC6D0\uB798 \uC8FC\uC81C\uB97C \uCC3E\uC744 \uC218 \uC5C6\uC2B5\uB2C8\uB2E4.");
  }
  for (const test of state.memoryTests ?? []) {
    validateMemoryTest(test);
    for (const q of test.questions) if (!(state.memoryCards ?? []).some((c) => c.id === q.cardId && c.topicId === q.topicId)) fail3("INVALID_MEMORY_TEST", "\uC2DC\uD5D8 \uBB38\uD56D\uC758 \uC6D0\uB798 \uD56D\uBAA9\uC744 \uCC3E\uC744 \uC218 \uC5C6\uC2B5\uB2C8\uB2E4.");
  }
  const recallTopics = /* @__PURE__ */ new Set();
  for (const row of state.recallCards ?? []) {
    validateRecallCard(row, state);
    if (!row.deletedAt && row.front === void 0) {
      if (recallTopics.has(row.topicId)) fail3("DUPLICATE_RECALL", "\uC8FC\uC81C\uC758 \uBCF5\uC2B5 \uCE74\uB4DC\uAC00 \uC911\uBCF5\uB418\uC5B4 \uC788\uC2B5\uB2C8\uB2E4.");
      recallTopics.add(row.topicId);
    }
  }
  if ((state.recallPreferences ?? []).filter((row) => !row.deletedAt && row.deckName === void 0).length > 1) fail3("DUPLICATE_RECALL", "\uBCF5\uC2B5 \uC124\uC815\uC774 \uC911\uBCF5\uB418\uC5B4 \uC788\uC2B5\uB2C8\uB2E4.");
  for (const row of state.recallPreferences ?? []) {
    validateRecallOptions(row.options);
    if (row.deckName !== void 0 && (typeof row.deckName !== "string" || !row.deckName.trim() || row.deckName.length > 200)) fail3("INVALID_RECALL", "\uB371 \uC774\uB984\uC744 \uD655\uC778\uD574 \uC8FC\uC138\uC694.");
  }
  const sourceKeys = /* @__PURE__ */ new Set();
  for (const row of state.recallCards ?? []) if (row.importSource) {
    if (sourceKeys.has(row.importSource.key)) fail3("DUPLICATE_RECALL", "Anki \uC6D0\uBCF8 \uCE74\uB4DC\uAC00 \uC911\uBCF5\uB418\uC5B4 \uC788\uC2B5\uB2C8\uB2E4.");
    sourceKeys.add(row.importSource.key);
  }
  for (const row of state.memos ?? []) {
    validateMemoContent(row);
    if (row.recallCardId !== void 0 && !(state.recallCards ?? []).some((card) => card.id === row.recallCardId && card.topicId === row.ownerId)) fail3("INVALID_MEMO", "\uB2F5\uBCC0 \uBA54\uBAA8\uC758 \uC6D0\uB798 \uCE74\uB4DC \uC5F0\uACB0\uC744 \uD655\uC778\uD574 \uC8FC\uC138\uC694.");
    if (row.ownerId !== null && !subjectIds.has(row.ownerId) && !nodeIndex.has(row.ownerId)) fail3("NOT_FOUND", "\uBA54\uBAA8\uC758 \uC6D0\uB798 \uC5F0\uACB0 \uB300\uC0C1\uC744 \uCC3E\uC744 \uC218 \uC5C6\uC2B5\uB2C8\uB2E4.");
  }
  for (const row of state.narratives) {
    if (row.ownerId !== null && !index.has(row.ownerId)) fail3("NOT_FOUND", "\uBCF8\uBB38\uC758 \uC6D0\uB798 \uB300\uC0C1\uC744 \uCC3E\uC744 \uC218 \uC5C6\uC2B5\uB2C8\uB2E4.");
    verifyNarrative(state, row);
  }
  const definitions = new Map(defaultCriteriaItems().map((item) => [item.id, item]));
  for (const criteria of state.criteria ?? []) {
    if (!Array.isArray(criteria.items) || criteria.items.length > 100 || new Set(criteria.items.map((item) => item.id)).size !== criteria.items.length) fail3("INVALID_CRITERIA", "\uAE30\uC900\uC758 \uD56D\uBAA9\uACFC \uC911\uBCF5 \uC5EC\uBD80\uB97C \uD655\uC778\uD574 \uC8FC\uC138\uC694.");
    for (const item of criteria.items) {
      validateTraceDefinition(item);
      const prior = definitions.get(item.id);
      if (prior && (prior.label !== item.label || prior.group !== item.group || prior.mode !== item.mode || prior.version !== item.version)) fail3("CRITERIA_ID_REUSED", "\uB73B\uC774\uB098 \uC801\uC6A9 \uAE30\uC900\uC774 \uBC14\uB010 \uD65C\uB3D9\uC740 \uC0C8 \uD56D\uBAA9\uC73C\uB85C \uAD6C\uBCC4\uD574 \uC8FC\uC138\uC694.");
      definitions.set(item.id, item);
    }
  }
  const assignments = /* @__PURE__ */ new Set();
  for (const assignment of state.criteriaAssignments ?? []) {
    if (!["topic", "subject", "global"].includes(assignment.scope) || assignment.scope === "global" && assignment.ownerId !== null || assignment.scope === "subject" && !subjectIds.has(assignment.ownerId ?? "") || assignment.scope === "topic" && !nodeIndex.has(assignment.ownerId ?? "")) fail3("CRITERIA_OWNER", "\uAE30\uC900\uC744 \uC801\uC6A9\uD560 \uC18C\uC18D\uC744 \uD655\uC778\uD574 \uC8FC\uC138\uC694.");
    const key = JSON.stringify([assignment.scope, assignment.ownerId]);
    if (assignments.has(key)) fail3("DUPLICATE_CRITERIA_ASSIGNMENT", "\uAC19\uC740 \uD56D\uBAA9\uC5D0 \uAE30\uC900 \uC5F0\uACB0\uC774 \uC911\uBCF5\uB418\uC5B4 \uC788\uC2B5\uB2C8\uB2E4.");
    assignments.add(key);
    const target = state.criteria?.find((criteria) => criteria.id === assignment.criteriaId);
    if (!target || !assignment.deletedAt && target.deletedAt) fail3("CRITERIA_REFERENCE", "\uAE30\uC900\uC758 \uC6D0\uBB38 \uC5F0\uACB0\uC744 \uD655\uC778\uD574 \uC8FC\uC138\uC694.");
  }
  for (const row of state.revisions) if (row.userId !== state.userId || row.namespace !== state.namespace) fail3("OWNERSHIP", "\uC218\uC815 \uC774\uB825\uC758 \uC18C\uC720\uC790\uAC00 \uB2E4\uB985\uB2C8\uB2E4.");
  const conceptSources = new Map((state.conceptCatalogs ?? []).map((c) => {
    validateConceptCatalog(c);
    return [c.id, new Set(parseConceptSource(c.raw).items.map((i) => i.id))];
  }));
  const conceptPairs = /* @__PURE__ */ new Set();
  for (const c of state.conceptEditions ?? []) {
    validateConceptEdition(c);
    const pair = JSON.stringify([c.catalogId, c.sourceId]);
    if (!conceptSources.get(c.catalogId)?.has(c.sourceId) || conceptPairs.has(pair)) fail3("INVALID_CONCEPT", "\uAC1C\uB150\uC758 \uC6D0\uBB38 \uC5F0\uACB0 \uB610\uB294 \uC911\uBCF5\uC744 \uD655\uC778\uD574 \uC8FC\uC138\uC694.");
    conceptPairs.add(pair);
  }
  for (const b of state.conceptBatches ?? []) {
    validateConceptBatch(b);
    if (b.sourceIds.some((id) => !conceptSources.get(b.catalogId)?.has(id))) fail3("INVALID_CONCEPT", "\uC791\uC5C5 \uBB36\uC74C\uC758 \uC6D0\uBB38 \uC5F0\uACB0\uC744 \uD655\uC778\uD574 \uC8FC\uC138\uC694.");
  }
}
function verifyNarrative(state, row) {
  if (typeof row.body !== "string") fail3("INVALID_BODY", "\uBCF8\uBB38\uC740 \uAE00\uB85C \uB0A8\uACA8 \uC8FC\uC138\uC694.");
  if (row.kind === "free-note") {
    if (row.ownerId !== null) targetSubject(state, row.ownerId, false);
    return;
  }
  if (row.ownerId === null) fail3("OWNER_REQUIRED", "\uBCF8\uBB38\uC744 \uC5F0\uACB0\uD560 \uB300\uC0C1\uC744 \uD655\uC778\uD574 \uC8FC\uC138\uC694.");
  if (row.kind === "subject-overview") find(state.subjects, row.ownerId, false);
  else if (row.kind === "unit-introduction") {
    if (find(state.nodes, row.ownerId, false).role !== "unit") fail3("INVALID_OWNER", "\uB2E8\uC6D0 \uC11C\uBB38\uC740 \uB2E8\uC6D0\uC5D0 \uC5F0\uACB0\uD574 \uC8FC\uC138\uC694.");
  } else if (row.kind === "topic-note") find(state.nodes, row.ownerId, false);
  else fail3("INVALID_NARRATIVE", "\uBCF8\uBB38\uC758 \uC885\uB958\uB97C \uD655\uC778\uD574 \uC8FC\uC138\uC694.");
}
function applyCommand(state, command) {
  assertState(state);
  if (command.userId !== state.userId || command.namespace !== void 0 && command.namespace !== state.namespace) fail3("OWNERSHIP", "\uB2E4\uB978 \uC0AC\uC6A9\uC790\uB098 \uC2DC\uD5D8 \uACF5\uAC04\uC758 \uC790\uB8CC\uB97C \uBCC0\uACBD\uD560 \uC218 \uC5C6\uC2B5\uB2C8\uB2E4.");
  identity(command.opId);
  if (typeof command.at !== "string" || !Number.isFinite(Date.parse(command.at))) fail3("INVALID_TIME", "\uC800\uC7A5 \uC2DC\uAC01\uC744 \uD655\uC778\uD574 \uC8FC\uC138\uC694.");
  const payload = canonical2(command);
  if (Object.hasOwn(state.appliedOps, command.opId)) {
    if (state.appliedOps[command.opId] !== payload) fail3("OPERATION_REUSED", "\uAC19\uC740 \uC694\uCCAD \uC2DD\uBCC4\uC790\uC5D0 \uB2E4\uB978 \uB0B4\uC6A9\uC774 \uB4E4\uC5B4 \uC788\uC2B5\uB2C8\uB2E4.");
    return state;
  }
  const next = { ...state, revisions: state.revisions.slice(), appliedOps: { ...state.appliedOps } };
  for (const collection of collections) {
    if (state[collection] !== void 0) {
      next[collection] = state[collection].slice();
    }
  }
  const common = (id) => ({ id, userId: state.userId, namespace: state.namespace, createdAt: command.at, updatedAt: command.at, version: 1, deletedAt: null });
  const fresh = (id) => {
    identity(id);
    if (collections.some((k) => (next[k] ?? []).some((v) => v.id === id))) fail3("DUPLICATE_ID", "\uC774\uBBF8 \uC788\uB294 \uC2DD\uBCC4\uC790\uC785\uB2C8\uB2E4.", { id });
  };
  function write(collection, entity, reversesRevisionId) {
    if (collection === "conceptCatalogs") next.conceptCatalogs ??= [];
    if (collection === "conceptEditions") next.conceptEditions ??= [];
    if (collection === "conceptBatches") next.conceptBatches ??= [];
    if (collection === "criteria") next.criteria ??= [];
    if (collection === "criteriaAssignments") next.criteriaAssignments ??= [];
    if (collection === "memos") next.memos ??= [];
    if (collection === "memoryCards") next.memoryCards ??= [];
    if (collection === "memoryTests") next.memoryTests ??= [];
    if (collection === "learningPlans") next.learningPlans ??= [];
    if (collection === "conceptCatalogs") next.conceptCatalogs ??= [];
    if (collection === "conceptEditions") next.conceptEditions ??= [];
    if (collection === "conceptBatches") next.conceptBatches ??= [];
    if (collection === "studyBoards") next.studyBoards ??= [];
    if (collection === "canvasLayouts") next.canvasLayouts ??= [];
    if (collection === "studyMaterials") next.studyMaterials ??= [];
    if (collection === "codeExamples") next.codeExamples ??= [];
    if (collection === "recallCards") next.recallCards ??= [];
    if (collection === "inkWorkspaces") next.inkWorkspaces ??= [];
    if (collection === "recallPreferences") next.recallPreferences ??= [];
    const list = next[collection];
    const index = list.findIndex((v) => v.id === entity.id), before = index < 0 ? null : clone(list[index]);
    if (before && canonical2(before) === canonical2(entity)) return;
    const after = { ...clone(entity), updatedAt: command.at, version: before ? before.version + 1 : 1 };
    if (index < 0) list.push(after);
    else list[index] = after;
    const parent = [...next.revisions].reverse().find((r) => r.collection === collection && r.entityId === entity.id);
    const revision = { ...common(`revision:${encodeURIComponent(command.opId)}:${next.revisions.length}`), collection, entityId: entity.id, operationId: command.opId, parentRevisionId: parent?.id ?? null, before, after: clone(after), ...reversesRevisionId ? { reversesRevisionId } : {} };
    next.revisions.push(revision);
  }
  const node = (id, version2, active = true) => {
    const found = find(next.nodes, id, active);
    expected(found, version2, command);
    return found;
  };
  switch (command.type) {
    
  case "importPhotoOutline": {
    find(next.subjects, command.subjectId);
    if (command.parentId !== null) {
      find(next.nodes, command.parentId);
      if (targetSubject(next, command.parentId) !== command.subjectId) fail("SUBJECT_MISMATCH", "\uB4F1\uB85D\uD560 \uC0C1\uC704 \uD56D\uBAA9\uC758 \uACFC\uBAA9\uC744 \uD655\uC778\uD574 \uC8FC\uC138\uC694.");
    }
    const plan = photoOutlineSupport.previewPhotoOutline(next, command.subjectId, command.parentId, command.rows, command.choices);
    if (command.expectedToken !== plan.expectedToken) fail("OUTLINE_STALE", "\uBAA9\uCC28\uAC00 \uBC14\uB00C\uC5C8\uC2B5\uB2C8\uB2E4. \uC0AC\uC9C4 \uCD08\uC548\uC740 \uC720\uC9C0\uD588\uC2B5\uB2C8\uB2E4. \uD604\uC7AC \uBAA9\uCC28\uC640 \uB2E4\uC2DC \uD655\uC778\uD574 \uC8FC\uC138\uC694.");
    if (!plan.ready) fail("OUTLINE_CHOICE_REQUIRED", "\uAC19\uC740 \uC774\uB984\uC758 \uD56D\uBAA9\uC744 \uC5F0\uACB0\uD560\uC9C0 \uC0C8\uB85C \uB9CC\uB4E4\uC9C0 \uC120\uD0DD\uD574 \uC8FC\uC138\uC694.");
    validateMaterialContent(command.content);
    if (command.content.subjectId !== command.subjectId || command.content.topicId !== null) fail("SUBJECT_MISMATCH", "\uC0AC\uC9C4 \uC790\uB8CC\uC640 \uBAA9\uCC28\uC758 \uACFC\uBAA9\uC744 \uD655\uC778\uD574 \uC8FC\uC138\uC694.");
    if (!command.ids || !command.memoIds || typeof command.ids !== "object" || typeof command.memoIds !== "object") fail("INVALID_ID", "\uB4F1\uB85D\uD560 \uD56D\uBAA9\uC758 \uC2DD\uBCC4\uC790\uB97C \uD655\uC778\uD574 \uC8FC\uC138\uC694.");
    const used = /* @__PURE__ */ new Set();
    const checkFresh = (id) => {
      fresh(id);
      if (used.has(id)) fail("DUPLICATE_ID", "\uB4F1\uB85D\uD560 \uD56D\uBAA9\uC758 \uC2DD\uBCC4\uC790\uAC00 \uACB9\uCCE4\uC2B5\uB2C8\uB2E4.");
      used.add(id);
    };
    checkFresh(command.materialId);
    for (const p of plan.entries) {
      if (p.status === "new") checkFresh(command.ids[p.row.id]);
      if (p.row.content.trim()) checkFresh(command.memoIds[p.row.id]);
    }
    const resolved = /* @__PURE__ */ new Map();
    for (const p of plan.entries) {
      const parentId = p.parentKey === null ? command.parentId : resolved.get(p.parentKey);
      const id = p.status === "reuse" ? p.id : command.ids[p.row.id];
      if (p.status === "new") write("nodes", { ...common(id), subjectId: command.subjectId, parentId, role: p.role, name: title(p.row.name), order: Math.max(-1, ...next.nodes.filter((n) => n.subjectId === command.subjectId && n.parentId === parentId).map((n) => n.order)) + 1 });
      resolved.set(p.row.id, id);
      if (p.row.content.trim()) {
        const body = p.row.content + `

\uC0AC\uC9C4\uC5D0\uC11C \uAC00\uC838\uC628 \uB0B4\uC6A9 \xB7 ${command.content.title}${p.row.page ? ` \xB7 ${p.row.page}` : ""}`;
        validateMemoContent({ body, ownerId: id, strokes: [] });
        write("memos", { ...common(command.memoIds[p.row.id]), ownerId: id, body, strokes: [] });
      }
    }
    write("studyMaterials", { ...common(command.materialId), ...clone(command.content) });
    break;
  }

case "saveMemoryCard": {
      validateMemoryCard(command.content);
      const topic = find(next.nodes, command.content.topicId);
      if (topic.role !== "topic") fail3("INVALID_MEMORY_TEST", "\uC554\uAE30 \uD56D\uBAA9\uC744 \uC5F0\uACB0\uD560 \uC8FC\uC81C\uB97C \uC120\uD0DD\uD574 \uC8FC\uC138\uC694.");
      targetSubject(next, topic.id);
      const old = next.memoryCards?.find((c) => c.id === command.id);
      if (old?.topicGeneration && canonical2(old.topicGeneration) !== canonical2(command.content.topicGeneration))
        fail3("INVALID_TOPIC_GENERATION", "\uCC98\uC74C \uC0DD\uC131\uD55C \uBAA9\uCC28\xB7\uC9C8\uBB38\xB7\uB2F5\uC548\uC758 \uCD9C\uCC98\uB294 \uC720\uC9C0\uD574 \uC8FC\uC138\uC694.");
      if (command.content.topicGeneration && (!old || !old.topicGeneration)) {
        const input = command.content.topicGeneration.input;
        const matches = (collection, ref, parentId, leaf = false) => {
          const candidates = [...next[collection], ...next.revisions.filter((r) => r.collection === collection && r.entityId === ref.id).flatMap((r) => [r.before, r.after])];
          return candidates.some((row) => row && row.id === ref.id && row.version === ref.version && "name" in row && row.name === ref.name && row.userId === next.userId && row.namespace === next.namespace && !row.deletedAt && (collection !== "nodes" || "subjectId" in row && row.subjectId === input.subject.id && "parentId" in row && row.parentId === parentId && (!leaf || "role" in row && row.role === "topic")));
        };
        if (!matches("subjects", input.subject) || input.topics.some((t) => t.path.some((n, i) => !matches("nodes", n, i ? t.path[i - 1].id : null, i === t.path.length - 1))))
          fail3("INVALID_TOPIC_GENERATION", "\uC0DD\uC131\uC5D0 \uC0AC\uC6A9\uD55C \uACFC\uBAA9\uACFC \uBAA9\uCC28\uC758 \uC6D0\uB798 \uC774\uB984\xB7\uBC84\uC804\uC744 \uD655\uC778\uD574 \uC8FC\uC138\uC694.");
      }
      validateMaterialCardSource(command.content, next, !old);
      if (old) {
        find(next.memoryCards, old.id);
        expected(old, command.expectedVersion, command);
        if (old.topicId !== command.content.topicId) fail3("INVALID_MEMORY_TEST", "\uAE30\uC874 \uD56D\uBAA9\uC758 \uC8FC\uC81C\uB294 \uC720\uC9C0\uD574 \uC8FC\uC138\uC694. \uB2E4\uB978 \uC8FC\uC81C\uC5D0\uB294 \uC0C8 \uD56D\uBAA9\uC73C\uB85C \uB4F1\uB85D\uD560 \uC218 \uC788\uC2B5\uB2C8\uB2E4.");
      } else {
        if (command.expectedVersion !== 0) fail3("VERSION_CONFLICT", "\uD56D\uBAA9\uC758 \uC218\uC815 \uC21C\uC11C\uB97C \uD655\uC778\uD574 \uC8FC\uC138\uC694.");
        fresh(command.id);
      }
      write("memoryCards", { ...old ?? common(command.id), ...clone(command.content) });
      break;
    }
    case "trashMemoryCard":
    case "restoreMemoryCard": {
      const card = find(next.memoryCards ?? [], command.id, command.type === "trashMemoryCard");
      expected(card, command.expectedVersion, command);
      write("memoryCards", { ...card, deletedAt: command.type === "trashMemoryCard" ? command.at : null });
      break;
    }
    case "saveMemoryTest": {
      validateMemoryTest(command.content);
      fresh(command.id);
      for (const q of command.content.questions) {
        const card = find(next.memoryCards ?? [], q.cardId, false);
        const source = card.version === q.cardVersion ? card : next.revisions.find((r) => r.collection === "memoryCards" && r.entityId === card.id && r.after.version === q.cardVersion)?.after;
        if (!source || source.topicId !== q.topicId || source.question !== q.question || source.answer !== q.answer || canonical2(source.strokes) !== canonical2(q.strokes) || canonical2(source.topicGeneration) !== canonical2(q.topicGeneration)) fail3("INVALID_MEMORY_TEST", "\uCD9C\uC81C \uB2F9\uC2DC\uC758 \uC9C8\uBB38\uACFC \uAE30\uC900 \uB2F5\uC548\uC744 \uD655\uC778\uD574 \uC8FC\uC138\uC694.");
      }
      write("memoryTests", { ...common(command.id), ...clone(command.content) });
      break;
    }
    case "saveStudyMaterial": {
      validateMaterialContent(command.content);
      find(next.subjects, command.content.subjectId);
      if (command.content.topicId !== null && targetSubject(next, command.content.topicId) !== command.content.subjectId) fail3("SUBJECT_MISMATCH", "\uC120\uD0DD\uD55C \uC8FC\uC81C\uAC00 \uC774 \uACFC\uBAA9\uC5D0 \uC18D\uD558\uC9C0 \uC54A\uC2B5\uB2C8\uB2E4.");
      const old = next.studyMaterials?.find((row) => row.id === command.id);
      if (old) {
        find(next.studyMaterials, old.id);
        expected(old, command.expectedVersion, command);
      } else {
        if (command.expectedVersion !== 0) fail3("VERSION_CONFLICT", "\uC790\uB8CC\uC758 \uC218\uC815 \uC21C\uC11C\uB97C \uD655\uC778\uD574 \uC8FC\uC138\uC694.");
        fresh(command.id);
      }
      validateMaterialTransition(old, command.content, next);
      write("studyMaterials", { ...old ?? common(command.id), ...materialContent(command.content) });
      break;
    }
    case "trashStudyMaterial":
    case "restoreStudyMaterial": {
      const row = find(next.studyMaterials ?? [], command.id, command.type === "trashStudyMaterial");
      expected(row, command.expectedVersion, command);
      write("studyMaterials", { ...row, deletedAt: command.type === "trashStudyMaterial" ? command.at : null });
      break;
    }
    case "saveRecallPreferences": {
      validateRecallOptions(command.options);
      const old = next.recallPreferences?.find((row) => row.id === command.id);
      if (old) {
        find(next.recallPreferences, old.id);
        expected(old, command.expectedVersion, command);
        if (old.deckName === void 0 !== (command.deckName === void 0)) fail3("INVALID_RECALL", "\uAE30\uBCF8 \uC124\uC815\uACFC \uB371 \uC124\uC815\uC744 \uC11C\uB85C \uBC14\uAFC0 \uC218 \uC5C6\uC2B5\uB2C8\uB2E4.");
      } else {
        if (command.expectedVersion !== 0) fail3("VERSION_CONFLICT", "\uBCF5\uC2B5 \uC124\uC815\uC758 \uC218\uC815 \uC21C\uC11C\uB97C \uD655\uC778\uD574 \uC8FC\uC138\uC694.");
        fresh(command.id);
      }
      write("recallPreferences", { ...old ?? common(command.id), options: clone(command.options), ...command.deckName !== void 0 ? { deckName: command.deckName } : {} });
      break;
    }
    case "setRecallCardStatus": {
      const card = find(next.recallCards ?? [], command.id);
      expected(card, command.expectedVersion, command);
      if (typeof command.suspended !== "boolean") fail3("INVALID_RECALL", "\uCE74\uB4DC \uC0C1\uD0DC\uB97C \uD655\uC778\uD574 \uC8FC\uC138\uC694.");
      if (command.deckId && !next.recallPreferences?.some((row) => row.id === command.deckId && !row.deletedAt && row.deckName !== void 0)) fail3("INVALID_RECALL", "\uCE74\uB4DC\uC758 \uB371\uC744 \uD655\uC778\uD574 \uC8FC\uC138\uC694.");
      write("recallCards", { ...card, deckId: command.deckId, suspended: command.suspended, clozeRemoved: false });
      break;
    }
    case "saveRecallCloze": {
      const topic = find(next.nodes, command.topicId);
      targetSubject(next, topic.id);
      if (topic.role !== "topic" || typeof command.noteId !== "string" || !command.noteId.trim()) fail3("INVALID_CLOZE", "\uBE48\uCE78 \uCE74\uB4DC\uC758 \uACF5\uBD80 \uC8FC\uC81C\uB97C \uD655\uC778\uD574 \uC8FC\uC138\uC694.");
      if (command.deckId && !next.recallPreferences?.some((row) => row.id === command.deckId && !row.deletedAt && row.deckName !== void 0)) fail3("INVALID_RECALL", "\uCE74\uB4DC\uC758 \uB371\uC744 \uD655\uC778\uD574 \uC8FC\uC138\uC694.");
      const numbers = clozeNumbers(command.source);
      if (!numbers.length || !Array.isArray(command.cards) || command.cards.length > 999 || new Set(command.cards.map((row) => row.id)).size !== command.cards.length || new Set(command.cards.map((row) => row.number)).size !== command.cards.length) fail3("INVALID_CLOZE", "\uBE48\uCE78\uC744 {{c1::\uC815\uB2F5}}\uCC98\uB7FC \uD45C\uC2DC\uD574 \uC8FC\uC138\uC694.");
      const oldCards = (next.recallCards ?? []).filter((row) => row.cloze?.noteId === command.noteId);
      if (oldCards.some((row) => row.deletedAt || row.topicId !== topic.id || !command.cards.some((candidate) => candidate.id === row.id && candidate.number === row.cloze.number))) fail3("VERSION_CONFLICT", "\uBE48\uCE78\uC758 \uBAA8\uB4E0 \uCE74\uB4DC\uB97C \uB2E4\uC2DC \uC77D\uC5B4 \uC8FC\uC138\uC694. \uD604\uC7AC \uB0B4\uC6A9\uACFC \uCD08\uC548\uC744 \uBCF4\uC874\uD588\uC2B5\uB2C8\uB2E4.");
      if (numbers.some((number) => !command.cards.some((row) => row.number === number))) fail3("INVALID_CLOZE", "\uC0DD\uC131\uD560 \uBE48\uCE78 \uBC88\uD638\uB97C \uD655\uC778\uD574 \uC8FC\uC138\uC694.");
      for (const item of command.cards) {
        const old = oldCards.find((row) => row.id === item.id);
        if (old) expected(old, item.expectedVersion, command);
        else {
          if (item.expectedVersion !== 0 || !numbers.includes(item.number)) fail3("VERSION_CONFLICT", "\uBE48\uCE78 \uCE74\uB4DC\uC758 \uC218\uC815 \uC21C\uC11C\uB97C \uD655\uC778\uD574 \uC8FC\uC138\uC694.");
          fresh(item.id);
        }
        const card = old ?? { ...common(item.id), topicId: topic.id, reference: "", memory: newRecallMemory(command.at), reviews: [] };
        write("recallCards", numbers.includes(item.number) ? { ...card, deckId: command.deckId, front: renderCloze(command.source, item.number), reference: command.reference, cloze: { noteId: command.noteId, source: command.source, number: item.number }, suspended: old?.suspended && !old.clozeRemoved || false, clozeRemoved: false } : { ...card, suspended: true, clozeRemoved: true });
      }
      break;
    }
    case "importRecallCards": {
      if (!Array.isArray(command.items) || !command.items.length || command.items.length > 100 || typeof command.updateUnedited !== "boolean") fail3("INVALID_IMPORT", "\uD55C \uBC88\uC5D0 \uAC00\uC838\uC62C \uCE74\uB4DC \uC218\uB97C \uD655\uC778\uD574 \uC8FC\uC138\uC694.");
      for (const item of command.items) {
        const source = item.source;
        if (!source || typeof source.guid !== "string" || !source.guid || source.guid.length > 200 || !Number.isSafeInteger(source.ordinal) || source.ordinal < 0 || source.ordinal > 998 || source.key !== `anki:${source.guid}:${source.ordinal}` || !Array.isArray(source.fields) || source.fields.some((field) => typeof field.name !== "string" || typeof field.value !== "string") || ["deck", "noteType", "tags", "questionTemplate", "answerTemplate", "originalFront", "originalReference"].some((key) => typeof source[key] !== "string") || source.originalFront !== item.front || source.originalReference !== item.reference || JSON.stringify(source).length > 3e5) fail3("INVALID_IMPORT", "Anki \uCE74\uB4DC\uC758 \uC6D0\uBCF8\uACFC \uD45C\uC2DC \uB0B4\uC6A9\uC744 \uD655\uC778\uD574 \uC8FC\uC138\uC694.");
        const old = (next.recallCards ?? []).find((row) => row.importSource?.key === source.key);
        if (old) {
          const original = old.importSource;
          const unedited = old.front === original.originalFront && old.reference === original.originalReference && old.cloze?.source === original.originalCloze;
          if (old.deletedAt || !!old.cloze !== !!item.cloze || !command.updateUnedited || !unedited || canonical2(original) === canonical2(source)) continue;
          write("recallCards", { ...old, front: item.front, reference: item.reference, importSource: clone(source), ...item.cloze ? { cloze: { ...item.cloze, noteId: old.cloze?.noteId ?? item.cloze.noteId } } : {} });
        } else {
          const topic = find(next.nodes, item.topicId);
          targetSubject(next, topic.id);
          if (topic.role !== "topic") fail3("INVALID_IMPORT", "\uAC00\uC838\uC62C \uCE74\uB4DC\uC758 \uACF5\uBD80 \uC8FC\uC81C\uB97C \uC120\uD0DD\uD574 \uC8FC\uC138\uC694.");
          if (item.deckId && !next.recallPreferences?.some((row) => row.id === item.deckId && !row.deletedAt && row.deckName !== void 0)) fail3("INVALID_RECALL", "\uAC00\uC838\uC62C \uB371\uC744 \uD655\uC778\uD574 \uC8FC\uC138\uC694.");
          fresh(item.id);
          write("recallCards", { ...common(item.id), topicId: item.topicId, deckId: item.deckId, front: item.front, reference: item.reference, ...item.cloze ? { cloze: clone(item.cloze) } : {}, importSource: clone(source), memory: newRecallMemory(command.at), reviews: [] });
        }
      }
      break;
    }
    case "undoRecallReview": {
      const card = find(next.recallCards ?? [], command.id);
      expected(card, command.expectedVersion, command);
      const review = card.reviews.at(-1);
      const revision = [...next.revisions].reverse().find((row) => row.collection === "recallCards" && row.entityId === card.id);
      if (!review || review.id !== command.reviewId || revision?.operationId !== command.reviewId || revision.reversesRevisionId)
        fail3("UNDO_CONFLICT", "\uD3C9\uAC00 \uD6C4 \uB2E4\uB978 \uBCC0\uACBD\uC774 \uC788\uC2B5\uB2C8\uB2E4. \uD604\uC7AC \uB0B4\uC6A9\uACFC \uC774\uB825\uC744 \uD655\uC778\uD574 \uC8FC\uC138\uC694.");
      const restored = revision.before;
      write("recallCards", restored ?? { ...card, memory: clone(review.before), reviews: card.reviews.slice(0, -1) }, revision.id);
      break;
    }
    case "saveRecallCard":
    case "saveRecallReference":
    case "setRecallDue":
    case "reviewRecallCard": {
      const topic = find(next.nodes, command.topicId);
      targetSubject(next, topic.id);
      if (topic.role !== "topic") fail3("INVALID_RECALL", "\uBCF5\uC2B5 \uCE74\uB4DC\uB294 \uACF5\uBD80 \uC8FC\uC81C\uC5D0 \uC5F0\uACB0\uD574 \uC8FC\uC138\uC694.");
      const old = next.recallCards?.find((row) => row.id === command.id);
      if (old) {
        find(next.recallCards, old.id);
        expected(old, command.expectedVersion, command);
        if (old.topicId !== topic.id) fail3("INVALID_RECALL", "\uBCF5\uC2B5 \uCE74\uB4DC\uC758 \uC6D0\uB798 \uC8FC\uC81C\uB97C \uBCF4\uC874\uD574 \uC8FC\uC138\uC694.");
      } else {
        if (command.expectedVersion !== 0) fail3("VERSION_CONFLICT", "\uBCF5\uC2B5 \uCE74\uB4DC\uC758 \uC218\uC815 \uC21C\uC11C\uB97C \uD655\uC778\uD574 \uC8FC\uC138\uC694.");
        fresh(command.id);
      }
      const card = old ?? { ...common(command.id), topicId: topic.id, reference: "", memory: newRecallMemory(command.at), reviews: [] };
      if (command.type === "saveRecallCard" && card.cloze) fail3("INVALID_CLOZE", "\uBE48\uCE78 \uBB38\uC7A5\uC740 \uBE48\uCE78 \uCE74\uB4DC \uD3B8\uC9D1\uC5D0\uC11C \uBC14\uAFD4 \uC8FC\uC138\uC694.");
      if (command.type === "reviewRecallCard" && card.suspended) fail3("INVALID_RECALL", "\uBCF4\uAD00\uD55C \uCE74\uB4DC\uB294 \uBCF5\uC6D0\uD55C \uB4A4 \uD3C9\uAC00\uD574 \uC8FC\uC138\uC694.");
      if (command.type === "saveRecallCard") write("recallCards", { ...card, front: command.front, reference: command.reference, deckId: command.deckId });
      else if (command.type === "saveRecallReference") write("recallCards", { ...card, reference: command.reference });
      else if (command.type === "setRecallDue") {
        if (typeof command.due !== "string" || !Number.isFinite(Date.parse(command.due))) fail3("INVALID_RECALL", "\uB2E4\uC74C \uBCF5\uC2B5 \uB0A0\uC9DC\uB97C \uD655\uC778\uD574 \uC8FC\uC138\uC694.");
        write("recallCards", { ...card, manualDue: command.due });
      } else {
        if (![1, 2, 3, 4].includes(command.rating)) fail3("INVALID_RECALL", "\uC790\uAE30 \uD3C9\uAC00\uB97C \uC120\uD0DD\uD574 \uC8FC\uC138\uC694.");
        if (card.memory.last_review && Date.parse(command.at) < Date.parse(card.memory.last_review)) fail3("INVALID_TIME", "\uC9C0\uB09C \uBCF5\uC2B5 \uC774\uD6C4\uC758 \uC2DC\uAC01\uC73C\uB85C \uAE30\uB85D\uD574 \uC8FC\uC138\uC694.");
        let memoId = null;
        if (command.memo) {
          validateMemoContent({ ...command.memo, ownerId: topic.id });
          if (!command.memo.body.trim() && !command.memo.strokes.length) fail3("INVALID_RECALL", "\uBE48 \uBA54\uBAA8 \uB300\uC2E0 \uC790\uAE30 \uD3C9\uAC00\uB9CC \uC800\uC7A5\uD574 \uC8FC\uC138\uC694.");
          memoId = command.memo.id;
          const saved = next.memos?.find((row) => row.id === memoId);
          if (saved) {
            if (saved.deletedAt || saved.ownerId !== topic.id || saved.recallCardId !== void 0 && saved.recallCardId !== card.id || saved.body !== command.memo.body || canonical2(saved.strokes) !== canonical2(command.memo.strokes)) fail3("VERSION_CONFLICT", "\uB2F5\uBCC0 \uBA54\uBAA8\uAC00 \uBC14\uB00C\uC5C8\uC2B5\uB2C8\uB2E4. \uCD08\uC548\uC744 \uBCF4\uC874\uD588\uC2B5\uB2C8\uB2E4.");
          } else {
            fresh(memoId);
            write("memos", { ...common(memoId), ownerId: topic.id, recallCardId: card.id, body: command.memo.body, strokes: clone(command.memo.strokes) });
          }
        }
        const options = recallOptions(next, card.deckId), memory = serializeMemory(recallPreview(card.memory, command.at, options, card.reviews)[command.rating].card);
        const { manualDue: _manualDue, ...base } = card;
        write("recallCards", { ...base, memory, reviews: [...card.reviews, { id: command.opId, at: command.at, rating: command.rating, memoId, before: clone(card.memory), after: clone(memory), options: clone(options) }] });
      }
      break;
    }
    case "saveCodeExample": {
      validateCodeContent(command.content);
      const old = next.codeExamples?.find((row) => row.id === command.id);
      if (old) {
        find(next.codeExamples, old.id);
        expected(old, command.expectedVersion, command);
      } else {
        if (command.expectedVersion !== 0) fail3("VERSION_CONFLICT", "\uCF54\uB4DC \uC608\uC81C\uC758 \uC218\uC815 \uC21C\uC11C\uB97C \uD655\uC778\uD574 \uC8FC\uC138\uC694.");
        fresh(command.id);
      }
      write("codeExamples", { ...old ?? common(command.id), ...clone(codeContent(command.content)) });
      break;
    }
    case "trashCodeExample":
    case "restoreCodeExample": {
      const row = find(next.codeExamples ?? [], command.id, command.type === "trashCodeExample");
      expected(row, command.expectedVersion, command);
      write("codeExamples", { ...row, deletedAt: command.type === "trashCodeExample" ? command.at : null });
      break;
    }
    case "saveStudyBoard": {
      validateBoard(command.content);
      verifyBoardTopics(command.content, next);
      const old = next.studyBoards?.find((row) => row.id === command.id);
      if (old) {
        find(next.studyBoards, old.id);
        expected(old, command.expectedVersion, command);
      } else {
        if (command.expectedVersion !== 0) fail3("VERSION_CONFLICT", "\uBCF4\uB4DC\uC758 \uC218\uC815 \uC21C\uC11C\uB97C \uD655\uC778\uD574 \uC8FC\uC138\uC694.");
        fresh(command.id);
      }
      write("studyBoards", { ...old ?? common(command.id), ...clone(boardContent(command.content)) });
      break;
    }
    case "saveCanvasLayout": {
      validateCanvasLayout(command);
      const old = next.canvasLayouts?.find((row) => row.id === command.id);
      if (old) {
        find(next.canvasLayouts, old.id);
        expected(old, command.expectedVersion, command);
      } else {
        if (command.expectedVersion !== 0) fail3("VERSION_CONFLICT", "Canvas \uBC30\uCE58\uC758 \uC218\uC815 \uC21C\uC11C\uB97C \uD655\uC778\uD574 \uC8FC\uC138\uC694.");
        fresh(command.id);
      }
      write("canvasLayouts", { ...old ?? common(command.id), positions: clone(command.positions), links: clone(command.links), ...command.viewport ? { viewport: clone(command.viewport) } : {} });
      break;
    }
    case "saveLearningPlan": {
      verifyLearningPlan(command.workspace, next);
      const row = next.learningPlans?.find((item) => item.id === command.id);
      if (row) expected(row, command.expectedVersion, command);
      else {
        if (command.expectedVersion !== 0) fail3("VERSION_CONFLICT", "\uD559\uC2B5 \uC77C\uC815\uC774 \uBC14\uB00C\uC5C8\uC2B5\uB2C8\uB2E4. \uC791\uC131 \uB0B4\uC6A9\uC744 \uC720\uC9C0\uD588\uC2B5\uB2C8\uB2E4.");
        fresh(command.id);
      }
      write("learningPlans", { ...row ?? common(command.id), workspace: clone(command.workspace) });
      break;
    }
    case "addSemester":
      fresh(command.id);
      write("semesters", { ...common(command.id), name: title(command.name), order: next.semesters.length });
      break;
    case "addSubject":
      fresh(command.id);
      verifyScope(next, command.scope);
      write("subjects", { ...common(command.id), name: title(command.name), scope: clone(command.scope), order: next.subjects.length });
      break;
    case "createOutlineTable": {
      if (command.expectedToken !== outlineTableToken(next)) fail3("OUTLINE_STALE", "\uBAA9\uCC28\uAC00 \uBCC0\uACBD\uB418\uC5C8\uC2B5\uB2C8\uB2E4. \uC785\uB825\uC740 \uC720\uC9C0\uD558\uACE0 \uC0DD\uC131\uD560 \uAD6C\uC870\uB97C \uB2E4\uC2DC \uD655\uC778\uD574 \uC8FC\uC138\uC694.");
      const preview = previewOutlineTable(next, command);
      if (!preview.ready) fail3("OUTLINE_CHOICE_REQUIRED", "\uAC19\uC740 \uC774\uB984\uC758 \uD56D\uBAA9\uC744 \uC5B4\uB5BB\uAC8C \uC0AC\uC6A9\uD560\uC9C0 \uBA3C\uC800 \uACE8\uB77C \uC8FC\uC138\uC694.");
      if (!preview.newCount) fail3("EMPTY_OUTLINE_TABLE", "\uC0C8\uB85C \uB9CC\uB4E4 \uD56D\uBAA9\uC774 \uC5C6\uC2B5\uB2C8\uB2E4. \uAE30\uC874 \uD56D\uBAA9 \uC5F0\uACB0\uC744 \uD655\uC778\uD574 \uC8FC\uC138\uC694.");
      if (!command.ids || typeof command.ids !== "object" || Array.isArray(command.ids)) fail3("INVALID_ID", "\uC0C8 \uD56D\uBAA9\uC758 \uC2DD\uBCC4\uC790\uB97C \uD655\uC778\uD574 \uC8FC\uC138\uC694.");
      const used = /* @__PURE__ */ new Set(), resolved = /* @__PURE__ */ new Map();
      for (const entry of preview.entries) if (entry.status === "new") {
        if (!Object.hasOwn(command.ids, entry.key)) fail3("INVALID_ID", "\uC0C8 \uD56D\uBAA9\uC758 \uC2DD\uBCC4\uC790\uB97C \uD655\uC778\uD574 \uC8FC\uC138\uC694.");
        const id = command.ids[entry.key];
        fresh(id);
        if (used.has(id)) fail3("DUPLICATE_ID", "\uCD94\uAC00\uD560 \uD56D\uBAA9\uC758 \uC2DD\uBCC4\uC790\uAC00 \uACB9\uCCE4\uC2B5\uB2C8\uB2E4.");
        used.add(id);
      }
      for (const entry of preview.entries) {
        if (entry.status === "reuse") {
          resolved.set(entry.key, entry.id);
          continue;
        }
        const id = command.ids[entry.key];
        if (entry.kind === "subject") write("subjects", { ...common(id), name: entry.name, scope: clone(command.scope), order: Math.max(-1, ...next.subjects.map((row) => row.order)) + 1 });
        else {
          const subjectId = resolved.get(entry.subjectKey), parentId = entry.kind === "unit" ? null : resolved.get(entry.parentKey);
          const order = Math.max(-1, ...next.nodes.filter((row) => row.subjectId === subjectId && row.parentId === parentId).map((row) => row.order)) + 1;
          write("nodes", { ...common(id), name: entry.name, subjectId, parentId, role: entry.kind, order });
        }
        resolved.set(entry.key, id);
      }
      break;
    }
    case "addNode": {
      fresh(command.id);
      find(next.subjects, command.subjectId);
      if (!["unit", "outline", "topic"].includes(command.role)) fail3("INVALID_ROLE", "\uBAA9\uCC28 \uD56D\uBAA9\uC758 \uC5ED\uD560\uC744 \uD655\uC778\uD574 \uC8FC\uC138\uC694.");
      if (command.parentId !== null && targetSubject(next, command.parentId) !== command.subjectId) fail3("SUBJECT_MISMATCH", "\uBD80\uBAA8 \uD56D\uBAA9\uC758 \uACFC\uBAA9\uC774 \uB2E4\uB985\uB2C8\uB2E4.");
      if (command.parentId !== null) find(next.nodes, command.parentId);
      const order = Math.max(-1, ...next.nodes.filter((n) => n.subjectId === command.subjectId && n.parentId === command.parentId).map((n) => n.order)) + 1;
      write("nodes", { ...common(command.id), subjectId: command.subjectId, parentId: command.parentId, role: command.role, name: title(command.name), order });
      break;
    }
    case "addNodes":
    case "reorderNodes": {
      find(next.subjects, command.subjectId);
      if (command.parentId !== null) {
        const parent = find(next.nodes, command.parentId);
        if (targetSubject(next, parent.id) !== command.subjectId) fail3("SUBJECT_MISMATCH", "\uBD80\uBAA8 \uD56D\uBAA9\uC758 \uACFC\uBAA9\uC774 \uB2E4\uB985\uB2C8\uB2E4.");
      }
      if (command.expectedToken !== outlineRevisionToken(next, command.subjectId, command.parentId)) fail3("OUTLINE_STALE", "\uBAA9\uCC28\uAC00 \uBCC0\uACBD\uB418\uC5C8\uC2B5\uB2C8\uB2E4. \uC785\uB825\uC740 \uC720\uC9C0\uD558\uACE0 \uD604\uC7AC \uAD6C\uC870\uB97C \uB2E4\uC2DC \uD655\uC778\uD574 \uC8FC\uC138\uC694.");
      const siblings = next.nodes.filter((row) => row.subjectId === command.subjectId && row.parentId === command.parentId && !row.deletedAt);
      if (command.type === "reorderNodes") {
        if (!Array.isArray(command.ids) || command.ids.length !== siblings.length || new Set(command.ids).size !== command.ids.length) fail3("INVALID_ORDER", "\uAC19\uC740 \uC704\uCE58\uC758 \uD56D\uBAA9 \uC804\uCCB4\uB97C \uD55C \uBC88\uC529 \uC815\uB82C\uD574 \uC8FC\uC138\uC694.");
        const byId = new Map(siblings.map((row) => [row.id, row]));
        for (const id of command.ids) {
          identity(id);
          if (!byId.has(id)) fail3("INVALID_ORDER", "\uAC19\uC740 \uACFC\uBAA9\uACFC \uBD80\uBAA8 \uC544\uB798\uC758 \uD56D\uBAA9\uB9CC \uC815\uB82C\uD560 \uC218 \uC788\uC2B5\uB2C8\uB2E4.");
        }
        command.ids.forEach((id, order) => write("nodes", { ...byId.get(id), order }));
      } else {
        if (!["unit", "outline", "topic"].includes(command.role)) fail3("INVALID_ROLE", "\uBAA9\uCC28 \uD56D\uBAA9\uC758 \uC5ED\uD560\uC744 \uD655\uC778\uD574 \uC8FC\uC138\uC694.");
        if (!Array.isArray(command.entries) || !command.entries.length || command.entries.length > MAX_OUTLINE_ROWS || command.entries.some((entry) => !entry || typeof entry !== "object")) fail3("INVALID_OUTLINE_ROWS", `\uCD94\uAC00\uD560 \uD56D\uBAA9\uC744 1\uAC1C\uBD80\uD130 ${MAX_OUTLINE_ROWS}\uAC1C\uAE4C\uC9C0 \uD655\uC778\uD574 \uC8FC\uC138\uC694.`);
        const preview = previewOutlineEntries(command.entries.map((entry) => entry.name));
        if (preview.issues.length || preview.entries.length !== command.entries.length) fail3("INVALID_OUTLINE_ROWS", "\uBE48 \uC774\uB984\xB7\uBC18\uBCF5\uB41C \uC774\uB984\xB7\uAE38\uC774\uB97C \uBBF8\uB9AC\uBCF4\uAE30\uC5D0\uC11C \uD655\uC778\uD574 \uC8FC\uC138\uC694.", preview.issues);
        if (command.duplicateNames !== "create" && preview.entries.some((entry) => siblings.some((row) => row.name === entry.name))) fail3("DUPLICATE_NAME_CHOICE", "\uAC19\uC740 \uC774\uB984\uC758 \uD56D\uBAA9\uC774 \uC788\uC2B5\uB2C8\uB2E4. \uAE30\uC874 \uD56D\uBAA9\uC744 \uC0AC\uC6A9\uD560\uC9C0 \uC0C8\uB85C \uB9CC\uB4E4\uC9C0 \uACE8\uB77C \uC8FC\uC138\uC694.");
        const ids = /* @__PURE__ */ new Set();
        for (const entry of command.entries) {
          fresh(entry.id);
          if (ids.has(entry.id)) fail3("DUPLICATE_ID", "\uCD94\uAC00\uD560 \uD56D\uBAA9\uC758 \uC2DD\uBCC4\uC790\uAC00 \uACB9\uCCE4\uC2B5\uB2C8\uB2E4.");
          ids.add(entry.id);
        }
        let order = Math.max(-1, ...next.nodes.filter((row) => row.subjectId === command.subjectId && row.parentId === command.parentId).map((row) => row.order)) + 1;
        command.entries.forEach((entry, index) => write("nodes", { ...common(entry.id), subjectId: command.subjectId, parentId: command.parentId, role: command.role, name: preview.entries[index].name, order: order++ }));
      }
      break;
    }
    case "renameNode": {
      const row = node(command.id, command.expectedVersion);
      write("nodes", { ...row, name: title(command.name) });
      break;
    }
    case "moveNode": {
      const row = node(command.id, command.expectedVersion);
      if (command.parentId !== null) {
        const parent = find(next.nodes, command.parentId);
        if (targetSubject(next, parent.id) !== row.subjectId) fail3("SUBJECT_MISMATCH", "\uACFC\uBAA9 \uAC04 \uC774\uB3D9\uC740 \uBCC4\uB3C4 \uBCF5\uC0AC \uC808\uCC28\uAC00 \uD544\uC694\uD569\uB2C8\uB2E4.");
      }
      const order = command.order ?? next.nodes.filter((n) => n.subjectId === row.subjectId && n.parentId === command.parentId).length;
      if (!Number.isSafeInteger(order) || order < 0) fail3("INVALID_ORDER", "\uC815\uB82C \uC21C\uC11C\uB97C \uD655\uC778\uD574 \uC8FC\uC138\uC694.");
      write("nodes", { ...row, parentId: command.parentId, order });
      break;
    }
    case "trashNode": {
      const root = node(command.id, command.expectedVersion), ids = /* @__PURE__ */ new Set([root.id]);
      let changed = true;
      while (changed) {
        changed = false;
        for (const row of next.nodes) if (row.parentId && ids.has(row.parentId) && !ids.has(row.id)) {
          ids.add(row.id);
          changed = true;
        }
      }
      for (const row of [...next.nodes]) if (ids.has(row.id) && !row.deletedAt) write("nodes", { ...row, deletedAt: command.at, deletionBatchId: command.opId });
      break;
    }
    case "restoreNode": {
      const root = node(command.id, command.expectedVersion, false);
      if (!root.deletedAt) break;
      if (root.parentId && find(next.nodes, root.parentId, false).deletedAt) fail3("PARENT_DELETED", "\uC0C1\uC704 \uD56D\uBAA9\uC744 \uBA3C\uC800 \uBCF5\uC6D0\uD574 \uC8FC\uC138\uC694.");
      const batch = root.deletionBatchId;
      for (const row of [...next.nodes]) if (row.id === root.id || batch && row.deletionBatchId === batch) {
        const copy = { ...row, deletedAt: null };
        delete copy.deletionBatchId;
        write("nodes", copy);
      }
      break;
    }
    case "saveRecords": {
      validateDateEvidence(command.dateEvidence);
      identity(command.sessionId);
      if (!command.entries.length) fail3("EMPTY_RECORD", "\uACF5\uBD80\uD55C \uB300\uC0C1\uC744 \uD558\uB098 \uC774\uC0C1 \uACE8\uB77C \uC8FC\uC138\uC694.");
      if (new Set(command.entries.map((e) => e.targetId)).size !== command.entries.length) fail3("DUPLICATE_TARGET", "\uAC19\uC740 \uB300\uC0C1\uC744 \uB450 \uBC88 \uAE30\uB85D\uD560 \uC218 \uC5C6\uC2B5\uB2C8\uB2E4.");
      const session = next.sessions.find((s) => s.id === command.sessionId);
      if (session?.deletedAt) fail3("DELETED_SESSION", "\uD734\uC9C0\uD1B5\uC758 \uACF5\uBD80 \uAE30\uB85D\uC740 \uBA3C\uC800 \uBCF5\uC6D0\uD574 \uC8FC\uC138\uC694.");
      if (!session) {
        fresh(command.sessionId);
        write("sessions", { ...common(command.sessionId), dateEvidence: clone(command.dateEvidence) });
      }
      for (const entry of command.entries) {
        const subjectId = targetSubject(next, entry.targetId);
        if (entry.subjectId !== void 0 && entry.subjectId !== subjectId) fail3("SUBJECT_MISMATCH", "\uAE30\uB85D\uC758 \uACFC\uBAA9\uACFC \uB300\uC0C1\uC774 \uB2E4\uB985\uB2C8\uB2E4.");
        const old = next.records.find((r) => r.sessionId === command.sessionId && r.targetId === entry.targetId);
        if (old) expected(old, entry.expectedVersion ?? -1, command);
        const id = old?.id ?? `record:${encodeURIComponent(command.sessionId)}:${encodeURIComponent(entry.targetId)}`;
        if (!old) fresh(id);
        const trace = entry.trace ? mergeTrace(old?.trace ?? {}, entry.trace) : old?.trace ?? {};
        write("records", { ...old ?? common(id), sessionId: command.sessionId, subjectId, targetId: entry.targetId, done: entry.done, body: entry.body ?? old?.body ?? "", dateEvidence: clone(command.dateEvidence), trace });
      }
      break;
    }
    case "updateRecord": {
      const row = find(next.records, command.id);
      expected(row, command.expectedVersion, command.patch);
      if (Object.keys(command.patch).some((k) => !["body", "done", "dateEvidence", "trace"].includes(k))) fail3("INVALID_PATCH", "\uAE30\uB85D\uC758 \uC18C\uC18D\uC740 \uC77C\uBC18 \uC218\uC815\uC73C\uB85C \uBC14\uAFC0 \uC218 \uC5C6\uC2B5\uB2C8\uB2E4.");
      write("records", { ...row, ...clone(command.patch), trace: command.patch.trace ? mergeTrace(row.trace, command.patch.trace) : row.trace });
      break;
    }
    case "updateNarrative": {
      const old = next.narratives.find((n) => n.id === command.id);
      if (old) {
        expected(old, command.expectedVersion, command.body);
        if (old.kind !== command.kind || old.ownerId !== command.ownerId) fail3("OWNER_CHANGED", "\uBCF8\uBB38\uC758 \uC5F0\uACB0 \uB300\uC0C1\uC740 \uC77C\uBC18 \uC218\uC815\uC73C\uB85C \uBC14\uAFC0 \uC218 \uC5C6\uC2B5\uB2C8\uB2E4.");
      } else {
        if (command.expectedVersion !== 0) fail3("VERSION_CONFLICT", "\uBCF8\uBB38\uC758 \uC800\uC7A5 \uC0C1\uD0DC\uB97C \uD655\uC778\uD574 \uC8FC\uC138\uC694.");
        fresh(command.id);
      }
      const value = { ...old ?? common(command.id), kind: command.kind, ownerId: command.ownerId, body: command.body };
      verifyNarrative(next, value);
      write("narratives", value);
      break;
    }
    case "saveInkWorkspace": {
      const old = next.inkWorkspaces?.find((row) => row.id === command.id);
      if (old) {
        find(next.inkWorkspaces, old.id);
        expected(old, command.expectedVersion, command);
        if (old.key !== command.key) fail3("OWNER_CHANGED", "\uD544\uAE30 \uC124\uC815\uC758 \uC5F0\uACB0\uC744 \uBC14\uAFC0 \uC218 \uC5C6\uC2B5\uB2C8\uB2E4.");
      } else {
        if (command.expectedVersion !== 0) fail3("VERSION_CONFLICT", "\uD544\uAE30 \uC124\uC815\uC758 \uC800\uC7A5 \uC0C1\uD0DC\uB97C \uD655\uC778\uD574 \uC8FC\uC138\uC694.");
        fresh(command.id);
      }
      if (typeof command.key !== "string" || !command.key || command.key.length > 512 || (next.inkWorkspaces ?? []).some((row) => row.id !== command.id && row.key === command.key)) fail3("INVALID_INK_WORKSPACE", "\uD544\uAE30 \uC124\uC815\uC758 \uC5F0\uACB0\uC744 \uD655\uC778\uD574 \uC8FC\uC138\uC694.");
      validateInkWorkspace(command.content);
      write("inkWorkspaces", { ...old ?? common(command.id), key: command.key, content: clone(command.content) });
      break;
    }
    case "importConceptCatalog": {
      validateConceptCatalog(command);
      const same = next.conceptCatalogs?.find((c) => c.sha256 === command.sha256);
      if (same) {
        if (same.raw !== command.raw) fail3("CONCEPT_SOURCE_CONFLICT", "\uAC19\uC740 \uD574\uC2DC\uC758 \uC6D0\uBB38\uC774 \uB2E4\uB985\uB2C8\uB2E4. \uB450 \uD30C\uC77C\uC744 \uBCF4\uC874\uD558\uACE0 \uD655\uC778\uD574 \uC8FC\uC138\uC694.");
        break;
      }
      fresh(command.id);
      write("conceptCatalogs", { ...common(command.id), raw: command.raw, sha256: command.sha256, filename: command.filename });
      break;
    }
    case "saveConceptEdition": {
      validateConceptEdition(command.content);
      const old = next.conceptEditions?.find((c) => c.id === command.id);
      if (old) {
        find(next.conceptEditions, old.id);
        expected(old, command.expectedVersion, command);
      } else {
        if (command.expectedVersion !== 0) fail3("VERSION_CONFLICT", "\uAC1C\uB150\uC758 \uC800\uC7A5 \uC21C\uC11C\uB97C \uD655\uC778\uD574 \uC8FC\uC138\uC694.");
        fresh(command.id);
      }
      const { catalogId, sourceId } = command.content;
      const catalog = find(next.conceptCatalogs ?? [], catalogId);
      if (!parseConceptSource(catalog.raw).items.some((i) => i.id === sourceId)) fail3("INVALID_CONCEPT", "\uAC1C\uB150\uC758 \uC6D0\uBB38\uC744 \uCC3E\uC744 \uC218 \uC5C6\uC2B5\uB2C8\uB2E4.");
      if (old && (old.catalogId !== catalogId || old.sourceId !== sourceId)) fail3("OWNER_CHANGED", "\uAE30\uC874 \uC124\uBA85\uC758 \uC6D0\uBB38 \uC5F0\uACB0\uC740 \uBCC0\uACBD\uD560 \uC218 \uC5C6\uC2B5\uB2C8\uB2E4.");
      if ((next.conceptEditions ?? []).some((c) => c.id !== command.id && c.catalogId === catalogId && c.sourceId === sourceId)) fail3("DUPLICATE_ID", "\uAC19\uC740 \uAC1C\uB150\uC758 \uC81C\uC791 \uAE30\uB85D\uC774 \uC774\uBBF8 \uC788\uC2B5\uB2C8\uB2E4.");
      const changed = !old || ["displayType", "secondaryTypes", "reason", "screen", "evidence"].some((k) => canonical2(old[k]) !== canonical2(command.content[k]));
      if (changed && (command.content.status === "published" || Object.values(command.content.checks).some(Boolean))) fail3("CONCEPT_REVIEW_REQUIRED", "\uC124\uBA85\uC774\uB098 \uADFC\uAC70\uAC00 \uBC14\uB00C\uC5C8\uC2B5\uB2C8\uB2E4. \uB0B4\uC6A9\uC744 \uC800\uC7A5\uD55C \uB4A4 \uB2E4\uC2DC \uAC80\uD1A0\uD574 \uC8FC\uC138\uC694.");
      if (command.content.jobId !== null && !next.conceptBatches?.some((b) => b.id === command.content.jobId && b.catalogId === catalogId && b.sourceIds.includes(sourceId))) fail3("INVALID_CONCEPT", "\uC0DD\uC131 \uB2F9\uC2DC \uC791\uC5C5 \uBB36\uC74C\uC744 \uD655\uC778\uD574 \uC8FC\uC138\uC694.");
      write("conceptEditions", { ...clone(command.content), ...old ? { id: old.id, userId: old.userId, namespace: old.namespace, version: old.version, createdAt: old.createdAt, updatedAt: old.updatedAt, deletedAt: old.deletedAt } : common(command.id) });
      break;
    }
    case "saveConceptBatch": {
      validateConceptBatch(command.content);
      const old = next.conceptBatches?.find((b) => b.id === command.id);
      if (old) {
        find(next.conceptBatches, old.id);
        expected(old, command.expectedVersion, command);
      } else {
        if (command.expectedVersion !== 0) fail3("VERSION_CONFLICT", "\uC791\uC5C5 \uBB36\uC74C\uC758 \uC800\uC7A5 \uC21C\uC11C\uB97C \uD655\uC778\uD574 \uC8FC\uC138\uC694.");
        fresh(command.id);
      }
      const catalog = find(next.conceptCatalogs ?? [], command.content.catalogId);
      const sourceIds = new Set(parseConceptSource(catalog.raw).items.map((i) => i.id));
      if (command.content.sourceIds.some((id) => !sourceIds.has(id))) fail3("INVALID_CONCEPT", "\uC791\uC5C5 \uBB36\uC74C\uC758 \uAC1C\uB150\uC744 \uCC3E\uC744 \uC218 \uC5C6\uC2B5\uB2C8\uB2E4.");
      if (old && ["catalogId", "sourceIds", "baseVersions"].some((k) => canonical2(old[k]) !== canonical2(command.content[k]))) fail3("OWNER_CHANGED", "\uAE30\uC874 \uC791\uC5C5 \uBB36\uC74C\uC758 \uB300\uC0C1\uACFC \uC2DC\uC791 \uBC84\uC804\uC740 \uBCC0\uACBD\uD560 \uC218 \uC5C6\uC2B5\uB2C8\uB2E4.");
      write("conceptBatches", { ...clone(command.content), ...old ? { id: old.id, userId: old.userId, namespace: old.namespace, version: old.version, createdAt: old.createdAt, updatedAt: old.updatedAt, deletedAt: old.deletedAt } : common(command.id) });
      break;
    }
    case "saveMemo": {
      const old = next.memos?.find((row) => row.id === command.id);
      if (old) {
        find(next.memos, old.id);
        expected(old, command.expectedVersion, command);
      } else {
        if (command.expectedVersion !== 0) fail3("VERSION_CONFLICT", "\uBA54\uBAA8\uC758 \uC800\uC7A5 \uC0C1\uD0DC\uB97C \uD655\uC778\uD574 \uC8FC\uC138\uC694.");
        fresh(command.id);
      }
      validateMemoContent(command);
      if (command.document) {
        const f = command.document.file, prefix = next.namespace === "demo" ? "study-space:demo" : `study-space:${next.namespace}:${encodeURIComponent(next.userId)}`;
        if (f.key !== `${prefix}:material:${encodeURIComponent(`document:${f.sha256}`)}` || f.cloudPath !== void 0 && f.cloudPath !== `${next.userId}/${next.namespace}/document/${f.sha256}`) fail3("OWNERSHIP", "\uB2E4\uB978 \uACF5\uAC04\uC758 PDF \uC6D0\uBCF8\uC744 \uC5F0\uACB0\uD560 \uC218 \uC5C6\uC2B5\uB2C8\uB2E4.");
        if (old?.document && old.document.file.sha256 !== f.sha256) fail3("OWNER_CHANGED", "\uAE30\uC874 PDF \uC6D0\uBCF8\uC744 \uC720\uC9C0\uD569\uB2C8\uB2E4. \uB2E4\uB978 PDF\uB294 \uC0C8 \uBA54\uBAA8\uC5D0 \uC5F0\uACB0\uD574 \uC8FC\uC138\uC694.");
      }
      if (command.ownerId !== null) targetSubject(next, command.ownerId, old?.ownerId !== command.ownerId);
      if (command.recallCardId !== void 0 && !(next.recallCards ?? []).some((card) => !card.deletedAt && card.id === command.recallCardId && card.topicId === command.ownerId)) fail3("INVALID_MEMO", "\uB2F5\uBCC0 \uBA54\uBAA8\uC758 \uCE74\uB4DC \uC5F0\uACB0\uC744 \uD655\uC778\uD574 \uC8FC\uC138\uC694.");
      write("memos", { ...old ?? common(command.id), ...command.recallCardId ? { recallCardId: command.recallCardId } : {}, ownerId: command.ownerId, body: command.body, strokes: clone(command.strokes), ...command.document ? { document: clone(command.document) } : {} });
      break;
    }
    case "trashMemo":
    case "restoreMemo": {
      const row = find(next.memos ?? [], command.id, command.type === "trashMemo");
      expected(row, command.expectedVersion, command);
      write("memos", { ...row, deletedAt: command.type === "trashMemo" ? command.at : null });
      break;
    }
    case "adjustCriteria": {
      find(next.nodes, command.targetId);
      targetSubject(next, command.targetId);
      if (command.expectedToken !== criteriaRevisionToken(next)) fail3("CRITERIA_STALE", "\uAE30\uC900\uC774\uB098 \uBAA9\uCC28\uAC00 \uBCC0\uACBD\uB418\uC5C8\uC2B5\uB2C8\uB2E4. \uC785\uB825\uC740 \uC720\uC9C0\uD558\uACE0 \uD604\uC7AC \uBC94\uC704\uB97C \uB2E4\uC2DC \uD655\uC778\uD574 \uC8FC\uC138\uC694.");
      fresh(command.id);
      if (!Array.isArray(command.items) || command.items.length > 100 || new Set(command.items.map((item) => item.id)).size !== command.items.length) fail3("INVALID_CRITERIA", "\uAE30\uC900\uC740 \uC11C\uB85C \uB2E4\uB978 \uD56D\uBAA9 100\uAC1C\uAE4C\uC9C0 \uC870\uC815\uD560 \uC218 \uC788\uC2B5\uB2C8\uB2E4.");
      const known = new Map(defaultCriteriaItems().map((item) => [item.id, item]));
      for (const criteria of next.criteria ?? []) for (const item of criteria.items) known.set(item.id, item);
      for (const item of command.items) {
        validateTraceDefinition(item);
        if (item.label.length > 180) fail3("INVALID_CRITERIA", "\uD56D\uBAA9 \uBB38\uAD6C\uB294 180\uC790 \uC774\uB0B4\uB85C \uC785\uB825\uD574 \uC8FC\uC138\uC694.");
        const old = known.get(item.id);
        if (old && canonical2(old) !== canonical2(item)) fail3("CRITERIA_ID_REUSED", "\uB73B\uC774\uB098 \uC801\uC6A9 \uAE30\uC900\uC774 \uBC14\uB010 \uD65C\uB3D9\uC740 \uC0C8 \uD56D\uBAA9\uC73C\uB85C \uAD6C\uBCC4\uD574 \uC8FC\uC138\uC694.");
      }
      const targets = criteriaScopeTargets(next, command.targetId, command.scope);
      write("criteria", { ...common(command.id), items: clone(command.items) });
      for (const target of targets) {
        const old = next.criteriaAssignments?.find((row) => row.scope === target.scope && row.ownerId === target.ownerId);
        let suffix = next.revisions.length;
        while (!old && collections.some((collection) => (next[collection] ?? []).some((row) => row.id === `criteria-assignment:${suffix}`))) suffix++;
        const id = old?.id ?? `criteria-assignment:${suffix}`;
        if (!old) fresh(id);
        const assignment = { ...old ?? common(id), ...target, criteriaId: command.id, deletedAt: null };
        delete assignment.deletionBatchId;
        write("criteriaAssignments", assignment);
      }
      break;
    }
    case "editWrittenReview":
    case "confirmWrittenReview":
    case "unconfirmWrittenReview": {
      const row = find(next.records, command.recordId);
      expected(row, command.expectedVersion, command);
      const trace = clone(row.trace), item = trace[WRITTEN_REVIEW_ITEM_ID] ?? { status: "unchecked" };
      if (command.type === "editWrittenReview") {
        if (typeof command.answer !== "string") fail3("INVALID_BODY", "\uC11C\uC220\uC744 \uAE00\uB85C \uC785\uB825\uD574 \uC8FC\uC138\uC694.");
        item.examReview = { answer: command.answer, checked: false, updatedAt: command.at };
      } else if (command.type === "unconfirmWrittenReview") {
        if (item.examReview) item.examReview = { ...item.examReview, checked: false, updatedAt: command.at };
      } else {
        if (!item.examReview?.answer.trim()) fail3("EMPTY_WRITTEN_REVIEW", "\uC810\uAC80\uD558\uB824\uBA74 \uBA3C\uC800 \uC790\uAE30 \uBB38\uC7A5\uC73C\uB85C \uC11C\uC220\uD574 \uC8FC\uC138\uC694.");
        item.status = "checked";
        item.examReview = { ...item.examReview, checked: true, updatedAt: command.at };
      }
      trace[WRITTEN_REVIEW_ITEM_ID] = item;
      write("records", { ...row, trace });
      break;
    }
    case "undoRevision": {
      const revision = next.revisions.find((r) => r.id === command.revisionId);
      if (!revision) fail3("NOT_FOUND", "\uB418\uB3CC\uB9B4 \uC218\uC815 \uC774\uB825\uC744 \uCC3E\uC744 \uC218 \uC5C6\uC2B5\uB2C8\uB2E4.");
      const row = find(next[revision.collection] ?? [], revision.entityId, false);
      expected(row, command.expectedVersion, command);
      const latest = [...next.revisions].reverse().find((r) => r.collection === revision.collection && r.entityId === revision.entityId);
      if (latest?.id !== revision.id) fail3("UNDO_CONFLICT", "\uADF8 \uB4A4\uC758 \uBCC0\uACBD\uC774 \uC788\uC2B5\uB2C8\uB2E4. \uD604\uC7AC \uC6D0\uBB38\uACFC \uC774\uB825\uC744 \uBE44\uAD50\uD574 \uC8FC\uC138\uC694.");
      const group = next.revisions.filter((r) => r.operationId === revision.operationId);
      const affectedInGroup = new Set(group.map((r) => r.entityId));
      for (const item of group) {
        if (item.before === null) {
          const external = (row2) => !row2.deletedAt && !affectedInGroup.has(row2.id);
          const referenced = next.subjects.some((s) => external(s) && s.scope.kind === "semester" && s.scope.semesterId === item.entityId) || next.nodes.some((n) => external(n) && (n.subjectId === item.entityId || n.parentId === item.entityId)) || next.records.some((r) => external(r) && (r.sessionId === item.entityId || r.targetId === item.entityId)) || next.narratives.some((n) => external(n) && n.ownerId === item.entityId) || (next.memos ?? []).some((memo) => external(memo) && memo.ownerId === item.entityId) || (next.recallCards ?? []).some((card) => external(card) && (card.topicId === item.entityId || card.reviews.some((review) => review.memoId === item.entityId))) || (next.criteriaAssignments ?? []).some((assignment) => external(assignment) && (assignment.criteriaId === item.entityId || assignment.ownerId === item.entityId));
          if (referenced) fail3("UNDO_DEPENDENCY", "\uADF8 \uB4A4 \uC5F0\uACB0\uB41C \uB0B4\uC6A9\uC774 \uC788\uC2B5\uB2C8\uB2E4. \uD56D\uBAA9\uC744 \uC9C0\uC6B0\uC9C0 \uC54A\uACE0 \uD604\uC7AC \uC790\uB8CC\uB97C \uBCF4\uC874\uD588\uC2B5\uB2C8\uB2E4.");
        }
        const current = find(next[item.collection] ?? [], item.entityId, false);
        if (current.version !== item.after.version || [...next.revisions].reverse().find((r) => r.collection === item.collection && r.entityId === item.entityId)?.id !== item.id) fail3("UNDO_CONFLICT", "\uD568\uAED8 \uBCC0\uACBD\uD55C \uD56D\uBAA9\uC774 \uB2E4\uC2DC \uC218\uC815\uB418\uC5B4 \uC790\uB3D9\uC73C\uB85C \uB418\uB3CC\uB9B4 \uC218 \uC5C6\uC2B5\uB2C8\uB2E4.");
      }
      for (const item of group) {
        const current = find(next[item.collection] ?? [], item.entityId, false);
        const restored = item.before ? { ...clone(item.before), version: current.version } : { ...current, deletedAt: command.at, deletionBatchId: command.opId };
        write(item.collection, restored, item.id);
      }
      break;
    }
    default:
      fail3("UNKNOWN_COMMAND", "\uC9C0\uC6D0\uD558\uC9C0 \uC54A\uB294 \uC870\uC791\uC785\uB2C8\uB2E4.");
  }
  Object.defineProperty(next.appliedOps, command.opId, { value: payload, enumerable: true, configurable: true, writable: true });
  assertState(next);
  return next;
}
var validateState = assertState;

// src/server/state-codec.ts
function packServerState(state, operationId) {
  validateState(state);
  const raw = JSON.stringify(state), encoded = import_lz_string.default.compressToBase64(raw);
  if (import_lz_string.default.decompressFromBase64(encoded) !== raw) throw new DomainError("ENCODING", "\uC6D0\uBB38 \uBCF4\uC874\uC744 \uD655\uC778\uD558\uC9C0 \uBABB\uD588\uC2B5\uB2C8\uB2E4. \uC800\uC7A5\uD558\uC9C0 \uC54A\uC558\uC2B5\uB2C8\uB2E4.");
  const collections2 = ["conceptCatalogs", "conceptEditions", "conceptBatches", "studyBoards", "semesters", "subjects", "nodes", "sessions", "records", "narratives", "criteria", "criteriaAssignments", "memos", "learningPlans", "canvasLayouts", "codeExamples", "recallCards", "recallPreferences", "studyMaterials", "memoryCards", "memoryTests", "inkWorkspaces", "revisions"];
  return {
    userId: state.userId,
    namespace: state.namespace,
    schemaVersion: state.schemaVersion,
    encoding: "lz-base64-utf16-v1",
    encoded,
    appliedOps: Object.fromEntries((Array.isArray(operationId) ? operationId : [operationId]).map((id) => [id, state.appliedOps[id]])),
    ...Object.fromEntries(collections2.map((name) => [name, (state[name] ?? []).map((row) => ({ userId: row.userId, namespace: row.namespace }))]))
  };
}
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

// src/server/account-access.ts
var accessStatuses = ["pending", "approved", "rejected", "suspended"];
var accessMessages = {
  pending: "\uAD00\uB9AC\uC790\uAC00 \uAC00\uC785\uC744 \uC2B9\uC778\uD558\uBA74 \uB0B4 \uACF5\uBD80 \uACF5\uAC04\uC744 \uC0AC\uC6A9\uD560 \uC218 \uC788\uC2B5\uB2C8\uB2E4.",
  approved: "\uC774\uC6A9\uC774 \uC2B9\uC778\uB418\uC5C8\uC2B5\uB2C8\uB2E4.",
  rejected: "\uAC00\uC785 \uC694\uCCAD\uC774 \uC2B9\uC778\uB418\uC9C0 \uC54A\uC558\uC2B5\uB2C8\uB2E4. \uC774\uC6A9\uC774 \uD544\uC694\uD558\uBA74 \uAD00\uB9AC\uC790\uC5D0\uAC8C \uBB38\uC758\uD574 \uC8FC\uC138\uC694.",
  suspended: "\uD604\uC7AC \uC774\uC6A9\uC774 \uC911\uC9C0\uB418\uC5B4 \uC788\uC2B5\uB2C8\uB2E4. \uAE30\uC874 \uAE30\uB85D\uC740 \uC0AD\uC81C\uD558\uC9C0 \uC54A\uC558\uC2B5\uB2C8\uB2E4. \uAD00\uB9AC\uC790\uC5D0\uAC8C \uBB38\uC758\uD574 \uC8FC\uC138\uC694."
};
function requireApproved(access) {
  if (access.status !== "approved") throw new DomainError("ACCESS_DENIED", accessMessages[access.status] ?? accessMessages.pending);
}
function requireAdministrator(access) {
  requireApproved(access);
  if (!access.administrator) throw new DomainError("ADMIN_REQUIRED", "\uAD00\uB9AC\uC790\uB9CC \uAC00\uC785 \uACC4\uC815\uC744 \uAD00\uB9AC\uD560 \uC218 \uC788\uC2B5\uB2C8\uB2E4.");
}
function validateAccountName(value) {
  if (typeof value !== "string" || !value.trim() || [...value.trim()].length > 80 || /[\u0000-\u001f\u007f-\u009f]/.test(value)) throw new DomainError("NAME_REQUIRED", "\uC774\uB984\uC744 1~80\uC790\uB85C \uC785\uB825\uD574 \uC8FC\uC138\uC694.");
  return value.trim();
}

// src/domain/sync-protocol.ts
var MAX_SYNC_BATCH = 16;
var MAX_SYNC_BATCH_CHARS = 2e6;

// src/server/request-timing.ts
function requestTiming() {
  const started = performance.now();
  const durations = /* @__PURE__ */ new Map();
  function record(name, start) {
    durations.set(name, (durations.get(name) ?? 0) + performance.now() - start);
  }
  return {
    async measure(name, task) {
      const start = performance.now();
      try {
        return await task();
      } finally {
        record(name, start);
      }
    },
    sync(name, task) {
      const start = performance.now();
      try {
        return task();
      } finally {
        record(name, start);
      }
    },
    header() {
      return [...durations, ["total", performance.now() - started]].map(([name, duration]) => `${name};dur=${duration.toFixed(2)}`).join(", ");
    }
  };
}

// src/server/request-body.ts
var MAX_COMMAND_CODE_UNITS = 4e6;
var MAX_COMMAND_BYTES = MAX_COMMAND_CODE_UNITS * 3;
var tooLarge = () => new DomainError("TOO_LARGE", "\uD55C \uBC88\uC5D0 \uC800\uC7A5\uD560 \uB0B4\uC6A9\uC774 \uB108\uBB34 \uD07D\uB2C8\uB2E4. \uC6D0\uBB38\uC740 \uC774 \uAE30\uAE30\uC5D0 \uB0A8\uC544 \uC788\uC2B5\uB2C8\uB2E4.");
var readFailure = () => new DomainError("SERVER_ERROR", "\uC11C\uBC84\uC5D0 \uC800\uC7A5\uD558\uC9C0 \uBABB\uD588\uC2B5\uB2C8\uB2E4. \uC791\uC131 \uB0B4\uC6A9\uC740 \uC774 \uAE30\uAE30\uC5D0 \uB0A8\uC544 \uC788\uC2B5\uB2C8\uB2E4.");
async function readCommandRequestText(request, limits = {}) {
  const maxBytes = limits.maxBytes ?? MAX_COMMAND_BYTES;
  const maxCodeUnits = limits.maxCodeUnits ?? MAX_COMMAND_CODE_UNITS;
  if (!Number.isSafeInteger(maxBytes) || maxBytes < 0 || !Number.isSafeInteger(maxCodeUnits) || maxCodeUnits < 0) throw readFailure();
  let reader;
  let cancelled = false;
  const cancel = () => {
    if (reader && !cancelled) {
      cancelled = true;
      void reader.cancel().catch(() => void 0);
    }
  };
  let onAbort;
  try {
    reader = request.body?.getReader();
    if (request.signal.aborted) throw readFailure();
    const length = request.headers.get("content-length")?.trim();
    if (length && /^\d+$/.test(length) && Number(length) > maxBytes) throw tooLarge();
    if (!reader) return "";
    onAbort = cancel;
    request.signal.addEventListener("abort", onAbort, { once: true });
    if (request.signal.aborted) onAbort();
    const decoder = new TextDecoder();
    const parts = [];
    const block = new Uint16Array(32768);
    let blockLength = 0;
    let byteLength = 0;
    let codeUnits = 0;
    const append = (text4) => {
      codeUnits += text4.length;
      if (codeUnits > maxCodeUnits) throw tooLarge();
      for (let index = 0; index < text4.length; index++) {
        block[blockLength++] = text4.charCodeAt(index);
        if (blockLength === block.length) {
          parts.push(String.fromCharCode(...block));
          blockLength = 0;
        }
      }
    };
    while (true) {
      const { value, done } = await reader.read();
      if (request.signal.aborted) throw readFailure();
      if (done) break;
      byteLength += value.byteLength;
      if (byteLength > maxBytes) throw tooLarge();
      append(decoder.decode(value, { stream: true }));
    }
    append(decoder.decode());
    if (blockLength) parts.push(String.fromCharCode(...block.subarray(0, blockLength)));
    return parts.join("");
  } catch (error) {
    cancel();
    if (error instanceof DomainError) throw error;
    throw readFailure();
  } finally {
    if (onAbort) request.signal.removeEventListener("abort", onAbort);
    reader?.releaseLock();
  }
}

// src/server/command-handler.ts
var cors = { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Headers": "authorization, apikey, content-type, x-client-info, x-region", "Access-Control-Allow-Methods": "POST, OPTIONS", "Cache-Control": "no-store" };
var supportedCommands = ["importPhotoOutline", "importConceptCatalog", "saveConceptEdition", "saveConceptBatch", "saveInkWorkspace", "saveRecallCloze", "importRecallCards", "setRecallCardStatus", "saveMemo", "saveStudyBoard", "saveMemoryCard", "trashMemoryCard", "restoreMemoryCard", "saveMemoryTest", "saveStudyMaterial", "trashStudyMaterial", "restoreStudyMaterial", "saveLearningPlan", "saveCanvasLayout", "saveCodeExample", "trashCodeExample", "restoreCodeExample", "saveRecallCard", "saveRecallReference", "reviewRecallCard", "undoRecallReview", "setRecallDue", "saveRecallPreferences"];
var syncCapabilities = { conditionalLoad: true, batchCommands: true };
function validOperationId(value) {
  if (typeof value !== "string" || !value.trim() || value.length > 256) return false;
  for (const char of value) {
    const code = char.charCodeAt(0);
    if (code < 32 || code === 127) return false;
  }
  return true;
}
async function handleCommand(request, backend) {
  const timing = requestTiming();
  const json = (body, status = 200) => {
    const text4 = timing.sync("serialize", () => JSON.stringify(body));
    return new Response(text4, { status, headers: { ...cors, "Content-Type": "application/json", "Server-Timing": timing.header() } });
  };
  if (request.method === "OPTIONS") return new Response(null, { status: 204, headers: cors });
  if (request.method !== "POST") return json({ code: "METHOD", message: "\uC9C0\uC6D0\uD558\uC9C0 \uC54A\uB294 \uC694\uCCAD\uC785\uB2C8\uB2E4." }, 405);
  try {
    const authorization = request.headers.get("authorization");
    if (!authorization?.startsWith("Bearer ")) throw new DomainError("AUTH_REQUIRED", "\uAC1C\uC778 \uACF5\uAC04\uC5D0 \uB2E4\uC2DC \uB85C\uADF8\uC778\uD574 \uC8FC\uC138\uC694.");
    const userId = await timing.measure("auth", () => backend.authenticate(authorization.slice(7)));
    if (!userId) throw new DomainError("AUTH_REQUIRED", "\uAC1C\uC778 \uACF5\uAC04\uC5D0 \uB2E4\uC2DC \uB85C\uADF8\uC778\uD574 \uC8FC\uC138\uC694.");
    const text4 = await readCommandRequestText(request);
    let body;
    try {
      body = JSON.parse(text4);
    } catch {
      throw new DomainError("INVALID_REQUEST", "\uC694\uCCAD \uB0B4\uC6A9\uC744 \uD655\uC778\uD574 \uC8FC\uC138\uC694.");
    }
    if (!body || typeof body !== "object" || Array.isArray(body) || typeof body.action !== "string") throw new DomainError("INVALID_REQUEST", "\uC694\uCCAD \uB0B4\uC6A9\uC744 \uD655\uC778\uD574 \uC8FC\uC138\uC694.");
    if (body.action === "load" && body.knownSequence !== void 0 && (!Number.isSafeInteger(body.knownSequence) || body.knownSequence < 0)) throw new DomainError("INVALID_VERSION", "\uC870\uD68C\uD560 \uC800\uC7A5 \uC21C\uC11C\uB97C \uD655\uC778\uD574 \uC8FC\uC138\uC694.");
    const access = await timing.measure("access", () => backend.access(userId));
    if (body.action === "access") return json(access);
    if (body.action === "profile-set") {
      const name = validateAccountName(body.name);
      if (!backend.setAccountName) throw new DomainError("SERVER_ERROR", "\uACC4\uC815 \uC5F0\uACB0\uC744 \uD655\uC778\uD574 \uC8FC\uC138\uC694.");
      return json(await backend.setAccountName(userId, name));
    }
    if (body.action === "withdraw") {
      if (body.confirmation !== "\uD0C8\uD1F4" || body.target !== void 0) throw new DomainError("INVALID_REQUEST", "\uBCF8\uC778 \uACC4\uC815\uC758 \uD0C8\uD1F4 \uD655\uC778\uC744 \uB2E4\uC2DC \uD574 \uC8FC\uC138\uC694.");
      if (!backend.withdrawAccount) throw new DomainError("SERVER_ERROR", "\uD0C8\uD1F4 \uC5F0\uACB0\uC744 \uD655\uC778\uD574 \uC8FC\uC138\uC694.");
      if (body.requestId !== undefined && !withdrawalSupport.validWithdrawalId(body.requestId)) throw new DomainError('INVALID_REQUEST', '탈퇴 확인 번호를 확인해 주세요.');
      const result = await backend.withdrawAccount(userId, body.requestId);
      if (result && !result.withdrawn && body.requestId === undefined) throw new DomainError('SERVER_ERROR', '첨부 파일을 정리하고 있습니다. 탈퇴 처리를 다시 시도해 주세요.');
      return json(result ?? { withdrawn: true }, result && !result.withdrawn ? 202 : 200);
    }
    if (body.action === "admin-list" || body.action === "admin-set") {
      requireAdministrator(access);
      if (body.action === "admin-list") {
        const cursor = body.cursor ?? null;
        if (cursor !== null && (typeof cursor !== "string" || !/^[0-9a-f-]{36}$/i.test(cursor))) throw new DomainError("INVALID_REQUEST", "\uACC4\uC815 \uBAA9\uB85D\uC758 \uC704\uCE58\uB97C \uD655\uC778\uD574 \uC8FC\uC138\uC694.");
        if (!backend.listAccounts) throw new DomainError("SERVER_ERROR", "\uACC4\uC815 \uAD00\uB9AC \uC5F0\uACB0\uC744 \uD655\uC778\uD574 \uC8FC\uC138\uC694.");
        return json(await backend.listAccounts(userId, cursor));
      }
      if (typeof body.target !== "string" || !/^[0-9a-f-]{36}$/i.test(body.target) || !accessStatuses.includes(body.status) || !Number.isSafeInteger(body.version) || body.version < 0) throw new DomainError("INVALID_REQUEST", "\uACC4\uC815 \uBCC0\uACBD \uC694\uCCAD\uC744 \uD655\uC778\uD574 \uC8FC\uC138\uC694.");
      if (!backend.setAccountAccess) throw new DomainError("SERVER_ERROR", "\uACC4\uC815 \uAD00\uB9AC \uC5F0\uACB0\uC744 \uD655\uC778\uD574 \uC8FC\uC138\uC694.");
      await backend.setAccountAccess(userId, body.target, body.status, body.version);
      return json({ saved: true });
    }
    requireApproved(access);
    const namespace = body.namespace;
    if (!["personal", "test"].includes(namespace)) throw new DomainError("WRONG_NAMESPACE", "\uC2DC\uC5F0 \uC790\uB8CC\uB294 \uAC1C\uC778 \uC11C\uBC84\uC5D0 \uC62C\uB9AC\uC9C0 \uC54A\uC2B5\uB2C8\uB2E4.");
    const loaded = await timing.measure("read", () => body.action === "load" && body.knownSequence !== void 0 && backend.readConditional ? backend.readConditional(userId, namespace, body.knownSequence) : backend.read(userId, namespace));
    if (loaded && "unchanged" in loaded) {
      if (loaded.unchanged !== true || body.action !== "load" || body.knownSequence === void 0 || !Number.isSafeInteger(loaded.sequence) || loaded.sequence < 0 || loaded.sequence !== body.knownSequence) throw new DomainError("INVALID_VERSION", "\uC11C\uBC84\uC758 \uC800\uC7A5 \uC21C\uC11C\uB97C \uD655\uC778\uD558\uC9C0 \uBABB\uD588\uC2B5\uB2C8\uB2E4.");
      if (loaded.userId !== userId || loaded.namespace !== namespace) throw new DomainError("OWNERSHIP", "\uC774 \uACF5\uAC04\uC5D0 \uC811\uADFC\uD560 \uC218 \uC5C6\uC2B5\uB2C8\uB2E4.");
      return json({ unchanged: true, sequence: loaded.sequence, userId, namespace, supportedCommands, syncCapabilities });
    }
    const current = loaded ?? { sequence: 0, data: emptyState(userId, namespace) };
    if (!Number.isSafeInteger(current.sequence) || current.sequence < 0) throw new DomainError("INVALID_VERSION", "\uC11C\uBC84\uC758 \uC800\uC7A5 \uC21C\uC11C\uB97C \uD655\uC778\uD558\uC9C0 \uBABB\uD588\uC2B5\uB2C8\uB2E4.");
    timing.sync("validate", () => validateState(current.data));
    if (current.data.userId !== userId || current.data.namespace !== namespace) throw new DomainError("OWNERSHIP", "\uC774 \uACF5\uAC04\uC5D0 \uC811\uADFC\uD560 \uC218 \uC5C6\uC2B5\uB2C8\uB2E4.");
    if (body.action === "load") {
      if (body.knownSequence === current.sequence) return json({ unchanged: true, sequence: current.sequence, userId, namespace, supportedCommands, syncCapabilities });
      return json({ ...current, supportedCommands, syncCapabilities });
    }
    if (body.action === "execute-batch") {
      if (!Number.isSafeInteger(body.baseSequence) || body.baseSequence < 0) throw new DomainError("INVALID_VERSION", "\uC800\uC7A5 \uC21C\uC11C\uB97C \uD655\uC778\uD574 \uC8FC\uC138\uC694.");
      if (!Array.isArray(body.commands) || !body.commands.length || body.commands.length > MAX_SYNC_BATCH || text4.length > MAX_SYNC_BATCH_CHARS) throw new DomainError("INVALID_BATCH", "\uD55C \uBC88\uC5D0 \uC800\uC7A5\uD560 \uB0B4\uC6A9\uC758 \uD06C\uAE30\uB97C \uD655\uC778\uD574 \uC8FC\uC138\uC694. \uC6D0\uBB38\uC740 \uC774 \uAE30\uAE30\uC5D0 \uB0A8\uC544 \uC788\uC2B5\uB2C8\uB2E4.");
      const commands = body.commands;
      const ids = /* @__PURE__ */ new Set();
      for (const command2 of commands) {
        if (!command2 || !validOperationId(command2.opId) || ids.has(command2.opId)) throw new DomainError("INVALID_ID", "\uC800\uC7A5 \uC694\uCCAD\uC758 \uC2DD\uBCC4\uC790\uB97C \uD655\uC778\uD574 \uC8FC\uC138\uC694.");
        if (command2.userId !== userId || command2.namespace !== namespace) throw new DomainError("OWNERSHIP", "\uB2E4\uB978 \uC0AC\uC6A9\uC790\uC758 \uC790\uB8CC\uB97C \uBCC0\uACBD\uD560 \uC218 \uC5C6\uC2B5\uB2C8\uB2E4.");
        ids.add(command2.opId);
      }
      let saved = current;
      const pending = [];
      for (let index = 0; index < commands.length; index++) {
        const command2 = commands[index];
        await verifyConceptHash(command2);
        if (saved.data.appliedOps[command2.opId]) {
          timing.sync("apply", () => applyCommand(saved.data, command2));
          continue;
        }
        if (body.baseSequence + index !== saved.sequence) return json({ code: "VERSION_CONFLICT", message: "\uB2E4\uB978 \uAE30\uAE30\uC758 \uBCC0\uACBD\uACFC \uC791\uC131 \uB0B4\uC6A9\uC744 \uBAA8\uB450 \uBCF4\uC874\uD588\uC2B5\uB2C8\uB2E4.", server: saved }, 409);
        const next2 = timing.sync("apply", () => applyCommand(saved.data, command2));
        if (backend.commitBatch) {
          pending.push(command2);
          saved = { sequence: saved.sequence + 1, data: next2 };
        } else saved = await timing.measure("commit", () => backend.commit(userId, namespace, saved.sequence, command2, next2));
      }
      if (pending.length && backend.commitBatch) saved = await timing.measure("commit", () => backend.commitBatch(userId, namespace, current.sequence, pending, saved.data));
      return json({ ...saved, supportedCommands, syncCapabilities });
    }
    if (body.action !== "execute" || !body.command) throw new DomainError("INVALID_REQUEST", "\uC800\uC7A5 \uC694\uCCAD\uC744 \uD655\uC778\uD574 \uC8FC\uC138\uC694.");
    const command = body.command;
    await verifyConceptHash(command);
    if (!validOperationId(command.opId)) throw new DomainError("INVALID_ID", "\uC800\uC7A5 \uC694\uCCAD\uC758 \uC2DD\uBCC4\uC790\uB97C \uD655\uC778\uD574 \uC8FC\uC138\uC694.");
    if (command.userId !== userId || command.namespace !== namespace) throw new DomainError("OWNERSHIP", "\uB2E4\uB978 \uC0AC\uC6A9\uC790\uC758 \uC790\uB8CC\uB97C \uBCC0\uACBD\uD560 \uC218 \uC5C6\uC2B5\uB2C8\uB2E4.");
    if (!Number.isSafeInteger(body.baseSequence) || body.baseSequence < 0) throw new DomainError("INVALID_VERSION", "\uC800\uC7A5 \uC21C\uC11C\uB97C \uD655\uC778\uD574 \uC8FC\uC138\uC694.");
    if (current.data.appliedOps[command.opId]) {
      timing.sync("apply", () => applyCommand(current.data, command));
      return json({ ...current, supportedCommands, syncCapabilities });
    }
    if (body.baseSequence !== current.sequence) return json({ code: "VERSION_CONFLICT", message: "\uB2E4\uB978 \uAE30\uAE30\uC758 \uBCC0\uACBD\uACFC \uC791\uC131 \uB0B4\uC6A9\uC744 \uBAA8\uB450 \uBCF4\uC874\uD588\uC2B5\uB2C8\uB2E4.", server: current }, 409);
    const next = timing.sync("apply", () => applyCommand(current.data, command));
    return json({ ...await timing.measure("commit", () => backend.commit(userId, namespace, current.sequence, command, next)), supportedCommands, syncCapabilities });
  } catch (error) {
    const code = error instanceof DomainError ? error.code : "SERVER_ERROR";
    const status = code === "AUTH_REQUIRED" ? 401 : ["OWNERSHIP", "ACCESS_DENIED", "ADMIN_REQUIRED", "ADMIN_PROTECTED", "LAST_ADMIN"].includes(code) ? 403 : /CONFLICT/.test(code) ? 409 : code === "SERVER_ERROR" ? 503 : error instanceof DomainError || error instanceof SyntaxError ? 400 : 503;
    return json({ code, message: error instanceof DomainError ? error.message : "\uC11C\uBC84\uC5D0 \uC800\uC7A5\uD558\uC9C0 \uBABB\uD588\uC2B5\uB2C8\uB2E4. \uC791\uC131 \uB0B4\uC6A9\uC740 \uC774 \uAE30\uAE30\uC5D0 \uB0A8\uC544 \uC788\uC2B5\uB2C8\uB2E4." }, status);
  }
}
async function verifyConceptHash(command) {
  if (command?.type !== "importConceptCatalog") return;
  if (typeof command.raw !== "string") throw new DomainError("INVALID_CONCEPT", "\uC6D0\uBB38 \uD30C\uC77C\uC744 \uD655\uC778\uD574 \uC8FC\uC138\uC694.");
  const bytes = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(command.raw));
  const digest = [...new Uint8Array(bytes)].map((n) => n.toString(16).padStart(2, "0")).join("");
  if (digest !== command.sha256) throw new DomainError("INVALID_CONCEPT", "\uC6D0\uBB38\uACFC \uD30C\uC77C \uD574\uC2DC\uAC00 \uB2E4\uB985\uB2C8\uB2E4. \uC800\uC7A5\uD558\uC9C0 \uC54A\uC558\uC2B5\uB2C8\uB2E4.");
}

// supabase/functions/study-command/entry.ts
var url = Deno.env.get("SUPABASE_URL");
var anon = Deno.env.get("SUPABASE_ANON_KEY");
var service = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
var RpcError = class extends DomainError {
  constructor(code, message, databaseCode, databaseMessage) {
    super(code, message);
    this.databaseCode = databaseCode;
    this.databaseMessage = databaseMessage;
  }
  databaseCode;
  databaseMessage;
};
function missingConditionalRead(error) {
  if (!(error instanceof RpcError)) return false;
  if (error.databaseCode === "PGRST202") return /^Could not find (?:the )?(?:function )?(?:public\.)?study_read_workspace_conditional(?:\([^)]*\))?(?: function)? in the schema cache\.?$/i.test(error.databaseMessage.trim());
  return error.databaseCode === "42883" && /^function (?:public\.)?study_read_workspace_conditional\([^)]*\) does not exist\.?$/i.test(error.databaseMessage.trim());
}
async function admin(path, options = {}) {
  const response = await fetch(`${url}/rest/v1/${path}`, { ...options, headers: { apikey: service, Authorization: `Bearer ${service}`, "Content-Type": "application/json", ...options.headers } });
  const result = response.status === 204 ? null : await response.json();
  if (!response.ok) {
    const databaseCode = typeof result?.code === "string" ? result.code : "";
    const databaseMessage = typeof result?.message === "string" ? result.message : "";
    const code = ["ACCESS_DENIED", "ADMIN_REQUIRED", "ADMIN_PROTECTED", "ACCESS_CONFLICT", "VERSION_CONFLICT", "EMAIL_UNCONFIRMED", "NAME_REQUIRED", "LAST_ADMIN", "AUTH_REQUIRED"].find((code2) => databaseMessage.includes(code2)) ?? (databaseCode === "42501" ? "ACCESS_DENIED" : "SERVER_ERROR");
    const message = code === "LAST_ADMIN" ? "\uD604\uC7AC \uC720\uC77C\uD55C \uAD00\uB9AC\uC790\uC785\uB2C8\uB2E4. \uB2E4\uB978 \uAD00\uB9AC\uC790\uC5D0\uAC8C \uAD8C\uD55C\uC744 \uB118\uAE34 \uB4A4 \uD0C8\uD1F4\uD560 \uC218 \uC788\uC2B5\uB2C8\uB2E4." : code === "NAME_REQUIRED" ? "\uC774\uB984\uC744 1~80\uC790\uB85C \uC785\uB825\uD574 \uC8FC\uC138\uC694." : code === "ACCESS_DENIED" ? "\uAD00\uB9AC\uC790 \uC2B9\uC778\uC774 \uD544\uC694\uD558\uAC70\uB098 \uC774\uC6A9\uC774 \uC911\uC9C0\uB418\uC5B4 \uC788\uC2B5\uB2C8\uB2E4. \uC791\uC131 \uB0B4\uC6A9\uC740 \uC774 \uAE30\uAE30\uC5D0 \uB0A8\uC544 \uC788\uC2B5\uB2C8\uB2E4." : code === "ACCESS_CONFLICT" ? "\uACC4\uC815 \uC0C1\uD0DC\uAC00 \uBCC0\uACBD\uB418\uC5C8\uC2B5\uB2C8\uB2E4. \uBAA9\uB85D\uC744 \uB2E4\uC2DC \uBD88\uB7EC\uC640 \uC8FC\uC138\uC694." : code === "EMAIL_UNCONFIRMED" ? "\uC774\uBA54\uC77C \uD655\uC778\uC774 \uB05D\uB09C \uACC4\uC815\uB9CC \uC2B9\uC778\uD560 \uC218 \uC788\uC2B5\uB2C8\uB2E4." : "\uC11C\uBC84\uC5D0\uC11C \uBCC0\uACBD\uC744 \uC2B9\uC778\uD558\uC9C0 \uC54A\uC558\uC2B5\uB2C8\uB2E4. \uC6D0\uBB38\uC744 \uBCF4\uC874\uD588\uC2B5\uB2C8\uB2E4.";
    throw new RpcError(code, message, databaseCode, databaseMessage);
  }
  return result;
}
async function readWorkspace(userId, namespace) {
  const row = await admin("rpc/study_read_workspace", { method: "POST", body: JSON.stringify({ p_user: userId, p_namespace: namespace }) });
  return row ? { sequence: row.sequence, data: unpackServerState(row.state) } : null;
}
const __photoHost={DomainError,outlineRevisionToken};
var photoOutlineSupport = (() => {
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // <stdin>
  var stdin_exports = {};
  __export(stdin_exports, {
    previewPhotoOutline: () => previewPhotoOutline
  });

  // host:model
  var DomainError = __photoHost.DomainError;

  // host:outline
  var outlineRevisionToken = __photoHost.outlineRevisionToken;

  // src/domain/photo-outline.ts
  var MAX_PHOTOS = 4;
  var MAX_PHOTO_ROWS = 100;
  var invalid = () => {
    throw new DomainError("INVALID_PHOTO_OUTLINE", "\uC0AC\uC9C4\uACFC \uBAA9\uCC28 \uCD08\uC548\uC758 \uD615\uC2DD\uC744 \uD655\uC778\uD574 \uC8FC\uC138\uC694. \uC6D0\uBCF8\uACFC \uAE30\uC874 \uBAA9\uCC28\uB294 \uC720\uC9C0\uD588\uC2B5\uB2C8\uB2E4.");
  };
  var str = (s, max) => typeof s === "string" && s.length <= max;
  function orderedPhotoRows(rows) {
    const byId = new Map(rows.map((r) => [r.id, r])), visiting = /* @__PURE__ */ new Set(), visited = /* @__PURE__ */ new Set(), levels = /* @__PURE__ */ new Map(), output = [];
    function visit(row, depth = 0) {
      if (depth > 10 || visiting.has(row.id)) invalid();
      if (visited.has(row.id)) return;
      visiting.add(row.id);
      if (row.parentId !== null) {
        const parent = byId.get(row.parentId);
        if (!parent) return invalid();
        visit(parent, depth + 1);
      }
      const level = row.parentId === null ? 1 : (levels.get(row.parentId) ?? 0) + 1;
      if (level > 10) invalid();
      levels.set(row.id, level);
      visiting.delete(row.id);
      visited.add(row.id);
      output.push(row);
    }
    rows.forEach((r) => visit(r));
    return output;
  }
  function validatePhotoRows(rows, photoIds) {
    if (!Array.isArray(rows) || rows.length > MAX_PHOTO_ROWS) invalid();
    const ids = /* @__PURE__ */ new Set();
    let total = 0;
    for (const row of rows) {
      if (!row || !str(row.id, 100) || !/^[A-Za-z0-9_-]+$/.test(row.id) || ids.has(row.id) || row.parentId !== null && !str(row.parentId, 100) || !str(row.name, 180) || !row.name.trim() || /[\r\n\t]/.test(row.name) || !str(row.content, 12e3) || !str(row.page, 100) || typeof row.uncertain !== "boolean" || !Array.isArray(row.photoIds) || !row.photoIds.length || row.photoIds.length > MAX_PHOTOS || new Set(row.photoIds).size !== row.photoIds.length || row.photoIds.some((id) => !str(id, 100) || photoIds && !photoIds.includes(id))) invalid();
      ids.add(row.id);
      total += row.content.length + row.name.length + row.page.length;
    }
    if (total > 1e5) invalid();
    orderedPhotoRows(rows);
  }
  function previewPhotoOutline(state, subjectId, parentId, rows, choices) {
    validatePhotoRows(rows);
    if (!state.subjects.some((s) => s.id === subjectId && !s.deletedAt) || parentId !== null && !state.nodes.some((n) => n.id === parentId && n.subjectId === subjectId && !n.deletedAt) || !choices || typeof choices !== "object" || Array.isArray(choices) || Object.values(choices).some((c) => typeof c !== "string")) invalid();
    const plan = [];
    const paths = /* @__PURE__ */ new Set();
    for (const row of orderedPhotoRows(rows)) {
      const path = JSON.stringify([row.parentId, row.name.trim()]);
      if (paths.has(path)) throw new DomainError("DUPLICATE_PHOTO_NAME", "\uCD08\uC548\uC758 \uAC19\uC740 \uC704\uCE58\uC5D0 \uAC19\uC740 \uC774\uB984\uC774 \uC788\uC2B5\uB2C8\uB2E4. \uD56D\uBAA9 \uC774\uB984\uC774\uB098 \uC0C1\uC704 \uC704\uCE58\uB97C \uD655\uC778\uD574 \uC8FC\uC138\uC694.");
      paths.add(path);
      const parent = plan.find((p) => p.row.id === row.parentId), actualParent = row.parentId === null ? parentId : parent?.id ?? null;
      const role = row.parentId === null && parentId === null ? "unit" : rows.some((r) => r.parentId === row.id) ? "outline" : "topic";
      const blocked = row.parentId !== null && (!parent || ["choose", "blocked"].includes(parent.status));
      const candidates = !blocked && (row.parentId === null || parent?.status === "reuse") ? state.nodes.filter((n) => !n.deletedAt && n.subjectId === subjectId && n.parentId === actualParent && n.name === row.name.trim() && n.role === role).map((n) => ({ id: n.id, name: n.name })) : [];
      const choice = choices[row.id];
      let status = blocked ? "blocked" : candidates.length && choice !== "new" ? "choose" : "new";
      let id = null;
      if (candidates.some((n) => n.id === choice)) {
        status = "reuse";
        id = choice;
      } else if (choice && choice !== "new" && !blocked) invalid();
      plan.push({ row, parentKey: row.parentId, parentId: actualParent, role, status, id, candidates });
    }
    return { entries: plan, ready: rows.length > 0 && plan.every((p) => ["new", "reuse"].includes(p.status)), expectedToken: outlineRevisionToken(state, subjectId, parentId) };
  }
  return __toCommonJS(stdin_exports);
})();
const withdrawalSupport = (() => {
// src/server/account-withdrawal.ts

var validWithdrawalId = (id) => typeof id === "string" && /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id);
async function withdrawAccountFiles(backend, userId, requestId) {
  const started = await backend.begin(userId, requestId);
  if (started.requestId !== requestId) return { withdrawn: false, requestId: started.requestId };
  const objects = await backend.batch(userId);
  const buckets = /* @__PURE__ */ new Map();
  for (const object of objects) {
    if (!object || typeof object.bucket !== "string" || typeof object.name !== "string") throw new DomainError("SERVER_ERROR", "\uCCA8\uBD80 \uD30C\uC77C \uBAA9\uB85D\uC744 \uD655\uC778\uD558\uC9C0 \uBABB\uD588\uC2B5\uB2C8\uB2E4. \uD0C8\uD1F4 \uCC98\uB9AC\uB97C \uB2E4\uC2DC \uC2DC\uB3C4\uD574 \uC8FC\uC138\uC694.");
    const names = buckets.get(object.bucket) ?? [];
    names.push(object.name);
    buckets.set(object.bucket, names);
  }
  for (const [bucket, names] of buckets) await backend.remove(bucket, names);
  if ((await backend.batch(userId)).length) return { withdrawn: false, requestId };
  await backend.finish(userId);
  return { withdrawn: true, requestId };
}

// src/server/withdrawal-status.ts
var headers = { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Headers": "authorization, apikey, content-type, x-client-info", "Access-Control-Allow-Methods": "POST, OPTIONS", "Cache-Control": "no-store", "Content-Type": "application/json" };
async function handleWithdrawalStatus(request, status) {
  if (request.method === "OPTIONS") return new Response(null, { status: 204, headers });
  if (request.method !== "POST") return new Response("{}", { status: 405, headers });
  try {
    const reader = request.body?.getReader();
    const chunks = [];
    let size = 0;
    if (reader) try {
      while (true) {
        const part = await reader.read();
        if (part.done) break;
        size += part.value.byteLength;
        if (size > 512) {
          await reader.cancel();
          throw Error("request");
        }
        chunks.push(part.value);
      }
    } finally {
      reader.releaseLock();
    }
    const bytes = new Uint8Array(size);
    let offset = 0;
    for (const chunk of chunks) {
      bytes.set(chunk, offset);
      offset += chunk.length;
    }
    const body = JSON.parse(new TextDecoder().decode(bytes));
    if (!validWithdrawalId(body?.requestId)) return new Response("{}", { status: 400, headers });
    const result = await status(body.requestId);
    return new Response(JSON.stringify({ withdrawn: result.withdrawn === true }), { headers });
  } catch {
    return new Response("{}", { status: 503, headers });
  }
}
return {
  handleWithdrawalStatus,
  validWithdrawalId,
  withdrawAccountFiles
};
})();
Deno.serve((request) => new URL(request.url).pathname.endsWith('/withdrawal-status')
  ? withdrawalSupport.handleWithdrawalStatus(request, requestId => admin('rpc/study_withdrawal_status', { method: 'POST', body: JSON.stringify({ p_request: requestId }) }))
  : handleCommand(request, {
  async authenticate(token) {
    const response = await fetch(`${url}/auth/v1/user`, { headers: { apikey: anon, Authorization: `Bearer ${token}` } });
    if (!response.ok) throw new DomainError("AUTH_REQUIRED", "\uB85C\uADF8\uC778\uC774 \uB9CC\uB8CC\uB418\uC5C8\uC2B5\uB2C8\uB2E4. \uC791\uC131 \uB0B4\uC6A9\uC744 \uBCF4\uC874\uD558\uACE0 \uB2E4\uC2DC \uB85C\uADF8\uC778\uD574 \uC8FC\uC138\uC694.");
    return (await response.json()).id;
  },
  async access(userId) {
    return admin("rpc/study_account_access", { method: "POST", body: JSON.stringify({ p_user: userId }) });
  },
  async listAccounts(actor, cursor) {
    return admin("rpc/study_list_accounts", { method: "POST", body: JSON.stringify({ p_actor: actor, p_cursor: cursor }) });
  },
  async setAccountAccess(actor, target, status, version2) {
    await admin("rpc/study_set_account_access", { method: "POST", body: JSON.stringify({ p_actor: actor, p_target: target, p_status: status, p_version: version2 }) });
  },
  async setAccountName(userId, name) {
    return admin("rpc/study_set_account_name", { method: "POST", body: JSON.stringify({ p_user: userId, p_name: name }) });
  },
  async withdrawAccount(userId, requestId = crypto.randomUUID()) {
    return withdrawalSupport.withdrawAccountFiles({
      begin: (id, receipt) => admin('rpc/study_begin_withdrawal', { method: 'POST', body: JSON.stringify({ p_user: id, p_request: receipt }) }),
      batch: id => admin('rpc/study_withdraw_storage_batch', { method: 'POST', body: JSON.stringify({ p_user: id }) }),
      finish: async id => { await admin('rpc/study_withdraw_account', { method: 'POST', body: JSON.stringify({ p_user: id }) }); },
      async remove(bucket, names) {
        const response = await fetch(`${url}/storage/v1/object/${encodeURIComponent(bucket)}`, {
          method: 'DELETE', headers: { apikey: service, Authorization: `Bearer ${service}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({ prefixes: names }), signal: AbortSignal.timeout(12000),
        });
        if (!response.ok) throw new DomainError('SERVER_ERROR', '첨부 파일 정리를 마치지 못했습니다. 계정과 이 기기의 기록은 아직 삭제하지 않았습니다. 탈퇴 처리를 다시 시도해 주세요.');
      },
    }, userId, requestId);
  },
  read: readWorkspace,
  async readConditional(userId, namespace, knownSequence) {
    let row;
    try {
      row = await admin("rpc/study_read_workspace_conditional", { method: "POST", body: JSON.stringify({ p_user: userId, p_namespace: namespace, p_known_sequence: knownSequence }) });
    } catch (error) {
      if (missingConditionalRead(error)) return readWorkspace(userId, namespace);
      throw error;
    }
    if (row === null) return null;
    if (!row || typeof row !== "object" || Array.isArray(row)) throw new DomainError("SERVER_ERROR", "\uC11C\uBC84\uC758 \uC800\uC7A5 \uACB0\uACFC\uB97C \uD655\uC778\uD558\uC9C0 \uBABB\uD588\uC2B5\uB2C8\uB2E4.");
    if ("unchanged" in row) return { unchanged: row.unchanged, sequence: row.sequence, userId: row.userId, namespace: row.namespace };
    return { sequence: row.sequence, data: unpackServerState(row.state) };
  },
  async commit(userId, namespace, base, command, next) {
    const saved = await admin("rpc/study_commit", { method: "POST", body: JSON.stringify({ p_user: userId, p_namespace: namespace, p_base: base, p_operation: command.opId, p_payload: next.appliedOps[command.opId], p_state: packServerState(next, command.opId) }) });
    return { sequence: saved.sequence, data: unpackServerState(saved.data) };
  },
  async commitBatch(userId, namespace, base, commands, next) {
    const operations = commands.map((command) => ({ id: command.opId, payload: next.appliedOps[command.opId] }));
    const saved = await admin("rpc/study_commit_batch", { method: "POST", body: JSON.stringify({ p_user: userId, p_namespace: namespace, p_base: base, p_operations: operations, p_state: packServerState(next, commands.map((command) => command.opId)) }) });
    return { sequence: saved.sequence, data: unpackServerState(saved.data) };
  }
}));
/*! Bundled license information:

ts-fsrs/dist/index.mjs:
ts-fsrs/dist/index.mjs:
ts-fsrs/dist/index.mjs:
  (* istanbul ignore next -- @preserve *)
*/
