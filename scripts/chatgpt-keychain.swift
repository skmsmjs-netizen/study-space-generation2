import Foundation
import Security

// A dedicated app key. Never read or share Codex/ChatGPT's existing credentials.
let query: [String: Any] = [
    kSecClass as String: kSecClassGenericPassword,
    kSecAttrService as String: "study-space.chatgpt.local",
    kSecAttrAccount as String: "credential-encryption-v1",
    kSecReturnData as String: true,
    kSecMatchLimit as String: kSecMatchLimitOne
]
var found: CFTypeRef?
var status = SecItemCopyMatching(query as CFDictionary, &found)
if status == errSecItemNotFound {
    var bytes = [UInt8](repeating: 0, count: 32)
    guard SecRandomCopyBytes(kSecRandomDefault, bytes.count, &bytes) == errSecSuccess else { exit(1) }
    let data = Data(bytes)
    let item: [String: Any] = [
        kSecClass as String: kSecClassGenericPassword,
        kSecAttrService as String: "study-space.chatgpt.local",
        kSecAttrAccount as String: "credential-encryption-v1",
        kSecAttrAccessible as String: kSecAttrAccessibleAfterFirstUnlockThisDeviceOnly,
        kSecValueData as String: data
    ]
    status = SecItemAdd(item as CFDictionary, nil)
    if status == errSecDuplicateItem { status = SecItemCopyMatching(query as CFDictionary, &found) }
    else if status == errSecSuccess { found = data as CFData }
}
guard status == errSecSuccess, let data = found as? Data, data.count == 32 else { exit(1) }
// Only the calling trusted Node process consumes stdout; it is never logged.
FileHandle.standardOutput.write(Data(data.base64EncodedString().utf8))
