import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../lib/api";
import { getBondRatingTone } from "../utils/bondAnalysis";

function formatDate(value) {
  if (!value) {
    return "";
  }
  try {
    return new Date(value).toLocaleString();
  } catch {
    return value;
  }
}

function HistoryPage() {
  const [items, setItems] = useState([]);
  const [nextCursor, setNextCursor] = useState(null);
  const [status, setStatus] = useState("loading"); // loading | ready | error
  const [loadingMore, setLoadingMore] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const loadPage = useCallback(async (cursor) => {
    const query = new URLSearchParams({ limit: "10" });
    if (cursor) {
      query.set("cursor", cursor);
    }
    return api.get(`/api/analyses?${query.toString()}`);
  }, []);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const data = await loadPage();
        if (!active) return;
        setItems(data.items ?? []);
        setNextCursor(data.nextCursor ?? null);
        setStatus("ready");
      } catch {
        if (active) setStatus("error");
      }
    })();
    return () => {
      active = false;
    };
  }, [loadPage]);

  const handleLoadMore = async () => {
    if (!nextCursor) return;
    setLoadingMore(true);
    try {
      const data = await loadPage(nextCursor);
      setItems((current) => [...current, ...(data.items ?? [])]);
      setNextCursor(data.nextCursor ?? null);
    } catch {
      // keep existing items; surface nothing intrusive
    } finally {
      setLoadingMore(false);
    }
  };

  const handleDelete = async (id) => {
    setDeletingId(id);
    try {
      await api.delete(`/api/analyses/${id}`);
      setItems((current) => current.filter((item) => item._id !== id));
    } catch {
      // no-op; item stays
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <main className="px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
      <div className="mx-auto max-w-4xl">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#8fd7cf]">
          Your history
        </p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
          Past bond analyses
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-7 text-white/65">
          Every analysis you run is saved to your account. Open one to review the
          full breakdown, or remove it.
        </p>

        <div className="mt-10 space-y-4">
          {status === "loading" ? (
            <div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-6 text-white/60">
              Loading your analyses…
            </div>
          ) : null}

          {status === "error" ? (
            <div className="rounded-[1.5rem] border border-[#f39a8d]/30 bg-[#2b1c1a] p-6 text-[#f7c1b8]">
              Could not load your history. Please try again later.
            </div>
          ) : null}

          {status === "ready" && items.length === 0 ? (
            <div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-6 text-white/65">
              You have no saved analyses yet.{" "}
              <Link to="/calculator" className="text-[#8fd7cf] hover:text-white">
                Rate your first bond
              </Link>
              .
            </div>
          ) : null}

          {items.map((item) => (
            <div
              key={item._id}
              className="flex flex-col gap-4 rounded-[1.5rem] border border-white/10 bg-[#0d2b2c]/80 p-5 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="flex items-center gap-5">
                <div className="text-center">
                  <p className="text-xs uppercase tracking-[0.18em] text-white/45">
                    Rating
                  </p>
                  <p
                    className={`mt-1 text-3xl font-semibold ${getBondRatingTone(
                      item.ratingBand,
                    )}`}
                  >
                    {item.ratingBand ?? "--"}
                  </p>
                </div>
                <div>
                  <p className="text-base font-semibold text-white">
                    {item.input?.issuer || "Unknown issuer"}
                  </p>
                  <p className="mt-1 text-sm text-white/55">
                    Score {item.finalScore ?? "--"}/100 · {formatDate(item.createdAt)}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Link
                  to={`/history/${item._id}`}
                  className="rounded-full border border-[#8fd7cf]/25 px-4 py-2 text-sm font-semibold text-[#8fd7cf] transition hover:bg-[#8fd7cf]/10"
                >
                  View
                </Link>
                <button
                  type="button"
                  onClick={() => handleDelete(item._id)}
                  disabled={deletingId === item._id}
                  className="rounded-full border border-white/15 px-4 py-2 text-sm font-semibold text-white/75 transition hover:border-white/30 hover:bg-white/5 disabled:opacity-50"
                >
                  {deletingId === item._id ? "Removing…" : "Delete"}
                </button>
              </div>
            </div>
          ))}
        </div>

        {nextCursor ? (
          <div className="mt-8 flex justify-center">
            <button
              type="button"
              onClick={handleLoadMore}
              disabled={loadingMore}
              className="rounded-full border border-white/15 px-6 py-3 text-sm font-semibold text-white transition hover:border-white/30 hover:bg-white/5 disabled:opacity-50"
            >
              {loadingMore ? "Loading…" : "Load more"}
            </button>
          </div>
        ) : null}
      </div>
    </main>
  );
}

export default HistoryPage;
