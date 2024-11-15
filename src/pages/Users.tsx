import React, { useState, useEffect } from "react";
import { Space, Table, Typography } from "antd";
import type { TableProps } from "antd";
import axiosInstance from "../api/axiosInstance.ts";

const { Title } = Typography;

interface DataType {
  key: string;
  name: string;
  age: number;
  address: string;
}

const columns: TableProps<DataType>["columns"] = [
  {
    title: "Id",
    dataIndex: "id",
    key: "id",
  },
  {
    title: "Name",
    dataIndex: "name",
    key: "name",
  },
  {
    title: "Age",
    dataIndex: "age",
    key: "age",
  },
  {
    title: "Address",
    dataIndex: "address",
    key: "address",
  },
  {
    title: "Action",
    key: "action",
    render: (_, record) => (
      <Space size="middle">
        <a>Edit</a>
        <a>Delete</a>
      </Space>
    ),
  },
];

const Users: React.FC = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    axiosInstance
      .get("/users")
      .then(function ({ data }) {
        setUsers(data);
      })
      .catch(function (error) {
        console.log(error);
      });
  }, []);

  return (
    <>
      <Title>Users</Title>
      <Table<DataType> columns={columns} dataSource={users} />
    </>
  );
};

export default Users;
