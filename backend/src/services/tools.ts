interface DimmerControlParams {
    selection: string;
    selection_type: 'fixture' | 'group';
    value: number;
}

interface ClearControlParams {
    clear_type: 'clear' | 'clearall';
}

interface FaderControlParams {
    fader_number: number;
    value: number | string;
    page?: number;
}

interface PresetControlParams {
    selection: string;
    selection_type: 'fixture' | 'group';
    preset: string;
}

interface LabelControlParams {
    label_type: 'executor' | 'cue' | 'preset' | 'group';
    identifier: string;
    name: string;
}

interface StoreCueParams {
    identifier: string;
    store_method?: 'merge' | 'overwrite';
    fade_time?: number;
}

interface CueNavigationParams {
    command_type: 'go' | 'goback' | 'goto';
    cue_number?: string;
    steps?: number;
}

interface DeleteControlParams {
    delete_type: 'cue' | 'executor';
    identifier: string;
}

interface FadeControlParams {
    selection: string;
    selection_type: 'fixture' | 'group';
    preset_type: 1 | 2 | 3 | 4 | 5 | 6;
    fade_time: number;
}

export class ToolExecutor {
    /**
     * Main entry point for executing lighting control functions
     */
    async executeFunction(functionName: string, params: any): Promise<string> {
        switch (functionName) {
            case 'dimmer_control':
                return this.dimmer_control(params);
            case 'clear_control':
                return this.clear_control(params);
            case 'fader_control':
                return this.fader_control(params);
            case 'preset_control':
                return this.preset_control(params);
            case 'label_control':
                return this.label_control(params);
            case 'store_cue':
                return this.store_cue(params);
            case 'cue_navigation':
                return this.cue_navigation(params);
            case 'delete_control':
                return this.delete_control(params);
            case 'fade_control':
                return this.fade_control(params);
            default:
                throw new Error(`Unknown function: ${functionName}`);
        }
    }

    async dimmer_control({ selection, selection_type, value }: DimmerControlParams): Promise<string> {
        try {
            const selection_cmd = selection_type === 'fixture' 
                ? `Fixture ${selection}`
                : `Group ${selection}`;

            const cmd = `${selection_cmd} At ${value}\r\n`;
            console.log('Executing command:', cmd);
            return JSON.stringify({ cmd });
        } catch (error) {
            console.error('Error in dimmer_control:', error);
            throw new Error(`Error setting dimmer: ${error}`);
        }
    }

    async clear_control({ clear_type }: ClearControlParams): Promise<string> {
        try {
            const cmd = clear_type.toLowerCase() === 'clear' 
                ? 'Clear\r\n'
                : 'ClearAll\r\n';

            console.log('Executing command:', cmd);
            return JSON.stringify({ cmd });
        } catch (error) {
            console.error('Error in clear_control:', error);
            throw new Error(`Error executing ${clear_type}: ${error}`);
        }
    }

    async fader_control({ fader_number, value, page = 1 }: FaderControlParams): Promise<string> {
        try {
            let valueStr: string;
            let numericValue: number;

            if (typeof value === 'string') {
                if (value.toLowerCase() === 'full') {
                    numericValue = 100;
                } else if (value.endsWith('%')) {
                    numericValue = parseFloat(value.replace('%', ''));
                } else {
                    numericValue = parseFloat(value);
                }
            } else {
                numericValue = value;
            }

            if (numericValue === 100) {
                valueStr = 'Full';
            } else if (numericValue === 0) {
                valueStr = '0';
            } else {
                valueStr = numericValue.toString();
            }

            const cmd = `Executor ${page}.${fader_number} At ${valueStr}\r\n`;
            
            console.log('Executing command:', cmd);
            return JSON.stringify({ cmd });
        } catch (error) {
            console.error('Error in fader_control:', error);
            throw new Error(`Error controlling fader: ${error}`);
        }
    }

    async preset_control({ selection, selection_type, preset }: PresetControlParams): Promise<string> {
        try {
            // Clean up selection
            const cleanSelection = selection.toLowerCase().replace('group', '').trim();
            
            // Format the selection command
            const selection_cmd = selection_type === 'fixture' 
                ? `Fixture ${cleanSelection}`
                : `Group ${cleanSelection}`;
                
            // Position preset mapping
            const position_map: { [key: string]: string } = {
                'basic': '1',
                'center': '2',
                'cross': '3',
                'fan': '4',
                'sky': '5',
                'venue': '6',
                'floor': '7'
            };
            
            let cmd: string;
            
            // Parse preset reference
            if (preset.includes('.')) {
                const [preset_group, preset_num] = preset.split('.', 2);
                const cleanPresetNum = preset_num.replace(/"/g, '');
                
                // Special handling for position presets (type 2)
                if (preset_group === '2') {
                    const mappedNum = position_map[cleanPresetNum.toLowerCase()] || cleanPresetNum;
                    cmd = `${selection_cmd} At Preset 2.${mappedNum}\r\n`;
                } else {
                    // Handle other preset types
                    cmd = isNaN(Number(cleanPresetNum))
                        ? `${selection_cmd} At Preset ${preset_group}."${cleanPresetNum}"\r\n`
                        : `${selection_cmd} At Preset ${preset_group}.${cleanPresetNum}\r\n`;
                }
            } else {
                // Handle presets without type specification
                cmd = isNaN(Number(preset))
                    ? `${selection_cmd} At Preset 0."${preset}"\r\n`
                    : `${selection_cmd} At Preset ${preset}\r\n`;
            }
            
            console.log('Executing command:', cmd);
            return JSON.stringify({ cmd });
        } catch (error) {
            console.error('Error in preset_control:', error);
            throw new Error(`Error setting preset: ${error}`);
        }
    }

    async label_control({ label_type, identifier, name }: LabelControlParams): Promise<string> {
        try {
            const cmd = `label ${label_type} ${identifier} "${name}"\r\n`;
            
            console.log('Executing command:', cmd);
            return JSON.stringify({ cmd });
        } catch (error) {
            console.error('Error in label_control:', error);
            throw new Error(`Error labeling ${label_type}: ${error}`);
        }
    }

    async store_cue({ identifier, store_method = 'merge', fade_time }: StoreCueParams): Promise<string> {
        try {
            // Map store method to command flag
            const methodFlag = store_method === 'merge' ? '/m' : '/o';
            
            // Check if this is an executor command
            const isExecutor = identifier.toLowerCase().includes('executor') || identifier.toLowerCase().includes('exec');
            
            // Build the command in the correct order
            let cmd = `Store ${methodFlag} `;
            
            if (isExecutor) {
                // Handle executor case: "Store /m executor 1.5"
                cmd += `executor ${identifier.replace(/^(?:executor|exec)\s+/i, '')}`;
            } else {
                // Handle cue case: "Store /m cue 1.5"
                cmd += `cue ${identifier.replace(/^[Qq]/, '')}`;
            }
            
            // Add fade time if specified
            if (fade_time !== undefined) {
                cmd += ` Fade ${fade_time}`;
            }
            
            cmd += '\r\n';
            
            console.log('Executing command:', cmd);
            return JSON.stringify({ cmd });
        } catch (error) {
            console.error('Error in store_cue:', error);
            throw new Error(`Error storing: ${error}`);
        }
    }

    async cue_navigation({ command_type, cue_number, steps = 1 }: CueNavigationParams): Promise<string> {
        try {
            let cmd = '';
            
            switch (command_type.toLowerCase()) {
                case 'go':
                    // For 'go', we need to repeat the command
                    cmd = Array(steps).fill('Go\r\n').join('');
                    break;
                    
                case 'goback':
                    // For 'goback', we need to repeat the command
                    cmd = Array(steps).fill('GoBack\r\n').join('');
                    break;
                    
                case 'goto':
                    if (!cue_number) {
                        throw new Error('Cue number required for goto command');
                    }
                    cmd = `Goto Cue ${cue_number}\r\n`;
                    break;
                    
                default:
                    throw new Error(`Invalid navigation command: ${command_type}`);
            }
            
            console.log('Executing command:', cmd);
            return JSON.stringify({ cmd });
        } catch (error) {
            console.error('Error in cue_navigation:', error);
            throw new Error(`Error navigating cues: ${error}`);
        }
    }

    async delete_control({ delete_type, identifier }: DeleteControlParams): Promise<string> {
        try {
            const cleanIdentifier = delete_type === 'cue'
                ? identifier.replace(/^[Qq]/, '')
                : identifier.replace(/^(?:Exec|E)/i, '');
            
            const cmd = delete_type === 'cue' 
                ? `Delete Cue ${cleanIdentifier} /nc\r\n`
                : `Delete Executor ${cleanIdentifier} /nc\r\n`;
            
            console.log('Executing command:', cmd);
            return JSON.stringify({ cmd });
        } catch (error) {
            console.error('Error in delete_control:', error);
            throw new Error(`Error deleting ${delete_type}: ${error}`);
        }
    }

    async fade_control({ selection, selection_type, preset_type, fade_time }: FadeControlParams): Promise<string> {
        try {
            // Map preset type numbers to names
            const preset_type_map: { [key: number]: string } = {
                1: "DIMMER",
                2: "POSITION",
                3: "GOBO",
                4: "COLOR",
                5: "BEAM",
                6: "FOCUS"
            };
            
            // Validate preset type
            const preset_name = preset_type_map[preset_type];
            if (!preset_name) {
                throw new Error(`Invalid preset type: ${preset_type}`);
            }
            
            // Build the three commands in sequence
            const cmd1 = selection_type === 'fixture' 
                ? `Fixture ${selection}\r\n`
                : `Group ${selection}\r\n`;
                
            const cmd2 = `PresetType "${preset_name}"\r\n`;
            const cmd3 = `Fade ${fade_time}\r\n`;
            
            // Combine all commands
            const cmd = cmd1 + cmd2 + cmd3;
            
            console.log('Executing commands:', cmd);
            return JSON.stringify({ cmd });
        } catch (error) {
            console.error('Error in fade_control:', error);
            throw new Error(`Error setting fade time: ${error}`);
        }
    }
} 