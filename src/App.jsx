import React, { useState, useEffect } from "react";

// Fungsi untuk konversi link Google Drive ke format preview
const getEmbeddablePdfLink = (url) => {
  if (!url) return "";
  if (url.includes("drive.google.com/file/d/")) {
    const match = url.match(/\/d\/([a-zA-Z0-9-_]+)/);
    if (match && match[1]) {
      return `https://drive.google.com/file/d/${match[1]}/preview`;
    }
  }
  return url;
};

// Pilihan Warna Pastel untuk Background Project
const colorOptions = [
  { name: "Biru Pastel (Seperti Gambar)", value: "#e8f4f8" },
  { name: "Ungu Pastel", value: "#f3eef5" },
  { name: "Abu-abu Terang", value: "#eff2f5" },
  { name: "Krem (Charitize)", value: "#faebe1" },
  { name: "Hijau Pastel (Houzz)", value: "#eaf4e5" },
  { name: "Kuning Pastel (Light Finder)", value: "#fff8e1" },
];

// Data Dummy Awal Projects
const initialProjects = [
  {
    id: 1,
    title: "CIRCLE",
    desc: "Smart Parental Controls",
    imgUrl:
      "https://images.unsplash.com/photo-1543269664-56d59c15923b?q=80&w=600&auto=format&fit=crop",
    pdfUrl: "",
    linkUrl: "https://circle.com",
    bgColor: "#e8f4f8",
  },
];

// Data Dummy Awal About Me
const initialAboutData = {
  name: "M Riziq Sirfatullah Alfarizi",
  photoUrl:
    "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=500&auto=format&fit=crop",
  description:
    "Halo! Saya adalah seorang UI/UX Designer yang berfokus pada kesederhanaan dan fungsi. Saya percaya bahwa desain yang baik adalah desain yang tidak hanya terlihat indah, tetapi juga memecahkan masalah pengguna dengan cara yang paling efisien.",
  skills: "Figma\nUI/UX Design\nPrototyping & Wireframing\nUser Research",
  contact: "Email: mrsa.ziq@contoh.com\nLinkedIn: linkedin.com/in/riziq",
};

export default function App() {
  const [projects, setProjects] = useState(initialProjects);
  const [aboutData, setAboutData] = useState(initialAboutData);
  const [currentHash, setCurrentHash] = useState(window.location.hash);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeProject, setActiveProject] = useState(null);

  useEffect(() => {
    const handleHashChange = () => setCurrentHash(window.location.hash);
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  // --- KOMPONEN NAVIGASI UTAMA ---
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
    </header>
  );

  // --- HALAMAN HOME ---
  if (currentHash === "" || currentHash === "#/") {
    return (
      <div style={{ fontFamily: "sans-serif", margin: 0, padding: 0 }}>
        <Header />

        <div
          style={{
            textAlign: "center",
            padding: "4rem 2rem",
            maxWidth: "800px",
            margin: "0 auto",
          }}
        >
          <p style={{ fontSize: "1.2rem", color: "#555", lineHeight: "1.6" }}>
            Hii, My name is Riziq. I’m a UI UX Designer with a love for
            simplicity.
          </p>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          {projects.map((proj) => (
            <div
              key={proj.id}
              style={{ display: "flex", width: "100%", minHeight: "400px" }}
            >
              <div
                style={{
                  width: "50%",
                  backgroundColor: "#f9f9f9",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  padding: "2rem",
                }}
              >
                <img
                  src={proj.imgUrl}
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
                  backgroundColor: proj.bgColor,
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
                    marginBottom: "2rem",
                  }}
                >
                  {proj.desc}
                </p>
                <button
                  onClick={() => {
                    setActiveProject(proj);
                    window.location.hash = `#/project/${proj.id}`;
                  }}
                  style={{
                    padding: "0.8rem 2rem",
                    backgroundColor: "transparent",
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
          ))}
        </div>
      </div>
    );
  }

  // --- HALAMAN ABOUT ME ---
  if (currentHash === "#/about") {
    return (
      <div style={{ fontFamily: "sans-serif", margin: 0, padding: 0 }}>
        <Header />

        <div
          style={{
            maxWidth: "900px",
            margin: "0 auto",
            padding: "2rem 2rem 6rem 2rem",
          }}
        >
          {/* Top: Nama dan Foto */}
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
            </div>
            <div
              style={{
                flex: 1,
                display: "flex",
                justifyContent: "flex-end",
                minWidth: "300px",
              }}
            >
              <img
                src={aboutData.photoUrl}
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
            </div>
          </div>

          {/* Deskripsi */}
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

          {/* Skills */}
          <div style={{ marginBottom: "4rem" }}>
            <h2
              style={{
                fontSize: "1.2rem",
                color: "#333",
                marginBottom: "1.5rem",
                borderBottom: "1px solid #ddd",
                paddingBottom: "0.5rem",
                letterSpacing: "1px",
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

          {/* Contact */}
          <div>
            <h2
              style={{
                fontSize: "1.2rem",
                color: "#333",
                marginBottom: "1.5rem",
                borderBottom: "1px solid #ddd",
                paddingBottom: "0.5rem",
                letterSpacing: "1px",
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
        </div>
      </div>
    );
  }

  // --- HALAMAN DETAIL PROJECT ---
  if (currentHash.startsWith("#/project/")) {
    if (!activeProject) {
      window.location.hash = "#/";
      return null;
    }
    return (
      <div style={{ fontFamily: "sans-serif", padding: "2rem 4rem" }}>
        <button
          onClick={() => (window.location.hash = "#/")}
          style={{
            marginBottom: "2rem",
            padding: "0.5rem 1rem",
            cursor: "pointer",
            background: "transparent",
            border: "1px solid #ccc",
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
          {activeProject.linkUrl && activeProject.linkUrl !== "#" && (
            <a
              href={activeProject.linkUrl}
              target="_blank"
              rel="noreferrer"
              style={{
                padding: "0.8rem 2rem",
                backgroundColor: "#333",
                color: "#fff",
                textDecoration: "none",
                borderRadius: "4px",
              }}
            >
              Kunjungi Web Project
            </a>
          )}
        </div>

        {activeProject.pdfUrl ? (
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
              src={getEmbeddablePdfLink(activeProject.pdfUrl)}
              width="100%"
              height="100%"
              allow="autoplay"
              style={{ border: "none" }}
              title={`PDF ${activeProject.title}`}
            >
              Browser Anda tidak mendukung iframe. Silakan unduh PDF secara
              manual.
            </iframe>
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
            Belum ada file PDF untuk project ini.
          </div>
        )}
      </div>
    );
  }

  // --- HALAMAN LOGIN ADMIN ---
  if (currentHash === "#/admin" && !isLoggedIn) {
    const handleLogin = (e) => {
      e.preventDefault();
      if (
        e.target.username.value === "mrsa.ziq" &&
        e.target.password.value === "portofolio/aden17!"
      ) {
        setIsLoggedIn(true);
      } else {
        alert("Username atau password salah!");
      }
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

  // --- HALAMAN DASHBOARD ADMIN (CRUD) ---
  if (currentHash === "#/admin" && isLoggedIn) {
    return (
      <AdminDashboard
        projects={projects}
        setProjects={setProjects}
        aboutData={aboutData}
        setAboutData={setAboutData}
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

// --- KOMPONEN ADMIN DASHBOARD ---
const AdminDashboard = ({ projects, setProjects, aboutData, setAboutData }) => {
  const emptyForm = {
    id: null,
    title: "",
    desc: "",
    imgUrl: "",
    pdfUrl: "",
    linkUrl: "",
    bgColor: colorOptions[0].value,
  };
  const [form, setForm] = useState(emptyForm);
  const [isEditingProject, setIsEditingProject] = useState(false);

  // State untuk form About Me
  const [aboutForm, setAboutForm] = useState(aboutData);
  const [activeTab, setActiveTab] = useState("projects"); // 'projects' atau 'about'

  // Handler Project
  const handleProjectSubmit = (e) => {
    e.preventDefault();
    if (isEditingProject) {
      setProjects(projects.map((p) => (p.id === form.id ? form : p)));
      alert("Project berhasil diperbarui!");
    } else {
      setProjects([...projects, { ...form, id: Date.now() }]);
      alert("Project baru berhasil ditambahkan!");
    }
    setForm(emptyForm);
    setIsEditingProject(false);
  };

  // Handler About Me
  const handleAboutSubmit = (e) => {
    e.preventDefault();
    setAboutData(aboutForm);
    alert("Halaman About Me berhasil diperbarui!");
  };

  return (
    <div
      style={{
        fontFamily: "sans-serif",
        padding: "2rem 4rem",
        maxWidth: "1000px",
        margin: "0 auto",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "1rem",
        }}
      >
        <h2>Dashboard Admin Panel</h2>
        <a
          href="#/"
          style={{
            textDecoration: "none",
            color: "#333",
            border: "1px solid #333",
            padding: "0.5rem 1rem",
          }}
        >
          &larr; Lihat Website
        </a>
      </div>

      {/* Tab Navigasi Admin */}
      <div
        style={{
          display: "flex",
          gap: "1rem",
          marginBottom: "2rem",
          borderBottom: "2px solid #eee",
          paddingBottom: "1rem",
        }}
      >
        <button
          onClick={() => setActiveTab("projects")}
          style={{
            padding: "0.5rem 1rem",
            cursor: "pointer",
            background: activeTab === "projects" ? "#333" : "transparent",
            color: activeTab === "projects" ? "#fff" : "#333",
            border: "1px solid #333",
          }}
        >
          Kelola Projects
        </button>
        <button
          onClick={() => setActiveTab("about")}
          style={{
            padding: "0.5rem 1rem",
            cursor: "pointer",
            background: activeTab === "about" ? "#333" : "transparent",
            color: activeTab === "about" ? "#fff" : "#333",
            border: "1px solid #333",
          }}
        >
          Kelola About Me
        </button>
      </div>

      {activeTab === "projects" && (
        <>
          <div
            style={{
              background: "#f9f9f9",
              padding: "2rem",
              borderRadius: "8px",
              marginBottom: "3rem",
              border: "1px solid #eee",
            }}
          >
            <h3 style={{ marginTop: 0 }}>
              {isEditingProject ? "Edit Project" : "Tambah Project Baru"}
            </h3>
            <form
              onSubmit={handleProjectSubmit}
              style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
            >
              <input
                type="text"
                placeholder="Judul Project"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                required
                style={{ padding: "0.8rem", border: "1px solid #ccc" }}
              />
              <input
                type="text"
                placeholder="Deskripsi Singkat"
                value={form.desc}
                onChange={(e) => setForm({ ...form, desc: e.target.value })}
                required
                style={{ padding: "0.8rem", border: "1px solid #ccc" }}
              />
              <input
                type="url"
                placeholder="URL Gambar Cover Kiri (JPG/PNG)"
                value={form.imgUrl}
                onChange={(e) => setForm({ ...form, imgUrl: e.target.value })}
                required
                style={{ padding: "0.8rem", border: "1px solid #ccc" }}
              />
              <input
                type="url"
                placeholder="Link Google Drive PDF"
                value={form.pdfUrl}
                onChange={(e) => setForm({ ...form, pdfUrl: e.target.value })}
                style={{ padding: "0.8rem", border: "1px solid #ccc" }}
              />
              <input
                type="url"
                placeholder="Link Eksternal Project (Opsional)"
                value={form.linkUrl}
                onChange={(e) => setForm({ ...form, linkUrl: e.target.value })}
                style={{ padding: "0.8rem", border: "1px solid #ccc" }}
              />

              <div>
                <label
                  style={{
                    display: "block",
                    marginBottom: "0.8rem",
                    fontWeight: "bold",
                  }}
                >
                  Pilih Warna Background Kanan:
                </label>
                <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
                  {colorOptions.map((color) => (
                    <label
                      key={color.value}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                        cursor: "pointer",
                      }}
                    >
                      <input
                        type="radio"
                        name="bgColor"
                        value={color.value}
                        checked={form.bgColor === color.value}
                        onChange={(e) =>
                          setForm({ ...form, bgColor: e.target.value })
                        }
                      />
                      <span
                        style={{
                          display: "inline-block",
                          width: "20px",
                          height: "20px",
                          backgroundColor: color.value,
                          border: "1px solid #ccc",
                          borderRadius: "4px",
                        }}
                      ></span>
                      {color.name}
                    </label>
                  ))}
                </div>
              </div>

              <div style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}>
                <button
                  type="submit"
                  style={{
                    padding: "1rem 2rem",
                    backgroundColor: "#333",
                    color: "#fff",
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  {isEditingProject ? "Simpan Perubahan" : "Upload Project"}
                </button>
                {isEditingProject && (
                  <button
                    type="button"
                    onClick={() => {
                      setForm(emptyForm);
                      setIsEditingProject(false);
                    }}
                    style={{
                      padding: "1rem 2rem",
                      backgroundColor: "#fff",
                      color: "#333",
                      border: "1px solid #333",
                      cursor: "pointer",
                    }}
                  >
                    Batal Edit
                  </button>
                )}
              </div>
            </form>
          </div>

          <h3>Daftar Project</h3>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              marginTop: "1rem",
            }}
          >
            <thead>
              <tr style={{ backgroundColor: "#f4f4f4", textAlign: "left" }}>
                <th style={{ padding: "1rem", borderBottom: "2px solid #ddd" }}>
                  Judul
                </th>
                <th style={{ padding: "1rem", borderBottom: "2px solid #ddd" }}>
                  Warna Tema
                </th>
                <th style={{ padding: "1rem", borderBottom: "2px solid #ddd" }}>
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody>
              {projects.map((proj) => (
                <tr key={proj.id} style={{ borderBottom: "1px solid #eee" }}>
                  <td style={{ padding: "1rem" }}>{proj.title}</td>
                  <td style={{ padding: "1rem" }}>
                    <span
                      style={{
                        display: "inline-block",
                        width: "15px",
                        height: "15px",
                        backgroundColor: proj.bgColor,
                        border: "1px solid #ccc",
                        marginRight: "8px",
                        borderRadius: "2px",
                      }}
                    ></span>
                    {proj.bgColor}
                  </td>
                  <td style={{ padding: "1rem" }}>
                    <button
                      onClick={() => {
                        setForm(proj);
                        setIsEditingProject(true);
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }}
                      style={{
                        marginRight: "1rem",
                        padding: "0.5rem 1rem",
                        cursor: "pointer",
                        backgroundColor: "#fff",
                        color: "#333",
                        border: "1px solid #ccc",
                      }}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => {
                        if (window.confirm("Hapus project ini?"))
                          setProjects(projects.filter((p) => p.id !== proj.id));
                      }}
                      style={{
                        padding: "0.5rem 1rem",
                        cursor: "pointer",
                        backgroundColor: "#ff4d4d",
                        color: "white",
                        border: "none",
                      }}
                    >
                      Hapus
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}

      {activeTab === "about" && (
        <div
          style={{
            background: "#f9f9f9",
            padding: "2rem",
            borderRadius: "8px",
            border: "1px solid #eee",
          }}
        >
          <h3 style={{ marginTop: 0 }}>Edit Halaman About Me</h3>
          <form
            onSubmit={handleAboutSubmit}
            style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.5rem",
              }}
            >
              <label style={{ fontWeight: "bold" }}>Nama</label>
              <input
                type="text"
                value={aboutForm.name}
                onChange={(e) =>
                  setAboutForm({ ...aboutForm, name: e.target.value })
                }
                required
                style={{ padding: "0.8rem", border: "1px solid #ccc" }}
              />
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.5rem",
              }}
            >
              <label style={{ fontWeight: "bold" }}>
                URL Foto Profil (Sisi Kanan)
              </label>
              <input
                type="url"
                value={aboutForm.photoUrl}
                onChange={(e) =>
                  setAboutForm({ ...aboutForm, photoUrl: e.target.value })
                }
                required
                style={{ padding: "0.8rem", border: "1px solid #ccc" }}
              />
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.5rem",
              }}
            >
              <label style={{ fontWeight: "bold" }}>Deskripsi Singkat</label>
              <textarea
                value={aboutForm.description}
                onChange={(e) =>
                  setAboutForm({ ...aboutForm, description: e.target.value })
                }
                required
                style={{
                  padding: "0.8rem",
                  border: "1px solid #ccc",
                  minHeight: "120px",
                  fontFamily: "inherit",
                }}
              />
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.5rem",
              }}
            >
              <label style={{ fontWeight: "bold" }}>
                Skills & Competencies (Gunakan Enter untuk baris baru)
              </label>
              <textarea
                value={aboutForm.skills}
                onChange={(e) =>
                  setAboutForm({ ...aboutForm, skills: e.target.value })
                }
                required
                style={{
                  padding: "0.8rem",
                  border: "1px solid #ccc",
                  minHeight: "100px",
                  fontFamily: "inherit",
                }}
              />
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.5rem",
              }}
            >
              <label style={{ fontWeight: "bold" }}>
                Contact Info (Gunakan Enter untuk baris baru)
              </label>
              <textarea
                value={aboutForm.contact}
                onChange={(e) =>
                  setAboutForm({ ...aboutForm, contact: e.target.value })
                }
                required
                style={{
                  padding: "0.8rem",
                  border: "1px solid #ccc",
                  minHeight: "100px",
                  fontFamily: "inherit",
                }}
              />
            </div>

            <button
              type="submit"
              style={{
                padding: "1rem 2rem",
                backgroundColor: "#333",
                color: "#fff",
                border: "none",
                cursor: "pointer",
                width: "fit-content",
              }}
            >
              Simpan Halaman About
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
