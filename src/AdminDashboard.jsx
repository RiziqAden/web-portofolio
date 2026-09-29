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

  // State untuk menyimpan file foto (About Me & Projects)
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedProjectImage, setSelectedProjectImage] = useState(null);

  // --- HANDLER PROJECTS ---
  const handleProjectSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);

    let finalImgUrl = form.img_url;

    // Jika user memilih file baru untuk cover project
    if (selectedProjectImage) {
      const fileExt = selectedProjectImage.name.split(".").pop();
      const fileName = `project_${Date.now()}.${fileExt}`;

      const { data, error } = await supabase.storage
        .from("images")
        .upload(fileName, selectedProjectImage);

      if (error) {
        alert("Gagal upload gambar project. Error: " + error.message);
        setIsSaving(false);
        return;
      }

      const { data: publicUrlData } = supabase.storage
        .from("images")
        .getPublicUrl(fileName);
      finalImgUrl = publicUrlData.publicUrl;
    }

    const projectDataToSave = { ...form, img_url: finalImgUrl };

    if (isEditingProject) {
      await supabase
        .from("projects")
        .update(projectDataToSave)
        .eq("id", projectDataToSave.id);
      alert("Project berhasil diperbarui!");
    } else {
      const { id, ...newProject } = projectDataToSave;
      newProject.sort_order = projects.length;
      await supabase.from("projects").insert([newProject]);
      alert("Project baru berhasil ditambahkan!");
    }

    setForm(emptyProjForm);
    setSelectedProjectImage(null); // Reset file yang dipilih
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

  const handleMoveOrder = async (index, direction) => {
    const newProjects = [...projects];
    if (direction === "up" && index > 0) {
      [newProjects[index - 1], newProjects[index]] = [
        newProjects[index],
        newProjects[index - 1],
      ];
    } else if (direction === "down" && index < newProjects.length - 1) {
      [newProjects[index + 1], newProjects[index]] = [
        newProjects[index],
        newProjects[index + 1],
      ];
    } else {
      return;
    }

    setIsSaving(true);
    await Promise.all(
      newProjects.map((proj, i) =>
        supabase.from("projects").update({ sort_order: i }).eq("id", proj.id),
      ),
    );
    setIsSaving(false);
    fetchData();
  };

  // --- HANDLER CERTIFICATES ---
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
      newCert.sort_order = certificates.length;
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

  const handleMoveCertOrder = async (index, direction) => {
    const newCerts = [...certificates];
    if (direction === "up" && index > 0) {
      [newCerts[index - 1], newCerts[index]] = [
        newCerts[index],
        newCerts[index - 1],
      ];
    } else if (direction === "down" && index < newCerts.length - 1) {
      [newCerts[index + 1], newCerts[index]] = [
        newCerts[index],
        newCerts[index + 1],
      ];
    } else {
      return;
    }

    setIsSaving(true);
    await Promise.all(
      newCerts.map((cert, i) =>
        supabase
          .from("certificates")
          .update({ sort_order: i })
          .eq("id", cert.id),
      ),
    );
    setIsSaving(false);
    fetchData();
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

      {/* --- TAB KELOLA PROJECTS --- */}
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

            {/* AREA UPLOAD GAMBAR COVER (Baru) */}
            <div
              style={{
                border: "1px solid #ccc",
                padding: "1rem",
                backgroundColor: "#fff",
                borderRadius: "4px",
              }}
            >
              <label style={{ fontWeight: "bold" }}>
                Upload Gambar Cover Project:
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setSelectedProjectImage(e.target.files[0])}
                style={{ display: "block", marginTop: "0.5rem" }}
                required={!form.img_url} // Wajib diisi jika ini project baru / belum ada gambarnya
              />
              {form.img_url && !selectedProjectImage && (
                <p
                  style={{
                    fontSize: "0.85rem",
                    color: "#666",
                    marginTop: "0.5rem",
                  }}
                >
                  *Gambar cover saat ini sudah terpasang.
                </p>
              )}
            </div>

            <div
              style={{
                padding: "1rem",
                backgroundColor: "#fff",
                border: "1px solid #ddd",
                borderRadius: "4px",
              }}
            >
              <label
                style={{
                  display: "block",
                  marginBottom: "0.8rem",
                  fontWeight: "bold",
                }}
              >
                Warna Background Kiri (Area Gambar):
              </label>
              <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
                {colorOptions.map((color) => (
                  <label
                    key={"left-" + color.value}
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
                      checked={form.bg_color_left === color.value}
                      onChange={(e) =>
                        setForm({ ...form, bg_color_left: e.target.value })
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

            <div
              style={{
                padding: "1rem",
                backgroundColor: "#fff",
                border: "1px solid #ddd",
                borderRadius: "4px",
              }}
            >
              <label
                style={{
                  display: "block",
                  marginBottom: "0.8rem",
                  fontWeight: "bold",
                }}
              >
                Warna Background Kanan (Area Teks):
              </label>
              <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
                {colorOptions.map((color) => (
                  <label
                    key={"right-" + color.value}
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

            <input
              type="url"
              placeholder="Link Google Drive PDF (Jika Ada)"
              value={form.pdf_url || ""}
              onChange={(e) => setForm({ ...form, pdf_url: e.target.value })}
              style={{ padding: "0.8rem" }}
            />
            <input
              type="url"
              placeholder="Link Eksternal Project (Jika Ada)"
              value={form.link_url || ""}
              onChange={(e) => setForm({ ...form, link_url: e.target.value })}
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
                {isSaving ? "Menyimpan..." : "Simpan Project"}
              </button>
              {isEditingProject && (
                <button
                  type="button"
                  onClick={() => {
                    setForm(emptyProjForm);
                    setSelectedProjectImage(null);
                    setIsEditingProject(false);
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
                <th style={{ padding: "1rem" }}>Judul Project</th>
                <th style={{ padding: "1rem", width: "150px" }}>Ubah Urutan</th>
                <th style={{ padding: "1rem", width: "150px" }}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {projects.map((proj, index) => (
                <tr
                  key={proj.id}
                  style={{
                    borderBottom: "1px solid #ddd",
                    backgroundColor: isSaving ? "#f0f0f0" : "transparent",
                  }}
                >
                  <td style={{ padding: "1rem" }}>{proj.title}</td>
                  <td style={{ padding: "1rem" }}>
                    <button
                      onClick={() => handleMoveOrder(index, "up")}
                      disabled={index === 0 || isSaving}
                      style={{
                        marginRight: "0.5rem",
                        padding: "0.5rem 0.8rem",
                        cursor: index === 0 ? "not-allowed" : "pointer",
                        border: "1px solid #ccc",
                        background: "#fff",
                        borderRadius: "4px",
                      }}
                    >
                      ↑ Naik
                    </button>
                    <button
                      onClick={() => handleMoveOrder(index, "down")}
                      disabled={index === projects.length - 1 || isSaving}
                      style={{
                        padding: "0.5rem 0.8rem",
                        cursor:
                          index === projects.length - 1
                            ? "not-allowed"
                            : "pointer",
                        border: "1px solid #ccc",
                        background: "#fff",
                        borderRadius: "4px",
                      }}
                    >
                      ↓ Turun
                    </button>
                  </td>
                  <td style={{ padding: "1rem" }}>
                    <button
                      onClick={() => {
                        setForm(proj);
                        setSelectedProjectImage(null);
                        setIsEditingProject(true);
                      }}
                      style={{ marginRight: "0.5rem", padding: "0.5rem" }}
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

      {/* --- TAB KELOLA CERTIFICATES --- */}
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
                <th style={{ padding: "1rem", width: "150px" }}>Ubah Urutan</th>
                <th style={{ padding: "1rem", width: "150px" }}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {certificates.map((cert, index) => (
                <tr
                  key={cert.id}
                  style={{
                    borderBottom: "1px solid #ddd",
                    backgroundColor: isSaving ? "#f0f0f0" : "transparent",
                  }}
                >
                  <td style={{ padding: "1rem" }}>{cert.title}</td>
                  <td style={{ padding: "1rem" }}>
                    <button
                      onClick={() => handleMoveCertOrder(index, "up")}
                      disabled={index === 0 || isSaving}
                      style={{
                        marginRight: "0.5rem",
                        padding: "0.5rem 0.8rem",
                        cursor: index === 0 ? "not-allowed" : "pointer",
                        border: "1px solid #ccc",
                        background: "#fff",
                        borderRadius: "4px",
                      }}
                    >
                      ↑ Naik
                    </button>
                    <button
                      onClick={() => handleMoveCertOrder(index, "down")}
                      disabled={index === certificates.length - 1 || isSaving}
                      style={{
                        padding: "0.5rem 0.8rem",
                        cursor:
                          index === certificates.length - 1
                            ? "not-allowed"
                            : "pointer",
                        border: "1px solid #ccc",
                        background: "#fff",
                        borderRadius: "4px",
                      }}
                    >
                      ↓ Turun
                    </button>
                  </td>
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

      {/* --- TAB KELOLA ABOUT ME --- */}
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
