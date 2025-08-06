import React, { useMemo, useRef, useState, useCallback } from "react";
import { AgGridReact } from "ag-grid-react";

import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";

import employeeData from "../data/employees.json";

const EmployeeDashboard = () => {
  const rowData = employeeData.employees;
  const gridRef = useRef();
  const [searchText, setSearchText] = useState("");

  const columnDefs = useMemo(
    () => [
      { headerName: "ID", field: "id", sortable: true, filter: true },
      {
        headerName: "Name",
        valueGetter: (params) =>
          `${params.data.firstName} ${params.data.lastName}`,
        sortable: true,
        filter: true,
      },
      { headerName: "Email", field: "email", sortable: true, filter: true },
      {
        headerName: "Department",
        field: "department",
        sortable: true,
        filter: true,
      },
      {
        headerName: "Position",
        field: "position",
        sortable: true,
        filter: true,
      },
      { headerName: "Salary", field: "salary", sortable: true, filter: true },
      {
        headerName: "Location",
        field: "location",
        sortable: true,
        filter: true,
      },
      {
        headerName: "Rating",
        field: "performanceRating",
        sortable: true,
        filter: true,
        cellStyle: (params) => ({
          backgroundColor: params.value >= 4.5 ? "#d4edda" : "",
          color: params.value >= 4.5 ? "green" : "",
          fontWeight: params.value >= 4.5 ? "bold" : "normal",
        }),
      },
      {
        headerName: "Projects",
        field: "projectsCompleted",
        sortable: true,
        filter: true,
      },
      {
        headerName: "Active",
        field: "isActive",
        cellRenderer: (params) => (params.value ? "✅" : "❌"),
      },
      { headerName: "Manager", field: "manager" },
      {
        headerName: "Skills",
        field: "skills",
        cellRenderer: (params) => params.value.join(", "),
      },
    ],
    []
  );

  const onQuickFilterChange = useCallback((e) => {
    setSearchText(e.target.value);
    gridRef.current.api.setQuickFilter(e.target.value);
  }, []);

  const onGridReady = useCallback((params) => {
    const allColumnIds = [];
    params.columnApi.getAllColumns().forEach((column) => {
      allColumnIds.push(column.getId());
    });
    params.columnApi.autoSizeColumns(allColumnIds, false);
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h2 style={{ marginBottom: "20px" }}>📊 FactWise Employee Dashboard</h2>
      <div className="ag-theme-alpine" style={{ height: 550, width: "100%" }}>
        <input
          type="text"
          placeholder="🔍 Search employees..."
          value={searchText}
          onChange={onQuickFilterChange}
          style={{
            marginBottom: "10px",
            padding: "6px",
            width: "250px",
            borderRadius: "5px",
            border: "1px solid #ccc",
          }}
        />
        <button
          onClick={() => gridRef.current.api.exportDataAsCsv()}
          style={{
            margin: "0 0 10px 10px",
            padding: "6px 12px",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          📁 Export CSV
        </button>
        <AgGridReact
          ref={gridRef}
          rowData={rowData}
          columnDefs={columnDefs}
          groupDisplayType="groupRows"
          autoGroupColumnDef={{
            headerName: "Employees",
            field: "firstName",
            cellRendererParams: { suppressCount: false },
          }}
          rowGroupPanelShow="always"
          onGridReady={onGridReady}
          defaultColDef={{
            resizable: true,
            sortable: true,
            filter: true,
            tooltipComponentParams: { showDelay: 0 }
          }}
          pagination={true}
          paginationPageSize={10}
        />
      </div>
    </div>
  );
};

export default EmployeeDashboard;
