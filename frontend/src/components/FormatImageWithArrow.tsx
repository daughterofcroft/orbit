import riscvFormats from '@/assets/riscv-formats.png';
import arrow from '@/assets/arrow.svg';

type SupportedType = 'R' | 'I' | 'S' | 'B' | 'U' | 'J' | 'FENCE' | 'unknown';

interface Props {
  activeType: SupportedType;
  imageSrc?: string;
}

// Map instruction types to top percentages
const getTopPercent = (type: SupportedType): string => {
  const typeUpper = type === 'unknown' ? 'R' : type.toUpperCase();
  const topMap: Record<string, string> = {
    'R': '17%',
    'I': '27%',
    'S': '37%',
    'B': '47%',
    'U': '57.5%',
    'J': '67.8%',
    'FENCE': '95%'
  };
  return topMap[typeUpper] || '17%';
};

export default function FormatImageWithArrow({ activeType, imageSrc = riscvFormats }: Props) {
  const topPercent = getTopPercent(activeType);

  return (
    <>
      <style>{`
        .rv-wrapper {
          position: relative;
          width: 100%;
          max-width: 900px;
          margin: 0 auto;
        }

        .rv-image {
          width: 100%;
          height: auto;
          display: block;
          border-radius: 8px;
          border: 1px solid #eaeaea;
        }

        .arrow {
          position: absolute;
          right: -4%;
          width: 5%;
          aspect-ratio: 1 / 1;
          background-image: url(${arrow});
          background-size: contain;
          background-repeat: no-repeat;
          transform: translateY(-50%);
        }
      `}</style>
      <div className="rv-wrapper">
        <img src={imageSrc} className="rv-image" alt="RISC-V instruction formats (RV32I)" />
        <div 
          className="arrow" 
          style={{ top: topPercent }}
          aria-hidden="true" 
        />
      </div>
    </>
  );
}


