// React frontend for the RISC-V decoder using Mantine

import { useState } from 'react';
import { TextInput, Button, Card, Text, Stack, Grid, Badge, Code, Divider } from '@mantine/core';
import FormatImageWithArrow from './FormatImageWithArrow';

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
      <div style={{ fontFamily: 'monospace', fontSize: '14px', lineHeight: '1.5', margin: 0 }}>
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
    <div style={{ maxWidth: 1000, margin: '2rem auto', padding: '1rem' }}>
      <Stack style={{ gap: '1rem' }}>
        <Text size="xl" fw={700}>RISC-V Instruction Decoder</Text>

        <TextInput
          placeholder="Enter 32-bit hex (e.g. 0x00b50533 or 00b50533)"
          value={hex}
          onChange={(e) => setHex(e.currentTarget.value)}
          styles={{ input: { minWidth: '300px' } }}
        />

        <Button onClick={decode} loading={loading} style={{ marginTop: '0.5rem', marginBottom: '0.5rem' }}>Decode</Button>

        {error && (
          <Text c="red" size="sm" style={{ marginTop: '0.5rem' }}>{error}</Text>
        )}

        {/* RV32I Formats image with moving arrow */}
        {decoded && (
          <Card shadow="sm" padding="md" radius="md" withBorder style={{ marginBottom: '0.5rem' }}>
            <FormatImageWithArrow
              activeType={decoded.mnemonic === 'fence' ? 'FENCE' : (decoded.instructionType as any)}
            />
          </Card>
        )}

        {/* Binary Display */}
        {decoded && (
          <Card shadow="sm" padding="md" radius="md" withBorder style={{ margin: 0 }}>
            <Stack style={{ gap: '0.5rem' }}>
              <Text size="sm" fw={500} c="dimmed" style={{ margin: 0 }}>Binary Representation</Text>
              <div style={{ marginTop: '0.5rem' }}>{renderColoredBinary(decoded.binary, decoded.instructionType)}</div>
            </Stack>
          </Card>
        )}

        {decoded && (
          <Card shadow="sm" padding="md" radius="md" withBorder style={{ margin: 0 }}>
            <Stack style={{ gap: '1rem' }}>
              {/* Header with mnemonic, operands, and type */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', alignItems: 'center', width: '100%' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'nowrap' }}>
                  <Text size="lg" fw={700} style={{ whiteSpace: 'nowrap' }}>{decoded.mnemonic}</Text>
                  <Badge color={getInstructionTypeColor(decoded.instructionType)} size="lg">
                    {decoded.instructionType}-type
                  </Badge>
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', flexWrap: 'nowrap' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'nowrap' }}>
                    <Text size="sm" fw={500} c="dimmed" style={{ whiteSpace: 'nowrap' }}>Operands</Text>
                    <Text size="sm" style={{ whiteSpace: 'nowrap' }}>{decoded.operands.join(', ')}</Text>
                  </div>
                </div>
              </div>

              {/* Description */}
              <Text c="dimmed" fs="italic" style={{ margin: 0 }}>{decoded.description}</Text>

              <Divider style={{ margin: 0, marginTop: '0.5rem' }} />

              {/* Instruction Fields */}
              <Grid gutter={0} style={{ margin: 0, marginTop: '0.5rem' }}>
                  {Object.entries(decoded.fields).reverse().map(([field, value]) => {
                    const fieldColors = getFieldColors(decoded.instructionType);
                    const fieldColor = fieldColors[field] || '#666';
                    return (
                      <Grid.Col key={field} span={4} style={{ marginBottom: '0.5rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'nowrap' }}>
                          <Text 
                            size="xs" 
                            style={{ 
                              color: fieldColor,
                              fontWeight: 'bold',
                              whiteSpace: 'nowrap',
                              margin: 0
                            }}
                          >
                            {field}
                          </Text>
                          <Code style={{ margin: 0 }}>{value}</Code>
                        </div>
                      </Grid.Col>
                    );
                  })}
                </Grid>
            </Stack>
          </Card>
        )}
      </Stack>
    </div>
  );
}
