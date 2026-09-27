package com.placementgpt.controller;

import com.google.gson.Gson;
import com.placementgpt.model.User;
import com.placementgpt.service.UserService;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@WebServlet("/api/admin/students")
public class AdminStudentsServlet extends HttpServlet {

    private UserService userService;
    private Gson gson;

    @Override
    public void init() throws ServletException {
        userService = new UserService();
        gson = new Gson();
    }

    @Override
    protected void doGet(HttpServletRequest request,
                         HttpServletResponse response)
            throws ServletException, IOException {

        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");

        try {

            List<User> students =
                    userService.getAllStudents();

            List<Map<String, Object>> result =
                    new ArrayList<>();

            for (User student : students) {

                Map<String, Object> studentData =
                        new HashMap<>();

                studentData.put("id", student.getId());
                studentData.put("name", student.getName());
                studentData.put("email", student.getEmail());
                studentData.put("college", student.getCollege());
                studentData.put("branch", student.getBranch());
                studentData.put("semester", student.getSemester());
                studentData.put("role", student.getRole());

                result.add(studentData);
            }

            response.setStatus(
                    HttpServletResponse.SC_OK
            );

            response.getWriter().write(
                    gson.toJson(result)
            );

        } catch (Exception e) {

            e.printStackTrace();

            response.setStatus(
                    HttpServletResponse.SC_INTERNAL_SERVER_ERROR
            );

            Map<String, Object> error =
                    new HashMap<>();

            error.put("success", false);
            error.put(
                    "message",
                    "Unable to load students."
            );

            response.getWriter().write(
                    gson.toJson(error)
            );
        }
    }
}