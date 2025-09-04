// React frontend for the RISC-V decoder using Mantine

import { useState } from 'react';
import { TextInput, Button, Card, Text, Stack, Grid, Badge, Code, Divider, Group } from '@mantine/core';

interface DecodedInstruction {
  hex: string;
  binary: string;
  opcode: string;
  instructionType: string;
  mnemonic: string;
  operands: string[];
  description: string;
  fields: { [key: string]: string };
}

export default function RiscVDecoder() {
  const [hex, setHex] = useState('0x00b50533');
  const [decoded, setDecoded] = useState<DecodedInstruction | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const decode = async () => {
    setLoading(true);
    setError(null);
    try {
      // Clean hex input - remove 0x prefix and whitespace
      const cleanHex = hex.replace(/^0x/, '').replace(/\s/g, '');
      
      if (!/^[0-9A-Fa-f]{8}$/.test(cleanHex)) {
        throw new Error('Invalid hex input. Must be 8 hex characters (32-bit instruction).');
      }

      const res = await fetch(`/api/decode?hex=${cleanHex}`);
      
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'API error');
      }
      
      const data = await res.json();
      setDecoded(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invalid hex or API error');
      setDecoded(null);
    } finally {
      setLoading(false);
    }
  };


  const getInstructionTypeColor = (type: string) => {
    const colors: { [key: string]: string } = {
      'R': 'blue',
      'I': 'green',
      'S': 'orange',
      'B': 'red',
      'U': 'purple',
      'J': 'pink'
    };
    return colors[type] || 'gray';
  };

  const getFieldColors = (instructionType: string) => {
    const colorMap: { [key: string]: { [key: string]: string } } = {
      'R': {
        'funct7': '#ff6b6b',    // Red
        'rs2': '#4ecdc4',       // Teal
        'rs1': '#45b7d1',       // Blue
        'funct3': '#96ceb4',    // Green
        'rd': '#feca57',        // Yellow
        'opcode': '#ff9ff3'     // Pink
      },
      'I': {
        'imm[11:0]': '#ff6b6b', // Red
        'rs1': '#45b7d1',       // Blue
        'funct3': '#96ceb4',    // Green
        'rd': '#feca57',        // Yellow
        'opcode': '#ff9ff3'     // Pink
      },
      'S': {
        'imm[11:5]': '#ff6b6b', // Red
        'rs2': '#4ecdc4',       // Teal
        'rs1': '#45b7d1',       // Blue
        'funct3': '#96ceb4',    // Green
        'imm[4:0]': '#feca57',  // Yellow
        'opcode': '#ff9ff3'     // Pink
      },
      'B': {
        'imm[12|10:5]': '#ff6b6b', // Red
        'rs2': '#4ecdc4',          // Teal
        'rs1': '#45b7d1',          // Blue
        'funct3': '#96ceb4',       // Green
        'imm[4:1|11]': '#feca57',  // Yellow
        'opcode': '#ff9ff3'        // Pink
      },
      'U': {
        'imm[31:12]': '#ff6b6b', // Red
        'rd': '#feca57',         // Yellow
        'opcode': '#ff9ff3'      // Pink
      },
      'J': {
        'imm[20|10:1|11|19:12]': '#ff6b6b', // Red
        'rd': '#feca57',                    // Yellow
        'opcode': '#ff9ff3'                 // Pink
      }
    };
    return colorMap[instructionType] || {};
  };

  const renderColoredBinary = (binary: string, instructionType: string) => {
    const fieldColors = getFieldColors(instructionType);
    const fieldRanges: { [key: string]: { [key: string]: [number, number] } } = {
      'R': {
        'funct7': [0, 6],
        'rs2': [7, 11],
        'rs1': [12, 16],
        'funct3': [17, 19],
        'rd': [20, 24],
        'opcode': [25, 31]
      },
      'I': {
        'imm[11:0]': [0, 11],
        'rs1': [12, 16],
        'funct3': [17, 19],
        'rd': [20, 24],
        'opcode': [25, 31]
      },
      'S': {
        'imm[11:5]': [0, 6],
        'rs2': [7, 11],
        'rs1': [12, 16],
        'funct3': [17, 19],
        'imm[4:0]': [20, 24],
        'opcode': [25, 31]
      },
      'B': {
        'imm[12|10:5]': [0, 6],
        'rs2': [7, 11],
        'rs1': [12, 16],
        'funct3': [17, 19],
        'imm[4:1|11]': [20, 24],
        'opcode': [25, 31]
      },
      'U': {
        'imm[31:12]': [0, 19],
        'rd': [20, 24],
        'opcode': [25, 31]
      },
      'J': {
        'imm[20|10:1|11|19:12]': [0, 19],
        'rd': [20, 24],
        'opcode': [25, 31]
      }
    };

    const ranges = fieldRanges[instructionType] || {};
    const segments: { text: string; color: string; field: string }[] = [];

    // Create segments for each field
    Object.entries(ranges).forEach(([field, range]) => {
      const [start, end] = range;
      const fieldBinary = binary.slice(start, end + 1);
      const color = fieldColors[field] || '#666';
      segments.push({ text: fieldBinary, color, field });
    });

    return (
      <div style={{ fontFamily: 'monospace', fontSize: '14px', lineHeight: '1.5' }}>
        {segments.map((segment, index) => (
          <span
            key={index}
            style={{
              backgroundColor: segment.color,
              color: 'white',
              padding: '2px 4px',
              margin: '0 1px',
              borderRadius: '3px',
              fontWeight: 'bold'
            }}
            title={segment.field}
          >
            {segment.text}
          </span>
        ))}
      </div>
    );
  };

  return (
    <div style={{ maxWidth: 800, margin: '2rem auto', padding: '1rem' }}>
      <Stack gap="md">
        <Text size="xl" fw={700}>RISC-V Instruction Decoder</Text>

        <TextInput
          label="Hex Input"
          placeholder="Enter 32-bit hex (e.g. 0x00b50533 or 00b50533)"
          value={hex}
          onChange={(e) => setHex(e.currentTarget.value)}
          error={error}
        />

        <Button onClick={decode} loading={loading}>Decode</Button>

        {/* Binary Display - moved here */}
        {decoded && (
          <Card shadow="sm" padding="md" radius="md" withBorder>
            <Stack gap="sm">
              <Text size="sm" fw={500} c="dimmed">Binary Representation</Text>
              {renderColoredBinary(decoded.binary, decoded.instructionType)}
            </Stack>
          </Card>
        )}

        {decoded && (
          <Card shadow="sm" padding="lg" radius="md" withBorder>
            <Stack gap="md">
              {/* Header with mnemonic and type */}
              <Group justify="space-between" align="center">
                <Text size="lg" fw={700}>{decoded.mnemonic}</Text>
                <Badge color={getInstructionTypeColor(decoded.instructionType)} size="lg">
                  {decoded.instructionType}-type
                </Badge>
              </Group>

              {/* Description */}
              <Text c="dimmed" fs="italic">{decoded.description}</Text>

              <Divider />

              {/* Hex */}
              <div>
                <Text size="sm" fw={500} c="dimmed">Hex</Text>
                <Code block>{decoded.hex}</Code>
              </div>

              {/* Operands */}
              <div>
                <Text size="sm" fw={500} c="dimmed">Operands</Text>
                <Group gap="xs" mt={4}>
                  {decoded.operands.map((operand, index) => (
                    <Badge key={index} variant="light" size="md">
                      {operand}
                    </Badge>
                  ))}
                </Group>
              </div>

              {/* Opcode */}
              <div>
                <Text size="sm" fw={500} c="dimmed">Opcode</Text>
                <Code>{decoded.opcode}</Code>
              </div>

              {/* Instruction Fields */}
              <div>
                <Text size="sm" fw={500} c="dimmed">Instruction Fields</Text>
                <Grid mt={4}>
                  {Object.entries(decoded.fields).map(([field, value]) => {
                    const fieldColors = getFieldColors(decoded.instructionType);
                    const fieldColor = fieldColors[field] || '#666';
                    return (
                      <Grid.Col key={field} span={4}>
                        <div>
                          <Text 
                            size="xs" 
                            style={{ 
                              color: fieldColor,
                              fontWeight: 'bold'
                            }}
                          >
                            {field}
                          </Text>
                          <Code>{value}</Code>
                        </div>
                      </Grid.Col>
                    );
                  })}
                </Grid>
              </div>
            </Stack>
          </Card>
        )}
      </Stack>
    </div>
  );
}
