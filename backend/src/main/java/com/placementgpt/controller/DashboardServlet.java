package com.placementgpt.controller;

import java.io.IOException;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.util.HashMap;
import java.util.Map;

import com.google.gson.Gson;
import com.placementgpt.util.DBConnection;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;

@WebServlet("/api/dashboard")
public class DashboardServlet extends HttpServlet {

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

        HttpSession session = request.getSession(false);

        if (session == null ||
            session.getAttribute("userId") == null) {

            sendError(
                    response,
                    HttpServletResponse.SC_UNAUTHORIZED,
                    "Please login first."
            );

            return;
        }

        int userId = (int) session.getAttribute("userId");

        Map<String, Object> dashboard = new HashMap<>();

        String sql = """
                SELECT
                    (SELECT COUNT(*) FROM aptitude_questions) AS totalQuestions,
                    (SELECT COUNT(*) FROM test_results WHERE user_id = ?) AS testsCompleted,
                    (SELECT COUNT(*) FROM coding_submissions WHERE user_id = ?) AS codingSubmissions
                """;

        try (Connection connection = DBConnection.getConnection();
             PreparedStatement statement = connection.prepareStatement(sql)) {

            statement.setInt(1, userId);
            statement.setInt(2, userId);

            try (ResultSet resultSet = statement.executeQuery()) {

                if (resultSet.next()) {

                    dashboard.put(
                            "totalQuestions",
                            resultSet.getInt("totalQuestions")
                    );

                    dashboard.put(
                            "testsCompleted",
                            resultSet.getInt("testsCompleted")
                    );

                    dashboard.put(
                            "codingSubmissions",
                            resultSet.getInt("codingSubmissions")
                    );
                }
            }

            dashboard.put("success", true);
            dashboard.put(
                    "name",
                    session.getAttribute("userName")
            );

            response.setStatus(HttpServletResponse.SC_OK);

            response.getWriter().write(
                    gson.toJson(dashboard)
            );

        } catch (Exception e) {

            e.printStackTrace();

            sendError(
                    response,
                    HttpServletResponse.SC_INTERNAL_SERVER_ERROR,
                    "Unable to load dashboard data."
            );
        }
    }

    private void sendError(HttpServletResponse response,
                           int status,
                           String message)
            throws IOException {

        Map<String, Object> error = new HashMap<>();

        error.put("success", false);
        error.put("message", message);

        response.setStatus(status);

        response.getWriter().write(
                gson.toJson(error)
        );
    }
}