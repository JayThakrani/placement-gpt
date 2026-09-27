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

@WebServlet("/api/progress")
public class ProgressServlet extends HttpServlet {

    private final Gson gson = new Gson();

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");

        HttpSession session = request.getSession(false);
        if (session == null || session.getAttribute("userId") == null) {
            Map<String, Object> error = new HashMap<>();
            error.put("success", false);
            error.put("message", "Unauthorized. Please login first.");
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.getWriter().write(gson.toJson(error));
            return;
        }

        int userId = (int) session.getAttribute("userId");

        Map<String, Object> progressData = new HashMap<>();
        progressData.put("success", true);

        String testResultsSql = """
            SELECT COUNT(id) AS total_tests, 
                   SUM(score) AS total_score, 
                   SUM(total_questions) AS total_possible 
            FROM test_results WHERE user_id = ?
        """;
        
        String codingStatsSql = """
            SELECT COUNT(id) AS total_submissions
            FROM coding_submissions WHERE user_id = ? AND status = 'ACCEPTED'
        """;

        try (Connection conn = DBConnection.getConnection()) {
            
            // Aptitude Test Progress
            try (PreparedStatement stmt = conn.prepareStatement(testResultsSql)) {
                stmt.setInt(1, userId);
                try (ResultSet rs = stmt.executeQuery()) {
                    if (rs.next()) {
                        int totalTests = rs.getInt("total_tests");
                        int totalScore = rs.getInt("total_score");
                        int totalPossible = rs.getInt("total_possible");
                        
                        int percentage = (totalPossible > 0) ? (totalScore * 100 / totalPossible) : 0;
                        
                        progressData.put("aptitudeTestsCompleted", totalTests);
                        progressData.put("overallScorePercentage", percentage);
                    }
                }
            }

            // Coding Progress
            try (PreparedStatement stmt = conn.prepareStatement(codingStatsSql)) {
                stmt.setInt(1, userId);
                try (ResultSet rs = stmt.executeQuery()) {
                    if (rs.next()) {
                        progressData.put("codingProblemsSolved", rs.getInt("total_submissions"));
                    }
                }
            }

            response.setStatus(HttpServletResponse.SC_OK);
            response.getWriter().write(gson.toJson(progressData));

        } catch (Exception e) {
            e.printStackTrace();
            Map<String, Object> error = new HashMap<>();
            error.put("success", false);
            error.put("message", "Unable to fetch progress data.");
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            response.getWriter().write(gson.toJson(error));
        }
    }
}
