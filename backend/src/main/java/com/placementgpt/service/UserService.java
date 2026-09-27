package com.placementgpt.service;

import com.placementgpt.dao.UserDAO;
import com.placementgpt.model.User;

import java.util.List;

public class UserService {

    private final UserDAO userDAO;

    public UserService() {
        userDAO = new UserDAO();
    }

    // =========================
    // REGISTER USER
    // =========================

    public boolean registerUser(User user) {

        User existingUser =
                userDAO.findByEmail(user.getEmail());

        if (existingUser != null) {
            return false;
        }

        if (user.getRole() == null ||
            user.getRole().isBlank()) {

            user.setRole("STUDENT");
        }

        return userDAO.registerUser(user);
    }


    // =========================
    // FIND USER BY EMAIL
    // =========================

    public User findByEmail(String email) {

        return userDAO.findByEmail(email);
    }


    // =========================
    // AUTHENTICATE USER
    // =========================

    public User authenticate(String email,
                              String password) {

        User user =
                userDAO.findByEmail(email);

        if (user == null) {
            return null;
        }

        if (user.getPassword().equals(password)) {
            return user;
        }

        return null;
    }


    // =========================
    // GET ALL STUDENTS
    // =========================

    public List<User> getAllStudents() {

        return userDAO.getAllStudents();
    }
}