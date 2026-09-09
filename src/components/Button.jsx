const Button = ({
  children,
  className = "",
  disabled = false,
  ...props
}) => {
  return (
    <button
      className={`weather-button ${className}`}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;