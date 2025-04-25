import React, { useState, useEffect } from "react";
import Sidebar from "./components/control-painel/Sidebar";
import DataGrid from "./components/control-painel/DataGrid";
import Swal from "sweetalert2";
import "./ControlPanel.css";
import Header from "./components/header/header";

const ControlPanel = () => {
  const [activeTab, setActiveTab] = useState("professores");
  const [professores, setProfessores] = useState([]);
  const [alunos, setAlunos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quizzes, setQuizzes] = useState([]);
  const [ranking, setRanking] = useState([]);
  const [selectedQuizId, setSelectedQuizId] = useState("");
  const [editUser, setEditUser] = useState(null);
  const [showPasswordFields, setShowPasswordFields] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [userRole, setUserRole] = useState("");

  const fetchRanking = async (quizId) => {
    try {
      const response = await fetch(`http://localhost:3000/quizzes/ranking/${quizId}`);
      const data = await response.json();
      setRanking(data);
    } catch (error) {
      console.error("Erro ao buscar ranking:", error);
    }
  };

  const fetchData = async () => {
    const token = localStorage.getItem("token");

    try {
      const userResponse = await fetch("http://localhost:3000/auth/profile", {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });

      const userData = await userResponse.json();
      const userId = userData.id;

      const [profResp, alunosResp, quizzesResp] = await Promise.all([
        fetch("http://localhost:3000/auth/teachers"),
        fetch("http://localhost:3000/auth/students"),
        fetch(`http://localhost:3000/quizzes/user/${userId}`),
      ]);

      const profData = await profResp.json();
      const alunosData = await alunosResp.json();
      const quizzesData = await quizzesResp.json();

      setProfessores(profData);
      setAlunos(alunosData);
      setQuizzes(quizzesData);
    } catch (error) {
      console.error("Erro ao buscar dados:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleNewUser = () => {
    setEditUser({ name: "", email: "" });
    setShowPasswordFields(false);
    setNewPassword("");
    setConfirmPassword("");
    setIsCreatingNew(true);
    setUserRole(activeTab === "professores" ? "professor" : "aluno");
  };

  const handleEditUser = (user) => {
    setEditUser(user);
    setShowPasswordFields(false);
    setNewPassword("");
    setConfirmPassword("");
    setIsCreatingNew(false);
    setUserRole(activeTab === "professores" ? "professor" : "aluno");
  };

  const handleSaveEdit = async () => {
    const payload = {
      name: editUser.name,
      email: editUser.email,
    };

    if ((isCreatingNew || showPasswordFields) && newPassword === confirmPassword) {
      payload.password = newPassword;
    }

    let url = "";
    let method = "";

    if (isCreatingNew) {
      if (!payload.password) {
        Swal.fire({
          icon: "warning",
          title: "Senha necessária",
          text: "Informe uma senha para o novo usuário.",
          customClass: {
            popup: 'swal-wide',
            confirmButton: 'swal-button'
          }
        });
        return;
      }

      payload.role = userRole;
      url = "http://localhost:3000/auth/register";
      method = "POST";
    } else {
      payload.id = editUser.id;
      url = "http://localhost:3000/auth/update";
      method = "PUT";
    }

    try {
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const err = await response.json();
        console.error("Erro ao salvar:", err);
        Swal.fire({
          icon: "error",
          title: "Erro ao salvar",
          text: err.message || "Ocorreu um erro ao tentar salvar o usuário.",
          customClass: {
            popup: 'swal-wide',
            confirmButton: 'swal-button'
          }
        });
        return;
      }

      await fetchData();
      setEditUser(null);
      setShowPasswordFields(false);
      setNewPassword("");
      setConfirmPassword("");
      setIsCreatingNew(false);
      setUserRole("");
      if (isCreatingNew) {
        Swal.fire({
          icon: "success",
          title: "Cadastro realizado com sucesso!",
          text: `O ${userRole === "professor" ? "professor" : "aluno"} foi cadastrado.`,
          customClass: {
            popup: 'swal-wide',
            confirmButton: 'swal-button'
          }
        });
      }
      
    } catch (err) {
      console.error("Erro de rede:", err);
      Swal.fire({
        icon: "error",
        title: "Erro de conexão",
        text: "Não foi possível conectar ao servidor.",
        customClass: {
          popup: 'swal-wide',
          confirmButton: 'swal-button'
        }
      });
    }
  };

  const dadosAtivos = activeTab === "professores" ? professores : alunos;

  return (
    <>
      <Header />
      <div className="dashboard-container-panel">
        <Sidebar
          setActiveTab={(tab) => {
            setActiveTab(tab);
            setEditUser(null);
            setShowPasswordFields(false);
          }}
          activeTab={activeTab}
        />
        <div className="main-content-panel">
          {loading ? (
            <p>Carregando dados...</p>
          ) : activeTab === "ranking" ? (
            <>
              <h2>Selecione um quiz para ver o ranking</h2>
              <select
                value={selectedQuizId}
                onChange={(e) => {
                  const id = e.target.value;
                  setSelectedQuizId(id);
                  fetchRanking(id);
                }}
              >
                <option value="">Selecione um quiz</option>
                {quizzes.map((quiz) => (
                  <option key={quiz.id} value={quiz.id}>
                    {quiz.title}
                  </option>
                ))}
              </select>
              {ranking.length > 0 && (
                <>
                  <h3>Ranking do quiz</h3>
                  <DataGrid
                    data={ranking}
                    columns={[
                      {
                        header: "Posição",
                        render: (_, idx) => `${idx + 1}º`, // Posição no ranking
                      },
                      { header: "Usuário", key: "userName" }, // Nome do usuário
                      { header: "Acertos", key: "correctAnswers" }, // Número de acertos
                      {
                        header: "Tempo",
                        key: "timeInSeconds",
                        render: (item) => {
                          // Formatação de tempo (minutos e segundos)
                          const mins = Math.floor(item.timeInSeconds / 60);
                          const secs = item.timeInSeconds % 60;
                          return `${mins}m ${secs < 10 ? "0" : ""}${secs}s`;
                        },
                      },
                    ]}
                  />
                </>
              )}
            </>
          ) : editUser ? (
            <div className="edit-form-panel">
              <h3>
                {isCreatingNew
                  ? `Cadastrando novo ${userRole}`
                  : `Editando ${editUser.name}`}
              </h3>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSaveEdit();
                }}
                autoComplete="off"
              >
                <label>
                  Nome:
                  <input
                    type="text"
                    value={editUser.name}
                    onChange={(e) =>
                      setEditUser({ ...editUser, name: e.target.value })
                    }
                  />
                </label>
                <label>
                  Email:
                  <input
                    type="email"
                    value={editUser.email}
                    onChange={(e) =>
                      setEditUser({ ...editUser, email: e.target.value })
                    }
                  />
                </label>

                {!isCreatingNew && !showPasswordFields && (
                  <button type="button" onClick={() => setShowPasswordFields(true)}>
                    Trocar senha
                  </button>
                )}

                {(isCreatingNew || showPasswordFields) && (
                  <>
                    <label>
                      Senha:
                      <input
                        autoComplete="new-password"
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                      />
                    </label>
                    <label>
                      Confirmar Senha:
                      <input
                        autoComplete="new-password"
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                      />
                    </label>
                  </>
                )}

                <div style={{ marginTop: "1rem" }}>
                  <button type="submit">Salvar</button>
                  <button
                    type="button"
                    style={{ marginLeft: "1rem" }}
                    onClick={() => setEditUser(null)}
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <>
              <div className="title-bar">
                <h2>
                  {activeTab === "professores"
                    ? "Lista de Professores"
                    : "Lista de Alunos"}
                </h2>
                <button className="new-button-panel" onClick={handleNewUser}>
                  Cadastrar Novo {activeTab === "professores" ? "Professor" : "Aluno"}
                </button>
              </div>
              <DataGrid
                data={dadosAtivos}
                columns={[
                  { header: "Nome", key: "name" },
                  { header: "Email", key: "email" },
                  {
                    header: "Ações",
                    render: (item) => (
                      <button
                        className="edit-button-panel"
                        onClick={() => handleEditUser(item)}
                      >
                        ✏️ Editar
                      </button>
                    ),
                  },
                ]}
              />
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default ControlPanel;
