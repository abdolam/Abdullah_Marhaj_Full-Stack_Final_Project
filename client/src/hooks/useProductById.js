import { useEffect, useState } from "react";

import { getProductById } from "../api/productsApi";

export default function useProductById(id) {
  const [product, setProduct] = useState(null);
  const [status, setStatus] = useState("idle"); // idle | loading | ready | notfound | error

  useEffect(() => {
    let alive = true;

    async function run() {
      if (!id) return;

      setStatus("loading");
      setProduct(null);

      try {
        const data = await getProductById(id);
        if (!alive) return;

        setProduct(data);
        setStatus("ready");
      } catch (err) {
        if (!alive) return;

        const httpStatus = err?.response?.status;
        if (httpStatus === 404) {
          setStatus("notfound");
          setProduct(null);
          return;
        }

        setStatus("error");
        setProduct(null);
      }
    }

    run();

    return () => {
      alive = false;
    };
  }, [id]);

  return { product, status };
}
