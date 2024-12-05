import { ChatCompletionTool } from 'groq-sdk/resources/chat/completions';

export const toolsList = [
    {
        "type": "function",
        "function": {
            "name": "fader_control",
            "description": "Controls lighting executors/faders using format 'Executor {page}.{executor}'. Example: 'Executor 5.2' means page 5, executor 2.",
            "parameters": {
                "type": "object",
                "properties": {
                    "fader_number": {
                        "type": "integer",
                        "description": "Executor/fader number (1-90). In 'Executor 5.2', this would be 2",
                        "minimum": 1,
                        "maximum": 90
                    },
                    "value": {
                        "type": "number",
                        "description": "Value to set (0-100)",
                        "minimum": 0,
                        "maximum": 100
                    },
                    "page": {
                        "type": "integer",
                        "description": "Page number (defaults to 1 if not specified). In 'Executor 5.2', this would be 5",
                        "minimum": 1
                    }
                },
                "required": ["fader_number", "value"]
            }
        }
    },
    {
        "type": "function",
        "function": {
            "name": "preset_control",
            "description": "Controls GrandMA2 presets using exact syntax. Supports both fixture and group selection.",
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
                    "preset": {
                        "type": "string",
                        "description": "Preset reference. For named presets use format: '[PresetType].\"[Name]\"' (e.g., '4.\"red\"', '2.\"center\"'). For numbered presets use format: '[PresetType].[Number]' (e.g., '4.12'). Position presets (Type 2) are mapped as follows: 2.1=\"basic\", 2.2=\"center\", 2.3=\"cross\", 2.4=\"fan\", 2.5=\"sky\")"
                    }
                },
                "required": ["selection", "selection_type", "preset"]
            }
        }
    },
    {
        "type": "function",
        "function": {
            "name": "label_control",
            "description": "Labels executors, cues, presets, or groups with specified names. Understands shortcuts like 'q' or 'Q' for cues.",
            "parameters": {
                "type": "object",
                "properties": {
                    "label_type": {
                        "type": "string",
                        "enum": ["executor", "cue", "preset", "group"],
                        "description": "Type of entity to label. Note: 'q' or 'Q' in input refers to cues"
                    },
                    "identifier": {
                        "type": "string",
                        "description": "Identifier for the label (e.g., executor number, cue number, preset number, group number)"
                    },
                    "name": {
                        "type": "string",
                        "description": "Name to assign to the label"
                    }
                },
                "required": ["label_type", "identifier", "name"]
            }
        }
    },
    {
        "type": "function",
        "function": {
            "name": "store_cue",
            "description": "Stores a cue with the specified identifier. Understands 'q' or 'Q' as cue references (e.g., 'q1', 'Q2.5').",
            "parameters": {
                "type": "object",
                "properties": {
                    "identifier": {
                        "type": "string",
                        "description": "Identifier for the cue (must be a number or number.number, e.g., '5', '2.3'). Note: 'q' or 'Q' in input refers to cues"
                    },
                    "store_method": {
                        "type": "string",
                        "enum": ["merge", "overwrite"],
                        "description": "Method to store the cue: 'merge' (/m) adds to existing cue, 'overwrite' (/o) replaces existing cue",
                        "default": "merge"
                    },
                    "fade_time": {
                        "type": "number",
                        "description": "Optional fade time in seconds",
                        "minimum": 0
                    }
                },
                "required": ["identifier"]
            }
        }
    },
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
    },
    {
        "type": "function",
        "function": {
            "name": "cue_navigation",
            "description": "Controls cue navigation with go, goback, and goto commands",
            "parameters": {
                "type": "object",
                "properties": {
                    "command_type": {
                        "type": "string",
                        "enum": ["go", "goback", "goto"],
                        "description": "'go' for next cue, 'goback' for previous cue, 'goto' for specific cue"
                    },
                    "cue_number": {
                        "type": "string",
                        "description": "Cue number for goto command (e.g., '1', '2.5'). Only required for 'goto' command."
                    },
                    "steps": {
                        "type": "integer",
                        "description": "Number of steps to move forward/backward (for go/goback commands)",
                        "minimum": 1,
                        "default": 1
                    }
                },
                "required": ["command_type"]
            }
        }
    },
    {
        "type": "function",
        "function": {
            "name": "delete_control",
            "description": "Deletes a cue or executor with the specified identifier.",
            "parameters": {
                "type": "object",
                "properties": {
                    "delete_type": {
                        "type": "string",
                        "enum": ["cue", "executor"],
                        "description": "Type of entity to delete"
                    },
                    "identifier": {
                        "type": "string",
                        "description": "Identifier for the item to delete. Must be a number or number.number (e.g., '5', '2.3')"
                    }
                },
                "required": ["delete_type", "identifier"]
            }
        }
    },
    {
        "type": "function",
        "function": {
            "name": "fade_control",
            "description": "Sets fade time for fixtures or groups.",
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
                    "preset_type": {
                        "type": "integer",
                        "description": "Preset type number (1=Dimmer, 2=Position, 3=Gobo, 4=Color, 5=Beam, 6=Focus)",
                        "minimum": 0,
                        "maximum": 6
                    },
                    "fade_time": {
                        "type": "number",
                        "description": "Fade time in seconds",
                        "minimum": 0
                    }
                },
                "required": ["selection", "selection_type", "preset_type", "fade_time"]
            }
        }
    },
    {
        "type": "function",
        "function": {
            "name": "store_executor",
            "description": "Stores current programmer content to an executor. Supports format 'Executor {page}.{executor}' or just executor number (defaults to page 1).",
            "parameters": {
                "type": "object",
                "properties": {
                    "executor": {
                        "type": "integer",
                        "description": "Executor/fader number (1-90)",
                        "minimum": 1,
                        "maximum": 90
                    },
                    "page": {
                        "type": "integer",
                        "description": "Page number (defaults to 1 if not specified)",
                        "minimum": 1
                    },
                    "store_method": {
                        "type": "string",
                        "enum": ["merge", "overwrite"],
                        "description": "Method to store: 'merge' (/m) adds to existing content, 'overwrite' (/o) replaces existing content",
                        "default": "merge"
                    }
                },
                "required": ["executor"]
            }
        }
    }
] as const; 