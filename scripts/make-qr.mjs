// 명함용 QR 생성: node scripts/make-qr.mjs https://내도메인.kr
// 결과: public/qr-card.png (인쇄용 고해상도), public/qr-card.svg
import QRCode from "qrcode";
import { mkdirSync } from "node:fs";

const base = process.argv[2];
if (!base || !/^https:\/\//.test(base)) {
  console.error("사용법: node scripts/make-qr.mjs https://내도메인.kr  (https 주소 필요)");
  process.exit(1);
}
const url = new URL(base);
url.searchParams.set("src", "card"); // 명함 유입 구분
mkdirSync("public", { recursive: true });
const opts = { errorCorrectionLevel: "H", margin: 4 };
await QRCode.toFile("public/qr-card.png", url.toString(), { ...opts, width: 1200 });
await QRCode.toFile("public/qr-card.svg", url.toString(), { ...opts, type: "svg" });
console.log("생성 완료:", url.toString());
