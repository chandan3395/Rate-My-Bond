import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { api } from "../lib/api";
import ScoreSection from "../components/analysis/ScoreSection";
import BreakdownSection from "../components/analysis/BreakdownSection";

function formatDate(value) {
  if (!value) return "";
  try {
    return new Date(value).toLocaleString();
  } catch {
    return value;
  }
}

function AnalysisDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [doc, setDoc] = useState(null);
  const [status, setStatus] = useState("loading"); // loading | ready | notfound | error
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const data = await api.get(`/api/analyses/${id}`);
        if (!active) return;
        setDoc(data);
        setStatus("ready");
      } catch (err) {
        if (!active) return;
        setStatus(err?.status === 404 || err?.status === 403 ? "notfound" : "error");
      }
    })();
    return () => {
      active = false;
    };
  }, [id]);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await api.delete(`/api/analyses/${id}`);
      navigate("/history", { replace: true });
    } catch {
      setDeleting(false);
    }
  };

  return (
    <main className="px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
      <div className="mx-auto max-w-3xl">
        <Link
          to="/history"
          className="text-sm font-semibold text-[#8fd7cf] transition hover:text-white"
        >
          ← Back to history
        </Link>

        {status === "loading" ? (
          <div className="mt-8 rounded-[1.5rem] border border-white/10 bg-white/5 p-6 text-white/60">
            Loading analysis…
          </div>
        ) : null}

        {status === "notfound" ? (
          <div className="mt-8 rounded-[1.5rem] border border-white/10 bg-white/5 p-6 text-white/65">
            This analysis was not found or is not available to your account.
          </div>
        ) : null}

        {status === "error" ? (
          <div className="mt-8 rounded-[1.5rem] border border-[#f39a8d]/30 bg-[#2b1c1a] p-6 text-[#f7c1b8]">
            Something went wrong loading this analysis.
          </div>
        ) : null}

        {status === "ready" && doc ? (
          <div className="mt-6 space-y-6">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="text-3xl font-semibold tracking-tight text-white">
                  {doc.input?.issuer || "Unknown issuer"}
                </h1>
                <p className="mt-1 text-sm text-white/55">
                  Analyzed {formatDate(doc.createdAt)}
                </p>
              </div>
              <button
                type="button"
                onClick={handleDelete}
                disabled={deleting}
                className="self-start rounded-full border border-white/15 px-4 py-2 text-sm font-semibold text-white/75 transition hover:border-white/30 hover:bg-white/5 disabled:opacity-50"
              >
                {deleting ? "Removing…" : "Delete"}
              </button>
            </div>

            {/* Reuses the same presentational panels; renders backend values. */}
            <ScoreSection analysis={doc.result} />
            <BreakdownSection analysis={doc.result} />
          </div>
        ) : null}
      </div>
    </main>
  );
}

export default AnalysisDetailPage;
