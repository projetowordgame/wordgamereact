import React from "react";

const Sidebar = ({ setActiveTab, activeTab }) => {
  return (
    <div className="sidebar-panel">
      <button
        className={`sidebar-button-panel ${activeTab === "professores" ? "active" : ""}`}
        onClick={() => setActiveTab("professores")}
      >
        Professores
      </button>
      <button
        className={`sidebar-button-panel ${activeTab === "alunos" ? "active" : ""}`}
        onClick={() => setActiveTab("alunos")}
      >
        Alunos
      </button>

      <button
        className={`sidebar-button-panel ${activeTab === "ranking" ? "active" : ""}`}
        onClick={() => setActiveTab("ranking")}
    >
      Ranking
    </button>
    </div>
  );
};

export default Sidebar;
