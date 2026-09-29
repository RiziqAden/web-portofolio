import React, { useState, useEffect } from "react";
import { supabase } from "./supabase";
import Certificates from "./Certificates";
import AdminDashboard from "./AdminDashboard";
import ScrollReveal from "./ScrollReveal";

const cssAnimations = `
  @keyframes fadeIn { from { opacity: 0; transform: translateY(15px); } to { opacity: 1; transform: translateY(0); } }
  @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }
  .cursor-blink { animation: blink 1s step-end infinite; font-weight: 300; }
  .page-transition { animation: fadeIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
  .img-hover { transition: transform 0.4s ease, box-shadow 0.4s ease; }
  .img-hover:hover { transform: scale(1.05) translateY(-5px); box-shadow: 0 15px 35px rgba(0,0,0,0.15) !important; }
  .btn-hover { transition: all 0.2s ease; }
  .btn-hover:hover { background-color: #333 !important; color: #fff !important; }
  .btn-hover:active { transform: scale(0.95); }
  .footer-link { color: #666; text-decoration: none; transition: color 0.2s ease; font-weight: 500; }
  .footer-link:hover { color: #333; }
  .scroll-reveal { opacity: 0; transform: translateY(40px); transition: opacity 0.8s ease-out, transform 0.8s ease-out; }
  .scroll-reveal.is-visible { opacity: 1; transform: translateY(0); }
`;

const getEmbeddablePdfLink = (url) => {
  if (!url) return "";
  if (url.includes("drive.google.com/file/d/")) {
    const match = url.match(/\/d\/([a-zA-Z0-9-_]+)/);
    if (match && match[1])
      return `https://drive.google.com/file/d/${match[1]}/preview`;
  }
  return url;
};

const getDriveImageUrl = (url) => {
  if (!url) return "";
  if (url.includes("drive.google.com/file/d/")) {
    const match = url.match(/\/d\/([a-zA-Z0-9-_]+)/);
    if (match && match[1])
      return `https://drive.google.com/uc?export=view&id=${match[1]}`;
  }
  return url;
};

const Typewriter = ({ text }) => {
  const [displayedText, setDisplayedText] = useState("");
  useEffect(() => {
    setDisplayedText("");
    let i = 0;
    const timer = setInterval(() => {
      if (i < text.length) {
        setDisplayedText(text.substring(0, i + 1));
        i++;
      } else {
        clearInterval(timer);
      }
    }, 50);
    return () => clearInterval(timer);
  }, [text]);
  return (
    <span>
      {displayedText}
      <span className="cursor-blink">|</span>
    </span>
  );
};

export default function App() {
  const [projects, setProjects] = useState([]);
  const [certificates, setCertificates] = useState([]);
  const [aboutData, setAboutData] = useState({
    name: "",
    nickname: "Riziq",
    role: "UI UX Designer",
    photo_url: "",
    description: "",
    skills: "",
    contact: "",
  });

  const [currentHash, setCurrentHash] = useState(window.location.hash);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeProject, setActiveProject] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    const { data: projData } = await supabase
      .from("projects")
      .select("*")
      .order("sort_order", { ascending: true })
      .order("id", { ascending: true });
    if (projData) setProjects(projData);

    const { data: aboutRes } = await supabase
      .from("about_me")
      .select("*")
      .eq("id", 1)
      .single();
    if (aboutRes) setAboutData(aboutRes);

    // PERUBAHAN DI SINI: Sertifikat diurutkan berdasarkan sort_order
    const { data: certData } = await supabase
      .from("certificates")
      .select("*")
      .order("sort_order", { ascending: true })
      .order("id", { ascending: true });
    if (certData) setCertificates(certData);

    setLoading(false);
  };

  useEffect(() => {
    fetchData();
    const handleHashChange = () => {
      setCurrentHash(window.location.hash);
      window.scrollTo(0, 0);
    };
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  const Header = () => (
    <header
      style={{
        display: "flex",
        justifyContent: "flex-end",
        padding: "2rem 4rem",
        gap: "2rem",
        fontFamily: "sans-serif",
      }}
    >
      <a
        href="#/"
        style={{
          textDecoration: "none",
          color: currentHash === "" || currentHash === "#/" ? "#333" : "#888",
          fontWeight:
            currentHash === "" || currentHash === "#/" ? "bold" : "normal",
        }}
      >
        Home
      </a>
      <a
        href="#/about"
        style={{
          textDecoration: "none",
          color: currentHash === "#/about" ? "#333" : "#888",
          fontWeight: currentHash === "#/about" ? "bold" : "normal",
        }}
      >
        About Me
      </a>
      <a
        href="#/certificates"
        style={{
          textDecoration: "none",
          color: currentHash === "#/certificates" ? "#333" : "#888",
          fontWeight: currentHash === "#/certificates" ? "bold" : "normal",
        }}
      >
        Certificates
      </a>
    </header>
  );

  const Footer = () => (
    <footer
      style={{
        textAlign: "center",
        padding: "3rem 2rem",
        borderTop: "1px solid #eee",
        marginTop: "4rem",
        fontFamily: "sans-serif",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "2rem",
          marginBottom: "1rem",
          flexWrap: "wrap",
        }}
      >
        <a
          href="https://www.instagram.com/mrsa.ziq/"
          target="_blank"
          rel="noreferrer"
          className="footer-link"
        >
          Instagram
        </a>
        <a
          href="https://www.linkedin.com/in/m-riziq-sa"
          target="_blank"
          rel="noreferrer"
          className="footer-link"
        >
          LinkedIn
        </a>
        <a href="mailto:riziq.sirfatullah@gmail.com" className="footer-link">
          Email
        </a>
      </div>
      <p style={{ fontSize: "0.9rem", color: "#888" }}>
        © 2026 M Riziq Sirfatullah Alfarizi. All rights reserved.
      </p>
    </footer>
  );

  if (loading)
    return (
      <div
        style={{
          padding: "4rem",
          textAlign: "center",
          fontFamily: "sans-serif",
        }}
      >
        Memuat data dari Server...
      </div>
    );

  if (currentHash === "#/certificates")
    return (
      <Certificates
        Header={Header}
        Footer={Footer}
        certificates={certificates}
        cssAnimations={cssAnimations}
      />
    );

  if (currentHash === "" || currentHash === "#/") {
    const heroText = `Hii, My name is ${aboutData.nickname || "Riziq"}. I’m a ${aboutData.role || "UI UX Designer"} with a love for simplicity.`;
    return (
      <div
        className="page-transition"
        style={{ fontFamily: "sans-serif", margin: 0, padding: 0 }}
      >
        <style>{cssAnimations}</style>
        <Header />
        <div
          style={{
            textAlign: "center",
            padding: "4rem 2rem",
            maxWidth: "800px",
            margin: "0 auto",
            minHeight: "120px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <p
            style={{
              fontSize: "1.5rem",
              color: "#444",
              lineHeight: "1.6",
              fontWeight: "500",
              margin: 0,
            }}
          >
            <Typewriter text={heroText} />
          </p>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          {projects.map((proj) => (
            <ScrollReveal key={proj.id}>
              <div
                style={{ display: "flex", width: "100%", minHeight: "400px" }}
              >
                <div
                  style={{
                    width: "50%",
                    backgroundColor: proj.bg_color_left || "#f9f9f9",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    padding: "3rem",
                  }}
                >
                  <img
                    className="img-hover"
                    src={getDriveImageUrl(proj.img_url)}
                    alt={proj.title}
                    style={{
                      maxWidth: "80%",
                      maxHeight: "350px",
                      objectFit: "contain",
                      borderRadius: "12px",
                      boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
                    }}
                  />
                </div>
                <div
                  style={{
                    width: "50%",
                    backgroundColor: proj.bg_color,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    padding: "2rem",
                    textAlign: "center",
                  }}
                >
                  <h2
                    style={{
                      fontSize: "2rem",
                      color: "#333",
                      marginBottom: "0.5rem",
                    }}
                  >
                    {proj.title}
                  </h2>
                  <p
                    style={{
                      fontSize: "1.1rem",
                      color: "#666",
                      marginBottom: proj.role ? "0.5rem" : "2rem",
                    }}
                  >
                    {proj.description}
                  </p>
                  {proj.role && (
                    <p
                      style={{
                        fontSize: "0.9rem",
                        color: "#888",
                        fontWeight: "bold",
                        marginBottom: "2rem",
                        letterSpacing: "1px",
                        textTransform: "uppercase",
                      }}
                    >
                      Role: {proj.role}
                    </p>
                  )}
                  <button
                    className="btn-hover"
                    onClick={() => {
                      setActiveProject(proj);
                      window.location.hash = `#/project/${proj.id}`;
                    }}
                    style={{
                      padding: "0.8rem 2rem",
                      backgroundColor: "transparent",
                      color: "#333",
                      border: "1px solid #333",
                      cursor: "pointer",
                      fontSize: "0.9rem",
                      letterSpacing: "1px",
                    }}
                  >
                    READ MORE
                  </button>
                </div>
              </div>
            </ScrollReveal>
          ))}
          {projects.length === 0 && (
            <p style={{ textAlign: "center", padding: "2rem" }}>
              Belum ada project yang ditambahkan.
            </p>
          )}
        </div>
        <Footer />
      </div>
    );
  }

  if (currentHash === "#/about") {
    return (
      <div
        className="page-transition"
        style={{ fontFamily: "sans-serif", margin: 0, padding: 0 }}
      >
        <style>{cssAnimations}</style>
        <Header />
        <div
          style={{
            maxWidth: "900px",
            margin: "0 auto",
            padding: "2rem 2rem 4rem 2rem",
          }}
        >
          <ScrollReveal>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: "4rem",
                flexWrap: "wrap",
                gap: "2rem",
              }}
            >
              <div style={{ flex: 1, minWidth: "300px" }}>
                <h1
                  style={{
                    fontSize: "3.5rem",
                    color: "#333",
                    margin: 0,
                    lineHeight: "1.2",
                  }}
                >
                  {aboutData.name}
                </h1>
                <p
                  style={{
                    fontSize: "1.5rem",
                    color: "#666",
                    marginTop: "1rem",
                    fontWeight: "500",
                  }}
                >
                  {aboutData.role}
                </p>
              </div>
              <div
                style={{
                  flex: 1,
                  display: "flex",
                  justifyContent: "flex-end",
                  minWidth: "300px",
                }}
              >
                {aboutData.photo_url ? (
                  <img
                    className="img-hover"
                    src={aboutData.photo_url}
                    alt="Profile"
                    style={{
                      width: "100%",
                      maxWidth: "350px",
                      aspectRatio: "1/1",
                      objectFit: "cover",
                      borderRadius: "12px",
                      boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
                    }}
                  />
                ) : (
                  <div
                    style={{
                      width: "350px",
                      height: "350px",
                      background: "#eee",
                      borderRadius: "12px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    Foto belum diatur
                  </div>
                )}
              </div>
            </div>
          </ScrollReveal>
          <ScrollReveal>
            <div style={{ marginBottom: "4rem" }}>
              <p
                style={{
                  fontSize: "1.25rem",
                  color: "#555",
                  lineHeight: "1.8",
                  whiteSpace: "pre-line",
                }}
              >
                {aboutData.description}
              </p>
            </div>
          </ScrollReveal>
          <ScrollReveal>
            <div style={{ marginBottom: "4rem" }}>
              <h2
                style={{
                  fontSize: "1.2rem",
                  color: "#333",
                  marginBottom: "1.5rem",
                  borderBottom: "1px solid #ddd",
                  paddingBottom: "0.5rem",
                }}
              >
                SKILLS & COMPETENCIES
              </h2>
              <p
                style={{
                  fontSize: "1.1rem",
                  color: "#666",
                  lineHeight: "1.8",
                  whiteSpace: "pre-line",
                }}
              >
                {aboutData.skills}
              </p>
            </div>
          </ScrollReveal>
          <ScrollReveal>
            <div>
              <h2
                style={{
                  fontSize: "1.2rem",
                  color: "#333",
                  marginBottom: "1.5rem",
                  borderBottom: "1px solid #ddd",
                  paddingBottom: "0.5rem",
                }}
              >
                CONTACT
              </h2>
              <p
                style={{
                  fontSize: "1.1rem",
                  color: "#666",
                  lineHeight: "1.8",
                  whiteSpace: "pre-line",
                }}
              >
                {aboutData.contact}
              </p>
            </div>
          </ScrollReveal>
        </div>
        <Footer />
      </div>
    );
  }

  if (currentHash.startsWith("#/project/")) {
    if (!activeProject) {
      window.location.hash = "#/";
      return null;
    }
    return (
      <div className="page-transition" style={{ fontFamily: "sans-serif" }}>
        <style>{cssAnimations}</style>
        <div style={{ padding: "2rem 4rem", minHeight: "80vh" }}>
          <button
            className="btn-hover"
            onClick={() => (window.location.hash = "#/")}
            style={{
              marginBottom: "2rem",
              padding: "0.5rem 1rem",
              cursor: "pointer",
              background: "transparent",
              border: "1px solid #ccc",
              color: "#333",
            }}
          >
            &larr; Kembali ke Home
          </button>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "2rem",
            }}
          >
            <h1 style={{ color: "#333" }}>{activeProject.title}</h1>
            {activeProject.link_url && activeProject.link_url !== "#" && (
              <a
                href={activeProject.link_url}
                target="_blank"
                rel="noreferrer"
                className="btn-hover"
                style={{
                  padding: "0.8rem 2rem",
                  backgroundColor: "#333",
                  color: "#fff",
                  textDecoration: "none",
                  borderRadius: "4px",
                  border: "1px solid #333",
                }}
              >
                Kunjungi Web Project
              </a>
            )}
          </div>
          {activeProject.pdf_url ? (
            <div
              style={{
                width: "100%",
                height: "80vh",
                border: "1px solid #ccc",
                borderRadius: "8px",
                overflow: "hidden",
              }}
            >
              <iframe
                src={getEmbeddablePdfLink(activeProject.pdf_url)}
                width="100%"
                height="100%"
                allow="autoplay"
                style={{ border: "none" }}
                title={`PDF ${activeProject.title}`}
              ></iframe>
            </div>
          ) : (
            <div
              style={{
                padding: "4rem",
                textAlign: "center",
                background: "#f9f9f9",
                borderRadius: "8px",
                color: "#888",
              }}
            >
              Belum ada file PDF.
            </div>
          )}
        </div>
        <Footer />
      </div>
    );
  }

  if (currentHash === "#/admin" && !isLoggedIn) {
    const handleLogin = (e) => {
      e.preventDefault();
      if (
        e.target.username.value === "mrsa.ziq" &&
        e.target.password.value === "portofolio/aden17!"
      )
        setIsLoggedIn(true);
      else alert("Username atau password salah!");
    };
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          fontFamily: "sans-serif",
          backgroundColor: "#f4f4f4",
        }}
      >
        <form
          onSubmit={handleLogin}
          style={{
            background: "#fff",
            padding: "3rem",
            borderRadius: "8px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            display: "flex",
            flexDirection: "column",
            width: "300px",
          }}
        >
          <h2 style={{ textAlign: "center", marginBottom: "2rem" }}>
            Admin Login
          </h2>
          <label style={{ marginBottom: "0.5rem" }}>Username</label>
          <input
            name="username"
            type="text"
            required
            style={{
              marginBottom: "1.5rem",
              padding: "0.8rem",
              border: "1px solid #ccc",
            }}
          />
          <label style={{ marginBottom: "0.5rem" }}>Password</label>
          <input
            name="password"
            type="password"
            required
            style={{
              marginBottom: "2rem",
              padding: "0.8rem",
              border: "1px solid #ccc",
            }}
          />
          <button
            type="submit"
            style={{
              padding: "1rem",
              backgroundColor: "#333",
              color: "#fff",
              border: "none",
              cursor: "pointer",
            }}
          >
            Login
          </button>
        </form>
      </div>
    );
  }

  if (currentHash === "#/admin" && isLoggedIn) {
    return (
      <AdminDashboard
        projects={projects}
        certificates={certificates}
        fetchData={fetchData}
        aboutData={aboutData}
      />
    );
  }

  return (
    <div
      style={{ fontFamily: "sans-serif", padding: "4rem", textAlign: "center" }}
    >
      Halaman tidak ditemukan. <a href="#/">Kembali ke Home</a>
    </div>
  );
}
