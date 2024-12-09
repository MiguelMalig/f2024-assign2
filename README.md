# F1 Dashboard Project 🏎️

[![Bootstrap](https://img.shields.io/badge/Bootstrap-5.3.3-7952B3?style=flat&logo=bootstrap&logoColor=white)](https://getbootstrap.com/)
[![JavaScript](https://img.shields.io/badge/JavaScript-ES6-F7DF1E?style=flat&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat&logo=html5&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/Guide/HTML/HTML5)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat&logo=css3&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/CSS)

A dynamic Formula 1 statistics dashboard that provides comprehensive race data, driver information, and constructor details for F1 seasons from 2020 to 2023.

## ✨ Features

### 🏁 Race Data
- Browse races across multiple F1 seasons (2020-2023)
- View detailed race results and qualifying data
- Sort results by various criteria (position, points, lap times)
- Interactive podium visualization for top 3 finishers

### 👨‍🏎️ Driver Profiles
- Comprehensive driver information
- Historical race performance
- Career statistics
- Interactive driver cards

### 🏢 Constructor Information
- Team details and history
- Season performance metrics
- Historical constructor data
- Clickable constructor profiles

## 💻 Technologies

- **Frontend Framework:** Bootstrap 5.3.3
- **Languages:** HTML5, CSS3, JavaScript (ES6+)
- **Data Storage:** Local Storage for caching
- **API Integration:** RESTful APIs
- **Responsive Design:** Mobile-first approach

## 📁 Project Structure

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

## 🔌 API Integration

The dashboard integrates with the following F1 data endpoints:

- `/api/f1/races.php` - Race information
- `/api/f1/results.php` - Race results
- `/api/f1/qualifying.php` - Qualifying data
- `/api/f1/drivers.php` - Driver profiles
- `/api/f1/constructors.php` - Constructor data
- `/api/f1/circuits.php` - Circuit details

## 🎯 Key Features Implementation

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

## 📱 Responsive Design

The dashboard is fully responsive and optimized for:
- 💻 Desktop (1200px+)
- 💻 Laptop (1024px)
- 📱 Tablet (768px)
- 📱 Mobile (320px+)

## 🔧 Browser Support

- ✅ Chrome (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Edge (latest)
