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
            const selection_cmd = selection_type === 'fixture' 
                ? `Fixture ${selection}`
                : `Group ${selection}`;

            const cmd = `${selection_cmd} Preset ${preset}\r\n`;
            console.log('Executing command:', cmd);
            return JSON.stringify({ cmd });
        } catch (error) {
            console.error('Error in preset_control:', error);
            throw new Error(`Error setting preset: ${error}`);
        }
    }

    async label_control({ label_type, identifier, name }: LabelControlParams): Promise<string> {
        try {
            const cmd = `${label_type.toLowerCase()} ${identifier} ${name}\r\n`;
            console.log('Executing command:', cmd);
            return JSON.stringify({ cmd });
        } catch (error) {
            console.error('Error in label_control:', error);
            throw new Error(`Error setting label: ${error}`);
        }
    }

    async store_cue({ identifier, store_method, fade_time }: StoreCueParams): Promise<string> {
        try {
            const cmd = `${identifier} ${store_method} ${fade_time}\r\n`;
            console.log('Executing command:', cmd);
            return JSON.stringify({ cmd });
        } catch (error) {
            console.error('Error in store_cue:', error);
            throw new Error(`Error storing cue: ${error}`);
        }
    }

    async cue_navigation({ command_type, cue_number, steps }: CueNavigationParams): Promise<string> {
        try {
            const cmd = `${command_type.toLowerCase()} ${cue_number} ${steps}\r\n`;
            console.log('Executing command:', cmd);
            return JSON.stringify({ cmd });
        } catch (error) {
            console.error('Error in cue_navigation:', error);
            throw new Error(`Error navigating cue: ${error}`);
        }
    }

    async delete_control({ delete_type, identifier }: DeleteControlParams): Promise<string> {
        try {
            const cmd = `${delete_type.toLowerCase()} ${identifier}\r\n`;
            console.log('Executing command:', cmd);
            return JSON.stringify({ cmd });
        } catch (error) {
            console.error('Error in delete_control:', error);
            throw new Error(`Error deleting ${delete_type}: ${error}`);
        }
    }

    async fade_control({ selection, selection_type, preset_type, fade_time }: FadeControlParams): Promise<string> {
        try {
            const selection_cmd = selection_type === 'fixture' 
                ? `Fixture ${selection}`
                : `Group ${selection}`;

            const cmd = `${selection_cmd} Fade ${preset_type} ${fade_time}\r\n`;
            console.log('Executing command:', cmd);
            return JSON.stringify({ cmd });
        } catch (error) {
            console.error('Error in fade_control:', error);
            throw new Error(`Error fading: ${error}`);
        }
    }
} 