using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Moq;
using OfficeOpenXml;
using PracticeInterview.Controllers;

namespace PracticeInterview.Tests
{
    public class PracticeControllerTests
    {
        private readonly Mock<ILogger<PracticeController>> _loggerMock;
        private readonly PracticeController _controller;

        public PracticeControllerTests()
        {
            _loggerMock = new Mock<ILogger<PracticeController>>();
            _controller = new PracticeController(_loggerMock.Object);
        }

        [Fact]
        public async Task UploadExcel_NoFile_ReturnsBadRequest()
        {
            // Arrange
            IFormFile file = null;

            // Act
            var result = await _controller.UploadExcel(file);

            // Assert
            var badRequestResult = Assert.IsType<BadRequestObjectResult>(result);
            Assert.Equal("No file uploaded.", badRequestResult.Value);
        }

        [Fact]
        public async Task UploadExcel_InvalidFileType_ReturnsBadRequest()
        {
            // Arrange
            var fileMock = new Mock<IFormFile>();
            fileMock.Setup(f => f.FileName).Returns("test.txt");
            fileMock.Setup(f => f.Length).Returns(1);

            // Act
            var result = await _controller.UploadExcel(fileMock.Object);

            // Assert
            var badRequestResult = Assert.IsType<BadRequestObjectResult>(result);
            Assert.Equal("Please upload a valid Excel or CSV file.", badRequestResult.Value);
        }

        [Fact]
        public async Task UploadExcel_ValidCsvFile_ReturnsOk()
        {
            // Arrange
            var csvContent = "Date,Market Price EX1\n10/1/2017,50.29000092\n10/1/2017 0:30,50\n10/1/2017 1:00,50\n10/1/2017 1:30,40.88000107";
            var fileMock = new Mock<IFormFile>();
            var stream = new MemoryStream();
            var writer = new StreamWriter(stream);
            await writer.WriteAsync(csvContent);
            await writer.FlushAsync();
            stream.Position = 0;

            // Set up the mock to represent a CSV file
            fileMock.Setup(f => f.FileName).Returns("test.csv");
            fileMock.Setup(f => f.Length).Returns(stream.Length);
            fileMock.Setup(f => f.OpenReadStream()).Returns(stream);

            // Act
            // var result = await _controller.UploadExcel(fileMock.Object); // Use the mock directly
            var result = await _controller.UploadExcel(new FormFile(stream, 0, stream.Length, "test.csv", "test.csv"));

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result);
            var data = Assert.IsAssignableFrom<List<DataEntry>>(okResult.Value);
            Assert.Equal(4, data.Count); // Check the expected number of data entries
            Assert.Equal(new DateTime(2017, 1, 10, 0, 0, 0), data[0].DateTime); // Check the date
            Assert.Equal(50.29000092m, data[0].MarketPrice); // Check the value
        }

        [Fact]
        public async Task UploadExcel_ValidExcelFile_ReturnsOk()
        {
            // Set the license context for EPPlus
            ExcelPackage.LicenseContext = LicenseContext.NonCommercial; // or LicenseContext.Commercial if applicable

            // Arrange
            var stream = new MemoryStream();
            using (var package = new ExcelPackage())
            {
                var worksheet = package.Workbook.Worksheets.Add("Sheet1");
                worksheet.Cells[1, 1].Value = "Date";
                worksheet.Cells[1, 2].Value = "Market Price EX1";
                worksheet.Cells[2, 1].Value = "10/1/2017 0:00";
                worksheet.Cells[2, 2].Value = 50.29000092;
                worksheet.Cells[3, 1].Value = "10/1/2017 0:30";
                worksheet.Cells[3, 2].Value = 50;

                package.SaveAs(stream);
            }
            stream.Position = 0;

            // Act
            var result = await _controller.UploadExcel(new FormFile(stream, 0, stream.Length, "test.xlsx", "test.xlsx"));

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result);
            var data = Assert.IsAssignableFrom<List<DataEntry>>(okResult.Value);

            Assert.Equal(2, data.Count()); // Check the expected number of data entries
            Assert.Equal(new DateTime(2017, 10, 1, 0, 0, 0), data[0].DateTime); // Check the date
            Assert.Equal(50.29000092m, data[0].MarketPrice); // Check the value
        }
    }
}