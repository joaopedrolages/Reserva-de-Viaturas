import type { Viatura } from '../types';

export interface VehicleColor {
  background: string;
  border: string;
  completedBackground: string;
  dot: string;
  text: string;
}

export const VEHICLE_COLORS: VehicleColor[] = [
  {
    background: '#2563eb',
    border: '#1d4ed8',
    completedBackground: '#dbeafe',
    dot: '#2563eb',
    text: '#ffffff',
  },
  {
    background: '#059669',
    border: '#047857',
    completedBackground: '#d1fae5',
    dot: '#059669',
    text: '#ffffff',
  },
  {
    background: '#d97706',
    border: '#b45309',
    completedBackground: '#fef3c7',
    dot: '#d97706',
    text: '#ffffff',
  },
  {
    background: '#7c3aed',
    border: '#6d28d9',
    completedBackground: '#ede9fe',
    dot: '#7c3aed',
    text: '#ffffff',
  },
  {
    background: '#0891b2',
    border: '#0e7490',
    completedBackground: '#cffafe',
    dot: '#0891b2',
    text: '#ffffff',
  },
  {
    background: '#be123c',
    border: '#9f1239',
    completedBackground: '#ffe4e6',
    dot: '#be123c',
    text: '#ffffff',
  },
];

export function getVehicleColor(index: number) {
  return VEHICLE_COLORS[index % VEHICLE_COLORS.length];
}

export function getVehicleColorById(viaturas: Viatura[], idViatura: number) {
  const index = viaturas.findIndex((viatura) => viatura.ID === idViatura);
  return getVehicleColor(index >= 0 ? index : idViatura);
}
