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

// ../../../Users/manseeksong/Documents/ChatGPT/학습 시스템 설계 프로젝트/generation2/node_modules/lz-string/libs/lz-string.js
var require_lz_string = __commonJS({
  "../../../Users/manseeksong/Documents/ChatGPT/\uD559\uC2B5 \uC2DC\uC2A4\uD15C \uC124\uACC4 \uD504\uB85C\uC81D\uD2B8/generation2/node_modules/lz-string/libs/lz-string.js"(exports, module) {
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
  const fail2 = (message) => {
    throw new DomainError("INVALID_OUTLINE_TABLE", message);
  };
  if (!input || !input.scope || !["semester", "independent", "unassigned"].includes(input.scope.kind)) fail2("\uB4F1\uB85D\uD560 \uD559\uAE30\uB97C \uD655\uC778\uD574 \uC8FC\uC138\uC694.");
  if (input.scope.kind === "semester" && !state.semesters.some((row) => row.id === input.scope.semesterId && !row.deletedAt)) fail2("\uB4F1\uB85D\uD560 \uD559\uAE30\uB97C \uCC3E\uC744 \uC218 \uC5C6\uC2B5\uB2C8\uB2E4.");
  if (!Array.isArray(input.courses) || input.courses.length > MAX_OUTLINE_ROWS || !input.choices || typeof input.choices !== "object" || Array.isArray(input.choices)) fail2("\uC785\uB825 \uD45C\uC758 \uD615\uC2DD\uC744 \uD655\uC778\uD574 \uC8FC\uC138\uC694.");
  const keys = /* @__PURE__ */ new Set(), entries = [], paths = /* @__PURE__ */ new Map();
  let rows = 0;
  const cell = (value) => {
    if (!value || typeof value.key !== "string" || !value.key || keys.has(value.key) || typeof value.name !== "string") fail2("\uC785\uB825\uCE78\uC758 \uC2DD\uBCC4\uC790\uC640 \uC6D0\uBB38\uC744 \uD655\uC778\uD574 \uC8FC\uC138\uC694.");
    keys.add(value.key);
    const name = value.name.trim();
    if (name.length > MAX_OUTLINE_NAME || /[\r\n\t]/.test(value.name)) fail2("\uC774\uB984\uC740 \uC904\uBC14\uAFC8 \uC5C6\uC774 180\uC790 \uC774\uB0B4\uB85C \uAC1C\uBCC4 \uCE78\uC5D0 \uC801\uC5B4 \uC8FC\uC138\uC694.");
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
    } else if (choice && choice !== "new") fail2("\uC5F0\uACB0\uD558\uB824\uB358 \uAE30\uC874 \uD56D\uBAA9\uC774 \uBC14\uB00C\uC5C8\uC2B5\uB2C8\uB2E4. \uAC19\uC740 \uC774\uB984\uC758 \uD56D\uBAA9\uC744 \uB2E4\uC2DC \uD655\uC778\uD574 \uC8FC\uC138\uC694.");
    const entry = { key, parentKey, subjectKey, name: path.at(-1), path, kind, status, id, candidates: candidates.map((row) => ({ id: row.id, name: row.name })) };
    paths.set(key, entry);
    entries.push(entry);
  };
  for (const course of input.courses) {
    const courseName = cell(course);
    if (!Array.isArray(course.units)) fail2("\uB2E8\uC6D0 \uC785\uB825\uCE78\uC744 \uD655\uC778\uD574 \uC8FC\uC138\uC694.");
    if (courseName) append([courseName], "subject");
    for (const unit of course.units) {
      if (++rows > MAX_OUTLINE_ROWS) fail2("\uB2E8\uC6D0\uACFC \uC8FC\uC81C \uC785\uB825\uC740 \uD569\uACC4 500\uD589\uAE4C\uC9C0 \uC0AC\uC6A9\uD560 \uC218 \uC788\uC2B5\uB2C8\uB2E4.");
      const unitName = cell(unit);
      if (!Array.isArray(unit.topics)) fail2("\uC8FC\uC81C \uC785\uB825\uCE78\uC744 \uD655\uC778\uD574 \uC8FC\uC138\uC694.");
      if (unitName && !courseName) fail2("\uB2E8\uC6D0\uC744 \uB2F4\uC744 \uACFC\uBAA9\uBA85\uC744 \uC801\uC5B4 \uC8FC\uC138\uC694.");
      if (unitName) append([courseName, unitName], "unit");
      for (const topic of unit.topics) {
        if (++rows > MAX_OUTLINE_ROWS) fail2("\uB2E8\uC6D0\uACFC \uC8FC\uC81C \uC785\uB825\uC740 \uD569\uACC4 500\uD589\uAE4C\uC9C0 \uC0AC\uC6A9\uD560 \uC218 \uC788\uC2B5\uB2C8\uB2E4.");
        const topicName = cell(topic);
        if (topicName && (!courseName || !unitName)) fail2("\uC8FC\uC81C\uB97C \uB2F4\uC744 \uACFC\uBAA9\uBA85\uACFC \uB2E8\uC6D0\uBA85\uC744 \uC801\uC5B4 \uC8FC\uC138\uC694.");
        if (topicName) append([courseName, unitName, topicName], "topic");
      }
    }
  }
  return { entries, ready: entries.length > 0 && entries.every((row) => ["new", "reuse"].includes(row.status)), newCount: entries.filter((row) => row.status === "new").length, reuseCount: entries.filter((row) => row.status === "reuse").length, expectedToken: outlineTableToken(state) };
}

// src/domain/memo.ts
var MEMO_WIDTH = 900;
var MEMO_HEIGHT = 600;
function validateMemoContent(value) {
  const row = value;
  const bad = () => {
    throw new DomainError("INVALID_MEMO", "\uBA54\uBAA8\uC758 \uAE00\uC774\uB098 \uADF8\uB9BC\uC744 \uC77D\uC9C0 \uBABB\uD588\uC2B5\uB2C8\uB2E4. \uC6D0\uBB38\uC744 \uBCC0\uACBD\uD558\uC9C0 \uC54A\uC558\uC2B5\uB2C8\uB2E4.");
  };
  if (!row || typeof row.body !== "string" || row.ownerId !== null && (typeof row.ownerId !== "string" || !row.ownerId.trim()) || !Array.isArray(row.strokes)) return bad();
  const ids = /* @__PURE__ */ new Set();
  for (const stroke of row.strokes) {
    if (!stroke || typeof stroke.id !== "string" || !stroke.id.trim() || ids.has(stroke.id) || !["ink", "blue", "green"].includes(stroke.ink) || !Number.isFinite(stroke.width) || stroke.width <= 0 || stroke.width > 40 || !Array.isArray(stroke.points) || !stroke.points.length) return bad();
    ids.add(stroke.id);
    for (const point of stroke.points) if (!point || !Number.isFinite(point.x) || !Number.isFinite(point.y) || point.x < 0 || point.x > MEMO_WIDTH || point.y < 0 || point.y > MEMO_HEIGHT || !Number.isFinite(point.pressure) || point.pressure < 0 || point.pressure > 1) return bad();
  }
}

// src/domain/learning-schedule.ts
var day = (s) => s === "" || /^\d{4}-\d{2}-\d{2}$/.test(s) && Number.isFinite(Date.parse(s)) && new Date(s).toISOString().slice(0, 10) === s;
function validateScheduleExtensions(w, data) {
  const node = new Map(data.nodes.map((n) => [n.id, n])), ids = /* @__PURE__ */ new Set();
  for (const s of w.schedules ?? []) {
    if (!s || typeof s.id !== "string" || !s.id || ids.has(s.id) || !data.subjects.some((p) => p.id === s.subjectId) || typeof s.name !== "string" || !s.name.trim() || !["exam", "quiz", "assignment", "lecture"].includes(s.kind) || !["active", "ended"].includes(s.status) || !["exam", "submission", "attendance", "personal", "unknown"].includes(s.dueMeaning) || typeof s.note !== "string" || !day(s.dueDate) || !day(s.opensDate) || s.opensDate && s.dueDate && s.opensDate > s.dueDate || s.weight !== null && (!Number.isFinite(s.weight) || s.weight < 0 || s.weight > 1) || !Array.isArray(s.goalIds) || !Array.isArray(s.targetIds) || !s.states || typeof s.states !== "object" || Object.values(s.states).some((v) => !["unknown", "not-done", "done"].includes(v))) throw Error("\uC77C\uC815\uC758 \uB0A0\uC9DC\xB7\uBC94\uC704\xB7\uC0C1\uD0DC\uB97C \uD655\uC778\uD574 \uC8FC\uC138\uC694.");
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
  if (w.termDraft && (typeof w.termDraft.semesterId !== "string" || typeof w.termDraft.start !== "string" || typeof w.termDraft.end !== "string")) throw Error("\uC791\uC131 \uC911\uC778 \uD559\uAE30 \uAE30\uAC04\uC744 \uC77D\uC9C0 \uBABB\uD588\uC2B5\uB2C8\uB2E4.");
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

// src/domain/commands.ts
function verifyLearningPlan(workspace, state) {
  try {
    validateRecommendations(workspace, state);
  } catch (error) {
    throw new DomainError("INVALID_LEARNING_PLAN", error instanceof Error ? error.message : "\uD559\uC2B5 \uC77C\uC815\uC758 \uB0B4\uC6A9\uC744 \uD655\uC778\uD574 \uC8FC\uC138\uC694.");
  }
}
var collections = ["semesters", "subjects", "nodes", "sessions", "records", "narratives", "criteria", "criteriaAssignments", "memos", "learningPlans", "canvasLayouts"];
var clone = (value) => structuredClone(value);
function fail(code, message, details) {
  throw new DomainError(code, message, details);
}
function canonical(value) {
  if (Array.isArray(value)) return "[" + value.map(canonical).join(",") + "]";
  if (value && typeof value === "object") return "{" + Object.entries(value).filter(([, v]) => v !== void 0).sort(([a], [b]) => a.localeCompare(b)).map(([k, v]) => JSON.stringify(k) + ":" + canonical(v)).join(",") + "}";
  return JSON.stringify(value);
}
function identity(id) {
  if (typeof id !== "string" || !id.trim() || id.length > 256) fail("INVALID_ID", "\uD56D\uBAA9\uC758 \uC2DD\uBCC4\uC790\uB97C \uD655\uC778\uD574 \uC8FC\uC138\uC694.");
}
function title(name) {
  if (typeof name !== "string" || !name.trim()) fail("EMPTY_NAME", "\uC774\uB984\uC744 \uC785\uB825\uD574 \uC8FC\uC138\uC694.");
  return name.trim();
}
function validDay(day2) {
  return typeof day2 === "string" && /^\d{4}-\d{2}-\d{2}$/.test(day2) && Number.isFinite(Date.parse(day2)) && new Date(day2).toISOString().slice(0, 10) === day2;
}
function validateDateEvidence(value) {
  if (!value || !["exact", "range", "unknown"].includes(value.kind)) fail("INVALID_DATE", "\uACF5\uBD80\uD55C \uB0A0\uC9DC\uC758 \uAE30\uC5B5 \uC815\uB3C4\uB97C \uD655\uC778\uD574 \uC8FC\uC138\uC694.");
  if (value.kind === "exact" && !validDay(value.date)) fail("INVALID_DATE", "\uC2E4\uC81C \uACF5\uBD80\uD55C \uB0A0\uC9DC\uB97C \uD655\uC778\uD574 \uC8FC\uC138\uC694.");
  if (value.kind === "range" && (!validDay(value.from) || !validDay(value.to) || value.from > value.to)) fail("INVALID_DATE", "\uAE30\uC5B5\uB098\uB294 \uB0A0\uC9DC \uBC94\uC704\uB97C \uD655\uC778\uD574 \uC8FC\uC138\uC694.");
}
function verifyScope(state, scope) {
  if (!scope || !["semester", "independent", "unassigned"].includes(scope.kind)) fail("INVALID_SCOPE", "\uACFC\uBAA9\uC758 \uC18C\uC18D\uC744 \uD655\uC778\uD574 \uC8FC\uC138\uC694.");
  if (scope.kind === "semester" && !state.semesters.some((s) => s.id === scope.semesterId && !s.deletedAt)) fail("INVALID_SCOPE", "\uC5F0\uACB0\uD560 \uD559\uAE30\uB97C \uCC3E\uC744 \uC218 \uC5C6\uC2B5\uB2C8\uB2E4.");
}
function find(values, id, active = true) {
  const row = values.find((v) => v.id === id);
  if (!row || active && row.deletedAt) return fail("NOT_FOUND", "\uB300\uC0C1\uC744 \uCC3E\uC744 \uC218 \uC5C6\uC2B5\uB2C8\uB2E4. \uD734\uC9C0\uD1B5\uC744 \uD655\uC778\uD574 \uC8FC\uC138\uC694.", { id });
  return row;
}
function expected(row, version, attempted) {
  if (row.version !== version) fail("VERSION_CONFLICT", "\uB2E4\uB978 \uACF3\uC5D0\uC11C \uBCC0\uACBD\uB41C \uB0B4\uC6A9\uC774 \uC788\uC2B5\uB2C8\uB2E4. \uB450 \uB0B4\uC6A9\uC744 \uD655\uC778\uD574 \uC8FC\uC138\uC694.", { baseVersion: version, current: clone(row), attempted: clone(attempted) });
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
  if (!trace || typeof trace !== "object" || Array.isArray(trace)) fail("INVALID_TRACE", "\uD65C\uB3D9 \uC785\uB825\uC744 \uD655\uC778\uD574 \uC8FC\uC138\uC694.");
  for (const [id, item] of Object.entries(trace)) {
    identity(id);
    if (!/^[TRACE][A-Za-z0-9_-]*$/.test(id)) fail("INVALID_TRACE_ID", "\uD65C\uB3D9\uC758 \uC6D0\uB798 \uC2DD\uBCC4\uC790\uB97C \uD655\uC778\uD574 \uC8FC\uC138\uC694.");
    if (!item || !["checked", "unchecked", "na", "deferred"].includes(item.status) || item.note !== void 0 && typeof item.note !== "string") fail("INVALID_TRACE", "\uD65C\uB3D9 \uC0C1\uD0DC\uC640 \uBA54\uBAA8\uB97C \uD655\uC778\uD574 \uC8FC\uC138\uC694.");
    if (item.definition !== void 0) validateTraceDefinition(item.definition, id);
    if (item.examReview && (typeof item.examReview.answer !== "string" || typeof item.examReview.checked !== "boolean" || item.examReview.checked && (!item.examReview.answer.trim() || item.status !== "checked"))) fail("INVALID_WRITTEN_REVIEW", "\uC810\uAC80\uD558\uB824\uBA74 \uC790\uAE30 \uBB38\uC7A5\uC73C\uB85C \uC11C\uC220\uC744 \uB0A8\uACA8 \uC8FC\uC138\uC694.");
    if (item.repeats) {
      const ids = /* @__PURE__ */ new Set();
      for (const repeat of item.repeats) {
        identity(repeat.id);
        if (ids.has(repeat.id)) fail("DUPLICATE_REPEAT", "\uAC19\uC740 \uBC18\uBCF5 \uAE30\uB85D\uC774 \uC911\uBCF5\uB418\uC5B4 \uC788\uC2B5\uB2C8\uB2E4.");
        ids.add(repeat.id);
        if (!["exact", "minimum", "unknown"].includes(repeat.kind) || (repeat.kind === "unknown" ? repeat.count !== null : !Number.isSafeInteger(repeat.count) || Number(repeat.count) < 1)) fail("INVALID_REPEAT", "\uBC18\uBCF5 \uD69F\uC218\uC758 \uAE30\uC5B5 \uC815\uB3C4\uB97C \uD655\uC778\uD574 \uC8FC\uC138\uC694.");
        if (repeat.dateEvidence) validateDateEvidence(repeat.dateEvidence);
      }
    }
  }
}
function mergeTrace(previous, patch) {
  verifyTrace(patch);
  const next = clone(previous);
  for (const [id, item] of Object.entries(patch)) {
    if (item.examReview && canonical(item.examReview) !== canonical(previous[id]?.examReview ?? null)) fail("REVIEW_COMMAND_REQUIRED", "\uC11C\uC220 \uC218\uC815\uACFC \uC810\uAC80 \uD655\uC778\uC740 \uD574\uB2F9 \uC870\uC791\uC744 \uC0AC\uC6A9\uD574 \uC8FC\uC138\uC694.");
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
  if (state.schemaVersion !== 1 || !["demo", "personal", "test"].includes(state.namespace)) fail("INVALID_STATE", "\uC790\uB8CC \uD615\uC2DD\uC744 \uD655\uC778\uD574 \uC8FC\uC138\uC694.");
  identity(state.userId);
  const globallyUnique = /* @__PURE__ */ new Set();
  for (const name of collections) {
    if (state[name] !== void 0 && !Array.isArray(state[name])) fail("INVALID_STATE", "\uC790\uB8CC \uBAA9\uB85D\uC758 \uD615\uC2DD\uC744 \uD655\uC778\uD574 \uC8FC\uC138\uC694.");
    for (const row of state[name] ?? []) {
      identity(row.id);
      if (globallyUnique.has(row.id)) fail("DUPLICATE_ID", "\uAC19\uC740 \uC2DD\uBCC4\uC790\uAC00 \uC911\uBCF5\uB418\uC5B4 \uC788\uC2B5\uB2C8\uB2E4.", { id: row.id });
      globallyUnique.add(row.id);
      if (row.userId !== state.userId || row.namespace !== state.namespace) fail("OWNERSHIP", "\uB2E4\uB978 \uC0AC\uC6A9\uC790\uB098 \uC2DC\uD5D8 \uACF5\uAC04\uC758 \uC790\uB8CC\uB97C \uD568\uAED8 \uCC98\uB9AC\uD560 \uC218 \uC5C6\uC2B5\uB2C8\uB2E4.");
      if (!Number.isInteger(row.version) || row.version < 1) fail("INVALID_VERSION", "\uC218\uC815 \uC21C\uC11C\uB97C \uD655\uC778\uD574 \uC8FC\uC138\uC694.");
    }
  }
  const index = new Map(collections.flatMap((name) => (state[name] ?? []).map((row) => [row.id, row])));
  const subjectIds = new Set(state.subjects.map((row) => row.id));
  const sessionIds = new Set(state.sessions.map((row) => row.id));
  const semesterIds = new Set(state.semesters.map((row) => row.id));
  const nodeIndex = new Map(state.nodes.map((row) => [row.id, row]));
  for (const subject of state.subjects) {
    if (subject.scope.kind === "semester") {
      if (!semesterIds.has(subject.scope.semesterId)) fail("NOT_FOUND", "\uACFC\uBAA9\uC774 \uC5F0\uACB0\uB41C \uD559\uAE30\uB97C \uCC3E\uC744 \uC218 \uC5C6\uC2B5\uB2C8\uB2E4.");
    } else if (!["independent", "unassigned"].includes(subject.scope.kind)) fail("INVALID_SCOPE", "\uACFC\uBAA9 \uC18C\uC18D\uC744 \uD655\uC778\uD574 \uC8FC\uC138\uC694.");
  }
  for (const node of state.nodes) {
    if (!subjectIds.has(node.subjectId)) fail("NOT_FOUND", "\uBAA9\uCC28\uC758 \uACFC\uBAA9\uC744 \uCC3E\uC744 \uC218 \uC5C6\uC2B5\uB2C8\uB2E4.");
    const seen = /* @__PURE__ */ new Set([node.id]);
    let parentId = node.parentId;
    while (parentId !== null) {
      if (seen.has(parentId)) fail("CYCLE", "\uD558\uC704 \uD56D\uBAA9 \uC548\uC73C\uB85C \uC774\uB3D9\uD560 \uC218 \uC5C6\uC2B5\uB2C8\uB2E4.");
      seen.add(parentId);
      const parent = nodeIndex.get(parentId);
      if (!parent) fail("NOT_FOUND", "\uBD80\uBAA8 \uBAA9\uCC28\uB97C \uCC3E\uC744 \uC218 \uC5C6\uC2B5\uB2C8\uB2E4.");
      if (parent.subjectId !== node.subjectId) fail("SUBJECT_MISMATCH", "\uB2E4\uB978 \uACFC\uBAA9\uC758 \uD56D\uBAA9 \uC544\uB798\uB85C \uC774\uB3D9\uD560 \uC218 \uC5C6\uC2B5\uB2C8\uB2E4.");
      parentId = parent.parentId;
    }
  }
  const pairs = /* @__PURE__ */ new Set();
  for (const row of state.records) {
    if (!sessionIds.has(row.sessionId)) fail("NOT_FOUND", "\uC6D0\uB798 \uACF5\uBD80 \uC138\uC158\uC744 \uCC3E\uC744 \uC218 \uC5C6\uC2B5\uB2C8\uB2E4.");
    const subjectId = subjectIds.has(row.targetId) ? row.targetId : nodeIndex.get(row.targetId)?.subjectId;
    if (subjectId !== row.subjectId) fail("SUBJECT_MISMATCH", "\uAE30\uB85D\uACFC \uC8FC\uC81C\uC758 \uACFC\uBAA9\uC774 \uB2E4\uB985\uB2C8\uB2E4.");
    const key = canonical([row.sessionId, row.targetId]);
    if (pairs.has(key)) fail("DUPLICATE_RECORD", "\uD55C \uACF5\uBD80\uC758 \uAC19\uC740 \uB300\uC0C1 \uAE30\uB85D\uC774 \uC911\uBCF5\uB418\uC5B4 \uC788\uC2B5\uB2C8\uB2E4.");
    pairs.add(key);
    validateDateEvidence(row.dateEvidence);
    verifyTrace(row.trace);
    if (typeof row.body !== "string" || typeof row.done !== "boolean") fail("INVALID_RECORD", "\uACF5\uBD80 \uAE30\uB85D\uC758 \uC785\uB825\uC744 \uD655\uC778\uD574 \uC8FC\uC138\uC694.");
  }
  for (const row of state.sessions) validateDateEvidence(row.dateEvidence);
  if ((state.learningPlans ?? []).filter((row) => !row.deletedAt).length > 1) fail("DUPLICATE_PLAN", "\uD559\uC2B5 \uC77C\uC815\uC758 \uC6D0\uB798 \uC5F0\uACB0\uC744 \uD655\uC778\uD574 \uC8FC\uC138\uC694.");
  for (const row of state.learningPlans ?? []) verifyLearningPlan(row.workspace, state);
  for (const row of state.canvasLayouts ?? []) validateCanvasLayout(row);
  for (const row of state.memos ?? []) {
    validateMemoContent(row);
    if (row.ownerId !== null && !subjectIds.has(row.ownerId) && !nodeIndex.has(row.ownerId)) fail("NOT_FOUND", "\uBA54\uBAA8\uC758 \uC6D0\uB798 \uC5F0\uACB0 \uB300\uC0C1\uC744 \uCC3E\uC744 \uC218 \uC5C6\uC2B5\uB2C8\uB2E4.");
  }
  for (const row of state.narratives) {
    if (row.ownerId !== null && !index.has(row.ownerId)) fail("NOT_FOUND", "\uBCF8\uBB38\uC758 \uC6D0\uB798 \uB300\uC0C1\uC744 \uCC3E\uC744 \uC218 \uC5C6\uC2B5\uB2C8\uB2E4.");
    verifyNarrative(state, row);
  }
  const definitions = new Map(defaultCriteriaItems().map((item) => [item.id, item]));
  for (const criteria of state.criteria ?? []) {
    if (!Array.isArray(criteria.items) || criteria.items.length > 100 || new Set(criteria.items.map((item) => item.id)).size !== criteria.items.length) fail("INVALID_CRITERIA", "\uAE30\uC900\uC758 \uD56D\uBAA9\uACFC \uC911\uBCF5 \uC5EC\uBD80\uB97C \uD655\uC778\uD574 \uC8FC\uC138\uC694.");
    for (const item of criteria.items) {
      validateTraceDefinition(item);
      const prior = definitions.get(item.id);
      if (prior && (prior.label !== item.label || prior.group !== item.group || prior.mode !== item.mode || prior.version !== item.version)) fail("CRITERIA_ID_REUSED", "\uB73B\uC774\uB098 \uC801\uC6A9 \uAE30\uC900\uC774 \uBC14\uB010 \uD65C\uB3D9\uC740 \uC0C8 \uD56D\uBAA9\uC73C\uB85C \uAD6C\uBCC4\uD574 \uC8FC\uC138\uC694.");
      definitions.set(item.id, item);
    }
  }
  const assignments = /* @__PURE__ */ new Set();
  for (const assignment of state.criteriaAssignments ?? []) {
    if (!["topic", "subject", "global"].includes(assignment.scope) || assignment.scope === "global" && assignment.ownerId !== null || assignment.scope === "subject" && !subjectIds.has(assignment.ownerId ?? "") || assignment.scope === "topic" && !nodeIndex.has(assignment.ownerId ?? "")) fail("CRITERIA_OWNER", "\uAE30\uC900\uC744 \uC801\uC6A9\uD560 \uC18C\uC18D\uC744 \uD655\uC778\uD574 \uC8FC\uC138\uC694.");
    const key = JSON.stringify([assignment.scope, assignment.ownerId]);
    if (assignments.has(key)) fail("DUPLICATE_CRITERIA_ASSIGNMENT", "\uAC19\uC740 \uD56D\uBAA9\uC5D0 \uAE30\uC900 \uC5F0\uACB0\uC774 \uC911\uBCF5\uB418\uC5B4 \uC788\uC2B5\uB2C8\uB2E4.");
    assignments.add(key);
    const target = state.criteria?.find((criteria) => criteria.id === assignment.criteriaId);
    if (!target || !assignment.deletedAt && target.deletedAt) fail("CRITERIA_REFERENCE", "\uAE30\uC900\uC758 \uC6D0\uBB38 \uC5F0\uACB0\uC744 \uD655\uC778\uD574 \uC8FC\uC138\uC694.");
  }
  for (const row of state.revisions) if (row.userId !== state.userId || row.namespace !== state.namespace) fail("OWNERSHIP", "\uC218\uC815 \uC774\uB825\uC758 \uC18C\uC720\uC790\uAC00 \uB2E4\uB985\uB2C8\uB2E4.");
}
function verifyNarrative(state, row) {
  if (typeof row.body !== "string") fail("INVALID_BODY", "\uBCF8\uBB38\uC740 \uAE00\uB85C \uB0A8\uACA8 \uC8FC\uC138\uC694.");
  if (row.kind === "free-note") {
    if (row.ownerId !== null) targetSubject(state, row.ownerId, false);
    return;
  }
  if (row.ownerId === null) fail("OWNER_REQUIRED", "\uBCF8\uBB38\uC744 \uC5F0\uACB0\uD560 \uB300\uC0C1\uC744 \uD655\uC778\uD574 \uC8FC\uC138\uC694.");
  if (row.kind === "subject-overview") find(state.subjects, row.ownerId, false);
  else if (row.kind === "unit-introduction") {
    if (find(state.nodes, row.ownerId, false).role !== "unit") fail("INVALID_OWNER", "\uB2E8\uC6D0 \uC11C\uBB38\uC740 \uB2E8\uC6D0\uC5D0 \uC5F0\uACB0\uD574 \uC8FC\uC138\uC694.");
  } else if (row.kind === "topic-note") find(state.nodes, row.ownerId, false);
  else fail("INVALID_NARRATIVE", "\uBCF8\uBB38\uC758 \uC885\uB958\uB97C \uD655\uC778\uD574 \uC8FC\uC138\uC694.");
}
function applyCommand(state, command) {
  assertState(state);
  if (command.userId !== state.userId || command.namespace !== void 0 && command.namespace !== state.namespace) fail("OWNERSHIP", "\uB2E4\uB978 \uC0AC\uC6A9\uC790\uB098 \uC2DC\uD5D8 \uACF5\uAC04\uC758 \uC790\uB8CC\uB97C \uBCC0\uACBD\uD560 \uC218 \uC5C6\uC2B5\uB2C8\uB2E4.");
  identity(command.opId);
  if (typeof command.at !== "string" || !Number.isFinite(Date.parse(command.at))) fail("INVALID_TIME", "\uC800\uC7A5 \uC2DC\uAC01\uC744 \uD655\uC778\uD574 \uC8FC\uC138\uC694.");
  const payload = canonical(command);
  if (Object.hasOwn(state.appliedOps, command.opId)) {
    if (state.appliedOps[command.opId] !== payload) fail("OPERATION_REUSED", "\uAC19\uC740 \uC694\uCCAD \uC2DD\uBCC4\uC790\uC5D0 \uB2E4\uB978 \uB0B4\uC6A9\uC774 \uB4E4\uC5B4 \uC788\uC2B5\uB2C8\uB2E4.");
    return state;
  }
  const next = clone(state);
  const common = (id) => ({ id, userId: state.userId, namespace: state.namespace, createdAt: command.at, updatedAt: command.at, version: 1, deletedAt: null });
  const fresh = (id) => {
    identity(id);
    if (collections.some((k) => (next[k] ?? []).some((v) => v.id === id))) fail("DUPLICATE_ID", "\uC774\uBBF8 \uC788\uB294 \uC2DD\uBCC4\uC790\uC785\uB2C8\uB2E4.", { id });
  };
  function write(collection, entity, reversesRevisionId) {
    if (collection === "criteria") next.criteria ??= [];
    if (collection === "criteriaAssignments") next.criteriaAssignments ??= [];
    if (collection === "memos") next.memos ??= [];
    if (collection === "learningPlans") next.learningPlans ??= [];
    if (collection === "canvasLayouts") next.canvasLayouts ??= [];
    const list = next[collection];
    const index = list.findIndex((v) => v.id === entity.id), before = index < 0 ? null : clone(list[index]);
    if (before && canonical(before) === canonical(entity)) return;
    const after = { ...clone(entity), updatedAt: command.at, version: before ? before.version + 1 : 1 };
    if (index < 0) list.push(after);
    else list[index] = after;
    const parent = [...next.revisions].reverse().find((r) => r.collection === collection && r.entityId === entity.id);
    const revision = { ...common(`revision:${encodeURIComponent(command.opId)}:${next.revisions.length}`), collection, entityId: entity.id, operationId: command.opId, parentRevisionId: parent?.id ?? null, before, after: clone(after), ...reversesRevisionId ? { reversesRevisionId } : {} };
    next.revisions.push(revision);
  }
  const node = (id, version, active = true) => {
    const found = find(next.nodes, id, active);
    expected(found, version, command);
    return found;
  };
  switch (command.type) {
    case "saveCanvasLayout": {
      validateCanvasLayout(command);
      const old = next.canvasLayouts?.find((row) => row.id === command.id);
      if (old) {
        find(next.canvasLayouts, old.id);
        expected(old, command.expectedVersion, command);
      } else {
        if (command.expectedVersion !== 0) fail("VERSION_CONFLICT", "Canvas \uBC30\uCE58\uC758 \uC218\uC815 \uC21C\uC11C\uB97C \uD655\uC778\uD574 \uC8FC\uC138\uC694.");
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
        if (command.expectedVersion !== 0) fail("VERSION_CONFLICT", "\uD559\uC2B5 \uC77C\uC815\uC774 \uBC14\uB00C\uC5C8\uC2B5\uB2C8\uB2E4. \uC791\uC131 \uB0B4\uC6A9\uC744 \uC720\uC9C0\uD588\uC2B5\uB2C8\uB2E4.");
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
      if (command.expectedToken !== outlineTableToken(next)) fail("OUTLINE_STALE", "\uBAA9\uCC28\uAC00 \uBCC0\uACBD\uB418\uC5C8\uC2B5\uB2C8\uB2E4. \uC785\uB825\uC740 \uC720\uC9C0\uD558\uACE0 \uC0DD\uC131\uD560 \uAD6C\uC870\uB97C \uB2E4\uC2DC \uD655\uC778\uD574 \uC8FC\uC138\uC694.");
      const preview = previewOutlineTable(next, command);
      if (!preview.ready) fail("OUTLINE_CHOICE_REQUIRED", "\uAC19\uC740 \uC774\uB984\uC758 \uD56D\uBAA9\uC744 \uC5B4\uB5BB\uAC8C \uC0AC\uC6A9\uD560\uC9C0 \uBA3C\uC800 \uACE8\uB77C \uC8FC\uC138\uC694.");
      if (!preview.newCount) fail("EMPTY_OUTLINE_TABLE", "\uC0C8\uB85C \uB9CC\uB4E4 \uD56D\uBAA9\uC774 \uC5C6\uC2B5\uB2C8\uB2E4. \uAE30\uC874 \uD56D\uBAA9 \uC5F0\uACB0\uC744 \uD655\uC778\uD574 \uC8FC\uC138\uC694.");
      if (!command.ids || typeof command.ids !== "object" || Array.isArray(command.ids)) fail("INVALID_ID", "\uC0C8 \uD56D\uBAA9\uC758 \uC2DD\uBCC4\uC790\uB97C \uD655\uC778\uD574 \uC8FC\uC138\uC694.");
      const used = /* @__PURE__ */ new Set(), resolved = /* @__PURE__ */ new Map();
      for (const entry of preview.entries) if (entry.status === "new") {
        if (!Object.hasOwn(command.ids, entry.key)) fail("INVALID_ID", "\uC0C8 \uD56D\uBAA9\uC758 \uC2DD\uBCC4\uC790\uB97C \uD655\uC778\uD574 \uC8FC\uC138\uC694.");
        const id = command.ids[entry.key];
        fresh(id);
        if (used.has(id)) fail("DUPLICATE_ID", "\uCD94\uAC00\uD560 \uD56D\uBAA9\uC758 \uC2DD\uBCC4\uC790\uAC00 \uACB9\uCCE4\uC2B5\uB2C8\uB2E4.");
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
      if (!["unit", "outline", "topic"].includes(command.role)) fail("INVALID_ROLE", "\uBAA9\uCC28 \uD56D\uBAA9\uC758 \uC5ED\uD560\uC744 \uD655\uC778\uD574 \uC8FC\uC138\uC694.");
      if (command.parentId !== null && targetSubject(next, command.parentId) !== command.subjectId) fail("SUBJECT_MISMATCH", "\uBD80\uBAA8 \uD56D\uBAA9\uC758 \uACFC\uBAA9\uC774 \uB2E4\uB985\uB2C8\uB2E4.");
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
        if (targetSubject(next, parent.id) !== command.subjectId) fail("SUBJECT_MISMATCH", "\uBD80\uBAA8 \uD56D\uBAA9\uC758 \uACFC\uBAA9\uC774 \uB2E4\uB985\uB2C8\uB2E4.");
      }
      if (command.expectedToken !== outlineRevisionToken(next, command.subjectId, command.parentId)) fail("OUTLINE_STALE", "\uBAA9\uCC28\uAC00 \uBCC0\uACBD\uB418\uC5C8\uC2B5\uB2C8\uB2E4. \uC785\uB825\uC740 \uC720\uC9C0\uD558\uACE0 \uD604\uC7AC \uAD6C\uC870\uB97C \uB2E4\uC2DC \uD655\uC778\uD574 \uC8FC\uC138\uC694.");
      const siblings = next.nodes.filter((row) => row.subjectId === command.subjectId && row.parentId === command.parentId && !row.deletedAt);
      if (command.type === "reorderNodes") {
        if (!Array.isArray(command.ids) || command.ids.length !== siblings.length || new Set(command.ids).size !== command.ids.length) fail("INVALID_ORDER", "\uAC19\uC740 \uC704\uCE58\uC758 \uD56D\uBAA9 \uC804\uCCB4\uB97C \uD55C \uBC88\uC529 \uC815\uB82C\uD574 \uC8FC\uC138\uC694.");
        const byId = new Map(siblings.map((row) => [row.id, row]));
        for (const id of command.ids) {
          identity(id);
          if (!byId.has(id)) fail("INVALID_ORDER", "\uAC19\uC740 \uACFC\uBAA9\uACFC \uBD80\uBAA8 \uC544\uB798\uC758 \uD56D\uBAA9\uB9CC \uC815\uB82C\uD560 \uC218 \uC788\uC2B5\uB2C8\uB2E4.");
        }
        command.ids.forEach((id, order) => write("nodes", { ...byId.get(id), order }));
      } else {
        if (!["unit", "outline", "topic"].includes(command.role)) fail("INVALID_ROLE", "\uBAA9\uCC28 \uD56D\uBAA9\uC758 \uC5ED\uD560\uC744 \uD655\uC778\uD574 \uC8FC\uC138\uC694.");
        if (!Array.isArray(command.entries) || !command.entries.length || command.entries.length > MAX_OUTLINE_ROWS || command.entries.some((entry) => !entry || typeof entry !== "object")) fail("INVALID_OUTLINE_ROWS", `\uCD94\uAC00\uD560 \uD56D\uBAA9\uC744 1\uAC1C\uBD80\uD130 ${MAX_OUTLINE_ROWS}\uAC1C\uAE4C\uC9C0 \uD655\uC778\uD574 \uC8FC\uC138\uC694.`);
        const preview = previewOutlineEntries(command.entries.map((entry) => entry.name));
        if (preview.issues.length || preview.entries.length !== command.entries.length) fail("INVALID_OUTLINE_ROWS", "\uBE48 \uC774\uB984\xB7\uBC18\uBCF5\uB41C \uC774\uB984\xB7\uAE38\uC774\uB97C \uBBF8\uB9AC\uBCF4\uAE30\uC5D0\uC11C \uD655\uC778\uD574 \uC8FC\uC138\uC694.", preview.issues);
        if (command.duplicateNames !== "create" && preview.entries.some((entry) => siblings.some((row) => row.name === entry.name))) fail("DUPLICATE_NAME_CHOICE", "\uAC19\uC740 \uC774\uB984\uC758 \uD56D\uBAA9\uC774 \uC788\uC2B5\uB2C8\uB2E4. \uAE30\uC874 \uD56D\uBAA9\uC744 \uC0AC\uC6A9\uD560\uC9C0 \uC0C8\uB85C \uB9CC\uB4E4\uC9C0 \uACE8\uB77C \uC8FC\uC138\uC694.");
        const ids = /* @__PURE__ */ new Set();
        for (const entry of command.entries) {
          fresh(entry.id);
          if (ids.has(entry.id)) fail("DUPLICATE_ID", "\uCD94\uAC00\uD560 \uD56D\uBAA9\uC758 \uC2DD\uBCC4\uC790\uAC00 \uACB9\uCCE4\uC2B5\uB2C8\uB2E4.");
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
        if (targetSubject(next, parent.id) !== row.subjectId) fail("SUBJECT_MISMATCH", "\uACFC\uBAA9 \uAC04 \uC774\uB3D9\uC740 \uBCC4\uB3C4 \uBCF5\uC0AC \uC808\uCC28\uAC00 \uD544\uC694\uD569\uB2C8\uB2E4.");
      }
      const order = command.order ?? next.nodes.filter((n) => n.subjectId === row.subjectId && n.parentId === command.parentId).length;
      if (!Number.isSafeInteger(order) || order < 0) fail("INVALID_ORDER", "\uC815\uB82C \uC21C\uC11C\uB97C \uD655\uC778\uD574 \uC8FC\uC138\uC694.");
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
      if (root.parentId && find(next.nodes, root.parentId, false).deletedAt) fail("PARENT_DELETED", "\uC0C1\uC704 \uD56D\uBAA9\uC744 \uBA3C\uC800 \uBCF5\uC6D0\uD574 \uC8FC\uC138\uC694.");
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
      if (!command.entries.length) fail("EMPTY_RECORD", "\uACF5\uBD80\uD55C \uB300\uC0C1\uC744 \uD558\uB098 \uC774\uC0C1 \uACE8\uB77C \uC8FC\uC138\uC694.");
      if (new Set(command.entries.map((e) => e.targetId)).size !== command.entries.length) fail("DUPLICATE_TARGET", "\uAC19\uC740 \uB300\uC0C1\uC744 \uB450 \uBC88 \uAE30\uB85D\uD560 \uC218 \uC5C6\uC2B5\uB2C8\uB2E4.");
      const session = next.sessions.find((s) => s.id === command.sessionId);
      if (session?.deletedAt) fail("DELETED_SESSION", "\uD734\uC9C0\uD1B5\uC758 \uACF5\uBD80 \uAE30\uB85D\uC740 \uBA3C\uC800 \uBCF5\uC6D0\uD574 \uC8FC\uC138\uC694.");
      if (!session) {
        fresh(command.sessionId);
        write("sessions", { ...common(command.sessionId), dateEvidence: clone(command.dateEvidence) });
      }
      for (const entry of command.entries) {
        const subjectId = targetSubject(next, entry.targetId);
        if (entry.subjectId !== void 0 && entry.subjectId !== subjectId) fail("SUBJECT_MISMATCH", "\uAE30\uB85D\uC758 \uACFC\uBAA9\uACFC \uB300\uC0C1\uC774 \uB2E4\uB985\uB2C8\uB2E4.");
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
      if (Object.keys(command.patch).some((k) => !["body", "done", "dateEvidence", "trace"].includes(k))) fail("INVALID_PATCH", "\uAE30\uB85D\uC758 \uC18C\uC18D\uC740 \uC77C\uBC18 \uC218\uC815\uC73C\uB85C \uBC14\uAFC0 \uC218 \uC5C6\uC2B5\uB2C8\uB2E4.");
      write("records", { ...row, ...clone(command.patch), trace: command.patch.trace ? mergeTrace(row.trace, command.patch.trace) : row.trace });
      break;
    }
    case "updateNarrative": {
      const old = next.narratives.find((n) => n.id === command.id);
      if (old) {
        expected(old, command.expectedVersion, command.body);
        if (old.kind !== command.kind || old.ownerId !== command.ownerId) fail("OWNER_CHANGED", "\uBCF8\uBB38\uC758 \uC5F0\uACB0 \uB300\uC0C1\uC740 \uC77C\uBC18 \uC218\uC815\uC73C\uB85C \uBC14\uAFC0 \uC218 \uC5C6\uC2B5\uB2C8\uB2E4.");
      } else {
        if (command.expectedVersion !== 0) fail("VERSION_CONFLICT", "\uBCF8\uBB38\uC758 \uC800\uC7A5 \uC0C1\uD0DC\uB97C \uD655\uC778\uD574 \uC8FC\uC138\uC694.");
        fresh(command.id);
      }
      const value = { ...old ?? common(command.id), kind: command.kind, ownerId: command.ownerId, body: command.body };
      verifyNarrative(next, value);
      write("narratives", value);
      break;
    }
    case "saveMemo": {
      const old = next.memos?.find((row) => row.id === command.id);
      if (old) {
        find(next.memos, old.id);
        expected(old, command.expectedVersion, command);
      } else {
        if (command.expectedVersion !== 0) fail("VERSION_CONFLICT", "\uBA54\uBAA8\uC758 \uC800\uC7A5 \uC0C1\uD0DC\uB97C \uD655\uC778\uD574 \uC8FC\uC138\uC694.");
        fresh(command.id);
      }
      validateMemoContent(command);
      if (command.ownerId !== null) targetSubject(next, command.ownerId, old?.ownerId !== command.ownerId);
      write("memos", { ...old ?? common(command.id), ownerId: command.ownerId, body: command.body, strokes: clone(command.strokes) });
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
      if (command.expectedToken !== criteriaRevisionToken(next)) fail("CRITERIA_STALE", "\uAE30\uC900\uC774\uB098 \uBAA9\uCC28\uAC00 \uBCC0\uACBD\uB418\uC5C8\uC2B5\uB2C8\uB2E4. \uC785\uB825\uC740 \uC720\uC9C0\uD558\uACE0 \uD604\uC7AC \uBC94\uC704\uB97C \uB2E4\uC2DC \uD655\uC778\uD574 \uC8FC\uC138\uC694.");
      fresh(command.id);
      if (!Array.isArray(command.items) || command.items.length > 100 || new Set(command.items.map((item) => item.id)).size !== command.items.length) fail("INVALID_CRITERIA", "\uAE30\uC900\uC740 \uC11C\uB85C \uB2E4\uB978 \uD56D\uBAA9 100\uAC1C\uAE4C\uC9C0 \uC870\uC815\uD560 \uC218 \uC788\uC2B5\uB2C8\uB2E4.");
      const known = new Map(defaultCriteriaItems().map((item) => [item.id, item]));
      for (const criteria of next.criteria ?? []) for (const item of criteria.items) known.set(item.id, item);
      for (const item of command.items) {
        validateTraceDefinition(item);
        if (item.label.length > 180) fail("INVALID_CRITERIA", "\uD56D\uBAA9 \uBB38\uAD6C\uB294 180\uC790 \uC774\uB0B4\uB85C \uC785\uB825\uD574 \uC8FC\uC138\uC694.");
        const old = known.get(item.id);
        if (old && canonical(old) !== canonical(item)) fail("CRITERIA_ID_REUSED", "\uB73B\uC774\uB098 \uC801\uC6A9 \uAE30\uC900\uC774 \uBC14\uB010 \uD65C\uB3D9\uC740 \uC0C8 \uD56D\uBAA9\uC73C\uB85C \uAD6C\uBCC4\uD574 \uC8FC\uC138\uC694.");
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
        if (typeof command.answer !== "string") fail("INVALID_BODY", "\uC11C\uC220\uC744 \uAE00\uB85C \uC785\uB825\uD574 \uC8FC\uC138\uC694.");
        item.examReview = { answer: command.answer, checked: false, updatedAt: command.at };
      } else if (command.type === "unconfirmWrittenReview") {
        if (item.examReview) item.examReview = { ...item.examReview, checked: false, updatedAt: command.at };
      } else {
        if (!item.examReview?.answer.trim()) fail("EMPTY_WRITTEN_REVIEW", "\uC810\uAC80\uD558\uB824\uBA74 \uBA3C\uC800 \uC790\uAE30 \uBB38\uC7A5\uC73C\uB85C \uC11C\uC220\uD574 \uC8FC\uC138\uC694.");
        item.status = "checked";
        item.examReview = { ...item.examReview, checked: true, updatedAt: command.at };
      }
      trace[WRITTEN_REVIEW_ITEM_ID] = item;
      write("records", { ...row, trace });
      break;
    }
    case "undoRevision": {
      const revision = next.revisions.find((r) => r.id === command.revisionId);
      if (!revision) fail("NOT_FOUND", "\uB418\uB3CC\uB9B4 \uC218\uC815 \uC774\uB825\uC744 \uCC3E\uC744 \uC218 \uC5C6\uC2B5\uB2C8\uB2E4.");
      const row = find(next[revision.collection] ?? [], revision.entityId, false);
      expected(row, command.expectedVersion, command);
      const latest = [...next.revisions].reverse().find((r) => r.collection === revision.collection && r.entityId === revision.entityId);
      if (latest?.id !== revision.id) fail("UNDO_CONFLICT", "\uADF8 \uB4A4\uC758 \uBCC0\uACBD\uC774 \uC788\uC2B5\uB2C8\uB2E4. \uD604\uC7AC \uC6D0\uBB38\uACFC \uC774\uB825\uC744 \uBE44\uAD50\uD574 \uC8FC\uC138\uC694.");
      const group = next.revisions.filter((r) => r.operationId === revision.operationId);
      const affectedInGroup = new Set(group.map((r) => r.entityId));
      for (const item of group) {
        if (item.before === null) {
          const external = (row2) => !row2.deletedAt && !affectedInGroup.has(row2.id);
          const referenced = next.subjects.some((s) => external(s) && s.scope.kind === "semester" && s.scope.semesterId === item.entityId) || next.nodes.some((n) => external(n) && (n.subjectId === item.entityId || n.parentId === item.entityId)) || next.records.some((r) => external(r) && (r.sessionId === item.entityId || r.targetId === item.entityId)) || next.narratives.some((n) => external(n) && n.ownerId === item.entityId) || (next.memos ?? []).some((memo) => external(memo) && memo.ownerId === item.entityId) || (next.criteriaAssignments ?? []).some((assignment) => external(assignment) && (assignment.criteriaId === item.entityId || assignment.ownerId === item.entityId));
          if (referenced) fail("UNDO_DEPENDENCY", "\uADF8 \uB4A4 \uC5F0\uACB0\uB41C \uB0B4\uC6A9\uC774 \uC788\uC2B5\uB2C8\uB2E4. \uD56D\uBAA9\uC744 \uC9C0\uC6B0\uC9C0 \uC54A\uACE0 \uD604\uC7AC \uC790\uB8CC\uB97C \uBCF4\uC874\uD588\uC2B5\uB2C8\uB2E4.");
        }
        const current = find(next[item.collection] ?? [], item.entityId, false);
        if (current.version !== item.after.version || [...next.revisions].reverse().find((r) => r.collection === item.collection && r.entityId === item.entityId)?.id !== item.id) fail("UNDO_CONFLICT", "\uD568\uAED8 \uBCC0\uACBD\uD55C \uD56D\uBAA9\uC774 \uB2E4\uC2DC \uC218\uC815\uB418\uC5B4 \uC790\uB3D9\uC73C\uB85C \uB418\uB3CC\uB9B4 \uC218 \uC5C6\uC2B5\uB2C8\uB2E4.");
      }
      for (const item of group) {
        const current = find(next[item.collection] ?? [], item.entityId, false);
        const restored = item.before ? { ...clone(item.before), version: current.version } : { ...current, deletedAt: command.at, deletionBatchId: command.opId };
        write(item.collection, restored, item.id);
      }
      break;
    }
    default:
      fail("UNKNOWN_COMMAND", "\uC9C0\uC6D0\uD558\uC9C0 \uC54A\uB294 \uC870\uC791\uC785\uB2C8\uB2E4.");
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
  const collections2 = ["semesters", "subjects", "nodes", "sessions", "records", "narratives", "criteria", "criteriaAssignments", "memos", "learningPlans", "canvasLayouts", "revisions"];
  return {
    userId: state.userId,
    namespace: state.namespace,
    schemaVersion: state.schemaVersion,
    encoding: "lz-base64-utf16-v1",
    encoded,
    appliedOps: { [operationId]: state.appliedOps[operationId] },
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

// src/server/command-handler.ts
var cors = { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Headers": "authorization, apikey, content-type, x-client-info", "Access-Control-Allow-Methods": "POST, OPTIONS", "Cache-Control": "no-store" };
function json(body, status = 200) {
  return new Response(JSON.stringify(body), { status, headers: { ...cors, "Content-Type": "application/json" } });
}
async function handleCommand(request, backend) {
  if (request.method === "OPTIONS") return new Response(null, { status: 204, headers: cors });
  if (request.method !== "POST") return json({ code: "METHOD", message: "\uC9C0\uC6D0\uD558\uC9C0 \uC54A\uB294 \uC694\uCCAD\uC785\uB2C8\uB2E4." }, 405);
  try {
    const authorization = request.headers.get("authorization");
    if (!authorization?.startsWith("Bearer ")) throw new DomainError("AUTH_REQUIRED", "\uAC1C\uC778 \uACF5\uAC04\uC5D0 \uB2E4\uC2DC \uB85C\uADF8\uC778\uD574 \uC8FC\uC138\uC694.");
    const userId = await backend.authenticate(authorization.slice(7));
    if (!userId) throw new DomainError("AUTH_REQUIRED", "\uAC1C\uC778 \uACF5\uAC04\uC5D0 \uB2E4\uC2DC \uB85C\uADF8\uC778\uD574 \uC8FC\uC138\uC694.");
    const text = await request.text();
    if (text.length > 4e6) throw new DomainError("TOO_LARGE", "\uD55C \uBC88\uC5D0 \uC800\uC7A5\uD560 \uB0B4\uC6A9\uC774 \uB108\uBB34 \uD07D\uB2C8\uB2E4. \uC6D0\uBB38\uC740 \uC774 \uAE30\uAE30\uC5D0 \uB0A8\uC544 \uC788\uC2B5\uB2C8\uB2E4.");
    const body = JSON.parse(text);
    const access = await backend.access(userId);
    if (body.action === "access") return json(access);
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
    const current = await backend.read(userId, namespace) ?? { sequence: 0, data: emptyState(userId, namespace) };
    validateState(current.data);
    if (current.data.userId !== userId || current.data.namespace !== namespace) throw new DomainError("OWNERSHIP", "\uC774 \uACF5\uAC04\uC5D0 \uC811\uADFC\uD560 \uC218 \uC5C6\uC2B5\uB2C8\uB2E4.");
    if (body.action === "load") return json({ ...current, supportedCommands: ["saveLearningPlan", "saveCanvasLayout"] });
    if (body.action !== "execute" || !body.command) throw new DomainError("INVALID_REQUEST", "\uC800\uC7A5 \uC694\uCCAD\uC744 \uD655\uC778\uD574 \uC8FC\uC138\uC694.");
    const command = body.command;
    if (typeof command.opId !== "string" || !command.opId.trim() || command.opId.length > 256 || /[\u0000-\u001f\u007f]/.test(command.opId)) throw new DomainError("INVALID_ID", "\uC800\uC7A5 \uC694\uCCAD\uC758 \uC2DD\uBCC4\uC790\uB97C \uD655\uC778\uD574 \uC8FC\uC138\uC694.");
    if (command.userId !== userId || command.namespace !== namespace) throw new DomainError("OWNERSHIP", "\uB2E4\uB978 \uC0AC\uC6A9\uC790\uC758 \uC790\uB8CC\uB97C \uBCC0\uACBD\uD560 \uC218 \uC5C6\uC2B5\uB2C8\uB2E4.");
    if (!Number.isSafeInteger(body.baseSequence) || body.baseSequence < 0) throw new DomainError("INVALID_VERSION", "\uC800\uC7A5 \uC21C\uC11C\uB97C \uD655\uC778\uD574 \uC8FC\uC138\uC694.");
    if (current.data.appliedOps[command.opId]) {
      applyCommand(current.data, command);
      return json({ ...current, supportedCommands: ["saveLearningPlan", "saveCanvasLayout"] });
    }
    if (body.baseSequence !== current.sequence) return json({ code: "VERSION_CONFLICT", message: "\uB2E4\uB978 \uAE30\uAE30\uC758 \uBCC0\uACBD\uACFC \uC791\uC131 \uB0B4\uC6A9\uC744 \uBAA8\uB450 \uBCF4\uC874\uD588\uC2B5\uB2C8\uB2E4.", server: current }, 409);
    const next = applyCommand(current.data, command);
    return json({ ...await backend.commit(userId, namespace, current.sequence, command, next), supportedCommands: ["saveLearningPlan", "saveCanvasLayout"] });
  } catch (error) {
    const code = error instanceof DomainError ? error.code : "SERVER_ERROR";
    const status = code === "AUTH_REQUIRED" ? 401 : ["OWNERSHIP", "ACCESS_DENIED", "ADMIN_REQUIRED", "ADMIN_PROTECTED"].includes(code) ? 403 : /CONFLICT/.test(code) ? 409 : error instanceof DomainError || error instanceof SyntaxError ? 400 : 503;
    return json({ code, message: error instanceof DomainError ? error.message : "\uC11C\uBC84\uC5D0 \uC800\uC7A5\uD558\uC9C0 \uBABB\uD588\uC2B5\uB2C8\uB2E4. \uC791\uC131 \uB0B4\uC6A9\uC740 \uC774 \uAE30\uAE30\uC5D0 \uB0A8\uC544 \uC788\uC2B5\uB2C8\uB2E4." }, status);
  }
}

// supabase/functions/study-command/entry.ts
var url = Deno.env.get("SUPABASE_URL");
var anon = Deno.env.get("SUPABASE_ANON_KEY");
var service = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
async function admin(path, options = {}) {
  const response = await fetch(`${url}/rest/v1/${path}`, { ...options, headers: { apikey: service, Authorization: `Bearer ${service}`, "Content-Type": "application/json", ...options.headers } });
  const result = response.status === 204 ? null : await response.json();
  if (!response.ok) {
    const code = ["ACCESS_DENIED", "ADMIN_REQUIRED", "ADMIN_PROTECTED", "ACCESS_CONFLICT", "VERSION_CONFLICT", "EMAIL_UNCONFIRMED"].find((code2) => result.message?.includes(code2)) ?? "SERVER_ERROR";
    const message = code === "ACCESS_DENIED" ? "\uAD00\uB9AC\uC790 \uC2B9\uC778\uC774 \uD544\uC694\uD558\uAC70\uB098 \uC774\uC6A9\uC774 \uC911\uC9C0\uB418\uC5B4 \uC788\uC2B5\uB2C8\uB2E4. \uC791\uC131 \uB0B4\uC6A9\uC740 \uC774 \uAE30\uAE30\uC5D0 \uB0A8\uC544 \uC788\uC2B5\uB2C8\uB2E4." : code === "ACCESS_CONFLICT" ? "\uACC4\uC815 \uC0C1\uD0DC\uAC00 \uBCC0\uACBD\uB418\uC5C8\uC2B5\uB2C8\uB2E4. \uBAA9\uB85D\uC744 \uB2E4\uC2DC \uBD88\uB7EC\uC640 \uC8FC\uC138\uC694." : code === "EMAIL_UNCONFIRMED" ? "\uC774\uBA54\uC77C \uD655\uC778\uC774 \uB05D\uB09C \uACC4\uC815\uB9CC \uC2B9\uC778\uD560 \uC218 \uC788\uC2B5\uB2C8\uB2E4." : "\uC11C\uBC84\uC5D0\uC11C \uBCC0\uACBD\uC744 \uC2B9\uC778\uD558\uC9C0 \uC54A\uC558\uC2B5\uB2C8\uB2E4. \uC6D0\uBB38\uC744 \uBCF4\uC874\uD588\uC2B5\uB2C8\uB2E4.";
    throw new DomainError(code, message);
  }
  return result;
}
Deno.serve((request) => handleCommand(request, {
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
  async setAccountAccess(actor, target, status, version) {
    await admin("rpc/study_set_account_access", { method: "POST", body: JSON.stringify({ p_actor: actor, p_target: target, p_status: status, p_version: version }) });
  },
  async read(userId, namespace) {
    const row = await admin("rpc/study_read_workspace", { method: "POST", body: JSON.stringify({ p_user: userId, p_namespace: namespace }) });
    return row ? { sequence: row.sequence, data: unpackServerState(row.state) } : null;
  },
  async commit(userId, namespace, base, command, next) {
    const saved = await admin("rpc/study_commit", { method: "POST", body: JSON.stringify({ p_user: userId, p_namespace: namespace, p_base: base, p_operation: command.opId, p_payload: next.appliedOps[command.opId], p_state: packServerState(next, command.opId) }) });
    return { sequence: saved.sequence, data: unpackServerState(saved.data) };
  }
}));
