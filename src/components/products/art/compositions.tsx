import type { ReactNode } from "react";
import {
  Balloon, Basket, Bandage, Bed, Building, Car, Checklist, Coin, CoinStack, Doc, Drop, Ecg, FlowArrow, Gift, GradCap, HardHat, Heart, HeartShape,
  Meter, Percent, Person, Piggy, Put, Ribbon, Shield, Sparkle, Sprout, Stage, Tag, Tooth, Umbrella,
  PEACH, YELLOW,
} from "./parts";

// 상품 id → 일러스트 구성. 모양은 parts.tsx 의 부품을 조합해 만들어, 상품이 늘어도 스타일이 같게 유지됩니다.
const Floating = ({ x, y, d = 0 }: { x: number; y: number; d?: number }) => (
  <Put x={x} y={y} d={d} loop="art-beat"><HeartShape /></Put>
);
const Spark = ({ x, y, d = 0 }: { x: number; y: number; d?: number }) => (
  <Put x={x} y={y} d={d} loop="art-twinkle"><Sparkle /></Put>
);
/** 흐르는 동전 배지 */
const CoinBadge = ({ x, y, d = 0, label = "₩" }: { x: number; y: number; d?: number; label?: string }) => (
  <Put x={x} y={y} d={d} loop="art-float"><Coin label={label} r={16} fontSize={15} /></Put>
);

export const COMPOSITIONS: Record<string, () => ReactNode> = {
  P001: () => (<Stage>
    <Put x={70} d={0.2} loop="art-bob"><Person fill={PEACH} /></Put>
    <Put x={112} d={0.4} loop="art-bob2"><Person fill={YELLOW} /></Put>
    <Put x={170} d={0.6} s={1.1} loop="art-float-slow"><Shield symbol="cross" /></Put>
    <Floating x={92} y={92} d={0.9} />
  </Stage>),

  P003: () => (<Stage>
    <Put x={120} y={162} s={3.4} d={0.2} loop="art-beat"><Heart /></Put>
    <Ecg d="M44 112h40l10-22 14 46 14-40 8 16h66" />
    <Spark x={52} y={60} d={0.3} /><Spark x={196} y={150} d={0.9} />
  </Stage>),

  P004: () => (<Stage>
    <Put x={58} d={0.2} s={0.8} loop="art-float-slow"><Shield symbol="text" label="암" /></Put>
    <Put x={120} d={0.4} s={0.95} loop="art-float"><Shield symbol="text" label="뇌" /></Put>
    <Put x={182} d={0.6} s={0.8} loop="art-float-slow"><Shield symbol="text" label="심" /></Put>
    <Put x={80} d={0.9}><Coin label="₩" r={12} fontSize={11} /></Put>
    <Put x={160} d={1} ><Coin label="₩" r={12} fontSize={11} /></Put>
    <Floating x={120} y={104} d={1.2} />
  </Stage>),

  P005: () => (<Stage>
    <Put x={66} d={0.2} loop="art-bob"><Person fill={PEACH} /></Put>
    <Put x={106} d={0.4} loop="art-bob2"><Person fill={YELLOW} /></Put>
    <Put x={172} y={150} d={0.6} loop="art-spin-y"><Coin label="OK" r={34} fontSize={26} /></Put>
    <Floating x={134} y={92} d={0.9} />
  </Stage>),

  P006: () => (<Stage>
    <Put x={120} d={0.2} s={1.5} loop="art-sway"><Umbrella /></Put>
    <Put x={96} d={0.5} loop="art-bob"><Person fill={PEACH} /></Put>
    <Put x={144} d={0.7} loop="art-bob2"><Person fill={YELLOW} /></Put>
  </Stage>),

  P007: () => (<Stage>
    <Put x={86} d={0.2} s={1.35} loop="art-float-slow"><Ribbon /></Put>
    <Put x={166} d={0.5} s={1.1} loop="art-float"><Shield symbol="heart" /></Put>
    <Floating x={118} y={56} d={0.9} />
  </Stage>),

  P008: () => (<Stage>
    <Put x={72} d={0.2} s={1.2} loop="art-float"><Balloon /></Put>
    <Put x={82} d={0.4} s={0.85} loop="art-bob"><Person fill={YELLOW} /></Put>
    <Put x={160} d={0.6} s={1.1} loop="art-float-slow"><Shield symbol="heart" /></Put>
    <Spark x={120} y={64} d={0.6} />
  </Stage>),

  P009: () => (<Stage>
    <Put x={94} d={0.2} loop="art-bob"><Person fill={PEACH} /></Put>
    <Put x={128} d={0.4} loop="art-bob2"><Person fill={YELLOW} /></Put>
    <path d="M100 138q16 10 30 0" fill="none" stroke="#D9432F" strokeWidth="4" strokeLinecap="round" />
    <Floating x={111} y={82} d={0.8} />
    <Put x={176} d={0.7} s={0.85} loop="art-float-slow"><Shield symbol="check" /></Put>
  </Stage>),

  P010: () => (<Stage>
    <Put x={92} d={0.2} s={1.2} loop="art-float-slow"><Shield symbol="cross" /></Put>
    <Put x={170} y={120} d={0.5} rot={-28} loop="art-float"><Bandage /></Put>
    <Floating x={176} y={72} d={0.9} />
  </Stage>),

  P011: () => (<Stage>
    <Put x={86} d={0.2} s={1.2} loop="art-float-slow"><Doc label="예금" lines={3} /></Put>
    <Put x={156} d={0.5} s={0.95} loop="art-float"><Shield symbol="heart" /></Put>
    <Put x={176} y={176} d={0.8} loop="art-spin-y"><Coin label="+" r={13} fontSize={16} /></Put>
  </Stage>),

  P012: () => (<Stage>
    <Put x={62} d={0.2} loop="art-bob"><Person fill={PEACH} /></Put>
    <Put x={120} d={0.4} loop="art-bob2"><Person fill={YELLOW} /></Put>
    <Put x={178} d={0.6} loop="art-bob"><Person fill={PEACH} /></Put>
    <Put x={120} y={100} d={0.9} s={0.7} loop="art-float"><Shield symbol="check" /></Put>
  </Stage>),

  P013: () => (<Stage>
    <Put x={112} d={0.2} s={1.35} loop="art-drive"><Car /></Put>
    <Put x={186} y={110} d={0.6} s={0.75} loop="art-float"><Shield symbol="check" /></Put>
  </Stage>),

  P014: () => (<Stage>
    <Put x={64} d={0.2} s={0.95} loop="art-float-slow"><Building /></Put>
    <Put x={142} d={0.4} s={1.1} loop="art-float"><Doc label="영수증" lines={3} /></Put>
    <Put x={186} y={176} d={0.8} loop="art-spin-y"><Coin label="₩" r={15} fontSize={14} /></Put>
  </Stage>),

  P015: () => (<Stage>
    <Put x={70} d={0.2} s={0.95} loop="art-float-slow"><Doc label="기존" lines={2} w={50} h={56} /></Put>
    <Put x={170} d={0.4} s={0.95} loop="art-float"><Doc label="전환" lines={2} w={50} h={56} /></Put>
    <FlowArrow d="M92 118q28-34 56 0" head="m140 108 9 10-12 3" />
    <FlowArrow d="M148 150q-28 30-56 0" head="m100 160-9-10 12-3" />
    <Put x={120} y={104} d={0.9} s={0.6} loop="art-beat"><Shield symbol="check" /></Put>
  </Stage>),

  P016: () => (<Stage>
    <Put x={78} d={0.2} s={1.15} loop="art-bob"><Person fill={PEACH} hair /></Put>
    <Put x={150} d={0.4} s={1.1} loop="art-float-slow"><Doc label="영수증" lines={3} /></Put>
    <Floating x={92} y={86} d={0.9} />
  </Stage>),

  P017: () => (<Stage>
    <Put x={80} d={0.2} s={1.1} loop="art-float-slow"><Checklist /></Put>
    <Put x={158} d={0.4} s={1.05} loop="art-float"><Doc label="영수증" lines={3} /></Put>
    <Put x={190} y={176} d={0.8} loop="art-spin-y"><Coin label="₩" r={13} fontSize={13} /></Put>
  </Stage>),

  P018: () => (<Stage>
    <Put x={120} y={158} d={0.2} s={1.9} loop="art-spin-y"><Coin label="1만원" r={22} fontSize={11} /></Put>
    <Floating x={62} y={78} d={0.6} /><Floating x={186} y={96} d={1} />
    <Spark x={190} y={56} d={0.4} />
  </Stage>),

  P019: () => (<Stage>
    <Put x={104} d={0.2} s={1.5} loop="art-float-slow"><HardHat /></Put>
    <Put x={186} d={0.5} s={0.95} loop="art-float"><Shield symbol="check" /></Put>
  </Stage>),

  P020: () => (<Stage>
    <Put x={54} y={96} d={0.2} loop="art-float-slow"><Tag label="질병" /></Put>
    <Put x={54} y={134} d={0.35} loop="art-float"><Tag label="입원" /></Put>
    <Put x={54} y={172} d={0.5} loop="art-float-slow"><Tag label="상해" /></Put>
    <FlowArrow d="M92 82q22 0 40 22M92 120h40M92 158q22 0 40-22" head="m124 118 10 2-10 6" />
    <Put x={176} d={0.8} s={1.2} loop="art-beat"><Shield symbol="check" /></Put>
  </Stage>),

  P021: () => (<Stage>
    <Put x={90} d={0.2} s={1.2} loop="art-float-slow"><Checklist /></Put>
    <Put x={168} d={0.5} s={1.1} loop="art-float"><Shield symbol="heart" /></Put>
  </Stage>),

  P022: () => (<Stage>
    <Put x={120} y={150} d={0.2} s={3} loop="art-beat"><Heart /></Put>
    <path className="art-draw" pathLength={1} style={{ "--d": "0.9s" } as React.CSSProperties} d="m96 112 16 16 34-38" fill="none" stroke="#fff" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round" />
    <Spark x={52} y={64} d={0.5} /><Spark x={196} y={84} d={1} />
  </Stage>),

  P023: () => (<Stage>
    <Put x={120} d={0.2} s={1.45} loop="art-float-slow"><Tooth /></Put>
    <Spark x={50} y={70} d={0.4} /><Spark x={196} y={64} d={0.9} /><Spark x={186} y={140} d={1.4} />
    <Floating x={58} y={140} d={0.9} />
  </Stage>),

  P024: () => (<Stage>
    <Put x={104} d={0.2} s={1.4} loop="art-float-slow"><Bed /></Put>
    <Floating x={182} y={110} d={0.8} /><Floating x={196} y={146} d={1.1} />
    <Put x={172} d={0.6} loop="art-bob"><Person fill={YELLOW} /></Put>
  </Stage>),

  P025: () => (<Stage>
    <Put x={82} d={0.2} s={1.1} loop="art-bob"><Person fill={PEACH} hair /></Put>
    <Put x={126} d={0.4} s={1.1} loop="art-bob2"><Person fill={YELLOW} hair /></Put>
    <Put x={182} d={0.6} s={1} loop="art-float-slow"><Shield symbol="heart" /></Put>
    <Floating x={104} y={78} d={0.9} />
  </Stage>),

  P026: () => (<Stage>
    <Put x={92} d={0.2} s={1.35} loop="art-float"><Drop /></Put>
    <Put x={168} d={0.5} s={1.2} loop="art-float-slow"><Meter /></Put>
    <Put x={186} y={70} d={0.9} s={0.6} loop="art-beat"><Shield symbol="check" /></Put>
  </Stage>),

  P027: () => (<Stage>
    <Put x={120} d={0.2} s={1.5} loop="art-float-slow"><Basket /></Put>
    <Put x={88} y={96} d={0.5} s={0.55} loop="art-bounce"><Shield symbol="heart" /></Put>
    <Put x={122} y={92} d={0.7} loop="art-bounce"><Coin label="₩" r={15} fontSize={14} /></Put>
    <Put x={156} y={96} d={0.9} s={1.1} loop="art-bounce"><Heart /></Put>
  </Stage>),

  P028: () => (<Stage>
    <Put x={120} d={0.2} s={1.15} loop="art-float-slow"><Building /></Put>
    <Put x={56} d={0.5} loop="art-bob"><Person fill={PEACH} /></Put>
    <Put x={184} d={0.7} loop="art-bob2"><Person fill={YELLOW} /></Put>
    <Floating x={120} y={46} d={1} />
  </Stage>),

  P030: () => (<Stage>
    <Put x={86} d={0.2} s={1.25} loop="art-bob"><Person fill={PEACH} hair /></Put>
    <Put x={124} d={0.4} s={0.7} loop="art-bob2"><Person fill={YELLOW} /></Put>
    <Put x={180} d={0.6} s={1.1} loop="art-float-slow"><Shield symbol="heart" /></Put>
    <Floating x={104} y={84} d={0.9} />
  </Stage>),

  P031: () => (<Stage>
    <Put x={96} y={140} d={0.2} s={1.5} loop="art-float"><GradCap /></Put>
    <Put x={176} d={0.5} s={1.1}><CoinStack n={4} /></Put>
    <Put x={176} y={110} d={0.9} loop="art-spin-y"><Coin label="₩" r={13} fontSize={12} /></Put>
  </Stage>),

  P034: () => (<Stage>
    <Put x={120} d={0.2} s={1.5} loop="art-float-slow"><Coin label="₩" r={26} fontSize={22} /></Put>
    <Put x={120} y={126} d={0.5} s={1.3} loop="art-sway"><Sprout /></Put>
    <Put x={64} y={176} d={0.7} loop="art-spin-y"><Coin label="₩" r={12} fontSize={11} /></Put>
    <Put x={182} y={176} d={0.9} loop="art-spin-y"><Coin label="₩" r={12} fontSize={11} /></Put>
  </Stage>),

  P035: () => (<Stage>
    <Put x={80} d={0.2} s={1.3}><CoinStack n={4} /></Put>
    <Put x={170} d={0.5} s={1.1} loop="art-float-slow"><Piggy /></Put>
    <path className="art-draw" pathLength={1} style={{ "--d": "0.8s" } as React.CSSProperties} d="M46 120 82 96l16 12 42-44" fill="none" stroke="#FF883A" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
    <path className="art-draw" pathLength={1} style={{ "--d": "1.6s" } as React.CSSProperties} d="m124 62 18 0 0 18" fill="none" stroke="#FF883A" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
  </Stage>),

  P041: () => (<Stage>
    <Put x={80} d={0.2} s={1.15} loop="art-bob"><Person fill={PEACH} hair /></Put>
    <Put x={124} d={0.4} s={1.15} loop="art-bob2"><Person fill={YELLOW} hair /></Put>
    <CoinBadge x={102} y={84} d={0.8} />
    <Put x={182} d={0.6} s={1} loop="art-float-slow"><Shield symbol="heart" /></Put>
  </Stage>),

  P042: () => (<Stage>
    <Put x={120} d={0.2} s={1.5} loop="art-float-slow"><Gift /></Put>
    <Put x={52} y={80} d={0.6} loop="art-spin-y"><Coin label="₩" r={12} fontSize={11} /></Put>
    <Put x={190} y={72} d={0.8} loop="art-spin-y"><Coin label="₩" r={12} fontSize={11} /></Put>
    <Put x={120} y={46} d={1} loop="art-spin-y"><Coin label="₩" r={12} fontSize={11} /></Put>
    <Spark x={70} y={44} d={0.3} /><Spark x={176} y={40} d={0.9} />
  </Stage>),

  P043: () => (<Stage>
    <Put x={100} d={0.2} s={1.5} loop="art-float-slow"><Doc label="연금저축" lines={3} w={56} /></Put>
    <Put x={172} y={150} d={0.6} s={1.25} loop="art-beat"><Percent /></Put>
  </Stage>),

  P044: () => (<Stage>
    <Put x={62} d={0.2} s={1.1} loop="art-float-slow"><Piggy /></Put>
    <Put x={182} d={0.5} s={1.1} loop="art-float"><Piggy /></Put>
    <FlowArrow d="M70 112q50-58 100 0" head="m160 98 11 11-15 4" />
    <CoinBadge x={120} y={72} d={0.9} />
  </Stage>),

  P045: () => (<Stage>
    <Put x={62} d={0.2} s={1.1} loop="art-float-slow"><Piggy /></Put>
    <Put x={182} d={0.5} s={1.1} loop="art-float"><Piggy /></Put>
    <FlowArrow d="M70 112q50-58 100 0" head="m160 98 11 11-15 4" />
    <Put x={120} y={60} d={0.9} s={0.9} loop="art-float"><Doc label="연금" lines={2} w={44} h={46} /></Put>
  </Stage>),

  P046: () => (<Stage>
    <Put x={94} d={0.2} loop="art-bob"><Person fill={PEACH} hair /></Put>
    <Put x={130} d={0.4} loop="art-bob2"><Person fill={YELLOW} hair /></Put>
    <path d="M100 138q16 10 30 0" fill="none" stroke="#D9432F" strokeWidth="4" strokeLinecap="round" />
    <CoinBadge x={112} y={80} d={0.8} />
    <Floating x={174} y={96} d={1} />
  </Stage>),
};


