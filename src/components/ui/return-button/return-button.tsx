import React from "react";
import styles from "./return-button.module.css";
import { ReturnIcon } from "../icons/return-icon";

interface ButtonProps extends React.HTMLProps<HTMLButtonElement> {
  type?: "button" | "submit" | "reset";
  extraClass?: string;
  isLoading: boolean;
}

export const ReturnButton: React.FC<ButtonProps> = ({
  extraClass = "",
  isLoading = false,
  ...rest
}) => {
  return (
    <button
      className={`${styles.button} ${extraClass} ${isLoading === true && styles.disabled}`}
      type="button"
      disabled={isLoading}
      {...rest}
    >
      <ReturnIcon />
      <p className="text text_type_button text_color_link ml-4">К оглавлению</p>
    </button>
  );
};
