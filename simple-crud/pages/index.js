import React, { useEffect, useState } from "react";
import axios from "axios";
import UserCard from "@/components/UserCard";

const Home = () => {
  const server = "http://localhost:8080";
  
  // State para os inputs do formulário
  const [inputs, setInputs] = useState({
    name: "",
    email: "",
    password: "",
  });

  // State para a lista de usuários
  const [users, setUsers] = useState([]);

  // Função para buscar os usuários
  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${server}/users`);
      setUsers(response.data);
    } catch (error) {
      console.error("Erro ao buscar usuários:", error);
    }
  };

  // Efeito para buscar os usuários ao montar o componente
  useEffect(() => {
    fetchUsers();
  }, []);

  // Função para lidar com a submissão do formulário
  const handleSubmit = async (e) => {
    e.preventDefault();

    const user = {
      name: inputs.name,
      email: inputs.email,
      password: inputs.password,
    };

    try {
      await axios.post(`${server}/users`, user);
      
      // Limpar os campos de entrada após a adição
      setInputs({
        name: "",
        email: "",
        password: "",
      });

      // Atualizar a lista de usuários
      fetchUsers();
    } catch (error) {
      console.error("Erro ao adicionar usuário:", error);
    }
  };

  // Função para lidar com a exclusão de um usuário
  const handleDelete = async (userId) => {
    try {
      await axios.delete(`${server}/users/${userId}`);
      
      // Atualizar a lista de usuários após a exclusão
      fetchUsers();
    } catch (error) {
      console.error("Erro ao excluir usuário:", error);
    }
  };

  // Função para atualizar a lista de usuários (passada como prop para UserCard)
  const updateUserList = () => {
    fetchUsers();
  };

  return (
    <div>
      <div className="flex flex-col w-full h-180 items-center justify-center">
        <div className="flex w-280">
          <form onSubmit={handleSubmit}>
            <input
              className="w-full rounded-md border-2 border-gray-500 p-2 text-black"
              type="text"
              name="name"
              placeholder="Nome"
              value={inputs.name}
              onChange={(e) => setInputs({ ...inputs, name: e.target.value })}
            />
            <input
              className="w-full rounded-md border-2 border-gray-500 p-2 text-black"
              type="text"
              name="email"
              placeholder="E-mail"
              value={inputs.email}
              onChange={(e) => setInputs({ ...inputs, email: e.target.value })}
            />
            <input
              className="w-full rounded-md border-2 border-gray-500 p-2 text-black"
              type="password"
              name="password"
              placeholder="Senha"
              value={inputs.password}
              onChange={(e) =>
                setInputs({ ...inputs, password: e.target.value })
              }
            />
            <button className="bg-blue-500 text-white rounded-full py-2 px-4">
              Adicionar
            </button>
          </form>
        </div>
      </div>
      <div className="flex flex-col w-full h-180 items-center justify-center">
        {users.length > 0 ? (
          users.map((user) => (
            <UserCard
              key={user.ID}
              user={user}
              onDelete={handleDelete}
              onUpdate={updateUserList}
            />
          ))
        ) : (
          <div>Nenhum usuário encontrado</div>
        )}
      </div>
    </div>
  );
};

export default Home;