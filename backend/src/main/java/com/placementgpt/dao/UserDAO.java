package com.placementgpt.dao;

import com.placementgpt.model.User;
import com.placementgpt.util.DBConnection;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.util.ArrayList;
import java.util.List;

public class UserDAO {

    // =========================
    // REGISTER USER
    // =========================

    public boolean registerUser(User user) {

        String sql = """
                INSERT INTO users
                (name, email, password, college, branch, semester, role)
                VALUES (?, ?, ?, ?, ?, ?, ?)
                """;

        try (Connection connection = DBConnection.getConnection();
             PreparedStatement statement =
                     connection.prepareStatement(sql)) {

            statement.setString(1, user.getName());
            statement.setString(2, user.getEmail());
            statement.setString(3, user.getPassword());
            statement.setString(4, user.getCollege());
            statement.setString(5, user.getBranch());
            statement.setInt(6, user.getSemester());
            statement.setString(7, user.getRole());

            int rowsInserted =
                    statement.executeUpdate();

            return rowsInserted > 0;

        } catch (Exception e) {

            e.printStackTrace();

            return false;
        }
    }


    // =========================
    // FIND USER BY EMAIL
    // =========================

    public User findByEmail(String email) {

        String sql =
                "SELECT * FROM users WHERE email = ?";

        try (Connection connection =
                     DBConnection.getConnection();
             PreparedStatement statement =
                     connection.prepareStatement(sql)) {

            statement.setString(1, email);

            ResultSet resultSet =
                    statement.executeQuery();

            if (resultSet.next()) {

                return mapUser(resultSet);
            }

        } catch (Exception e) {

            e.printStackTrace();
        }

        return null;
    }


    // =========================
    // GET ALL STUDENTS
    // =========================

    public List<User> getAllStudents() {

        List<User> students =
                new ArrayList<>();

        String sql = """
                SELECT *
                FROM users
                WHERE role = 'STUDENT'
                ORDER BY id DESC
                """;

        try (Connection connection =
                     DBConnection.getConnection();
             PreparedStatement statement =
                     connection.prepareStatement(sql);
             ResultSet resultSet =
                     statement.executeQuery()) {

            while (resultSet.next()) {

                students.add(
                        mapUser(resultSet)
                );
            }

        } catch (Exception e) {

            e.printStackTrace();
        }

        return students;
    }


    // =========================
    // MAP RESULTSET TO USER
    // =========================

    private User mapUser(ResultSet resultSet)
            throws Exception {

        User user = new User();

        user.setId(
                resultSet.getInt("id")
        );

        user.setName(
                resultSet.getString("name")
        );

        user.setEmail(
                resultSet.getString("email")
        );

        user.setPassword(
                resultSet.getString("password")
        );

        user.setCollege(
                resultSet.getString("college")
        );

        user.setBranch(
                resultSet.getString("branch")
        );

        user.setSemester(
                resultSet.getInt("semester")
        );

        user.setRole(
                resultSet.getString("role")
        );

        return user;
    }
}