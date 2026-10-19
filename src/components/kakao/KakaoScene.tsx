// 카카오톡 비대면 상담 만화 장면 — 직접 그린 오리지널 그림입니다. (카카오 캐릭터·이모티콘은 사용하지 않습니다)
// 배경이 없는 투명 SVG이며, 움직임은 globals.css 의 .kk-* 규칙(모션 줄이기 설정이면 멈춘 완성 장면)이 담당합니다.
export function KakaoScene({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 300 200" className={`kk ${className}`} aria-hidden="true" focusable="false">
      {/* 바닥 그림자 */}
      <ellipse cx="225" cy="182" rx="50" ry="6" fill="#000" opacity=".08" />

      {/* 휴대폰 */}
      <rect x="24" y="10" width="104" height="180" rx="18" fill="#fff" stroke="#333" strokeWidth="3" />
      <rect x="32" y="22" width="88" height="156" rx="10" fill="#FFFDF5" />
      <rect x="32" y="22" width="88" height="22" rx="10" fill="#FEE500" />
      <rect x="32" y="34" width="88" height="10" fill="#FEE500" />
      <text x="76" y="38" textAnchor="middle" fontSize="11" fontWeight="800" fill="#4a3a1a">상담방</text>

      {/* 말풍선 1 — 고객 문의 */}
      <g className="kk-b1">
        <rect x="40" y="52" width="58" height="24" rx="10" fill="#fff" stroke="#E5DCC3" strokeWidth="1.5" />
        <text x="69" y="68" textAnchor="middle" fontSize="10.5" fontWeight="700" fill="#555">상담 문의</text>
      </g>

      {/* 입력 중 … */}
      <g className="kk-dots">
        <rect x="66" y="84" width="54" height="24" rx="10" fill="#FEE500" />
        <circle className="kk-dot kk-dot1" cx="82" cy="96" r="2.8" fill="#5a4a2a" />
        <circle className="kk-dot kk-dot2" cx="93" cy="96" r="2.8" fill="#5a4a2a" />
        <circle className="kk-dot kk-dot3" cx="104" cy="96" r="2.8" fill="#5a4a2a" />
      </g>

      {/* 말풍선 2 — 담당 FC 답변 */}
      <g className="kk-b2">
        <rect x="64" y="84" width="56" height="24" rx="10" fill="#FEE500" />
        <text x="92" y="100" textAnchor="middle" fontSize="10.5" fontWeight="800" fill="#4a3a1a">안내해요</text>
      </g>

      {/* 문서 */}
      <g className="kk-doc">
        <rect x="42" y="116" width="68" height="52" rx="8" fill="#fff" stroke="#E5DCC3" strokeWidth="1.5" />
        <rect x="50" y="126" width="34" height="5" rx="2.5" fill="#FFDAC1" />
        <rect x="50" y="137" width="52" height="5" rx="2.5" fill="#EFEFEF" />
        <rect x="50" y="148" width="40" height="5" rx="2.5" fill="#EFEFEF" />
      </g>
      {/* 확인 도장 */}
      <g className="kk-stamp">
        <circle cx="98" cy="152" r="15" fill="#fff" fillOpacity=".85" stroke="#E8591A" strokeWidth="3" />
        <path d="m91 152 5 5 9-10" fill="none" stroke="#E8591A" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
      </g>

      {/* 메시지가 오가는 점선 */}
      <path className="kk-flow" d="M134 104 C 150 90, 160 90, 172 100" fill="none" stroke="#FF883A" strokeWidth="3" strokeLinecap="round" />

      {/* 오리지널 캐릭터 — 말풍선 모양 */}
      <g className="kk-char">
        <path d="M192 150 L180 178 L218 156 Z" fill="#FF883A" />
        <rect x="170" y="70" width="110" height="88" rx="40" fill="#FF883A" />
        <rect x="182" y="78" width="60" height="14" rx="7" fill="#fff" opacity=".22" />
        <g className="kk-eyes">
          <circle cx="205" cy="108" r="5.5" fill="#333" />
          <circle cx="245" cy="108" r="5.5" fill="#333" />
        </g>
        <ellipse cx="193" cy="124" rx="8" ry="5" fill="#FFB27A" />
        <ellipse cx="257" cy="124" rx="8" ry="5" fill="#FFB27A" />
        <path d="M214 121 Q225 135 236 121" fill="none" stroke="#333" strokeWidth="3.2" strokeLinecap="round" />
      </g>

      {/* 완료 말풍선 */}
      <g className="kk-ok">
        <rect x="172" y="20" width="106" height="32" rx="16" fill="#fff" stroke="#FF883A" strokeWidth="2.5" />
        <path d="M205 52 L215 52 L208 61 Z" fill="#fff" stroke="#FF883A" strokeWidth="2.5" strokeLinejoin="round" />
        <rect x="204" y="49" width="14" height="5" fill="#fff" />
        <text x="225" y="41" textAnchor="middle" fontSize="14" fontWeight="800" fill="#C4540A">계약 완료!</text>
      </g>

      {/* 반짝이 */}
      <path className="kk-spark" d="M152 40 l3 8 8 3 -8 3 -3 8 -3 -8 -8 -3 8 -3z" fill="#FEE500" />
      <path className="kk-spark kk-spark2" d="M286 92 l2.5 6 6 2.5 -6 2.5 -2.5 6 -2.5 -6 -6 -2.5 6 -2.5z" fill="#FF883A" />
      <path className="kk-spark kk-spark3" d="M146 138 c-2-4-8-2-6 2 1 3 6 6 6 6s5-3 6-6c2-4-4-6-6-2z" fill="#FF883A" opacity=".7" />
    </svg>
  );
}
