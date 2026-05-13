/**
 * Google Gemini API client
 * Summarizes and structures raw search results into a clean SearchResult
 */

import { GoogleGenerativeAI } from '@google/generative-ai';
import type { SearchResult } from '@/types';

const GEMINI_MODEL = 'gemini-2.5-flash';

/**
 * Use Gemini to structure raw search data into a clean SearchResult
 * @param query - Original user query
 * @param rawContent - Combined content from Tavily search results
 * @param sources - Source URLs and titles from Tavily
 * @returns Structured SearchResult
 */
export async function structureWithGemini(
  query: string,
  rawContent: string,
  sources: Array<{ title: string; url: string }>
): Promise<SearchResult> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not configured');
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({
    model: GEMINI_MODEL,
    generationConfig: {
      responseMimeType: 'application/json',
      temperature: 0.2,
    },
  });

  const prompt = `Bạn là trợ lý tư vấn tuyển sinh đại học Việt Nam. Dựa vào dữ liệu tìm kiếm bên dưới, hãy tổng hợp thông tin về "${query}".

Trích xuất JSON theo đúng schema sau:
{
  "name": "Tên trường hoặc ngành (string)",
  "fullName": "Tên đầy đủ chính thức (string, optional)",
  "description": "Mô tả ngắn 1-2 câu (string, optional)",
  "funFacts": [
    "Chuyện bên lề, sự thật thú vị, thành tích nổi bật (ví dụ: vô địch Robocon), hoặc lời khuyên giúp học sinh dễ nhận dạng trường/ngành này. Cần tối đa 5 items."
  ],
  "type": "university" hoặc "major",
  "admissionScores": [
    {
      "majorName": "Tên ngành (string)",
      "majorCode": "Mã ngành nếu có (string, optional)",
      "score2025": 28.5,
      "score2024": 28.0,
      "score2023": 27.5
    }
  ],
  "careers": [
    {
      "title": "Tên công việc (string)",
      "description": "Mô tả ngắn 1 câu (string)"
    }
  ],
  "similarMajors": [
    {
      "name": "Tên ngành (string)",
      "type": "major",
      "hint": "Gợi ý điểm hoặc xếp hạng (string, optional)"
    }
  ],
  "similarUniversities": [
    {
      "name": "Tên trường (string)",
      "type": "university",
      "hint": "Gợi ý điểm hoặc xếp hạng (string, optional)"
    }
  ]
}

Yêu cầu:
1. Trích xuất điểm chuẩn các ngành trong 3 năm gần nhất (2023, 2024, 2025). Nếu năm nào không có dữ liệu thì để null hoặc bỏ qua field đó.
2. Liệt kê 4-6 công việc có thể làm sau khi tốt nghiệp, mỗi công việc có mô tả ngắn 1 câu.
3. Đưa ra mảng "funFacts" chứa 3-5 mẩu chuyện bên lề thú vị, thành tích Robocon/nghiên cứu khoa học, đặc điểm nhận dạng nổi bật, hoặc lời khuyên để học sinh có ấn tượng. Đảm bảo nội dung đa dạng.
4. Gợi ý 3-5 ngành học tương tự (cùng lĩnh vực hoặc liên quan).
5. Gợi ý 3-5 trường đại học tương tự (cùng mức điểm hoặc cùng ngành mạnh).
6. Nếu query là tên ngành (ví dụ "CNTT", "Y khoa"), hãy set type = "major" và liệt kê điểm chuẩn từ nhiều trường khác nhau.
7. Nếu query là tên trường (ví dụ "Bách Khoa"), hãy set type = "university" và liệt kê điểm chuẩn nhiều ngành của trường đó.
8. Chỉ sử dụng dữ liệu có trong nguồn tìm kiếm hoặc kiến thức chung an toàn. Nếu thiếu thông tin, để mảng rỗng thay vì bịa.

Dữ liệu tìm kiếm:
${rawContent}`;

  const result = await model.generateContent(prompt);
  const responseText = result.response.text();

  const parsed = JSON.parse(responseText) as SearchResult;

  // Attach sources from Tavily
  parsed.sources = sources.map((s) => ({
    title: s.title,
    url: s.url,
  }));

  return parsed;
}
