package com.placementgpt.controller;

import com.google.gson.Gson;
import com.placementgpt.util.DBConnection;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.util.HashMap;
import java.util.Map;

@WebServlet("/api/admin/dashboard")
public class AdminDashboardServlet extends HttpServlet {

    private Gson gson;

    @Override
    public void init() throws ServletException {
        gson = new Gson();
    }

    @Override
    protected void doGet(HttpServletRequest request,
                         HttpServletResponse response)
            throws ServletException, IOException {

        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");

        Map<String, Object> dashboard = new HashMap<>();

        try (Connection connection = DBConnection.getConnection()) {

            dashboard.put("totalStudents",
                    getCount(connection,
                            "SELECT COUNT(*) FROM users WHERE role = 'STUDENT'"));

            dashboard.put("totalQuestions",
                    getCount(connection,
                            "SELECT COUNT(*) FROM aptitude_questions"));

            dashboard.put("testsCompleted",
                    getCount(connection,
                            "SELECT COUNT(*) FROM test_results"));

            dashboard.put("codingSubmissions",
                    getCount(connection,
                            "SELECT COUNT(*) FROM coding_submissions"));

            dashboard.put("success", true);

            response.setStatus(HttpServletResponse.SC_OK);
            response.getWriter().write(gson.toJson(dashboard));

        } catch (Exception e) {

            System.err.println("ADMIN DASHBOARD ERROR:");
            e.printStackTrace();

           dashboard.put("message",
        "Database error: " + e.getMessage());

            response.setStatus(
                    HttpServletResponse.SC_INTERNAL_SERVER_ERROR
            );

            response.getWriter().write(gson.toJson(dashboard));
        }
    }

    private int getCount(Connection connection, String sql)
            throws Exception {

        try (PreparedStatement statement =
                     connection.prepareStatement(sql);
             ResultSet resultSet =
                     statement.executeQuery()) {

            if (resultSet.next()) {
                return resultSet.getInt(1);
            }
        }

        return 0;
    }
}