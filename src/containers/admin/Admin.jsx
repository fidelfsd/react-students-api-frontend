import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import userService from "../../_services/userService";
import { DataListTable, UsersList } from "../../components";
import { dateFormat } from "../../_utils/date";

export default function Admin() {
   //hooks
   const [users, setUsers] = useState([]);
   const [usersPage, setUsersPage] = useState(1);
   const [usersPages, setUsersPages] = useState(0);
   const [usersCount, setUsersCount] = useState(0);

   const navigate = useNavigate();
   const authState = useSelector((state) => state.auth);

   const isAdmin = authState.userInfo.role == "admin";

   useEffect(() => {
      if (isAdmin) {
         getAllUsers(authState.userToken, usersPage);
      } else {
         navigate("/");
      }
   }, [usersPage]);

   const handleUsersList = (e) => {
      const { page, userId } = e.currentTarget.dataset;
      handleUsersListPagination(page);
      handleSingleUser(userId);
   };

   const handleUsersListPagination = (page) => {
      console.log(page);
      switch (page) {
         case "next":
            return setUsersPage((page) => page + 1);
         case "prev":
            return setUsersPage((page) => page - 1);
      }
   };

   const handleSingleUser = (userId) => {
      //
      console.log(userId);
   };

   const getAllUsers = async (token, page) => {
      try {
         const response = await userService.getAllUsers(token, page);
         setUsers(response.results);
         setUsersCount(response.info.total_results);
         setUsersPages(response.info.total_pages);
      } catch (error) {
         console.log(error);
      }
   };

   const newUsers = (users) =>
      users.map((user) => {
         user.alumno = user?.alumno ? "YES" : "NO";
         user.role = user?.role ? user.role.role : "undefined";
         user.fecha_nacimiento = dateFormat(user.fecha_nacimiento);
         return user;
      });

   return (
      <>
         {isAdmin && (
            <>
               <h1>Admin panel</h1>
               <UsersList
                  users={users}
                  page={usersPage}
                  pages={usersPages}
                  count={usersCount}
                  onChange={handleUsersList}
               />

               <br />

               <DataListTable
                  data={newUsers(users)}
                  title="Doctors"
                  count={usersCount}
                  headers={[
                     "ID",
                     "Name",
                     "Last name",
                     "Email",
                     "Birthday",
                     "alumno",
                  ]}
                  attributes={[
                     "id",
                     "nombre",
                     "apellidos",
                     "email",
                     "fecha_nacimiento",
                     "alumno",
                  ]}
                  pagination={{
                     page: usersPage,
                     pages: usersPages,
                     count: usersCount,
                  }}
                  onChange={handleUsersList}
               />
            </>
         )}
      </>
   );
}
