export const Card = ({ children, className = "" }) => {
  return (
    <div className={`weather-card ${className}`}>
      {children}
    </div>
  );
};

export const CardContent = ({ className = "", children }) => {
  return (
    <div className={`weather-card-content ${className}`}>
      {children}
    </div>
  );
};