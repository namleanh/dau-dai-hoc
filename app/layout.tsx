import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Đậu Đại Học — Tra cứu tuyển sinh đại học Việt Nam',
  description:
    'Tra cứu điểm chuẩn, ngành học, cơ hội nghề nghiệp và tìm trường đại học phù hợp tại Việt Nam. Hỗ trợ thí sinh thi đại học với dữ liệu cập nhật.',
  keywords: [
    'điểm chuẩn đại học',
    'tuyển sinh',
    'đại học Việt Nam',
    'tra cứu ngành học',
    'điểm thi đại học',
    'tư vấn tuyển sinh',
  ],
  openGraph: {
    title: 'Đậu Đại Học — Tra cứu tuyển sinh đại học Việt Nam',
    description:
      'Tra cứu điểm chuẩn, ngành học, cơ hội nghề nghiệp và tìm trường đại học phù hợp.',
    type: 'website',
    locale: 'vi_VN',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body>{children}</body>
    </html>
  );
}
