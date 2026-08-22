"use client";

import { useState, useEffect } from "react";
import { WhatsAppIcon } from "@/components/shared/Icons";
import { WhatsAppModal } from "@/components/shared/WhatsAppModal";

export function WhatsAppFloat() {
  const [modalOpen, setModalOpen] = useState(false);
  const [show, setShow] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setShow(true), 1500);
    return () => clearTimeout(t);
  }, []);

  if (!show) return null;

  return (
    <>
      <div className="whatsapp-float-container" style={{ position: "fixed", bottom: 24, right: 24, zIndex: 90 }}>
        <button
          className="whatsapp-float-btn"
          onClick={() => setModalOpen(true)}
          aria-label="WhatsApp"
          style={{
            width: 64,
            height: 64,
            borderRadius: 999,
            background: "#25D366",
            color: "white",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 14px 30px rgba(37,211,102,0.40)",
            position: "relative",
            animation: "pulse 2.5s ease infinite",
            border: "none",
            cursor: "pointer",
          }}
        >
          <WhatsAppIcon width={30} height={30} />
          <span className="whatsapp-float-badge" style={{
            position: "absolute",
            top: -4,
            right: -4,
            background: "var(--soley-red)",
            color: "white",
            fontSize: 11,
            fontWeight: 800,
            width: 22,
            height: 22,
            borderRadius: 999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            border: "2px solid white",
          }}>
            1
          </span>
        </button>
      </div>

      <WhatsAppModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
      />

      <style>{`
        @keyframes pulse {
          0%, 100% {
            box-shadow: 0 14px 30px rgba(37,211,102,0.40), 0 0 0 0 rgba(37,211,102,0.4);
          }
          50% {
            box-shadow: 0 14px 30px rgba(37,211,102,0.40), 0 0 0 16px rgba(37,211,102,0);
          }
        }

        @media (max-width: 640px) {
          .whatsapp-float-container {
            bottom: 20px !important;
            right: 20px !important;
          }

          .whatsapp-float-btn {
            width: 56px !important;
            height: 56px !important;
          }

          .whatsapp-float-btn svg {
            width: 26px !important;
            height: 26px !important;
          }

          .whatsapp-float-badge {
            width: 20px !important;
            height: 20px !important;
            font-size: 10px !important;
            top: -3px !important;
            right: -3px !important;
          }
        }

        @media (max-width: 480px) {
          .whatsapp-float-container {
            bottom: 16px !important;
            right: 16px !important;
          }

          .whatsapp-float-btn {
            width: 52px !important;
            height: 52px !important;
            box-shadow: 0 8px 20px rgba(37,211,102,0.35) !important;
          }

          .whatsapp-float-btn svg {
            width: 24px !important;
            height: 24px !important;
          }

          .whatsapp-float-badge {
            width: 18px !important;
            height: 18px !important;
            font-size: 9px !important;
            border: 1.5px solid white !important;
          }
        }
      `}</style>
    </>
  );
}