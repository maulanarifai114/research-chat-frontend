"use client";

import Snackbar, { SnackbarCloseReason } from "@mui/material/Snackbar";
import React, { createContext, useCallback, useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import clsx from "clsx";

export interface SnackbarContextProps {
  start: (message: React.ReactNode, type: "success" | "error", duration?: number) => void;
  complete: () => void;
}

export const SnackbarContext = createContext<SnackbarContextProps | undefined>(undefined);

export const SnackbarProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [message, setMessage] = useState<React.ReactNode | undefined>(undefined);

  const [open, setOpen] = React.useState(false);
  const [duration, setDuration] = useState(3000);
  const [type, setType] = useState<"success" | "error">("error");

  const start = useCallback((message: React.ReactNode, type: "success" | "error", duration?: number) => {
    setType(type);
    if (duration) setDuration(() => duration ?? 3000);
    if (message) setMessage(() => message);
    setOpen(() => true);
  }, []);

  const complete = useCallback(() => {
    setOpen(() => false);
    setDuration(() => 3000);
  }, []);

  const onClose = (event: React.SyntheticEvent | Event, reason?: SnackbarCloseReason) => {
    if (reason === "clickaway") {
      return;
    }
    complete();
  };

  return (
    <SnackbarContext.Provider value={{ start, complete }}>
      <Snackbar open={open} autoHideDuration={duration} onClose={onClose} anchorOrigin={{ vertical: "bottom", horizontal: "right" }}>
        <div className={clsx({ "bg-danger": type === "error", "bg-success": type === "success" }, "rounded-4 text-h6 flex items-center gap-2 px-4 py-3 text-white")}>
          <span className="block">{message}</span> <CloseIcon className="cursor-pointer" onClick={onClose} sx={{ fontSize: 16 }} />
        </div>
      </Snackbar>
      {children}
    </SnackbarContext.Provider>
  );
};
