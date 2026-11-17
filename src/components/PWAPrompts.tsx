import React, { useState } from "react";
import { useOnlineStatus, usePWAInstall } from "../utils/usePWAInstall";

export const PWAInstallButton: React.FC<{
  variant?: "banner" | "profile";
}> = ({ variant = "banner" }) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  if (isInstalled) {
    if (variant === "profile") {
      return (
        <p className="sub" style={{ color: "var(--ok)", fontWeight: 600 }}>
          ✓ Rumbo ya está instalada en este dispositivo.
        </p>
      );
    }
    return null;
  }

  const iosModal = showIOSGuide && (
    <>
      <div className="bd" onClick={() => setShowIOSGuide(false)} />
      <div
        className="card"
        role="dialog"
        aria-label="Instalar Rumbo en iPhone o iPad"
        style={{
          position: "fixed",
          left: 16,
          right: 16,
          top: "50%",
          transform: "translateY(-50%)",
          maxWidth: 420,
          margin: "0 auto",
          zIndex: 30,
          padding: 18,
          boxShadow: "0 14px 36px rgba(0, 0, 0, .28)",
        }}
      >
        <h3 style={{ marginBottom: 8 }}>Instalar en iPhone / iPad</h3>
        <ol className="guide-ol" style={{ marginBottom: 14 }}>
          <li>
            Abre esta aplicación en <b>Safari</b> y toca el botón{" "}
            <b>Compartir</b> (cuadro con flecha hacia arriba).
          </li>
          <li>
            Desplázate hacia abajo y selecciona{" "}
            <b>Agregar a pantalla de inicio</b>.
          </li>
          <li>
            Toca <b>Agregar</b> arriba a la derecha para usar Rumbo como app.
          </li>
        </ol>
        <button className="pri" onClick={() => setShowIOSGuide(false)}>
          Entendido
        </button>
      </div>
    </>
  );

  if (variant === "banner") {
    if (dismissed) return null;

    if (isInstallable) {
      return (
        <div
          className="card row"
          style={{ borderColor: "var(--acc)", marginTop: 12, gap: 10 }}
        >
          <div className="grow">
            <b>Instalar Rumbo en tu celular</b>
            <div className="sub">
              Úsala en pantalla completa y accede rápido incluso sin conexión.
            </div>
          </div>
          <button
            type="button"
            className="chip2"
            style={{
              background: "var(--acc)",
              color: "var(--acc-ink)",
              borderColor: "var(--acc)",
              fontWeight: 700,
              whiteSpace: "nowrap",
            }}
            onClick={() => void install()}
          >
            Instalar
          </button>
          <button
            type="button"
            className="ic2"
            onClick={() => setDismissed(true)}
            aria-label="Ocultar aviso de instalación"
          >
            ×
          </button>
        </div>
      );
    }

    if (isIOS) {
      return (
        <>
          <div
            className="card row"
            style={{ borderColor: "var(--acc)", marginTop: 12, gap: 10 }}
          >
            <div className="grow">
              <b>Instalar Rumbo en tu iPhone</b>
              <div className="sub">
                Agrégala a tu pantalla de inicio para abrirla como app.
              </div>
            </div>
            <button
              type="button"
              className="chip2"
              style={{
                background: "var(--acc)",
                color: "var(--acc-ink)",
                borderColor: "var(--acc)",
                fontWeight: 700,
                whiteSpace: "nowrap",
              }}
              onClick={() => setShowIOSGuide(true)}
            >
              Cómo instalar
            </button>
            <button
              type="button"
              className="ic2"
              onClick={() => setDismissed(true)}
              aria-label="Ocultar aviso de instalación"
            >
              ×
            </button>
          </div>
          {iosModal}
        </>
      );
    }

    return null;
  }

  // Profile variant: always show install action or browser instructions
  if (isInstallable) {
    return (
      <button type="button" className="pri" onClick={() => void install()}>
        📲 Instalar aplicación en este dispositivo
      </button>
    );
  }

  if (isIOS) {
    return (
      <>
        <button
          type="button"
          className="pri"
          onClick={() => setShowIOSGuide(true)}
        >
          📲 Instalar en iPhone / iPad
        </button>
        {iosModal}
      </>
    );
  }

  return (
    <p className="sub" style={{ marginBottom: 0 }}>
      Para instalarla en tu celular: abre esta página en Chrome (Android) o Safari (iPhone), toca el menú del navegador y elige{" "}
      <b>«Instalar aplicación»</b> o <b>«Agregar a pantalla de inicio»</b>.
    </p>
  );
};

export const OfflineIndicator: React.FC = () => {
  const isOnline = useOnlineStatus();
  if (isOnline) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      style={{
        position: "fixed",
        left: 14,
        right: 14,
        bottom: 78,
        maxWidth: 420,
        margin: "0 auto",
        zIndex: 25,
        background: "#B45309",
        color: "#FFFFFF",
        borderRadius: 12,
        padding: "8px 12px",
        fontSize: ".82rem",
        fontWeight: 600,
        textAlign: "center",
        boxShadow: "0 6px 18px rgba(0, 0, 0, .22)",
      }}
    >
      Modo sin conexión — tus datos guardados siguen disponibles.
    </div>
  );
};
