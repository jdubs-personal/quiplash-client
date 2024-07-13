import {List, ListItem, Paper} from "@mui/material";
import React, {useEffect, useRef, useState} from "react";
import {card} from "../../styling/styles";
import {useNavigate} from "react-router-dom";
import {Player} from "../../types/types/Player";
import {getSocketConnection, useSocketOnHook} from "../../services/socket";
import TitleImage from "../subcomponents/TitleImage";
import {getBlackOrWhiteFromImageNum, getHexColorFromImageNum} from "../../gamelogic/characterImages";
import {AnimatedChip} from "../../styling/animations";

const socket = getSocketConnection();

const Lobby = () => {
    const [players, setPlayers] = useState<Player[]>([]);
    const navigate = useNavigate();
    const playersRef = useRef(players); // Create a ref to store the latest players state
    const roomCode = localStorage.getItem("roomCode") || "";

    useEffect(() => {
        playersRef.current = players;
        socket.emit("join_specific_room", roomCode);
    }, [players, roomCode]);

    useSocketOnHook(socket, "user_joined", (data) => {
        setPlayers(players.concat([{name: data.username, score: 0, likes: 0, imageNum: data.imageNum}]));
    })

    useSocketOnHook(socket, "start_game", (data) => {
        localStorage.setItem("players", JSON.stringify(playersRef.current));
        navigate('/game/play');
    })

    const displayLobby = () => {
        return (
            <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
                {players.map((player: Player) => (
                    <ListItem key={player.name}>
                        <AnimatedChip
                                      label={player.name}
                                      size="medium"
                                      sx={{color: getBlackOrWhiteFromImageNum(player.imageNum),
                                          backgroundColor: getHexColorFromImageNum(player.imageNum),
                                          fontWeight: "bold"}}
                        />
                    </ListItem>
                ))}
            </List>
        )
    }

    return (
        <Paper elevation={3} style={card}>
            <h1>Lobby</h1>
            <h2>Code: {roomCode}</h2>
            <Paper elevation={3} style={card}>{displayLobby()}</Paper>
            <TitleImage titleName={"lashquip"}/>
        </Paper>
    );
}

export default Lobby;