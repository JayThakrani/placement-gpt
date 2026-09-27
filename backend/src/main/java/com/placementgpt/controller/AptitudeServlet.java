package com.placementgpt.controller;

import java.io.IOException;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.ResultSetMetaData;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import com.google.gson.Gson;
import com.placementgpt.util.DBConnection;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@WebServlet("/api/aptitude/questions")
public class AptitudeServlet extends HttpServlet {

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

        List<Map<String, Object>> questions = new ArrayList<>();

        String sql = "SELECT * FROM aptitude_questions LIMIT 20";

        try (Connection connection = DBConnection.getConnection();
             PreparedStatement statement =
                     connection.prepareStatement(sql);
             ResultSet resultSet = statement.executeQuery()) {

            ResultSetMetaData metadata =
                    resultSet.getMetaData();

            int columnCount =
                    metadata.getColumnCount();

            while (resultSet.next()) {

                Map<String, Object> question =
                        new LinkedHashMap<>();

                for (int i = 1; i <= columnCount; i++) {

                    String columnName =
                            metadata.getColumnName(i);

                    Object value =
                            resultSet.getObject(i);

                    question.put(columnName, value);
                }

                questions.add(question);
            }

            Map<String, Object> result =
                    new HashMap<>();

            result.put("success", true);
            result.put("questions", questions);

            response.setStatus(
                    HttpServletResponse.SC_OK
            );

            response.getWriter().write(
                    gson.toJson(result)
            );

        } catch (Exception e) {

            e.printStackTrace();

            Map<String, Object> error =
                    new HashMap<>();

            error.put("success", false);
            error.put(
                    "message",
                    "Unable to load aptitude questions."
            );

            response.setStatus(
                    HttpServletResponse.SC_INTERNAL_SERVER_ERROR
            );

            response.getWriter().write(
                    gson.toJson(error)
            );
        }
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");

        jakarta.servlet.http.HttpSession session = request.getSession(false);
        if (session == null || session.getAttribute("userId") == null) {
            Map<String, Object> error = new HashMap<>();
            error.put("success", false);
            error.put("message", "Unauthorized.");
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.getWriter().write(gson.toJson(error));
            return;
        }

        int userId = (int) session.getAttribute("userId");

        try {
            Map<String, Double> data = gson.fromJson(request.getReader(), Map.class);
            int score = data.get("score").intValue();
            int totalQuestions = data.get("total_questions").intValue();

            String sql = "INSERT INTO test_results (user_id, score, total_questions) VALUES (?, ?, ?)";

            try (Connection connection = DBConnection.getConnection();
                 PreparedStatement statement = connection.prepareStatement(sql)) {

                statement.setInt(1, userId);
                statement.setInt(2, score);
                statement.setInt(3, totalQuestions);

                statement.executeUpdate();
            }

            Map<String, Object> result = new HashMap<>();
            result.put("success", true);
            result.put("message", "Score saved successfully.");
            
            response.setStatus(HttpServletResponse.SC_OK);
            response.getWriter().write(gson.toJson(result));

        } catch (Exception e) {
            e.printStackTrace();
            Map<String, Object> error = new HashMap<>();
            error.put("success", false);
            error.put("message", "Unable to save test result.");
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            response.getWriter().write(gson.toJson(error));
        }
    }
}