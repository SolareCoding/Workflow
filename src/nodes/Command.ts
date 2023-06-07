export enum CommandType {
	COPY_FILE = 'COPY_FILE',
	OPEN_FILE = 'OPEN_FILE',
	SHELL = 'SHELL',
}

export interface ShortCutCommand {
	type: CommandType;
	commandFile: string;
	commandFolder: string;
}
