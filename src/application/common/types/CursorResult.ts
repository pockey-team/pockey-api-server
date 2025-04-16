export interface CursorResult<T> {
  items: T[];
  nextCursor?: string;
  hasMore: boolean;
}
