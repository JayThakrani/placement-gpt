package com.placementgpt;

import com.placementgpt.util.DBConnection;
import java.sql.Connection;

public class TestConnection {

    public static void main(String[] args) {

        try (Connection connection = DBConnection.getConnection()) {

            if (connection != null) {
                System.out.println("=================================");
                System.out.println("MySQL Connection Successful!");
                System.out.println("Database: placementgpt");
                System.out.println("=================================");
            }

        } catch (Exception e) {

            System.out.println("MySQL Connection Failed!");
            e.printStackTrace();
        }
    }
}