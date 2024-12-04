import { ChatCompletionTool } from 'groq-sdk/resources/chat/completions';

export const toolsList = [
    {
        "type": "function",
        "function": {
            "name": "dimmer_control",
            "description": "Controls the dimmer for a group or fixture. Interprets 'full' as 100%.",
            "parameters": {
                "type": "object",
                "properties": {
                    "selection": {
                        "type": "string",
                        "description": "Fixture or group selection (e.g., '1', '1 thru 10', '1 + 3 + 5')"
                    },
                    "selection_type": {
                        "type": "string",
                        "enum": ["fixture", "group"],
                        "description": "Whether the selection is a fixture or group"
                    },
                    "value": {
                        "type": "number",
                        "description": "Dimmer value to set (0-100)",
                        "minimum": 0,
                        "maximum": 100
                    }
                },
                "required": ["selection", "selection_type", "value"]
            }
        }
    },
    {
        "type": "function",
        "function": {
            "name": "clear_control",
            "description": "Clears fixture selection or performs a complete clear of all programmer values",
            "parameters": {
                "type": "object",
                "properties": {
                    "clear_type": {
                        "type": "string",
                        "enum": ["clear", "clearall"],
                        "description": "'clear' deselects fixtures(clears selected fixtures/groups), 'clearall' completely clears programmer"
                    }
                },
                "required": ["clear_type"]
            }
        }
    }
] as const; 