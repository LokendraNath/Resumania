import { useState } from "react";
import { inputStyles as styles } from "../assets/dummystyle";
import { Eye, EyeOff } from "lucide-react";

export const Input = ({
  value,
  onChange,
  label,
  placeholder,
  type = "text",
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isFocesed, setIsFocesed] = useState(false);

  return (
    <div className={styles.wrapper}>
      {label && <label className={styles.label}>{label}</label>}
      <div className={styles.inputContainer(isFocesed)}>
        <input
          type={
            type === "password" ? (showPassword ? "text" : "password") : type
          }
          placeholder={placeholder}
          className={styles.inputField}
          value={value}
          onChange={onChange}
          onFocus={() => setIsFocesed(true)}
          onBlur={() => setIsFocesed(false)}
        />
        {type === "password" && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className={styles.toggleButton}
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        )}
      </div>
    </div>
  );
};
