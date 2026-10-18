// 페이지를 옮길 때마다 부드럽게 나타나는 효과 (스타일은 globals.css 의 .page-enter)
export default function Template({ children }: { children: React.ReactNode }) {
  return <div className="page-enter">{children}</div>;
}
