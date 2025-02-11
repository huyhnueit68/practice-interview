# README Practice Interview for Data Visualization Web Application

### Overview

This web application is designed to read data from a provided CSV file (`sampleSheet.csv`) and display the data in both graphical and tabular formats. The application is built using the Microsoft stack, specifically .NET Core for the backend, and utilizes CSS and JavaScript for the frontend. 

### Features

The application meets the following requirements:

- **Data Reading**: Reads data from the provided CSV file.
- **Graphical Representation**: Displays the data series in a suitable graph format using charting libraries.
- **Sortable and Filterable Tables**: The tables displaying the data are sortable and filterable for better user experience.
- **Statistical Display**: A separate component displays:
  - Minimum and maximum values from the data series.
  - Average of the series.
  - Most expensive hour window (i.e., two consecutive half-hourly values) for the data range provided.

### Technologies Used

- **Backend**: .NET Core (C#)
- **Frontend**: React, Ant Design, SCSS
- **Data Visualization**: Charting libraries (e.g., Chart.js, AG Grid)
- **Data Format**: CSV

### Getting Started

#### Prerequisites

- [.NET Core SDK](https://dotnet.microsoft.com/download) (version 5.0 or later)
- [Node.js](https://nodejs.org/) (for React and frontend dependencies)
- A code editor (e.g., Visual Studio, Visual Studio Code)

#### Step-by-Step Guide to Build and Run the Project

1. **Clone the Repository**:
   ```bash
   git clone <repository-url>
   cd <repository-directory>
   ```

2. **Navigate to the Backend Directory**:
   ```bash
   cd backend
   ```

3. **Restore NuGet Packages**:
   ```bash
   dotnet restore
   ```

4. **Run the Backend Application**:
   ```bash
   dotnet run
   ```

5. **Navigate to the Frontend Directory**:
   Open a new terminal window and navigate to the frontend directory:
   ```bash
   cd frontend
   ```

6. **Install Frontend Dependencies**:
   ```bash
   npm install
   ```

7. **Run the Frontend Application**:
   ```bash
   npm start
   ```

8. **Access the Application**:
   Open your web browser and go to `http://localhost:3000` to view the application.

### Example Data

The application uses a sample data file named `sampleSheet.csv`. Ensure this file is placed in the correct directory as specified in the application code.

### Notes for End Users

- Ensure that the CSV file is formatted correctly with the expected columns (e.g., Date and Market Price).
- The application provides visual feedback for data loading and processing.
- Use the provided filters and sorting options in the table for better data analysis.

### Author

This application was developed by **Pham Quang Huy (Harry)**. If you have any questions or need further assistance, feel free to reach out.