export interface CoverageItem {
  type: string;
  title: string;
  rule: string;
  detail: string;
  highlight: string;
  icon: string;
  bullets?: string[];
}

export const COVERAGES: CoverageItem[] = [
  {
    type: "medical",
    title: "Asistencia médica (cobertura principal)",
    rule: "Cobertura completa sin pago directo (con coordinación previa)",
    detail: "Incluye atención integral por enfermedad o accidente:",
    highlight: "Cobertura Completa",
    icon: "M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z",
    bullets: [
      "Atención médica en consultorio o domicilio",
      "Consultas con especialistas",
      "Estudios y exámenes complementarios",
      "Internaciones clínicas y quirúrgicas",
      "Cirugías",
      "Terapia intensiva y unidad coronaria",
    ],
  },
  {
    type: "transfer",
    title: "Traslados muy amplios",
    rule: "Logística y cuidado en tránsito",
    detail:
      "Incluye traslados sanitarios, derivaciones, y casos complejos incluyendo acompañamiento de familiares y traslados por fallecimiento.",
    highlight: "Incluye Familiares",
    icon: "M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4",
  },
  {
    type: "dental",
    title: "Odontología",
    rule: "Exclusivo para urgencias",
    detail:
      "Atención odontológica garantizada solo para urgencias (dolor agudo, infección o trauma) que impidan continuar el viaje.",
    highlight: "Urgencias",
    icon: "M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
  },
  {
    type: "medication",
    title: "Medicamentos",
    rule: "El usuario abona y luego reclama",
    detail:
      "Presentá la receta y factura de farmacia y te reintegramos solo el 30% del gasto aprobado. Proceso rápido.",
    highlight: "30% de reintegro",
    icon: "M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z",
  },
  {
    type: "baggage",
    title: "Equipaje",
    rule: "Pérdida total por la aerolínea",
    detail:
      "Indemnización de hasta USD 1.200 por evento en casos de pérdida definitiva del equipaje despachado.",
    highlight: "Hasta USD 1.200",
    icon: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z",
  },
];
