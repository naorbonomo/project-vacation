# LLM Integration Guide for iOS Client

## Overview
The LLM service has been centralized on the server side. All tool definitions and executions are now handled server-side, simplifying the client implementation.

## Key Changes
- Tool definitions moved from client to server
- Simplified response format
- Unified endpoint for all LLM interactions
- Server handles all function calling logic

## API Endpoint
```
POST http://54.172.43.149:5000/app/chat
```

## Request Format
```swift
let requestBody = [
    "message": String // Plain text user input
]

// Example:
let requestBody = ["message": "What is the weather in Tokyo?"]
```

## Response Format
The server will return one of two possible JSON structures:

1. For Commands:
```json
{
    "cmd": "Command String\r\n" // Ready to send to console
}
```

2. For Chat:
```json
{
    "chat": "Response text" // Display to user
}
```

## Implementation Example
```swift
struct Response: Codable {
    let cmd: String?
    let chat: String?
}

class LLMService {
    func processMessage(message: String) async throws {
        let url = URL(string: "http://54.172.43.149:5000/app/chat")!
        let body = ["message": message]
        // ... API call implementation ...
        
        func handleResponse(response: Response) {
            if let cmd = response.cmd {
                // Command response - send to console
                sendToConsole(cmd)
            } else if let chat = response.chat {
                // Chat response - display to user
                displayChatMessage(chat)
            }
        }
    }
}
```

## Common Test Cases

### Command Examples
1. Dimmer Control:
   - Input: `"set group 1 dimmer to full"`
   - Response: `{"cmd": "Group 1 At 100\r\n"}`

2. Clear Command:
   - Input: `"clear all fixtures"`
   - Response: `{"cmd": "ClearAll\r\n"}`

3. Fixture Control:
   - Input: `"set fixture 5 to 75 percent"`
   - Response: `{"cmd": "Fixture 5 At 75\r\n"}`

### Chat Examples
1. General Question:
   - Input: `"tell me a joke about lighting"`
   - Response: `{"chat": "Why did the lighting console go to therapy? It had too many issues to process!"}`

## Migration Notes
1. Remove local tool definitions (they're now server-side)
2. Update response handling to check for `cmd` vs `chat`
3. Commands come pre-formatted with `\r\n`
4. No need to parse or validate function calls client-side

## Error Handling
Server errors will return standard HTTP error codes. Implement appropriate error handling for:
- Network connectivity issues
- Server errors (500 series)
- Invalid requests (400 series)

## Best Practices
1. Always check for both `cmd` and `chat` in responses
2. Send raw user input - server handles interpretation
3. Commands should be sent to console exactly as received
4. Chat responses should be displayed in the UI