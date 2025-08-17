import React, { useEffect, useRef } from "react";
import { Box, Typography } from "@mui/material";

const ChatBox = ({ messages }) => {
    const endRef = useRef(null);

    useEffect(() => {
        endRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    return (
        <Box

            sx={{
                maxHeight: "530px",
                overflowY: "auto",
                display: "flex",
                flexDirection: "column",
                pr: 1,
                "&::-webkit-scrollbar": {
                    width: "8px",
                },
                "&::-webkit-scrollbar-track": {
                    background: "transparent",
                },
                "&::-webkit-scrollbar-thumb": {
                    background: "rgba(100, 149, 237, 0.5)",
                    borderRadius: "10px",
                    transition: "background 0.3s ease",
                },
                "&::-webkit-scrollbar-thumb:hover": {
                    background: "rgba(100, 149, 237, 0.8)",
                },
                scrollbarWidth: "thin", // Firefox
                scrollbarColor: "rgba(100,149,237,0.5) transparent",

            }}
        >
            {
                messages.map((msg, index) => (
                    <Box
                        key={index}
                        sx={{
                            mb: 1.5,
                            px: 2,
                            py: 1,
                            maxWidth: "75%",
                            alignSelf: msg.sender === "user" ? "flex-end" : "flex-start",
                            background:
                                msg.sender === "user"
                                    ? "linear-gradient(135deg, #d87dbaff, #8fddeeff)"
                                    : "linear-gradient(135deg, #2196f3, #64b5f6)",
                            color: "white",
                            borderRadius:
                                msg.sender === "user"
                                    ? "16px 16px 0 16px"
                                    : "16px 16px 16px 0",
                            boxShadow: 3,
                            fontSize: "0.9rem",
                            whiteSpace: "pre-line",
                        }}
                    >
                        <Typography variant="body2">{msg.text}</Typography>
                    </Box>
                ))
            }
            < div ref={endRef} />
        </Box >
    );
};

export default ChatBox;
