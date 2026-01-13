import { useEffect, useMemo, useState } from "react";

import { clearToken, getToken, setToken } from "../auth/authStorage";
import { decodeJwt, isJwtExpired } from "../auth/jwt";
import { AuthContext } from "../context/AuthContext";

function readInitialAuth() {
  const token = getToken();
  if (!token) return { token: "", payload: null };

  const payload = decodeJwt(token);
  if (payload && isJwtExpired(payload)) {
    clearToken();
    return { token: "", payload: null };
  }

  return { token, payload };
}

export default function AuthProvider({ children }) {
  const initial = readInitialAuth();

  const [tokenState, setTokenState] = useState(initial.token);
  const [payload, setPayload] = useState(initial.payload);

  function login(nextToken) {
    if (!nextToken) return;
    setToken(nextToken);
    setTokenState(nextToken);
    setPayload(decodeJwt(nextToken));
  }

  function logout() {
    clearToken();
    setTokenState("");
    setPayload(null);
  }

  useEffect(() => {
    function onAuthInvalid() {
      logout();

      // keep existing app behavior in sync (badge/cart listeners)
      window.dispatchEvent(new Event("ecostore_cart_updated"));
    }

    window.addEventListener("ecostore_auth_invalid", onAuthInvalid);
    return () =>
      window.removeEventListener("ecostore_auth_invalid", onAuthInvalid);
  }, []);

  const value = useMemo(() => {
    const isLoggedIn =
      Boolean(tokenState) && (!payload || !isJwtExpired(payload));
    const isAdmin = Boolean(payload?.isAdmin);

    return {
      token: tokenState,
      payload,
      isLoggedIn,
      isAdmin,
      login,
      logout,
    };
  }, [tokenState, payload]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
