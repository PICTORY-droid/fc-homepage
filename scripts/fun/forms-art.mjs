// 이력서·자기소개서 빈 양식 10종 — 인쇄해서 쓰거나 PDF 앱에서 입력할 수 있는 A4 양식입니다.
// scripts/fun/make-forms.mjs 가 이 파일을 불러 PDF·미리보기를 만듭니다. (우체국 공식 로고는 쓰지 않습니다)
export const W = 794, H = 1123;
const O = "#2F5D9E", D = "#1F3A5F", LINE = "#b9c4d3", SOFT = "#EEF3FA";

export const css = `
@page{size:${W}px ${H}px;margin:0}*{box-sizing:border-box;margin:0}
html,body{font-family:"Pretendard","Noto Sans CJK KR","Malgun Gothic",sans-serif;color:#1d2733;font-size:13px}
.page{position:relative;width:${W}px;height:${H}px;padding:46px 52px 40px;overflow:hidden;page-break-after:always;background:#fff}
.page:last-child{page-break-after:auto}
h1{font-size:34px;font-weight:900;letter-spacing:14px;text-align:center;color:${D}}
h1 small{display:block;margin-top:6px;font-size:12px;letter-spacing:2px;color:#7a8798;font-weight:500}
.sec{margin:15px 0 6px;font-weight:900;color:${D};font-size:15px;border-left:5px solid ${O};padding-left:8px}
table{width:100%;border-collapse:collapse;table-layout:fixed}
td,th{border:1px solid ${LINE};padding:5px 8px;height:33px;vertical-align:middle;font-size:12.5px}
th{background:${SOFT};color:#1F3A5F;font-weight:700;text-align:center}
.tall td{height:66px}.photo{border:1.5px dashed ${LINE};width:113px;height:151px;display:flex;align-items:center;justify-content:center;color:#9aa6b5;font-size:12px;text-align:center;line-height:1.5}
.top{display:flex;gap:16px;margin-top:14px}.top table{flex:1}
.box{border:1px solid ${LINE};border-radius:6px;position:relative}
.ruled{background:repeating-linear-gradient(to bottom,transparent 0 31px,#dde4ee 31px 32px);}
.q{margin:14px 0 6px;font-weight:900;font-size:14px;color:#1d2733}.q span{color:${D};margin-right:6px}.q em{font-style:normal;font-weight:500;color:#7a8798;font-size:11.5px;margin-left:6px}
.foot{position:absolute;left:52px;right:52px;bottom:22px;text-align:center;font-size:11px;color:#9aa6b5}
.sign{margin-top:14px;text-align:center;font-size:13px;line-height:2}
.cb{display:inline-block;width:12px;height:12px;border:1.3px solid #6b7889;margin:0 4px -2px 10px}
.hd{display:flex;justify-content:space-between;align-items:flex-end;border-bottom:3px solid ${O};padding-bottom:8px;margin-bottom:6px}
.hd b{font-size:26px;font-weight:900;color:${D};letter-spacing:6px}.hd span{font-size:12px;color:#7a8798}
`;

const rows = (n, cols, extra = "") => Array.from({ length: n }, () => `<tr ${extra}>${cols.map(() => "<td></td>").join("")}</tr>`).join("");
const head = (labels, widths) => `<colgroup>${widths.map((w) => `<col style="width:${w}">`).join("")}</colgroup><tr>${labels.map((l) => `<th>${l}</th>`).join("")}</tr>`;
const grid = (labels, widths, n, extra) => `<table>${head(labels, widths)}${rows(n, labels, extra)}</table>`;
const sec = (t) => `<div class="sec">${t}</div>`;
const foot = (t = "") => `<div class="foot">${t || "빈 양식 · 우체국보험 상담 안내 제공 · 개인정보는 본인이 직접 기입하세요"}</div>`;
const pageOf = (inner, f) => `<div class="page">${inner}${foot(f)}</div>`;
const person = (rowsList) => `<table><colgroup><col style="width:92px"><col><col style="width:92px"><col></colgroup>${rowsList.map(([a, b, c, d]) => `<tr><th>${a}</th><td ${c ? "" : 'colspan="3"'}>${b ?? ""}</td>${c ? `<th>${c}</th><td>${d ?? ""}</td>` : ""}</tr>`).join("")}</table>`;
const ruledBox = (h) => `<div class="box ruled" style="height:${h}px"></div>`;
const q = (n, t, hint = "") => `<div class="q"><span>${n}.</span>${t}${hint ? `<em>${hint}</em>` : ""}</div>`;
const sign = `<div class="sign">위 내용은 사실과 다름이 없음을 확인합니다.<br>20 &nbsp;&nbsp;&nbsp; 년 &nbsp;&nbsp;&nbsp; 월 &nbsp;&nbsp;&nbsp; 일 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 작성자 : ______________ (서명)</div>`;
const check = (items) => items.map((i) => `<span class="cb"></span>${i}`).join("");

export const forms = [
  { id: "resume-01-standard", kind: "이력서", name: "표준 이력서", desc: "사진란·인적사항·학력·경력·자격까지 담은 가장 기본 양식", pages: 1,
    html: () => pageOf(`<h1>이 력 서<small>RESUME</small></h1>
      <div class="top"><div class="photo">사진<br>(3×4cm)</div>${person([["성 명", ""], ["생년월일", "", "성 별", ""], ["연 락 처", "", "이 메 일", ""], ["주 소", ""]])}</div>
      ${sec("학 력")}${grid(["기 간", "학교명", "전공 / 학과", "졸업 구분"], ["22%", "30%", "30%", "18%"], 3)}
      ${sec("경 력")}${grid(["기 간", "회사명 / 부서", "직 위", "담당 업무"], ["22%", "28%", "14%", "36%"], 4)}
      ${sec("자격 · 면허")}${grid(["취득일", "자격 / 면허명", "발행 기관"], ["22%", "46%", "32%"], 3)}
      ${sec("어학 · 특기 사항")}${grid(["구 분", "내 용", "점수 / 수준"], ["22%", "52%", "26%"], 1)}
      <div style="margin-top:10px;font-size:12.5px">병역 사항 : ${check(["군필", "미필", "면제", "해당 없음"])}</div>${sign}`) },
  { id: "resume-02-newbie", kind: "이력서", name: "신입 간단형", desc: "대외활동·인턴·수상 경력 중심의 신입용 이력서", pages: 1,
    html: () => pageOf(`<h1>이 력 서<small>RESUME · 신입</small></h1>
      <div class="top"><div class="photo">사진<br>(3×4cm)</div>${person([["성 명", ""], ["생년월일", "", "연 락 처", ""], ["이 메 일", "", "희망 직무", ""], ["주 소", ""]])}</div>
      ${sec("학 력")}${grid(["기 간", "학교명", "전공 / 학점", "비 고"], ["22%", "30%", "30%", "18%"], 3)}
      ${sec("인턴 · 대외활동 · 동아리")}${grid(["기 간", "기관 / 활동명", "역 할", "배운 점"], ["20%", "26%", "18%", "36%"], 3)}
      ${sec("수상 · 프로젝트")}${grid(["일 자", "수상 / 프로젝트명", "주관 / 내용"], ["20%", "40%", "40%"], 3)}
      ${sec("자격증 · 어학 · 활용 가능 프로그램")}${grid(["취득일", "자격 / 프로그램명", "점수 / 수준"], ["22%", "46%", "32%"], 3)}${sign}`) },
  { id: "resume-03-career", kind: "이력서", name: "경력직 중심형", desc: "회사별 담당업무와 주요 성과를 넉넉히 적는 경력용", pages: 2,
    html: () => pageOf(`<h1>이 력 서<small>RESUME · 경력</small></h1>
      <div class="top"><div class="photo">사진<br>(3×4cm)</div>${person([["성 명", ""], ["생년월일", "", "연 락 처", ""], ["이 메 일", "", "희망 연봉", ""], ["주 소", ""]])}</div>
      ${sec("요약 (핵심 역량 3줄)")}${ruledBox(140)}
      ${sec("경력 사항 ①")}<table><colgroup><col style="width:92px"><col><col style="width:92px"><col></colgroup><tr><th>회 사 명</th><td></td><th>근무 기간</th><td></td></tr><tr><th>부서 / 직위</th><td></td><th>퇴사 사유</th><td></td></tr></table>
      <table style="margin-top:-1px"><tr><th style="width:92px;height:400px">담당 업무<br>및 성과</th><td class="ruled" style="height:400px"></td></tr></table>`) +
      pageOf(`${sec("경력 사항 ②")}<table><colgroup><col style="width:92px"><col><col style="width:92px"><col></colgroup><tr><th>회 사 명</th><td></td><th>근무 기간</th><td></td></tr><tr><th>부서 / 직위</th><td></td><th>퇴사 사유</th><td></td></tr></table>
      <table style="margin-top:-1px"><tr><th style="width:92px;height:150px">담당 업무<br>및 성과</th><td class="ruled" style="height:150px"></td></tr></table>
      ${sec("경력 사항 ③")}<table><colgroup><col style="width:92px"><col><col style="width:92px"><col></colgroup><tr><th>회 사 명</th><td></td><th>근무 기간</th><td></td></tr><tr><th>부서 / 직위</th><td></td><th>퇴사 사유</th><td></td></tr></table>
      <table style="margin-top:-1px"><tr><th style="width:92px;height:150px">담당 업무<br>및 성과</th><td class="ruled" style="height:150px"></td></tr></table>
      ${sec("학 력")}${grid(["기 간", "학교명", "전공", "졸업 구분"], ["22%", "30%", "30%", "18%"], 2)}
      ${sec("자격 · 면허 · 어학")}${grid(["취득일", "자격 / 면허명", "발행 기관 / 점수"], ["22%", "46%", "32%"], 3)}${sign}`) },
  { id: "resume-04-onepage", kind: "이력서", name: "한 장 심플형", desc: "꼭 필요한 항목만 한 장에 담은 간단 이력서", pages: 1,
    html: () => pageOf(`<div class="hd"><b>이력서</b><span>성명 : ____________ &nbsp; 연락처 : ____________________</span></div>
      <table style="margin-top:10px"><colgroup><col style="width:92px"><col><col style="width:92px"><col></colgroup><tr><th>생년월일</th><td></td><th>이 메 일</th><td></td></tr><tr><th>주 소</th><td colspan="3"></td></tr><tr><th>지원 분야</th><td colspan="3"></td></tr></table>
      ${sec("학 력")}${grid(["기 간", "학교명 / 전공", "비 고"], ["24%", "52%", "24%"], 3)}
      ${sec("경 력")}${grid(["기 간", "회사 / 직위", "주요 업무"], ["24%", "30%", "46%"], 5)}
      ${sec("자격 · 교육 · 수상")}${grid(["일 자", "내 용", "기 관"], ["24%", "50%", "26%"], 4)}
      ${sec("한 줄 소개")}${ruledBox(66)}${sign}`) },
  { id: "resume-05-profile", kind: "이력서", name: "프로필 강조형", desc: "왼쪽 프로필·오른쪽 이력으로 나눈 세련된 2단 양식", pages: 1,
    html: () => `<div class="page" style="padding:0;display:flex">
      <div style="width:250px;background:${SOFT};padding:44px 24px;height:100%">
        <div class="photo" style="width:150px;height:190px;margin:0 auto;background:#fff">사진</div>
        <div class="sec" style="margin-top:26px">Profile</div><div style="line-height:2.3;font-size:12.5px">이름 ______________<br>생년월일 ___________<br>연락처 ____________<br>이메일 ____________<br>주소 ______________</div>
        <div class="sec" style="margin-top:20px">Skill</div><div style="line-height:2.3;font-size:12.5px">1. ________________<br>2. ________________<br>3. ________________<br>4. ________________</div>
        <div class="sec" style="margin-top:20px">자격 · 어학</div><div style="line-height:2.3;font-size:12.5px">_________________<br>_________________<br>_________________</div></div>
      <div style="flex:1;padding:46px 40px 40px 34px"><div class="hd"><b>이력서</b><span>RESUME</span></div>
        ${sec("한 줄 소개")}${ruledBox(70)}${sec("경 력")}${grid(["기 간", "회사 / 직위", "주요 업무"], ["26%", "30%", "44%"], 5)}${sec("학 력")}${grid(["기 간", "학교 / 전공"], ["30%", "70%"], 3)}${sec("활동 · 수상")}${grid(["일 자", "내 용"], ["26%", "74%"], 4)}
      </div>${foot()}</div>` },
  { id: "cover-01-standard", kind: "자기소개서", name: "표준 4문항형", desc: "성장과정·성격·지원동기·포부를 적는 가장 기본 자소서", pages: 2,
    html: () => pageOf(`<div class="hd"><b>자기소개서</b><span>성명 : ____________ &nbsp; 지원 분야 : ____________</span></div>
      ${q(1, "성장 과정", "(600자 이내)")}${ruledBox(230)}${q(2, "성격의 장점과 단점", "(600자 이내)")}${ruledBox(230)}${q(3, "지원 동기", "(600자 이내)")}${ruledBox(230)}`) +
      pageOf(`${q(4, "입사 후 포부 및 목표", "(600자 이내)")}${ruledBox(380)}${q(5, "기타 하고 싶은 말", "(자유)")}${ruledBox(380)}${sign}`) },
  { id: "cover-02-job", kind: "자기소개서", name: "직무 중심형", desc: "직무 경험·역량·문제 해결 사례 중심", pages: 2,
    html: () => pageOf(`<div class="hd"><b>자기소개서</b><span>지원 직무 : ____________________</span></div>
      ${q(1, "이 직무를 선택한 이유", "(500자 이내)")}${ruledBox(230)}${q(2, "직무 관련 경험 · 활동", "(700자 이내)")}${ruledBox(300)}${q(3, "내가 가진 핵심 역량 3가지", "(각 1~2문장)")}${ruledBox(230)}`) +
      pageOf(`${q(4, "문제를 해결했던 경험 (상황 → 행동 → 결과)", "(700자 이내)")}${ruledBox(400)}${q(5, "입사 후 1년 목표와 성장 계획", "(500자 이내)")}${ruledBox(330)}${sign}`) },
  { id: "cover-03-motive", kind: "자기소개서", name: "지원동기·협업형", desc: "신입에게 많이 묻는 지원동기와 협업 경험", pages: 2,
    html: () => pageOf(`<div class="hd"><b>자기소개서</b><span>성명 : ____________ &nbsp; 지원처 : ____________</span></div>
      ${q(1, "지원 동기", "(700자 이내)")}${ruledBox(260)}${q(2, "학교생활 · 대외활동에서 가장 기억에 남는 경험", "(700자 이내)")}${ruledBox(260)}${q(3, "다른 사람과 협업하며 갈등을 풀었던 경험", "(500자 이내)")}${ruledBox(160)}`) +
      pageOf(`${q(4, "나를 표현하는 키워드 3가지와 이유", "(500자 이내)")}${ruledBox(250)}${q(5, "입사 후 포부", "(500자 이내)")}${ruledBox(250)}${q(6, "마지막으로 하고 싶은 말")}${ruledBox(200)}${sign}`) },
  { id: "cover-04-career", kind: "자기소개서", name: "경력기술형", desc: "회사별 담당 업무와 성과(STAR)를 정리하는 경력용", pages: 2,
    html: () => pageOf(`<div class="hd"><b>경력기술서</b><span>성명 : ____________ &nbsp; 지원 분야 : ____________</span></div>
      ${q(1, "경력 요약", "(5줄 이내)")}${ruledBox(220)}
      ${q(2, "회사 ① 담당 업무와 성과", "(상황 · 과제 · 행동 · 결과)")}<table><colgroup><col style="width:92px"><col><col style="width:92px"><col></colgroup><tr><th>회 사 명</th><td></td><th>근무 기간</th><td></td></tr></table>${ruledBox(520)}`) +
      pageOf(`${q(3, "회사 ② 담당 업무와 성과", "(상황 · 과제 · 행동 · 결과)")}<table><colgroup><col style="width:92px"><col><col style="width:92px"><col></colgroup><tr><th>회 사 명</th><td></td><th>근무 기간</th><td></td></tr></table>${ruledBox(290)}
      ${q(4, "나의 강점과 보완하고 싶은 점", "(500자 이내)")}${ruledBox(200)}${q(5, "지원 이유 · 앞으로의 계획", "(500자 이내)")}${ruledBox(200)}${sign}`) },
  { id: "cover-05-free", kind: "자기소개서", name: "자유 서술형", desc: "줄 노트 형식으로 자유롭게 쓰는 2쪽 자기소개서", pages: 2,
    html: () => pageOf(`<div class="hd"><b>자기소개서</b><span>제목 : ______________________________</span></div>
      <div style="margin-top:8px;font-size:12px;color:#7a8798">성명 : ____________ &nbsp; 지원 분야 : ____________ &nbsp; 작성일 : 20__ . __ . __</div>
      <div class="box ruled" style="margin-top:12px;height:880px"></div>`) +
      pageOf(`<div class="box ruled" style="margin-top:6px;height:940px"></div><div class="sign" style="margin-top:12px">작성자 : ______________ (서명)</div>`) },
];
