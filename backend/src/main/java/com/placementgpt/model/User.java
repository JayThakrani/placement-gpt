package com.placementgpt.model;

public class User {

    private int id;
    private String name;
    private String email;
    private String password;
    private String college;
    private String branch;
    private int semester;
    private String role;

    // Default constructor
    public User() {
    }

    // Constructor without ID
    public User(String name, String email, String password,
                String college, String branch, int semester, String role) {

        this.name = name;
        this.email = email;
        this.password = password;
        this.college = college;
        this.branch = branch;
        this.semester = semester;
        this.role = role;
    }

    // Constructor with ID
    public User(int id, String name, String email, String password,
                String college, String branch, int semester, String role) {

        this.id = id;
        this.name = name;
        this.email = email;
        this.password = password;
        this.college = college;
        this.branch = branch;
        this.semester = semester;
        this.role = role;
    }

    // Getters and Setters

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getCollege() {
        return college;
    }

    public void setCollege(String college) {
        this.college = college;
    }

    public String getBranch() {
        return branch;
    }

    public void setBranch(String branch) {
        this.branch = branch;
    }

    public int getSemester() {
        return semester;
    }

    public void setSemester(int semester) {
        this.semester = semester;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }
}