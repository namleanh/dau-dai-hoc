/**
 * Search API endpoint
 * GET /api/search?q={query}
 * Returns user-friendly error messages with optional error codes
 */

import { NextRequest, NextResponse } from 'next/server';
import { performSearch } from '@/lib/search';
import type { SearchResponse } from '@/types';

/**
 * Map raw error messages to user-friendly Vietnamese messages
 */
function getFriendlyError(error: unknown): { message: string; code: string } {
  const rawMessage = error instanceof Error ? error.message : String(error);

  // Gemini rate limit / quota errors
  if (rawMessage.includes('429') || rawMessage.includes('quota') || rawMessage.includes('Too Many Requests')) {
    return {
      message: 'Hệ thống đang quá tải. Vui lòng thử lại sau vài giây.',
      code: `GEMINI_RATE_LIMIT: ${rawMessage}`,
    };
  }

  // Gemini service unavailable
  if (rawMessage.includes('503') || rawMessage.includes('Service Unavailable') || rawMessage.includes('high demand')) {
    return {
      message: 'Dịch vụ AI đang bận. Vui lòng thử lại sau ít phút.',
      code: `GEMINI_UNAVAILABLE: ${rawMessage}`,
    };
  }

  // Gemini 404 / model not found
  if (rawMessage.includes('404') && (rawMessage.includes('model') || rawMessage.includes('Not Found'))) {
    return {
      message: 'Dịch vụ AI tạm thời không khả dụng. Chúng tôi đang khắc phục.',
      code: `GEMINI_MODEL_ERROR: ${rawMessage}`,
    };
  }

  // Gemini auth errors
  if (rawMessage.includes('401') || rawMessage.includes('403') || rawMessage.includes('API key')) {
    return {
      message: 'Lỗi cấu hình hệ thống. Vui lòng liên hệ quản trị viên.',
      code: `AUTH_ERROR: ${rawMessage}`,
    };
  }

  // Tavily errors
  if (rawMessage.includes('TAVILY') || rawMessage.includes('Tavily')) {
    return {
      message: 'Không thể tìm kiếm dữ liệu. Vui lòng thử lại.',
      code: `TAVILY_ERROR: ${rawMessage}`,
    };
  }

  // Network errors
  if (rawMessage.includes('fetch') || rawMessage.includes('network') || rawMessage.includes('ECONNREFUSED')) {
    return {
      message: 'Lỗi kết nối mạng. Vui lòng kiểm tra kết nối internet.',
      code: `NETWORK_ERROR: ${rawMessage}`,
    };
  }

  // No results
  if (rawMessage.includes('Không tìm thấy')) {
    return {
      message: rawMessage,
      code: 'NO_RESULTS',
    };
  }

  // JSON parse error from Gemini
  if (rawMessage.includes('JSON') || rawMessage.includes('parse') || rawMessage.includes('Unexpected token')) {
    return {
      message: 'AI trả về dữ liệu không hợp lệ. Vui lòng thử lại.',
      code: `PARSE_ERROR: ${rawMessage}`,
    };
  }

  // Fallback
  return {
    message: 'Đã xảy ra lỗi không mong muốn. Vui lòng thử lại sau.',
    code: `UNKNOWN: ${rawMessage}`,
  };
}

export async function GET(request: NextRequest): Promise<NextResponse<SearchResponse>> {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get('q');

  // Validate input
  if (!query || query.trim().length === 0) {
    return NextResponse.json(
      { success: false, error: 'Vui lòng nhập từ khóa tìm kiếm.' },
      { status: 400 }
    );
  }

  if (query.trim().length < 2) {
    return NextResponse.json(
      { success: false, error: 'Từ khóa tìm kiếm quá ngắn (tối thiểu 2 ký tự).' },
      { status: 400 }
    );
  }

  if (query.trim().length > 100) {
    return NextResponse.json(
      { success: false, error: 'Từ khóa tìm kiếm quá dài (tối đa 100 ký tự).' },
      { status: 400 }
    );
  }

  try {
    const data = await performSearch(query.trim());
    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Search error:', error);

    const { message, code } = getFriendlyError(error);

    return NextResponse.json(
      { success: false, error: message, errorCode: code },
      { status: 500 }
    );
  }
}
