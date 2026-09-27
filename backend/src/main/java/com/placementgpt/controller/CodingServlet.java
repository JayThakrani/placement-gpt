package com.placementgpt.controller;

import com.placementgpt.util.DBConnection;
import com.google.gson.Gson;

import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@WebServlet("/api/coding/questions")
public class CodingServlet extends HttpServlet {

    private final Gson gson = new Gson();

    @Override
    protected void doGet(
            HttpServletRequest request,
            HttpServletResponse response) throws IOException {

        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");

        List<Map<String, Object>> questions = new ArrayList<>();

        String sql = """
                SELECT id, title, description, difficulty,
                       category, input_format, output_format,
                       sample_input, sample_output
                FROM coding_questions
                ORDER BY id
                """;

        try (
                Connection connection = DBConnection.getConnection();
                PreparedStatement statement =
                        connection.prepareStatement(sql);
                ResultSet resultSet = statement.executeQuery()
        ) {

            while (resultSet.next()) {

                Map<String, Object> question = new HashMap<>();

                question.put("id", resultSet.getInt("id"));
                question.put("title", resultSet.getString("title"));
                question.put(
                        "description",
                        resultSet.getString("description")
                );
                question.put(
                        "difficulty",
                        resultSet.getString("difficulty")
                );
                question.put(
                        "category",
                        resultSet.getString("category")
                );
                question.put(
                        "input_format",
                        resultSet.getString("input_format")
                );
                question.put(
                        "output_format",
                        resultSet.getString("output_format")
                );
                question.put(
                        "sample_input",
                        resultSet.getString("sample_input")
                );
                question.put(
                        "sample_output",
                        resultSet.getString("sample_output")
                );

                questions.add(question);
            }

            Map<String, Object> result = new HashMap<>();
            result.put("success", true);
            result.put("questions", questions);

            response.setStatus(HttpServletResponse.SC_OK);
            response.getWriter().write(gson.toJson(result));

        } catch (Exception exception) {

            exception.printStackTrace();

            Map<String, Object> result = new HashMap<>();

            result.put("success", false);
            result.put("message", "Unable to load coding questions.");

            response.setStatus(
                    HttpServletResponse.SC_INTERNAL_SERVER_ERROR
            );

            response.getWriter().write(gson.toJson(result));
        }
    }
}