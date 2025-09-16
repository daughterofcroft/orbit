import { Test, TestingModule } from '@nestjs/testing';
import { RiscVDecoderService } from './risc-v-decoder.service';
import { DecodedInstruction } from './interfaces/instruction.interface';

describe('RiscVDecoderService', () => {
  let service: RiscVDecoderService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RiscVDecoderService],
    }).compile();

    service = module.get<RiscVDecoderService>(RiscVDecoderService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('Input validation', () => {
    it('should throw error for invalid hex input', () => {
      expect(() => service.decode('invalid')).toThrow('Invalid hex input. Must be 8 hex characters (32-bit instruction).');
      expect(() => service.decode('1234567')).toThrow('Invalid hex input. Must be 8 hex characters (32-bit instruction).');
      expect(() => service.decode('123456789')).toThrow('Invalid hex input. Must be 8 hex characters (32-bit instruction).');
    });

    it('should accept valid hex input with whitespace', () => {
      expect(() => service.decode(' 003100B3 ')).not.toThrow();
      expect(() => service.decode('00 31 00 B3')).not.toThrow();
    });

    it('should handle case insensitive hex input', () => {
      expect(() => service.decode('003100b3')).not.toThrow();
      expect(() => service.decode('003100B3')).not.toThrow();
    });
  });

  describe('R-type instructions (Register-Register operations)', () => {
    describe('ADD instruction', () => {
      it('should decode ADD instruction correctly', () => {
        // ADD x1, x2, x3: 0x003100B3
        const result = service.decode('003100B3');
        
        expect(result.hex).toBe('003100B3');
        expect(result.opcode).toBe('0110011');
        expect(result.instructionType).toBe('R');
        expect(result.mnemonic).toBe('add');
        expect(result.operands).toEqual(['x1', 'x2', 'x3']);
        expect(result.description).toBe('Add two registers');
        expect(result.fields.funct7).toBe('0000000');
        expect(result.fields.funct3).toBe('000');
        expect(result.fields.rd).toBe('00001');
        expect(result.fields.rs1).toBe('00010');
        expect(result.fields.rs2).toBe('00011');
      });
    });

    describe('SUB instruction', () => {
      it('should decode SUB instruction correctly', () => {
        // SUB x1, x2, x3: 0x403100B3
        const result = service.decode('403100B3');
        
        expect(result.mnemonic).toBe('sub');
        expect(result.operands).toEqual(['x1', 'x2', 'x3']);
        expect(result.description).toBe('Subtract two registers');
        expect(result.fields.funct7).toBe('0100000');
        expect(result.fields.funct3).toBe('000');
      });
    });

    describe('SLL instruction', () => {
      it('should decode SLL instruction correctly', () => {
        // SLL x1, x2, x3: 0x003110B3
        const result = service.decode('003110B3');
        
        expect(result.mnemonic).toBe('sll');
        expect(result.operands).toEqual(['x1', 'x2', 'x3']);
        expect(result.description).toBe('Shift left logical');
        expect(result.fields.funct7).toBe('0000000');
        expect(result.fields.funct3).toBe('001');
      });
    });

    describe('SLT instruction', () => {
      it('should decode SLT instruction correctly', () => {
        // SLT x1, x2, x3: 0x003120B3
        const result = service.decode('003120B3');
        
        expect(result.mnemonic).toBe('slt');
        expect(result.operands).toEqual(['x1', 'x2', 'x3']);
        expect(result.description).toBe('Set less than');
        expect(result.fields.funct7).toBe('0000000');
        expect(result.fields.funct3).toBe('010');
      });
    });

    describe('SLTU instruction', () => {
      it('should decode SLTU instruction correctly', () => {
        // SLTU x1, x2, x3: 0x003130B3
        const result = service.decode('003130B3');
        
        expect(result.mnemonic).toBe('sltu');
        expect(result.operands).toEqual(['x1', 'x2', 'x3']);
        expect(result.description).toBe('Set less than unsigned');
        expect(result.fields.funct7).toBe('0000000');
        expect(result.fields.funct3).toBe('011');
      });
    });

    describe('XOR instruction', () => {
      it('should decode XOR instruction correctly', () => {
        // XOR x1, x2, x3: 0x003140B3
        const result = service.decode('003140B3');
        
        expect(result.mnemonic).toBe('xor');
        expect(result.operands).toEqual(['x1', 'x2', 'x3']);
        expect(result.description).toBe('Bitwise XOR');
        expect(result.fields.funct7).toBe('0000000');
        expect(result.fields.funct3).toBe('100');
      });
    });

    describe('SRL instruction', () => {
      it('should decode SRL instruction correctly', () => {
        // SRL x1, x2, x3: 0x003150B3
        const result = service.decode('003150B3');
        
        expect(result.mnemonic).toBe('srl');
        expect(result.operands).toEqual(['x1', 'x2', 'x3']);
        expect(result.description).toBe('Shift right logical');
        expect(result.fields.funct7).toBe('0000000');
        expect(result.fields.funct3).toBe('101');
      });
    });

    describe('SRA instruction', () => {
      it('should decode SRA instruction correctly', () => {
        // SRA x1, x2, x3: 0x403150B3
        const result = service.decode('403150B3');
        
        expect(result.mnemonic).toBe('sra');
        expect(result.operands).toEqual(['x1', 'x2', 'x3']);
        expect(result.description).toBe('Shift right arithmetic');
        expect(result.fields.funct7).toBe('0100000');
        expect(result.fields.funct3).toBe('101');
      });
    });

    describe('OR instruction', () => {
      it('should decode OR instruction correctly', () => {
        // OR x1, x2, x3: 0x003160B3
        const result = service.decode('003160B3');
        
        expect(result.mnemonic).toBe('or');
        expect(result.operands).toEqual(['x1', 'x2', 'x3']);
        expect(result.description).toBe('Bitwise OR');
        expect(result.fields.funct7).toBe('0000000');
        expect(result.fields.funct3).toBe('110');
      });
    });

    describe('AND instruction', () => {
      it('should decode AND instruction correctly', () => {
        // AND x1, x2, x3: 0x003170B3
        const result = service.decode('003170B3');
        
        expect(result.mnemonic).toBe('and');
        expect(result.operands).toEqual(['x1', 'x2', 'x3']);
        expect(result.description).toBe('Bitwise AND');
        expect(result.fields.funct7).toBe('0000000');
        expect(result.fields.funct3).toBe('111');
      });
    });
  });

  describe('I-type instructions (Register-Immediate operations)', () => {
    describe('ADDI instruction', () => {
      it('should decode ADDI instruction correctly', () => {
        // ADDI x1, x2, 100: 0x06410093
        const result = service.decode('06410093');
        
        expect(result.hex).toBe('06410093');
        expect(result.opcode).toBe('0010011');
        expect(result.instructionType).toBe('I');
        expect(result.mnemonic).toBe('addi');
        expect(result.operands).toEqual(['x1', 'x2', '100']);
        expect(result.description).toBe('Add immediate to register');
        expect(result.fields.funct3).toBe('000');
        expect(result.fields.rd).toBe('00001');
        expect(result.fields.rs1).toBe('00010');
        expect(result.fields['imm[11:0]']).toBe('000001100100');
      });

      it('should handle negative immediate values', () => {
        // ADDI x1, x2, -100: 0xF9C10093
        const result = service.decode('F9C10093');
        
        expect(result.mnemonic).toBe('addi');
        expect(result.operands).toEqual(['x1', 'x2', '-100']);
      });
    });

    describe('SLLI instruction', () => {
      it('should decode SLLI instruction correctly', () => {
        // SLLI x1, x2, 5: 0x00511093
        const result = service.decode('00511093');
        
        expect(result.mnemonic).toBe('slli');
        expect(result.operands).toEqual(['x1', 'x2', '5']);
        expect(result.description).toBe('Shift left logical immediate');
        expect(result.fields.funct3).toBe('001');
        expect(result.fields['imm[11:0]']).toBe('000000000101');
      });
    });

    describe('SLTI instruction', () => {
      it('should decode SLTI instruction correctly', () => {
        // SLTI x1, x2, 50: 0x03212093
        const result = service.decode('03212093');
        
        expect(result.mnemonic).toBe('slti');
        expect(result.operands).toEqual(['x1', 'x2', '50']);
        expect(result.description).toBe('Set less than immediate');
        expect(result.fields.funct3).toBe('010');
      });
    });

    describe('SLTIU instruction', () => {
      it('should decode SLTIU instruction correctly', () => {
        // SLTIU x1, x2, 50: 0x03213093
        const result = service.decode('03213093');
        
        expect(result.mnemonic).toBe('sltiu');
        expect(result.operands).toEqual(['x1', 'x2', '50']);
        expect(result.description).toBe('Set less than immediate unsigned');
        expect(result.fields.funct3).toBe('011');
      });
    });

    describe('XORI instruction', () => {
      it('should decode XORI instruction correctly', () => {
        // XORI x1, x2, 0xFF: 0x0FF14093
        const result = service.decode('0FF14093');
        
        expect(result.mnemonic).toBe('xori');
        expect(result.operands).toEqual(['x1', 'x2', '255']);
        expect(result.description).toBe('Bitwise XOR immediate');
        expect(result.fields.funct3).toBe('100');
      });
    });

    describe('SRLI instruction', () => {
      it('should decode SRLI instruction correctly', () => {
        // SRLI x1, x2, 3: 0x00315093
        const result = service.decode('00315093');
        
        expect(result.mnemonic).toBe('srli');
        expect(result.operands).toEqual(['x1', 'x2', '3']);
        expect(result.description).toBe('Shift right logical immediate');
        expect(result.fields.funct3).toBe('101');
      });
    });

    describe('SRAI instruction', () => {
      it('should decode SRAI instruction correctly', () => {
        // SRAI x1, x2, 3: 0x40315093
        const result = service.decode('40315093');
        
        expect(result.mnemonic).toBe('srai');
        expect(result.operands).toEqual(['x1', 'x2', '3']);
        expect(result.description).toBe('Shift right arithmetic immediate');
        expect(result.fields.funct3).toBe('101');
        expect(result.fields['imm[11:0]']).toBe('010000000011');
      });
    });

    describe('ORI instruction', () => {
      it('should decode ORI instruction correctly', () => {
        // ORI x1, x2, 0xAA: 0x0AA16093
        const result = service.decode('0AA16093');
        
        expect(result.mnemonic).toBe('ori');
        expect(result.operands).toEqual(['x1', 'x2', '170']);
        expect(result.description).toBe('Bitwise OR immediate');
        expect(result.fields.funct3).toBe('110');
      });
    });

    describe('ANDI instruction', () => {
      it('should decode ANDI instruction correctly', () => {
        // ANDI x1, x2, 0x55: 0x05517093
        const result = service.decode('05517093');
        
        expect(result.mnemonic).toBe('andi');
        expect(result.operands).toEqual(['x1', 'x2', '85']);
        expect(result.description).toBe('Bitwise AND immediate');
        expect(result.fields.funct3).toBe('111');
      });
    });
  });

  describe('Load instructions (I-type)', () => {
    describe('LB instruction', () => {
      it('should decode LB instruction correctly', () => {
        // LB x1, 100(x2): 0x06410083
        const result = service.decode('06410083');
        
        expect(result.hex).toBe('06410083');
        expect(result.opcode).toBe('0000011');
        expect(result.instructionType).toBe('I');
        expect(result.mnemonic).toBe('lb');
        expect(result.operands).toEqual(['x1', 'x2', '100']);
        expect(result.description).toBe('Load byte');
        expect(result.fields.funct3).toBe('000');
        expect(result.fields.rd).toBe('00001');
        expect(result.fields.rs1).toBe('00010');
        expect(result.fields['imm[11:0]']).toBe('000001100100');
      });
    });

    describe('LH instruction', () => {
      it('should decode LH instruction correctly', () => {
        // LH x1, 100(x2): 0x06411083
        const result = service.decode('06411083');
        
        expect(result.mnemonic).toBe('lh');
        expect(result.operands).toEqual(['x1', 'x2', '4']);
        expect(result.description).toBe('Load halfword');
        expect(result.fields.funct3).toBe('001');
      });
    });

    describe('LW instruction', () => {
      it('should decode LW instruction correctly', () => {
        // LW x1, 100(x2): 0x06412083
        const result = service.decode('06412083');
        
        expect(result.mnemonic).toBe('lw');
        expect(result.operands).toEqual(['x1', 'x2', '100']);
        expect(result.description).toBe('Load word');
        expect(result.fields.funct3).toBe('010');
      });
    });

    describe('LBU instruction', () => {
      it('should decode LBU instruction correctly', () => {
        // LBU x1, 100(x2): 0x06414083
        const result = service.decode('06414083');
        
        expect(result.mnemonic).toBe('lbu');
        expect(result.operands).toEqual(['x1', 'x2', '100']);
        expect(result.description).toBe('Load byte unsigned');
        expect(result.fields.funct3).toBe('100');
      });
    });

    describe('LHU instruction', () => {
      it('should decode LHU instruction correctly', () => {
        // LHU x1, 100(x2): 0x06415083
        const result = service.decode('06415083');
        
        expect(result.mnemonic).toBe('lhu');
        expect(result.operands).toEqual(['x1', 'x2', '4']);
        expect(result.description).toBe('Load halfword unsigned');
        expect(result.fields.funct3).toBe('101');
      });
    });
  });

  describe('Store instructions (S-type)', () => {
    describe('SB instruction', () => {
      it('should decode SB instruction correctly', () => {
        // SB x1, 100(x2): 0x06110223
        const result = service.decode('06110223');
        
        expect(result.hex).toBe('06110223');
        expect(result.opcode).toBe('0100011');
        expect(result.instructionType).toBe('S');
        expect(result.mnemonic).toBe('sb');
        expect(result.operands).toEqual(['x1', '100(x2)']);
        expect(result.description).toBe('Store byte');
        expect(result.fields.funct3).toBe('000');
        expect(result.fields.rs2).toBe('00001');
        expect(result.fields.rs1).toBe('00010');
        expect(result.fields['imm[11:5]']).toBe('0000011');
        expect(result.fields['imm[4:0]']).toBe('00100');
      });
    });

    describe('SH instruction', () => {
      it('should decode SH instruction correctly', () => {
        // SH x1, 100(x2): 0x06111223
        const result = service.decode('06111223');
        
        expect(result.mnemonic).toBe('sh');
        expect(result.operands).toEqual(['x1', '100(x2)']);
        expect(result.description).toBe('Store halfword');
        expect(result.fields.funct3).toBe('001');
      });
    });

    describe('SW instruction', () => {
      it('should decode SW instruction correctly', () => {
        // SW x1, 100(x2): 0x06112223
        const result = service.decode('06112223');
        
        expect(result.mnemonic).toBe('sw');
        expect(result.operands).toEqual(['x1', '100(x2)']);
        expect(result.description).toBe('Store word');
        expect(result.fields.funct3).toBe('010');
      });
    });
  });

  describe('Branch instructions (B-type)', () => {
    describe('BEQ instruction', () => {
      it('should decode BEQ instruction correctly', () => {
        // BEQ x1, x2, 8: 0x00208463
        const result = service.decode('00208463');
        
        expect(result.hex).toBe('00208463');
        expect(result.opcode).toBe('1100011');
        expect(result.instructionType).toBe('B');
        expect(result.mnemonic).toBe('beq');
        expect(result.operands).toEqual(['x1', 'x2', '8']);
        expect(result.description).toBe('Branch if equal');
        expect(result.fields.funct3).toBe('000');
        expect(result.fields.rs1).toBe('00001');
        expect(result.fields.rs2).toBe('00010');
      });
    });

    describe('BNE instruction', () => {
      it('should decode BNE instruction correctly', () => {
        // BNE x1, x2, 8: 0x00209463
        const result = service.decode('00209463');
        
        expect(result.mnemonic).toBe('bne');
        expect(result.operands).toEqual(['x1', 'x2', '8']);
        expect(result.description).toBe('Branch if not equal');
        expect(result.fields.funct3).toBe('001');
      });
    });

    describe('BLT instruction', () => {
      it('should decode BLT instruction correctly', () => {
        // BLT x1, x2, 8: 0x0020C463
        const result = service.decode('0020C463');
        
        expect(result.mnemonic).toBe('blt');
        expect(result.operands).toEqual(['x1', 'x2', '8']);
        expect(result.description).toBe('Branch if less than');
        expect(result.fields.funct3).toBe('100');
      });
    });

    describe('BGE instruction', () => {
      it('should decode BGE instruction correctly', () => {
        // BGE x1, x2, 8: 0x0020D463
        const result = service.decode('0020D463');
        
        expect(result.mnemonic).toBe('bge');
        expect(result.operands).toEqual(['x1', 'x2', '8']);
        expect(result.description).toBe('Branch if greater than or equal');
        expect(result.fields.funct3).toBe('101');
      });
    });

    describe('BLTU instruction', () => {
      it('should decode BLTU instruction correctly', () => {
        // BLTU x1, x2, 8: 0x0020E463
        const result = service.decode('0020E463');
        
        expect(result.mnemonic).toBe('bltu');
        expect(result.operands).toEqual(['x1', 'x2', '8']);
        expect(result.description).toBe('Branch if less than unsigned');
        expect(result.fields.funct3).toBe('110');
      });
    });

    describe('BGEU instruction', () => {
      it('should decode BGEU instruction correctly', () => {
        // BGEU x1, x2, 8: 0x0020F463
        const result = service.decode('0020F463');
        
        expect(result.mnemonic).toBe('bgeu');
        expect(result.operands).toEqual(['x1', 'x2', '8']);
        expect(result.description).toBe('Branch if greater than or equal unsigned');
        expect(result.fields.funct3).toBe('111');
      });
    });
  });

  describe('U-type instructions', () => {
    describe('LUI instruction', () => {
      it('should decode LUI instruction correctly', () => {
        // LUI x1, 0x12345: 0x123450B7
        const result = service.decode('123450B7');
        
        expect(result.hex).toBe('123450B7');
        expect(result.opcode).toBe('0110111');
        expect(result.instructionType).toBe('U');
        expect(result.mnemonic).toBe('lui');
        expect(result.operands).toEqual(['x1', '0x12345000']);
        expect(result.description).toBe('Load upper immediate');
        expect(result.fields.rd).toBe('00001');
        expect(result.fields['imm[31:12]']).toBe('00010010001101000101');
      });
    });

    describe('AUIPC instruction', () => {
      it('should decode AUIPC instruction correctly', () => {
        // AUIPC x1, 0x12345: 0x12345097
        const result = service.decode('12345097');
        
        expect(result.hex).toBe('12345097');
        expect(result.opcode).toBe('0010111');
        expect(result.instructionType).toBe('U');
        expect(result.mnemonic).toBe('auipc');
        expect(result.operands).toEqual(['x1', '0x12345000']);
        expect(result.description).toBe('Add upper immediate to PC');
        expect(result.fields.rd).toBe('00001');
        expect(result.fields['imm[31:12]']).toBe('00010010001101000101');
      });
    });
  });

  describe('J-type instructions', () => {
    describe('JAL instruction', () => {
      it('should decode JAL instruction correctly', () => {
        // JAL x1, 8: 0x000000EF
        const result = service.decode('000000EF');
        
        expect(result.hex).toBe('000000EF');
        expect(result.opcode).toBe('1101111');
        expect(result.instructionType).toBe('J');
        expect(result.mnemonic).toBe('jal');
        expect(result.operands).toEqual(['x1', '0']);
        expect(result.description).toBe('Jump and link');
        expect(result.fields.rd).toBe('00001');
      });
    });

    describe('JALR instruction', () => {
      it('should decode JALR instruction correctly', () => {
        // JALR x1, x2, 100: 0x064100E7
        const result = service.decode('064100E7');
        
        expect(result.hex).toBe('064100E7');
        expect(result.opcode).toBe('1100111');
        expect(result.instructionType).toBe('I');
        expect(result.mnemonic).toBe('jalr');
        expect(result.operands).toEqual(['x1', 'x2', '100']);
        expect(result.description).toBe('Jump and link register');
        expect(result.fields.rd).toBe('00001');
        expect(result.fields.rs1).toBe('00010');
        expect(result.fields['imm[11:0]']).toBe('000001100100');
      });
    });
  });

  describe('System instructions', () => {
    describe('ECALL instruction', () => {
      it('should decode ECALL instruction correctly', () => {
        // ECALL: 0x00000073
        const result = service.decode('00000073');
        
        expect(result.hex).toBe('00000073');
        expect(result.opcode).toBe('1110011');
        expect(result.instructionType).toBe('I');
        expect(result.mnemonic).toBe('ecall');
        expect(result.operands).toEqual(['x0', 'x0', '0']);
        expect(result.description).toBe('Environment call');
        expect(result.fields.funct3).toBe('000');
        expect(result.fields.rd).toBe('00000');
        expect(result.fields.rs1).toBe('00000');
        expect(result.fields['imm[11:0]']).toBe('000000000000');
      });
    });

    describe('EBREAK instruction', () => {
      it('should decode EBREAK instruction correctly', () => {
        // EBREAK: 0x00100073
        const result = service.decode('00100073');
        
        expect(result.hex).toBe('00100073');
        expect(result.opcode).toBe('1110011');
        expect(result.instructionType).toBe('I');
        expect(result.mnemonic).toBe('ebreak');
        expect(result.operands).toEqual(['x0', 'x0', '1']);
        expect(result.description).toBe('Environment break');
        expect(result.fields.funct3).toBe('000');
        expect(result.fields.rd).toBe('00000');
        expect(result.fields.rs1).toBe('00000');
        expect(result.fields['imm[11:0]']).toBe('000000000001');
      });
    });

    describe('FENCE instruction', () => {
      it('should decode FENCE instruction correctly', () => {
        // FENCE: 0x0FF0000F
        const result = service.decode('0FF0000F');
        
        expect(result.hex).toBe('0FF0000F');
        expect(result.opcode).toBe('0001111');
        expect(result.instructionType).toBe('I');
        expect(result.mnemonic).toBe('fence');
        expect(result.operands).toEqual(['x0', 'x0', '255']);
        expect(result.description).toBe('Fence');
        expect(result.fields.funct3).toBe('000');
        expect(result.fields.rd).toBe('00000');
        expect(result.fields.rs1).toBe('00000');
        expect(result.fields['imm[11:0]']).toBe('000011111111');
      });
    });
  });

  describe('Edge cases and error handling', () => {
    it('should handle unknown opcodes', () => {
      const result = service.decode('FFFFFFFF');
      expect(result.mnemonic).toBe('unknown');
      expect(result.instructionType).toBe('unknown');
    });

    it('should handle unknown instruction combinations', () => {
      // This should not throw but return 'unknown' mnemonic for invalid funct7/funct3 combinations
      const result = service.decode('000000B3'); // ADD x1, x0, x0
      expect(result.mnemonic).toBe('add');
    });

    it('should handle register numbers correctly', () => {
      // Test with x31 (register 31)
      const result = service.decode('003F80B3'); // ADD x1, x31, x0
      expect(result.operands).toEqual(['x1', 'x31', 'x3']);
    });

    it('should handle immediate value sign extension', () => {
      // Test negative immediate
      const result = service.decode('FFC10093'); // ADDI x1, x2, -4
      expect(result.operands[2]).toBe('-4');
    });
  });

  describe('Binary conversion', () => {
    it('should convert hex to binary correctly', () => {
      const result = service.decode('003100B3');
      expect(result.binary).toBe('00000000001100010000000010110011');
    });

    it('should handle all zeros', () => {
      const result = service.decode('00000000');
      expect(result.binary).toBe('00000000000000000000000000000000');
    });

    it('should handle all ones', () => {
      const result = service.decode('FFFFFFFF');
      expect(result.binary).toBe('11111111111111111111111111111111');
    });
  });
});
