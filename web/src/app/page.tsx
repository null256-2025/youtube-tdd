"use client";
import { useCallback } from "react";
import { useAppStore, ResultItem } from "../store/appStore";

function LoadingShimmer() {
  return (
    <div className="mt-3" role="status" aria-live="polite" aria-busy="true">
      <div className="placeholder-glow">
        <span className="placeholder col-7"></span>
        <span className="placeholder col-4"></span>
        <span className="placeholder col-4"></span>
        <span className="placeholder col-6"></span>
        <span className="placeholder col-8"></span>
      </div>
    </div>
  );
}

function ResultsList({ results }: { results: ResultItem[] }) {
  if (results.length === 0) {
    return <p className="text-muted mt-3">検索結果はまだありません。</p>;
  }
  return (
    <ul className="list-group mt-3" aria-label="検索結果">
      {results.map((r) => (
        <li key={r.id} className="list-group-item d-flex align-items-center">
          <span className="me-2" aria-hidden>
            🔍
          </span>
          <span>{r.title}</span>
        </li>
      ))}
    </ul>
  );
}

export default function Home() {
  const query = useAppStore((s) => s.searchQuery);
  const setQuery = useAppStore((s) => s.setSearchQuery);
  const results = useAppStore((s) => s.results);
  const setResults = useAppStore((s) => s.setResults);
  const isLoading = useAppStore((s) => s.isLoading);
  const setIsLoading = useAppStore((s) => s.setIsLoading);
  const error = useAppStore((s) => s.errorMessage);
  const setError = useAppStore((s) => s.setErrorMessage);

  const onSubmit = useCallback(async (e?: React.FormEvent) => {
    e?.preventDefault?.();
    setError(null);
    setIsLoading(true);
    setResults([]);
    try {
      await new Promise((r) => setTimeout(r, 800));
      setResults(
        Array.from({ length: 5 }).map((_, i) => ({
          id: `${Date.now()}-${i}`,
          title: `${query} のダミー結果 ${i + 1}`,
        }))
      );
    } catch {
      setError("検索に失敗しました。リトライしてください。");
    } finally {
      setIsLoading(false);
    }
  }, [query, setError, setIsLoading, setResults]);

  return (
    <div className="container py-5">
      <h1 className="h3">YouTube検索・分析（基盤）</h1>
      <form className="mt-3" onSubmit={onSubmit}>
        <label htmlFor="keyword" className="form-label">
          キーワード
        </label>
        <div className="input-group">
          <input
            id="keyword"
            className="form-control"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="例: ゲーム 実況"
            aria-describedby="search-help"
          />
          <button className="btn btn-primary" type="submit" disabled={isLoading}>
            検索
          </button>
        </div>
        <div id="search-help" className="form-text">
          TASK-002: フォーム/結果/ローディングの骨組み
        </div>
      </form>

      {isLoading && <LoadingShimmer />}
      {!isLoading && <ResultsList results={results} />}

      {error && (
        <div className="toast-container position-fixed bottom-0 end-0 p-3">
          <div className="toast show" role="alert" aria-live="assertive" aria-atomic="true">
            <div className="toast-header">
              <strong className="me-auto">エラー</strong>
              <button
                type="button"
                className="btn-close"
                aria-label="Close"
                onClick={() => setError(null)}
              />
            </div>
            <div className="toast-body">
              {error}
              <div className="mt-2 pt-2 border-top">
                <button
                  type="button"
                  className="btn btn-sm btn-primary me-2"
                  onClick={() => onSubmit()}
                >
                  リトライ
                </button>
                <button
                  type="button"
                  className="btn btn-sm btn-secondary"
                  onClick={() => setError(null)}
                >
                  閉じる
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
