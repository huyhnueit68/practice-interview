using Microsoft.AspNetCore.Mvc;
using OfficeOpenXml;

namespace PracticeInterview.Controllers
{
    // Define a data model for the entries
    public class DataEntry
    {
        public DateTime DateTime { get; set; }
        public decimal MarketPrice { get; set; }
    }

    [ApiController]
    [Route("[controller]")]
    public class PracticeController : ControllerBase
    {
        private readonly ILogger<PracticeController> _logger;

        public PracticeController(ILogger<PracticeController> logger)
        {
            _logger = logger;
        }

        /// <summary>
        /// API upload file data
        /// </summary>
        /// <param name="file"></param>
        /// <returns></returns>
        /// CreatedBy: Harry (10.02.2024)
        [HttpPost("upload-excel")]
        public async Task<IActionResult> UploadExcel(IFormFile file)
        {
            if (file == null || file.Length == 0)
            {
                return BadRequest("No file uploaded.");
            }

            // Check if the file is an Excel or CSV file
            if (!file.FileName.EndsWith(".xlsx") && !file.FileName.EndsWith(".xls") && !file.FileName.EndsWith(".csv"))
            {
                return BadRequest("Please upload a valid Excel or CSV file.");
            }

            try
            {
                using (var stream = new MemoryStream())
                {
                    await file.CopyToAsync(stream);
                    stream.Position = 0; // Reset stream position for reading

                    var data = file.FileName.EndsWith(".csv")
                        ? await ReadCsvAsync(stream)
                        : await ReadExcelAsync(stream);

                    return Ok(data); // Return the data as an array
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error reading file.");
                return StatusCode(500, "Internal server error");
            }
        }

        /// <summary>
        /// Func handel raw file
        /// </summary>
        /// <param name="stream"></param>
        /// <returns></returns>
        /// <exception cref="InvalidDataException"></exception>
        /// CreatedBy: Harry (10.02.2024)
        private async Task<List<DataEntry>> ReadCsvAsync(Stream stream)
        {
            var data = new List<DataEntry>();

            try
            {
                using (var reader = new StreamReader(stream))
                {
                    var headerLine = await reader.ReadLineAsync();
                    if (headerLine == null)
                    {
                        throw new InvalidDataException("The CSV file is empty.");
                    }

                    var headers = headerLine.Split(',');
                    var headerMap = CreateHeaderMap();

                    while (!reader.EndOfStream)
                    {
                        var line = await reader.ReadLineAsync();
                        var values = line.Split(',');
                        var entry = new DataEntry();

                        for (int i = 0; i < headers.Length; i++)
                        {
                            var header = headers[i].Trim();
                            if (headerMap.TryGetValue(header, out var mappedHeader))
                            {
                                if (mappedHeader == nameof(DataEntry.DateTime))
                                {
                                    // Define the expected date formats
                                    var dateFormats = new[]
                                    {
                                    "dd/MM/yyyy HH:mm", // Format for "13/01/2017 00:30"
                                    "dd/MM/yyyy",       // Format for "13/01/2017"
                                    "d/M/yyyy HH:mm",   // Format for "10/1/2017 0:30" (single-digit day/month and hour)
                                    "d/M/yyyy",         // Format for "10/1/2017" (single-digit day/month)
                                    "MM/dd/yyyy HH:mm", // Format for "01/10/2017 00:30" (if needed)
                                    "MM/dd/yyyy",       // Format for "01/10/2017" (if needed)
                                    "yyyy-MM-dd HH:mm", // Format for "2017-01-10 00:30" (ISO format)
                                    "yyyy-MM-dd"        // Format for "2017-01-10" (ISO format)
                                };

                                    // Try parsing the date-time value with multiple formats
                                    if (values.Length > i && DateTime.TryParseExact(values[i], dateFormats,
                                        System.Globalization.CultureInfo.InvariantCulture,
                                        System.Globalization.DateTimeStyles.None, out var dateValue))
                                    {
                                        entry.DateTime = dateValue; // Store as DateTime
                                    }
                                    else
                                    {
                                        // Fallback to TryParse for more flexibility
                                        if (values.Length > i && DateTime.TryParse(values[i],
                                            System.Globalization.CultureInfo.InvariantCulture,
                                            System.Globalization.DateTimeStyles.None, out var fallbackDateValue))
                                        {
                                            entry.DateTime = fallbackDateValue; // Store as DateTime
                                        }
                                        else
                                        {
                                            // Handle the case where parsing fails
                                            entry.DateTime = DateTime.MinValue; // or some other default value
                                        }
                                    }
                                }
                                else if (mappedHeader == nameof(DataEntry.MarketPrice))
                                {
                                    // Parse the marketPrice value
                                    if (decimal.TryParse(values.Length > i ? values[i] : null, out var decimalValue))
                                    {
                                        entry.MarketPrice = decimalValue; // Store as decimal
                                    }
                                }
                            }
                        }
                        data.Add(entry);
                    }
                }
            }
            catch (Exception ce)
            {
                Console.WriteLine(ce.Message);
            }

            return data;
        }

        /// <summary>
        /// Func read excel
        /// </summary>
        /// <param name="stream"></param>
        /// <returns></returns>
        /// <exception cref="InvalidDataException"></exception>
        /// CreatedBy: Harry (10.02.2024)
        private async Task<List<DataEntry>> ReadExcelAsync(Stream stream)
        {
            var data = new List<DataEntry>();

            try
            {
                using (var package = new ExcelPackage(stream))
                {
                    var worksheet = package.Workbook.Worksheets.FirstOrDefault();
                    if (worksheet == null)
                    {
                        throw new InvalidDataException("The Excel file is empty.");
                    }

                    var rowCount = worksheet.Dimension.Rows;
                    var headerMap = CreateHeaderMap();

                    for (int row = 2; row <= rowCount; row++) // Assuming the first row is the header
                    {
                        var entry = new DataEntry();
                        for (int col = 1; col <= worksheet.Dimension.Columns; col++)
                        {
                            var header = worksheet.Cells[1, col].Text.Trim(); // Get the header
                            if (headerMap.TryGetValue(header, out var mappedHeader))
                            {
                                if (mappedHeader == nameof(DataEntry.DateTime))
                                {
                                    // Parse the dateTime value
                                    if (DateTime.TryParse(worksheet.Cells[row, col].Text, out var dateValue))
                                    {
                                        entry.DateTime = dateValue; // Store as DateTime
                                    }
                                }
                                else if (mappedHeader == nameof(DataEntry.MarketPrice))
                                {
                                    // Parse the marketPrice value
                                    if (decimal.TryParse(worksheet.Cells[row, col].Text, out var decimalValue))
                                    {
                                        entry.MarketPrice = decimalValue; // Store as decimal
                                    }
                                }
                            }
                        }
                        data.Add(entry); // Add the entry to the list
                    }
                }
            }
            catch (Exception ce)
            {
                Console.Write(ce.Message);
            }

            return data;
        }

        /// <summary>
        /// Func create map file title
        /// </summary>
        /// <returns></returns>
        /// CreatedBy: Harry (10.02.2024)
        private Dictionary<string, string> CreateHeaderMap()
        {
            return new Dictionary<string, string>
            {
                { "Date", nameof(DataEntry.DateTime) },
                { "Market Price EX1", nameof(DataEntry.MarketPrice) }
                // Add more mappings as needed
            };
        }
    }
}