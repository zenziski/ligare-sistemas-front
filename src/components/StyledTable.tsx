import { Table, TableContainer, Thead, Tbody, Tr, Th, Td } from "@chakra-ui/react";
import React from "react";

interface Column {
  key: string;
  label: string;
  width?: string;
  render?: (row: any) => React.ReactNode;
}

interface StyledTableProps {
  columns: Column[];
  data: any[];
  emptyMessage?: string;
  loading?: boolean;
  rowProps?: (row: any) => object;
}

const StyledTable: React.FC<StyledTableProps> = ({ columns, data, emptyMessage, loading, rowProps }) => {
  return (
    <TableContainer>
      <Table
        variant="simple"
        size="md"
        sx={{
          th: { bg: "gray.50", fontSize: "sm", py: 3 },
          td: { py: 3, fontSize: "sm" },
        }}
      >
        <Thead>
          <Tr>
            {columns.map((col) => (
              <Th key={col.key} width={col.width}>{col.label}</Th>
            ))}
          </Tr>
        </Thead>
        <Tbody>
          {loading ? null : data.length > 0 ? (
            data.map((row, idx) => (
              <Tr key={row._id || idx} {...(rowProps ? rowProps(row) : {})}>
                {columns.map((col) => (
                  <Td key={col.key} width={col.width}>
                    {col.render ? col.render(row) : row[col.key]}
                  </Td>
                ))}
              </Tr>
            ))
          ) : (
            <Tr>
              <Td colSpan={columns.length} textAlign="center" py={16}>
                {emptyMessage || "Nenhum registro encontrado."}
              </Td>
            </Tr>
          )}
        </Tbody>
      </Table>
    </TableContainer>
  );
};

export default StyledTable;
