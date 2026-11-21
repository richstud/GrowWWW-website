import { useState, useEffect } from "react";

interface AnimatedTextProps {
  text: string;
  className?: string;
  speed?: number;
}

export const AnimatedText = ({ text, className = "", speed = 100 }: AnimatedTextProps) => {
  const [displayText, setDisplayText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (!isDeleting) {
        // Typing forward
        if (index < text.length) {
          setDisplayText(text.substring(0, index + 1));
          setIndex(index + 1);
        } else {
          // Pause before deleting
          setTimeout(() => setIsDeleting(true), 2000);
        }
      } else {
        // Deleting backward
        if (index > 0) {
          setDisplayText(text.substring(0, index - 1));
          setIndex(index - 1);
        } else {
          // Pause before typing again
          setIsDeleting(false);
          setTimeout(() => setIndex(0), 500);
        }
      }
    }, isDeleting ? speed / 2 : speed);

    return () => clearTimeout(timeout);
  }, [index, isDeleting, text, speed]);

  return (
    <span className={className}>
      {displayText}
      <span className="animate-pulse">|</span>
    </span>
  );
};
