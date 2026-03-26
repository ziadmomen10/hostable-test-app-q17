import React from 'react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface DocTableColumn {
  key: string;
  header: string;
  width?: string;
  align?: 'left' | 'center' | 'right';
}

interface DocTableProps {
  columns?: DocTableColumn[];
  data?: Record<string, React.ReactNode>[];
  // Legacy API support
  headers?: string[];
  rows?: (string | React.ReactNode)[][];
  className?: string;
  striped?: boolean;
  hoverable?: boolean;
  compact?: boolean;
  stickyHeader?: boolean;
}

export const DocTable: React.FC<DocTableProps> = ({
  columns,
  data,
  headers,
  rows,
  className,
  striped = true,
  hoverable = true,
  compact = false,
  stickyHeader = false,
}) => {
  const alignClass = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
  };

  // Support legacy API (headers + rows)
  if (headers && rows) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className={cn(
          "my-8 overflow-x-auto rounded-xl border border-border shadow-sm",
          className
        )}
      >
        <table className="w-full text-sm">
          <thead className={cn(
            "bg-muted/70 border-b border-border",
            stickyHeader && "sticky top-0 z-10"
          )}>
            <tr>
              {headers.map((header, index) => (
                <th
                  key={index}
                  className={cn(
                    "font-semibold text-foreground whitespace-nowrap text-left",
                    compact ? "px-3 py-2" : "px-4 py-3"
                  )}
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {rows.map((row, rowIndex) => (
              <tr
                key={rowIndex}
                className={cn(
                  "transition-colors",
                  striped && rowIndex % 2 === 1 && "bg-muted/20",
                  hoverable && "hover:bg-muted/40"
                )}
              >
                {row.map((cell, cellIndex) => (
                  <td
                    key={cellIndex}
                    className={cn(
                      "text-muted-foreground",
                      compact ? "px-3 py-2" : "px-4 py-3"
                    )}
                  >
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        
        {rows.length === 0 && (
          <div className="py-12 text-center text-muted-foreground">
            No data available
          </div>
        )}
      </motion.div>
    );
  }

  // New API (columns + data)
  if (!columns || !data) {
    return null;
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn(
        "my-8 overflow-x-auto rounded-xl border border-border shadow-sm",
        className
      )}
    >
      <table className="w-full text-sm">
        <thead className={cn(
          "bg-muted/70 border-b border-border",
          stickyHeader && "sticky top-0 z-10"
        )}>
          <tr>
            {columns.map((column) => (
              <th
                key={column.key}
                className={cn(
                  "font-semibold text-foreground whitespace-nowrap",
                  compact ? "px-3 py-2" : "px-4 py-3",
                  alignClass[column.align || 'left']
                )}
                style={{ width: column.width }}
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {data.map((row, rowIndex) => (
            <tr
              key={rowIndex}
              className={cn(
                "transition-colors",
                striped && rowIndex % 2 === 1 && "bg-muted/20",
                hoverable && "hover:bg-muted/40"
              )}
            >
              {columns.map((column) => (
                <td
                  key={column.key}
                  className={cn(
                    "text-muted-foreground",
                    compact ? "px-3 py-2" : "px-4 py-3",
                    alignClass[column.align || 'left']
                  )}
                >
                  {row[column.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      
      {data.length === 0 && (
        <div className="py-12 text-center text-muted-foreground">
          No data available
        </div>
      )}
    </motion.div>
  );
};

export default DocTable;
