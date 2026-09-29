import React, { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

// KONFIGURASI SUPABASE (Memanggil dari file .env)
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const getEmbeddablePdfLink = (url) => {
  if (!url) return "";
  if (url.includes("drive.google.com/file/d/")) {
    const match = url.match(/\/d\/([a-zA-Z0-9-_]+)/);
    if (match && match[1])
      return `https://drive.google.com/file/d/${match[1]}/preview`;
  }
  return url;
};

const colorOptions = [
  { name: "Biru Pastel", value: "#e8f4f8" },
  { name: "Ungu Pastel", value: "#f3eef5" },
  { name: "Abu-abu Terang", value: "#eff2f5" },
  { name: "Krem (Charitize)", value: "#faebe1" },
  { name: "Hijau Pastel", value: "#eaf4e5" },
  { name: "Kuning Pastel", value: "#fff8e1" },
];

export default function App() {
  const [projects, setProjects] = useState([]);
  const [aboutData, setAboutData] = useState({
    name: "",
    photo_url: "",
    description: "",
    skills: "",
    contact: "",
  });
  const [currentHash, setCurrentHash] = useState(window.location.hash);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeProject, setActiveProject] = useState(null);
  const [loading, setLoading] = useState(true);

  // FUNGSI MENGAMBIL DATA DARI SUPABASE
  const fetchData = async () => {
    setLoading(true);
    // Ambil Projects
    const { data: projData } = await supabase
      .from("projects")
      .select("*")
      .order("id", { ascending: true });
    if (projData) setProjects(projData);

    // Ambil About Me
    const { data: aboutRes } = await supabase
      .from("about_me")
      .select("*")
      .eq("id", 1)
      .single();
    if (aboutRes) setAboutData(aboutRes);

    setLoading(false);
  };

  useEffect(() => {
    fetchData(); // Panggil data saat web pertama dibuka

    const handleHashChange = () => setCurrentHash(window.location.hash);
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
    </header>
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
                  src={proj.img_url}
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
                    marginBottom: "2rem",
                  }}
                >
                  {proj.description}
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
          {projects.length === 0 && (
            <p style={{ textAlign: "center", padding: "2rem" }}>
              Belum ada project yang ditambahkan.
            </p>
          )}
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
            </div>
          </div>
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
          {activeProject.link_url && activeProject.link_url !== "#" && (
            <a
              href={activeProject.link_url}
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
    );
  }

  // --- LOGIN ADMIN ---
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

  // --- DASHBOARD ADMIN ---
  if (currentHash === "#/admin" && isLoggedIn) {
    return (
      <AdminDashboard
        projects={projects}
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

// KOMPONEN ADMIN DATABASE
const AdminDashboard = ({ projects, fetchData, aboutData }) => {
  const emptyForm = {
    id: null,
    title: "",
    description: "",
    img_url: "",
    pdf_url: "",
    link_url: "",
    bg_color: colorOptions[0].value,
  };
  const [form, setForm] = useState(emptyForm);
  const [isEditingProject, setIsEditingProject] = useState(false);
  const [aboutForm, setAboutForm] = useState(aboutData);
  const [activeTab, setActiveTab] = useState("projects");
  const [isSaving, setIsSaving] = useState(false);

  // Simpan / Edit Project ke DB
  const handleProjectSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    if (isEditingProject) {
      await supabase.from("projects").update(form).eq("id", form.id);
      alert("Project berhasil diperbarui!");
    } else {
      const { id, ...newProject } = form; // Hapus ID agar digenerate otomatis oleh DB
      await supabase.from("projects").insert([newProject]);
      alert("Project baru berhasil ditambahkan!");
    }
    setForm(emptyForm);
    setIsEditingProject(false);
    setIsSaving(false);
    fetchData(); // Refresh data dari server
  };

  // Hapus Project dari DB
  const handleDelete = async (id) => {
    if (window.confirm("Yakin ingin menghapus project ini?")) {
      await supabase.from("projects").delete().eq("id", id);
      fetchData(); // Refresh data dari server
    }
  };

  // Update About Me ke DB
  const handleAboutSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    await supabase.from("about_me").update(aboutForm).eq("id", 1);
    alert("Halaman About Me berhasil diperbarui!");
    setIsSaving(false);
    fetchData(); // Refresh data
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
        <h2>Dashboard Admin (Terkoneksi Database)</h2>
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
            <h3>{isEditingProject ? "Edit Project" : "Tambah Project Baru"}</h3>
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
                style={{ padding: "0.8rem" }}
              />
              <input
                type="text"
                placeholder="Deskripsi Singkat"
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
                required
                style={{ padding: "0.8rem" }}
              />
              <input
                type="url"
                placeholder="URL Gambar Cover (JPG/PNG)"
                value={form.img_url}
                onChange={(e) => setForm({ ...form, img_url: e.target.value })}
                required
                style={{ padding: "0.8rem" }}
              />
              <input
                type="url"
                placeholder="Link Google Drive PDF"
                value={form.pdf_url || ""}
                onChange={(e) => setForm({ ...form, pdf_url: e.target.value })}
                style={{ padding: "0.8rem" }}
              />
              <input
                type="url"
                placeholder="Link Eksternal Project"
                value={form.link_url || ""}
                onChange={(e) => setForm({ ...form, link_url: e.target.value })}
                style={{ padding: "0.8rem" }}
              />

              <div>
                <label
                  style={{
                    display: "block",
                    marginBottom: "0.8rem",
                    fontWeight: "bold",
                  }}
                >
                  Warna Background:
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
                        value={color.value}
                        checked={form.bg_color === color.value}
                        onChange={(e) =>
                          setForm({ ...form, bg_color: e.target.value })
                        }
                      />
                      <span
                        style={{
                          width: "20px",
                          height: "20px",
                          backgroundColor: color.value,
                          border: "1px solid #ccc",
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
                  disabled={isSaving}
                  style={{
                    padding: "1rem 2rem",
                    backgroundColor: isSaving ? "#888" : "#333",
                    color: "#fff",
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  {isSaving
                    ? "Menyimpan..."
                    : isEditingProject
                      ? "Simpan Perubahan"
                      : "Upload Project"}
                </button>
                {isEditingProject && (
                  <button
                    type="button"
                    onClick={() => {
                      setForm(emptyForm);
                      setIsEditingProject(false);
                    }}
                    style={{ padding: "1rem 2rem", cursor: "pointer" }}
                  >
                    Batal
                  </button>
                )}
              </div>
            </form>
          </div>

          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#eee", textAlign: "left" }}>
                <th>Judul</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {projects.map((proj) => (
                <tr key={proj.id} style={{ borderBottom: "1px solid #ddd" }}>
                  <td style={{ padding: "1rem" }}>{proj.title}</td>
                  <td style={{ padding: "1rem" }}>
                    <button
                      onClick={() => {
                        setForm(proj);
                        setIsEditingProject(true);
                        window.scrollTo(0, 0);
                      }}
                      style={{ marginRight: "1rem", padding: "0.5rem" }}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(proj.id)}
                      style={{
                        padding: "0.5rem",
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
        <form
          onSubmit={handleAboutSubmit}
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "1.5rem",
            background: "#f9f9f9",
            padding: "2rem",
          }}
        >
          <label>
            Nama
            <input
              value={aboutForm.name}
              onChange={(e) =>
                setAboutForm({ ...aboutForm, name: e.target.value })
              }
              required
              style={{ padding: "0.8rem", width: "100%", marginTop: "0.5rem" }}
            />
          </label>
          <label>
            URL Foto
            <input
              value={aboutForm.photo_url}
              onChange={(e) =>
                setAboutForm({ ...aboutForm, photo_url: e.target.value })
              }
              required
              style={{ padding: "0.8rem", width: "100%", marginTop: "0.5rem" }}
            />
          </label>
          <label>
            Deskripsi
            <textarea
              value={aboutForm.description}
              onChange={(e) =>
                setAboutForm({ ...aboutForm, description: e.target.value })
              }
              required
              style={{
                padding: "0.8rem",
                width: "100%",
                marginTop: "0.5rem",
                height: "100px",
              }}
            />
          </label>
          <label>
            Skills
            <textarea
              value={aboutForm.skills}
              onChange={(e) =>
                setAboutForm({ ...aboutForm, skills: e.target.value })
              }
              required
              style={{
                padding: "0.8rem",
                width: "100%",
                marginTop: "0.5rem",
                height: "100px",
              }}
            />
          </label>
          <label>
            Contact
            <textarea
              value={aboutForm.contact}
              onChange={(e) =>
                setAboutForm({ ...aboutForm, contact: e.target.value })
              }
              required
              style={{
                padding: "0.8rem",
                width: "100%",
                marginTop: "0.5rem",
                height: "100px",
              }}
            />
          </label>
          <button
            type="submit"
            disabled={isSaving}
            style={{
              padding: "1rem",
              backgroundColor: isSaving ? "#888" : "#333",
              color: "#fff",
              border: "none",
              cursor: "pointer",
              width: "200px",
            }}
          >
            {isSaving ? "Menyimpan..." : "Simpan Halaman About"}
          </button>
        </form>
      )}
    </div>
  );
};
