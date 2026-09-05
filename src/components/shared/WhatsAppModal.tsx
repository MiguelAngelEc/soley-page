"use client";

import { useState, useEffect, useId, useRef } from "react";
import { WhatsAppIcon, CloseIcon, ArrowIcon } from "@/components/shared/Icons";
import { LIMITS, cleanField, cleanMultiline, buildWhatsAppUrl, openWhatsApp } from "@/lib/form";
import { useDialogA11y } from "@/lib/a11y";
import type { Product } from "@/data/products";

interface WhatsAppModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedProduct?: Product | null;
  initialType?: "hogar" | "mayoreo";
}

interface FormData {
  queryType: string;
  clientType: "hogar" | "mayoreo";
  name: string;
  phone: string;
  product?: string;
  quantity?: string;
  company?: string;
  ruc?: string;
  industry?: string;
  monthlyVolume?: string;
  message?: string;
}

const queryOptions = [
  { id: "cotizar-hogar", label: "Cotizar para mi hogar", icon: "🏠", clientType: "hogar" as const },
  { id: "cotizar-mayoreo", label: "Cotizar al por mayor", icon: "🏢", clientType: "mayoreo" as const },
  { id: "info-producto", label: "Información de producto", icon: "📋", clientType: "hogar" as const },
  { id: "visita-comercial", label: "Agendar visita comercial", icon: "📅", clientType: "mayoreo" as const },
  { id: "disponibilidad", label: "Consultar disponibilidad", icon: "✅", clientType: "hogar" as const },
  { id: "otra-consulta", label: "Otra consulta", icon: "💬", clientType: "hogar" as const },
];

const industries = [
  "Hotel / Hostal",
  "Restaurante / Cafetería",
  "Clínica / Hospital",
  "Lavandería",
  "Oficina / Empresa",
  "Gimnasio / Spa",
  "Educación",
  "Comercio",
  "Otro"
];

export function WhatsAppModal({ isOpen, onClose, selectedProduct, initialType }: WhatsAppModalProps) {
  const initialForm = (): FormData => ({
    queryType: selectedProduct ? "info-producto" : "",
    clientType: initialType || "hogar",
    name: "",
    phone: "",
    product: selectedProduct?.name || "",
  });

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<FormData>(initialForm);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<{ name?: string; phone?: string }>({});

  const titleId = useId();
  const nameErrorId = useId();
  const phoneErrorId = useId();
  const nameId = useId();
  const phoneId = useId();
  const productId = useId();
  const quantityId = useId();
  const companyId = useId();
  const rucId = useId();
  const industryId = useId();
  const volumeId = useId();
  const messageId = useId();

  const containerRef = useRef<HTMLDivElement>(null);
  const nameInputRef = useRef<HTMLInputElement>(null);
  const phoneInputRef = useRef<HTMLInputElement>(null);

  useDialogA11y({ isOpen, onClose, containerRef });

  // Reinicia el formulario al abrirse, ajustando el estado durante el render en
  // lugar de dentro de un efecto (react-hooks/set-state-in-effect).
  const [wasOpen, setWasOpen] = useState(isOpen);
  if (isOpen !== wasOpen) {
    setWasOpen(isOpen);
    if (isOpen) {
      setStep(1);
      setFormData(initialForm());
      setError("");
      setFieldErrors({});
    }
  }

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const handleQuerySelect = (option: typeof queryOptions[0]) => {
    setFormData({ ...formData, queryType: option.id, clientType: option.clientType });
    setStep(2);
  };

  const generateMessage = () => {
    const selectedQuery = queryOptions.find(q => q.id === formData.queryType);
    const name = cleanField(formData.name, LIMITS.name);
    const phone = cleanField(formData.phone, LIMITS.phone);
    const company = cleanField(formData.company ?? "", LIMITS.company);
    const ruc = cleanField(formData.ruc ?? "", LIMITS.ruc);
    const product = cleanField(formData.product ?? "", LIMITS.product);
    const quantity = cleanField(formData.quantity ?? "", LIMITS.quantity);
    const monthlyVolume = cleanField(formData.monthlyVolume ?? "", LIMITS.quantity);
    const extra = cleanMultiline(formData.message ?? "", LIMITS.message);

    let message = `🔵 *${selectedQuery?.label.toUpperCase()}*\n\n`;

    message += `👤 *Nombre:* ${name}\n`;
    message += `📱 *Teléfono:* ${phone}\n`;

    if (formData.clientType === "mayoreo" && company) {
      message += `🏢 *Empresa:* ${company}\n`;
      if (ruc) message += `📄 *RUC:* ${ruc}\n`;
      if (formData.industry) message += `🏭 *Sector:* ${formData.industry}\n`;
    }

    if (product) {
      message += `\n📦 *Producto de interés:* ${product}\n`;
    }

    if (quantity) {
      message += `📊 *Cantidad estimada:* ${quantity}\n`;
    }

    if (formData.clientType === "mayoreo" && monthlyVolume) {
      message += `📈 *Volumen mensual estimado:* ${monthlyVolume}\n`;
    }

    if (extra) {
      message += `\n💬 *Mensaje adicional:*\n${extra}\n`;
    }

    message += `\n_Enviado desde soley-page.vercel.app_`;

    return { message, name, phone };
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const { message, name, phone } = generateMessage();

    const nextFieldErrors: { name?: string; phone?: string } = {};
    if (!name) nextFieldErrors.name = "Escribe tu nombre.";
    if (!phone) nextFieldErrors.phone = "Escribe tu teléfono.";

    if (nextFieldErrors.name || nextFieldErrors.phone) {
      setFieldErrors(nextFieldErrors);
      setError("");
      // Lleva el foco al primer campo con error, en el orden en que aparecen.
      (nextFieldErrors.name ? nameInputRef : phoneInputRef).current?.focus();
      return;
    }

    const { url, tooLong } = buildWhatsAppUrl("593961264102", message);
    if (tooLong) {
      setError("El mensaje es demasiado largo. Acorta el texto adicional.");
      return;
    }

    setFieldErrors({});
    setError("");
    openWhatsApp(url);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay open" onClick={onClose}>
      <div
        className="whatsapp-modal"
        onClick={(e) => e.stopPropagation()}
        ref={containerRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
      >
        <div className="whatsapp-modal-header">
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div className="whatsapp-icon-wrapper">
              <WhatsAppIcon width={24} height={24} />
            </div>
            <div>
              <h3 id={titleId} style={{ fontSize: 20, fontWeight: 700, color: "white", margin: 0 }}>
                Contactar por WhatsApp
              </h3>
              <p style={{ fontSize: 13, color: "rgba(255,255,255,0.9)", margin: "4px 0 0 0" }}>
                Respuesta en ~1 hora
              </p>
            </div>
          </div>
          <button onClick={onClose} className="modal-close-btn" aria-label="Cerrar">
            <CloseIcon width={16} height={16} />
          </button>
        </div>

        <div className="whatsapp-modal-body">
          {step === 1 && (
            <div className="query-selection">
              <h4 style={{ fontSize: 16, fontWeight: 700, marginBottom: 4 }}>
                ¿Cómo podemos ayudarte?
              </h4>
              <p style={{ fontSize: 14, color: "var(--muted)", marginBottom: 20 }}>
                Selecciona el tipo de consulta para brindarte mejor atención
              </p>

              <div className="query-options">
                {queryOptions.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => handleQuerySelect(option)}
                    className="query-option-btn"
                  >
                    <span className="query-icon">{option.icon}</span>
                    <span>{option.label}</span>
                    <ArrowIcon width={16} height={16} style={{ marginLeft: "auto", color: "var(--muted)" }} />
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 2 && (
            <form onSubmit={handleSubmit} className="whatsapp-form">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="back-btn"
              >
                ← Cambiar tipo de consulta
              </button>

              <div className="form-section">
                <h4 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>
                  Información básica
                </h4>

                <div className="form-grid">
                  <div className="form-field">
                    <label htmlFor={nameId}>Nombre *</label>
                    <input
                      id={nameId}
                      ref={nameInputRef}
                      type="text"
                      value={formData.name}
                      onChange={(e) => {
                        setFormData({ ...formData, name: e.target.value });
                        if (fieldErrors.name) setFieldErrors((f) => ({ ...f, name: undefined }));
                      }}
                      placeholder="Tu nombre"
                      maxLength={LIMITS.name}
                      autoComplete="name"
                      required
                      aria-invalid={!!fieldErrors.name}
                      aria-describedby={fieldErrors.name ? nameErrorId : undefined}
                    />
                    {fieldErrors.name && (
                      <p id={nameErrorId} role="alert" className="field-error">{fieldErrors.name}</p>
                    )}
                  </div>

                  <div className="form-field">
                    <label htmlFor={phoneId}>Teléfono *</label>
                    <input
                      id={phoneId}
                      ref={phoneInputRef}
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => {
                        setFormData({ ...formData, phone: e.target.value });
                        if (fieldErrors.phone) setFieldErrors((f) => ({ ...f, phone: undefined }));
                      }}
                      placeholder="+593..."
                      maxLength={LIMITS.phone}
                      inputMode="tel"
                      autoComplete="tel"
                      required
                      aria-invalid={!!fieldErrors.phone}
                      aria-describedby={fieldErrors.phone ? phoneErrorId : undefined}
                    />
                    {fieldErrors.phone && (
                      <p id={phoneErrorId} role="alert" className="field-error">{fieldErrors.phone}</p>
                    )}
                  </div>
                </div>

                {formData.queryType !== "otra-consulta" && (
                  <div className="form-field">
                    <label htmlFor={productId}>Producto de interés</label>
                    <input
                      id={productId}
                      type="text"
                      value={formData.product}
                      onChange={(e) => setFormData({ ...formData, product: e.target.value })}
                      placeholder="Ej: Detergente líquido, Cloro..."
                      maxLength={LIMITS.product}
                    />
                  </div>
                )}

                {(formData.queryType === "cotizar-hogar" || formData.queryType === "cotizar-mayoreo") && (
                  <div className="form-field">
                    <label htmlFor={quantityId}>Cantidad estimada</label>
                    <input
                      id={quantityId}
                      type="text"
                      value={formData.quantity}
                      onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                      placeholder={formData.clientType === "mayoreo" ? "Ej: 10 canecas" : "Ej: 2 galones"}
                      maxLength={LIMITS.quantity}
                    />
                  </div>
                )}
              </div>

              {formData.clientType === "mayoreo" && (
                <div className="form-section">
                  <h4 style={{ fontSize: 16, fontWeight: 700, marginBottom: 4 }}>
                    Información empresarial
                  </h4>
                  <p style={{ fontSize: 13, color: "var(--muted)", marginBottom: 16 }}>
                    Opcional - Nos ayuda a preparar una mejor propuesta
                  </p>

                  <div className="form-grid">
                    <div className="form-field">
                      <label htmlFor={companyId}>Empresa</label>
                      <input
                        id={companyId}
                        type="text"
                        value={formData.company}
                        onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                        placeholder="Nombre de la empresa"
                        maxLength={LIMITS.company}
                        autoComplete="organization"
                      />
                    </div>

                    <div className="form-field">
                      <label htmlFor={rucId}>RUC</label>
                      <input
                        id={rucId}
                        type="text"
                        value={formData.ruc}
                        onChange={(e) => setFormData({ ...formData, ruc: e.target.value })}
                        placeholder="RUC de la empresa"
                        maxLength={LIMITS.ruc}
                        inputMode="numeric"
                      />
                    </div>
                  </div>

                  <div className="form-grid">
                    <div className="form-field">
                      <label htmlFor={industryId}>Sector</label>
                      <select
                        id={industryId}
                        value={formData.industry}
                        onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                      >
                        <option value="">Seleccionar sector</option>
                        {industries.map((ind) => (
                          <option key={ind} value={ind}>{ind}</option>
                        ))}
                      </select>
                    </div>

                    <div className="form-field">
                      <label htmlFor={volumeId}>Volumen mensual</label>
                      <input
                        id={volumeId}
                        type="text"
                        value={formData.monthlyVolume}
                        onChange={(e) => setFormData({ ...formData, monthlyVolume: e.target.value })}
                        placeholder="Ej: 20 canecas/mes"
                        maxLength={LIMITS.quantity}
                      />
                    </div>
                  </div>
                </div>
              )}

              <div className="form-field">
                <label htmlFor={messageId}>Mensaje adicional</label>
                <textarea
                  id={messageId}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Detalles adicionales de tu consulta..."
                  rows={3}
                  maxLength={LIMITS.message}
                />
                <div style={{ fontSize: 11.5, color: "var(--muted)", textAlign: "right" }}>
                  {(formData.message ?? "").length} / {LIMITS.message}
                </div>
              </div>

              {error && (
                <p role="alert" style={{ fontSize: 13, fontWeight: 600, color: "#dc2626", margin: "12px 0 0 0" }}>
                  {error}
                </p>
              )}

              <button type="submit" className="submit-btn">
                <WhatsAppIcon width={18} height={18} />
                Enviar por WhatsApp
              </button>

              <p style={{ fontSize: 12, color: "var(--muted)", textAlign: "center", marginTop: 12 }}>
                Al enviar, se abrirá WhatsApp con tu mensaje listo para enviar
              </p>
            </form>
          )}
        </div>
      </div>

      <style jsx>{`
        .whatsapp-modal {
          background: white;
          border-radius: 24px;
          width: 90%;
          max-width: 540px;
          max-height: 85vh;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          box-shadow: 0 25px 60px rgba(0, 0, 0, 0.25);
        }

        .whatsapp-modal-header {
          background: linear-gradient(135deg, #25D366 0%, #128C7E 100%);
          padding: 24px 28px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .whatsapp-icon-wrapper {
          width: 48px;
          height: 48px;
          background: white;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #25D366;
        }

        .modal-close-btn {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.2);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          border: none;
          cursor: pointer;
          transition: background 0.2s;
        }

        .modal-close-btn:hover {
          background: rgba(255, 255, 255, 0.3);
        }

        .whatsapp-modal-body {
          padding: 28px;
          overflow-y: auto;
          flex: 1;
        }

        .query-selection {
          animation: fadeIn 0.3s ease;
        }

        .query-options {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .query-option-btn {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 16px 18px;
          background: white;
          border: 1.5px solid var(--border);
          border-radius: 12px;
          font-size: 14px;
          font-weight: 600;
          color: var(--ink);
          cursor: pointer;
          transition: all 0.2s;
          text-align: left;
        }

        .query-option-btn:hover {
          border-color: #25D366;
          background: #f0fdf4;
          transform: translateX(4px);
        }

        .query-icon {
          font-size: 20px;
          width: 32px;
          text-align: center;
        }

        .whatsapp-form {
          animation: fadeIn 0.3s ease;
        }

        .back-btn {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          padding: 8px 12px;
          margin-bottom: 20px;
          font-size: 13px;
          font-weight: 600;
          color: var(--muted);
          background: var(--bg-soft);
          border: none;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .back-btn:hover {
          background: var(--border);
          color: var(--ink);
        }

        .form-section {
          margin-bottom: 24px;
        }

        .form-section:last-child {
          margin-bottom: 0;
        }

        .form-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 14px;
        }

        .form-field {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .form-field label {
          font-size: 13px;
          font-weight: 600;
          color: var(--ink-2);
        }

        .form-field input,
        .form-field select,
        .form-field textarea {
          padding: 10px 14px;
          border: 1px solid var(--border);
          border-radius: 10px;
          font-size: 14px;
          background: white;
          transition: border-color 0.2s;
          outline: none;
        }

        .form-field textarea {
          resize: vertical;
          min-height: 80px;
        }

        .form-field input:focus,
        .form-field select:focus,
        .form-field textarea:focus {
          border-color: #25D366;
        }

        .form-field input[aria-invalid="true"] {
          border-color: #dc2626;
        }

        .field-error {
          margin: 6px 0 0 0;
          font-size: 12.5px;
          font-weight: 600;
          color: #dc2626;
          display: flex;
          align-items: center;
          gap: 5px;
        }

        .field-error::before {
          content: "⚠";
          font-size: 12px;
        }

        .submit-btn {
          width: 100%;
          padding: 14px 20px;
          margin-top: 20px;
          background: #25D366;
          color: white;
          border: none;
          border-radius: 12px;
          font-size: 15px;
          font-weight: 700;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .submit-btn:hover {
          background: #128C7E;
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(37, 211, 102, 0.3);
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @media (max-width: 640px) {
          .whatsapp-modal {
            width: 95%;
            max-height: 92vh;
            border-radius: 20px;
          }

          .whatsapp-modal-header {
            padding: 16px 20px;
          }

          .whatsapp-modal-body {
            padding: 16px 20px;
          }

          .form-grid {
            grid-template-columns: 1fr;
            gap: 12px;
          }

          .query-options {
            gap: 6px;
          }

          .query-option-btn {
            padding: 12px 14px;
            font-size: 13px;
            border-radius: 10px;
          }

          .query-icon {
            font-size: 18px;
            width: 28px;
          }

          .form-field input,
          .form-field select,
          .form-field textarea {
            padding: 10px 12px;
            font-size: 14px;
          }

          .submit-btn {
            padding: 12px 18px;
            font-size: 14px;
          }

          .back-btn {
            font-size: 12px;
            padding: 6px 10px;
          }

          .form-section {
            margin-bottom: 20px;
          }

          .whatsapp-icon-wrapper {
            width: 42px;
            height: 42px;
          }
        }

        @media (max-width: 480px) {
          .whatsapp-modal {
            width: 98%;
            max-height: 94vh;
            border-radius: 16px;
          }

          .whatsapp-modal-header {
            padding: 14px 16px;
          }

          .whatsapp-modal-header h3 {
            font-size: 18px;
          }

          .whatsapp-modal-body {
            padding: 12px 16px;
          }

          .query-option-btn {
            padding: 10px 12px;
            font-size: 12px;
          }

          .query-icon {
            font-size: 16px;
            width: 24px;
          }

          .form-field {
            gap: 4px;
          }

          .form-field label {
            font-size: 12px;
          }

          .form-field input,
          .form-field select,
          .form-field textarea {
            padding: 8px 10px;
            font-size: 13px;
            border-radius: 8px;
          }

          .submit-btn {
            padding: 10px 16px;
            font-size: 13px;
            border-radius: 10px;
          }

          .form-section h4 {
            font-size: 14px;
            margin-bottom: 12px;
          }

          .whatsapp-icon-wrapper {
            width: 38px;
            height: 38px;
          }
        }

        @media (max-width: 360px) {
          .whatsapp-modal {
            width: 100%;
            height: 100%;
            max-height: 100vh;
            border-radius: 0;
          }

          .whatsapp-modal-header {
            padding: 12px 16px;
          }

          .whatsapp-modal-body {
            padding: 10px 16px;
            flex: 1;
          }

          .query-selection h4 {
            font-size: 15px;
          }

          .query-selection p {
            font-size: 13px;
          }
        }
      `}</style>
    </div>
  );
}