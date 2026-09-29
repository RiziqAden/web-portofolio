import React, { useState } from "react";
import { supabase } from "./supabase";

const colorOptions = [
  { name: "Putih (Netral)", value: "#ffffff" },
  { name: "Abu-abu Dasar", value: "#f9f9f9" },
  { name: "Biru Pastel", value: "#e8f4f8" },
  { name: "Ungu Pastel", value: "#f3eef5" },
  { name: "Abu-abu Terang", value: "#eff2f5" },
  { name: "Krem (Charitize)", value: "#faebe1" },
  { name: "Hijau Pastel", value: "#eaf4e5" },
  { name: "Kuning Pastel", value: "#fff8e1" },
  { name: "Biru Cerah", value: "#e3f2fd" },
  { name: "Biru Telur Asin", value: "#e0f2f1" },
  { name: "Merah Soft", value: "#ffebee" },
];

export default function AdminDashboard({
  projects,
  certificates,
  fetchData,
  aboutData,
}) {
  const emptyProjForm = {
    id: null,
    title: "",
    description: "",
    role: "",
    img_url: "",
    pdf_url: "",
    link_url: "",
    bg_color: colorOptions[0].value,
    bg_color_left: "#f9f9f9",
  };
  const emptyCertForm = { id: null, title: "", organizer: "", file_url: "" };

  const [form, setForm] = useState(emptyProjForm);
  const [certForm, setCertForm] = useState(emptyCertForm);
  const [aboutForm, setAboutForm] = useState(aboutData);

  const [isEditingProject, setIsEditingProject] = useState(false);
  const [isEditingCert, setIsEditingCert] = useState(false);

  const [activeTab, setActiveTab] = useState("projects");
  const [isSaving, setIsSaving] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  // --- HANDLER PROJECTS ---
  const handleProjectSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    if (isEditingProject) {
      await supabase.from("projects").update(form).eq("id", form.id);
      alert("Project berhasil diperbarui!");
    } else {
      const { id, ...newProject } = form;
      await supabase.from("projects").insert([newProject]);
      alert("Project baru berhasil ditambahkan!");
    }
    setForm(emptyProjForm);
    setIsEditingProject(false);
    setIsSaving(false);
    fetchData();
  };

  const handleDeleteProject = async (id) => {
    if (window.confirm("Yakin ingin menghapus project ini?")) {
      await supabase.from("projects").delete().eq("id", id);
      fetchData();
    }
  };

  // --- HANDLER CERTIFICATES (BARU) ---
  const handleCertSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    if (isEditingCert) {
      await supabase
        .from("certificates")
        .update(certForm)
        .eq("id", certForm.id);
      alert("Sertifikat berhasil diperbarui!");
    } else {
      const { id, ...newCert } = certForm;
      await supabase.from("certificates").insert([newCert]);
      alert("Sertifikat baru berhasil ditambahkan!");
    }
    setCertForm(emptyCertForm);
    setIsEditingCert(false);
    setIsSaving(false);
    fetchData();
  };

  const handleDeleteCert = async (id) => {
    if (window.confirm("Yakin ingin menghapus sertifikat ini?")) {
      await supabase.from("certificates").delete().eq("id", id);
      fetchData();
    }
  };

  // --- HANDLER ABOUT ME ---
  const handleAboutSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    let finalPhotoUrl = aboutForm.photo_url;
    if (selectedImage) {
      const fileExt = selectedImage.name.split(".").pop();
      const fileName = `profile_${Date.now()}.${fileExt}`;
      const { data, error } = await supabase.storage
        .from("images")
        .upload(fileName, selectedImage);
      if (error) {
        alert("Gagal upload gambar. Error: " + error.message);
        setIsSaving(false);
        return;
      }
      const { data: publicUrlData } = supabase.storage
        .from("images")
        .getPublicUrl(fileName);
      finalPhotoUrl = publicUrlData.publicUrl;
    }
    await supabase
      .from("about_me")
      .update({ ...aboutForm, photo_url: finalPhotoUrl })
      .eq("id", 1);
    alert("Halaman About Me berhasil diperbarui!");
    setSelectedImage(null);
    setIsSaving(false);
    fetchData();
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
        <button
          onClick={() => setActiveTab("certificates")}
          style={{
            padding: "0.5rem 1rem",
            cursor: "pointer",
            background: activeTab === "certificates" ? "#333" : "transparent",
            color: activeTab === "certificates" ? "#fff" : "#333",
            border: "1px solid #333",
          }}
        >
          Kelola Certificates
        </button>
      </div>

      {activeTab === "projects" && (
        <div
          style={{
            background: "#f9f9f9",
            padding: "2rem",
            borderRadius: "8px",
            border: "1px solid #eee",
          }}
        >
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
              type="text"
              placeholder="Role Project (Contoh: UI/UX Designer)"
              value={form.role || ""}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
              style={{ padding: "0.8rem" }}
            />
            <input
              type="url"
              placeholder="URL Gambar Cover (Atau Link Postimages.org)"
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
              {isSaving ? "Menyimpan..." : "Simpan Project"}
            </button>
          </form>
          <hr style={{ margin: "2rem 0" }} />
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#eee", textAlign: "left" }}>
                <th style={{ padding: "1rem" }}>Judul</th>
                <th style={{ padding: "1rem" }}>Aksi</th>
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
                      }}
                      style={{ marginRight: "1rem", padding: "0.5rem" }}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteProject(proj.id)}
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
        </div>
      )}

      {activeTab === "certificates" && (
        <div
          style={{
            background: "#f9f9f9",
            padding: "2rem",
            borderRadius: "8px",
            border: "1px solid #eee",
          }}
        >
          <h3>
            {isEditingCert ? "Edit Sertifikat" : "Tambah Sertifikat Baru"}
          </h3>
          <form
            onSubmit={handleCertSubmit}
            style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
          >
            <input
              type="text"
              placeholder="Nama Sertifikat"
              value={certForm.title}
              onChange={(e) =>
                setCertForm({ ...certForm, title: e.target.value })
              }
              required
              style={{ padding: "0.8rem" }}
            />
            <input
              type="text"
              placeholder="Penyelenggara (Contoh: Google, Dicoding)"
              value={certForm.organizer}
              onChange={(e) =>
                setCertForm({ ...certForm, organizer: e.target.value })
              }
              required
              style={{ padding: "0.8rem" }}
            />
            <input
              type="url"
              placeholder="Link File Sertifikat (Bisa link Drive PDF, Postimages, dll)"
              value={certForm.file_url}
              onChange={(e) =>
                setCertForm({ ...certForm, file_url: e.target.value })
              }
              required
              style={{ padding: "0.8rem" }}
            />

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
                  : isEditingCert
                    ? "Simpan Perubahan"
                    : "Upload Sertifikat"}
              </button>
              {isEditingCert && (
                <button
                  type="button"
                  onClick={() => {
                    setCertForm(emptyCertForm);
                    setIsEditingCert(false);
                  }}
                  style={{ padding: "1rem 2rem", cursor: "pointer" }}
                >
                  Batal
                </button>
              )}
            </div>
          </form>

          <hr style={{ margin: "2rem 0" }} />
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#eee", textAlign: "left" }}>
                <th style={{ padding: "1rem" }}>Nama Sertifikat</th>
                <th style={{ padding: "1rem" }}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {certificates.map((cert) => (
                <tr key={cert.id} style={{ borderBottom: "1px solid #ddd" }}>
                  <td style={{ padding: "1rem" }}>{cert.title}</td>
                  <td style={{ padding: "1rem" }}>
                    <button
                      onClick={() => {
                        setCertForm(cert);
                        setIsEditingCert(true);
                      }}
                      style={{ marginRight: "1rem", padding: "0.5rem" }}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteCert(cert.id)}
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
        </div>
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
            Nama Lengkap
            <input
              value={aboutForm.name}
              onChange={(e) =>
                setAboutForm({ ...aboutForm, name: e.target.value })
              }
              required
              style={{ padding: "0.8rem", width: "100%" }}
            />
          </label>
          <label>
            Nama Panggilan
            <input
              value={aboutForm.nickname || ""}
              onChange={(e) =>
                setAboutForm({ ...aboutForm, nickname: e.target.value })
              }
              required
              style={{ padding: "0.8rem", width: "100%" }}
            />
          </label>
          <label>
            Role / Posisi
            <input
              value={aboutForm.role || ""}
              onChange={(e) =>
                setAboutForm({ ...aboutForm, role: e.target.value })
              }
              required
              style={{ padding: "0.8rem", width: "100%" }}
            />
          </label>
          <div
            style={{
              border: "1px solid #ccc",
              padding: "1rem",
              backgroundColor: "#fff",
              borderRadius: "4px",
            }}
          >
            <label style={{ fontWeight: "bold" }}>
              Upload Foto Profil Baru (Opsional):
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setSelectedImage(e.target.files[0])}
              style={{ display: "block", marginTop: "0.5rem" }}
            />
          </div>
          <label>
            Deskripsi
            <textarea
              value={aboutForm.description}
              onChange={(e) =>
                setAboutForm({ ...aboutForm, description: e.target.value })
              }
              required
              style={{ padding: "0.8rem", width: "100%", height: "100px" }}
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
              style={{ padding: "0.8rem", width: "100%", height: "100px" }}
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
              style={{ padding: "0.8rem", width: "100%", height: "100px" }}
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
}
