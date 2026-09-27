package com.placementgpt.controller;

import java.io.BufferedReader;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

import com.google.gson.Gson;
import com.placementgpt.model.User;
import com.placementgpt.service.UserService;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;

@WebServlet("/api/login")
public class LoginServlet extends HttpServlet {

    private UserService userService;
    private Gson gson;

    @Override
    public void init() throws ServletException {
        userService = new UserService();
        gson = new Gson();
    }

    @Override
    protected void doPost(HttpServletRequest request,
                          HttpServletResponse response)
            throws ServletException, IOException {

        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");

        try {

            StringBuilder json = new StringBuilder();

            BufferedReader reader = request.getReader();

            String line;

            while ((line = reader.readLine()) != null) {
                json.append(line);
            }

            LoginRequest loginRequest =
                    gson.fromJson(json.toString(), LoginRequest.class);

            if (loginRequest == null ||
                loginRequest.email == null ||
                loginRequest.password == null ||
                loginRequest.email.isBlank() ||
                loginRequest.password.isBlank()) {

                sendResponse(
                        response,
                        HttpServletResponse.SC_BAD_REQUEST,
                        false,
                        "Email and password are required."
                );

                return;
            }

            User user = userService.authenticate(
                    loginRequest.email.trim(),
                    loginRequest.password
            );

            if (user == null) {

                sendResponse(
                        response,
                        HttpServletResponse.SC_UNAUTHORIZED,
                        false,
                        "Invalid email or password."
                );

                return;
            }

            HttpSession session =
                    request.getSession(true);

            session.setAttribute("userId", user.getId());
            session.setAttribute("userName", user.getName());
            session.setAttribute("userEmail", user.getEmail());
            session.setAttribute("userRole", user.getRole());

            Map<String, Object> result =
                    new HashMap<>();

            result.put("success", true);
            result.put("message", "Login successful!");
            result.put("name", user.getName());
            result.put("email", user.getEmail());
            result.put("role", user.getRole());

            response.setStatus(
                    HttpServletResponse.SC_OK
            );

            response.getWriter().write(
                    gson.toJson(result)
            );

        } catch (Exception e) {

            e.printStackTrace();

            sendResponse(
                    response,
                    HttpServletResponse.SC_INTERNAL_SERVER_ERROR,
                    false,
                    "Something went wrong. Please try again."
            );
        }
    }

    private void sendResponse(HttpServletResponse response,
                              int status,
                              boolean success,
                              String message)
            throws IOException {

        response.setStatus(status);

        Map<String, Object> result =
                new HashMap<>();

        result.put("success", success);
        result.put("message", message);

        response.getWriter().write(
                gson.toJson(result)
        );
    }

    private static class LoginRequest {

        private String email;
        private String password;
    }
}