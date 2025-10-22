interface PythonLogoProps {
  className?: string;
  size?: number;
}

export const PythonLogo = ({ className = "", size = 32 }: PythonLogoProps) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Top snake (primary color) */}
      <path
        d="M50 5C32 5 27 10 27 20V35H50V38H20C10 38 5 45 5 50C5 60 10 65 20 65H30V52C30 42 37 35 47 35H63C68 35 73 30 73 25V20C73 10 68 5 50 5ZM38 13C40.7614 13 43 15.2386 43 18C43 20.7614 40.7614 23 38 23C35.2386 23 33 20.7614 33 18C33 15.2386 35.2386 13 38 13Z"
        className="fill-primary"
      />
      
      {/* Bottom snake (secondary color) */}
      <path
        d="M50 95C68 95 73 90 73 80V65H50V62H80C90 62 95 55 95 50C95 40 90 35 80 35H70V48C70 58 63 65 53 65H37C32 65 27 70 27 75V80C27 90 32 95 50 95ZM62 87C59.2386 87 57 84.7614 57 82C57 79.2386 59.2386 77 62 77C64.7614 77 67 79.2386 67 82C67 84.7614 64.7614 87 62 87Z"
        className="fill-secondary"
      />
    </svg>
  );
};
