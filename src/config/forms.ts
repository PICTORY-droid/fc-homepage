// 이력서·자기소개서 양식 10종 — 파일은 public/fun/forms/ 에 있고 scripts/fun/make-forms.mjs 로 만듭니다. (id 는 scripts/fun/forms-art.mjs 와 같아야 합니다)
export interface FormTemplate { id: string; kind: "이력서" | "자기소개서"; name: string; desc: string; pages: number }

export const formTemplates: FormTemplate[] = [
  { id: "resume-01-standard", kind: "이력서", name: "표준 이력서", desc: "사진란·인적사항·학력·경력·자격까지 담은 가장 기본 양식", pages: 1 },
  { id: "resume-02-newbie", kind: "이력서", name: "신입 간단형", desc: "대외활동·인턴·수상 경력 중심의 신입용 이력서", pages: 1 },
  { id: "resume-03-career", kind: "이력서", name: "경력직 중심형", desc: "회사별 담당업무와 주요 성과를 넉넉히 적는 경력용", pages: 2 },
  { id: "resume-04-onepage", kind: "이력서", name: "한 장 심플형", desc: "꼭 필요한 항목만 한 장에 담은 간단 이력서", pages: 1 },
  { id: "resume-05-profile", kind: "이력서", name: "프로필 강조형", desc: "왼쪽 프로필·오른쪽 이력으로 나눈 세련된 2단 양식", pages: 1 },
  { id: "cover-01-standard", kind: "자기소개서", name: "표준 4문항형", desc: "성장과정·성격·지원동기·포부를 적는 가장 기본 자소서", pages: 2 },
  { id: "cover-02-job", kind: "자기소개서", name: "직무 중심형", desc: "직무 경험·역량·문제 해결 사례 중심", pages: 2 },
  { id: "cover-03-motive", kind: "자기소개서", name: "지원동기·협업형", desc: "신입에게 많이 묻는 지원동기와 협업 경험", pages: 2 },
  { id: "cover-04-career", kind: "자기소개서", name: "경력기술형", desc: "회사별 담당 업무와 성과(STAR)를 정리하는 경력용", pages: 2 },
  { id: "cover-05-free", kind: "자기소개서", name: "자유 서술형", desc: "줄 노트 형식으로 자유롭게 쓰는 2쪽 자기소개서", pages: 2 },
];

export const formFile = (id: string, ext: "docx" | "jpg") => (ext === "jpg" ? `/fun/forms/thumbs/${id}.jpg` : `/fun/forms/${id}.docx`);
