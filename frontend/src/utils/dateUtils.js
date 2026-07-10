import { format, parseISO, parse } from "date-fns";
import { es } from "date-fns/locale";

// Convierte una fecha ISO del backend al formato yyyy-mm-dd que espera un input type="date"
export const toDateInputValue = (isoDate) => {
  if (!isoDate) return "";
  return format(parseISO(isoDate), "yyyy-MM-dd");
};

// Formatea una fecha ISO a formato legible dd/mm/yyyy
export const formatDate = (isoDate) => {
  if (!isoDate) return "";
  return format(parseISO(isoDate), "dd/MM/yyyy", { locale: es });
};

// Formatea una hora "HH:mm" a formato de 12 horas legible, ej: "09:00 AM"
export const formatTime = (time) => {
  if (!time) return "";
  return format(parse(time, "HH:mm", new Date()), "hh:mm a", { locale: es });
};

// Franjas horarias de 00:00 a 23:45 cada 15 minutos, para elegir la hora en un solo clic
export const TIME_OPTIONS = Array.from({ length: 96 }, (_, i) => {
  const hours = String(Math.floor(i / 4)).padStart(2, "0");
  const minutes = String((i % 4) * 15).padStart(2, "0");
  const value = `${hours}:${minutes}`;
  return { value, label: formatTime(value) };
});
