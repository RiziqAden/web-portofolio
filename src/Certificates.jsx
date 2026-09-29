import React from "react";
import ScrollReveal from "./ScrollReveal"; // Memanggil komponen animasi

const getEmbeddablePdfLink = (url) => {
  if (!url) return "";
  if (url.includes("drive.google.com/file/d/")) {
    const match = url.match(/\/d\/([a-zA-Z0-9-_]+)/);
    if (match && match[1])
      return `https://drive.google.com/file/d/${match[1]}/preview`;
  }
  return url;
};

export default function Certificates({
  Header,
  Footer,
  certificates,
  cssAnimations,
}) {
  const isPdf = (url) =>
    url.toLowerCase().includes(".pdf") ||
    (url.includes("drive.google.com") && !url.includes("uc?export"));

  return (
    <div className="page-transition" style={{ fontFamily: "sans-serif" }}>
      <style>{cssAnimations}</style>
      <Header />

      {/* Lebar maksimal diperbesar menjadi 1200px agar layout 2 kolom lebih lega */}
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "2rem 2rem 4rem 2rem",
          minHeight: "80vh",
        }}
      >
        <ScrollReveal>
          <h1
            style={{
              fontSize: "3rem",
              color: "#333",
              textAlign: "center",
              marginBottom: "3rem",
            }}
          >
            Certificates
          </h1>
        </ScrollReveal>

        {/* MENGGUNAKAN CSS GRID UNTUK 2 KOLOM (Kiri & Kanan) */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))",
            gap: "2rem",
          }}
        >
          {certificates.map((cert) => (
            <ScrollReveal key={cert.id} style={{ height: "100%" }}>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  height: "100%",
                  border: "1px solid #eaeaea",
                  borderRadius: "12px",
                  padding: "2rem",
                  backgroundColor: "#fff",
                  boxShadow: "0 10px 30px rgba(0,0,0,0.05)",
                }}
              >
                <h2
                  style={{
                    fontSize: "1.6rem",
                    color: "#333",
                    marginBottom: "0.5rem",
                    textAlign: "center",
                  }}
                >
                  {cert.title}
                </h2>
                <p
                  style={{
                    fontSize: "1rem",
                    color: "#888",
                    marginBottom: "1.5rem",
                    textAlign: "center",
                    fontWeight: "500",
                    textTransform: "uppercase",
                    letterSpacing: "1px",
                  }}
                >
                  {cert.organizer}
                </p>

                {/* Area Konten Sertifikat (PDF/Gambar) */}
                <div
                  style={{
                    width: "100%",
                    flexGrow: 1,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  {isPdf(cert.file_url) ? (
                    <div
                      style={{
                        width: "100%",
                        height: "400px",
                        border: "1px solid #ccc",
                        borderRadius: "8px",
                        overflow: "hidden",
                      }}
                    >
                      <iframe
                        src={getEmbeddablePdfLink(cert.file_url)}
                        width="100%"
                        height="100%"
                        style={{ border: "none" }}
                        title={cert.title}
                      ></iframe>
                    </div>
                  ) : (
                    <img
                      className="img-hover"
                      src={cert.file_url}
                      alt={cert.title}
                      style={{
                        maxWidth: "100%",
                        maxHeight: "400px",
                        objectFit: "contain",
                        borderRadius: "8px",
                      }}
                    />
                  )}
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>

        {certificates.length === 0 && (
          <p style={{ textAlign: "center", color: "#888" }}>
            Belum ada sertifikat.
          </p>
        )}
      </div>
      <Footer />
    </div>
  );
}
