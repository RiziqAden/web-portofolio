import React, { useState, useEffect, useRef } from "react";

export default function ScrollReveal({ children, style }) {
  const [isVisible, setIsVisible] = useState(false);
  const domRef = useRef();

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          // Jika elemen masuk ke dalam layar (viewport)
          if (entry.isIntersecting) {
            setIsVisible(true);
            // Hentikan pantauan agar animasi hanya berjalan satu kali saat pertama di-scroll
            observer.unobserve(domRef.current);
          }
        });
      },
      { threshold: 0.15 }, // Efek berjalan ketika 15% bagian elemen sudah terlihat di layar
    );

    const currentRef = domRef.current;
    if (currentRef) observer.observe(currentRef);

    return () => {
      if (currentRef) observer.unobserve(currentRef);
    };
  }, []);

  return (
    <div
      ref={domRef}
      className={`scroll-reveal ${isVisible ? "is-visible" : ""}`}
      style={style}
    >
      {children}
    </div>
  );
}
