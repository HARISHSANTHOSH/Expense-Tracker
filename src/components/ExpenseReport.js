

import React, { useState, useEffect, useCallback } from 'react';
// import BarGraph from './BarGraph';
import './ExpenseReport.css';
import NavBar from './NavBar';
import Sidebar from './SideBar';
import getCsrfToken from './CsrfToken.js'
import jsPDF from 'jspdf'; 
import 'jspdf-autotable';
import { getAccessToken } from './authService';
import MonthlyExpenseGraph from './MonthlyExpenseGraph'; 
const downloadPDF = (content) => {
  const link = document.createElement('a');
  link.href = content;
  link.download = 'expense_report.pdf';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

function ExpenseReport() {
  const [reportType, setReportType] = useState('yearly');
  const [selectedMonth, setSelectedMonth] = useState('');
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [totalExpensesByCategory, setTotalExpensesByCategory] = useState({});
  const [showTable, setShowTable] = useState(false);
  const [reportIndicator, setReportIndicator] = useState('Yearly'); 
  // const jwtToken = localStorage.getItem('accessToken');
  const jwtToken= getAccessToken()
  const [csrfToken, setCsrfToken] = useState('');
  console.log(csrfToken)
  useEffect(() => {
    const fetchCsrfToken = async () => {
      const token = await getCsrfToken();
      setCsrfToken(token);
    };

    fetchCsrfToken();
  }, []);
 

  const generateTotalExpenses = useCallback(async () => {
    try {
      let apiUrl = `http://localhost:8000/api/total-expenses-by-category/?year=${selectedYear}`;

      if (reportType === 'monthly' && selectedMonth !== '') {
        const formattedMonth =
          parseInt(selectedMonth) < 10 ? `0${selectedMonth}` : selectedMonth;
        apiUrl += `&month=${formattedMonth}`;
      }

      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${jwtToken}`,
          'X-CSRFToken': csrfToken,
        },
      });

      if (!response.ok) {
      
        throw new Error('Network response was not ok');
      }

      const totalExpensesData = await response.json();
      setTotalExpensesByCategory({ ...totalExpensesData });
      setShowTable(true);
      setReportIndicator(reportType === 'monthly' ? 'Monthly' : 'Yearly');
    
    } catch (error) {
     
      setShowTable(false); 
      console.error(error);
    }
  }, [csrfToken,selectedYear, selectedMonth, jwtToken, reportType, setTotalExpensesByCategory]);
  


  useEffect(() => {
    generateTotalExpenses();
  }, [selectedYear, selectedMonth, jwtToken, reportType, generateTotalExpenses]);

  const handleMonthChange = (e) => {
    setSelectedMonth(e.target.value);
  };

  const handleYearChange = (e) => {
    setSelectedYear(e.target.value);
  };

  const handleDownloadPDF = async () => {
    try {
      const pdfContent = await generatePDFContent();
      downloadPDF(pdfContent);
    } catch (error) {
      console.error('Error generating or downloading PDF:', error);
    }
  };

  const generatePDFContent = async () => {
    try {
      await generateTotalExpenses();
      console.log('totalExpensesByCategory:', totalExpensesByCategory['bar_graph_data']);


      const pdf = new jsPDF();
      pdf.text('Individual Categories Table:', 20, 20);

      let tableData = Object.entries(totalExpensesByCategory['bar_graph_data']).map(
        ([category, amount]) => ({
          category,
          total: amount,
        })
      );
      console.log('tableData:', tableData);

      const totalAmount = calculateTotal();
      tableData.push({
        category: 'Total',
        total: 'Rs ' + totalAmount.toString(),
        isTotal: true,
      });

      pdf.autoTable({
        head: [{ category: 'Category', total: 'Total Expense' }],
        body: tableData.map(({ category, total, isTotal }) => [
          category,
          isTotal
            ? { content: total, styles: { textColor: [0, 0, 255], fontStyle: 'bold' } }
            : total,
        ]),
        didDrawCell: (data) => {
          const lastRowIndex = tableData.length - 1;
          const isTotalColumn = data.column.index === 1;
          const isTotalRow = data.row.index === lastRowIndex;

          if (isTotalRow) {
            if (isTotalColumn) {
              pdf.setTextColor(255, 0, 0);
              pdf.setFont(undefined, 'bold');
            } else {
              pdf.setTextColor(0, 0, 255);
              pdf.setFont(undefined, 'bold');
            }
          } else {
            pdf.setTextColor(0, 0, 0);
            pdf.setFont(undefined, 'normal');
          }
        },
      });

      pdf.setTextColor(0, 0, 0);
      pdf.setFont(undefined, 'normal');

      return pdf.output('datauristring');
    } catch (error) {
      console.error('Error generating PDF content:', error);
      throw error;
    }
  };
  

  const calculateTotal = () => {
    if (totalExpensesByCategory && totalExpensesByCategory['bar_graph_data']) {
      const barGraphData = totalExpensesByCategory['bar_graph_data'];

      if (typeof barGraphData === 'object' && !Array.isArray(barGraphData)) {
        const categoryArray = Object.keys(barGraphData);

        const validTotals = categoryArray
          .map((category) => parseFloat(barGraphData[category] || 0))
          .filter((value) => !isNaN(value));

        const total = validTotals.reduce((acc, value) => acc + value, 0);

        return !isNaN(total) ? total.toFixed(2) : 'N/A';
      }
    }

    return 'N/A';
  };

  return (
    <div>
      <NavBar />
      <Sidebar />

      <div className="expense-report-container">
     
        <div className="fixed-top">
          
          <MonthlyExpenseGraph jwtToken={jwtToken} />
        </div>

        <div className="input-section">
          <div className="report-controls">
            <label>
              <select
                className="select"
                style={{ marginRight: '10px' }}
                value={reportType}
                
                onChange={(e) => {
                  setReportType(e.target.value);
                  setReportIndicator(e.target.value === 'monthly' ? 'Yearly' : 'Monthly');
                }}
              >
                <option value="monthly">Monthly</option>
                <option value="yearly">Yearly</option>
              </select>
            </label>
            {reportType === 'monthly' && (
              <label>
                <select
                  className="select"
                  style={{ marginRight: '10px' }}
                  value={selectedMonth}
                  onChange={handleMonthChange}
                >
                  <option value="">Select Month</option>
                  {[...Array(12).keys()].map((month) => (
                    <option key={month + 1} value={month + 1}>
                      {new Date(selectedYear, month, 1).toLocaleString('en-us', {
                        month: 'long',
                      })}
                    </option>
                  ))}
                </select>
              </label>
            )}
            {reportType === 'yearly' && (
              <label>
                <select
                  className="select"
                  value={selectedYear}
                  onChange={handleYearChange}
                >
                  {[2022, 2023, 2024].map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
              </label>
            )}
            <button className="download-button" onClick={handleDownloadPDF}>
              Download PDF
            </button>
          </div>
        </div>

        <div className="total-expenses-section">
       
        
        <p style={{marginRight:'780px',fontWeight:'500',color:'blue',fontFamily:'serif',fontSize:'19px'}}>{`${reportIndicator} Expenses`}</p>
         {showTable && totalExpensesByCategory && 
          totalExpensesByCategory['bar_graph_data'] &&
          Object.keys(totalExpensesByCategory['bar_graph_data']).length > 0 ? (
            <table>
              <thead>
                <tr>
                  <th>Category</th>
                  <th>Total Expense</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(totalExpensesByCategory['bar_graph_data'])
                  .sort(([categoryA], [categoryB]) => categoryA.localeCompare(categoryB))
                  .map(([category, amount]) => (
                    <tr key={category}>
                      <td>{category}</td>
                      <td>
                        {amount !== null
                          ? `₹ ${parseFloat(amount).toFixed(2)}`
                          : 'N/A'}
                      </td>
                    </tr>
                  ))}
                <tr>
                  <td style={{ fontWeight: 'bold' }}>Total</td>
                  <td style={{ fontWeight: 'bold', color: 'blue' }}>
                    ₹{' '}
                    {calculateTotal() !== 'N/A'
                      ? parseFloat(calculateTotal()).toFixed(2)
                      : 'N/A'}
                  </td>
                </tr>
              </tbody>
            </table>
          ) : (
<p className="error-messag">
  {(selectedYear && !selectedMonth) && 'No data available for the selected year.'}
  {(!selectedYear && selectedMonth) && 'No data available for the selected month.'}
  {(selectedYear && selectedMonth) && 'No data available for the selected year and month.'}
</p>


           )}
          
               
        </div>
     
      
      </div>
    </div>
  );
}

export default ExpenseReport;
