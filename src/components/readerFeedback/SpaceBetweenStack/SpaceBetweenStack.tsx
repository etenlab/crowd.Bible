import { CSSProperties } from "react";
import styles from "./SpaceBetweenStack.module.css";

type SpaceBetweenStackProps = {
  firstComponent?: JSX.Element | null;
  lastComponent?: JSX.Element | null;
  className?: string;
  style?: CSSProperties;
};

export const SpaceBetweenStackGenerator =
  (direction: "row" | "column") =>
  ({
    firstComponent,
    lastComponent,
    className,
    style,
  }: SpaceBetweenStackProps) => {
    const directionStyle = direction === "row" ? styles.row : styles.column;
    return (
      <div
        className={`${styles.container} ${directionStyle} ${className}`}
        style={style}
      >
        {firstComponent}
        {lastComponent}
      </div>
    );
  };
