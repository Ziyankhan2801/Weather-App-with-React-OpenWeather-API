const Input = ({ className = "", ...props }) => {
  return (
    <input
      className={`weather-input ${className}`}
      {...props}
    />
  );
};

export default Input;