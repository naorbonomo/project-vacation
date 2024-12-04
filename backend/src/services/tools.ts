interface DimmerControlParams {
    selection: string;
    selection_type: 'fixture' | 'group';
    value: number;
}

interface ClearControlParams {
    clear_type: 'clear' | 'clearall';
}

export class ToolExecutor {
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

    async executeFunction(functionName: string, params: any): Promise<string> {
        switch (functionName) {
            case 'dimmer_control':
                return this.dimmer_control(params);
            case 'clear_control':
                return this.clear_control(params);
            default:
                throw new Error(`Unknown function: ${functionName}`);
        }
    }
} 