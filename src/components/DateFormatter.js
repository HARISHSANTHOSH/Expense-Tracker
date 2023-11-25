// // DateFormatter.js
// import React from 'react';

// function DateFormatter({ serverDate }) {
//   const formatDate = (serverDate) => {
//     const date = new Date(serverDate);
//     const day = date.getDate().toString().padStart(2, '0');
//     const month = (date.getMonth() + 1).toString().padStart(2, '0');
//     const year = date.getFullYear();
//     const hours = date.getHours().toString().padStart(2, '0');
//     const minutes = date.getMinutes().toString().padStart(2, '0');
//     const seconds = date.getSeconds().toString().padStart(2, '0');

//     return `${month}/${day}/${year} ${hours}:${minutes}:${seconds}`;
//   };

//   return <span>{formatDate(serverDate)}</span>;
// }

// export default DateFormatter;
import React from 'react';

function DateFormatter({ serverDate, editedDate }) {
  const formatDate = (date) => {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');

    return `${month}/${day}/${year} ${hours}:${minutes}:${seconds}`;
  };

  const serverDateObj = new Date(serverDate);
  const editedDateObj = editedDate ? new Date(editedDate) : null;

  return (
    <span>
      {editedDateObj ? (
        <>
          <span style={{ textDecoration: 'line-through', color: 'red' }}>
            {formatDate(serverDateObj)}
          </span>
          <br />
          {formatDate(editedDateObj)}
        </>
      ) : (
        formatDate(serverDateObj)
      )}
    </span>
  );
}

export default DateFormatter;
