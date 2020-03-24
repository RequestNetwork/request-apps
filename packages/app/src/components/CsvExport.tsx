import React from "react";
import { Box, Link, Typography } from "@material-ui/core";
import ArrowDownward from "@material-ui/icons/ArrowDownward";
import { ExportToCsv } from "export-to-csv";
import { IParsedRequest } from "request-shared";

export default ({ requests }: { requests?: IParsedRequest[] }) => {
  const onClick = (ev: React.MouseEvent) => {
    ev.preventDefault();
    if (requests) {
      const csv = new ExportToCsv({
        filename: "requests",
        useKeysAsHeaders: true,
      });
      csv.generateCsv(requests.map(({ raw, ...request }) => request));
    }
  };

  return requests ? (
    <Link
      color="inherit"
      style={{ display: "flex" }}
      href="#"
      onClick={onClick}
    >
      <ArrowDownward />
      <Box width={8} />
      <Typography variant="h4">Export in CSV</Typography>
    </Link>
  ) : (
    <div />
  );
};
