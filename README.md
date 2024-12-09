COMP 3512 - F1 Dashboard Project
Overview
This repository contains code for an F1 Dashboard project that provides a web-based interface for exploring Formula 1 racing data. The application allows users to view and analyze race results, qualifying data, driver information, and constructor details across multiple F1 seasons (2020-2023). It utilizes RESTful APIs to fetch and display dynamic racing data with a responsive user interface.
Features

Season Selection: Browse races from multiple F1 seasons (2020-2023)
Race Results: View detailed race results including:

Driver positions and points
Lap counts
Constructor information


Qualifying Data: Access qualifying session data with:

Q1, Q2, and Q3 times
Driver and constructor performance


Driver Information: Detailed driver profiles including:

Personal information (ID, DOB, nationality)
Race history and performance


Constructor Details: View constructor information with:

Team details
Season performance
Historical race data


Sorting Functionality: Sort results by various criteria:

Driver name
Constructor
Position
Points
Lap times
Qualifying times



Technologies Used

HTML5
CSS3
JavaScript
Bootstrap 5.3.3
RESTful APIs
Local Storage for data caching

Main Project Files

index.html - Main dashboard interface with responsive layout
browse.js - Core JavaScript functionality including:

API data fetching
Results processing
Table generation
Sorting logic
Modal implementations


styles.css - Custom styling and Bootstrap extensions

API Integration
The project uses multiple F1 data APIs:

/api/f1/races.php - Race information by season
/api/f1/results.php - Race results data
/api/f1/qualifying.php - Qualifying session data
/api/f1/drivers.php - Driver information
/api/f1/constructors.php - Constructor details
/api/f1/circuits.php - Circuit information

Features Implementation

Data Management:

Local storage caching for improved performance
Dynamic data fetching and updates
Error handling for API requests


User Interface:

Responsive grid layout
Interactive data tables
Modal windows for detailed information
Sortable columns
Podium visualization for top 3 finishers


Navigation:

Season selection dropdown
Race list with quick access buttons
Clickable driver and constructor names


Performance Optimization

Data caching using localStorage
Efficient DOM manipulation
Optimized sorting algorithms
Responsive image handling

Notes

All data is sourced from the F1 REST APIs
Internet connection required for initial data fetch
Compatible with modern web browsers
Responsive design for desktop and mobile viewing
