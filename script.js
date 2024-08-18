function updateSerialNumbers() {
  const rows = document.querySelectorAll('#dataTable tbody tr');
  rows.forEach((row, index) => {
      const snoCell = row.querySelector('td.sno');
      if (snoCell) {
          snoCell.textContent = index + 1; // Set the serial number
      }
  });
}

function saveTableState() {
    const tableHTML = document.querySelector('#dataTable').outerHTML;
    localStorage.setItem('tableState', tableHTML);
    // Show the custom notification
    const notification = document.getElementById('notification');
            notification.classList.add('show');

            // Hide the notification after 1 seconds
            setTimeout(() => {
                notification.classList.remove('show');
            }, 2000);
}
// Call saveTableState every 100 seconds (100000 milliseconds)
setInterval(saveTableState, 100000);

function loadTableState() {
    const savedTableHTML = localStorage.getItem('tableState');
    if (savedTableHTML) {
        const dataTable = document.querySelector('#dataTable');
        dataTable.outerHTML = savedTableHTML;
        updateDynamicOptions(); // To re-populate any dynamic options
        alert('Table loaing please wait .');
    } else {
        alert('No table found.');
    }
}
// Load the table state on page load
window.onload = loadTableState;
    function generateDateHeaders() {
    const headerRow = document.getElementById('headerRow');
    const startDate = new Date('2024-07-01'); // Start date: July 1, 2024
    const numOfDays = 365; // Number of days to generate
    const fragment = document.createDocumentFragment();

    // Create an array to store column headers
    const columnHeaders = [];

    for (let i = 0; i < numOfDays; i++) {
        // Compute the date starting from startDate
        const date = new Date(startDate);
        date.setDate(startDate.getDate() + i); // Increment the date by i days

        // Format the date to DD/MM/YYYY
        const dateStr = date.toLocaleDateString('en-GB'); 
        
        // Date Header Cell
        const dateTh = document.createElement('th');
        dateTh.className = 'header-cell';
        dateTh.textContent = dateStr;
        fragment.appendChild(dateTh);

        // Store column headers
        columnHeaders.push(dateStr);
    }

    headerRow.appendChild(fragment);

    // Populate the dropdowns for start and end column headers
    const startColumnSelect = document.getElementById('startColumnHeader');
    const endColumnSelect = document.getElementById('endColumnHeader');

    columnHeaders.forEach(header => {
        const option = document.createElement('option');
        option.value = header;
        option.textContent = header;
        startColumnSelect.appendChild(option);
        endColumnSelect.appendChild(option.cloneNode(true)); // Clone the option for the end column select
    });

    // Populate the dropdown for row headers
    const rowHeaderSelect = document.getElementById('rowHeader');
    const rows = document.querySelectorAll("#dataTable tbody tr");
    rows.forEach(row => {
        const cells = row.querySelectorAll("td");
        const rowHeader = cells[0].textContent.trim();
        if (rowHeader) {
            const option = document.createElement('option');
            option.value = rowHeader;
            option.textContent = rowHeader;
            rowHeaderSelect.appendChild(option);
        }
    });
}

// Call generateDateHeaders on page load
document.addEventListener("DOMContentLoaded", generateDateHeaders);

function addSplitRow() {
  const siteName = document.getElementById('siteNameSplit').value.trim();
  const tagsSelect = document.getElementById('rowTags');
  const addLandscapeTag = document.getElementById('addLandscapeTag').checked;
  const rowIndex = parseInt(document.getElementById('rowIndexSplit').value.trim(), 10);

  if (!siteName) {
      alert("Please enter a Site Name.");
      return;
  }

  // Add the new siteName to the multiselect dropdown
  const rowHeaderSelect = document.getElementById('rowHeader');
  const option = document.createElement('option');
  option.value = siteName;
  option.textContent = siteName;
  rowHeaderSelect.appendChild(option);

  // Prepare the tags
  let tags = tagsSelect.value;
  if (addLandscapeTag) {
      if (tags) {
          tags += `, Landscape`;
      } else {
          tags = 'Landscape';
      }
  }

  const tableBody = document.querySelector("#dataTable tbody");
  const newRow = document.createElement("tr");

  // Add Sno column
  const snoCell = document.createElement("td");
  snoCell.className = 'sno'; // Add class for styling if needed
  newRow.appendChild(snoCell);

  // Add Site Name cell
  const siteNameCell = document.createElement("td");
  siteNameCell.className = 'editable first-column-header';
  siteNameCell.setAttribute('contenteditable', 'true');
  siteNameCell.textContent = siteName;

  newRow.appendChild(siteNameCell);

  // Add 365 columns with 6 sub-cells each
  const numOfDays = 365;
  for (let i = 0; i < numOfDays; i++) {
      const cellContainer = document.createElement('div');
      cellContainer.className = 'cell-container';

      for (let j = 0; j < 6; j++) {
          const subCell = document.createElement('div');
          subCell.className = 'sub-cell editable';
          subCell.setAttribute('contenteditable', 'true');
          subCell.textContent = "Available"; // Default value
          subCell.style.backgroundColor = "rgb(0, 240, 0)"; // Default color
          cellContainer.appendChild(subCell);
      }

      const cell = document.createElement("td");
      cell.appendChild(cellContainer);
      newRow.appendChild(cell);
  }

  // Add Tags cell with tooltip
  const tagsCell = document.createElement("td");
  tagsCell.className = 'tags-cell'; // Optional: Add a class for styling
  tagsCell.textContent = tags;
  tagsCell.title = tags; // Tooltip text is set to the tags value
  newRow.appendChild(tagsCell);

  // Add Delete button cell
  const deleteCell = document.createElement("td");
  deleteCell.innerHTML = '<button class="delete-button" onclick="deleteRow(this)">Delete</button>';
  newRow.appendChild(deleteCell);

  // Insert or append the new row
  const rows = tableBody.querySelectorAll('tr');
  if (isNaN(rowIndex) || rowIndex < 1 || rowIndex > rows.length + 1) {
      tableBody.appendChild(newRow); // Append if index is invalid or out of range
  } else {
      const index = rowIndex - 1; // Convert to 0-based index
      if (index < rows.length) {
          tableBody.insertBefore(newRow, rows[index]);
      } else {
          tableBody.appendChild(newRow); // Append if index is at the end
      }
  }

  document.getElementById("siteNameSplit").value = "";
  tagsSelect.value = ""; // Clear the tags selection
  document.getElementById("addLandscapeTag").checked = false; // Reset the checkbox
  document.getElementById("rowIndexSplit").value = ""; // Reset the row index input

  // Update serial numbers
  updateSerialNumbers();
}



// Call updateSerialNumbers on page load to ensure serial numbers are correct
document.addEventListener('DOMContentLoaded', updateSerialNumbers);



function addSingleRow() {
    const siteName = document.getElementById('siteNameSingle').value;
    if (!siteName) {
        alert("Please enter a Site Name.");
        return;
    }

    const tableBody = document.querySelector("#dataTable tbody");
    const newRow = document.createElement("tr");
    
    // Create and add the site name cell
    const siteNameCell = document.createElement("td");
    siteNameCell.textContent = siteName;
    siteNameCell.className = 'editable first-column-header';
    siteNameCell.setAttribute('contenteditable', 'true');
    newRow.appendChild(siteNameCell);

    const numOfDays = 365;
    const headerCells = document.querySelectorAll("#headerRow th");
    let headerCellIndex = 1; // Start after the Site Name column

    for (let i = 0; i < numOfDays; i++) {
        const cell = document.createElement("td");
        cell.className = 'editable';
        cell.setAttribute('contenteditable', 'true');
        cell.textContent = siteName; // Set the same value for all cells

        newRow.appendChild(cell);
        headerCellIndex++;
    }

    // Create and add the delete button cell
    const deleteCell = document.createElement("td");
    deleteCell.innerHTML = '<button class="delete-button" onclick="deleteRow(this)">Delete</button>';
    newRow.appendChild(deleteCell);

    // Add a unique class to identify rows created by addSingleRow
    newRow.classList.add("single-row");

    // Add the new row to the table
    tableBody.appendChild(newRow);

    // Clear the input field
    document.getElementById("siteNameSingle").value = "";
}

function deleteRow(button) {
    const row = button.closest("tr");
    row.remove();
}

function autoFillRangeRandom() {
  // Retrieve input values from the DOM
  const startColumnHeader = document.getElementById('startColumnHeader').value.trim();
  const endColumnHeader = document.getElementById('endColumnHeader').value.trim();
  const value = document.getElementById('autoFillValue').value.trim() || "";
  const color = document.getElementById('autoFillColor').value.trim() || "#ffffff";
  const numRowsToProcess = parseInt(document.getElementById('numRows').value, 10) || 0;
  const tagReferenceSelect = document.getElementById('tagReferenceSelect') ? document.getElementById('tagReferenceSelect').value.trim() : "";

  // Validate inputs
  if (!startColumnHeader || !endColumnHeader) {
      alert("Please enter all required values.");
      return;
  }

  // Find column indexes based on column headers
  const headerCells = document.querySelectorAll("#headerRow th");
  let startColumnIndex = -1;
  let endColumnIndex = -1;

  headerCells.forEach((headerCell, index) => {
      const headerText = headerCell.textContent.trim();
      if (headerText === startColumnHeader) {
          startColumnIndex = index;
      }
      if (headerText === endColumnHeader) {
          endColumnIndex = index;
      }
  });

  if (startColumnIndex === -1 || endColumnIndex === -1) {
      alert("Column headers not found.");
      return;
  }

  // Function to find a consistent sub-cell index across all columns in the range
  function findConsistentSubCellIndex(cells, startIndex, endIndex) {
      let fillSubCellIndex = -1;
      for (let i = startIndex; i <= endIndex; i++) {
          if (i >= cells.length) continue;
          const cell = cells[i];
          const subCells = cell.querySelectorAll('.sub-cell');

          if (subCells.length === 0) return -1; // No sub-cells to consider

          for (let subIndex = 0; subIndex < subCells.length; subIndex++) {
              const subCell = subCells[subIndex];
              const cellText = subCell.textContent.trim();
              
              // Find the first valid index where the sub-cell is empty or contains "Available"
              if (cellText === "" || cellText === "Available") {
                  if (fillSubCellIndex === -1) {
                      fillSubCellIndex = subIndex; // Set index if it's the first valid index found
                  } else if (subIndex !== fillSubCellIndex) {
                      return -1; // Inconsistent sub-cell index
                  }
                  break; // Found a valid sub-cell index
              }
          }
      }
      return fillSubCellIndex;
  }

  // Process rows
  const rows = Array.from(document.querySelectorAll("#dataTable tbody tr"));
  let numProcessed = 0;
  let processedAny = false; // Track if we processed any row

  for (let rowIndex = 0; rowIndex < rows.length; rowIndex++) {
      const row = rows[rowIndex];
      const cells = row.querySelectorAll("td");

      // Skip rows with the class 'single-row'
      if (row.classList.contains('single-row')) {
          continue;
      }

      // Check tagReferenceSelect if provided
      if (tagReferenceSelect) {
          const tagReferenceCell = cells[367]; // 368th column (0-based index is 367)
          if (!tagReferenceCell || tagReferenceCell.textContent.trim() !== tagReferenceSelect) {
              continue; // Skip row if tag reference value does not match
          }
      }

      // Determine the consistent sub-cell index
      const consistentSubCellIndex = findConsistentSubCellIndex(cells, startColumnIndex, endColumnIndex);

      if (consistentSubCellIndex === -1) {
          continue; // Skip rows if no consistent sub-cell index is found
      }

      // Check if all sub-cells in the specified columns are "Available"
      let allSubCellsAvailable = true;
      for (let i = startColumnIndex; i <= endColumnIndex; i++) {
          if (i >= cells.length) continue;
          const cell = cells[i];
          const subCells = cell.querySelectorAll('.sub-cell');

          if (consistentSubCellIndex >= subCells.length) {
              allSubCellsAvailable = false;
              break; // Skip if sub-cell index is out of range for any column
          }

          const subCell = subCells[consistentSubCellIndex];
          if (subCell.textContent.trim() !== "Available") {
              allSubCellsAvailable = false;
              break; // Skip if any sub-cell in the range is not "Available"
          }
      }

      // Only update rows if all sub-cells in the specified columns are "Available"
      if (allSubCellsAvailable) {
          cells.forEach((cell, index) => {
              if (index >= startColumnIndex && index <= endColumnIndex) {
                  const subCells = cell.querySelectorAll('.sub-cell');
                  if (consistentSubCellIndex < subCells.length) {
                      const subCell = subCells[consistentSubCellIndex];
                      if (subCell.textContent.trim() === "" || subCell.textContent.trim() === "Available") {
                          subCell.textContent = value;
                          subCell.style.backgroundColor = color;
                      }
                  }
              }
          });

          numProcessed++;
          processedAny = true; // Mark that at least one row has been processed

          if (numProcessed >= numRowsToProcess) {
              break; // Stop processing if we've reached the desired number of rows
          }
      }
  }

  // Alert if the number of processed rows is less than the specified number
  if (processedAny && numProcessed < numRowsToProcess) {
      alert("Alert - not enough rows processed.");
  }
}


function autoFillRange() {
    const rowHeaders = Array.from(document.getElementById('rowHeader').selectedOptions)
                            .map(option => option.value.trim());
    const startColumnHeader = document.getElementById('startColumnHeader').value.trim();
    const endColumnHeader = document.getElementById('endColumnHeader').value.trim();
    const value = document.getElementById('autoFillValue').value || "";
    const color = document.getElementById('autoFillColor').value || "#ffffff";

    if (rowHeaders.length === 0 || !startColumnHeader || !endColumnHeader) {
        alert("Please select at least one row header and enter all required values.");
        return;
    }

    // Find column indexes based on column headers
    const headerCells = document.querySelectorAll("#headerRow th");
    let startColumnIndex = -1;
    let endColumnIndex = -1;

    headerCells.forEach((headerCell, index) => {
        const headerText = headerCell.textContent.trim();
        if (headerText === startColumnHeader) {
            startColumnIndex = index;
        }
        if (headerText === endColumnHeader) {
            endColumnIndex = index;
        }
    });

    if (startColumnIndex === -1 || endColumnIndex === -1) {
        alert("Column headers not found.");
        return;
    }

    // Process each selected rowHeader
    rowHeaders.forEach(rowHeader => {
        // Find the target row based on rowHeader
        const rows = document.querySelectorAll("#dataTable tbody tr");
        let targetRow = null;

        rows.forEach(row => {
            // Skip rows with the class 'single-row'
            if (row.classList.contains('single-row')) {
                return;
            }

            const cells = row.querySelectorAll("td");
            const rowHeaderCell = cells[0];
            if (rowHeaderCell.textContent.trim() === rowHeader) {
                targetRow = row;
            }
        });

        if (!targetRow) {
            alert(`Row header "${rowHeader}" not found.`);
            return;
        }

        // Determine the consistent sub-cell index across all specified columns
        let fillSubCellIndex = -1;
        const cells = targetRow.querySelectorAll("td");

        for (let i = startColumnIndex; i <= endColumnIndex; i++) {
            if (i < cells.length) {
                const cell = cells[i];
                const subCells = cell.querySelectorAll('.sub-cell');

                if (subCells.length === 0) {
                    fillSubCellIndex = -1;
                    break; // No sub-cells in this column, cannot determine index
                }

                let columnSubCellIndex = -1;

                for (let subIndex = 0; subIndex < subCells.length; subIndex++) {
                    const subCell = subCells[subIndex];
                    const cellText = subCell.textContent.trim();

                    // Find the first valid index where the sub-cell is empty or contains "Available"
                    if (cellText === "" || cellText === "Available") {
                        columnSubCellIndex = subIndex;
                        break; // Found a valid sub-cell index
                    }
                }

                if (columnSubCellIndex === -1) {
                    fillSubCellIndex = -1;
                    break; // No valid sub-cell index found
                }

                if (fillSubCellIndex === -1) {
                    fillSubCellIndex = columnSubCellIndex; // Set index if it's the first valid index found
                } else if (fillSubCellIndex !== columnSubCellIndex) {
                    fillSubCellIndex = -1;
                    break; // Inconsistent sub-cell index
                }
            }
        }

        // If a consistent sub-cell index was found, check if all sub-cells in the specified range are "Available"
        if (fillSubCellIndex !== -1) {
            let allAvailable = true;

            for (let i = startColumnIndex; i <= endColumnIndex; i++) {
                if (i >= cells.length) continue;
                const cell = cells[i];
                const subCells = cell.querySelectorAll('.sub-cell');

                if (fillSubCellIndex >= subCells.length) {
                    allAvailable = false;
                    break; // Sub-cell index is out of range for this column
                }

                const subCell = subCells[fillSubCellIndex];
                if (subCell.textContent.trim() !== "Available") {
                    allAvailable = false;
                    break; // At least one sub-cell is not "Available"
                }
            }

            // Only update cells if all sub-cells at the same index are "Available"
            if (allAvailable) {
                cells.forEach((cell, index) => {
                    if (index >= startColumnIndex && index <= endColumnIndex) {
                        const subCells = cell.querySelectorAll('.sub-cell');
                        if (fillSubCellIndex < subCells.length) {
                            const subCell = subCells[fillSubCellIndex];
                            if (subCell.textContent.trim() === "" || subCell.textContent.trim() === "Available") {
                                subCell.textContent = value;
                                subCell.style.backgroundColor = color;
                            }
                        }
                    }
                });
            } else {
                alert(`Not all sub-cells in the specified range for row header "${rowHeader}" have the value 'Available'.`);
            }
        } else {
            alert(`No consistent sub-cell index found across the specified range for row header "${rowHeader}".`);
        }
    });
}

function getSelectedRowHeaders() {
    const rowHeaderSelect = document.getElementById('rowHeader');
    const selectedOptions = Array.from(rowHeaderSelect.selectedOptions);
    return selectedOptions.map(option => option.value);
}

    function searchTable() {
        const searchHeader = document.getElementById('searchHeader').value.toLowerCase();
        const rows = document.querySelectorAll("#dataTable tbody tr");

        rows.forEach(row => {
        const cells = row.querySelectorAll("td");
        const rowHeaderCell = cells[0].textContent.toLowerCase();

        let showRow = false;

        // Check if row header contains the search term
        if (rowHeaderCell.includes(searchHeader)) {
            showRow = true;
        } else {
            // Check the content of all cells if row header does not match
            cells.forEach(cell => {
                const subCells = cell.querySelectorAll('.sub-cell');
                let cellContainsValue = false;

                // Check sub-cells if present
                if (subCells.length > 0) {
                    subCells.forEach(subCell => {
                        if (subCell.textContent.toLowerCase().includes(searchHeader)) {
                            cellContainsValue = true;
                        }
                    });
                } else {
                    // Check cell content if no sub-cells
                    if (cell.textContent.toLowerCase().includes(searchHeader)) {
                        cellContainsValue = true;
                    }
                }

                if (cellContainsValue) {
                    showRow = true;
                }
            });
        }

        row.style.display = showRow ? "" : "none";
       });
    }

    function searchInRange() {
    const startColumnHeader = document.getElementById('startColumnHeader').value.trim();
    const endColumnHeader = document.getElementById('endColumnHeader').value.trim();
    const searchValue = "Available"; // Constant search value

    if (!startColumnHeader || !endColumnHeader) {
        alert("Please enter all required column headers.");
        return;
    }

    // Find column indexes based on column headers
    const headerCells = document.querySelectorAll("#headerRow th");
    let startColumnIndex = -1;
    let endColumnIndex = -1;

    headerCells.forEach((headerCell, index) => {
        const headerText = headerCell.textContent.trim();
        if (headerText === startColumnHeader) {
            startColumnIndex = index;
        }
        if (headerText === endColumnHeader) {
            endColumnIndex = index;
        }
    });

    if (startColumnIndex === -1 || endColumnIndex === -1) {
        alert("Column headers not found.");
        return;
    }

    // Search for rows where all cells in the specified range contain the search value
    const rows = document.querySelectorAll("#dataTable tbody tr");

    rows.forEach(row => {
        const cells = row.querySelectorAll("td");
        let allMatch = true;

        for (let i = startColumnIndex; i <= endColumnIndex; i++) {
            if (i < cells.length) {
                const cell = cells[i];
                const subCells = cell.querySelectorAll('.sub-cell');

                // Check if all sub-cells contain the constant search value
                let cellContainsValue = false;
                subCells.forEach(subCell => {
                    if (subCell.textContent.trim() === searchValue) {
                        cellContainsValue = true;
                    }
                });

                if (!cellContainsValue) {
                    allMatch = false;
                    break;
                }
            }
        }

        // Show or hide rows based on whether all cells in the range contain the value
        row.style.display = allMatch ? "" : "none";
    });
}

function searchInRangeReplace() {
  // Retrieve the input elements from the DOM
  const startColumnHeader = document.getElementById('startColumnHeader');
  const endColumnHeader = document.getElementById('endColumnHeader');
  const newValue = document.getElementById('autoFillValue');
  const newColor = document.getElementById('autoFillColor');
  const tagReferenceSelect = document.getElementById('tagReferenceSelect');

  // Validate if the required input elements are present
  if (!startColumnHeader || !endColumnHeader || !newValue) {
      console.error("Required input elements are missing.");
      return;
  }

  // Retrieve and trim the values from the input elements
  const startColumnHeaderValue = startColumnHeader.value.trim();
  const endColumnHeaderValue = endColumnHeader.value.trim();
  const newValueText = newValue.value.trim();
  const newColorValue = newColor ? newColor.value.trim() : "#ffffff";

  // Retrieve the tag reference if selected
  const tagReferenceText = tagReferenceSelect.value.trim();

  // Validate input values
  if (!startColumnHeaderValue || !endColumnHeaderValue) {
      alert("Please enter both start and end column headers.");
      return;
  }
  if (!newValueText) {
      alert("Please enter a new value.");
      return;
  }

  // Retrieve the column header cells
  const headerCells = document.querySelectorAll("#headerRow th");
  let startColumnIndex = -1;
  let endColumnIndex = -1;

  // Retrieve all rows from the #dataTable body
  const rows = document.querySelectorAll("#dataTable tbody tr");

  // Process each row
  rows.forEach(row => {
      const cells = row.querySelectorAll("td");

      // Ensure there are enough columns
      if (cells.length < 368) {
          console.warn("Not enough columns in the row.");
          return;
      }

      // Check if the tag reference matches the content of the 368th column
      const tagColumn = cells[367]; // 368th column (0-based index 367)
      const tagColumnText = tagColumn.textContent.trim();

      if (tagReferenceText && tagColumnText !== tagReferenceText) {
          return; // Skip this row if tag reference does not match
      }

      // Find start and end column indexes
      headerCells.forEach((headerCell, index) => {
          const headerText = headerCell.textContent.trim();
          if (headerText === startColumnHeaderValue) {
              startColumnIndex = index;
          }
          if (headerText === endColumnHeaderValue) {
              endColumnIndex = index;
          }
      });

      // Validate if the start and end column indexes were found
      if (startColumnIndex === -1 || endColumnIndex === -1) {
          alert("Start or end column header not found.");
          return;
      }

      // Array to store the indices of "Available" sub-cells
      let availableIndices = [];

      for (let i = startColumnIndex; i <= endColumnIndex; i++) {
          if (i < cells.length) {
              const cell = cells[i];
              const subCells = cell.querySelectorAll('.sub-cell');

              // Find index of "Available" in sub-cells of this cell
              let foundIndex = -1;
              subCells.forEach((subCell, index) => {
                  if (subCell.textContent.trim() === "Available") {
                      if (foundIndex === -1) {
                          foundIndex = index; // Set index of the first "Available" found
                      }
                  }
              });

              // If the index was found in this cell, add it to availableIndices
              if (foundIndex !== -1) {
                  availableIndices.push(foundIndex);
              } else {
                  // If any column does not have "Available" at the same index, break
                  availableIndices = [];
                  break;
              }
          }
      }

      // Replace values if all columns within the range had "Available" at the same index
      if (availableIndices.length === (endColumnIndex - startColumnIndex + 1)) {
          const replaceIndex = availableIndices[0]; // Use the first index where "Available" was found

          for (let i = startColumnIndex; i <= endColumnIndex; i++) {
              if (i < cells.length) {
                  const cell = cells[i];
                  const subCells = cell.querySelectorAll('.sub-cell');

                  // Ensure that the replaceIndex is within the range of subCells
                  if (replaceIndex < subCells.length) {
                      const subCell = subCells[replaceIndex];
                      subCell.textContent = newValueText;
                      if (newColorValue) {
                          subCell.style.backgroundColor = newColorValue;
                      }
                  }
              }
          }
      }
  });
}
function exportTableToExcel(filename = 'Avails report.xlsx') {
        // Get the table element
        const table = document.getElementById('dataTable');
        
        // Create a new workbook and add a worksheet
        const workbook = XLSX.utils.table_to_book(table, { sheet: "Sheet1" });
        
        // Write the workbook to a binary string
        const wbout = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
        
        // Create a Blob from the binary string
        const blob = new Blob([wbout], { type: 'application/octet-stream' });
        
        // Create a link element and trigger the download
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = filename;
        link.click();
        
        // Clean up
        URL.revokeObjectURL(link.href);
    }
    
    // Generate the initial headers when the page loads
    document.addEventListener("DOMContentLoaded", generateDateHeaders);
    
  
  
