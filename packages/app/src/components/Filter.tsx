import React from "react";
import { makeStyles, Typography } from "@material-ui/core";

const useFilterStyles = makeStyles(() => ({
  root: {
    height: 56,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    color: ({ active }) => (active ? "#00CC8E" : "#1A1A1A"),
    borderBottom: ({ active }: { active: boolean }) =>
      `1px solid ${active ? "#00CC8E" : "#C7C7C7"}`,
    cursor: "pointer",
  },
  item: {
    padding: "16px 24px",
  },
}));

export const Filter = ({
  name,
  active,
  select,
}: {
  name: string;
  active: boolean;
  select: () => void;
}) => {
  const classes = useFilterStyles({ active });
  return (
    <div className={classes.root} onClick={select}>
      <Typography className={classes.item} variant="h4">
        {name}
      </Typography>
    </div>
  );
};
