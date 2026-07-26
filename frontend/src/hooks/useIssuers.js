import { useEffect, useState } from "react";
import { api } from "../lib/api";

// Loads the issuer catalog FROM the Mongo-backed GET /api/issuers (through the
// authenticated API client) and exposes both a list of issuer names (for the
// search field) and a lookup map (for auto-detect of issuer-derived fields).
export default function useIssuers() {
  const [issuers, setIssuers] = useState([]);
  const [issuerMap, setIssuerMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let active = true;

    (async () => {
      try {
        const data = await api.get("/api/issuers");
        if (!active) {
          return;
        }

        const list = Array.isArray(data) ? data : [];
        const map = {};
        const names = [];

        list.forEach((record) => {
          if (!record?.issuer) {
            return;
          }
          if (!map[record.issuer]) {
            map[record.issuer] = record;
            names.push(record.issuer);
          }
        });

        setIssuerMap(map);
        setIssuers(names);
      } catch (err) {
        if (active) {
          setError(err);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    })();

    return () => {
      active = false;
    };
  }, []);

  return { issuers, issuerMap, loading, error };
}
