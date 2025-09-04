export interface DecodedInstruction {
  hex: string;
  binary: string;
  opcode: string;
  instructionType: string;
  mnemonic: string;
  operands: string[];
  description: string;
  fields: {
    [key: string]: string;
  };
}

export interface InstructionFormat {
  name: string;
  fields: string[];
  bitRanges: { [key: string]: [number, number] };
}

export interface OpcodeInfo {
  opcode: string;
  instructionType: string;
  mnemonic: string;
  format: string;
  description: string;
}
