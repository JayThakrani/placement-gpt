package com.placementgpt.controller;

import com.google.gson.Gson;
import com.placementgpt.util.DBConnection;

import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;

import java.io.IOException;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.util.HashMap;
import java.util.Map;

@WebServlet("/api/profile")
public class ProfileServlet extends HttpServlet {

    private final Gson gson = new Gson();

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");

        HttpSession session = request.getSession(false);
        if (session == null || session.getAttribute("userId") == null) {
            Map<String, Object> error = new HashMap<>();
            error.put("success", false);
            error.put("message", "Unauthorized. Please login.");
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.getWriter().write(gson.toJson(error));
            return;
        }

        int userId = (Integer) session.getAttribute("userId");
        String sql = "SELECT name, email, college, branch, semester, role FROM users WHERE id = ?";

        try (Connection conn = DBConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
             
            stmt.setInt(1, userId);
            try (ResultSet rs = stmt.executeQuery()) {
                if (rs.next()) {
                    Map<String, Object> userProfile = new HashMap<>();
                    userProfile.put("name", rs.getString("name"));
                    userProfile.put("email", rs.getString("email"));
                    userProfile.put("college", rs.getString("college"));
                    userProfile.put("branch", rs.getString("branch"));
                    userProfile.put("semester", rs.getInt("semester"));
                    userProfile.put("role", rs.getString("role"));

                    Map<String, Object> result = new HashMap<>();
                    result.put("success", true);
                    result.put("profile", userProfile);
                    response.setStatus(HttpServletResponse.SC_OK);
                    response.getWriter().write(gson.toJson(result));
                } else {
                    Map<String, Object> error = new HashMap<>();
                    error.put("success", false);
                    error.put("message", "User not found.");
                    response.setStatus(HttpServletResponse.SC_NOT_FOUND);
                    response.getWriter().write(gson.toJson(error));
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
            Map<String, Object> error = new HashMap<>();
            error.put("success", false);
            error.put("message", "Server error while fetching profile.");
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            response.getWriter().write(gson.toJson(error));
        }
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException {
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");

        HttpSession session = request.getSession(false);
        if (session == null || session.getAttribute("userId") == null) {
            Map<String, Object> error = new HashMap<>();
            error.put("success", false);
            error.put("message", "Unauthorized. Please login.");
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.getWriter().write(gson.toJson(error));
            return;
        }

        try {
            java.io.BufferedReader reader = request.getReader();
            StringBuilder json = new StringBuilder();
            String line;
            while ((line = reader.readLine()) != null) {
                json.append(line);
            }
            
            Map<String, Object> body = gson.fromJson(json.toString(), Map.class);
            String name = (String) body.get("name");
            String email = (String) body.get("email");
            String college = (String) body.get("college");
            String branch = (String) body.get("branch");
            
            int semester = 0;
            if (body.get("semester") != null) {
                if (body.get("semester") instanceof Double) {
                    semester = ((Double) body.get("semester")).intValue();
                } else if (body.get("semester") instanceof String) {
                    semester = Integer.parseInt((String) body.get("semester"));
                }
            }

            int userId = (Integer) session.getAttribute("userId");
            String sql = "UPDATE users SET name=?, email=?, college=?, branch=?, semester=? WHERE id=?";

            try (Connection conn = DBConnection.getConnection();
                 PreparedStatement stmt = conn.prepareStatement(sql)) {
                
                stmt.setString(1, name);
                stmt.setString(2, email);
                stmt.setString(3, college);
                stmt.setString(4, branch);
                stmt.setInt(5, semester);
                stmt.setInt(6, userId);
                
                int updated = stmt.executeUpdate();
                if (updated > 0) {
                    session.setAttribute("userName", name);
                    session.setAttribute("userEmail", email);
                    
                    Map<String, Object> result = new HashMap<>();
                    result.put("success", true);
                    result.put("message", "Profile updated successfully.");
                    response.setStatus(HttpServletResponse.SC_OK);
                    response.getWriter().write(gson.toJson(result));
                } else {
                    Map<String, Object> error = new HashMap<>();
                    error.put("success", false);
                    error.put("message", "Failed to update profile.");
                    response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
                    response.getWriter().write(gson.toJson(error));
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
            Map<String, Object> error = new HashMap<>();
            error.put("success", false);
            error.put("message", "Server error while updating profile.");
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            response.getWriter().write(gson.toJson(error));
        }
    }
}
