package com.placementgpt.controller;

import com.google.gson.Gson;
import com.placementgpt.model.User;
import com.placementgpt.service.UserService;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.BufferedReader;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

@WebServlet("/api/register")
public class RegisterServlet extends HttpServlet {

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

            // Read JSON sent by frontend
            StringBuilder json = new StringBuilder();

            BufferedReader reader = request.getReader();

            String line;

            while ((line = reader.readLine()) != null) {
                json.append(line);
            }

            // Convert JSON into User object
            User user = gson.fromJson(json.toString(), User.class);

            // Basic validation
            if (user == null ||
                user.getName() == null ||
                user.getEmail() == null ||
                user.getPassword() == null ||
                user.getCollege() == null ||
                user.getBranch() == null) {

                sendResponse(
                    response,
                    HttpServletResponse.SC_BAD_REQUEST,
                    "Please fill all required fields."
                );

                return;
            }

            // Register user
            boolean registered = userService.registerUser(user);

            if (registered) {

                sendResponse(
                    response,
                    HttpServletResponse.SC_OK,
                    "Registration successful!"
                );

            } else {

                sendResponse(
                    response,
                    HttpServletResponse.SC_CONFLICT,
                    "Email already registered."
                );
            }

        } catch (Exception e) {

            e.printStackTrace();

            sendResponse(
                response,
                HttpServletResponse.SC_INTERNAL_SERVER_ERROR,
                "Something went wrong. Please try again."
            );
        }
    }

    private void sendResponse(HttpServletResponse response,
                              int status,
                              String message)
            throws IOException {

        response.setStatus(status);

        Map<String, Object> result = new HashMap<>();

        result.put("success", status == HttpServletResponse.SC_OK);
        result.put("message", message);

        response.getWriter().write(gson.toJson(result));
    }
}