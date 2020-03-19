import * as EmailValidator from "email-validator";
import React, { useCallback, useEffect, useRef, useState } from "react";
import Draggable from "react-draggable";

import {
  Button,
  IconButton,
  makeStyles,
  Snackbar,
  SnackbarContent,
  TextField,
} from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import SendIcon from "@material-ui/icons/Send";

import { useConnector } from "../contexts/ConnectorContext";
import { useDissmissable } from "../hooks/useDissmissable";
import { useHubspotFeedback } from "../hooks/useHubspotFeedback";

const useStyles = makeStyles(theme => ({
  snackContent: {
    backgroundColor: theme.palette.common.black,
    flexDirection: "column",
    fontSize: 14,
    justifyContent: "center",
    padding: 0,
    color: "rgba(255, 255, 255, 0.72)",
  },
  snackAction: {
    borderTop: "1px solid #E4E4E4",
    margin: "0",
    padding: "6px 16px",
    width: "100%",
    justifyContent: "center",
  },
  snackInnerContent: {
    display: "flex",
    alignItems: "flex-start",
    padding: "6px 16px",
  },
  title: {
    color: "#FFFFFF",
    fontWeight: 600,
    marginBottom: "8px",
  },
  textField: {
    flex: 1,
  },
  input: {
    borderBottom: "1px solid rgba(255, 255, 255, 0.7)",
    color: "#ffffff",
    fontSize: 14,
  },
  emoji: {
    color: "#ffffff",
  },
}));

export default ({ open, onClose }: { open: boolean; onClose: () => void }) => {
  const classes = useStyles();
  const { sendFeedback } = useHubspotFeedback();
  const [mood, setMood] = useState<"Good" | "Bad">();
  const [email, setEmail] = useState<string>();
  const [comment, setComment] = useState<string>();
  const [input, setInput] = useState<string>();
  const [invalidEmail, setInvalidEmail] = useState(false);

  const ref = useRef<HTMLDivElement>();

  const { providerName } = useConnector();

  const close = useCallback(async () => {
    if (mood && email === undefined && comment === undefined) {
      await sendFeedback({ mood, comment, email, wallet: providerName });
    }
    onClose();
  }, [mood, email, comment, onClose, sendFeedback, providerName]);

  const { opacity, ...dissmissableProps } = useDissmissable(ref, close);

  const CloseButton = ({
    onClose = close,
  }: {
    onClose?: () => Promise<void>;
  }) => (
    <IconButton
      size="small"
      aria-label="close"
      color="inherit"
      onClick={onClose}
    >
      <CloseIcon fontSize="small" />
    </IconButton>
  );

  const submitEmail = useCallback(() => {
    if (input) {
      if (EmailValidator.validate(input)) {
        setEmail(input);
        setInput("");
      } else {
        setInvalidEmail(true);
      }
    } else {
      setEmail("");
    }
  }, [input]);

  useEffect(() => {
    if (mood !== undefined && comment !== undefined && email !== undefined) {
      sendFeedback({ mood, comment, email, wallet: providerName });
      const t = setTimeout(onClose, 5000);
      return () => clearTimeout(t);
    }
  }, [mood, email, comment, sendFeedback, providerName, onClose]);

  useEffect(() => {
    const keypressed = (ev: KeyboardEvent) => {
      // CTRL+enter on comment
      if (
        ev.ctrlKey &&
        ev.code === "Enter" &&
        mood !== undefined &&
        comment === undefined
      ) {
        setComment(input);
        setInput("");
      } else if (
        ev.code === "Enter" &&
        comment !== undefined &&
        email === undefined
      ) {
        submitEmail();
      } else if (ev.code === "Escape") {
        close();
      }
    };
    window.addEventListener("keydown", keypressed);
    return () => {
      window.removeEventListener("keydown", keypressed);
    };
  }, [mood, email, comment, input, submitEmail, close]);

  useEffect(() => {
    if (invalidEmail && (!input || EmailValidator.validate(input))) {
      setInvalidEmail(false);
    }
  }, [input, invalidEmail]);

  return (
    <Draggable
      {...dissmissableProps}
      disabled={mood && (email === undefined || comment === undefined)}
    >
      <Snackbar
        ref={ref}
        open={open}
        style={{
          opacity,
        }}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        {!mood ? (
          <SnackbarContent
            classes={{
              root: classes.snackContent,
              action: classes.snackAction,
            }}
            message={
              <div className={classes.snackInnerContent}>
                <div style={{ marginRight: "55px" }}>
                  <div className={classes.title}>Help us improve Request</div>
                  How would you rate your experience?
                </div>
                <CloseButton />
              </div>
            }
            action={
              <>
                <Button onClick={() => setMood("Good")}>
                  <span className={classes.emoji} role="img" aria-label="Good">
                    👍
                  </span>
                </Button>
                <Button onClick={() => setMood("Bad")}>
                  <span className={classes.emoji} role="img" aria-label="Bad">
                    👎
                  </span>
                </Button>
              </>
            }
          />
        ) : comment === undefined ? (
          <SnackbarContent
            message={
              <div className={classes.snackInnerContent}>
                <div>
                  <div className={classes.title}>
                    Any comments to help us improve?
                  </div>
                  <div>
                    <TextField
                      value={input}
                      autoFocus={true}
                      multiline
                      onChange={val => setInput(val.target.value)}
                      className={classes.textField}
                      size="small"
                      InputProps={{
                        className: classes.input,
                        disableUnderline: true,
                      }}
                      placeholder="Enter your comments"
                    />
                    <Button
                      onClick={() => {
                        setComment(input || "");
                        setInput("");
                      }}
                    >
                      <SendIcon style={{ color: "#ffffff" }} />
                    </Button>
                  </div>
                </div>
                <CloseButton />
              </div>
            }
            className={classes.snackContent}
          />
        ) : email === undefined ? (
          <SnackbarContent
            message={
              <div className={classes.snackInnerContent}>
                <div>
                  <div className={classes.title}>
                    May we contact you to learn more?
                  </div>
                  <div>
                    <TextField
                      autoFocus={true}
                      value={input}
                      placeholder="Email address"
                      onChange={val => setInput(val.target.value)}
                      className={classes.textField}
                      InputProps={{
                        className: classes.input,
                        disableUnderline: true,
                      }}
                      size="small"
                      error={invalidEmail}
                      helperText={invalidEmail ? "Invalid email" : undefined}
                    />
                    <Button onClick={submitEmail}>
                      <SendIcon style={{ color: "#ffffff" }} />
                    </Button>
                  </div>
                </div>
                <CloseButton />
              </div>
            }
            className={classes.snackContent}
          />
        ) : (
          <SnackbarContent
            className={classes.snackContent}
            message={
              <div className={classes.snackInnerContent}>
                <div style={{ marginRight: "20px" }} className={classes.title}>
                  Your feedback is really appreciated, thank you!
                </div>
                <CloseButton />
              </div>
            }
          />
        )}
      </Snackbar>
    </Draggable>
  );
};
