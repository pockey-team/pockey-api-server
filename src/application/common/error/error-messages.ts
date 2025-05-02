export const ERROR_MESSAGES = {
  AUTH: {
    INSUFFICIENT_PERMISSION: '해당 작업을 수행할 권한이 없습니다.',
    INVALID_PASSWORD: '비밀번호가 일치하지 않습니다.',
    INVALID_REFRESH_TOKEN: '유효하지 않은 리프레시 토큰입니다.',
    REQUIRE_USER_ROLE: '사용자 권한이 필요합니다.',
    TOKEN_EXPIRED: '토큰이 만료되었습니다.',
  },
  USER: {
    NOT_FOUND: '사용자를 찾을 수 없습니다.',
  },
  POST: {
    NOT_FOUND: '게시글을 찾을 수 없습니다.',
  },
} as const;
