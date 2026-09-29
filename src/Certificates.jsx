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
      <div
        style={{
          maxWidth: "900px",
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

        <div style={{ display: "flex", flexDirection: "column", gap: "4rem" }}>
          {certificates.map((cert) => (
            <ScrollReveal key={cert.id}>
              <div
                style={{
                  border: "1px solid #eaeaea",
                  borderRadius: "12px",
                  padding: "2rem",
                  backgroundColor: "#fff",
                  boxShadow: "0 10px 30px rgba(0,0,0,0.05)",
                }}
              >
                <h2
                  style={{
                    fontSize: "1.8rem",
                    color: "#333",
                    marginBottom: "0.5rem",
                    textAlign: "center",
                  }}
                >
                  {cert.title}
                </h2>
                <p
                  style={{
                    fontSize: "1.1rem",
                    color: "#888",
                    marginBottom: "2rem",
                    textAlign: "center",
                    fontWeight: "500",
                    textTransform: "uppercase",
                    letterSpacing: "1px",
                  }}
                >
                  Penyelenggara: {cert.organizer}
                </p>

                <div
                  style={{
                    width: "100%",
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  {isPdf(cert.file_url) ? (
                    <div
                      style={{
                        width: "100%",
                        height: "70vh",
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
                        maxHeight: "70vh",
                        objectFit: "contain",
                        borderRadius: "8px",
                      }}
                    />
                  )}
                </div>
              </div>
            </ScrollReveal>
          ))}
          {certificates.length === 0 && (
            <p style={{ textAlign: "center", color: "#888" }}>
              Belum ada sertifikat.
            </p>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}
