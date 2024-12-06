import React, { useState, useEffect } from "react";
import { Space, Table, Typography, Button, Modal, Form, Input } from "antd";
import type { TableProps } from "antd";
import axiosInstance from "../api/axiosInstance.ts";

const { Title } = Typography;

interface DataType {
  key: string;
  id: string;
  name: string;
  age: number;
  address: string;
}

const Users: React.FC = () => {
  const [users, setUsers] = useState<DataType[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingUser, setEditingUser] = useState<DataType | null>(null);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const { data } = await axiosInstance.get("/users");
      setUsers(data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleAdd = () => {
    setIsEditMode(false);
    form.resetFields();
    setIsModalOpen(true);
  };

  const handleEdit = (record: DataType) => {
    setIsEditMode(true);
    setEditingUser(record);
    form.setFieldsValue(record);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await axiosInstance.delete(`/users/${id}`);
      setUsers((prev) => prev.filter((user) => user.id !== id));
    } catch (error) {
      console.log(error);
    }
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      if (isEditMode && editingUser) {
        // Edit user
        const updatedUser = { ...editingUser, ...values };
        await axiosInstance.put(`/users/${editingUser.id}`, updatedUser);
        setUsers((prev) =>
          prev.map((user) => (user.id === editingUser.id ? updatedUser : user)),
        );
      } else {
        // Add user
        const newUser = await axiosInstance.post("/users", values);
        setUsers((prev) => [...prev, newUser.data]);
      }
      setIsModalOpen(false);
      form.resetFields();
    } catch (error) {
      console.log(error);
    }
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    form.resetFields();
  };

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
          <a onClick={() => handleEdit(record)}>Edit</a>
          <a onClick={() => handleDelete(record.id)}>Delete</a>
        </Space>
      ),
    },
  ];

  return (
    <>
      <Title>Users</Title>
      <Button type="primary" onClick={handleAdd} style={{ marginBottom: 16 }}>
        Add User
      </Button>
      <Table<DataType> columns={columns} dataSource={users} rowKey="id" />
      <Modal
        title={isEditMode ? "Edit User" : "Add User"}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="name"
            label="Name"
            rules={[{ required: true, message: "Please enter the name" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="age"
            label="Age"
            rules={[{ required: true, message: "Please enter the age" }]}
          >
            <Input type="number" />
          </Form.Item>
          <Form.Item
            name="address"
            label="Address"
            rules={[{ required: true, message: "Please enter the address" }]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default Users;
