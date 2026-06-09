/**
 * core/interfaces/Button.ts
 *
 * Interfaces centralizadas para componentes de botones
 */

import type { ReactNode } from "react";

export interface IconProps {
  icon: string;
}

export interface ButtonProps {
  text: string;
  className?: string;
  icon?: IconProps;
  route?: string;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
}

export interface FormButtonProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
}
