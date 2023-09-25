import React, { useState } from "react";
import axios from "axios";

const UserCard = ({ user, onDelete, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState({ ...user });

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    // Reverte as alterações feitas no usuário em edição
    setEditedUser({ ...user });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    // Atualiza o objeto editedUser com as alterações feitas nos campos
    setEditedUser({ ...editedUser, [name]: value });
  };

  const handleSaveEdit = async () => {
    // Valide os dados do usuário editado
    if (!editedUser.name || !editedUser.email || !editedUser.password) {
      return;
    }

    try {
      // Envia uma solicitação PUT para atualizar o usuário no servidor
      await axios.put(`http://localhost:8080/users/${user.ID}`, editedUser);
      
      // Fecha o modo de edição
      setIsEditing(false);

      // Atualiza o componente com os dados editados
      setEditedUser({ ...user });

      // Chama a função onUpdate para atualizar a lista de usuários na página principal
      onUpdate();
    } catch (error) {
      console.error("Erro ao salvar as alterações:", error);
    }
  };

  const handleDelete = () => {
    // Chama a função onDelete para excluir o usuário
    onDelete(user.ID);
  };

  return (
    <div className="flex flex-col w-100 h-200 text-white m-1 bg-slate-500">
      {isEditing ? (
        <>
          <input
            className="text-black"
            type="text"
            name="name"
            value={editedUser.name}
            onChange={handleInputChange}
            placeholder="Nome"
          />
          <input
            className="text-black"
            type="text"
            name="email"
            value={editedUser.email}
            onChange={handleInputChange}
            placeholder="Email"
          />
          <input
            className="text-black"
            type="text"
            name="password"
            value={editedUser.password}
            onChange={handleInputChange}
            placeholder="Senha"
          />
          <button onClick={handleSaveEdit}>Salvar</button>
          <button onClick={handleCancelEdit}>Cancelar</button>
        </>
      ) : (
        <>
          <h2>Nome: {user.NAME}</h2>
          <p>Email: {user.EMAIL}</p>
          <p>Senha: {user.PASSWORD}</p>
          <button onClick={handleEdit}>Editar</button>
          <button onClick={handleDelete}>Deletar</button>
        </>
      )}
    </div>
  );
};

export default UserCard;