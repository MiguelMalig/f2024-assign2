# F1 Dashboard Project 

A dynamic Formula 1 statistics dashboard that provides comprehensive race data, driver information, and constructor details for F1 seasons from 2020 to 2023.

##  Features

###  Race Data
- Browse races across multiple F1 seasons (2020-2023)
- View detailed race results and qualifying data
- Sort results by various criteria (position, points, lap times)
- Interactive podium visualization for top 3 finishers

###  Driver Profiles
- Comprehensive driver information
- Historical race performance
- Career statistics
- Interactive driver cards

###  Constructor Information
- Team details and history
- Season performance metrics
- Historical constructor data
- Clickable constructor profiles

##  Technologies

- **Frontend Framework:** Bootstrap 5.3.3
- **Languages:** HTML5, CSS3, JavaScript (ES6+)
- **Data Storage:** Local Storage for caching
- **API Integration:** RESTful APIs
- **Responsive Design:** Mobile-first approach

##  Project Structure

```
f1-dashboard/
│
├── index.html          # Main application entry
├── js/
│   └── browse.js       # Core application logic
├── css/
│   └── styles.css      # Custom styling
└── photos/
    └── F1_logo.svg     # Assets
```

##  API Integration

The dashboard integrates with the following F1 data endpoints:

- `/api/f1/races.php` - Race information
- `/api/f1/results.php` - Race results
- `/api/f1/qualifying.php` - Qualifying data
- `/api/f1/drivers.php` - Driver profiles
- `/api/f1/constructors.php` - Constructor data
- `/api/f1/circuits.php` - Circuit details

##  Key Features Implementation

### Data Management
- Efficient local storage caching
- Dynamic data fetching
- Robust error handling

### User Interface
- Responsive grid layout
- Interactive data tables
- Modal information windows
- Sortable columns
- Podium visualizations

