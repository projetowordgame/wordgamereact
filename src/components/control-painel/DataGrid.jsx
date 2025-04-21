// import React from "react";

// const DataGrid = ({ data }) => {
//   return (
//     <table className="data-grid-panel">
//       <thead>
//         <tr>
//           <th>Nome</th>
//           <th>Email</th>
//         </tr>
//       </thead>
//       <tbody>
//         {data.map((item, idx) => (
//           <tr key={idx}>
//             <td>{item.name}</td>
//             <td>{item.email}</td>
//           </tr>
//         ))}
//       </tbody>
//     </table>
//   );
// };

// export default DataGrid;


import React from "react";

const DataGrid = ({ data, columns }) => {
  return (
    <table className="data-grid-panel">
      <thead>
        <tr>
          {columns.map((col, index) => (
            <th key={index}>{col.header}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((item, idx) => (
          <tr key={idx}>
            {columns.map((col, cidx) => (
              <td key={cidx}>
                {col.render ? col.render(item, idx) : item[col.key]}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default DataGrid;